"""Deterministic search, legacy routes and lossless delivery assets for the site."""
from __future__ import annotations

import concurrent.futures
import hashlib
import gzip
import html
import io
import json
import re
import shutil
import tempfile
import urllib.parse
from collections import Counter
from pathlib import Path

IMAGE_SUFFIXES = {'.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.avif'}
PUNCTUATION = re.compile(r'''[\u2000-\u206f\u2e00-\u2e7f\\'!"#$%&()*+,./:;<=>?@\[\]^`{|}~]''')


def plain_text(text):
    text = re.sub(r'<!--[\s\S]*?-->', '', text)
    text = re.sub(r'<(?:script|style)\b[^>]*>[\s\S]*?</(?:script|style)>', '', text, flags=re.I)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'!\[[^\]]*\]\([^\n]*?\)', ' ', text)
    text = re.sub(r'\[([^\]]+)\]\([^\n]*?\)', r'\1', text)
    text = re.sub(r'^\s*```[^\n]*$', '', text, flags=re.M)
    text = text.replace('`', '').replace('**', '').replace('__', '')
    return re.sub(r'\s+', ' ', html.unescape(text)).strip()


def heading_slug(title, counts):
    # Match the pinned Docsify 4.13.1 slugger, including numeric and duplicate headings.
    title = title.replace('{docsify-ignore}', '').replace('{docsify-ignore-all}', '')
    slug = PUNCTUATION.sub('', re.sub(r'<[^>]+>', '', title.strip()).lower())
    slug = re.sub(r'-+', '-', re.sub(r'\s', '-', slug))
    slug = re.sub(r'^(\d)', r'_\1', slug)
    count = counts[slug]
    counts[slug] += 1
    return slug + (f'-{count}' if count else '')


def search_document(path, content):
    counts = Counter()
    sections = []
    current = {'title': path.stem, 'id': '', 'text': ''}
    lines = []
    fence = None

    def finish():
        current['text'] = plain_text('\n'.join(lines))
        if current['text'] or current['title']:
            sections.append(dict(current))
        lines.clear()

    for line in re.sub(r'<!--[\s\S]*?-->', '', content).splitlines():
        marker = re.match(r'^\s*(`{3,}|~{3,})', line)
        if marker:
            if fence is None:
                fence = marker[1][0]
            elif marker[1][0] == fence:
                fence = None
            continue
        heading = re.match(r'^(#{1,6})\s+(.+?)(?:\s+#+)?\s*$', line) if fence is None else None
        if heading:
            finish()
            raw_title = heading[2]
            current = {'title': plain_text(raw_title), 'id': heading_slug(raw_title, counts), 'text': ''}
        elif not re.match(r'^\s*[-*+]\s+\[[^]]+\]\(#[^)]*\)\s*$', line):
            lines.append(line)
    finish()
    return {'path': '/notes/' + path.stem, 'title': path.stem, 'sections': sections}


def write_search_index(dist, paths):
    documents = [search_document(path, path.read_text()) for path in paths]
    data = json.dumps({'version': 1, 'documents': documents}, ensure_ascii=False, separators=(',', ':')).encode()
    name = 'search-index-' + hashlib.sha256(data).hexdigest()[:16] + '.json'
    (dist / name).write_bytes(data)
    return name, {'documents': len(documents), 'sections': sum(len(d['sections']) for d in documents),
                  'bytes': len(data), 'gzipBytes': len(gzip.compress(data, mtime=0))}


def referenced_paths(content):
    content = re.sub(r'```[^\n]*\n[\s\S]*?```|<!--[\s\S]*?-->', '', content)
    for match in re.finditer(r'''\]\((/[^\s)]+)\)|(?:src|href)=["'](/[^"']+)''', content):
        url = match[1] or match[2]
        if url.startswith(('/#', '//')):
            continue
        path = urllib.parse.unquote(urllib.parse.urlsplit(url).path).lstrip('/')
        if path and '..' not in Path(path).parts:
            yield path


def copy_referenced_assets(dist, root, site):
    references = set()
    for doc in dist.rglob('*.md'):
        references.update(referenced_paths(doc.read_text()))
    for relative in sorted(references):
        destination = dist / relative
        if destination.is_file() or Path(str(destination) + '.md').is_file() or destination.suffix == '.md':
            continue
        source = (site if relative.startswith('remote/') else root) / relative
        if not source.is_file():
            raise ValueError(f'Missing published resource: {relative}')
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, destination)


def optimize_images(dist, cache):
    """Add pixel-identical WebP alternatives; retain each referenced original URL."""
    from PIL import Image
    cache.mkdir(parents=True, exist_ok=True)
    candidates = [p for p in dist.rglob('*') if p.suffix.lower() in {'.png', '.jpg', '.jpeg'} and p.stat().st_size >= 4096]

    def convert(path):
        original = path.read_bytes()
        digest = hashlib.sha256(original).hexdigest()
        cached = cache / (digest + '.webp')
        with Image.open(io.BytesIO(original)) as image:
            if getattr(image, 'is_animated', False):
                return None
            rgba = image.convert('RGBA')
            if cached.exists():
                data = cached.read_bytes()
            else:
                stream = io.BytesIO()
                rgba.save(stream, format='WEBP', lossless=True, exact=True, method=4)
                data = stream.getvalue()
            if len(data) >= len(original) * .9:
                return None
            with Image.open(io.BytesIO(data)) as decoded:
                if decoded.convert('RGBA').tobytes() != rgba.tobytes():
                    raise ValueError(f'Lossless image verification failed: {path}')
            if not cached.exists():
                with tempfile.NamedTemporaryFile(dir=cache, delete=False) as temporary:
                    temporary.write(data)
                    temporary_path = Path(temporary.name)
                temporary_path.replace(cached)
            relative = 'optimized/' + digest[:24] + '.webp'
            target = dist / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)
            return '/' + path.relative_to(dist).as_posix(), {
                'path': '/' + relative, 'originalBytes': len(original), 'deliveryBytes': len(data),
                'width': rgba.width, 'height': rgba.height, 'sourceSha256': digest,
                'sha256': hashlib.sha256(data).hexdigest(), 'pixelIdentical': True,
            }

    mapping = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        for result in pool.map(convert, candidates):
            if result:
                mapping[result[0]] = result[1]
    image_pattern = re.compile(r'''(<img\b[^>]*?\bsrc=["'])([^"']+)(["'])|(!\[[^\]]*\]\()([^\s)]+)(\))''', re.I)
    for path in dist.rglob('*.md'):
        def replace(match):
            before, url, after = (match[1], match[2], match[3]) if match[1] else (match[4], match[5], match[6])
            return before + mapping.get(url, {}).get('path', url) + after
        parts = re.split(r'(```[^\n]*\n[\s\S]*?```|<!--[\s\S]*?-->)', path.read_text())
        path.write_text(''.join(part if i % 2 else image_pattern.sub(replace, part) for i, part in enumerate(parts)))
    (dist / 'image-variants.json').write_text(json.dumps(mapping, ensure_ascii=False, indent=2) + '\n')
    return {'converted': len(mapping), 'originalBytes': sum(v['originalBytes'] for v in mapping.values()),
            'deliveryBytes': sum(v['deliveryBytes'] for v in mapping.values()), 'pixelIdentical': True}


def write_manifest(dist, build_info):
    records = []
    for path in sorted(p for p in dist.rglob('*') if p.is_file() and p.name != 'asset-manifest.json'):
        data = path.read_bytes()
        records.append({'path': path.relative_to(dist).as_posix(), 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})
    manifest = {'version': 1, **build_info, 'files': records}
    (dist / 'asset-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    return records

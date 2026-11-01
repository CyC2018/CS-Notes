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


# 代码块和注释：围栏必须在行首（允许缩进），用同样的字符和至少同样的长度结束。
# 不能用不锚定的 ```...```：正文中的行内代码 ```` ```json ```` 会被当成代码块的开头，吞掉后面的图片引用。
VERBATIM = re.compile(r'^[ \t]*(?P<fence>`{3,}|~{3,})[^\n]*\n[\s\S]*?^[ \t]*(?P=fence)[`~]*[ \t]*$|<!--[\s\S]*?-->', re.M)


def split_verbatim(text):
    """按代码块和注释切分：奇数下标是原样保留的部分。"""
    parts, last = [], 0
    for match in VERBATIM.finditer(text):
        parts += [text[last:match.start()], match[0]]
        last = match.end()
    return parts + [text[last:]]


def plain_text(text):
    text = re.sub(r'<!--[\s\S]*?-->', '', text)
    text = re.sub(r'<(?:script|style)\b[^>]*>[\s\S]*?</(?:script|style)>', '', text, flags=re.I)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'!\[[^\]]*\]\([^\n]*?\)', ' ', text)
    text = re.sub(r'\[([^\]]+)\]\([^\n]*?\)', r'\1', text)
    text = re.sub(r'^\s*```[^\n]*$', '', text, flags=re.M)
    text = text.replace('`', '').replace('**', '').replace('__', '')
    return re.sub(r'\s+', ' ', html.unescape(text)).strip()


def marked_inline(title):
    # Docsify slugs the HTML that marked renders for the heading: backslash escapes are
    # resolved, code spans and link text are kept, and text is HTML-escaped, so a quote
    # becomes &quot; and leaves "quot" in the slug.
    def escape(text):
        text = re.sub(r'&(?!#?\w+;)', '&amp;', text)
        return text.replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;').replace("'", '&#39;')
    out = []
    for part in re.split(r'(`+[^`]*`+|<\/?[A-Za-z][^>]*>)', title):
        if part.startswith('`'):
            out.append(escape(part.strip('`')))
        elif part.startswith('<'):
            out.append(part)
        else:
            part = re.sub(r'!?\[([^\]]*)\]\([^)]*\)', r'\1', part)
            part = re.sub(r'\\([!-/:-@\[-`{-~])', r'\1', part)
            out.append(escape(part.replace('**', '').replace('__', '')))
    return ''.join(out)


def heading_slug(title, counts):
    # Match the pinned Docsify 4.13.1 slugger, including numeric and duplicate headings.
    title = title.replace('{docsify-ignore}', '').replace('{docsify-ignore-all}', '')
    title = marked_inline(title)
    slug = PUNCTUATION.sub('', re.sub(r'<[^>]+>', '', title.strip()).lower())
    slug = re.sub(r'-+', '-', re.sub(r'\s', '-', slug))
    slug = re.sub(r'^(\d)', r'_\1', slug)
    count = counts[slug]
    counts[slug] += 1
    return slug + (f'-{count}' if count else '')


def write_animations(dist):
    """把 anim.py 生成的步骤动图（GIF 注释为 CS-Notes step animation）拆成逐帧的无损 WebP。
    GitHub 上直接播放 GIF；网站上用同一组帧做成可以暂停、逐步查看的播放器，返回 {GIF 路径: 帧、时长、尺寸}。"""
    from PIL import Image, ImageSequence
    result = {}
    for gif in sorted(dist.rglob('*.gif')):
        with Image.open(gif) as image:
            if image.info.get('comment') != b'CS-Notes step animation' or getattr(image, 'n_frames', 1) < 2:
                continue
            folder = dist / 'anim' / hashlib.sha256(gif.read_bytes()).hexdigest()[:16]
            folder.mkdir(parents=True, exist_ok=True)
            frames, durations = [], []
            for i, frame in enumerate(ImageSequence.Iterator(image)):
                durations.append(frame.info.get('duration', 2000))
                target = folder / f'{i}.webp'
                frame.convert('RGB').save(target, format='WEBP', lossless=True, method=4)
                frames.append('/' + target.relative_to(dist).as_posix())
            result['/' + gif.relative_to(dist).as_posix()] = {
                'frames': frames, 'durations': durations, 'width': image.width, 'height': image.height}
    return result


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
        elif not re.match(r'^\s*[-*+]\s+\[[^]]+\]\(#[^)]*\)\s*(?:<span class="hot[^"]*"></span>)?\s*$', line):
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
    content = VERBATIM.sub('', content)
    for match in re.finditer(r'''\]\((/[^\s)]+)\)|(?:src|href)=["'](/[^"']+)''', content):
        url = match[1] or match[2]
        if url.startswith(('/#', '//')):
            continue
        path = urllib.parse.unquote(urllib.parse.urlsplit(url).path).lstrip('/')
        if path and '..' not in Path(path).parts:
            yield path


def copy_referenced_assets(dist, root):
    references = set()
    for doc in dist.rglob('*.md'):
        references.update(referenced_paths(doc.read_text()))
    for relative in sorted(references):
        destination = dist / relative
        # 目录链接（例如 /learn/）由目录下的 index.html 提供
        if destination.is_file() or (destination / 'index.html').is_file() or Path(str(destination) + '.md').is_file() or destination.suffix == '.md':
            continue
        source = root / relative
        if not source.resolve().is_relative_to(root.resolve()) or not source.is_file():
            raise ValueError(f'Missing published resource: {relative}')
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, destination)


def optimize_images(dist, cache):
    """Add pixel-identical WebP alternatives; retain each referenced original URL."""
    from PIL import Image, __version__ as pillow_version
    cache = cache / pillow_version
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
        parts = split_verbatim(path.read_text())
        path.write_text(''.join(part if i % 2 else image_pattern.sub(replace, part) for i, part in enumerate(parts)))
    (dist / 'image-variants.json').write_text(json.dumps(mapping, ensure_ascii=False, indent=2, sort_keys=True) + '\n')
    return {'converted': len(mapping), 'originalBytes': sum(v['originalBytes'] for v in mapping.values()),
            'deliveryBytes': sum(v['deliveryBytes'] for v in mapping.values()), 'pixelIdentical': True}


def add_image_sizes(dist):
    """给站内图片补上 height（按 width 和原图比例计算），浏览器在图片加载前就能留出位置，跳转到小节时不会被延迟加载的图片推开。"""
    from PIL import Image
    tag = re.compile(r'<img\b[^>]*>', re.I)
    sizes, added = {}, 0

    def size(url):
        path = dist / urllib.parse.unquote(urllib.parse.urlsplit(url).path).lstrip('/')
        if url not in sizes:
            try:
                with Image.open(path) as image:
                    sizes[url] = image.size
            except (OSError, ValueError):
                sizes[url] = None
        return sizes[url]

    def replace(match):
        nonlocal added
        img = match[0]
        if re.search(r'\bheight\s*=', img, re.I):
            return img
        src = re.search(r'\bsrc=["\']([^"\']+)["\']', img, re.I)
        if not src or not src[1].startswith('/') or src[1].startswith('//'):
            return img
        dimensions = size(html.unescape(src[1]))
        if not dimensions or not dimensions[0]:
            return img
        width = re.search(r'\bwidth=["\']?(\d+(?:\.\d+)?)(?:px)?["\']?', img, re.I)
        shown = float(width[1]) if width else dimensions[0]
        height = round(shown * dimensions[1] / dimensions[0])
        attributes = f' height="{height}"' if width else f' width="{dimensions[0]}" height="{dimensions[1]}"'
        added += 1
        return re.sub(r'\s*/?>$', lambda end: attributes + end[0], img, count=1)

    for path in dist.rglob('*.md'):
        parts = split_verbatim(path.read_text())
        text = ''.join(part if i % 2 else tag.sub(replace, part) for i, part in enumerate(parts))
        path.write_text(text)
    return added


def write_manifest(dist, build_info):
    records = []
    for path in sorted(p for p in dist.rglob('*') if p.is_file() and p.name != 'asset-manifest.json'):
        data = path.read_bytes()
        records.append({'path': path.relative_to(dist).as_posix(), 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})
    manifest = {'version': 1, **build_info, 'files': records}
    (dist / 'asset-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    return records

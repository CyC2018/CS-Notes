#!/usr/bin/env python3
"""Build the standalone CS-Notes website from the published Markdown source."""
from __future__ import annotations

import argparse
import concurrent.futures
import hashlib
import html
import json
import mimetypes
import posixpath
import re
import shutil
import ssl
import subprocess
import tempfile
import time
import urllib.parse
import urllib.request
from pathlib import Path

from site_assets import copy_referenced_assets, optimize_images, write_manifest, write_search_index

try:
    import certifi
    TLS = ssl.create_default_context(cafile=certifi.where())
except ImportError:
    TLS = ssl.create_default_context()

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'website'
DIST = ROOT / 'dist'
ASSET_MAP = SITE / 'remote-assets.json'
UA = 'CS-Notes website recovery/1.0'
IMAGE = re.compile(r'(<img\b[^>]*?\bsrc=["\'])([^"\']+)(["\'])', re.I)
MD_IMAGE = re.compile(r'(!\[[^\]]*\]\()((?:[^()\s]|\([^()\n]*\))*)(\))')
MD_LINK = re.compile(r'(?<!!)\[([^\]]+)\]\(([^\s)]+)\)')
HTML_LINK = re.compile(r'(<a\b[^>]*?\bhref=["\'])([^"\']+)(["\'])', re.I)


def sources():
    return [ROOT / 'README.md', ROOT / 'CONTRIBUTING.md',
            *sorted((ROOT / 'notes').glob('*.md')),
            *sorted((ROOT / 'assets').glob('*.md'))]


def image_urls():
    found = set()
    for path in sources():
        text = re.sub(r'```[^\n]*\n[\s\S]*?```|<!--[\s\S]*?-->', '', path.read_text())
        for pattern in (IMAGE, MD_IMAGE):
            for match in pattern.finditer(text):
                url = html.unescape(match[2].strip())
                if url.startswith(('https://', 'http://')):
                    found.add(url)
    return sorted(found)


def download_asset(url):
    """Keep only bytes retrieved successfully; never turn an error into an image."""
    parsed = urllib.parse.urlsplit(url)
    key = hashlib.sha256(url.encode()).hexdigest()[:20]
    existing = list((SITE / 'remote').glob(key + '.*'))
    if existing:
        data = existing[0].read_bytes()
        return url, {'path': str(existing[0].relative_to(SITE)), 'bytes': len(data),
                     'sha256': hashlib.sha256(data).hexdigest()}
    request_url = urllib.parse.urlunsplit((parsed.scheme, parsed.netloc,
        urllib.parse.quote(urllib.parse.unquote(parsed.path), safe='/%:@-._~!$&()*+,;='),
        parsed.query, ''))
    last_error = ''
    for attempt in range(3):
        try:
            request = urllib.request.Request(request_url, headers={'User-Agent': UA})
            with urllib.request.urlopen(request, timeout=25, context=TLS) as response:
                data = response.read()
                content_type = response.headers.get_content_type()
            if not data or not (content_type.startswith('image/') or data[:4] in (b'\x89PNG', b'GIF8')):
                raise ValueError(f'Not an image: {content_type}')
            ext = Path(parsed.path).suffix.lower()
            if ext not in ('.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico', '.avif'):
                ext = mimetypes.guess_extension(content_type) or '.img'
            destination = SITE / 'remote' / (key + ext)
            destination.write_bytes(data)
            return url, {'path': str(destination.relative_to(SITE)), 'bytes': len(data),
                         'sha256': hashlib.sha256(data).hexdigest()}
        except Exception as error:
            last_error = str(error)
            if attempt < 2:
                time.sleep(attempt + 1)
    return url, {'error': last_error}


def mirror_assets():
    (SITE / 'remote').mkdir(parents=True, exist_ok=True)
    urls = image_urls()
    previous = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
        for count, (url, record) in enumerate(pool.map(download_asset, urls), 1):
            previous[url] = record
            if count % 40 == 0 or count == len(urls):
                print(f'Assets: {count}/{len(urls)}', flush=True)
    ASSET_MAP.write_text(json.dumps(previous, ensure_ascii=False, indent=2) + '\n')
    errors = {url: item['error'] for url, item in previous.items() if 'error' in item}
    print(json.dumps({'mirrored': len(previous)-len(errors), 'failedCount': len(errors)}, ensure_ascii=False))


def local_target(url, source, html_link=False):
    url = html.unescape(url)
    parsed = urllib.parse.urlsplit(url)
    path = urllib.parse.unquote(parsed.path)
    if parsed.netloc.lower() in ('github.com', 'www.github.com'):
        prefix = '/CyC2018/CS-Notes/blob/master/'
        if path.startswith(prefix):
            path = path[len(prefix):]
        else:
            return url
    elif parsed.netloc:
        return url
    elif not path or url.startswith(('#', 'mailto:', 'data:', '//')):
        return url
    elif not path.startswith('/'):
        path = posixpath.normpath(str(source.relative_to(ROOT).parent / path))
    path = path.lstrip('/')
    if not (ROOT / path).is_file():
        return url
    if path.endswith('.md'):
        if not html_link:
            result = '/' + urllib.parse.quote(path, safe='/')
            if parsed.fragment:
                result += '#' + urllib.parse.quote(urllib.parse.unquote(parsed.fragment), safe='')
            return result
        if path == 'README.md':
            route = '/'
        else:
            route = '/' + urllib.parse.quote(path[:-3], safe='/')
        if parsed.fragment:
            route += '?id=' + urllib.parse.quote(urllib.parse.unquote(parsed.fragment), safe='')
        return '/#' + route
    return '/' + urllib.parse.quote(path, safe='/')


def render_markdown(path, assets):
    content = path.read_text()
    def image(match):
        url = html.unescape(match[2].strip())
        if url in assets and 'path' in assets[url]:
            url = '/' + assets[url]['path']
        elif not url.startswith(('https:', 'http:', 'data:', '//')):
            url = local_target(url, path)
        return match[1] + url + match[3]
    def convert(part):
        part = IMAGE.sub(image, part)
        part = MD_IMAGE.sub(image, part)
        part = MD_LINK.sub(lambda m: f'[{m[1]}]({local_target(m[2], path)})', part)
        return HTML_LINK.sub(lambda m: m[1] + local_target(m[2], path, html_link=True) + m[3], part)
    parts = re.split(r'(```[^\n]*\n[\s\S]*?```|<!--[\s\S]*?-->)', content)
    return ''.join(part if i % 2 else convert(part) for i, part in enumerate(parts))


def build(optimize=True):
    assets = json.loads(ASSET_MAP.read_text()) if ASSET_MAP.exists() else {}
    unmirrored = [u for u in image_urls() if u not in assets or 'path' not in assets[u]]
    if unmirrored:
        raise ValueError(f'{len(unmirrored)} images need mirroring; run with --mirror')
    with tempfile.TemporaryDirectory(prefix='.site-build-', dir=ROOT) as temporary:
        dist = Path(temporary) / 'dist'
        dist.mkdir()
        shutil.copytree(SITE / 'vendor', dist / 'vendor')
        for name in ('index.html', 'site.css', 'site.js', 'search.js'):
            shutil.copyfile(SITE / name, dist / name)
        for path in sources():
            target = dist / path.relative_to(ROOT)
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(render_markdown(path, assets))
        homepage = (dist / 'README.md').read_text()
        emojis = {'pencil2': '✏️', 'computer': '💻', 'cloud': '☁️', 'floppy_disk': '💾',
                  'coffee': '☕', 'bulb': '💡', 'art': '🎨', 'wrench': '🔧',
                  'watermelon': '🍉', 'memo': '📝'}
        for name, symbol in emojis.items():
            homepage = re.sub(r'^(## ):' + name + r':\s*', r'\1', homepage, flags=re.M)
            homepage = homepage.replace('#' + name + '-', '#')
            homepage = homepage.replace(':' + name + ':', symbol)
        topics = [('算法', '✏️'), ('操作系统', '💻'), ('网络', '☁️'), ('面向对象', '🎨'),
                  ('数据库', '💾'), ('Java', '☕'), ('系统设计', '💡'), ('工具', '🔧'),
                  ('编码实践', '🍉'), ('后记', '📝')]
        cards = '<nav class="topic-grid" aria-label="笔记分类">' + ''.join(
            f'<a href="/#/?id={urllib.parse.quote(label.lower())}"><span aria-hidden="true">{symbol}</span>{label}</a>'
            for label, symbol in topics) + '</nav>'
        homepage = re.sub(r'^\| 算法[^\n]*\n\|[^\n]*\n\|[^\n]*', cards, homepage, count=1, flags=re.M)
        homepage = homepage.replace('width="200px"', 'class="site-logo" width="200px"', 1)
        (dist / 'README.md').write_text('# CS-Notes\n\n' + homepage)
        note_paths = ['/' + str(p.relative_to(ROOT).with_suffix('')) for p in sorted((ROOT / 'notes').glob('*.md'))]
        sidebar = ['- [首页](/)', '- [面试高频问题](/notes/面试高频问题)', '']
        for line in homepage.splitlines():
            if line.startswith('## '):
                label = re.sub(r':[a-z0-9_]+:', '', line[3:]).strip()
                if label == '后记':
                    break
                sidebar.extend(['', '- **' + label + '**'])
            elif line.startswith('- ['):
                sidebar.append('  ' + line)
        (dist / '_sidebar.md').write_text('\n'.join(sidebar) + '\n')
        (dist / '_404.md').write_text('# 页面暂未找到\n\n请从目录或搜索查找笔记。\n\n[返回首页](/)\n')
        (dist / '.nojekyll').touch()
        shutil.copyfile(ROOT / 'docs/_media/LogoMakr_1J56bI.png', dist / 'favicon.png')
        copy_referenced_assets(dist, ROOT, SITE)
        image_report = optimize_images(dist, ROOT / '.cache/site-assets') if optimize else {'converted': 0}
        index_name, search_report = write_search_index(dist, sorted((dist / 'notes').glob('*.md')))
        legacy = json.loads((SITE / 'legacy-routes.json').read_text())
        (dist / 'search-paths.js').write_text(
            'window.CS_NOTES_PATHS = ' + json.dumps(note_paths, ensure_ascii=False) + ';\n'
            'window.CS_NOTES_LEGACY_ROUTES = ' + json.dumps(legacy, ensure_ascii=False, separators=(',', ':')) + ';\n'
            'window.CS_NOTES_SEARCH_INDEX = "/' + index_name + '";\n')
        generator = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip()
        content_commit = subprocess.check_output(['git', 'merge-base', 'HEAD', 'origin/master'], cwd=ROOT, text=True).strip()
        build_info = {'sourceCommit': content_commit, 'generatorCommit': generator, 'notes': len(note_paths),
                      'searchIndex': index_name, 'legacyRoutes': len(legacy)}
        (dist / 'build-info.json').write_text(json.dumps(build_info, indent=2) + '\n')
        entry = (dist / 'index.html').read_text()
        for name in ('site.css', 'site.js', 'search.js', 'search-paths.js'):
            digest = hashlib.sha256((dist / name).read_bytes()).hexdigest()[:12]
            entry = entry.replace('/' + name + '"', '/' + name + '?v=' + digest + '"')
        (dist / 'index.html').write_text(entry)
        write_manifest(dist, build_info)
        files = [p for p in dist.rglob('*') if p.is_file()]
        report = {'notes': len(note_paths), 'files': len(files), 'bytes': sum(p.stat().st_size for p in files),
                  'oversized': [str(p.relative_to(dist)) for p in files if p.stat().st_size > 25*1024*1024],
                  'unmirrored': [], 'search': search_report, 'images': image_report, 'legacyRoutes': len(legacy)}
        if report['oversized'] or len(files) > 20000:
            raise ValueError('Static hosting quota exceeded')
        previous = Path(temporary) / 'previous'
        if DIST.exists():
            DIST.rename(previous)
        try:
            dist.rename(DIST)
        except BaseException:
            if previous.exists():
                previous.rename(DIST)
            raise
    (SITE / 'build-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--mirror', action='store_true')
    parser.add_argument('--no-optimize-images', action='store_true', help='Skip optional Pillow/WebP delivery variants')
    args = parser.parse_args()
    if args.mirror:
        mirror_assets()
    build(optimize=not args.no_optimize_images)

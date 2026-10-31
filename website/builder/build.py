#!/usr/bin/env python3
"""Build the standalone CS-Notes website from the published Markdown source."""
from __future__ import annotations

import argparse
import hashlib
import html
import json
import os
import posixpath
import re
import shutil
import subprocess
import sys
import tempfile
import unicodedata
import urllib.parse
from collections import Counter
from pathlib import Path

from site_assets import copy_referenced_assets, heading_slug, optimize_images, write_animations, write_manifest, write_search_index
from check import check

BASE = Path(__file__).resolve().parents[1]
ROOT = BASE / 'upstream'
SITE = BASE / 'templates'
DIST = BASE / 'dist'
CACHE = BASE / '.cache/site-assets'
VERSION_FILE = BASE / 'source-version.json'
SOURCE_COMMIT = json.loads(VERSION_FILE.read_text())['commit'] if VERSION_FILE.is_file() else 'unknown'
IMAGE_BY_NAME = {}
ANCHORS = {}
SOURCE_IMAGE_HOST = 'cs-notes-1256109796.cos.ap-guangzhou.myqcloud.com'
# 学习站与笔记网站一起构建，放在 /learn/ 下；题目链接指向同一域名下的笔记
LEARN_BUILD = BASE.parent / 'learn' / 'build.py'
SITE_URL = 'https://cyc2018.xyz/'
IMAGE = re.compile(r'(<img\b[^>]*?\bsrc=["\'])([^"\']+)(["\'])', re.I)
MD_IMAGE = re.compile(r'(!\[[^\]]*\]\()((?:[^()\s]|\([^()\n]*\))*)(\))')
MD_LINK = re.compile(r'(?<!!)\[((?:[^\[\]\n]|\[[^\[\]\n]*\])+)\]\(([^\s)]+)\)')
# A fence closes only with the same character and at least the same length, so ``` inside a ```` block stays code.
VERBATIM = re.compile(r'^(?P<fence>`{3,}|~{3,})[^\n]*\n[\s\S]*?^(?P=fence)[`~]*[ \t]*$|<!--[\s\S]*?-->', re.M)
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


def repository_images():
    result = {}
    for directory in ('notes/pics', 'assets', 'docs/_media'):
        for path in (ROOT / directory).rglob('*'):
            if path.is_file():
                result.setdefault(path.name, []).append(path)
    return result


# 高频标记：正文标题末尾是“不换行空格 + 🔥 或 🔥🔥”，目录行末尾是“ 🔥”或“ 🔥🔥”。GitHub 生成锚点时会删掉标题中的标记，锚点不变。
# 网站上换成空的 <span class="hot hot-1|2">，由 site.js 画出小火焰；标题中不留空格，Docsify 生成的 id 与不加标记时相同。
HOT_HEADING = re.compile(r'^(#{1,6} .*?)\u00a0(🔥{1,2})[ \t]*$', re.M)
HOT_TOC = re.compile(r'^(\s*[-*] \[[^\]]+\]\(#[^)]*\)) (🔥{1,2})[ \t]*$', re.M)


def strip_hot(text):
    return HOT_HEADING.sub(r'\1', text)


def hot_spans(text):
    span = lambda m: f'{m[1]}<span class="hot hot-{len(m[2])}"></span>'
    return HOT_TOC.sub(lambda m: f'{m[1]} <span class="hot hot-{len(m[2])}"></span>', HOT_HEADING.sub(span, text))


def github_slug(text):
    text = re.sub(r'<[^>]+>', '', text).strip().lower().replace('\\', '')
    return ''.join(c for c in text if c in ' -_' or unicodedata.category(c)[0] in 'LN'
                   or unicodedata.category(c) == 'Mn').replace(' ', '-')


def anchor_map(path):
    """Map GitHub heading anchors to the ids Docsify gives the same headings."""
    result, github, docsify, fence = {}, Counter(), Counter(), None
    for line in re.sub(r'<!--[\s\S]*?-->', '', strip_hot(path.read_text())).splitlines():
        marker = re.match(r'^\s*(`{3,}|~{3,})', line)
        if marker:
            fence = marker[1][0] if fence is None else (None if marker[1][0] == fence else fence)
            continue
        heading = re.match(r'^(#{1,6})\s+(.+?)(?:\s+#+)?\s*$', line) if fence is None else None
        if heading:
            slug = github_slug(heading[2])
            count = github[slug]
            github[slug] += 1
            result.setdefault(slug + (f'-{count}' if count else ''), heading_slug(heading[2], docsify))
    return result


def site_anchor(path, fragment):
    fragment = urllib.parse.unquote(fragment)
    return ANCHORS.get(path, {}).get(fragment, fragment)


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
    elif parsed.hostname == SOURCE_IMAGE_HOST:
        candidates = IMAGE_BY_NAME.get(Path(path).name, [])
        if len(candidates) != 1:
            return url
        path = candidates[0].relative_to(ROOT).as_posix()
    elif parsed.netloc:
        return url
    elif not path and url.startswith('#') and len(url) > 1:
        return '#' + site_anchor(source.relative_to(ROOT).as_posix(), url[1:])
    elif not path or url.startswith(('#', 'mailto:', 'data:', '//')):
        return url
    elif not path.startswith('/'):
        path = posixpath.normpath(str(source.relative_to(ROOT).parent / path))
    path = path.lstrip('/')
    if not (ROOT / path).resolve().is_relative_to(ROOT.resolve()) or not (ROOT / path).is_file():
        return url
    if path.endswith('.md'):
        if not html_link:
            result = '/' + urllib.parse.quote(path, safe='/')
            if parsed.fragment:
                result += '#' + urllib.parse.quote(site_anchor(path, parsed.fragment), safe='')
            return result
        if path == 'README.md':
            route = '/'
        else:
            route = '/' + urllib.parse.quote(path[:-3], safe='/')
        if parsed.fragment:
            route += '?id=' + urllib.parse.quote(site_anchor(path, parsed.fragment), safe='')
        return '/#' + route
    return '/' + urllib.parse.quote(path, safe='/')


def render_markdown(path):
    content = hot_spans(path.read_text())
    def image(match):
        url = html.unescape(match[2].strip())
        parsed = urllib.parse.urlsplit(url)
        if parsed.path and not parsed.scheme and not parsed.netloc:
            candidate = (ROOT / urllib.parse.unquote(parsed.path).lstrip('/')) if parsed.path.startswith('/') else (path.parent / urllib.parse.unquote(parsed.path))
            if not candidate.resolve().is_relative_to(ROOT.resolve()) or not candidate.is_file():
                raise ValueError('Missing source image: ' + parsed.path)
        url = local_target(url, path)
        return match[1] + url + match[3]
    def convert(part):
        part = IMAGE.sub(image, part)
        part = MD_IMAGE.sub(image, part)
        part = MD_LINK.sub(lambda m: f'[{m[1]}]({local_target(m[2], path)})', part)
        return HTML_LINK.sub(lambda m: m[1] + local_target(m[2], path, html_link=True) + m[3], part)
    result, last = [], 0
    for match in VERBATIM.finditer(content):
        result += [convert(content[last:match.start()]), match[0]]
        last = match.end()
    return ''.join(result + [convert(content[last:])])


def build(optimize=True):
    global IMAGE_BY_NAME, ANCHORS
    IMAGE_BY_NAME = repository_images()
    ANCHORS = {p.relative_to(ROOT).as_posix(): anchor_map(p) for p in sources()}
    external = image_urls()
    replacements = {url: local_target(url, ROOT / 'README.md') for url in external}
    reused = {url: path for url, path in replacements.items() if path.startswith('/')}
    unchanged_external = [url for url, path in replacements.items() if not path.startswith('/')]
    with tempfile.TemporaryDirectory(prefix='.site-build-', dir=DIST.parent) as temporary:
        dist = Path(temporary) / 'dist'
        dist.mkdir()
        shutil.copytree(SITE / 'vendor', dist / 'vendor')
        for name in ('index.html', 'site.css', 'site.js', 'search.js'):
            shutil.copyfile(SITE / name, dist / name)
        for path in sources():
            target = dist / path.relative_to(ROOT)
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(render_markdown(path))
        homepage = (dist / 'README.md').read_text()
        emojis = {'rocket': '🚀', 'pencil2': '✏️', 'computer': '💻', 'cloud': '☁️', 'floppy_disk': '💾',
                  'coffee': '☕', 'bulb': '💡', 'art': '🎨', 'wrench': '🔧',
                  'watermelon': '🍉', 'memo': '📝'}
        for name, symbol in emojis.items():
            homepage = re.sub(r'^(## ):' + name + r':\s*', r'\1', homepage, flags=re.M)
            homepage = homepage.replace('#' + name + '-', '#')
            homepage = homepage.replace(':' + name + ':', symbol)
        topics = [('学习路线', '🚀'), ('算法', '✏️'), ('操作系统', '💻'), ('网络', '☁️'), ('面向对象', '🎨'),
                  ('数据库', '💾'), ('Java', '☕'), ('系统设计', '💡'), ('工具', '🔧'),
                  ('后记', '📝')]
        cards = '<nav class="topic-grid" aria-label="笔记分类">' + ''.join(
            f'<a href="/#/?id={urllib.parse.quote(label.lower())}"><span aria-hidden="true">{symbol}</span>{label}</a>'
            for label, symbol in topics) + '</nav>'
        homepage = re.sub(r'^\| (?:学习路线|算法)[^\n]*\n\|[^\n]*\n\|[^\n]*', cards, homepage, count=1, flags=re.M)
        homepage = homepage.replace('width="200px"', 'class="site-logo" width="200px"', 1)
        if LEARN_BUILD.is_file():
            banner = ('<a class="learn-banner" href="/learn/"><span class="learn-banner-text"><b>按计划学习</b>'
                      '<span>先用面试真题自评定级，跳过已经掌握的内容，按天学、按间隔复习，记到面试那天</span></span>'
                      '<span class="learn-banner-go">开始</span></a>')
            homepage = homepage.replace(cards, banner + cards, 1)
        (dist / 'README.md').write_text('# CS-Notes\n\n' + homepage)
        note_paths = ['/' + str(p.relative_to(ROOT).with_suffix('')) for p in sorted((ROOT / 'notes').glob('*.md'))]
        sidebar = ['- [首页](/)', *(["- [学习站：定级与每日计划](/learn/ ':ignore')"] if LEARN_BUILD.is_file() else []), '']
        for line in homepage.splitlines():
            if line.startswith('## '):
                label = re.sub(r':[a-z0-9_]+:', '', line[3:]).strip()
                if label == '后记':
                    break
                sidebar.extend(['', '- **' + label + '**'])
            elif line.startswith('- ['):
                sidebar.append('  ' + re.match(r'- \[[^\]]+\]\([^)]+\)', line).group(0))
        (dist / '_sidebar.md').write_text('\n'.join(sidebar) + '\n')
        (dist / '_404.md').write_text('# 页面暂未找到\n\n请从目录或搜索查找笔记。\n\n[返回首页](/)\n')
        (dist / '.nojekyll').touch()
        shutil.copyfile(ROOT / 'docs/_media/LogoMakr_1J56bI.png', dist / 'favicon.png')
        learn_report = None
        if LEARN_BUILD.is_file():
            # 学习站的问题（链接到的小节改名、题目和要点对不上）只给警告，不挡住笔记的发布；警告写进构建报告
            result = subprocess.run([sys.executable, str(LEARN_BUILD), '--source', str(ROOT), '--output', str(dist / 'learn'),
                                     '--notes-base', '/#/notes/', '--site-url', SITE_URL + 'learn/', '--lenient'],
                                    check=True, capture_output=True, text=True)
            learn_report = json.loads(result.stdout.strip().splitlines()[-1])
            # 在 GitHub Actions 中输出为警告注释，显示在运行结果的摘要里
            prefix = '::warning::' if os.environ.get('GITHUB_ACTIONS') else ''
            for warning in learn_report['warnings']:
                print(prefix + '学习站：' + warning, file=sys.stderr)
            if learn_report['pending']:
                print(prefix + '学习站：内容与 learn/content.lock.json 不一致，请在本机运行 python3 learn/maintain.py 查看并写入：'
                      + json.dumps(learn_report['pending'], ensure_ascii=False), file=sys.stderr)
        learn_topics = {}
        if learn_report is not None:
            # 每篇笔记在学习站中的题（题目的原文链接指向这篇笔记），文章末尾据此提示“读完练一练”，并按读者的记录写出练过几道
            for question in json.loads((dist / 'learn' / 'data.json').read_text())['questions'].values():
                for note in {link['note'] for link in question['links'] if link.get('note')}:
                    learn_topics.setdefault(note, []).append(question['id'])
        copy_referenced_assets(dist, ROOT)
        image_report = optimize_images(dist, CACHE) if optimize else {'converted': 0}
        index_name, search_report = write_search_index(dist, sorted((dist / 'notes').glob('*.md')))
        animations = write_animations(dist)
        legacy = json.loads((SITE / 'legacy-routes.json').read_text())
        (dist / 'search-paths.js').write_text(
            'window.CS_NOTES_PATHS = ' + json.dumps(note_paths, ensure_ascii=False) + ';\n'
            'window.CS_NOTES_LEGACY_ROUTES = ' + json.dumps(legacy, ensure_ascii=False, separators=(',', ':')) + ';\n'
            'window.CS_NOTES_SEARCH_INDEX = "/' + index_name + '";\n'
            'window.CS_NOTES_ANIMATIONS = ' + json.dumps(animations, ensure_ascii=False, separators=(',', ':')) + ';\n'
            'window.CS_NOTES_LEARN_TOPICS = ' + json.dumps(learn_topics, ensure_ascii=False, separators=(',', ':')) + ';\n')
        generator = hashlib.sha256()
        learn = [*LEARN_BUILD.parent.glob('*.py'), *(LEARN_BUILD.parent / 'src').rglob('*')] if LEARN_BUILD.is_file() else []
        for resource in sorted([*Path(__file__).parent.glob('*.py'), *SITE.rglob('*'), *learn]):
            if resource.is_file():
                generator.update(resource.relative_to(BASE.parent).as_posix().encode())
                generator.update(resource.read_bytes())
        build_info = {'sourceCommit': SOURCE_COMMIT, 'generatorHash': generator.hexdigest(), 'notes': len(note_paths),
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
                  'learn': learn_report, 'repositoryImagesUsedForOldUrls': len(reused), 'externalImages': len(unchanged_external), 'search': search_report, 'images': image_report, 'legacyRoutes': len(legacy)}
        if report['oversized'] or len(files) > 20000:
            raise ValueError('Static hosting quota exceeded')
        validation = check(ROOT, dist)
        if validation['errors']:
            raise ValueError('Static site validation failed: ' + '; '.join(validation['errors']))
        previous = Path(temporary) / 'previous'
        if DIST.exists():
            DIST.rename(previous)
        try:
            dist.rename(DIST)
        except BaseException:
            if previous.exists():
                previous.rename(DIST)
            raise
    report.update({'sourceCommit': SOURCE_COMMIT, 'imageReplacements': reused, 'externalImageUrls': unchanged_external})
    DIST.with_name(DIST.name + '-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({k: v for k, v in report.items() if k not in ('imageReplacements', 'externalImageUrls')}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='仅在本机从最新上游源码生成静态站，不下载图片、不发布。')
    parser.add_argument('--source', type=Path, default=ROOT)
    parser.add_argument('--output', type=Path, default=DIST)
    parser.add_argument('--source-commit', default=SOURCE_COMMIT)
    parser.add_argument('--no-optimize-images', action='store_true')
    args = parser.parse_args()
    ROOT, DIST, SOURCE_COMMIT = args.source.resolve(), args.output.resolve(), args.source_commit
    if not ROOT.is_dir():
        parser.error("源码目录不存在，请先运行 website/refresh.py。")
    if ROOT == DIST or ROOT.is_relative_to(DIST) or DIST.is_relative_to(ROOT):
        parser.error('源码和输出目录必须相互独立。')
    if not DIST.is_relative_to(BASE):
        parser.error('本地验证输出必须保存在当前验证目录中。')
    build(optimize=not args.no_optimize_images)

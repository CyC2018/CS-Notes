"""Check only local build output and its provenance in the GitHub snapshot."""
import argparse
import hashlib
import json
import re
from pathlib import Path
from urllib.parse import unquote, urlsplit

BASE = Path(__file__).resolve().parents[1]


def check(source, output):
    manifest = json.loads((output / 'asset-manifest.json').read_text())
    info = json.loads((output / 'build-info.json').read_text())
    files = {p.relative_to(output).as_posix(): p for p in output.rglob('*') if p.is_file()}
    errors = []
    expected = {item['path']: item for item in manifest['files']}
    if set(files) != set(expected) | {'asset-manifest.json'}:
        errors.append('发布文件与清单不一致')
    for name, record in expected.items():
        path = output / name
        if not path.is_file() or path.stat().st_size != record['bytes'] or hashlib.sha256(path.read_bytes()).hexdigest() != record['sha256']:
            errors.append('文件清单校验失败：' + name)
    references = 0
    for document in output.rglob('*.md'):
        content = re.sub(r'```[^\n]*\n[\s\S]*?```|<!--[\s\S]*?-->', '', document.read_text())
        for match in re.finditer(r'''\]\((/[^\s)]+)\)|(?:src|href)=["'](/[^"']+)''', content):
            url = match[1] or match[2]
            if url.startswith(('/#', '//')):
                continue
            name = unquote(urlsplit(url).path).lstrip('/')
            if not name:
                continue
            references += 1
            if name not in files and name + '.md' not in files and name.rstrip('/') + '/index.html' not in files:
                errors.append('缺失引用：' + name)
    for name in re.findall(r'(?:src|href)="(/[^"#]+)"', (output / 'index.html').read_text()):
        if name.split('?')[0].lstrip('/') not in files:
            errors.append('缺失页面资源：' + name)
    forbidden = [name for name in files if set(Path(name).parts) & {
        '.git', '.cache', 'node_modules', 'builder', 'templates', 'upstream', 'remote',
        'tools', 'backups', '__pycache__', 'CLAUDE.md', 'AGENTS.md', '.env',
    }]
    if forbidden:
        errors.append('混入维护文件：' + ', '.join(forbidden))
    images = 0
    for name, path in files.items():
        if name.startswith(('notes/pics/', 'assets/', 'docs/_media/')) and path.suffix.lower() in {'.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'}:
            images += 1
            original = source / name
            if not original.is_file() or original.read_bytes() != path.read_bytes():
                errors.append('图片与当前源码不一致：' + name)
    index = json.loads((output / info['searchIndex']).read_text())
    note_names = {p.stem for p in (source / 'notes').glob('*.md')}
    if {Path(doc['path']).name for doc in index['documents']} != note_names:
        errors.append('搜索索引未覆盖当前全部文章')
    legacy = json.loads((BASE / 'templates/legacy-routes.json').read_text())
    for target in legacy.values():
        if not (output / (target.lstrip('/') + '.md')).is_file():
            errors.append('旧入口目标缺失：' + target)
    variants = json.loads((output / 'image-variants.json').read_text()) if (output / 'image-variants.json').exists() else {}
    for name, variant in variants.items():
        for path, key in [(output / name.lstrip('/'), 'sourceSha256'), (output / variant['path'].lstrip('/'), 'sha256')]:
            if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != variant[key]:
                errors.append('图片优化清单不一致：' + name)
    report = {'sourceCommit': info['sourceCommit'], 'notes': len(note_names),
        'files': len(files), 'localReferences': references, 'repositoryImages': images,
        'imageVariants': len(variants), 'legacyRoutes': len(legacy), 'errors': errors}
    return report


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', type=Path, default=BASE / 'upstream')
    parser.add_argument('--output', type=Path, default=BASE / 'dist')
    args = parser.parse_args()
    result = check(args.source.resolve(), args.output.resolve())
    print(json.dumps(result, ensure_ascii=False, indent=2))
    (BASE / 'validation.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    raise SystemExit(bool(result['errors']))

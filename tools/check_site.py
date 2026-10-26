#!/usr/bin/env python3
"""Validate deployed document links, images, and the static hosting limits."""
import json
import hashlib
import re
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
references = 0
missing = []
for document in DIST.rglob('*.md'):
    content = re.sub(r'```[^\n]*\n[\s\S]*?```|<!--[\s\S]*?-->', '', document.read_text())
    for match in re.findall(r'\]\((/[^\s)]+)\)|(?:src|href)=["\'](/[^"\']+)', content):
        target = match[0] or match[1]
        route = target.startswith('/#')
        if route:
            target = target[2:]
        path = urllib.parse.unquote(target.split('?')[0].split('#')[0]).lstrip('/')
        if not path:
            continue
        references += 1
        file = DIST / path
        if not file.is_file() and not Path(str(file) + '.md').is_file():
            missing.append({'document': str(document.relative_to(DIST)), 'target': target})

files = [p for p in DIST.rglob('*') if p.is_file()]
forbidden = [str(p.relative_to(DIST)) for p in files if '.git' in p.parts or p.name in ('CLAUDE.md', 'AGENTS.md')]
oversized = [str(p.relative_to(DIST)) for p in files if p.stat().st_size > 25 * 1024 * 1024]
assets = json.loads((ROOT / 'website/remote-assets.json').read_text())
manifest = json.loads((DIST / 'asset-manifest.json').read_text())
manifest_errors = []
for item in manifest['files']:
    path = DIST / item['path']
    if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != item['sha256']:
        manifest_errors.append(item['path'])
listed = {item['path'] for item in manifest['files']} | {'asset-manifest.json'}
manifest_errors.extend(sorted({str(p.relative_to(DIST)) for p in files} - listed))
info = json.loads((DIST / 'build-info.json').read_text())
index = json.loads((DIST / info['searchIndex']).read_text())
search_errors = [doc['path'] for doc in index['documents'] if not (DIST / (doc['path'].lstrip('/') + '.md')).is_file()]
entry = (DIST / 'index.html').read_text()
for url in re.findall(r'(?:src|href)="(/[^"#]+)"', entry):
    path = DIST / url.split('?')[0].lstrip('/')
    if not path.is_file():
        missing.append({'document': 'index.html', 'target': url})
variants = json.loads((DIST / 'image-variants.json').read_text()) if (DIST / 'image-variants.json').exists() else {}
variant_errors = []
for original, item in variants.items():
    source, target = DIST / original.lstrip('/'), DIST / item['path'].lstrip('/')
    if not source.is_file() or not target.is_file() or hashlib.sha256(source.read_bytes()).hexdigest() != item['sourceSha256'] or hashlib.sha256(target.read_bytes()).hexdigest() != item['sha256']:
        variant_errors.append(original)
legacy = json.loads((ROOT / 'website/legacy-routes.json').read_text())
legacy_errors = [url for url, route in legacy.items() if not (DIST / (route.lstrip('/') + '.md')).is_file()]
report = {'notes': len(list((DIST / 'notes').glob('*.md'))), 'files': len(files),
          'references': references, 'missing': missing, 'oversized': oversized,
          'forbidden': forbidden, 'mirroredImages': len(assets),
          'assetErrors': [url for url, entry in assets.items() if 'error' in entry],
          'manifestFiles': len(manifest['files']), 'manifestErrors': manifest_errors,
          'searchDocuments': len(index['documents']), 'searchErrors': search_errors,
          'imageVariants': len(variants), 'variantErrors': variant_errors,
          'legacyRoutes': len(legacy), 'legacyErrors': legacy_errors}
print(json.dumps(report, ensure_ascii=False, indent=2))
if missing or oversized or forbidden or report['assetErrors'] or manifest_errors or search_errors or variant_errors or legacy_errors or len(files) > 20000:
    raise SystemExit(1)

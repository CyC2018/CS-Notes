#!/usr/bin/env python3
"""Validate deployed document links, images, and the static hosting limits."""
import json
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
report = {'notes': len(list((DIST / 'notes').glob('*.md'))), 'files': len(files),
          'references': references, 'missing': missing, 'oversized': oversized,
          'forbidden': forbidden, 'mirroredImages': len(assets),
          'assetErrors': [url for url, entry in assets.items() if 'error' in entry]}
print(json.dumps(report, ensure_ascii=False, indent=2))
if missing or oversized or forbidden or report['assetErrors'] or len(files) > 20000:
    raise SystemExit(1)

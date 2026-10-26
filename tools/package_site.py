"""Validate and write a reproducible, checksummed static website release."""
import argparse
import hashlib
import json
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--output', type=Path, default=ROOT / 'artifacts/cs-notes-static.zip')
args = parser.parse_args()
subprocess.run([sys.executable, str(ROOT / 'tools/check_site.py')], check=True)
dist = ROOT / 'dist'
manifest = json.loads((dist / 'asset-manifest.json').read_text())
expected = {item['path']: item['sha256'] for item in manifest['files']}
names = sorted([*expected, 'asset-manifest.json'])
output = args.output.resolve()
if output.is_relative_to(dist.resolve()):
    raise SystemExit('发布包必须保存在 dist 目录外。')
output.parent.mkdir(parents=True, exist_ok=True)
with tempfile.NamedTemporaryFile(dir=output.parent, suffix='.zip', delete=False) as temporary:
    temporary_path = Path(temporary.name)
try:
    with zipfile.ZipFile(temporary_path, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
        for name in names:
            data = (dist / name).read_bytes()
            if name in expected and hashlib.sha256(data).hexdigest() != expected[name]:
                raise ValueError(f'构建文件在打包期间发生变化：{name}')
            entry = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
            entry.compress_type = zipfile.ZIP_DEFLATED
            entry.create_system = 3
            entry.external_attr = 0o100644 << 16
            archive.writestr(entry, data, compresslevel=6)
    temporary_path.replace(output)
finally:
    temporary_path.unlink(missing_ok=True)
digest = hashlib.sha256(output.read_bytes()).hexdigest()
output.with_suffix('.zip.sha256').write_text(digest + '  ' + output.name + '\n')
report = {key: manifest[key] for key in ('sourceCommit', 'generatorCommit', 'notes', 'legacyRoutes')}
report.update({'archive': output.name, 'files': len(names), 'bytes': output.stat().st_size, 'sha256': digest})
output.with_suffix('.release.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(report, ensure_ascii=False, indent=2))

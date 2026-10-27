"""Create a reproducible UTF-8 ZIP from the validated manifest, without credentials."""
import argparse
import hashlib
import json
import tempfile
import zipfile
from pathlib import Path


def create_archive(source, output):
    source, output = Path(source).resolve(), Path(output).resolve()
    if output.is_relative_to(source):
        raise ValueError('发布包必须保存在网站产物目录外。')
    manifest = json.loads((source / 'asset-manifest.json').read_text())
    records = {item['path']: item for item in manifest['files']}
    names = sorted([*records, 'asset-manifest.json'])
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=output.parent, suffix='.zip', delete=False) as temporary:
        temporary_path = Path(temporary.name)
    try:
        with zipfile.ZipFile(temporary_path, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
            for name in names:
                path = source / name
                if not path.resolve().is_relative_to(source) or path.is_symlink():
                    raise ValueError('非法发布路径：' + name)
                data = path.read_bytes()
                if name in records:
                    record = records[name]
                    if len(data) != record['bytes'] or hashlib.sha256(data).hexdigest() != record['sha256']:
                        raise ValueError('打包前文件校验不一致：' + name)
                entry = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
                entry.compress_type = zipfile.ZIP_DEFLATED
                entry.create_system = 3
                entry.external_attr = 0o100644 << 16
                archive.writestr(entry, data, compresslevel=6)
        temporary_path.replace(output)
    finally:
        temporary_path.unlink(missing_ok=True)
    return len(names)


if __name__ == '__main__':
    website = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', type=Path, default=website / 'dist')
    parser.add_argument('--output', type=Path, default=website / '.cache/site-release.zip')
    args = parser.parse_args()
    print('已校验并打包文件：' + str(create_archive(args.source, args.output)))

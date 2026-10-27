"""Verify Unicode names, exact bytes and reproducibility of release archives."""
import hashlib
import json
import tempfile
import unittest
import zipfile
from pathlib import Path

from package_site import create_archive


class ArchiveTests(unittest.TestCase):
    def fixture(self, root):
        source = root / 'dist'
        files = {'index.html': b'<h1>CS-Notes</h1>', 'notes/大模型应用.md': '# 中文文章'.encode(),
                 'notes/Java 基础.md': b'Java', '.nojekyll': b''}
        for name, data in files.items():
            path = source / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(data)
        manifest = {'files': [{'path': name, 'bytes': len(data),
                    'sha256': hashlib.sha256(data).hexdigest()} for name, data in files.items()]}
        (source / 'asset-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False))
        return source, files

    def test_unicode_roundtrip_and_reproducible_bytes(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source, files = self.fixture(root)
            first, second = root / 'first.zip', root / 'second.zip'
            self.assertEqual(create_archive(source, first), len(files) + 1)
            create_archive(source, second)
            self.assertEqual(first.read_bytes(), second.read_bytes())
            with zipfile.ZipFile(first) as archive:
                for name, data in files.items():
                    self.assertEqual(archive.read(name), data)
                    if not name.isascii():
                        self.assertTrue(archive.getinfo(name).flag_bits & 0x800)

    def test_modified_file_is_rejected_without_replacing_previous_archive(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source, _ = self.fixture(root)
            output = root / 'release.zip'
            create_archive(source, output)
            previous = output.read_bytes()
            (source / 'notes/大模型应用.md').write_text('modified')
            with self.assertRaisesRegex(ValueError, '校验不一致'):
                create_archive(source, output)
            self.assertEqual(output.read_bytes(), previous)


if __name__ == '__main__':
    unittest.main()

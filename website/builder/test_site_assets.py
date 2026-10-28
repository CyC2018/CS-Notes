"""Regression checks for generated search anchors and asset collection."""
import sys
import tempfile
import unittest
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from site_assets import heading_slug, optimize_images, referenced_paths, search_document


class SearchIndexTests(unittest.TestCase):
    def test_docsify_numeric_duplicate_and_chinese_punctuation(self):
        counts = Counter()
        self.assertEqual(heading_slug('1. 慢开始与拥塞避免', counts), '_1-慢开始与拥塞避免')
        self.assertEqual(heading_slug('三、检索增强生成', counts), '三、检索增强生成')
        self.assertEqual(heading_slug('TCP 拥塞控制', counts), 'tcp-拥塞控制')
        self.assertEqual(heading_slug('TCP 拥塞控制', counts), 'tcp-拥塞控制-1')
        # marked 先把引号转义成 &quot;，Docsify 再去掉标点，留下 quot（Edge 渲染的 Java 基础页核对过）
        self.assertEqual(heading_slug('new String("abc")', counts), 'new-stringquotabcquot')
        self.assertEqual(heading_slug('1\\. 数据', counts), '_1-数据')

    def test_headings_in_code_do_not_change_real_anchors(self):
        doc = search_document(Path('示例.md'), '# 示例\n\n```python\n# TCP 拥塞控制\n```\n\n## TCP 拥塞控制\n慢开始\n')
        sections = [s for s in doc['sections'] if s['id'] == 'tcp-拥塞控制']
        self.assertEqual(len(sections), 1)
        self.assertEqual(sections[0]['text'], '慢开始')

    def test_comments_and_example_asset_urls_are_not_published(self):
        content = '<!-- <img src="/secret.png"> -->\n```html\n<img src="/example.png">\n```\n<img src="/notes/pics/actual.png">\n[正文](/notes/示例.md)\n'
        self.assertEqual(set(referenced_paths(content)), {'notes/pics/actual.png', 'notes/示例.md'})

    def test_image_manifest_stable_across_file_creation_order(self):
        from PIL import Image
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            outputs = []
            for index, names in enumerate([['a.png', 'z.png'], ['z.png', 'a.png']]):
                dist = root / str(index)
                dist.mkdir()
                for name in names:
                    Image.new('RGB', (128, 128), 'red' if name == 'a.png' else 'blue').save(
                        dist / name, compress_level=0)
                report = optimize_images(dist, root / 'cache')
                self.assertEqual(report['converted'], 2)
                outputs.append((dist / 'image-variants.json').read_bytes())
            self.assertEqual(outputs[0], outputs[1])


if __name__ == '__main__':
    unittest.main()

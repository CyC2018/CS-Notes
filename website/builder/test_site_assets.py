"""Regression checks for generated search anchors and asset collection."""
import sys
import tempfile
import unittest
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from site_assets import add_image_sizes, heading_slug, optimize_images, referenced_paths, search_document
from build import github_slug, hot_spans, strip_hot


class SearchIndexTests(unittest.TestCase):
    def test_hot_heading_mark(self):
        # 标题末尾的“不换行空格 + 🔥”不改变 GitHub 锚点；网站上换成空的 span，Docsify 的 id 也不变
        self.assertEqual(github_slug('ThreadPoolExecutor\u00a0🔥🔥'), 'threadpoolexecutor')
        self.assertEqual(github_slug('5. 协程\u00a0🔥'), '5-协程')
        self.assertEqual(github_slug('ThreadPoolExecutor 🔥'), 'threadpoolexecutor-')
        self.assertEqual(strip_hot('### 5. 协程\u00a0🔥\n正文 🔥'), '### 5. 协程\n正文 🔥')
        site = hot_spans('* [三、检索增强生成](#三检索增强生成) 🔥🔥\n## 三、检索增强生成\u00a0🔥🔥')
        self.assertEqual(site, '* [三、检索增强生成](#三检索增强生成) <span class="hot hot-2"></span>\n'
                               '## 三、检索增强生成<span class="hot hot-2"></span>')
        self.assertEqual(heading_slug(site.split('\n')[1][3:], Counter()), '三、检索增强生成')
        doc = search_document(Path('x.md'), site)
        self.assertEqual([s['title'] for s in doc['sections']], ['x', '三、检索增强生成'])
        self.assertEqual(doc['sections'][0]['text'], '')

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

    def test_inline_triple_backticks_do_not_hide_later_images(self):
        # 正文中的行内代码 ```` ```json ```` 不是代码块，后面的图片仍要发布
        content = ('例如包在 ```` ```json ```` 代码块里。\n\n<img src="/notes/pics/a.png"/>\n\n'
                   '- 列表\n\n  ```text\n  <img src="/notes/pics/in-code.png"/>\n  ```\n\n<img src="/notes/pics/b.png"/>\n')
        self.assertEqual(set(referenced_paths(content)), {'notes/pics/a.png', 'notes/pics/b.png'})

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


    def test_image_sizes_keep_aspect_ratio(self):
        from PIL import Image
        with tempfile.TemporaryDirectory() as directory:
            dist = Path(directory)
            (dist / 'pics').mkdir()
            Image.new('RGB', (1520, 600)).save(dist / 'pics' / 'a.png')
            (dist / 'a.md').write_text('<img src="/pics/a.png" width="760px"/>\n<img src="/pics/a.png">\n'
                                       '<img src="/pics/a.png" width="10" height="9"/>\n<img src="https://x/y.png"/>\n'
                                       '```html\n<img src="/pics/a.png"/>\n```\n')
            self.assertEqual(add_image_sizes(dist), 2)
            self.assertEqual((dist / 'a.md').read_text(),
                             '<img src="/pics/a.png" width="760px" height="300"/>\n<img src="/pics/a.png" width="1520" height="600">\n'
                             '<img src="/pics/a.png" width="10" height="9"/>\n<img src="https://x/y.png"/>\n'
                             '```html\n<img src="/pics/a.png"/>\n```\n')


if __name__ == '__main__':
    unittest.main()

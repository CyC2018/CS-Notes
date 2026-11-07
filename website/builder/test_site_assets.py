"""Regression checks for generated search anchors and asset collection."""
import re
import json
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
        self.assertEqual(sections[0]['level'], 2)

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


    def test_static_note_pages(self):
        # 静态页面的标题 id 与网站（Docsify）一致，站内链接换成静态页面，文首目录折叠，只剩一个链接的旧页面跳到目标
        import collections, subprocess
        with tempfile.TemporaryDirectory() as directory:
            dist = Path(directory)
            (dist / 'notes').mkdir()
            titles = ['示例', '1. 爬楼梯', 'HashMap 的 `put()`', '"引号"', '示例', 'A1 实测']
            toc = '\n'.join(f'* [{t}](#x{i})' for i, t in enumerate(titles))
            body = f'# {titles[0]}\n<!-- GFM-TOC -->\n{toc}\n<!-- GFM-TOC -->\n\n正文第一段，见 [另一篇](/notes/%E5%8F%A6.md#_1-%E7%88%AC%E6%A5%BC%E6%A2%AF)。\n\n' + \
                ''.join(f'## {t}\n\n内容\n\n' for t in titles[1:]) + '<a href="/notes/%E5%8F%A6.md">HTML 链接</a>\n\n```java\n# 不是标题\n```\n'
            (dist / 'notes' / '示例.md').write_text(body)
            (dist / 'notes' / '算法.md').write_text('见 [算法 - 目录](/notes/算法 - 目录.md)\n')
            (dist / '_sidebar.md').write_text('- [首页](/)\n\n- **示例分组**\n  - [示例](/notes/%E7%A4%BA%E4%BE%8B.md)\n')
            (dist / 'stubs.json').write_text(json.dumps({'/notes/算法': '/notes/算法 - 目录'}, ensure_ascii=False))
            (dist / 'sections.json').write_text(json.dumps({'示例': {'_1-爬楼梯': [['q1', '怎样爬楼梯？', 2]]}}, ensure_ascii=False))
            urls = json.loads(subprocess.run(['node', str(Path(__file__).parent / 'static_notes.cjs'), str(dist), 'https://example.com/', str(dist / 'stubs.json'), str(dist / 'sections.json')],
                                             check=True, capture_output=True, text=True).stdout)
            self.assertEqual(urls, ['https://example.com/notes/', 'https://example.com/notes/%E7%A4%BA%E4%BE%8B.html'])
            self.assertIn('<a href="/notes/%E7%A4%BA%E4%BE%8B.html">示例</a>', (dist / 'notes' / 'index.html').read_text())
            page = (dist / 'notes' / '示例.html').read_text()
            counts = collections.Counter()
            expected = [heading_slug(t, counts) for t in titles]
            self.assertEqual(re.findall(r'<h[1-6] id="([^"]*)"', page), expected)
            self.assertIn('href="/notes/%E5%8F%A6.html#_1-%E7%88%AC%E6%A5%BC%E6%A2%AF"', page)
            self.assertIn('href="/notes/%E5%8F%A6.html"', page)
            self.assertIn('<details class="toc"><summary>本文目录</summary>', page)
            self.assertIn('<meta name="description" content="正文第一段，见 另一篇。">', page)
            self.assertIn('href="/#/notes/%E7%A4%BA%E4%BE%8B"', page)
            self.assertNotIn('<script', page)
            self.assertIn('<h2 id="_1-爬楼梯">1. 爬楼梯</h2>\n<aside class="qs"><b>面试题</b><ul><li><a href="/learn/q/q1.html">怎样爬楼梯？</a>', page)
            stub = (dist / 'notes' / '算法.html').read_text()
            self.assertIn('url=/notes/%E7%AE%97%E6%B3%95%20-%20%E7%9B%AE%E5%BD%95.html', stub)


class MissingAnchorTests(unittest.TestCase):
    # 文内目录链接指向不存在的标题时记下来，构建结束后给警告
    NOTE = 'notes/示例.md'

    def setUp(self):
        from unittest import mock
        import build
        self.build = build
        anchors = {self.NOTE: {'1-爬楼梯': '_1-爬楼梯', 'tcp-拥塞控制': 'tcp-拥塞控制'}}
        self.missing = {}
        for name, value in (('ANCHORS', anchors), ('MISSING_ANCHORS', self.missing)):
            patcher = mock.patch.object(build, name, value)
            patcher.start()
            self.addCleanup(patcher.stop)
        self.source = build.ROOT / self.NOTE

    def target(self, url):
        return self.build.local_target(url, self.source)

    def test_known_github_anchor_is_not_reported(self):
        self.assertEqual(self.target('#1-爬楼梯'), '#_1-爬楼梯')
        self.assertEqual(self.missing, {})

    def test_known_docsify_anchor_is_not_reported(self):
        self.assertEqual(self.target('#_1-爬楼梯'), '#_1-爬楼梯')
        self.assertEqual(self.missing, {})

    def test_percent_encoded_anchor_is_decoded_before_lookup(self):
        self.assertEqual(self.target('#tcp-%E6%8B%A5%E5%A1%9E%E6%8E%A7%E5%88%B6'), '#tcp-拥塞控制')
        self.assertEqual(self.missing, {})

    def test_missing_anchor_is_recorded_and_link_kept(self):
        self.assertEqual(self.target('#已删除的标题'), '#已删除的标题')
        self.assertEqual(list(self.missing), [(self.NOTE, '已删除的标题')])

    def test_missing_encoded_anchor_is_recorded_decoded(self):
        self.target('#%E6%97%A7%E6%A0%87%E9%A2%98')
        self.assertEqual(list(self.missing), [(self.NOTE, '旧标题')])

    def test_repeated_missing_anchor_recorded_once_in_order(self):
        for url in ('#b', '#a', '#b'):
            self.target(url)
        self.assertEqual(list(self.missing), [(self.NOTE, 'b'), (self.NOTE, 'a')])

    def test_note_without_anchor_map_reports_every_fragment(self):
        other = self.build.ROOT / 'notes' / '另.md'
        self.build.local_target('#x', other)
        self.assertEqual(list(self.missing), [('notes/另.md', 'x')])

    def test_non_fragment_links_are_not_checked(self):
        for url in ('#', 'https://example.com/#nope', 'mailto:a@b.c', '/notes/另.md#nope'):
            self.target(url)
        self.assertEqual(self.missing, {})


if __name__ == '__main__':
    unittest.main()

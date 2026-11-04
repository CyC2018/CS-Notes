"""Regression checks for compiling the Java snippets of numbered notes."""
import io
import shutil
import sys
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from types import SimpleNamespace
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parent))
import snippets
from snippets import IMPORTS, NUMBERED, STUBS, compile_note, java_fences, main, sources


class JavaFenceTests(unittest.TestCase):
    def test_only_java_fences_with_first_body_line(self):
        text = '# 标题\n\n```java\nint a = 1;\n```\n\n```python\nx = 1\n```\n\n```java title\nint b;\n```\n'
        self.assertEqual(java_fences(text), [(4, 'int a = 1;'), (12, 'int b;')])

    def test_javascript_and_comments_are_skipped(self):
        text = '```javascript\nvar a;\n```\n<!--\n```java\nint c;\n```\n-->\n'
        self.assertEqual(java_fences(text), [])

    def test_indented_fence_is_dedented(self):
        text = '- 列表\n\n  ```java\n  int a;\n      int b;\n  ```\n'
        self.assertEqual(java_fences(text), [(4, 'int a;\n    int b;')])

    def test_tilde_and_long_fences(self):
        text = '~~~java\nint a;\n~~~\n````java\n```\nint b;\n````\n'
        self.assertEqual(java_fences(text), [(2, 'int a;'), (5, '```\nint b;')])


class NumberedNoteTests(unittest.TestCase):
    def test_numbered_names(self):
        for name in ['3. 数组中重复的数字.md', '10.1 斐波那契数列.md', '66 构建乘积数组.md']:
            self.assertTrue(NUMBERED.match(name), name)
        for name in ['剑指 Offer 题解 - 目录.md', 'Java 基础.md', '3数组.md']:
            self.assertFalse(NUMBERED.match(name), name)


class SourcesTests(unittest.TestCase):
    def test_method_only_block_is_wrapped(self):
        files = sources([(7, 'public int f() {\n    return 1;\n}')])
        code, start, offset, count = files['Snippet7.java']
        self.assertEqual(code, IMPORTS + 'class Snippet7 {\npublic int f() {\n    return 1;\n}\n}\n')
        self.assertEqual((start, offset, count), (7, 2, 3))

    def test_declared_class_is_not_wrapped(self):
        body = 'class Solution {\n}'
        files = sources([(5, body)])
        self.assertEqual(files['Snippet5.java'], (IMPORTS + body + '\n', 5, 1, 2))

    def test_public_class_uses_its_own_file_name(self):
        body = 'public final class Solution {\n}'
        files = sources([(9, body)])
        self.assertIn('Solution.java', files)
        self.assertNotIn('Snippet9.java', files)
        self.assertEqual(files['Solution.java'][1:], (9, 1, 2))

    def test_stubs_added_unless_declared(self):
        files = sources([(1, 'int x;')])
        for name, stub in STUBS.items():
            self.assertEqual(files[name + '.java'], (stub, None, 0, 0))
        files = sources([(1, 'class ListNode {\n}'), (5, 'public class TreeNode {\n}')])
        self.assertNotEqual(files['Snippet1.java'][0], STUBS['ListNode'])
        self.assertEqual(files['TreeNode.java'][0], IMPORTS + 'public class TreeNode {\n}\n')
        self.assertIn('RandomListNode.java', files)
        self.assertEqual(files['RandomListNode.java'][1], None)
        self.assertEqual(sum(1 for code, *_ in files.values() if code == STUBS['ListNode']), 0)

    def test_declarations_in_other_blocks_of_same_note_count(self):
        files = sources([(1, 'interface Shape {}'), (4, 'enum Color { RED }'), (8, 'void f() {}')])
        self.assertEqual(files['Snippet8.java'][2], 2)
        self.assertEqual(set(files), {'Snippet1.java', 'Snippet4.java', 'Snippet8.java',
                                      'ListNode.java', 'TreeNode.java', 'RandomListNode.java'})

    def test_indented_class_inside_method_block_is_not_a_declaration(self):
        files = sources([(3, 'void f() {\n    class Local {}\n}')])
        self.assertEqual(files['Snippet3.java'][2], 2)


class CompileNoteTests(unittest.TestCase):
    def run_with(self, fences, output, returncode=1):
        with tempfile.TemporaryDirectory() as directory:
            workdir = Path(directory)
            result = SimpleNamespace(returncode=returncode, stdout='', stderr=output.format(dir=workdir))
            with mock.patch.object(snippets.subprocess, 'run', return_value=result) as run:
                failures = compile_note('javac', 'notes/3. x.md', fences, workdir)
                written = sorted(p.name for p in workdir.glob('*.java'))
                self.assertTrue((workdir / 'classes').is_dir())
            return failures, written, run.call_args[0][0]

    def test_writes_files_and_passes_them_to_javac(self):
        failures, written, command = self.run_with([(4, 'int a;')], '', returncode=0)
        self.assertEqual(failures, [])
        self.assertEqual(written, ['ListNode.java', 'RandomListNode.java', 'Snippet4.java', 'TreeNode.java'])
        self.assertEqual(command[0], 'javac')
        self.assertIn('-proc:none', command)
        self.assertEqual([Path(arg).name for arg in command if arg.endswith('.java')], written)

    def test_error_line_mapped_back_to_note(self):
        output = '{dir}/Snippet4.java:4: error: cannot find symbol\n  int b = c;\n'
        failures, *_ = self.run_with([(4, 'int a;\nint b = c;')], output)
        self.assertEqual(failures, ['notes/3. x.md:5: cannot find symbol'])

    def test_error_in_declared_class_uses_one_line_offset(self):
        output = '{dir}/Solution.java:3: error: missing return statement\n'
        failures, *_ = self.run_with([(10, 'public class Solution {\n    int f() {}\n}')], output)
        self.assertEqual(failures, ['notes/3. x.md:11: missing return statement'])

    def test_error_lines_clamped_to_block(self):
        output = ('{dir}/Snippet4.java:1: error: early\n'
                  '{dir}/Snippet4.java:99: error: late\n')
        failures, *_ = self.run_with([(4, 'int a;')], output)
        self.assertEqual(failures, ['notes/3. x.md:3: early', 'notes/3. x.md:5: late'])

    def test_error_in_stub_or_unknown_file(self):
        output = '{dir}/ListNode.java:2: error: boom\n{dir}/Other.java:1: error: odd\n'
        failures, *_ = self.run_with([(4, 'int a;')], output)
        self.assertEqual(failures, ['notes/3. x.md:?: ListNode.java: boom', 'notes/3. x.md:?: Other.java: odd'])

    def test_nonzero_exit_without_parsed_errors(self):
        failures, *_ = self.run_with([(4, 'int a;')], 'error: invalid flag\n', returncode=2)
        self.assertEqual(failures, ['notes/3. x.md:?: javac 退出码 2'])


class MainTests(unittest.TestCase):
    def make_source(self, directory):
        notes = Path(directory) / 'notes'
        notes.mkdir()
        (notes / '3. 数组中重复的数字.md').write_text('```java\nint a;\n```\n\n```java\nint b;\n```\n')
        (notes / '4. 二维数组中的查找.md').write_text('没有代码\n```python\nx = 1\n```\n')
        (notes / 'Java 基础.md').write_text('```java\nint c;\n```\n')
        return Path(directory)

    def test_skips_without_javac(self):
        with tempfile.TemporaryDirectory() as directory:
            source = self.make_source(directory)
            out = io.StringIO()
            with mock.patch.object(snippets.shutil, 'which', return_value=None), \
                    mock.patch.object(snippets.subprocess, 'run') as run, redirect_stdout(out):
                main(source)
            run.assert_not_called()
            self.assertEqual(out.getvalue(), '未找到 javac，跳过 1 篇笔记中的 2 个 Java 代码块\n')

    def test_reports_failures_and_summary(self):
        def fake_run(command, **kwargs):
            names = [Path(arg).name for arg in command if arg.endswith('.java')]
            self.assertIn('Snippet2.java', names)
            directory = Path(command[-1]).parent
            return SimpleNamespace(returncode=1, stdout='',
                                   stderr=f'{directory}/Snippet6.java:3: error: bad\n')

        with tempfile.TemporaryDirectory() as directory:
            source = self.make_source(directory)
            out = io.StringIO()
            with mock.patch.object(snippets.shutil, 'which', return_value='javac'), \
                    mock.patch.object(snippets.subprocess, 'run', side_effect=fake_run), redirect_stdout(out):
                main(source)
            self.assertEqual(out.getvalue().splitlines(), [
                'notes/3. 数组中重复的数字.md:6: bad',
                '1 篇笔记，2 个 Java 代码块；1 篇笔记共 1 处编译错误',
            ])


@unittest.skipUnless(shutil.which('javac'), 'javac not installed')
class RealJavacTests(unittest.TestCase):
    def compile(self, fences):
        with tempfile.TemporaryDirectory() as directory:
            return compile_note(shutil.which('javac'), 'notes/1. x.md', fences, Path(directory))

    def test_valid_snippets_with_stubs_compile(self):
        fences = [(3, 'public ListNode reverse(ListNode head) {\n    List<Integer> a = new ArrayList<>();\n'
                      '    return head;\n}'),
                  (10, 'public class Solution {\n    TreeNode root = new TreeNode(1);\n}')]
        self.assertEqual(self.compile(fences), [])

    def test_error_reported_at_note_line(self):
        fences = [(3, 'int f() {\n    return missing;\n}')]
        failures = self.compile(fences)
        self.assertEqual(len(failures), 1)
        self.assertTrue(failures[0].startswith('notes/1. x.md:4: cannot find symbol'), failures)


if __name__ == '__main__':
    unittest.main()

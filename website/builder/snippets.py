"""Compile the Java snippets of the numbered notes with javac; report only, never fail."""
import argparse
import concurrent.futures
import re
import shutil
import subprocess
import tempfile
import textwrap
from pathlib import Path

from site_assets import VERBATIM

BASE = Path(__file__).resolve().parents[1]
NUMBERED = re.compile(r'\d+(?:\.\d+)?\.? ')
DECLARATION = re.compile(r'^(?:(?:public|abstract|final)\s+)*(?:class|interface|enum)\s+(\w+)', re.M)
PUBLIC = re.compile(r'^public\s+(?:(?:abstract|final)\s+)*(?:class|interface|enum)\s+(\w+)', re.M)
ERROR = re.compile(r'^(.+?\.java):(\d+): error: (.*)$', re.M)
IMPORTS = 'import java.util.*;\n'
STUBS = {
    'ListNode': 'class ListNode {\n    int val;\n    ListNode next;\n\n    ListNode(int val) {\n        this.val = val;\n    }\n}\n',
    'TreeNode': 'class TreeNode {\n    int val;\n    TreeNode left;\n    TreeNode right;\n\n    TreeNode(int val) {\n        this.val = val;\n    }\n}\n',
    'RandomListNode': 'class RandomListNode {\n    int label;\n    RandomListNode next;\n    RandomListNode random;\n\n'
                      '    RandomListNode(int label) {\n        this.label = label;\n    }\n}\n',
}


def java_fences(text):
    """返回 (代码块第一行在笔记中的行号, 代码块正文)，只取 java 代码块。"""
    fences = []
    for match in VERBATIM.finditer(text):
        if not match['fence']:
            continue
        lines = match[0].split('\n')
        info = lines[0].strip()[len(match['fence']):].strip()
        if info.split()[:1] != ['java']:
            continue
        fences.append((text.count('\n', 0, match.start()) + 2, textwrap.dedent('\n'.join(lines[1:-1]))))
    return fences


def sources(fences):
    """按笔记生成待编译的文件：{文件名: (源码, 代码块起始行, 前置行数, 代码块行数)}。"""
    files, declared = {}, set()
    for line, body in fences:
        names = DECLARATION.findall(body)
        count = body.count('\n') + 1
        if names:
            declared.update(names)
            public = PUBLIC.findall(body)
            name = public[0] if public else f'Snippet{line}'
            files[name + '.java'] = (IMPORTS + body + '\n', line, 1, count)
        else:
            name = f'Snippet{line}'
            files[name + '.java'] = (IMPORTS + f'class {name} {{\n' + body + '\n}\n', line, 2, count)
    for name, stub in STUBS.items():
        if name not in declared:
            files[name + '.java'] = (stub, None, 0, 0)
    return files


def compile_note(javac, note, fences, workdir):
    files = sources(fences)
    for name, (code, *_) in files.items():
        (workdir / name).write_text(code)
    (workdir / 'classes').mkdir()
    result = subprocess.run(
        [javac, '-J-Duser.language=en', '-encoding', 'UTF-8', '-nowarn', '-Xmaxerrs', '1000', '-proc:none',
         '-d', str(workdir / 'classes'), *sorted(str(workdir / name) for name in files)],
        capture_output=True, text=True)
    failures = []
    for match in ERROR.finditer(result.stdout + result.stderr):
        name = Path(match[1]).name
        _, start, offset, count = files.get(name, (None, None, 0, 0))
        if start is None:
            failures.append(f'{note}:?: {name}: {match[3]}')
            continue
        position = min(max(int(match[2]) - offset, 0), count + 1)
        failures.append(f'{note}:{start + position - 1}: {match[3]}')
    if result.returncode and not failures:
        failures.append(f'{note}:?: javac 退出码 {result.returncode}')
    return failures


def main(source):
    notes = sorted(p for p in (source / 'notes').glob('*.md') if NUMBERED.match(p.name))
    snippets = {p.relative_to(source).as_posix(): java_fences(p.read_text()) for p in notes}
    snippets = {note: fences for note, fences in snippets.items() if fences}
    blocks = sum(len(fences) for fences in snippets.values())
    javac = shutil.which('javac')
    if not javac:
        print(f'未找到 javac，跳过 {len(snippets)} 篇笔记中的 {blocks} 个 Java 代码块')
        return
    with tempfile.TemporaryDirectory() as temp, concurrent.futures.ThreadPoolExecutor() as pool:
        jobs = []
        for index, (note, fences) in enumerate(snippets.items()):
            workdir = Path(temp) / str(index)
            workdir.mkdir()
            jobs.append(pool.submit(compile_note, javac, note, fences, workdir))
        results = [job.result() for job in jobs]
    failures = [line for result in results for line in result]
    for line in failures:
        print(line)
    broken = sum(1 for result in results if result)
    print(f'{len(snippets)} 篇笔记，{blocks} 个 Java 代码块；{broken} 篇笔记共 {len(failures)} 处编译错误')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', type=Path, default=BASE.parent)
    args = parser.parse_args()
    main(args.source.resolve())

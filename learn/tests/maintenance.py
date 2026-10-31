"""长期维护的端到端测试：读者学了一段时间后，笔记陆续更新、部署，读者的记录和体验是否正常。

用法：python3 learn/tests/maintenance.py（约 3 分钟，需要 Microsoft Edge）
在临时目录中复制一份 notes/、lock 和路线配置，起一个本机服务，用无头 Edge 扮演读者，依次模拟：
1. 第一版上线，读者选 Java 后端，学完前 3 天，练过若干题；
2. 笔记更新（和 CI 一样宽松构建，lock 还没写入）：改一道题的问法、改一道题的要点、给学过的天加一道题、删一道练过的题、
   在第 3 天后插入一天、把一道题链接到的小节改名；读者打开着的页面提示刷新，刷新后记录都在，首页说明这次更新和他的关系；
3. 维护者运行 maintain.py：严格检查发现改名的小节，修好链接后写入 lock，更新记录带上日期；
4. 删掉的题加回来：归档的复习记录自动恢复；
5. 下线大模型路线：在学这条路线的读者看到换路线的提示，记录保留。
每一步都检查没有脚本错误。
"""
import functools
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

HERE = Path(__file__).resolve().parent
LEARN = HERE.parent
REPO = LEARN.parent
sys.path.insert(0, str(HERE))
from e2e import Browser, passed, step  # noqa: E402

PORT = 8791
JAVA = '学习路线 - Java 后端.md'


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def end_headers(self):
        # 和静态托管一样，页面本身不长期缓存
        if self.path.split('?')[0].endswith(('/', '.html', 'sw.js')):
            self.send_header('Cache-Control', 'no-cache')
        super().end_headers()


def day_block(text, n):
    """第 n 天的正文（到下一天的标题之前）的起止位置。"""
    start = re.search(rf'^### 第 {n} 天：.*$', text, re.M)
    end = re.search(r'^### 第 \d+ 天：|^## ', text[start.end():], re.M)
    return start.start(), start.end() + (end.start() if end else len(text) - start.end())


def edit_day(text, n, fn):
    a, b = day_block(text, n)
    return text[:a] + fn(text[a:b]) + text[b:]


def questions_of(block):
    asks = re.findall(r'^(\d+)\. (.+)$', block.split('<details>')[0], re.M)
    points = re.findall(r'^(\d+)\. (.+)$', block.split('<details>')[1], re.M)
    return asks, points


def main():
    work = Path(tempfile.mkdtemp(prefix='learn-maint-'))
    src, site, lock, routes = work / 'src', work / 'site', work / 'content.lock.json', work / 'routes.json'
    shutil.copytree(REPO / 'notes', src / 'notes')
    shutil.copyfile(LEARN / 'content.lock.json', lock)
    shutil.copyfile(LEARN / 'routes.json', routes)
    base = f'http://127.0.0.1:{PORT}/learn/'

    def deploy(lenient=True):
        """和 CI 一样构建：先生成到临时目录，再整体替换线上目录。"""
        out = work / 'next'
        cmd = [sys.executable, str(LEARN / 'build.py'), '--source', str(src), '--output', str(out), '--notes-base', '/#/notes/',
               '--lock', str(lock), '--routes', str(routes)] + (['--lenient'] if lenient else [])
        report = json.loads(subprocess.run(cmd, check=True, capture_output=True, text=True).stdout.strip().splitlines()[-1])
        if (site / 'learn').exists():
            shutil.rmtree(site / 'learn')
        site.mkdir(exist_ok=True)
        out.rename(site / 'learn')
        return report

    def maintain(*extra):
        r = subprocess.run([sys.executable, str(LEARN / 'maintain.py'), '--source', str(src), '--lock', str(lock), '--routes', str(routes), *extra],
                           capture_output=True, text=True)
        return r.returncode, r.stdout + r.stderr

    # 仓库里的路线可能已经改过、还没写入 lock：先在副本上写入，让第一版与 lock 一致
    code, out = maintain('--write', '--date', '2026-10-31')
    assert code == 0, out
    deploy()
    server = ThreadingHTTPServer(('127.0.0.1', PORT), functools.partial(Quiet, directory=str(site)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    b = Browser(base, 1280, 900, port=9392)
    T = '?today=2026-11-04'
    first = json.loads((site / 'learn' / 'data.json').read_text())
    java_days = [d for st in first['routes'][0]['stages'] for d in st['days']]
    d1, d2, d3, d4 = java_days[:4]
    q_rephrase = first['days'][d1]['questions'][1]
    q_points = first['days'][d2]['questions'][0]
    q_delete = first['days'][d3]['questions'][2]
    try:
        @step('第一版：读者选 Java 后端，跳过定级，学完前 3 天并自评全部题')
        def _():
            b.go(T + '#/', 1.5)
            b.js('localStorage.clear()')
            b.cmd('Page.reload'); b.pump(1.5)
            b.click('input[name="route"][value="java"]')
            b.click('button[value="skip"]', wait=0.8)
            for i, d in enumerate((d1, d2, d3)):
                b.go(f'?today=2026-11-0{i + 1}#/day/{d}', 0.8)
                n = b.js('document.querySelectorAll(".card").length')
                for k in range(n):
                    b.click('.card [data-action="reveal"]', index=k)
                    b.click('.card [data-action="rate"]', index=k * 3 + 2)
                b.click('[data-action="toggle-done"]', wait=0.5)
            st = b.state()
            assert set(st['done']) == {d1, d2, d3}, st['done']
            assert {q_rephrase, q_points, q_delete} <= set(st['cards'])
            b.go(T + '#/', 1.2)
            assert not b.js('!!document.querySelector(".update")'), '第一版不应提示更新'
            assert b.js('navigator.serviceWorker.ready.then(r => !!r.active)')

        before = {}

        @step('笔记更新：改问法、改要点、加题、删题、插入一天、链接到的小节改名')
        def _():
            st = b.state()
            before.update(cards=st['cards'], done=st['done'])
            path = src / 'notes' / JAVA
            text = path.read_text()
            # 第 1 天第 2 题换个问法
            text = edit_day(text, 1, lambda blk: blk.replace('2. String 为什么设计成不可变的？', '2. String 被设计成不可变的，有哪些好处？', 1))
            # 第 1 天的导读补一句：学过这一天的读者会看到“调整了导读或阅读范围”
            text = edit_day(text, 1, lambda blk: re.sub(r'^(### 第 1 天：[^\n]*\n\n)([^\n]+)', lambda m: m[1] + m[2] + '先看包装类型，再看 String。', blk, count=1, flags=re.M))
            # 第 2 天第 1 题的参考要点补一句
            def more_points(blk):
                asks, points = questions_of(blk)
                return blk.replace(f'1. {points[0][1]}', f'1. {points[0][1]}（补充：运行时常量池在方法区。）', 1)
            text = edit_day(text, 2, more_points)
            # 第 2 天加一道题
            def add_question(blk):
                asks, points = questions_of(blk)
                n = len(asks) + 1
                last_ask, last_point = f'{asks[-1][0]}. {asks[-1][1]}', f'{points[-1][0]}. {points[-1][1]}'
                blk = blk.replace(last_ask, last_ask + f'\n{n}. 字符串常量池在 JDK 7 之后放在哪里？（见[String Pool](Java%20基础.md#string-pool)）', 1)
                return blk.replace(last_point, last_point + f'\n{n}. JDK 7 起字符串常量池从永久代移到堆中，可以被垃圾收集。', 1)
            text = edit_day(text, 2, add_question)
            # 第 3 天删掉第 3 题和它的要点
            def drop_question(blk):
                asks, points = questions_of(blk)
                blk = re.sub(r'^3\. ' + re.escape(asks[2][1]) + r'\n', '', blk, count=1, flags=re.M)
                return re.sub(r'^3\. ' + re.escape(points[2][1]) + r'\n', '', blk, count=1, flags=re.M)
            text = edit_day(text, 3, drop_question)
            # 第 3 天后插入一天，后面的天依次加一
            for n in sorted((int(m) for m in re.findall(r'^### 第 (\d+) 天：', text, re.M)), reverse=True):
                if n >= 4:
                    text = re.sub(rf'^### 第 {n} 天：', f'### 第 {n + 1} 天：', text, count=1, flags=re.M)
            a, _ = day_block(text, 5)
            new_day = ('### 第 4 天：包装类型与自动装箱\n\n先弄清自动装箱调用的方法，再看缓存池。\n\n'
                       '阅读：《Java 基础》的[缓存池](Java%20基础.md#缓存池)。\n\n自测：\n\n'
                       '1. 自动装箱和拆箱分别调用了什么方法？（见[缓存池](Java%20基础.md#缓存池)）\n\n'
                       '<details>\n<summary>参考要点</summary>\n\n1. 装箱调用 valueOf()，拆箱调用 intValue() 这类方法；对 null 拆箱会抛出 NullPointerException。\n\n</details>\n\n')
            text = text[:a] + new_day + text[a:]
            path.write_text(text)
            # 一道题链接到的小节在笔记中改了名，但路线还没跟着改
            note = src / 'notes' / 'Java 基础.md'
            note.write_text(note.read_text().replace('### 不可变的好处', '### String 不可变的好处', 1))
            report = deploy()
            assert any('小节不存在，已改为链接到文章开头' in w for w in report['warnings']), report['warnings']
            pending = report['pending']
            assert pending['added'] == {'questions': 2, 'days': 1, 'routes': 0}, pending
            assert pending['retired']['questions'] == 1 and pending['edited']['questions'] >= 2, pending
            data = json.loads((site / 'learn' / 'data.json').read_text())
            assert q_rephrase in data['questions'] and data['questions'][q_rephrase]['text'] == 'String 被设计成不可变的，有哪些好处？'
            assert q_delete not in data['questions'] and q_delete in data['retired']['questions']
            link = data['questions'][q_rephrase]['links'][0]['href']
            assert link.endswith('Java%20%E5%9F%BA%E7%A1%80'), link
            assert data['updates'][-1]['date'] is None

        @step('打开着的页面提示刷新，刷新后记录都在')
        def _():
            # 读者把页面切回前台时检查更新
            b.js('navigator.serviceWorker.getRegistration().then(r => r.update())')
            b.pump(3)
            assert b.js('!!document.getElementById("update-bar")'), '没有出现刷新提示'
            b.click('#update-bar button', wait=2)
            st = b.state()
            assert st['version'] == 2
            assert st['cards'][q_rephrase] == before['cards'][q_rephrase], '改了问法的题丢了复习记录'
            assert st['cards'][q_points] == before['cards'][q_points]
            assert set(st['done']) == {d1, d2, d3}, st['done']
            assert st['archive']['cards'][q_delete] == before['cards'][q_delete]
            assert q_delete not in st['cards']

        @step('首页说明这次更新：学过的天新增 1 道题、路线新增 1 天、2 道练过的题改了、1 道下线、学过的 1 天改了导读')
        def _():
            b.go(T + '#/', 1.2)
            panel = b.text('.update')
            assert '你学过的天里新增了 1 道题' in panel, panel
            assert '新增了 1 天：第 4 天：包装类型与自动装箱' in panel, panel
            assert '有 2 道改了问法或参考要点' in panel and '1 道练过的题已下线' in panel, panel
            assert b.js(f'!!document.querySelector(".update a[href=\'#/q/{q_rephrase}\']")'), '修改的题没有链接'
            assert '你学过的 1 天调整了导读或阅读范围：第 1 天' in panel, panel
            # 新插入的一天排在计划最前面，原来的第 4 天变成第 5 天，编号不变
            data = json.loads((site / 'learn' / 'data.json').read_text())
            assert data['days'][d4]['n'] == 5
            assert '第 4 天：包装类型与自动装箱' in b.text('.hero h2') or '第 4 天' in b.text('.panel'), b.text()[:400]
            b.click('.update a[href="#/new"]', wait=0.8)
            assert b.text('h1') == '练习新题' and b.text('.progress-line span') == '1 / 1'
            assert '字符串常量池' in b.text('.card .q')
            b.click('.card [data-action="reveal"]')
            b.click('.card [data-rating="2"]', wait=0.8)
            assert '新题练完了' in b.text('h1')
            b.go(T + '#/', 1)
            # 练完之后，与读者有关的只剩修改和下线，点“知道了”后不再出现
            assert '新增了 1 道题' not in b.text('.update')
            b.click('[data-action="dismiss-update"]')
            b.go(T + '#/', 1)
            assert not b.js('!!document.querySelector(".update")')

        @step('下线的题和天的链接给出说明，数据页显示归档的记录，导出导入后归档还在')
        def _():
            b.go(T + f'#/q/{q_delete}', 0.8)
            assert '这道题已下线' in b.text('h1')
            b.go(T + '#/data', 0.8)
            assert '1 道题、0 天的记录属于已经下线的内容' in b.text(), b.text()[:500]
            b.click('[data-action="export"]', wait=1.2)
            exported = json.load(open(os.path.join(b.downloads, os.listdir(b.downloads)[0])))
            assert q_delete in exported['archive']['cards'] and exported['seenUpdate'] >= 1

        @step('维护者：严格检查发现改名的小节，修好后写入 lock，更新记录带上日期')
        def _():
            code, out = maintain()
            assert code == 1 and '小节不存在' in out, out
            code, out = maintain('--write', '--date', '2026-11-05')
            assert code == 1 and '没有写入' in out, out
            path = src / 'notes' / JAVA
            path.write_text(path.read_text().replace('Java%20基础.md#不可变的好处', 'Java%20基础.md#string-不可变的好处'))
            code, out = maintain('--write', '--date', '2026-11-05')
            assert code == 0 and '更新记录第' in out, out
            assert '修改题目' in out and '新增天' in out and '下线题目' in out, out
            report = deploy()
            assert report['pending'] is None and not report['warnings'], report
            data = json.loads((site / 'learn' / 'data.json').read_text())
            assert data['updates'][-1]['date'] == '2026-11-05'
            # 只是把同一次更新写进了 lock，已经看过的读者不会再看到提示
            b.js('navigator.serviceWorker.getRegistration().then(r => r.update())')
            b.pump(3)
            b.go(T + '#/', 0.3); b.cmd('Page.reload'); b.pump(1.5)
            assert not b.js('!!document.querySelector(".update")'), b.text('.update')
            assert 'String 不可变的好处' in json.dumps(data['questions'][q_rephrase]['links'], ensure_ascii=False) or \
                data['questions'][q_rephrase]['links'][0]['href'].endswith('?id=string-%E4%B8%8D%E5%8F%AF%E5%8F%98%E7%9A%84%E5%A5%BD%E5%A4%84')

        @step('删掉的题加回来：编号不变，归档的复习记录自动恢复')
        def _():
            path = src / 'notes' / JAVA
            text = path.read_text()
            original = (REPO / 'notes' / JAVA).read_text()
            a, z = day_block(original, 3)
            text = edit_day(text, 3, lambda blk: original[a:z])
            path.write_text(text)
            code, out = maintain('--write', '--date', '2026-11-06')
            assert code == 0 and '恢复题目 ' + q_delete in out, out
            deploy()
            b.js('navigator.serviceWorker.getRegistration().then(r => r.update())')
            b.pump(3)
            b.go(T + '#/', 0.3); b.cmd('Page.reload'); b.pump(1.5)
            st = b.state()
            assert st['cards'][q_delete] == before['cards'][q_delete] and q_delete not in st['archive']['cards'], st['archive']
            assert not b.js('!!document.querySelector(".update")'), '恢复的题读者已有记录，不需要提示'

        @step('下线大模型路线：在学这条路线的读者看到换路线的提示，记录保留')
        def _():
            other = Browser(base, 390, 844, mobile=True, port=9393)
            try:
                other.go(T + '#/', 1.5)
                other.js('localStorage.clear()')
                other.cmd('Page.reload'); other.pump(1.5)
                other.click('input[name="route"][value="llm"]')
                other.click('button[value="skip"]', wait=0.8)
                data = json.loads((site / 'learn' / 'data.json').read_text())
                llm_day = data['routes'][1]['stages'][0]['days'][0]
                other.go(T + f'#/day/{llm_day}', 0.8)
                other.click('.card [data-action="reveal"]')
                other.click('.card [data-rating="2"]')
                config = json.loads(routes.read_text())
                config['routes'] = [r for r in config['routes'] if r['id'] != 'llm']
                routes.write_text(json.dumps(config, ensure_ascii=False))
                code, out = maintain('--write', '--date', '2026-11-07')
                assert code == 0 and '下线路线 llm' in out, out
                deploy()
                other.js('navigator.serviceWorker.getRegistration().then(r => r.update())')
                other.pump(3)
                other.go(T + '#/', 0.3); other.cmd('Page.reload'); other.pump(1.5)
                assert other.text('h1') == '选一条新的路线', other.text()[:200]
                assert '“大模型应用开发”路线已经下线' in other.text()
                st = other.state()
                assert st['profile'] is None and st['archive']['profile']['route'] == 'llm' and st['archive']['cards']
                other.click('input[name="route"][value="sprint"]')
                other.click('button[value="skip"]', wait=0.8)
                st = other.state()
                assert st['profile']['route'] == 'sprint' and st['archive']['profile'] is None
                assert other.js('document.documentElement.scrollWidth') <= 390
                assert not other.errors, other.errors
            finally:
                other.close()

        @step('另一个标签页用更新版本的学习站保存过记录：旧页面只读，提示刷新，不覆盖记录')
        def _():
            newer = dict(b.state(), version=99)
            raw = json.dumps(newer)
            b.js(f'localStorage.setItem("cs-learn-v1", {json.dumps(raw)})')
            b.cmd('Page.reload'); b.pump(1.5)
            assert '新版本的学习站更新' in b.text('#update-bar'), b.text('#update-bar')
            b.go(T + '#/setup', 0.6)
            b.click('input[name="route"][value="sprint"]')
            b.click('button[value="skip"]', wait=0.6)
            assert b.js('localStorage.getItem("cs-learn-v1")') == raw, '旧页面覆盖了新版本的记录'
            b.js(f'localStorage.setItem("cs-learn-v1", {json.dumps(json.dumps(dict(newer, version=2)))})')

        @step('全程没有脚本错误')
        def _():
            assert not b.errors, b.errors
    finally:
        b.close()
        server.shutdown()
        shutil.rmtree(work, ignore_errors=True)
    print(f'维护场景测试通过：{len(passed)} 项。')


if __name__ == '__main__':
    try:
        main()
    except AssertionError:
        import traceback
        traceback.print_exc()
        sys.exit(1)

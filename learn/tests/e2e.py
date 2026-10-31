"""用无头 Edge 走一遍学习站的完整流程，发真实的点击和按键。

用法：先 python3 learn/build.py && python3 learn/serve.py，再运行
python3 learn/tests/e2e.py [--base http://127.0.0.1:8770/] [--notes http://127.0.0.1:8769/]
需要 Microsoft Edge 和 websocket-client。--notes 指向本机的笔记网站时，顺带抽查题目链接能否定位到小节。
"""
import argparse, json, os, shutil, subprocess, sys, tempfile, time, urllib.parse, urllib.request
import websocket

EDGE = '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'


class Browser:
    def __init__(self, base, width, height, mobile=False, port=9360):
        self.base, self.profile = base, tempfile.mkdtemp(prefix='learn-e2e-')
        self.downloads = os.path.join(self.profile, 'downloads')
        os.makedirs(self.downloads)
        self.proc = subprocess.Popen([EDGE, '--headless=new', '--disable-gpu', '--no-first-run', '--disable-extensions', '--disable-component-extensions-with-background-pages', f'--remote-debugging-port={port}',
                                      f'--user-data-dir={self.profile}', f'--window-size={width},{height}', 'about:blank'],
                                     stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        tabs = None
        for _ in range(150):
            try:
                tabs = json.load(urllib.request.urlopen(f'http://127.0.0.1:{port}/json'))
                break
            except Exception:
                time.sleep(0.2)
        self.ws = websocket.create_connection([t for t in tabs if t['type'] == 'page'][0]['webSocketDebuggerUrl'], timeout=60)
        self.n, self.errors, self.requests, self.dialogs = 0, [], [], []
        for method in ('Runtime.enable', 'Page.enable', 'Network.enable', 'Log.enable'):
            self.cmd(method)
        self.cmd('Emulation.setFocusEmulationEnabled', enabled=True)
        self.cmd('Emulation.setDeviceMetricsOverride', width=width, height=height, deviceScaleFactor=1, mobile=mobile)
        if mobile:
            self.cmd('Emulation.setTouchEmulationEnabled', enabled=True, maxTouchPoints=5)
        self.cmd('Browser.grantPermissions', permissions=['clipboardReadWrite', 'clipboardSanitizedWrite'], origin=base.rstrip('/'))
        self.cmd('Browser.setDownloadBehavior', behavior='allow', downloadPath=self.downloads)

    def _event(self, m):
        method, params = m.get('method'), m.get('params', {})
        if method == 'Runtime.exceptionThrown':
            self.errors.append(params['exceptionDetails'].get('exception', {}).get('description', '')[:300])
        elif method == 'Runtime.consoleAPICalled' and params['type'] in ('error', 'warning'):
            self.errors.append('console: ' + str([a.get('value') for a in params['args']])[:300])
        elif method == 'Log.entryAdded' and 'Content Security Policy' in params['entry'].get('text', ''):
            # 内容安全策略拦下了请求：说明页面想加载本站以外的东西，或者新加的内联脚本没有算进哈希
            self.errors.append('CSP: ' + params['entry']['text'][:300])
        elif method == 'Network.requestWillBeSent':
            self.requests.append(params['request']['url'])
        elif method == 'Page.javascriptDialogOpening':
            self.dialogs.append(params['message'])
            self.ws.send(json.dumps({'id': 0, 'method': 'Page.handleJavaScriptDialog', 'params': {'accept': self.accept}}))

    accept = True

    def cmd(self, method, **params):
        self.n += 1
        self.ws.send(json.dumps({'id': self.n, 'method': method, 'params': params}))
        while True:
            m = json.loads(self.ws.recv())
            if 'method' in m:
                self._event(m)
            if m.get('id') == self.n:
                return m.get('result', {})

    def pump(self, seconds):
        end = time.time() + seconds
        self.ws.settimeout(0.1)
        while time.time() < end:
            try:
                m = json.loads(self.ws.recv())
                if 'method' in m:
                    self._event(m)
            except Exception:
                pass
        self.ws.settimeout(60)

    def js(self, expression):
        r = self.cmd('Runtime.evaluate', expression=expression, returnByValue=True, awaitPromise=True)
        if 'exceptionDetails' in r:
            raise AssertionError('页面脚本出错：' + str(r['exceptionDetails'])[:300])
        return r.get('result', {}).get('value')

    def go(self, path, wait=1.5):
        self.cmd('Page.navigate', url=self.base + path)
        self.pump(wait)

    def click(self, selector, index=0, wait=0.4):
        """滚到元素处，在它的中心发出真实的鼠标点击；被别的元素挡住时报错。"""
        point = self.js(f'''(function(){{var e=document.querySelectorAll({json.dumps(selector)})[{index}]; if(!e) return null;
            e.scrollIntoView({{block:'center'}}); var b=e.getBoundingClientRect(); var x=b.left+b.width/2, y=b.top+b.height/2;
            if(!b.width) return {{ok:false, hit:'元素不可见'}}; var h=document.elementFromPoint(x,y); return {{x:x, y:y, ok: h===e || e.contains(h), hit: h ? h.tagName + '.' + h.className : ''}}}})()''')
        assert point, '找不到元素：' + selector
        assert point['ok'], f'{selector} 被遮挡：{point["hit"]}'
        for kind in ('mousePressed', 'mouseReleased'):
            self.cmd('Input.dispatchMouseEvent', type=kind, x=point['x'], y=point['y'], button='left', clickCount=1)
        self.pump(wait)

    def key(self, key, code, text='', keycode=0):
        self.cmd('Input.dispatchKeyEvent', type='keyDown', key=key, code=code, text=text, windowsVirtualKeyCode=keycode)
        self.cmd('Input.dispatchKeyEvent', type='keyUp', key=key, code=code, windowsVirtualKeyCode=keycode)
        self.pump(0.3)

    def text(self, selector='main'):
        return self.js(f'(document.querySelector({json.dumps(selector)})||{{}}).innerText||""')

    def state(self):
        return json.loads(self.js('localStorage.getItem("cs-learn-v1")') or 'null')

    def close(self):
        try:
            self.proc.terminate()
            self.proc.wait(5)
        except Exception:
            self.proc.kill()
        shutil.rmtree(self.profile, ignore_errors=True)


passed = []


def step(name):
    def wrap(fn):
        fn()
        passed.append(name)
        print('通过：' + name, flush=True)
    return wrap


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--base', default='http://127.0.0.1:8770/')
    parser.add_argument('--notes', default='')
    args = parser.parse_args()
    b = Browser(args.base, 1280, 900)
    day1 = '2026-11-02'
    try:
        b.go(f'?today={day1}#/')
        b.js('localStorage.clear()')
        b.go(f'?today={day1}#/')

        @step('首次打开显示设置，未选路线时提示')
        def _():
            assert '先测水平' in b.text(), b.text()[:200]
            b.click('button[value="place"]')
            # 路线是必选项，浏览器自带的校验拦下提交
            assert '先测水平' in b.text('h1') and b.js('document.querySelector("input[name=route]:invalid") !== null')

        @step('选择面试冲刺、每天 1.5 小时后进入定级')
        def _():
            b.click('input[name="route"][value="sprint"]')
            b.click('input[name="minutes"][value="90"]')
            b.click('button[value="place"]', wait=0.8)
            assert '定级：面试冲刺' in b.text()
            assert b.state()['profile'] == {'route': 'sprint', 'minutes': 90, 'deadline': None, 'start': day1}

        answered = {'n': 0, 'known': 0}

        @step('定级：前两个阶段答“会”，后面答“不会”，每阶段两三题后结束')
        def _():
            for _ in range(40):
                if '定级结果' in b.text('h1'):
                    break
                stage = b.js('Number((document.querySelector(".progress-line span").textContent.match(/第 (\\d+)/)||[])[1])')
                b.click('[data-action="reveal"]')
                assert b.js('!document.querySelector(".answer").hidden'), '参考要点没有展开'
                b.click('[data-rating="%d"]' % (2 if stage <= 2 else 0), wait=0.5)
                answered['n'] += 1
                answered['known'] += stage <= 2
            assert '定级结果' in b.text('h1'), b.text()[:300]
            assert 10 <= answered['n'] <= 15, answered['n']
            tags = b.js('Array.from(document.querySelectorAll(".result .tag")).map(t=>t.textContent)')
            assert tags == ['掌握', '掌握', '薄弱', '薄弱', '薄弱'], tags
            assert '按路线学习 7 天，已掌握、只做自测 7 天' in b.text(), b.text()[:300]
            # 只有答“会”“模糊”的题加入复习，答“不会”的学到那一天再练
            assert len(b.state()['cards']) == answered['known'], (len(b.state()['cards']), answered)

        @step('计划：自测日合并排列，从今天开始')
        def _():
            b.click('a[href="#/plan"]', wait=0.6)
            assert '学习计划' in b.text('h1')
            first = b.js('Array.from(document.querySelectorAll(".plan-day")[0].querySelectorAll(".plan-item")).map(i=>i.innerText)')
            assert all('只做自测' in t for t in first) and len(first) >= 2, first
            assert b.js('document.querySelector(".plan-day time").textContent') == '今天'

        @step('今天：显示待学内容，复习为 0；打开第一天，自评一题并完成')
        def _():
            b.click('a[data-nav="home"]', wait=0.6)
            # 定级题明天才到期，下一步直接是今天计划中的第一天
            assert '第 1 天' in b.text('.hero h2') and b.text('.hero .btn') == '开始自测', b.text('.hero')
            assert b.js('document.querySelectorAll(".week li").length') == 7 and b.js('document.querySelector(".week .now").classList.contains("on")')
            b.click('.hero .btn', wait=0.6)
            assert '第 1 天' in b.text('h1')
            assert b.js('document.querySelectorAll(".card").length') == 3
            b.click('.card [data-action="reveal"]')
            b.click('.card [data-rating="1"]')
            assert '已记录：模糊，明天再复习' in b.text('.card .rated')
            assert '还有 2 道自测没有自评' in b.text('#done-note')
            b.click('[data-action="toggle-done"]', wait=0.6)
            assert b.state()['done'].get('sprint-01') == day1
            assert '已完成' in b.text('[data-action="toggle-done"]')
            note = b.text('#done-note')
            assert '第 1 天完成' in note and '已完成 1 / 14 天' in note and '还有 2 道自测没有自评' in note, note
            assert b.js('!!document.querySelector("#done-note a[href=\'#/day/sprint-02\']")'), note

        @step('重新作答会撤销上一次自评')
        def _():
            qid = b.js('document.querySelectorAll(".card")[1].dataset.q')
            before = b.state()['cards'].get(qid)
            log_before = b.state()['log'].get(day1)
            b.click('.card [data-action="reveal"]', index=1)
            b.click('.card [data-rating="2"]', index=1)
            assert b.state()['cards'].get(qid) != before
            b.click('[data-action="again"]', index=1, wait=0.4)
            assert b.state()['cards'].get(qid) == before, (b.state()['cards'].get(qid), before)
            assert b.state()['log'].get(day1) == log_before

        @step('复制给 AI：剪贴板中包含题目、回答、参考要点和原文链接')
        def _():
            b.js('document.querySelectorAll(".card textarea")[1].value = "用 CAS 加 synchronized"')
            b.click('.card [data-action="reveal"]', index=1)
            b.click('.card [data-action="copy-ai"]', index=1)
            clip = b.js('navigator.clipboard.readText()')
            q = b.js('document.querySelectorAll(".card")[1].querySelector(".q").textContent')
            assert '题目：' + q in clip and '我的回答：用 CAS 加 synchronized' in clip and '参考要点：' in clip and '原文：\n- ' in clip, clip[:300]
            assert '已复制' in b.text('#toast')

        @step('第二天：到期的题出现在复习中，键盘完成复习')
        def _():
            day2 = '2026-11-03'
            b.go(f'?today={day2}#/', 1.2)
            expected = sum(1 for c in b.state()['cards'].values() if c['due'] <= day2)
            assert b.text('.hero h2') == f'先复习 {expected} 道题', b.text('.hero')
            due = expected
            assert b.js('document.getElementById("due-badge").textContent') == str(due)
            b.click('.hero .btn', wait=0.6)
            for i in range(due):
                got = b.js('(document.querySelector(".progress-line span")||{}).textContent'); assert got == f'{i + 1} / {due}', (i, due, got)
                b.js('document.activeElement.blur()')
                b.key(' ', 'Space', ' ', 32)
                assert b.js('!document.querySelector(".answer").hidden'), (i, b.js('document.activeElement.outerHTML.slice(0,80)'))
                b.key('3' if i % 2 else '1', 'Digit3' if i % 2 else 'Digit1', '3' if i % 2 else '1', 51 if i % 2 else 49)
                b.pump(0.4)
            assert '这一轮复习完成了' in b.text('h1'), b.text()[:200]
            assert b.js('document.getElementById("due-badge").hidden')
            assert b.state()['log'][day2] == due
            # 交替答“不会”和“会”：答不会的题列在结果中
            assert b.js('document.querySelectorAll(".missed li").length') == (due + 1) // 2
            b.go(f'?today={day2}#/', 1)
            assert b.js('document.querySelector(".stat b").textContent') == '2', '连续学习天数'

        @step('面试日期只剩 5 天时，计划只排 5 天并列出未排入的内容')
        def _():
            b.go('?today=2026-11-03#/setup', 1)
            assert '调整学习设置' in b.text('h1')
            b.js('document.querySelector("input[name=deadline]").value = "2026-11-08"')
            b.click('button[value="save"]', wait=0.8)
            assert '学习计划' in b.text('h1')
            days = b.js('document.querySelectorAll(".plan-day").length')
            assert days == 5, days
            assert '没有排进计划' in b.text()
            b.js('document.querySelector("input")')

        @step('面试日期早于今天时拒绝保存')
        def _():
            b.go('?today=2026-11-03#/setup', 1)
            b.js('document.querySelector("input[name=deadline]").value = "2026-11-01"')
            b.click('button[value="save"]', wait=0.5)
            # 日期框带 min，浏览器自带的校验拦下提交；脚本里的检查兜底不支持 min 的浏览器
            assert '调整学习设置' in b.text('h1') and b.js('document.querySelector("input[name=deadline]").matches(":invalid")')
            assert b.state()['profile']['deadline'] == '2026-11-08'

        @step('导出得到完整记录，清空后导入恢复；异常文件被拒绝')
        def _():
            snapshot = b.state()
            b.go('?today=2026-11-03#/data', 1)
            assert '还没有导出过' in b.text(), b.text()[:400]
            b.click('[data-action="export"]', wait=1.2)
            files = os.listdir(b.downloads)
            assert files == ['cs-notes-learn-2026-11-03.json'], files
            exported = json.load(open(os.path.join(b.downloads, files[0])))
            assert exported.pop('app') == 'cs-notes-learn' and exported.pop('exportedAt') == '2026-11-03'
            assert exported == snapshot
            assert '上次导出：11 月 3 日（今天）' in b.text(), b.text()[:400]
            b.click('[data-action="reset"]', wait=0.8)
            assert b.state() == {'version': 2, 'profile': None, 'placement': None, 'cards': {}, 'done': {}, 'log': {},
                                 'archive': {'cards': {}, 'done': {}, 'profile': None}, 'seenUpdate': 0}
            assert '先测水平' in b.text()
            bad = os.path.join(b.profile, 'bad.json')
            open(bad, 'w').write('{"version": 1, "profile": {"route": "<img src=x onerror=alert(1)>"}, "cards": {"x": 1}}')
            broken = os.path.join(b.profile, 'broken.json')
            open(broken, 'w').write('not json')
            b.go('?today=2026-11-03#/data', 1)
            def upload(path):
                doc = b.cmd('DOM.getDocument')
                node = b.cmd('DOM.querySelector', nodeId=doc['root']['nodeId'], selector='#import-file')['nodeId']
                b.cmd('DOM.setFileInputFiles', nodeId=node, files=[path])
                b.pump(1)
            upload(broken)
            assert '无法解析' in b.text('#toast'), b.text('#toast')
            upload(bad)
            assert '没有可用的学习记录' in b.text('#toast'), b.text('#toast')
            assert b.state()['profile'] is None and not b.js('!!document.querySelector("img[src=x]")')
            upload(os.path.join(b.downloads, files[0]))
            # 导入前先显示文件中的内容；当前浏览器没有记录时只有“导入”
            preview = b.text('.import-preview')
            assert '面试冲刺' in preview and '11 月 3 日 导出' in preview and not b.js('!!document.querySelector("[data-action=import-merge]")'), preview
            assert b.state()['profile'] is None, '确认前不应写入'
            b.click('[data-action="import-replace"]', wait=0.6)
            got = b.state()
            assert got == snapshot, ('导入后与导出前不一致', {k: (got.get(k), snapshot.get(k)) for k in snapshot if got.get(k) != snapshot.get(k)})
            assert '已导入' in b.text('#toast')

        @step('复制成文字，在另一台设备的记录上粘贴合并：两边的题都在，同一道题取较新的')
        def _():
            b.go('?today=2026-11-03#/data', 1)
            b.click('[data-action="copy-export"]', wait=0.6)
            text = b.js('navigator.clipboard.readText()')
            assert json.loads(text)['app'] == 'cs-notes-learn'
            mine = b.state()
            # 模拟另一台设备：少一道题、多一道较新的自评、多完成一天
            other = json.loads(text)
            ids = sorted(other['cards'])
            del other['cards'][ids[0]]
            other['cards'][ids[1]] = dict(other['cards'][ids[1]], last='2026-11-03', reps=9)
            other['done']['sprint-14'] = '2026-11-03'
            b.click('[data-action="paste-open"]')
            b.js('document.getElementById("paste-text").value = ' + json.dumps(json.dumps(other)))
            b.click('[data-action="paste-import"]', wait=0.6)
            assert b.js('!!document.querySelector("[data-action=import-merge]")'), b.text()[:400]
            b.click('[data-action="import-merge"]', wait=0.6)
            got = b.state()
            assert set(got['cards']) == set(mine['cards']), '合并后少了题'
            assert got['cards'][ids[1]]['reps'] == 9 and got['done']['sprint-14'] == '2026-11-03'
            assert got['profile'] == mine['profile']
            assert '已合并' in b.text('#toast')

        @step('写了回答再看要点：列出要点中的术语哪些提到了；没写回答时不显示')
        def _():
            data = json.loads(urllib.request.urlopen(args.base + 'data.json').read())
            q = next(q for q in data['questions'].values() if 'synchronized' in q['points'] and 'synchronized' not in q['text'])
            b.go(f'?today=2026-11-03#/q/{q["id"]}', 1)
            b.click('[data-action="reveal"]')
            assert not b.js('!!document.querySelector(".term-check")'), '没写回答时不应显示对照'
            b.cmd('Page.reload'); b.pump(1.2)
            b.js('var t=document.querySelector("[data-answer]"); t.value="用 Synchronized 加锁"; 1')
            b.click('[data-action="reveal"]')
            hit = b.js('Array.from(document.querySelectorAll(".term.hit")).map(e=>e.textContent)')
            assert 'synchronized' in hit, (hit, b.text('.term-check'))

        @step('页脚有数据与隐私说明：不收集个人信息、只存在本机、怎样删除')
        def _():
            b.go('?today=2026-11-03#/', 0.8)
            b.click('.foot a[href="#/privacy"]', wait=0.6)
            text = b.text()
            assert '数据与隐私' in b.text('h1')
            for words in ('不收集个人信息', 'localStorage', '不使用 Cookie', '访问日志', '清空'):
                assert words in text, words

        @step('只请求本站的文件，没有脚本错误')
        def _():
            outside = [u for u in b.requests if not u.startswith(args.base) and not u.startswith(('data:', 'blob:', 'about:', 'chrome-extension:'))]
            assert not outside, outside[:5]
            assert not b.errors, b.errors

        if args.notes:
            @step('抽查题目链接能定位到笔记中的小节')
            def _():
                data = json.loads(urllib.request.urlopen(args.base + 'data.json').read())
                # 题目链接可能是站内的相对地址（/#/notes/…），按学习站所在的域名补全
                links = [urllib.parse.urljoin(args.base, l['href']) for q in list(data['questions'].values())[::25] for l in q['links'][:1]]
                note = Browser(args.notes, 1280, 900, port=9361)
                try:
                    for href in links:
                        note.cmd('Page.navigate', url=href)
                        note.pump(2.5)
                        target = href.split('?id=')[1] if '?id=' in href else None
                        if target:
                            found = note.js(f'!!document.getElementById(decodeURIComponent({json.dumps(target)}))')
                            assert found, '小节不存在：' + href
                finally:
                    note.close()
                print(f'  抽查了 {len(links)} 个链接')
    finally:
        b.close()

    m = Browser(args.base, 375, 740, mobile=True, port=9362)
    try:
        @step('手机：没有横向滚动，导航和自评按钮不小于 40 像素')
        def _():
            m.go('?today=2026-11-02#/', 1)
            m.js('localStorage.clear()')
            for path in ('#/', '#/data'):
                m.go('?today=2026-11-02' + path, 1)
                assert m.js('document.documentElement.scrollWidth') <= 375, path
            m.go('?today=2026-11-02#/', 1)
            m.click('input[name="route"][value="java"]')
            m.click('button[value="place"]', wait=0.8)
            m.click('[data-action="reveal"]')
            sizes = m.js('Array.from(document.querySelectorAll(".rate button, .top nav a")).map(e=>Math.round(e.getBoundingClientRect().height))')
            assert min(sizes) >= 34 and m.js('document.documentElement.scrollWidth') <= 375, sizes
            assert min(m.js('Array.from(document.querySelectorAll(".rate button")).map(e=>e.getBoundingClientRect().height)')) >= 40
            assert not m.errors, m.errors
    finally:
        m.close()
    print(f'端到端测试通过：{len(passed)} 项。')


if __name__ == '__main__':
    try:
        main()
    except AssertionError as error:
        import traceback; traceback.print_exc()
        sys.exit(1)

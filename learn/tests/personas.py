"""按几类真实用户的使用方式走学习站，每一步都用真实的点击和按键，记录遇到的问题。

用法：python3 learn/tests/personas.py [--base http://127.0.0.1:8770/]
- 访客：手机上打开别人分享的一道题，作答后开始定级；
- 长期学习：Java 路线连续 20 天，每天按首页的“下一步”做完复习和当天内容，最后看进度、生成分享图、导出日历；
- 回归：中断 12 天后回来，复习分批进行；
- 模拟面试：完成一轮，结果中列出答不上的题；
- 离线：载入一次后断网刷新，仍能使用。
"""
import argparse, json, os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from e2e import Browser, passed, step  # noqa: E402

def add_days(d, n):
    import datetime
    return (datetime.date.fromisoformat(d) + datetime.timedelta(days=n)).isoformat()


def follow_next_step(b, today, rating_of, limit=40):
    """在首页反复点“下一步”，直到今天的任务完成；返回这一天的点击次数和做过的事。"""
    clicks, did = 0, []
    for _ in range(limit):
        b.go(f'?today={today}#/', 0.8)
        hero = b.text('.hero')
        if '今天的任务完成了' in hero or '全部完成' in hero or not b.js('!!document.querySelector(".hero .btn.primary")'):
            return clicks, did
        label = b.text('.hero .btn.primary'); print('      ', today, label, b.text('.hero h2')) if os.environ.get('DEBUG') else None
        b.click('.hero .btn.primary', wait=0.6)
        clicks += 1
        if label == '开始复习':
            did.append('复习')
            for _ in range(60):
                if not b.js('!!document.querySelector(".card [data-action=reveal]:not([hidden])")'):
                    break
                b.js('document.activeElement.blur()')
                b.key(' ', 'Space', ' ', 32)
                r = rating_of(b.js('document.querySelector(".card").dataset.q'))
                b.key(str(r + 1), f'Digit{r + 1}', str(r + 1), 49 + r)
                b.pump(0.35)
                clicks += 2
            assert '这一轮复习完成了' in b.text('h1'), b.text()[:200]
        elif label in ('开始学习', '开始自测'):
            did.append(b.text('h1').split('：')[0])
            n = b.js('document.querySelectorAll(".card").length')
            for i in range(n):
                qid = b.js(f"document.querySelectorAll('.card')[{i}].dataset.q")
                b.click('.card [data-action="reveal"]', index=i)
                # 每张题卡依次是“不会、模糊、会”三个按钮
                b.click('.card [data-action="rate"]', index=i * 3 + rating_of(qid))
                clicks += 2
            assert '还有' not in b.text('#done-note'), b.text('#done-note')
            b.click('[data-action="toggle-done"]', wait=0.5)
            clicks += 1
        else:
            raise AssertionError('没有预料到的下一步：' + label)
    raise AssertionError('一天之内的下一步没有结束')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--base', default='http://127.0.0.1:8770/')
    args = parser.parse_args()
    data = json.loads(__import__('urllib.request').request.urlopen(args.base + 'data.json').read())
    issues = []

    # ---------- 访客：手机上打开分享的题 ----------
    m = Browser(args.base, 390, 844, mobile=True, port=9390)
    try:
        qid = data['days']['java-08']['questions'][0]
        q = data['questions'][qid]

        @step('访客：打开分享的题，看到题目、作答、自评，再被引导去定级')
        def _():
            m.go(f'?today=2026-11-02#/q/{qid}', 1.5)
            m.js('localStorage.clear()')
            m.go(f'?today=2026-11-02#/q/{qid}', 0.3)
            m.cmd('Page.reload'); m.pump(1.5)
            assert m.text('.card .q') == q['text']
            assert m.js('document.title').startswith(q['text'])
            assert '开始定级' in m.text('.hero'), m.text()[:300]
            m.click('[data-action="reveal"]')
            # 手机上调用系统分享面板；无头浏览器没有面板，换成记录参数
            m.js('window.__shared = []; navigator.share = function (d) { window.__shared.push(d); return Promise.resolve(); }')
            m.click('.card [data-action="share-q"]')
            shared = m.js('window.__shared')
            assert len(shared) == 1 and shared[0]['url'].endswith(f'#/q/{qid}') and q['text'] in shared[0]['text'], shared
            m.click('.card [data-rating="1"]')
            assert m.state()['cards'][qid]['stage'] == 0
            m.click('.hero .btn.primary', wait=0.8)
            assert '先测水平' in m.text('h1')
            assert m.js('document.documentElement.scrollWidth') <= 390
            # 新访客的介绍页：三步说明、示例链接都在
            assert m.js('document.querySelectorAll(".steps li").length') == 3
            assert m.js('!!document.querySelector(".landing a[href^=\'#/q/\']") && !!document.querySelector(".landing a[href=\'#/day/sprint-01\']")')

        @step('访客：不存在的题给出提示，不报错')
        def _():
            m.go('?today=2026-11-02#/q/nope', 0.8)
            assert '没有找到这道题' in m.text('h1')
            assert not m.errors, m.errors
    finally:
        m.close()

    # ---------- 长期学习：Java 路线 20 天 ----------
    b = Browser(args.base, 1280, 900, port=9391)
    start = '2026-11-02'
    try:
        b.go(f'?today={start}#/', 1.5)
        b.js('localStorage.clear()')
        b.cmd('Page.reload'); b.pump(1.2)
        known = {}

        def rating_of(qid):
            # 一位中等水平的读者：按题目编号固定地决定会、模糊、不会，复习过一次后更容易答“会”
            seen = known.get(qid, 0)
            known[qid] = seen + 1
            h = int(qid[:4], 16) % 10
            return 2 if h >= 6 - seen * 2 else 1 if h >= 3 - seen else 0

        @step('长期学习：选 Java 后端、每天 1.5 小时，定级时前 3 个阶段答“会”')
        def _():
            b.click('input[name="route"][value="java"]')
            b.click('input[name="minutes"][value="90"]')
            b.click('button[value="place"]', wait=0.8)
            for _ in range(60):
                if '定级结果' in b.text('h1'):
                    break
                stage = b.js('Number((document.querySelector(".progress-line span").textContent.match(/第 (\\d+)/)||[])[1])')
                b.click('[data-action="reveal"]')
                b.click('[data-rating="%d"]' % (2 if stage <= 3 else 0), wait=0.4)
            assert '定级结果' in b.text('h1')

        log = []

        @step('长期学习：连续 20 天按首页的下一步完成复习和当天内容')
        def _():
            for i in range(20):
                today = add_days(start, i)
                clicks, did = follow_next_step(b, today, rating_of)
                b.go(f'?today={today}#/', 0.6)
                streak = int(b.js('document.querySelector(".stat b").textContent'))
                log.append((today, clicks, did, streak))
                assert streak == i + 1, (today, streak)
                assert not b.errors, b.errors
            for row in log:
                print('   ', row[0], f'{row[1]:>3} 次点击', '、'.join(row[2]))
            done = b.state()['done']
            assert len(done) >= 20, len(done)

        @step('长期学习：进度页的热力图、各阶段掌握和常忘的题与记录一致')
        def _():
            today = add_days(start, 19)
            b.go(f'?today={today}#/progress', 1.5)
            label = b.js('document.querySelector(".heat").getAttribute("aria-label")')
            assert '有 20 天在学习' in label, label
            st = b.state()
            solid = sum(1 for c in st['cards'].values() if c['stage'] >= 2)
            assert f'{solid} /' in b.text('.stats'), (solid, b.text('.stats'))
            rows = b.js('document.querySelectorAll(".mastery").length')
            assert rows == len(data['routes'][0]['stages']), rows
            shaky = b.js('document.querySelectorAll(".missed li").length')
            assert 0 < shaky <= 10, shaky

        @step('分享图：生成 1080×1440 的图片，二维码能扫出本站地址')
        def _():
            b.pump(1)
            size = b.js('(function(){var i=document.getElementById("share-preview");return [i.naturalWidth,i.naturalHeight]})()')
            assert size == [1080, 1440], size
            decoded = b.js('''(async function(){var i=document.getElementById("share-preview");
                var r=await new BarcodeDetector({formats:["qr_code"]}).detect(i); return r.map(x=>x.rawValue)})()''')
            assert decoded == [args.base], decoded
            before = set(os.listdir(b.downloads))
            b.click('[data-action="save-image"]', wait=1.5)
            # 下载完成前文件名带 .crdownload，机器忙时多等一会儿
            for _ in range(20):
                new = set(os.listdir(b.downloads)) - before
                if new and not any(n.endswith('.crdownload') for n in new):
                    break
                b.pump(0.5)
            assert new == {f'cs-notes-learn-{add_days(start, 19)}.png'}, new
            from struct import unpack
            head = open(os.path.join(b.downloads, new.pop()), 'rb').read(24)
            assert head[:8] == b'\x89PNG\r\n\x1a\n' and unpack('>II', head[16:24]) == (1080, 1440)
            b.click('[data-action="share-site"]')
            clip = b.js('navigator.clipboard.readText()')
            assert clip.endswith(args.base) and '免费' in clip, clip

        @step('日历：导出的 .ics 每个计划日一个全天事件，行宽不超过 75 字节')
        def _():
            today = add_days(start, 19)
            b.go(f'?today={today}#/plan', 1)
            days = b.js('document.querySelectorAll(".plan-day").length')
            before = set(os.listdir(b.downloads))
            b.click('[data-action="calendar"]', wait=1.2)
            new = set(os.listdir(b.downloads)) - before
            assert new == {'cs-notes-plan.ics'}, new
            raw = open(os.path.join(b.downloads, 'cs-notes-plan.ics'), 'rb').read()
            text = raw.decode()
            assert text.count('BEGIN:VEVENT') == days, (text.count('BEGIN:VEVENT'), days)
            assert all(len(line) <= 75 for line in raw.split(b'\r\n')), '有超过 75 字节的行'
            assert f'DTSTART;VALUE=DATE:{today.replace("-", "")}' in text
            assert f'URL:{args.base}#/day/java-' in text

        @step('题库：按路线、筛选和关键词找题，结果与记录一致')
        def _():
            today = add_days(start, 19)
            b.go(f'?today={today}#/bank', 1)
            total = len({q for st in data['routes'][0]['stages'] for d in st['days'] for q in data['days'][d]['questions']})
            assert b.text('#bank-count') == f'{total} 道题', b.text('#bank-count')
            b.click('.chip[data-filter="solid"]')
            solid = sum(1 for qid, c in b.state()['cards'].items() if c['stage'] >= 2 and qid in data['questions'] and any(d.startswith('java-') for d in data['questions'][qid]['days']))
            assert b.text('#bank-count') == f'{solid} 道题', (b.text('#bank-count'), solid)
            b.click('.chip[data-filter="all"]')
            b.click('#bank-search')
            for ch in 'volatile':
                b.cmd('Input.insertText', text=ch)
            b.pump(0.5)
            hits = [q for q in {q for st in data['routes'][0]['stages'] for d in st['days'] for q in data['days'][d]['questions']}
                    if 'volatile' in (data['questions'][q]['text'] + ' ' + data['questions'][q]['points']).lower()]
            assert b.text('#bank-count') == f'{len(hits)} 道题' and hits, (b.text('#bank-count'), len(hits))
            b.click('.chip[data-route="llm"]')
            assert b.js('document.querySelector(".chip[data-route=llm]").getAttribute("aria-pressed")') == 'true'
            b.click('#bank-search')
            b.js('document.getElementById("bank-search").value=""; document.getElementById("bank-search").dispatchEvent(new Event("input"))')
            b.pump(0.4)
            b.click('#bank-list a', wait=0.6)
            assert b.js('location.hash').startswith('#/q/') and b.js('document.querySelector("[data-nav=bank]").getAttribute("aria-current")') == 'page'

        @step('模拟面试：8 道题，结果给出得分和需要再看的题，再来一轮换一批题')
        def _():
            today = add_days(start, 19)
            b.go(f'?today={today}#/mock', 1)
            first = []
            for i in range(8):
                assert b.text('.progress-line span') == f'{i + 1} / 8'
                first.append(b.js('document.querySelector(".card").dataset.q'))
                b.click('[data-action="reveal"]')
                b.click('.card [data-rating="%d"]' % (i % 3), wait=0.5)
            assert '模拟面试结束' in b.text('h1')
            assert '得 44 分' in b.text(), b.text()[:300]
            assert b.js('document.querySelectorAll(".missed li").length') == 6
            hot = [data['questions'][q]['heat'] for q in first]
            assert sum(hot) >= 8, hot
            b.click('[data-action="more"]', wait=0.6)
            assert b.text('.progress-line span') == '1 / 8'
            assert b.js('document.activeElement.id') == 'main'

        @step('回归：中断 12 天后回来，复习按每天的时间分批，可以接着复习下一批')
        def _():
            today = add_days(start, 32)
            b.go(f'?today={today}#/', 1)
            due = sum(1 for c in b.state()['cards'].values() if c['due'] and c['due'] <= today)
            hero = b.text('.hero')
            # 积压超过两批：今天复习两批，其余的留到明天，复习完先学今天的内容
            assert due > 36 and '先复习 18 道题' in hero and f'今天复习 36 道（分两批），另外 {due - 36} 道留到明天' in hero, (due, hero)
            assert '欢迎回来，上次学习是 13 天前' in hero, hero
            assert b.js('document.querySelector(".stat b").textContent') == '0', '中断后连续天数应归零'
            b.click('.hero .btn.primary', wait=0.6)
            for _ in range(18):
                b.js('document.activeElement.blur()')
                b.key(' ', 'Space', ' ', 32)
                b.key('3', 'Digit3', '3', 51)
                b.pump(0.35)
            assert '这一轮复习完成了' in b.text('h1')
            assert f'还有 {due - 18} 道到期的题' in b.text(), b.text()[:200]
            b.click('[data-action="more"]', wait=0.6)
            assert b.text('.progress-line span') == f'1 / {min(18, due - 18)}'

        @step('离线：载入后断网刷新，页面和数据照常可用')
        def _():
            today = add_days(start, 32)
            b.go(f'?today={today}#/', 1.5)
            ready = b.js('navigator.serviceWorker.ready.then(r => !!r.active)')
            assert ready
            b.cmd('Page.reload'); b.pump(1.5)
            b.cmd('Network.emulateNetworkConditions', offline=True, latency=0, downloadThroughput=-1, uploadThroughput=-1)
            b.cmd('Page.reload'); b.pump(2)
            assert '今天' in b.text('h1'), b.text()[:200]
            b.click('a[data-nav="plan"]', wait=0.6)
            assert '学习计划' in b.text('h1')
            b.cmd('Network.emulateNetworkConditions', offline=False, latency=0, downloadThroughput=-1, uploadThroughput=-1)

        @step('长期学习全程没有脚本错误，也没有请求外部地址')
        def _():
            errors = [e for e in b.errors if 'net::ERR_INTERNET_DISCONNECTED' not in e]
            assert not errors, errors
            outside = [u for u in b.requests if not u.startswith(args.base) and not u.startswith(('data:', 'blob:', 'about:', 'chrome-extension:'))]
            assert not outside, outside[:5]
    finally:
        b.close()
    print(f'用户场景测试通过：{len(passed)} 项。')


if __name__ == '__main__':
    try:
        main()
    except AssertionError:
        import traceback
        traceback.print_exc()
        sys.exit(1)

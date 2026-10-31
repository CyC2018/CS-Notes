#!/usr/bin/env python3
"""从学习路线生成学习站的数据，并把 src/ 复制到 dist/。

学习路线（notes/学习路线 - *.md）每天有导读、阅读范围、自测题和折叠的参考要点。这里把它们拆成：
- 路线：阶段（二级标题）和每天的安排；
- 题目：自测题的原问法、参考要点、原文链接和热度（链接到的小节带 🔥 的数量）。
不同路线中相同的问题共用一张题卡。题目和天的编号由 content.py 按 content.lock.json 分配，笔记更新后保持不变，
读者的复习记录和完成情况不会因为改了措辞、插入一天或调整顺序而丢失。

用法：python3 learn/build.py [--notes-base URL] [--output DIR] [--lenient]
--lenient 用于和笔记网站一起构建：链接到的小节不存在时改为链接到文章开头、某一天的题目和要点对不上时跳过这一天的题，
只给出警告，不让学习站的问题挡住笔记的发布。单独构建和 maintain.py 默认严格检查。
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import html
import json
import re
import shutil
import sys
import urllib.parse
from collections import Counter
from pathlib import Path

import content

HERE = Path(__file__).resolve().parent
REPO = HERE.parent
sys.path.insert(0, str(REPO / 'website' / 'builder'))
# 笔记网站的构建脚本也叫 build.py，按路径加载，避免和本文件同名冲突
import importlib.util  # noqa: E402
_spec = importlib.util.spec_from_file_location('site_build', REPO / 'website' / 'builder' / 'build.py')
_site = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_site)
# 代码块的正则在新旧版本的网站脚本中位置不同，统一从 build.py 取
github_slug, strip_hot, VERBATIM = _site.github_slug, _site.strip_hot, _site.VERBATIM
from site_assets import heading_slug  # noqa: E402

CONFIG = HERE / 'routes.json'
LOCK = HERE / 'content.lock.json'
# 页面中显示的更新记录条数
HISTORY_SHOWN = 20
# 路线中这些二级标题是说明，不是阶段
INTRO = re.compile(r'^[一二三四]、(说明|开始之前|每天的安排)$')
DAY = re.compile(r'^### 第 (\d+) 天：(.+)$')
LINK = re.compile(r'\[([^\]]+)\]\(([^)\s]+)\)')
HOT = re.compile(r' (🔥{1,2})[ \t]*$')


def headings(path: Path):
    """一篇笔记中每个 GitHub 锚点对应的 Docsify id 和热度（0、1、2）。"""
    result, github, docsify, fence = {}, Counter(), Counter(), None
    for line in re.sub(r'<!--[\s\S]*?-->', '', path.read_text()).splitlines():
        marker = re.match(r'^\s*(`{3,}|~{3,})', line)
        if marker:
            fence = marker[1][0] if fence is None else (None if marker[1][0] == fence else fence)
            continue
        if fence is not None:
            continue
        match = re.match(r'^(#{1,6})\s+(.+?)(?:\s+#+)?\s*$', line)
        if not match:
            continue
        heat = HOT.search(match[2])
        text = strip_hot(match[0]).split(None, 1)[1].strip()
        slug = github_slug(text)
        count = github[slug]
        github[slug] += 1
        key = slug + (f'-{count}' if count else '')
        result.setdefault(key, (heading_slug(text, docsify), len(heat[1]) if heat else 0, text))
    return result


class Notes:
    """把路线中的相对链接换成笔记网站上的地址，并记录无法解析的链接。"""

    def __init__(self, root: Path, base: str, lenient: bool = False):
        self.root, self.base, self.cache, self.broken, self.warnings, self.lenient = root, base, {}, [], [], lenient

    def resolve(self, href: str, where: str):
        if re.match(r'^https?://', href):
            return {'href': href, 'external': True}
        target, _, fragment = href.partition('#')
        name = urllib.parse.unquote(target)
        if not name.endswith('.md'):
            self.broken.append((where, href, '不是笔记链接'))
            return None
        path = self.root / 'notes' / name
        if not path.is_file():
            (self.warnings if self.lenient else self.broken).append((where, href, '笔记不存在' + ('，已去掉这个链接' if self.lenient else '')))
            return None
        if name not in self.cache:
            self.cache[name] = headings(path)
        note = name[:-3]
        url = self.base + urllib.parse.quote(note)
        heat = 0
        if fragment:
            anchor = self.cache[name].get(urllib.parse.unquote(fragment))
            if not anchor and self.lenient:
                # 小节改了名：先链接到文章开头，读者仍能找到内容
                self.warnings.append((where, href, '小节不存在，已改为链接到文章开头'))
                return {'href': url, 'note': note, 'heat': 0}
            if not anchor:
                self.broken.append((where, href, '小节不存在'))
                return None
            url += '?id=' + urllib.parse.quote(anchor[0])
            heat = anchor[1]
        return {'href': url, 'note': note, 'heat': heat}


def links(text: str, notes: Notes, where: str):
    found = []
    for label, href in LINK.findall(text):
        target = notes.resolve(href, where)
        if target:
            found.append({'text': label, **target})
    return found


CJK_LATIN = re.compile(r'(?<=[\u4e00-\u9fff])(?=[A-Za-z0-9])|(?<=[A-Za-z0-9])(?=[\u4e00-\u9fff])')


def plain(text: str):
    """去掉 Markdown 链接语法，只留文字；链接文字与相邻的汉字之间补上空格（题目编号去掉空白后计算，不受影响）。"""
    return CJK_LATIN.sub(' ', re.sub(r'\s+', ' ', LINK.sub(lambda m: m[1], text)).strip())


def question_id(text: str):
    """临时题号：文字的哈希，content.resolve 再换成稳定编号。"""
    return content.text_id(plain(text))


def parse_route(key, file, title, summary, notes: Notes, questions: dict):
    text = VERBATIM.sub('', (notes.root / 'notes' / (file + '.md')).read_text())
    stages, days, stage, day, lines = [], {}, None, None, []

    def finish():
        if day is None:
            return
        days[day['id']] = parse_day(day, lines, key, notes, questions)

    for line in text.splitlines():
        if line.startswith('## '):
            finish()
            day, lines = None, []
            name = line[3:].strip()
            stage = None if INTRO.match(name) else {'title': re.sub(r'^[一二三四五六七八九十]+、', '', name), 'days': []}
            if stage:
                stages.append(stage)
            continue
        match = DAY.match(line)
        if match and stage is not None:
            finish()
            # 临时编号，content.resolve 再换成稳定编号；n 是显示用的第几天，随路线变化
            day = {'id': f'{key}~{int(match[1])}', 'n': int(match[1]), 'title': match[2].strip(), 'stage': len(stages) - 1}
            stage['days'].append(day['id'])
            lines = []
            continue
        if day is not None:
            lines.append(line)
    finish()
    return {'id': key, 'title': title, 'summary': summary, 'source': file, 'stages': stages}, days


def parse_day(day, lines, route, notes: Notes, questions: dict):
    where = f'{route} 第 {day["n"]} 天'
    body = '\n'.join(lines)
    guide, reading, practice, expect, algos, asks = [], [], '', '', [], []
    block = re.search(r'<details>\s*<summary>参考要点</summary>([\s\S]*?)</details>', body)
    points = [re.sub(r'\s+', ' ', p).strip() for p in re.findall(r'^\d+\.\s+(.+)$', block[1], re.M)] if block else []
    section, folded = None, False
    for raw in lines:
        line = raw.strip()
        # 折叠块中是参考要点，同样带编号，不能当作自测题
        if line.startswith('<details'):
            folded = True
        if folded:
            folded = not line.startswith('</details')
            continue
        if not line:
            continue
        if re.match(r'^(阅读|必学)：', line):
            reading = links(line, notes, where)
            reading_text = plain(line.split('：', 1)[1])
            section = None
        elif line.startswith('自测：'):
            section = 'ask'
        elif line.startswith('动手：'):
            practice, section = plain(line[3:]), None
        elif line.startswith('预期：'):
            expect, section = plain(line[3:]), None
        elif line.startswith('算法'):
            algos.extend(links(line, notes, where))
            section = None
        elif line.startswith(('明天：', '综合题')):
            section = None
        elif section == 'ask' and re.match(r'^\d+\.\s', line):
            asks.append(line)
        elif not reading and not asks and section is None and not line.startswith(('#', '|', '-')):
            guide.append(plain(line))
    if len(points) != len(asks):
        problem = (where, f'{len(asks)} 道自测题、{len(points)} 条参考要点', '题目与要点数量不一致')
        if not notes.lenient:
            notes.broken.append(problem)
        else:
            # 对不上时无法确定哪条要点属于哪道题，这一天先不出题
            notes.warnings.append((*problem[:2], problem[2] + '，这一天的题暂不放进学习站'))
            asks = []
    ids = []
    for i, ask in enumerate(asks):
        body_text = re.sub(r'^\d+\.\s+', '', ask)
        # 题目末尾“（见……）”是原文链接，正文只留问题
        question = re.sub(r'（见[^（）]*(?:（[^（）]*）[^（）]*)*）\s*$', '', body_text).strip()
        qid = question_id(question)
        refs = links(body_text, notes, f'{where} 第 {i + 1} 题')
        entry = questions.setdefault(qid, {'id': qid, 'text': plain(question), 'points': points[i] if i < len(points) else '',
                                           'links': refs, 'heat': max([r.get('heat', 0) for r in refs] or [0]), 'days': []})
        entry['days'].append(day['id'])
        ids.append(qid)
    return {**day, 'route': route, 'guide': ' '.join(guide), 'reading': reading, 'readingText': reading_text if reading else '',
            'practice': practice, 'expect': expect, 'algos': [a for a in algos if a.get('external')], 'questions': ids}


def parse(root: Path, base: str, lenient: bool = False, config_path: Path = CONFIG):
    """解析路线，返回临时编号下的 (路线, 天, 题目, Notes)。"""
    config = json.loads(config_path.read_text())
    notes = Notes(root, base, lenient)
    questions, routes, days = {}, [], {}
    for item in config['routes']:
        if not (root / 'notes' / (item['file'] + '.md')).is_file():
            (notes.warnings if lenient else notes.broken).append((item['id'], item['file'], '路线文件不存在' + ('，这条路线暂不放进学习站' if lenient else '')))
            continue
        route, route_days = parse_route(item['id'], item['file'], item['title'], item['summary'], notes, questions)
        routes.append(route)
        days.update(route_days)
    if notes.broken:
        raise SystemExit('无法解析的内容：\n' + '\n'.join(f'  {w}：{h}（{why}）' for w, h, why in notes.broken))
    return routes, days, questions, notes


def day_sig(day):
    """一天的导读和阅读范围的指纹（不含链接的前缀，换部署地址不影响）。"""
    text = day.get('guide', '') + '\n' + day.get('readingText', '')
    return hashlib.sha1(text.encode()).hexdigest()[:10] if text.strip() else ''


def stabilize(routes, days, questions, lock):
    """把临时编号换成 lock 中的稳定编号，返回新的 (路线, 天, 题目) 和变化、新的 lock。"""
    plain_days = {d: {'route': e['route'], 'title': e['title'], 'questions': e['questions'], 'sig': day_sig(e)} for d, e in days.items()}
    plain_questions = {q: {'text': e['text'], 'points': e['points'], 'days': e['days']} for q, e in questions.items()}
    qmap, dmap, changes, new_lock = content.resolve(routes, plain_days, plain_questions, lock)
    days = {dmap[d]: {**e, 'id': dmap[d], 'questions': [qmap[q] for q in e['questions']]} for d, e in days.items()}
    questions = {qmap[q]: {**e, 'id': qmap[q], 'days': [dmap[d] for d in e['days']]} for q, e in questions.items()}
    for route in routes:
        for stage in route['stages']:
            stage['days'] = [dmap[d] for d in stage['days']]
    return routes, days, questions, changes, new_lock


def updates(lock, changes):
    """页面中显示的更新记录：已经写入 lock 的历史加上还没写入的变化（没有日期）。每条有递增的序号。"""
    entries = [dict(e, seq=i + 1) for i, e in enumerate(lock['history'])]
    if content.has_changes(changes):
        entries.append({'date': None, **changes, 'seq': len(lock['history']) + 1})
    return entries[-HISTORY_SHOWN:]


def build(root: Path, output: Path, base: str, site_url: str = '', lenient: bool = False, lock_path: Path = LOCK, config_path: Path = CONFIG):
    routes, days, questions, notes = parse(root, base, lenient, config_path)
    lock = content.load_lock(lock_path)
    routes, days, questions, changes, new_lock = stabilize(routes, days, questions, lock)
    for route in routes:
        for stage in route['stages']:
            stage['heat'] = sum(questions[q]['heat'] for d in stage['days'] for q in days[d]['questions'])
    # 下线的题和天只留下文字，读者的记录中还有它们时用来显示
    retired = {
        'questions': {q: {'text': e['text']} for q, e in new_lock['questions'].items() if e['status'] == 'retired'},
        'days': {d: {'title': e['title'], 'route': e['route']} for d, e in new_lock['days'].items() if e['status'] == 'retired'},
        'routes': {r: {'title': e['title']} for r, e in new_lock['routes'].items() if e['status'] == 'retired'},
    }
    history = updates(lock, changes)
    content_json = json.dumps({'routes': routes, 'days': days, 'questions': questions, 'retired': retired, 'updates': history},
                              ensure_ascii=False, sort_keys=True)
    data = {'version': 1, 'contentHash': hashlib.sha256(content_json.encode()).hexdigest()[:12], 'notesBase': base,
            'routes': routes, 'days': days, 'questions': questions, 'retired': retired, 'updates': history}
    if output.exists():
        shutil.rmtree(output)
    shutil.copytree(HERE / 'src', output)
    (output / 'data.json').write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')))
    # 静态资源加上内容哈希，更新后浏览器不会用到旧的脚本
    entry = (output / 'index.html').read_text()
    for name in ('app.css', 'core.js', 'qr.js', 'app.js', 'data.json'):
        digest = hashlib.sha256((output / name).read_bytes()).hexdigest()[:10]
        entry = entry.replace(f'"{name}"', f'"{name}?v={digest}"')
    if site_url:
        site_url = site_url.rstrip('/') + '/'
        entry = entry.replace('  <!-- og:url 和 og:image 需要绝对地址，构建时指定 --site-url 后写入 -->\n',
                              f'  <meta property="og:url" content="{html.escape(site_url)}">\n'
                              f'  <meta property="og:image" content="{html.escape(site_url)}og.png">\n'
                              '  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">\n')
    # 内容安全策略：只允许本站的脚本（加上 head 中那段应用配色的内联脚本的哈希）、样式、图片和请求，
    # 页面即使被注入内容也无法加载第三方脚本或把数据发到别处；也和“数据与隐私”中不加载第三方脚本的说明一致
    inline = re.findall(r'<script>(.*?)</script>', entry, re.S)
    hashes = ' '.join("'sha256-" + base64.b64encode(hashlib.sha256(code.encode()).digest()).decode() + "'" for code in inline)
    csp = ("default-src 'self'; script-src 'self' " + hashes + "; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; "
           "connect-src 'self'; font-src 'self'; manifest-src 'self'; worker-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'")
    entry = entry.replace('<meta charset="UTF-8">', f'<meta charset="UTF-8">\n  <meta http-equiv="Content-Security-Policy" content="{csp}">', 1)
    (output / 'index.html').write_text(entry)
    # 离线缓存的文件列表和构建号
    files = ['./'] + [f'{n}?v={hashlib.sha256((output / n).read_bytes()).hexdigest()[:10]}' for n in ('app.css', 'core.js', 'qr.js', 'app.js', 'data.json')]
    files += sorted(str(p.relative_to(output)) for p in (output / 'icons').glob('*.png')) + ['manifest.webmanifest']
    build_id = hashlib.sha256(entry.encode() + json.dumps(files).encode()).hexdigest()[:10]
    sw = (output / 'sw.js').read_text().replace('__BUILD__', build_id).replace('__FILES__', json.dumps(files))
    (output / 'sw.js').write_text(sw)
    return {'routes': {r['id']: sum(len(s['days']) for s in r['stages']) for r in routes},
            'questions': len(questions), 'sharedQuestions': sum(1 for q in questions.values() if len(q['days']) > 1),
            'hot': Counter(q['heat'] for q in questions.values()),
            'pending': {group: {k: len(v) for k, v in items.items()} for group, items in changes.items()} if content.has_changes(changes) else None,
            'warnings': [f'{w}：{h}（{why}）' for w, h, why in notes.warnings]}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    parser.add_argument('--notes-base', default='https://cyc2018.xyz/#/notes/', help='笔记网站中文章地址的前缀')
    parser.add_argument('--source', type=Path, default=REPO)
    parser.add_argument('--output', type=Path, default=HERE / 'dist')
    parser.add_argument('--site-url', default='', help='学习站部署后的地址，用于链接预览图（og:image）')
    parser.add_argument('--lenient', action='store_true', help='链接和题目的问题只给警告，用于和笔记网站一起构建')
    parser.add_argument('--lock', type=Path, default=LOCK, help='编号对照文件，测试时可以指定别的文件')
    parser.add_argument('--routes', type=Path, default=CONFIG, help='路线配置，测试时可以指定别的文件')
    args = parser.parse_args()
    print(json.dumps(build(args.source.resolve(), args.output.resolve(), args.notes_base, args.site_url, args.lenient, args.lock.resolve(),
                           args.routes.resolve()), ensure_ascii=False))

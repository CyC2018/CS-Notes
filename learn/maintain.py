#!/usr/bin/env python3
"""学习站的日常维护：改了学习路线或笔记后，查看学习站的内容有哪些变化，确认后写入 content.lock.json。

用法（在仓库根目录）：
  python3 learn/maintain.py                 查看变化：新增、修改、下线的题和天，链接问题，没有放进学习站的路线文件
  python3 learn/maintain.py --write         确认无误后写入 lock，并把这次变化记入更新记录（读者在首页看到）
  python3 learn/maintain.py --map 新=旧     自动判断错了：把新题（临时编号）当作旧题的修改，沿用旧编号和复习记录
  python3 learn/maintain.py --separate 新   自动判断错了：新题和相似的旧题是两道题，旧题下线
  python3 learn/maintain.py --init          第一次使用：按现在的内容建立 lock，不记更新
  python3 learn/maintain.py --find 题号     处理读者反馈：按题号找到题目、所在的天和路线文件
  python3 learn/maintain.py --baseline      还没发布过时：写入现在的内容并清空更新记录，第一次发布时读者不会看到“内容更新”；编号照常沿用
--map 和 --separate 写入 lock 的 manual 中，之后的构建都按它处理；可以和 --write 一起用。
发现问题时退出码为 1（严格检查失败，或有链接、题目问题），可以放在提交前的检查中。
"""
from __future__ import annotations

import argparse
import datetime
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import build  # noqa: E402
import content  # noqa: E402


def describe(changes, old_lock, new_lock, questions, tmp_of):
    lines = []
    q_text = lambda lock, q: lock['questions'].get(q, {}).get('text', q)  # noqa: E731
    d_text = lambda lock, d: f"{d}（{lock['days'].get(d, {}).get('title', '')}）"  # noqa: E731
    for q in changes['added']['questions']:
        state = '恢复' if old_lock['questions'].get(q, {}).get('status') == 'retired' else '新增'
        lines.append(f'  {state}题目 {q}：{q_text(new_lock, q)}')
    for q in changes['edited']['questions']:
        old, new = old_lock['questions'][q], new_lock['questions'][q]
        same = content.normalize(old['text']) == content.normalize(new['text'])
        if same:
            lines.append(f'  修改要点 {q}：{new["text"]}')
        else:
            score = content.similarity(old['text'], new['text'])
            lines.append(f'  修改题目 {q}（文字相似度 {score:.2f}，新题临时编号 {tmp_of.get(q, "?")}）：\n      原：{old["text"]}\n      新：{new["text"]}')
    for q in changes['retired']['questions']:
        lines.append(f'  下线题目 {q}：{q_text(old_lock, q)}')
    for d in changes['added']['days']:
        lines.append(f'  新增天 {d_text(new_lock, d)}')
    for d in changes['edited']['days']:
        old_t, new_t = old_lock['days'][d]['title'], new_lock['days'][d]['title']
        lines.append(f"  修改天 {d}：{old_t} → {new_t}" if old_t != new_t else f"  修改天 {d}（{new_t}）：导读或阅读范围有调整，学过这一天的读者会看到提示")
    for d in changes['retired']['days']:
        lines.append(f'  下线天 {d_text(old_lock, d)}')
    for r in changes['added']['routes']:
        lines.append(f'  新增路线 {r}')
    for r in changes['retired']['routes']:
        lines.append(f'  下线路线 {r}（读者会看到“这条路线已下线”，记录保留）')
    return lines


def main():
    parser = argparse.ArgumentParser(description='查看并写入学习站的内容变化')
    parser.add_argument('--source', type=Path, default=build.REPO)
    parser.add_argument('--lock', type=Path, default=build.LOCK)
    parser.add_argument('--routes', type=Path, default=build.CONFIG)
    parser.add_argument('--write', action='store_true')
    parser.add_argument('--init', action='store_true')
    parser.add_argument('--baseline', action='store_true')
    parser.add_argument('--find', metavar='题号')
    parser.add_argument('--date', default=datetime.date.today().isoformat())
    parser.add_argument('--map', action='append', default=[], metavar='新=旧')
    parser.add_argument('--separate', action='append', default=[], metavar='新')
    args = parser.parse_args()

    lock = content.load_lock(args.lock)
    if args.find:
        entry = lock['questions'].get(args.find)
        if not entry:
            print(f'lock 中没有题号 {args.find}')
            return 1
        config = json.loads(args.routes.read_text())
        files = {r['id']: r['file'] for r in config['routes']}
        print(f"{args.find}（{'在用' if entry['status'] == 'active' else '已下线'}）：{entry['text']}")
        for did in entry.get('days', []):
            d = lock['days'].get(did, {})
            print(f"  {did}：{d.get('title', '')}，在 notes/{files.get(d.get('route'), '?')}.md 中")
        return 0
    for pair in args.map:
        new, _, old = pair.partition('=')
        lock['manual']['map'][new.strip()] = old.strip()
    for tmp in args.separate:
        if tmp not in lock['manual']['separate']:
            lock['manual']['separate'].append(tmp)

    # 严格检查一遍，再宽松解析一遍收集全部警告
    problems = []
    try:
        routes, days, questions, notes = build.parse(args.source, '/#/notes/', config_path=args.routes)
    except SystemExit as error:
        print(error)
        routes, days, questions, notes = build.parse(args.source, '/#/notes/', lenient=True, config_path=args.routes)
        problems = notes.warnings
    tmp_ids = {q: e for q, e in questions.items()}
    old_lock = json.loads(json.dumps(lock))
    routes, days, questions, changes, new_lock = build.stabilize(routes, days, questions, lock)
    tmp_of = {}
    for tmp, entry in tmp_ids.items():
        stable = next((q for q, e in questions.items() if e['text'] == entry['text']), None)
        if stable:
            tmp_of[stable] = tmp

    config = json.loads(args.routes.read_text())
    listed = {r['file'] for r in config['routes']} | set(config.get('ignore', []))
    unlisted = sorted(p.stem for p in (args.source / 'notes').glob('学习路线 - *.md') if p.stem not in listed)

    total = len(questions)
    print(f'学习站：{len(routes)} 条路线、{len(days)} 天、{total} 道题。')
    if args.init:
        if old_lock['questions']:
            raise SystemExit('lock 中已有内容，不能重新初始化；要重建请先删除 ' + str(args.lock))
        args.lock.write_text(json.dumps(new_lock, ensure_ascii=False, indent=1, sort_keys=True) + '\n')
        print(f'已建立 {args.lock.name}。')
        return 0
    lines = describe(changes, old_lock, new_lock, questions, tmp_of)
    print('与 lock 相比的变化：' if lines else '与 lock 相比没有变化。')
    print('\n'.join(lines))
    for name in unlisted:
        print(f'  提示：{name}.md 没有放进学习站，需要的话在 learn/routes.json 中加上，不需要的加到 ignore。')
    for where, href, why in problems:
        print(f'  问题：{where}：{href}（{why}）')
    if args.baseline:
        if problems:
            print('有问题没有解决，没有写入。')
            return 1
        new_lock['history'] = []
        args.lock.write_text(json.dumps(new_lock, ensure_ascii=False, indent=1, sort_keys=True) + '\n')
        print(f'已写入 {args.lock.name}，更新记录已清空（只在第一次发布前使用）。')
        return 0
    if args.write:
        if problems:
            print('有问题没有解决，没有写入。')
            return 1
        content.record(new_lock, changes, args.date)
        args.lock.write_text(json.dumps(new_lock, ensure_ascii=False, indent=1, sort_keys=True) + '\n')
        print(f'已写入 {args.lock.name}' + (f'，更新记录第 {len(new_lock["history"])} 条（{args.date}）。' if content.has_changes(changes) else '。'))
    elif lines:
        print('确认无误后运行 python3 learn/maintain.py --write。')
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())

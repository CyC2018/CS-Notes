"""题目和天的稳定编号。

读者的复习记录按题目编号保存、完成情况按天的编号保存，所以笔记更新后编号要尽量不变：
- 文字没变的题沿用原编号；改了措辞的题按文字和参考要点的相似度找回原编号（记为修改）；
- 新增的题用文字的哈希作编号，与 learn/build.py 早期的规则一致；
- 从路线中删掉的题和天标记为下线，编号不再分配给别的内容，重新加回来时恢复原编号；
- 天先按标题对应，标题改了再按题目的重合程度对应；在路线中间插入一天不会让后面的天换编号。

对应关系保存在 content.lock.json 中并提交到仓库，构建只读取它；改了路线后在本机运行 learn/maintain.py 查看变化并写入。
"""
from __future__ import annotations

import difflib
import hashlib
import json
import re
from pathlib import Path

LOCK_VERSION = 1
PUNCT = re.compile(r'[\s，。、；：？！“”‘’（）()《》,.;:?!"\'`·\-—…]+')
# 相似度阈值：题目文字 0.55 以上，或参考要点 0.7 以上，才认为是同一道题改了写法
TEXT_SIMILAR, POINTS_SIMILAR = 0.55, 0.7


def normalize(text: str) -> str:
    return PUNCT.sub('', text).lower()


def similarity(a: str, b: str) -> float:
    a, b = normalize(a), normalize(b)
    if not a or not b:
        return 0.0
    return difflib.SequenceMatcher(None, a, b, autojunk=False).ratio()


def text_id(text: str, taken=()) -> str:
    base = re.sub(r'\s+', '', text)
    qid, salt = hashlib.sha1(base.encode()).hexdigest()[:10], 0
    while qid in taken:
        salt += 1
        qid = hashlib.sha1(f'{base}#{salt}'.encode()).hexdigest()[:10]
    return qid


def empty_lock():
    return {'version': LOCK_VERSION, 'questions': {}, 'days': {}, 'routes': {}, 'history': [], 'manual': {'map': {}, 'separate': []}}


def load_lock(path: Path):
    if not path.is_file():
        return empty_lock()
    lock = json.loads(path.read_text())
    if lock.get('version') != LOCK_VERSION:
        raise SystemExit(f'{path} 的版本是 {lock.get("version")}，当前只支持 {LOCK_VERSION}')
    for key, value in empty_lock().items():
        lock.setdefault(key, value)
    return lock


def resolve(routes, days, questions, lock):
    """把解析得到的临时编号换成稳定编号。

    routes：[{id, stages: [{title, days: [临时天编号]}]}]，按路线顺序；
    days：{临时天编号: {route, title, questions: [临时题号]}}；
    questions：{临时题号: {text, points}}，临时题号就是文字的哈希。
    返回 (题号对照, 天编号对照, 变化, 新的 lock)；变化中的编号都是稳定编号。
    """
    old_q, old_d = lock['questions'], lock['days']
    manual = lock.get('manual', {})
    qmap, dmap, claimed_q, claimed_d = {}, {}, set(), set()
    edited_q, edited_d = [], []

    # 1. 题目：文字相同的直接对应；手工指定的对应优先
    by_text = {}
    for qid, entry in old_q.items():
        by_text.setdefault(normalize(entry['text']), qid)
    for tmp, q in questions.items():
        forced = manual.get('map', {}).get(tmp)
        if forced in old_q and forced not in claimed_q:
            qmap[tmp] = forced
        elif tmp not in manual.get('separate', []):
            hit = by_text.get(normalize(q['text']))
            if hit and hit not in claimed_q:
                qmap[tmp] = hit
        if tmp in qmap:
            claimed_q.add(qmap[tmp])
            old = old_q[qmap[tmp]]
            # 问法或参考要点有改动都算修改，读者可以在更新说明里看到
            if normalize(old['text']) != normalize(q['text']) or normalize(old.get('points', '')) != normalize(q.get('points', '')[:240]):
                edited_q.append(qmap[tmp])

    # 2. 天：同一路线中标题相同的对应，否则按已经对应上的题目重合度对应
    for route in routes:
        rid = route['id']
        pending = []
        candidates = {d: e for d, e in old_d.items() if e['route'] == rid}
        for stage in route['stages']:
            for tmp in stage['days']:
                title = days[tmp]['title']
                hit = next((d for d, e in candidates.items() if d not in claimed_d and e['title'] == title), None)
                if hit:
                    dmap[tmp] = hit
                    claimed_d.add(hit)
                else:
                    pending.append(tmp)
        for tmp in pending:
            mine = {qmap[q] for q in days[tmp]['questions'] if q in qmap}
            best, best_score = None, 0.0
            for d, e in candidates.items():
                if d in claimed_d:
                    continue
                theirs = set(e.get('questions', []))
                score = len(mine & theirs) / len(mine | theirs) if mine | theirs else 0
                if score > best_score:
                    best, best_score = d, score
            if best and best_score >= 0.5:
                dmap[tmp] = best
                claimed_d.add(best)
                edited_d.append(best)
        # 新的天：编号接着这条路线用过的最大序号，下线的编号不复用
        used = [int(m[1]) for d in [*old_d, *dmap.values()] if (m := re.match(rf'^{re.escape(rid)}-(\d+)$', d))]
        next_number = max(used, default=0) + 1
        for stage in route['stages']:
            for tmp in stage['days']:
                if tmp not in dmap:
                    dmap[tmp] = f'{rid}-{next_number:02d}'
                    next_number += 1

    # 3. 题目：剩下的按文字和要点的相似度对应，同一天里的题加分；从最相似的一对开始
    pairs = []
    for tmp, q in questions.items():
        if tmp in qmap or tmp in manual.get('separate', []):
            continue
        here = {dmap[d] for d in q.get('days', [])}
        for qid, entry in old_q.items():
            if qid in claimed_q:
                continue
            ts, ps = similarity(q['text'], entry['text']), similarity(q.get('points', ''), entry.get('points', ''))
            if ts < TEXT_SIMILAR and ps < POINTS_SIMILAR:
                continue
            bonus = 0.1 if here & set(entry.get('days', [])) else 0
            pairs.append((max(ts, ps * 0.9) + bonus, tmp, qid))
    for _, tmp, qid in sorted(pairs, reverse=True):
        if tmp in qmap or qid in claimed_q:
            continue
        qmap[tmp] = qid
        claimed_q.add(qid)
        edited_q.append(qid)

    # 4. 新题
    taken = set(old_q) | set(qmap.values())
    added_q = []
    for tmp, q in questions.items():
        if tmp not in qmap:
            qmap[tmp] = text_id(q['text'], taken)
            taken.add(qmap[tmp])
            added_q.append(qmap[tmp])

    # 新的 lock：现在的内容都是 active，没对应上的旧条目下线
    new = {'version': LOCK_VERSION, 'questions': {}, 'days': {}, 'routes': {}, 'history': lock.get('history', []), 'manual': manual}
    for tmp, q in questions.items():
        qid = qmap[tmp]
        new['questions'][qid] = {'text': q['text'], 'points': q.get('points', '')[:240],
                                 'days': sorted({dmap[d] for d in q.get('days', [])}), 'status': 'active'}
    reactivated_q = [qid for qid in new['questions'] if old_q.get(qid, {}).get('status') == 'retired' and qid not in edited_q]
    retired_q = [qid for qid, e in old_q.items() if e.get('status') == 'active' and qid not in new['questions']]
    for qid in retired_q + [q for q, e in old_q.items() if e.get('status') == 'retired' and q not in new['questions']]:
        new['questions'][qid] = {**old_q[qid], 'status': 'retired'}
    for route in routes:
        for stage in route['stages']:
            for tmp in stage['days']:
                did = dmap[tmp]
                new['days'][did] = {'route': route['id'], 'title': days[tmp]['title'], 'stage': stage['title'],
                                    'questions': [qmap[q] for q in days[tmp]['questions']], 'status': 'active'}
                # 导读和阅读范围的指纹：变了说明这一天要读的内容有调整，学过的读者会看到提示；旧的 lock 中没有指纹时只记下，不算修改
                if days[tmp].get('sig'):
                    new['days'][did]['sig'] = days[tmp]['sig']
                    old_sig = old_d.get(did, {}).get('sig')
                    if old_sig and old_sig != days[tmp]['sig'] and old_d[did].get('status') == 'active':
                        edited_d.append(did)
    added_d = [d for d in new['days'] if d not in old_d or old_d[d].get('status') == 'retired']
    edited_d = [d for d in edited_d if d in new['days'] and d not in added_d]
    retired_d = [d for d, e in old_d.items() if e.get('status') == 'active' and d not in new['days']]
    for did, entry in old_d.items():
        if did not in new['days']:
            new['days'][did] = {**entry, 'status': 'retired'}
    for route in routes:
        new['routes'][route['id']] = {'title': route['title'], 'status': 'active'}
    for rid, entry in lock.get('routes', {}).items():
        if rid not in new['routes']:
            new['routes'][rid] = {**entry, 'status': 'retired'}
    current = {r['id'] for r in routes}
    retired_r = [r for r, e in lock.get('routes', {}).items() if e.get('status') == 'active' and r not in current]
    added_r = [r['id'] for r in routes if lock.get('routes', {}).get(r['id'], {}).get('status') != 'active']
    changes = {
        'added': {'questions': added_q + reactivated_q, 'days': added_d, 'routes': added_r},
        'edited': {'questions': sorted(set(edited_q)), 'days': sorted(set(edited_d))},
        'retired': {'questions': retired_q, 'days': retired_d, 'routes': retired_r},
    }
    return qmap, dmap, changes, new


def has_changes(changes) -> bool:
    return any(v for group in changes.values() for v in group.values())


def record(lock, changes, date: str):
    """把一次变化记入历史（maintain.py 写入 lock 时调用）。"""
    if has_changes(changes):
        lock['history'].append({'date': date, **changes})
    return lock

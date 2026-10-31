"""按 Git 历史逐个提交重放学习路线的修改，检查编号对应是否合理。

用法：python3 learn/tests/replay_history.py [--limit N]
每个改过学习路线的提交都取出当时的 notes/，从上一个提交的 lock 开始解析，列出新增、修改、下线的题和天。
修改的题打印新旧文字和相似度，便于人工判断有没有把两道不同的题当成同一道；最后检查：
- 同一道题的编号在它一直存在的提交之间不变；
- 被判定为修改的题，新旧文字或要点的相似度都达到阈值（没有手工指定时）。
"""
import argparse
import io
import json
import subprocess
import sys
import tarfile
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
import build  # noqa: E402
import content  # noqa: E402

REPO = HERE.parents[1]


def snapshot(commit, target):
    data = subprocess.check_output(['git', '-C', str(REPO), 'archive', commit, 'notes'])
    with tarfile.open(fileobj=io.BytesIO(data)) as archive:
        archive.extractall(target, filter='data')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--limit', type=int, default=0)
    args = parser.parse_args()
    config = json.loads(build.CONFIG.read_text())
    files = [f'notes/{r["file"]}.md' for r in config['routes']]
    commits = subprocess.check_output(['git', '-C', str(REPO), 'log', '--reverse', '--format=%H %ad %s', '--date=short', '--', *files], text=True).splitlines()
    if args.limit:
        commits = commits[-args.limit:]
    lock, problems, seen = content.empty_lock(), [], {}
    for line in commits:
        commit, date, subject = line.split(' ', 2)
        with tempfile.TemporaryDirectory() as tmp:
            snapshot(commit, tmp)
            routes, days, questions, notes = build.parse(Path(tmp), '/#/notes/', lenient=True)
            routes, days, questions, changes, new_lock = build.stabilize(routes, days, questions, lock)
        counts = {g: {k: len(v) for k, v in items.items() if v} for g, items in changes.items()}
        print(f'{commit[:8]} {date} {subject[:40]}：{len(questions)} 道题、{len(days)} 天；{json.dumps(counts, ensure_ascii=False)}；警告 {len(notes.warnings)}')
        if lock['questions']:
            for qid in changes['edited']['questions']:
                old, new = lock['questions'][qid], new_lock['questions'][qid]
                ts = content.similarity(old['text'], new['text'])
                ps = content.similarity(old.get('points', ''), new.get('points', '')[:240])
                if old['text'] != new['text']:
                    print(f'    修改 {qid} 文字 {ts:.2f} 要点 {ps:.2f}：{old["text"]} → {new["text"]}')
                if ts < content.TEXT_SIMILAR and ps < content.POINTS_SIMILAR and content.normalize(old['text']) != content.normalize(new['text']):
                    problems.append(f'{commit[:8]} {qid} 相似度不够却被当成修改')
            for qid in changes['added']['questions'][:5]:
                print(f'    新增 {qid}：{new_lock["questions"][qid]["text"]}')
            for qid in changes['retired']['questions'][:5]:
                print(f'    下线 {qid}：{lock["questions"][qid]["text"]}')
        # 文字完全相同的题，编号必须一直不变
        for qid, entry in new_lock['questions'].items():
            if entry['status'] != 'active':
                continue
            key = content.normalize(entry['text'])
            if key in seen and seen[key] != qid:
                problems.append(f'{commit[:8]} 同一段文字换了编号：{entry["text"]}')
            seen[key] = qid
        content.record(new_lock, changes, date)
        lock = new_lock
    print('\n检查：' + ('没有发现问题' if not problems else '\n'.join(problems)))
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())

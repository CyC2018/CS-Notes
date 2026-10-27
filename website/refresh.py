"""Read the latest public master and build locally; no write operation to GitHub or cloud."""
import json
import argparse
import subprocess
import sys
import tarfile
import tempfile
from pathlib import Path

BASE = Path(__file__).resolve().parent
CACHE = BASE / '.source-git'
REPOSITORY = 'https://github.com/CyC2018/CS-Notes.git'


def git(*args):
    return subprocess.check_output(['git', '--git-dir=' + str(CACHE), *args], text=True).strip()


parser = argparse.ArgumentParser(description='获取源文件并生成、校验静态站。')
parser.add_argument('--from-checkout', action='store_true', help='使用当前已提交的检出版本，供 CI 验证 PR 或发布已检出的主分支。')
args = parser.parse_args()
if args.from_checkout:
    repository = BASE.parent
    commit = subprocess.check_output(['git', '-C', str(repository), 'rev-parse', 'HEAD'], text=True).strip()
    archive_command = ['git', '-C', str(repository), 'archive', commit]
else:
    if not CACHE.exists():
        subprocess.run(['git', 'init', '--bare', str(CACHE)], check=True, stdout=subprocess.DEVNULL)
        git('remote', 'add', 'origin', REPOSITORY)
        git('config', 'credential.helper', '')
        git('remote', 'set-url', '--push', 'origin', 'disabled://local-validation-read-only')
    subprocess.run(['git', '--git-dir=' + str(CACHE), 'fetch', '--depth=1', 'origin',
        '+refs/heads/master:refs/heads/master'], check=True)
    commit = git('rev-parse', 'refs/heads/master')
    archive_command = ['git', '--git-dir=' + str(CACHE), 'archive', commit]
with tempfile.TemporaryDirectory(prefix='.snapshot-', dir=BASE) as temp:
    snapshot = Path(temp) / 'source'
    snapshot.mkdir()
    process = subprocess.Popen(archive_command, stdout=subprocess.PIPE)
    try:
        with tarfile.open(fileobj=process.stdout, mode='r|') as archive:
            archive.extractall(snapshot, filter='data')
    finally:
        process.stdout.close()
    if process.wait():
        raise RuntimeError('无法生成源码快照')
    previous = Path(temp) / 'previous'
    destination = BASE / 'upstream'
    if destination.exists():
        destination.rename(previous)
    try:
        snapshot.rename(destination)
    except BaseException:
        if previous.exists():
            previous.rename(destination)
        raise
(BASE / 'source-version.json').write_text(json.dumps({
    'repository': REPOSITORY, 'ref': 'master', 'commit': commit,
}, indent=2) + '\n')
print(('已读取当前检出的提交：' if args.from_checkout else '已读取 GitHub 最新主分支：') + commit, flush=True)
subprocess.run([sys.executable, str(BASE / 'builder/build.py')], check=True)
subprocess.run([sys.executable, str(BASE / 'builder/check.py')], check=True)

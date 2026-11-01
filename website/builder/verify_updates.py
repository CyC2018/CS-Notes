"""Exercise repeat builds, article/image updates, and failed-build preservation locally."""
import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from urllib.parse import unquote

from check import check

BASE = Path(__file__).resolve().parents[1]
SOURCE = BASE / 'upstream'
OUTPUT = BASE / 'dist'


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def build(source, output, *extra):
    return subprocess.run([sys.executable, str(BASE / 'builder/build.py'),
        '--source', str(source), '--output', str(output), *extra], capture_output=True, text=True)


first_manifest = digest(OUTPUT / 'asset-manifest.json')
result = build(SOURCE, OUTPUT)
assert result.returncode == 0, result.stderr
assert digest(OUTPUT / 'asset-manifest.json') == first_manifest, '相同输入的两次构建不一致'

report = json.loads((BASE / 'dist-report.json').read_text())
# 优先选 PNG；笔记的旧外链图片都已重画为本地 PNG 时，剩下的多是 GIF，用同类型的图片替换
candidates = [(url, path) for url, path in report['imageReplacements'].items() if path.startswith('/notes/pics/')]
url, image = next((item for item in candidates if item[1].endswith('.png')), candidates[0])
suffix = Path(image).suffix
image_name = unquote(image).lstrip('/')
note = next(path for path in (SOURCE / 'notes').glob('*.md') if url in path.read_text())
note_name = note.relative_to(SOURCE)
original_note = digest(note)
original_image = digest(SOURCE / image_name)

with tempfile.TemporaryDirectory(prefix='.update-check-', dir=BASE) as temp:
    root = Path(temp)
    source, output = root / 'source', root / 'dist'
    shutil.copytree(SOURCE, source)
    with (source / note_name).open('a') as handle:
        handle.write('\n\n## 本地验证更新\n\n本地同步验证示例词：这是未上传的更新测试。\n')
    replacement = next(path for path in (SOURCE / 'notes/pics').glob('*' + suffix) if digest(path) != original_image)
    shutil.copyfile(replacement, source / image_name)
    shutil.copyfile(replacement, source / 'notes/pics/local-validation-new.png')
    (source / 'notes/本地新增验证.md').write_text('# 本地新增验证\n\n仅在测试副本中生成。\n\n![新图片](pics/local-validation-new.png)\n')
    result = build(source, output, '--no-optimize-images', '--source-commit', 'local-update-check')
    assert result.returncode == 0, result.stderr
    assert '本地同步验证示例词' in (output / note_name).read_text()
    assert digest(output / image_name) == digest(replacement)
    assert digest(output / image_name) != original_image
    assert (output / 'notes/本地新增验证.md').is_file()
    assert (output / 'notes/pics/local-validation-new.png').is_file()
    validation = check(source, output)
    assert not validation['errors'], validation['errors']
    subprocess.run(['node', str(BASE / 'builder/test_search.cjs'), str(output), '--updated'], check=True)

    successful_manifest = digest(output / 'asset-manifest.json')
    with (source / note_name).open('a') as handle:
        handle.write('\n\n![故障模拟](pics/local-validation-missing.png)\n')
    failed = build(source, output, '--no-optimize-images', '--source-commit', 'local-failure-check')
    assert failed.returncode != 0, '缺少必须图片时构建应失败'
    assert digest(output / 'asset-manifest.json') == successful_manifest, '失败的构建覆盖了上次产物'

    text = (source / note_name).read_text()
    (source / note_name).write_text(text.replace('![故障模拟](pics/local-validation-missing.png)',
        '[故障模拟](/notes/local-validation-missing.md)'))
    failed = build(source, output, '--no-optimize-images', '--source-commit', 'local-link-failure-check')
    assert failed.returncode != 0, '站内链接校验失败时构建应失败'
    assert digest(output / 'asset-manifest.json') == successful_manifest, '校验失败覆盖了上次产物'

assert digest(note) == original_note and digest(SOURCE / image_name) == original_image
result = {'sameInputRebuildIdentical': True, 'articleUpdatePickedUp': True,
    'repositoryImageUpdatePickedUp': True, 'newArticleAndImageIncluded': True,
    'updatedSearchIndexPassed': True, 'failedBuildPreservesPreviousOutput': True,
    'failedValidationPreservesPreviousOutput': True,
    'upstreamSnapshotUnchanged': True, 'testFixtureRemoved': True,
    'sourceCommit': report['sourceCommit'], 'manifestSha256': first_manifest}
(BASE / 'update-validation.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(result, ensure_ascii=False, indent=2))

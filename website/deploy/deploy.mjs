// Publish only validated dist/ to the existing Tencent Cloud project.
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { readFile, mkdir, writeFile, appendFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';
const WEBSITE = fileURLToPath(new URL('../', import.meta.url));
const executeFile = promisify(execFile);

export const PROJECT = { projectId: 'makers-s7dxi8u5vidy', name: 'cs-notes' };
export const ORIGIN = 'https://cyc2018.xyz';
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

async function download(origin, path, revision, fetcher) {
  const url = new URL(path.split('/').map(encodeURIComponent).join('/'), origin + '/');
  url.searchParams.set('release', revision);
  const response = await fetcher(url, { signal: AbortSignal.timeout(30_000), redirect: 'error' });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${path}`);
  return Buffer.from(await response.arrayBuffer());
}

function verificationPaths(manifest) {
  const paths = ['index.html', 'build-info.json', 'README.md', 'site.css', 'site.js',
    'search.js', 'search-paths.js', manifest.searchIndex, 'image-variants.json'];
  const records = new Map(manifest.files.map(file => [file.path, file]));
  const notes = [...records.keys()].filter(path => path.startsWith('notes/') && path.endsWith('.md')).sort();
  // Exercise ASCII, Unicode and spaces without depending on specific article titles.
  for (const predicate of [path => /^[\x00-\x7F]+$/.test(path),
    path => /[^\x00-\x7F]/.test(path) && !path.includes(' '), path => path.includes(' ')]) {
    const note = notes.find(predicate);
    if (note) paths.push(note);
  }
  for (const prefix of ['notes/pics/', 'optimized/']) {
    const image = manifest.files.find(file => file.path.startsWith(prefix));
    if (image) paths.push(image.path);
  }
  for (const path of paths) {
    if (!records.has(path)) throw new Error(`构建缺少关键文件：${path}`);
  }
  // 学习站（/learn/）：入口、数据和离线缓存脚本都要是这次构建的版本
  if (records.has('learn/index.html')) {
    for (const path of ['learn/index.html', 'learn/data.json', 'learn/app.js', 'learn/sw.js']) {
      if (!records.has(path)) throw new Error(`构建缺少关键文件：${path}`);
      paths.push(path);
    }
  }
  return [...new Set(paths)];
}

async function packageRelease(directory, archive) {
  const environment = { ...process.env };
  delete environment.EDGEONE_API_TOKEN;
  try {
    await executeFile('python3', [resolve(WEBSITE, 'deploy/package_site.py'),
      '--source', resolve(directory), '--output', resolve(archive)], { env: environment });
  } catch (error) {
    // The packaging subprocess receives no publishing token; don't log its command or environment.
    const reason = error.stderr?.trim().split('\n').at(-1) || '请重新生成并校验网站。';
    throw new Error(`发布包生成失败，未上传：${reason}`);
  }
}

export async function verifyPublished(manifestBytes, { fetcher = fetch, origin = ORIGIN } = {}) {
  const manifest = JSON.parse(manifestBytes);
  const paths = verificationPaths(manifest);
  const revision = sha256(manifestBytes);
  const remote = await download(origin, 'asset-manifest.json', revision, fetcher);
  if (sha256(remote) !== revision) throw new Error('正式域名的版本清单尚未与构建一致。');
  const records = new Map(manifest.files.map(file => [file.path, file]));
  // Check actual bytes as well as the manifest; an SPA fallback can also return HTTP 200.
  // 目录地址 /learn/ 要返回学习站的入口页，而不是网站首页或 404
  if (records.has('learn/index.html')) {
    const entry = records.get('learn/index.html');
    const bytes = await download(origin, 'learn/', revision, fetcher);
    if (sha256(bytes) !== entry.sha256) throw new Error('正式域名的 /learn/ 没有返回学习站入口页');
  }
  await Promise.all(paths.map(async path => {
    const record = records.get(path);
    const bytes = await download(origin, path, revision, fetcher);
    if (bytes.length !== record.bytes || sha256(bytes) !== record.sha256) {
      throw new Error(`正式域名文件校验不一致：${path}`);
    }
  }));
  return paths.length + 1;
}

export async function deploySite({ directory, archive = resolve(directory, '../.cache/site-release.zip'), getClient, fetcher = fetch,
  sleep = ms => new Promise(done => setTimeout(done, ms)), attempts = 12 }) {
  const manifestBytes = await readFile(resolve(directory, 'asset-manifest.json'));
  const manifest = JSON.parse(manifestBytes);
  verificationPaths(manifest); // Reject local defects before any credential or production mutation.
  let unchanged = false;
  try {
    const remote = await download(ORIGIN, 'asset-manifest.json', sha256(manifestBytes), fetcher);
    unchanged = sha256(remote) === sha256(manifestBytes);
  } catch { /* A missing manifest should trigger a new deployment, never a false skip. */ }
  let deployment;
  if (!unchanged) {
    // Always bind the upload to this validated dist; a cached ZIP may belong to an older build.
    await packageRelease(directory, archive);
    const makers = await getClient();
    const project = await makers.projects.get({ projectId: PROJECT.projectId });
    if (project.projectId !== PROJECT.projectId || project.name !== PROJECT.name) {
      throw new Error('腾讯云项目标识与预期不一致，已停止发布。');
    }
    deployment = await makers.deployments.deploy({
      projectId: PROJECT.projectId, artifact: { archive: resolve(archive) },
      env: 'Production', wait: true, timeout: 600, pollInterval: 5,
      onStatusChange: ({ deployment }) => console.log(`腾讯云部署状态：${deployment.status}`),
    });
    if (deployment.status !== 'Success') {
      throw new Error(`腾讯云部署未成功：${deployment.status}`);
    }
  }
  let verifiedFiles;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      verifiedFiles = await verifyPublished(manifestBytes, { fetcher });
      break;
    } catch (error) {
      if (attempt === attempts - 1) throw error;
      await sleep(20_000);
    }
  }
  return { projectId: PROJECT.projectId, origin: ORIGIN,
    sourceCommit: manifest.sourceCommit, generatorHash: manifest.generatorHash,
    manifestSha256: sha256(manifestBytes),
    result: unchanged ? 'unchanged' : 'deployed',
    ...(deployment ? { deploymentId: deployment.deploymentId } : {}), verifiedFiles };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const report = await deploySite({ directory: resolve(WEBSITE, 'dist'), getClient: async () => {
      const token = process.env.EDGEONE_API_TOKEN;
      if (!token) throw new Error('请在仓库 Actions Secrets 中配置 EDGEONE_API_TOKEN。');
      const { Makers } = await import('@edgeone/makers-sdk');
      // The account is on Tencent Cloud China, regardless of the runner's IP address.
      return new Makers({ token, region: 'china' });
    } });
    await mkdir(WEBSITE, { recursive: true });
    await writeFile(resolve(WEBSITE, 'deployment-report.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify(report, null, 2));
    if (process.env.GITHUB_STEP_SUMMARY) {
      await appendFile(process.env.GITHUB_STEP_SUMMARY,
        `网站：${ORIGIN}\n\n结果：${report.result === 'unchanged' ? '版本一致，无需重复发布' : '已发布'}\n\n` +
        `版本：\`${report.sourceCommit}\`；正式域名 ${report.verifiedFiles} 个关键文件校验通过。\n`);
    }
  } catch (error) {
    // Never serialize SDK requests, headers, upload credentials or token-bearing preview URLs.
    if (error?.name?.endsWith('Error') && error?.code) {
      console.error(`腾讯云接口失败：${error.name} (${error.code})；请检查令牌有效期与项目权限。`);
    } else {
      console.error(error instanceof Error ? error.message : '网站发布失败。');
    }
    process.exitCode = 1;
  }
}

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { access, mkdir, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { deploySite, isTransient, PROJECT } from './deploy.mjs';
const executeFile = promisify(execFile);

async function saveManifest(directory, files, sourceCommit = 'source') {
  const manifest = Buffer.from(JSON.stringify({ sourceCommit, generatorHash: 'generator',
    searchIndex: 'search-index-example.json', files: [...files].filter(([path]) => path !== 'asset-manifest.json').map(([path, data]) => ({
      path, bytes: data.length, sha256: createHash('sha256').update(data).digest('hex'),
    })) }));
  files.set('asset-manifest.json', manifest);
  await writeFile(join(directory, 'asset-manifest.json'), manifest);
  return manifest;
}

async function fixture(t, { notes = ['notes/MySQL.md', 'notes/大模型应用.md',
  'notes/Java 基础.md', 'notes/66. 构建乘积数组.md'], images = true, learn = false } = {}) {
  const root = await mkdtemp(join(tmpdir(), 'cs-notes-deploy-'));
  const directory = join(root, 'dist');
  t.after(() => rm(root, { recursive: true, force: true }));
  const files = new Map(['index.html', 'build-info.json', 'README.md', 'site.css', 'site.js',
    'search.js', 'search-paths.js', 'search-index-example.json', 'image-variants.json', ...notes,
    ...(images ? ['notes/pics/example.png', 'optimized/example.webp'] : []),
    ...(learn ? ['learn/index.html', 'learn/data.json', 'learn/app.js', 'learn/sw.js'] : [])]
    .map(path => [path, Buffer.from(`validated contents: ${path}`)]));
  for (const [path, data] of files) {
    await mkdir(resolve(directory, path, '..'), { recursive: true });
    await writeFile(join(directory, path), data);
  }
  const manifest = await saveManifest(directory, files);
  return { directory, files, manifest };
}

test('每日检查：清单一致时不请求凭据、不重复发布，同时核对线上实际文件', async t => {
  const { directory, files } = await fixture(t);
  const requests = [];
  const report = await deploySite({ directory, attempts: 1,
    getClient: () => assert.fail('无变化时不应读取发布凭据'),
    fetcher: async url => {
      const path = decodeURIComponent(url.pathname.slice(1));
      requests.push(path);
      return new Response(files.get(path));
    },
  });
  assert.equal(report.result, 'unchanged');
  assert.equal(report.verifiedFiles, 15);
  assert.ok(requests.includes('notes/MySQL.md'));
  assert.ok(requests.includes('notes/pics/example.png'));
  assert.ok(requests.includes('optimized/example.webp'));
  await assert.rejects(access(resolve(directory, '../.cache/site-release.zip')), { code: 'ENOENT' });
});

test('新版本只向固定项目发布 dist，等候 Success 后重试正式域名校验', async t => {
  const { directory, files } = await fixture(t);
  let published = false;
  let firstVerification = true;
  let retries = 0;
  const report = await deploySite({ directory, attempts: 2, sleep: async () => { retries++; },
    fetcher: async url => {
      if (!published) return new Response('{}');
      if (firstVerification) { firstVerification = false; return new Response('{}'); }
      return new Response(files.get(decodeURIComponent(url.pathname.slice(1))));
    },
    getClient: async () => ({
      projects: { get: async input => { assert.deepEqual(input, { projectId: PROJECT.projectId }); return PROJECT; } },
      deployments: { deploy: async input => {
        assert.equal(input.projectId, PROJECT.projectId);
        assert.equal(input.env, 'Production');
        assert.equal(input.wait, true);
        assert.deepEqual(input.artifact, { archive: resolve(directory, '../.cache/site-release.zip') });
        published = true;
        return { status: 'Success', deploymentId: 'deployment-test' };
      } },
    }),
  });
  assert.equal(report.result, 'deployed');
  assert.equal(report.deploymentId, 'deployment-test');
  assert.equal(retries, 1);
});

test('腾讯云接口的网络错误重试，令牌和权限错误不重试', async t => {
  const { directory, files } = await fixture(t);
  let published = false, gets = 0, deploys = 0;
  const waits = [];
  const report = await deploySite({ directory, attempts: 1, sleep: async ms => { waits.push(ms); },
    fetcher: async url => published ? new Response(files.get(decodeURIComponent(url.pathname.slice(1)))) : new Response('{}'),
    getClient: async () => ({
      projects: { get: async () => { if (++gets === 1) throw new TypeError('fetch failed'); return PROJECT; } },
      deployments: { deploy: async () => {
        if (++deploys === 1) throw new Error('Request timed out after 30s');
        published = true;
        return { status: 'Success', deploymentId: 'retried' };
      } },
    }),
  });
  assert.equal(report.deploymentId, 'retried');
  assert.deepEqual([gets, deploys], [2, 2]);
  assert.deepEqual(waits, [15_000, 15_000]);

  const denied = Object.assign(new Error('The token is invalid'), { name: 'AuthFailureError', code: 'AuthFailure' });
  let calls = 0;
  await assert.rejects(deploySite({ directory, sleep: async () => assert.fail('权限错误不应重试'), fetcher: async () => new Response('{}'),
    getClient: async () => ({ projects: { get: async () => { calls++; throw denied; } }, deployments: { deploy: () => assert.fail('不应上传') } }),
  }), /token is invalid/);
  assert.equal(calls, 1);
  assert.equal(isTransient(Object.assign(new TypeError('fetch failed'), { cause: { code: 'ECONNRESET' } })), true);
  assert.equal(isTransient(new Error('腾讯云部署未成功：Failed')), false);
});

test('项目身份不符时拒绝发布', async t => {
  const { directory } = await fixture(t);
  await assert.rejects(deploySite({ directory, fetcher: async () => new Response('{}'),
    getClient: async () => ({
      projects: { get: async () => ({ ...PROJECT, name: 'other-site' }) },
      deployments: { deploy: () => assert.fail('不能向错误项目上传') },
    }),
  }), /项目标识/);
});

test('腾讯云最终状态失败必须让任务失败', async t => {
  const { directory } = await fixture(t);
  await assert.rejects(deploySite({ directory, fetcher: async () => new Response('{}'),
    getClient: async () => ({ projects: { get: async () => PROJECT },
      deployments: { deploy: async () => ({ status: 'Failed' }) } }),
  }), /未成功：Failed/);
});

test('HTTP 200 的单页回退不能冒充真实资源', async t => {
  const { directory, files } = await fixture(t);
  await assert.rejects(deploySite({ directory, attempts: 1,
    getClient: () => assert.fail('清单一致时不发布'),
    fetcher: async url => new Response(url.pathname === '/asset-manifest.json'
      ? files.get('asset-manifest.json') : '<html>SPA fallback</html>'),
  }), /文件校验不一致/);
});

test('网页正常但优化图片缺失时不能宣告发布成功', async t => {
  const { directory, files } = await fixture(t);
  await assert.rejects(deploySite({ directory, attempts: 1,
    getClient: () => assert.fail('清单一致时不发布'),
    fetcher: async url => new Response(url.pathname.endsWith('.webp')
      ? '<html>SPA fallback</html>' : files.get(decodeURIComponent(url.pathname.slice(1)))),
  }), /文件校验不一致：optimized\/example.webp/);
});

test('中文或含空格文章返回首页时不能宣告发布成功', async t => {
  const { directory, files } = await fixture(t);
  await assert.rejects(deploySite({ directory, attempts: 1,
    getClient: () => assert.fail('清单一致时不发布'),
    fetcher: async url => new Response(url.pathname.includes(encodeURIComponent('大模型应用'))
      ? '<html>SPA fallback</html>' : files.get(decodeURIComponent(url.pathname.slice(1)))),
  }), /文件校验不一致：notes\/大模型应用.md/);
});

test('文章改名和没有优化配图时仍按清单核验当前有效内容', async t => {
  const { directory, files } = await fixture(t, { notes: ['notes/new-note.md', 'notes/新笔记.md', 'notes/专题 新内容.md'], images: false });
  const requests = [];
  const report = await deploySite({ directory, attempts: 1,
    getClient: () => assert.fail('无变化时不读取凭据'),
    fetcher: async url => {
      const path = decodeURIComponent(url.pathname.slice(1));
      requests.push(path);
      return new Response(files.get(path));
    },
  });
  assert.equal(report.result, 'unchanged');
  assert.ok(requests.includes('notes/新笔记.md'));
  assert.ok(requests.includes('notes/专题 新内容.md'));
});

test('本地清单缺少关键页面时，在读取凭据和上传之前失败', async t => {
  const { directory, files } = await fixture(t);
  files.delete('index.html');
  await saveManifest(directory, files);
  await assert.rejects(deploySite({ directory, attempts: 1,
    fetcher: async () => new Response('{}'),
    getClient: () => assert.fail('不完整的本地产物不能读取发布凭据'),
  }), /构建缺少关键文件：index.html/);
});

test('文件与清单不一致时，在读取凭据和上传之前失败', async t => {
  const { directory } = await fixture(t);
  await writeFile(join(directory, 'README.md'), 'changed after validation');
  await assert.rejects(deploySite({ directory, attempts: 1,
    fetcher: async () => new Response('{}'),
    getClient: () => assert.fail('内容不一致时不能读取发布凭据'),
  }), /打包前文件校验不一致/);
});

test('已有旧发布包时，上传的 ZIP 必须包含当前清单', async t => {
  const { directory, files } = await fixture(t);
  const archive = resolve(directory, '../.cache/site-release.zip');
  const script = fileURLToPath(new URL('./package_site.py', import.meta.url));
  await executeFile('python3', [script, '--source', directory, '--output', archive]);
  const manifest = await saveManifest(directory, files, 'new-source');
  let published = false;
  const report = await deploySite({ directory, attempts: 1,
    fetcher: async url => new Response(published ? files.get(decodeURIComponent(url.pathname.slice(1))) : '{}'),
    getClient: async () => ({ projects: { get: async () => PROJECT },
      deployments: { deploy: async input => {
        const { stdout } = await executeFile('python3', ['-c',
          'import sys, zipfile; print(zipfile.ZipFile(sys.argv[1]).read("asset-manifest.json").decode())', input.artifact.archive]);
        assert.deepEqual(JSON.parse(stdout), JSON.parse(manifest));
        published = true;
        return { status: 'Success', deploymentId: 'new-release' };
      } },
    }),
  });
  assert.equal(report.result, 'deployed');
});

test('学习站：校验入口、数据和离线缓存脚本，目录地址 /learn/ 要返回入口页', async t => {
  const { directory, files } = await fixture(t, { learn: true });
  const serve = (learnDirectory) => async url => {
    const path = decodeURIComponent(url.pathname.slice(1));
    if (path === 'learn/') return new Response(learnDirectory);
    return new Response(files.get(path));
  };
  const report = await deploySite({ directory, attempts: 1, getClient: () => assert.fail('无变化时不应读取发布凭据'),
    fetcher: serve(files.get('learn/index.html')) });
  assert.equal(report.verifiedFiles, 19);
  // 托管服务把 /learn/ 回退成网站首页时，校验要失败
  await assert.rejects(deploySite({ directory, attempts: 1, sleep: async () => {}, getClient: () => assert.fail('无变化时不应读取发布凭据'),
    fetcher: serve(files.get('index.html')) }), /learn/);
});

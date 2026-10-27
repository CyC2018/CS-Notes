import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { deploySite, PROJECT } from './deploy.mjs';

async function fixture(t) {
  const directory = await mkdtemp(join(tmpdir(), 'cs-notes-deploy-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const files = new Map(['index.html', 'build-info.json', 'README.md', 'site.css', 'site.js',
    'search.js', 'search-paths.js', 'search-index-example.json', 'notes/MySQL.md',
    'notes/pics/example.png', 'optimized/example.webp', 'image-variants.json',
    'notes/大模型应用.md', 'notes/Java 基础.md', 'notes/66. 构建乘积数组.md']
    .map(path => [path, Buffer.from(`validated contents: ${path}`)]));
  const manifest = Buffer.from(JSON.stringify({ sourceCommit: 'source', generatorHash: 'generator',
    searchIndex: 'search-index-example.json', files: [...files].map(([path, data]) => ({
      path, bytes: data.length, sha256: createHash('sha256').update(data).digest('hex'),
    })) }));
  files.set('asset-manifest.json', manifest);
  await writeFile(join(directory, 'asset-manifest.json'), manifest);
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
  assert.equal(report.verifiedFiles, 16);
  assert.ok(requests.includes('notes/MySQL.md'));
  assert.ok(requests.includes('notes/pics/example.png'));
  assert.ok(requests.includes('optimized/example.webp'));
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

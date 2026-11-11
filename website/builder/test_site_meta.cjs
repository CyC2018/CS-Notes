const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// site.js 是浏览器脚本，不导出函数；按函数名取出文章信息栏用到的几个函数，在沙箱中运行
const source = fs.readFileSync(path.join(__dirname, '../templates/site.js'), 'utf8');
function extract(name) {
  const start = source.indexOf('function ' + name + '(');
  assert(start !== -1, 'site.js 中有 ' + name);
  let depth = 0;
  for (let i = source.indexOf('{', start); i < source.length; i++) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}' && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error('没有找到 ' + name + ' 的结尾');
}
const code = ['decode', 'encodedRoute', 'routeHref', 'articleMeta'].map(extract).join('\n');

function render(route, options = {}) {
  let inserted = null;
  const heading = { after(node) { inserted = node; } };
  const section = {
    querySelector(selector) { return selector === 'h1' ? heading : null; },
    querySelectorAll() { return []; },
    cloneNode() { return { querySelectorAll() { return []; }, textContent: options.text || '正文内容' }; },
  };
  const document = {
    createElement() {
      const category = {};
      return { className: '', innerHTML: '', querySelector() { return category; }, category };
    },
  };
  const context = {
    document,
    location: { origin: options.origin || 'https://example.com' },
    treeParent() { return options.parent || null; },
    categoryName() { return '分类'; },
  };
  const articleMeta = vm.runInNewContext(code + '\narticleMeta', context);
  articleMeta({ route: { path: route } }, section);
  assert(inserted, '信息栏插在一级标题后面');
  const links = [...inserted.innerHTML.matchAll(/<a([^>]*)>([^<]*)<\/a>/g)].map(m => ({
    attrs: m[1], text: m[2], href: (m[1].match(/href="([^"]*)"/) || [])[1],
  }));
  return { meta: inserted, links };
}
function issueLink(route, options) {
  const { links } = render(route, options);
  const link = links.find(l => l.text === '报告错误');
  assert(link, '有“报告错误”链接');
  return { link, url: new URL(link.href), links };
}

// 链接打开 GitHub 新建 Issue 页面，新标签页打开
{
  const { link, url } = issueLink('/notes/计算机网络 - 传输层');
  assert.equal(url.origin + url.pathname, 'https://github.com/CyC2018/CS-Notes/issues/new');
  assert.match(link.attrs, /target="_blank"/);
  assert.match(link.attrs, /rel="noopener"/);
  assert.deepEqual([...url.searchParams.keys()], ['title', 'body'], '只有标题和正文两个参数');
}

// 标题是“[纠错] 笔记名”，只取路径最后一段
{
  const { url } = issueLink('/notes/计算机网络 - 传输层');
  assert.equal(url.searchParams.get('title'), '[纠错] 计算机网络 - 传输层');
}

// 正文写好文件名、页面地址和 CONTRIBUTING.md 要求的几项，顺序固定
{
  const { url } = issueLink('/notes/计算机网络 - 传输层', { origin: 'https://cs.example.org' });
  const body = url.searchParams.get('body');
  assert.equal(body,
    '文件：notes/计算机网络 - 传输层.md\n' +
    '页面：https://cs.example.org/#/notes/' + encodeURIComponent('计算机网络 - 传输层') +
    '\n\n## 原文\n\n\n## 问题与修改建议\n\n\n## 依据\n\n');
}

// 路由是编码过的路径时，先解码再写入标题和文件名
{
  const { url } = issueLink('/notes/' + encodeURIComponent('Java 容器'));
  assert.equal(url.searchParams.get('title'), '[纠错] Java 容器');
  const body = url.searchParams.get('body');
  assert(body.startsWith('文件：notes/Java 容器.md\n'), body);
  assert(body.includes('页面：https://example.com/#/notes/Java%20%E5%AE%B9%E5%99%A8\n'), body);
}

// 笔记名中的 &、#、?、引号不会截断参数或 href 属性
{
  const name = 'C & C++ "示例" #1?x=y';
  const { link, url } = issueLink('/notes/' + name);
  assert(!/[\s"#&]/.test(link.href.split('?title=')[1].replace(/&body=/, '')), link.href);
  assert.equal(url.searchParams.get('title'), '[纠错] ' + name);
  assert(url.searchParams.get('body').startsWith('文件：notes/' + name + '.md\n'));
  assert.equal(url.hash, '', '笔记名中的 # 不会变成链接的锚点');
}

// 多级路径时标题只用最后一段，文件名保留完整的相对路径
{
  const { url } = issueLink('/notes/算法 - 目录/排序');
  assert.equal(url.searchParams.get('title'), '[纠错] 排序');
  assert(url.searchParams.get('body').startsWith('文件：notes/算法 - 目录/排序.md\n'));
  assert(url.searchParams.get('body').includes('/#/notes/' + encodeURIComponent('算法 - 目录') + '/' + encodeURIComponent('排序') + '\n'));
}

// “报告错误”排在“在 GitHub 上查看”之后，原有的分类和源文件链接不变
{
  const { links } = issueLink('/notes/计算机网络 - 传输层', { parent: '/notes/计算机网络 - 目录' });
  assert.deepEqual(links.map(l => l.text), ['', '在 GitHub 上查看', '报告错误']);
  assert.match(links[0].attrs, /class="meta-category"/);
  assert.equal(links[1].href, 'https://github.com/CyC2018/CS-Notes/blob/master/notes/' + encodeURIComponent('计算机网络 - 传输层') + '.md');
}
{
  const { links } = issueLink('/notes/示例');
  assert.deepEqual(links.map(l => l.text), ['在 GitHub 上查看', '报告错误'], '没有分类时不加分类链接');
}

console.log('site meta tests passed');

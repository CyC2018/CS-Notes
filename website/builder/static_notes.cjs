// 每篇笔记生成一个静态页面（notes/<名字>.html）：网站本身用 # 之后的地址，搜索引擎只收录得到首页；
// 静态页面是渲染好的正文，没有脚本，搜索进来的读者直接能读，页面上有回到阅读器（目录、搜索、深色模式、面试题练习）的链接。
// 用法：node static_notes.cjs <dist 目录> <站点地址>，输出生成的页面数；Markdown 用和 Docsify 4.13.1 同一个大版本的 marked 渲染，
// 标题的 id 按 Docsify 的规则生成（与 site_assets.py 的 heading_slug 相同），网站上的小节链接在静态页面上同样可用。
'use strict';
const fs = require('fs');
const path = require('path');
const marked = require('./vendor/marked.min.js');

const PUNCTUATION = /[\u2000-\u206f\u2e00-\u2e7f\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g;
function slugger() {
  const counts = {};
  return function (html) {
    let slug = html.replace(/<[^>]+>/g, '').trim().toLowerCase().replace(PUNCTUATION, '');
    slug = slug.replace(/\s/g, '-').replace(/-+/g, '-').replace(/^(\d)/, '_$1');
    const count = counts[slug] || 0;
    counts[slug] = count + 1;
    return slug + (count ? '-' + count : '');
  };
}
function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function plain(html) {
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
}
const route = name => name.split('/').map(encodeURIComponent).join('/');

// 一级标题后面只有页内链接的列表是文首目录，折叠起来，和网站上一样
function foldToc(html) {
  const head = html.match(/<\/h1>\s*<ul>/);
  if (!head) return html;
  const start = head.index + head[0].length - 4;
  let depth = 0, i = start, end = -1;
  const tag = /<(\/?)ul>/g;
  tag.lastIndex = start;
  for (let m; (m = tag.exec(html));) {
    depth += m[1] ? -1 : 1;
    if (!depth) { end = m.index + 5; break; }
  }
  if (end < 0) return html;
  const list = html.slice(start, end), links = list.match(/<a href="([^"]*)"/g) || [];
  if (links.length < 6 || !links.every(a => a.startsWith('<a href="#'))) return html;
  return html.slice(0, start) + '<details class="toc"><summary>本文目录</summary>\n' + list + '</details>' + html.slice(end);
}
function render(markdown, name) {
  const slug = slugger();
  const renderer = new marked.Renderer();
  renderer.heading = (text, level) => `<h${level} id="${slug(text)}">${text}</h${level}>\n`;
  // 站内笔记的链接（/notes/X.md#小节）改为静态页面；其它链接不变，外链在新窗口打开
  renderer.link = (href, title, text) => {
    let url = href || '';
    const note = url.match(/^\/notes\/([^#?]+)\.md(#.*)?$/);
    if (note) url = '/notes/' + note[1] + '.html' + (note[2] || '');
    const external = /^https?:\/\//.test(url) && !url.startsWith('https://cyc2018.xyz/');
    return `<a href="${escapeHtml(url)}"${title ? ` title="${escapeHtml(title)}"` : ''}${external ? ' target="_blank" rel="noopener"' : ''}>${text}</a>`;
  };
  let html = marked(markdown.replace(/<!-- GFM-TOC -->/g, ''), { renderer, headerIds: false, mangle: false });
  // 正文中直接写的 HTML 链接（<a href="/notes/X.md">）同样改为静态页面
  html = html.replace(/(<a\b[^>]*?\bhref=")\/notes\/([^"#?]+)\.md(#[^"]*)?"/g, (m, a, n, h) => `${a}/notes/${n}.html${h || ''}"`);
  // 配图按出现顺序，第一张直接加载，其余延迟加载；没写说明的用所在小节的标题作说明（和网站上一样）
  let first = true, heading = '';
  html = html.replace(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>|<img\b([^>]*)>/g, (tag, title, attrs) => {
    if (title !== undefined) { heading = plain(title); return tag; }
    let out = '<img' + (/\bloading=/.test(attrs) ? '' : first ? ' decoding="async"' : ' loading="lazy" decoding="async"');
    if (!/\balt=/.test(attrs)) out += ' alt="' + escapeHtml(heading ? heading + (/[!-~]$/.test(heading) ? ' ' : '') + '的配图' : '配图') + '"';
    first = false;
    return out + attrs + '>';
  });
  // 能横向滚动的代码块和表格要能用键盘聚焦后滚动
  html = html.replace(/<(pre|table)>/g, '<$1 tabindex="0">');
  html = foldToc(html);
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/);
  const title = h1 ? plain(h1[1]) : name.split('/').pop();
  const para = html.match(/<p>([\s\S]*?)<\/p>/);
  return { html, title, description: para ? plain(para[1]).slice(0, 120) : title };
}

const STYLE = `
:root { color-scheme: light dark; --bg: #f3f2ee; --surface: #fafbf8; --text: #34495e; --heading: #2c3e50; --muted: #5f6d66; --border: #dfe3da; --theme: #2a7a5a; --soft: #e7f1eb; --code: #9a3f2a; }
@media (prefers-color-scheme: dark) { :root { --bg: #1a1d1c; --surface: #1f2422; --text: #c9d1cc; --heading: #e6ebe7; --muted: #98a59d; --border: #2f3633; --theme: #5cbf92; --soft: #23312b; --code: #e7a28f; } img { filter: brightness(.9); background: #ecebe6; } }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); font: 16px/1.95 -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; -webkit-text-size-adjust: 100%; }
a { color: var(--theme); text-underline-offset: 3px; }
.top { position: sticky; top: 0; z-index: 2; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 20px; border-bottom: 1px solid var(--border); background: var(--bg); }
.top .brand { color: var(--heading); font-weight: 700; text-decoration: none; }
.top .all { margin-left: 14px; color: var(--muted); font-size: 14px; text-decoration: none; }
.groups { columns: 2 240px; column-gap: 32px; }.groups section { break-inside: avoid; margin: 0 0 20px; }.groups h2 { margin: 0 0 6px; font-size: 1.05rem; border: 0; }.groups ul { margin: 0; padding-left: 20px; line-height: 1.9; }
.open { display: inline-block; padding: 4px 12px; border: 1px solid var(--theme); border-radius: 6px; font-size: 14px; text-decoration: none; }
main { max-width: 900px; margin: 0 auto; padding: 28px 24px 64px; }
h1, h2, h3, h4, h5, h6 { color: var(--heading); line-height: 1.4; scroll-margin-top: 64px; }
h1 { font-size: 2rem; margin: .4em 0 1em; }
h2 { margin-top: 2.6rem; padding-bottom: .4rem; border-bottom: 1px solid var(--border); }
img { max-width: 100%; height: auto; border-radius: 4px; }
pre { overflow: auto; padding: 14px 16px; border: 1px solid var(--border); border-radius: 6px; background: var(--surface); line-height: 1.65; }
code { font-family: "SFMono-Regular", Consolas, monospace; font-size: .88em; }
:not(pre) > code { color: var(--code); overflow-wrap: anywhere; }
table { display: block; overflow: auto; border-collapse: collapse; }
pre:focus-visible, table:focus-visible { outline: 2px solid var(--theme); outline-offset: 2px; }
td, th { padding: 6px 12px; border: 1px solid var(--border); }
blockquote { margin: 1em 0; padding: 2px 16px; border-left: 4px solid var(--theme); background: var(--soft); }
.toc { margin: 0 0 28px; padding: 6px 18px; border: 1px solid var(--border); border-radius: 7px; background: var(--surface); }.toc summary { color: var(--theme); font-weight: 600; cursor: pointer; padding: 6px 0; }.toc a { text-decoration: none; }.toc ul { margin: 4px 0; line-height: 1.75; }
.hot-1::after { content: " 🔥"; } .hot-2::after { content: " 🔥🔥"; }
.reader { margin: 40px 0 0; padding: 14px 18px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); font-size: 15px; }
footer { padding: 20px; border-top: 1px solid var(--border); color: var(--muted); font-size: 12px; text-align: center; }
footer a { color: inherit; }
@media (max-width: 640px) { main { padding: 20px 18px 48px; } h1 { font-size: 1.6rem; } .top { padding: 8px 14px; } }
@media print { .top, .reader, footer { display: none; } body { background: #fff; } }
`.replace(/\n\s*/g, '');

function page({ html, title, description }, name, site, stub) {
  const url = site + 'notes/' + route(name) + '.html';
  const reader = '/#/notes/' + route(name);
  const canonical = stub ? site + 'notes/' + route(stub) + '.html' : url;
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} · CS-Notes</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
${stub ? `  <meta http-equiv="refresh" content="0; url=/notes/${escapeHtml(route(stub))}.html">\n` : ''}  <meta property="og:type" content="article">
  <meta property="og:site_name" content="CS-Notes">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(url)}">
  <meta name="theme-color" content="#f3f2ee" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#1a1d1c" media="(prefers-color-scheme: dark)">
  <link rel="icon" href="/icons/favicon-32.png" sizes="32x32">
  <style>${STYLE}</style>
</head>
<body>
  <header class="top"><span><a class="brand" href="/">CS-Notes</a><a class="all" href="/notes/">全部笔记</a></span><a class="open" href="${escapeHtml(reader)}">在阅读器中打开</a></header>
  <main>
    <article>
${html}
    </article>
    <p class="reader">在阅读器中可以用目录和搜索、切换深色模式、练习这篇笔记中的面试题：<a href="${escapeHtml(reader)}">打开《${escapeHtml(title)}》</a></p>
  </main>
  <footer><a href="https://github.com/CyC2018/CS-Notes" target="_blank" rel="noopener">CyC2018 · CS-Notes</a> · <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">粤ICP备19071404号-1</a></footer>
</body>
</html>
`;
}

// 全部笔记的目录页（notes/index.html）：按侧边栏的分组列出，搜索引擎从首页的 noscript 链接进来后能找到每一篇
function indexPage(dist, site) {
  const sidebar = fs.readFileSync(path.join(dist, '_sidebar.md'), 'utf8');
  const groups = [];
  for (const line of sidebar.split('\n')) {
    const head = line.match(/^- \*\*(.+)\*\*$/);
    if (head) { groups.push({ title: head[1], items: [] }); continue; }
    const item = line.match(/^\s+- \[([^\]]+)\]\(\/notes\/([^)]+)\.md\)/);
    if (item && groups.length) groups[groups.length - 1].items.push([item[1], item[2]]);
  }
  const body = '<h1>全部笔记</h1>\n<div class="groups">' + groups.filter(g => g.items.length).map(g => '<section><h2>' + escapeHtml(g.title) + '</h2><ul>' +
    g.items.map(([text, file]) => `<li><a href="/notes/${escapeHtml(file)}.html">${escapeHtml(text)}</a></li>`).join('') + '</ul></section>').join('\n') + '</div>';
  const html = page({ html: body, title: '全部笔记', description: 'CS-Notes 全部笔记：算法、操作系统、计算机网络、数据库、Java、系统设计、大模型应用等。' }, '', site, null)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${site}notes/">`).replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${site}notes/">`)
    .replace(/<a class="open" href="[^"]*">在阅读器中打开<\/a>/, '<a class="open" href="/">在阅读器中打开</a>').replace(/<p class="reader">[\s\S]*?<\/p>/, '');
  fs.writeFileSync(path.join(dist, 'notes', 'index.html'), html);
  return site + 'notes/';
}

function build(dist, site, stubs) {
  const dir = path.join(dist, 'notes');
  const names = fs.readdirSync(dir).filter(f => f.endsWith('.md')).map(f => f.slice(0, -3)).sort();
  const urls = [];
  for (const name of names) {
    const stub = stubs['/notes/' + name] && stubs['/notes/' + name].replace(/^\/notes\//, '');
    const rendered = render(fs.readFileSync(path.join(dir, name + '.md'), 'utf8'), name);
    fs.writeFileSync(path.join(dir, name + '.html'), page(rendered, name, site, stub));
    if (!stub) urls.push(site + 'notes/' + route(name) + '.html');
  }
  return [indexPage(dist, site)].concat(urls);
}

module.exports = { render, slugger, build };

if (require.main === module) {
  const [dist, site, stubsFile] = process.argv.slice(2);
  const stubs = stubsFile ? JSON.parse(fs.readFileSync(stubsFile, 'utf8')) : {};
  process.stdout.write(JSON.stringify(build(dist, site, stubs)));
}

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { search } = require('../templates/search.js');
const dist = process.argv[2] || path.join(__dirname, '../dist');
const info = JSON.parse(fs.readFileSync(path.join(dist, 'build-info.json')));
const index = JSON.parse(fs.readFileSync(path.join(dist, info.searchIndex)));
assert(search(index, '拥塞控制').some(r => r.path.includes('计算机网络 - 传输层') && r.id === 'tcp-拥塞控制'));
assert(search(index, '检索增强生成').some(r => r.path === '/notes/大模型应用' && r.id === '三、检索增强生成'));
assert(search(index, 'Token 分词').some(r => r.path === '/notes/大模型应用' && r.id === 'token-与分词'));
assert.equal(search(index, '').length, 0);
const sample = { documents: [{ title: '数据库', path: '/notes/示例', sections: [
  { title: '事务', id: '事务', text: '一致性 '.repeat(20) },
  { title: '一致性', id: '一致性', text: 'SQL 与数据库' },
] }] };
const serialized = JSON.stringify(sample);
assert.equal(search(sample, '一致性')[0].id, '一致性', '章节标题应优先于正文中重复的关键词');
assert.equal(search(sample, 'ＳＱＬ')[0].id, '一致性', '全角输入仍能搜索');
assert.equal(JSON.stringify(sample), serialized, '搜索缓存不能改动原索引');
const nextIndex = JSON.parse(serialized);
nextIndex.documents[0].sections.push({ title: '新增内容', id: '新章节', text: '新笔记检索词' });
assert.equal(search(nextIndex, '新笔记检索词')[0].id, '新章节', '新索引应使用新内容');
assert.equal(search(sample, '新笔记检索词').length, 0, '不同索引的缓存不能串用');
if (process.argv.includes('--updated')) {
  assert(search(index, '本地同步验证示例词').some(r => r.id === '本地验证更新'));
}
console.log(`搜索与锚点验证通过：${index.documents.length} 篇文章。`);

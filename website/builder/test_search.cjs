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
if (process.argv.includes('--updated')) {
  assert(search(index, '本地同步验证示例词').some(r => r.id === '本地验证更新'));
}
console.log(`搜索与锚点验证通过：${index.documents.length} 篇文章。`);

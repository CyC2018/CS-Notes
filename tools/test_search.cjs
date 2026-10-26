const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { search } = require('../website/search.js');
const dist = path.join(__dirname, '../dist');
const info = JSON.parse(fs.readFileSync(path.join(dist, 'build-info.json')));
const index = JSON.parse(fs.readFileSync(path.join(dist, info.searchIndex)));

let results = search(index, '拥塞控制');
assert(results.some(r => r.path.includes('计算机网络 - 传输层') && r.id === 'tcp-拥塞控制'));
results = search(index, '检索增强生成');
assert(results.some(r => r.path === '/notes/大模型应用' && r.id === '三、检索增强生成'));
results = search(index, 'Token 分词');
assert(results.some(r => r.path === '/notes/大模型应用' && r.id === 'token-与分词'));
assert.equal(search(index, '').length, 0);
assert.equal(search(index, '<script>unfindable-xss-payload</script>').length, 0);
assert(results.every(r => fs.existsSync(path.join(dist, r.path + '.md'))));
console.log(`搜索回归检查通过，覆盖 ${index.documents.length} 篇文章。`);

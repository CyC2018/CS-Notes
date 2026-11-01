const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { search, highlight } = require('../templates/search.js');
const dist = process.argv[2] || path.join(__dirname, '../dist');
const info = JSON.parse(fs.readFileSync(path.join(dist, 'build-info.json')));
const index = JSON.parse(fs.readFileSync(path.join(dist, info.searchIndex)));
assert(search(index, '拥塞控制').some(r => r.path.includes('计算机网络 - 传输层') && r.id === 'tcp-拥塞控制'));
assert(search(index, '检索增强生成').some(r => r.path === '/notes/大模型应用' && r.id === '三、检索增强生成'));
assert(search(index, 'Token 分词').some(r => r.path === '/notes/大模型应用' && r.id === 'token-与分词'));
assert.equal(search(index, '').length, 0);
const ranking = { documents: [
  { title: '学习路线 - 示例', path: '/notes/学习路线 - 示例', sections: [{ title: '第 1 天：拥塞控制', id: 'day', text: '阅读拥塞控制' }] },
  { title: '网络', path: '/notes/网络', sections: [
    { title: 'TCP 拥塞控制', id: 'tcp', text: '拥塞控制用于……' },
    { title: 'A1 线程池的拒绝策略', id: 'a1', text: '线程池实验' },
    { title: 'ThreadPoolExecutor', id: 'pool', text: '线程池指的是……' },
    { title: 'Thread Local Storage', id: 'tls', text: '线程本地存储' },
    { title: 'Agentic RAG', id: 'rag', text: '检索' },
  ] },
] };
assert.equal(search(ranking, '拥塞控制')[0].id, 'tcp', '讲解正文排在学习路线之前');
assert.equal(search(ranking, '线程池')[0].id, 'pool', '讲解正文排在附录实验之前');
assert.equal(search(ranking, 'rag')[0].id, 'rag', '英文词按完整单词优先');
assert.equal(search(ranking, '第 1 天')[0].id, 'day', '学习路线仍能搜到');
const phrasing = { documents: [
  { title: '死锁', path: '/notes/死锁', sections: [
    { title: '死锁预防', id: 'pre', text: '破坏某个必要条件' },
    { title: '必要条件', id: 'cond', text: '只有以下四个条件同时成立时才会发生死锁' },
  ] },
  { title: '容器', path: '/notes/容器', sections: [
    { title: 'HashMap', id: 'map', text: '哈希冲突用拉链法解决，扩容时容量翻倍' },
    { title: '与 Hashtable 的比较', id: 'cmp', text: 'HashMap 不是线程安全的' },
  ] },
  { title: 'Java 虚拟机', path: '/notes/jvm', sections: [{ title: '垃圾收集器', id: 'gc', text: 'G1' }] },
  { title: '57.1 和为 S 的两个数字', path: '/notes/57.1', sections: [
    { title: '57.1 和为 S 的两个数字', id: '', text: '' }, { title: '57.1 和为 S 的两个数字', id: 'h1', text: '' },
  ] },
] };
assert.equal(search(phrasing, '死锁的必要条件')[0].id, 'cond', '去掉问法后，小节标题正好匹配的排在前面');
assert.equal(search(phrasing, '死锁的四个条件')[0].id, 'cond', '去掉问法后再搜');
assert(search(phrasing, '同时成立的四条件').fuzzy && search(phrasing, '同时成立的四条件')[0].id === 'cond', '没有完全匹配时按词组找相近的小节，并标出来');
assert.equal(search(phrasing, 'hashmap扩容')[0].id, 'map', '中英文连写时拆开');
assert.equal(search(phrasing, '散列冲突')[0].id, 'map', '术语的另一种说法');
assert.equal(search(phrasing, '垃圾回收器')[0].id, 'gc', '垃圾回收按垃圾收集搜索');
assert.equal(search(phrasing, 'HashMap和Hashtable的区别')[0].id, 'cmp', '“和……的区别”问法');
assert.equal(search(phrasing, '和为 S').length, 1, '没有正文的开头部分不和一级标题重复出现');
assert.equal(search(phrasing, '什么是').length, 0, '只有问法时没有结果');
assert.equal(highlight('a<b 的 TCP 与 tcp', 'tcp'), 'a&lt;b 的 <mark>TCP</mark> 与 <mark>tcp</mark>', '搜索词高亮不区分大小写，其余文字转义');
assert.equal(highlight('&amp; (x)', 'amp (x)'), '&amp;<mark>amp</mark>; <mark>(x)</mark>', '高亮先切分再转义，正则字符按字面匹配');
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

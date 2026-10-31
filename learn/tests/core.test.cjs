// 核心逻辑的单元测试：node learn/tests/core.test.cjs [data.json]
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const C = require('../src/core.js');

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; } catch (error) { console.error('失败：' + name); throw error; }
}

// ---------- 日期 ----------
test('日期加减跨月、跨年和闰年', () => {
  assert.equal(C.addDays('2026-01-31', 1), '2026-02-01');
  assert.equal(C.addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(C.addDays('2028-02-28', 1), '2028-02-29');
  assert.equal(C.addDays('2026-03-01', -1), '2026-02-28');
  assert.equal(C.daysBetween('2026-10-30', '2026-11-30'), 31);
  assert.equal(C.today(new Date(2026, 9, 30, 23, 59)), '2026-10-30');
});
test('日期校验拒绝不存在的日子和其它格式', () => {
  assert(C.isDate('2026-02-28'));
  assert(!C.isDate('2026-02-30'));
  assert(!C.isDate('2026-2-3'));
  assert(!C.isDate('<script>'));
  assert(!C.isDate(20261030));
});

// ---------- 调度 ----------
test('答“会”时间隔逐级拉长到上限', () => {
  let card = C.newCard(), day = '2026-10-30';
  const gaps = [];
  for (let i = 0; i < 8; i++) {
    card = C.schedule(card, C.KNOWN, day);
    gaps.push(C.daysBetween(day, card.due));
    day = card.due;
  }
  assert.deepEqual(gaps, [3, 7, 15, 30, 60, 60, 60, 60]);
  assert.equal(card.reps, 8);
});
test('“不会”回到第一级并记一次遗忘，新卡不算遗忘', () => {
  let card = C.schedule(C.newCard(), C.FORGOT, '2026-10-30');
  assert.equal(card.stage, 0);
  assert.equal(card.lapses, 0);
  assert.equal(card.due, '2026-10-31');
  card = C.schedule(card, C.KNOWN, '2026-10-31');
  card = C.schedule(card, C.KNOWN, card.due);
  card = C.schedule(card, C.FORGOT, card.due);
  assert.equal(card.stage, 0);
  assert.equal(card.lapses, 1);
});
test('“模糊”保持级别，间隔减半且至少一天', () => {
  let card = C.schedule(C.newCard(), C.FUZZY, '2026-10-30');
  assert.equal(card.stage, 0);
  assert.equal(card.due, '2026-10-31');
  card = { ...card, stage: 3 };
  card = C.schedule(card, C.FUZZY, '2026-11-01');
  assert.equal(card.stage, 3);
  assert.equal(C.daysBetween('2026-11-01', card.due), 7);
});
test('未知的自评报错，原卡片不被修改', () => {
  const card = C.newCard();
  assert.throws(() => C.schedule(card, 3, '2026-10-30'));
  assert.deepEqual(card, C.newCard());
});
test('到期列表：先到期最久的，同日到期高频优先', () => {
  const questions = { a: { heat: 0 }, b: { heat: 2 }, c: { heat: 1 }, d: { heat: 2 } };
  const cards = { a: { due: '2026-10-28' }, b: { due: '2026-10-30' }, c: { due: '2026-10-30' }, d: { due: '2026-10-31' }, gone: { due: '2026-10-01' } };
  assert.deepEqual(C.dueList(cards, questions, '2026-10-30'), ['a', 'b', 'c']);
});
test('连续天数：今天没复习时从昨天算起，断一天就重新计', () => {
  const log = { '2026-10-27': 3, '2026-10-28': 1, '2026-10-29': 5 };
  assert.equal(C.streak(log, '2026-10-30'), 3);
  assert.equal(C.streak({ ...log, '2026-10-30': 1 }, '2026-10-30'), 4);
  assert.equal(C.streak(log, '2026-10-31'), 0);
});
test('完成计划中的一天也算当天有学习', () => {
  const log = { '2026-10-28': 2 };
  assert.equal(C.streak(log, '2026-10-30', { 'r-01': '2026-10-29' }), 2);
  assert.equal(C.streak(log, '2026-10-30', { 'r-01': '2026-10-30', 'r-02': '2026-10-29' }), 3);
  assert.deepEqual(Object.keys(C.activeDays(log, { 'r-01': '2026-10-29' })).sort(), ['2026-10-28', '2026-10-29']);
});
test('每次复习的题数随每天的时间增加，至少 15 道', () => {
  assert.equal(C.reviewLimit(60), 15);
  assert.equal(C.reviewLimit(90), 18);
  assert.equal(C.reviewLimit(180), 36);
});

// ---------- 合成数据：一条路线两个阶段 ----------
function sample() {
  const q = (id, heat) => ({ id, text: '问题 ' + id, points: '要点 ' + id, heat, links: [{ text: '原文', href: 'https://example.com/' + id }], days: [] });
  const questions = { a1: q('a1', 0), a2: q('a2', 2), a3: q('a3', 0), b1: q('b1', 1), b2: q('b2', 0), b3: q('b3', 0), b4: q('b4', 2) };
  const days = {
    'r-01': { questions: ['a1', 'a2'] }, 'r-02': { questions: ['a3'] },
    'r-03': { questions: ['b1', 'b2'] }, 'r-04': { questions: ['b3', 'b4'] },
  };
  const routes = [{ id: 'r', stages: [{ title: 'A', days: ['r-01', 'r-02'] }, { title: 'B', days: ['r-03', 'r-04'] }] }];
  return { routes, days, questions };
}

// ---------- 定级 ----------
test('每个阶段先问高频题，并覆盖不同的天', () => {
  const data = sample();
  const p = C.createPlacement(data.routes[0], data);
  assert.deepEqual(p.stages[0].pool, ['a2', 'a3', 'a1']);
  // 先每天取一道（b4、b1），剩下的同热度按路线顺序（b2 在 b3 之前）
  assert.deepEqual(p.stages[1].pool, ['b4', 'b1', 'b2', 'b3']);
});
test('两题都会判定掌握，都不会判定薄弱，不一致再问第三题', () => {
  const data = sample();
  let p = C.createPlacement(data.routes[0], data);
  assert.deepEqual(C.nextPlacementQuestion(p), { stage: 0, id: 'a2' });
  C.answerPlacement(p, 0, 'a2', C.KNOWN);
  C.answerPlacement(p, 0, 'a3', C.KNOWN);
  assert.equal(C.stageResult(p.stages[0]), 'mastered');
  assert.deepEqual(C.nextPlacementQuestion(p), { stage: 1, id: 'b4' });
  C.answerPlacement(p, 1, 'b4', C.KNOWN);
  C.answerPlacement(p, 1, 'b1', C.FORGOT);
  assert.equal(C.stageResult(p.stages[1]), null);
  assert.deepEqual(C.nextPlacementQuestion(p), { stage: 1, id: 'b2' });
  C.answerPlacement(p, 1, 'b2', C.FUZZY);
  // 会、不会、模糊各一道：按半个“会”计，刚好一半，算部分掌握
  assert.equal(C.stageResult(p.stages[1]), 'partial');
  assert.equal(C.nextPlacementQuestion(p), null);
  assert.deepEqual(C.placementProgress(p), { done: 2, total: 2 });

  p = C.createPlacement(data.routes[0], data);
  C.answerPlacement(p, 0, 'a2', C.FORGOT);
  C.answerPlacement(p, 0, 'a3', C.FORGOT);
  assert.equal(C.stageResult(p.stages[0]), 'weak');
  C.skipStage(p, 1);
  assert.equal(C.stageResult(p.stages[1]), 'unknown');
  assert.equal(C.nextPlacementQuestion(p), null);
});
test('三题中两题会判定部分掌握', () => {
  const data = sample();
  const p = C.createPlacement(data.routes[0], data);
  C.answerPlacement(p, 1, 'b4', C.KNOWN);
  C.answerPlacement(p, 1, 'b1', C.FORGOT);
  C.answerPlacement(p, 1, 'b3', C.KNOWN);
  assert.equal(C.stageResult(p.stages[1]), 'partial');
});
test('三道都答“模糊”算部分掌握，两道不会一道模糊算薄弱', () => {
  const st = (r) => ({ pool: ['x', 'y', 'z', 'w'], asked: ['x', 'y', 'z'], ratings: { x: r[0], y: r[1], z: r[2] }, skipped: false });
  assert.equal(C.stageResult(st([C.FUZZY, C.FUZZY, C.FUZZY])), 'partial');
  assert.equal(C.stageResult(st([C.FORGOT, C.FUZZY, C.FORGOT])), 'weak');
});
test('题目不够三道时，问完即判定', () => {
  const stage = { pool: ['x', 'y'], asked: ['x', 'y'], ratings: { x: C.KNOWN, y: C.FUZZY }, skipped: false };
  assert.equal(C.stageResult(stage), 'partial');
});

// ---------- 计划 ----------
test('掌握的阶段只做自测，部分掌握时按天判断', () => {
  const data = sample();
  const p = C.createPlacement(data.routes[0], data);
  C.answerPlacement(p, 0, 'a2', C.KNOWN);
  C.answerPlacement(p, 0, 'a3', C.KNOWN);
  C.answerPlacement(p, 1, 'b4', C.KNOWN);
  C.answerPlacement(p, 1, 'b1', C.FORGOT);
  C.answerPlacement(p, 1, 'b3', C.KNOWN);
  assert.deepEqual(C.dayModes(data.routes[0], data, p), { 'r-01': 'check', 'r-02': 'check', 'r-03': 'learn', 'r-04': 'check' });
});
test('计划保持路线顺序，按每天的时间装箱，已完成的天跳过', () => {
  const data = sample();
  const plan = C.buildPlan({ route: 'r', minutes: 90, start: '2026-11-01', done: { 'r-02': '2026-10-31' } }, data);
  assert.deepEqual(plan.days.map(d => d.items.map(i => i.day)), [['r-01'], ['r-03'], ['r-04']]);
  assert.deepEqual(plan.days.map(d => d.date), ['2026-11-01', '2026-11-02', '2026-11-03']);
  const quick = C.buildPlan({ route: 'r', minutes: 180, start: '2026-11-01' }, data);
  assert.deepEqual(quick.days.map(d => d.items.length), [2, 2]);
});
test('今天完成的天仍排在今天，完成后不会把明天的内容提前到今天', () => {
  const data = sample();
  const before = C.buildPlan({ route: 'r', minutes: 90, start: '2026-11-01' }, data);
  assert.deepEqual(before.days.map(d => d.items.map(i => i.day)), [['r-01'], ['r-02'], ['r-03'], ['r-04']]);
  const after = C.buildPlan({ route: 'r', minutes: 90, start: '2026-11-01', done: { 'r-01': '2026-11-01' } }, data);
  assert.deepEqual(after.days.map(d => d.items.map(i => i.day)), [['r-01'], ['r-02'], ['r-03'], ['r-04']]);
  assert(after.days[0].items[0].done);
  assert.deepEqual(after.counts, { learn: 3, check: 0 });
  // 第二天再看，昨天完成的天不再出现
  const next = C.buildPlan({ route: 'r', minutes: 90, start: '2026-11-02', done: { 'r-01': '2026-11-01' } }, data);
  assert.deepEqual(next.days.map(d => d.items.map(i => i.day)), [['r-02'], ['r-03'], ['r-04']]);
});
test('自测日较短，可以和学习日排在同一天', () => {
  const data = sample();
  const p = C.createPlacement(data.routes[0], data);
  C.answerPlacement(p, 0, 'a2', C.KNOWN);
  C.answerPlacement(p, 0, 'a3', C.KNOWN);
  const plan = C.buildPlan({ route: 'r', minutes: 90, start: '2026-11-01', placement: p }, data);
  assert.deepEqual(plan.days.map(d => d.items.map(i => i.day + ':' + i.mode)), [['r-01:check', 'r-02:check'], ['r-03:learn'], ['r-04:learn']]);
  assert.deepEqual(plan.counts, { learn: 2, check: 2 });
});
test('时间不够时先去掉自测日，再去掉热度最低的学习日', () => {
  const data = sample();
  const p = C.createPlacement(data.routes[0], data);
  C.answerPlacement(p, 0, 'a2', C.KNOWN);
  C.answerPlacement(p, 0, 'a3', C.KNOWN);
  const plan = C.buildPlan({ route: 'r', minutes: 60, start: '2026-11-01', deadline: '2026-11-02', placement: p }, data);
  assert.equal(plan.days.length, 1);
  // r-04 的热度（b4 = 2）高于 r-03（b1 = 1），保留 r-04
  assert.deepEqual(plan.days[0].items.map(i => i.day), ['r-04']);
  assert.deepEqual(plan.dropped.slice().sort(), ['r-01', 'r-02', 'r-03']);
});
test('面试日期已过或无效时不排计划日', () => {
  const data = sample();
  assert.equal(C.buildPlan({ route: 'r', minutes: 90, start: '2026-11-05', deadline: '2026-11-01' }, data).days.length, 0);
  assert.equal(C.buildPlan({ route: 'r', minutes: 90, start: '2026-11-05', deadline: 'bad' }, data).days.length, 4);
  assert.throws(() => C.buildPlan({ route: 'x', start: '2026-11-05' }, data));
});

test('掌握情况：间隔到 7 天以上算掌握，同一道题在多天出现只算一次', () => {
  const data = sample();
  data.days['r-02'].questions = ['a3', 'a1'];
  const cards = { a1: { stage: 2 }, a2: { stage: 0 }, b1: { stage: 5 }, b2: { stage: -1 } };
  assert.deepEqual(C.mastery(data.routes[0], data, cards), [
    { title: 'A', total: 3, solid: 1, learning: 1 }, { title: 'B', total: 4, solid: 1, learning: 0 }]);
});
test('计划为复习预留时间：每天 90 分钟时学习日不再和自测日合并', () => {
  const data = sample();
  const p = C.createPlacement(data.routes[0], data);
  C.answerPlacement(p, 1, 'b4', C.KNOWN);
  C.answerPlacement(p, 1, 'b1', C.KNOWN);
  const plan = C.buildPlan({ route: 'r', minutes: 90, start: '2026-11-01', placement: p }, data);
  assert.deepEqual(plan.days.map(d => d.items.map(i => i.day)), [['r-01'], ['r-02'], ['r-03', 'r-04']]);
  const roomy = C.buildPlan({ route: 'r', minutes: 120, start: '2026-11-01', placement: p }, data);
  assert.deepEqual(roomy.days.map(d => d.items.map(i => i.day)), [['r-01'], ['r-02', 'r-03', 'r-04']]);
});

test('模拟面试：高频题和不牢的题优先，不重复', () => {
  const data = sample();
  const set = C.mockSet(data.routes[0], data, { a1: { stage: 0 } }, 4, () => 0);
  assert.deepEqual(set, ['a2', 'b4', 'a1', 'b1']);
  assert.equal(new Set(C.mockSet(data.routes[0], data, {}, 99)).size, 7);
});
test('日历：每个计划日一个全天事件，转义特殊字符，按字节折行', () => {
  const data = sample();
  data.days['r-01'].n = 1; data.days['r-01'].title = 'A, B; C';
  data.days['r-03'].n = 3; data.days['r-03'].title = '很长的标题'.repeat(10);
  const plan = { route: 'r', days: [{ date: '2026-12-31', items: [{ day: 'r-01' }] }, { date: '2027-01-01', items: [{ day: 'r-03' }] }] };
  const text = C.planCalendar(plan, data, 'https://example.com/learn/', '20261101T000000Z');
  assert(text.startsWith('BEGIN:VCALENDAR\r\n') && text.endsWith('END:VCALENDAR\r\n'));
  assert.equal(text.split('BEGIN:VEVENT').length - 1, 2);
  assert(text.includes('DTSTART;VALUE=DATE:20261231\r\nDTEND;VALUE=DATE:20270101'));
  assert(text.includes('SUMMARY:CS-Notes 第 1 天：A\\, B\\; C'));
  text.split('\r\n').forEach(line => assert(Buffer.byteLength(line) <= 75, line));
  // 展开折行后还原出完整的标题
  assert(text.replace(/\r\n /g, '').includes('第 3 天：' + '很长的标题'.repeat(10)));
});

// ---------- 提示词 ----------
test('提示词包含题目、回答、要点和原文链接；没作答时要求先给提示', () => {
  const q = sample().questions.a2;
  const text = C.aiPrompt(q, '  我的答案  ');
  assert(text.includes('题目：问题 a2') && text.includes('我的回答：我的答案') && text.includes('参考要点：要点 a2'));
  assert(text.includes('- 原文：https://example.com/a2'));
  assert(C.aiPrompt(q, '').includes('请先给一个提示'));
});

// ---------- 导入与旧版本的记录 ----------
test('读入记录只保留认识的字段，拒绝异常值；找不到的题放进归档', () => {
  const data = sample();
  const raw = {
    version: 1,
    profile: { route: 'r', minutes: 999, deadline: '2026-02-30', start: '2026-11-01', extra: '<img>' },
    cards: {
      a1: { stage: 2, due: '2026-11-03', reps: 3.7, lapses: -1, last: '2026-11-01', evil: 1 },
      a2: { stage: 99, due: '2026-11-03' }, gone: { stage: 1, due: '2026-11-05' }, a3: null, '__proto__': { stage: 1 }, constructor: { stage: 1 },
    },
    done: { 'r-01': '2026-11-01', 'bad key': '2026-11-01', 'r-02': 'x', 'r-09': '2026-10-30' },
    log: { '2026-11-01': 4, '2026-11-02': -3, 'x': 5, '2026-11-03': 1e9 },
    placement: { route: 'r', stages: [{ pool: ['a2', 'zz'], asked: ['a2', 'zz'], ratings: { a2: 2, zz: 2 }, skipped: 'yes' }, { pool: [], asked: [], ratings: {} }] },
  };
  const out = C.sanitize(JSON.parse(JSON.stringify(raw)), data);
  assert.equal(out.version, 2);
  assert.deepEqual(out.profile, { route: 'r', minutes: 90, deadline: null, start: '2026-11-01' });
  assert.deepEqual(Object.keys(out.cards), ['a1']);
  assert.deepEqual(out.cards.a1, { stage: 2, due: '2026-11-03', reps: 3, lapses: 0, last: '2026-11-01' });
  assert.deepEqual(Object.keys(out.archive.cards).sort(), ['constructor', 'gone']);
  assert.deepEqual(out.done, { 'r-01': '2026-11-01' });
  assert.deepEqual(out.archive.done, { 'r-09': '2026-10-30' });
  assert.deepEqual(out.log, { '2026-11-01': 4, '2026-11-03': 10000 });
  // 旧版本的定级没有阶段标题，阶段数相同时按顺序对应
  assert.deepEqual(out.placement.stages[0], { title: 'A', pool: ['a2', 'a3', 'a1'], asked: ['a2'], ratings: { a2: 2 }, skipped: false });
  assert.equal(out.seenUpdate, 0);
  assert.doesNotThrow(() => C.sanitize({ version: 2 }, data));
  assert.throws(() => C.sanitize({ version: 3 }, data), /更新版本/);
  assert.throws(() => C.sanitize(null, data));
  assert.throws(() => C.sanitize('[]', data));
});
test('导出再导入得到相同的数据', () => {
  const data = sample();
  const state = C.emptyState();
  state.profile = { route: 'r', minutes: 120, deadline: '2026-12-01', start: '2026-11-01' };
  state.cards.a1 = C.schedule(C.newCard(), C.KNOWN, '2026-11-01');
  state.done['r-01'] = '2026-11-01';
  state.log['2026-11-01'] = 2;
  state.archive.cards.old = { stage: 3, due: '2026-12-01', reps: 4, lapses: 0, last: '2026-11-01' };
  state.seenUpdate = 3;
  state.placement = C.createPlacement(data.routes[0], data);
  C.answerPlacement(state.placement, 0, 'a2', C.KNOWN);
  const again = C.sanitize(JSON.parse(JSON.stringify(state)), data);
  assert.deepEqual(again, state);
});
test('下线的题和天重新上线后，归档中的记录自动恢复', () => {
  const data = sample();
  const card = { stage: 3, due: '2026-12-01', reps: 4, lapses: 0, last: '2026-11-01' };
  const before = C.emptyState();
  before.profile = { route: 'r', minutes: 90, deadline: null, start: '2026-11-01' };
  before.cards.b9 = card;
  before.done['r-05'] = '2026-11-02';
  const archived = C.sanitize(JSON.parse(JSON.stringify(before)), data);
  assert.deepEqual(archived.cards, {});
  assert.deepEqual(archived.archive.cards, { b9: card });
  assert.deepEqual(archived.archive.done, { 'r-05': '2026-11-02' });
  data.questions.b9 = { id: 'b9', text: '问题 b9', points: '', heat: 0, links: [], days: ['r-05'] };
  data.days['r-05'] = { questions: ['b9'] };
  const restored = C.sanitize(JSON.parse(JSON.stringify(archived)), data);
  assert.deepEqual(restored.cards, { b9: card });
  assert.deepEqual(restored.done, { 'r-05': '2026-11-02' });
  assert.deepEqual(restored.archive.cards, {});
});
test('路线下线时设置和定级进归档，换路线后不再提示；路线恢复时一起恢复', () => {
  const data = sample();
  const state = C.emptyState();
  state.profile = { route: 'gone', minutes: 120, deadline: null, start: '2026-11-01' };
  state.placement = { route: 'gone', stages: [{ title: 'X', asked: ['a1'], ratings: { a1: 2 }, skipped: false }] };
  const out = C.sanitize(JSON.parse(JSON.stringify(state)), data);
  assert.equal(out.profile, null);
  assert.equal(out.archive.profile.route, 'gone');
  assert.equal(out.archive.placement.stages[0].title, 'X');
  data.routes.push({ id: 'gone', stages: [{ title: 'X', days: ['r-01'] }] });
  const back = C.sanitize(JSON.parse(JSON.stringify(out)), data);
  assert.equal(back.profile.route, 'gone');
  assert.deepEqual(back.placement.stages[0].asked, ['a1']);
  assert.equal(back.archive.profile, null);
});
test('路线插入新阶段后，定级结果按阶段标题对应', () => {
  const data = sample();
  const p = C.createPlacement(data.routes[0], data);
  C.answerPlacement(p, 1, 'b4', C.KNOWN);
  C.answerPlacement(p, 1, 'b1', C.KNOWN);
  data.routes[0].stages.splice(1, 0, { title: '新阶段', days: ['r-02'] });
  data.routes[0].stages[0].days = ['r-01'];
  const moved = C.remapPlacement(JSON.parse(JSON.stringify(p)), data.routes[0], data);
  assert.equal(moved.stages[1].title, '新阶段');
  assert.deepEqual(moved.stages[1].asked, []);
  assert.equal(C.stageResult(moved.stages[2]), 'mastered');
});
test('更新提示只列出和读者有关的变化', () => {
  const data = sample();
  data.questions.c1 = { id: 'c1', text: '新题', points: '', heat: 0, links: [], days: ['r-01'] };
  data.days['r-01'].questions.push('c1');
  data.days['r-05'] = { route: 'r', questions: [] };
  data.days['r-01'].route = 'r';
  data.updates = [
    { seq: 1, date: '2026-11-01', added: { questions: ['a3'], days: [] }, edited: { questions: [] }, retired: { questions: [] } },
    { seq: 2, date: null, added: { questions: ['c1'], days: ['r-05'] }, edited: { questions: ['a1', 'b2'] }, retired: { questions: ['old'] } },
  ];
  const state = C.emptyState();
  state.profile = { route: 'r', minutes: 90, deadline: null, start: '2026-11-01' };
  state.done['r-01'] = '2026-11-01';
  state.cards.a1 = { stage: 1 };
  state.archive.cards.old = { stage: 2 };
  state.seenUpdate = 1;
  const u = C.updateSummary(state, data);
  assert.deepEqual([u.latest, u.fresh, u.newDays, u.edited, u.retired, u.relevant], [2, ['c1'], ['r-05'], ['a1'], ['old'], true]);
  assert.deepEqual(C.unpracticed(data.routes[0], data, state), ['a2', 'c1']);
  state.seenUpdate = 2;
  assert.equal(C.updateSummary(state, data), null);
  // 没学过相关内容的读者：有更新但与他无关
  const other = C.emptyState();
  other.profile = { route: 'x', minutes: 90, deadline: null, start: '2026-11-01' };
  assert.equal(C.updateSummary(other, data).relevant, false);
});

test('内容更新：学过的天改了导读或阅读范围；落下的更新比页面带的多', () => {
  const data = { routes: [], days: { 'r-01': { route: 'r', questions: [] }, 'r-02': { route: 'r', questions: [] } }, questions: {},
    updates: [{ seq: 5, date: '2026-11-05', added: {}, edited: { questions: [], days: ['r-01', 'r-02'] }, retired: {} }] };
  const st = C.emptyState();
  st.profile = { route: 'r', minutes: 90, deadline: null, start: '2026-11-01' };
  st.done['r-01'] = '2026-11-01';
  st.seenUpdate = 4;
  let u = C.updateSummary(st, data);
  assert.deepEqual([u.changedDays, u.missedOlder, u.relevant], [['r-01'], false, true]);
  st.seenUpdate = 2;
  assert.equal(C.updateSummary(st, data).missedOlder, true);
  st.seenUpdate = 0;  // 从没看过更新的新读者不提示落下
  assert.equal(C.updateSummary(st, data).missedOlder, false);
});

test('合并两份记录：每道题取最近一次自评，完成的天取较早日期，学习量取较大值，设置以当前为准', () => {
  const a = C.emptyState(), b = C.emptyState();
  a.profile = { route: 'java', minutes: 90, deadline: null, start: '2026-11-01' };
  b.profile = { route: 'llm', minutes: 60, deadline: null, start: '2026-11-03' };
  a.cards.q1 = { stage: 2, due: '2026-11-12', reps: 3, lapses: 0, last: '2026-11-05' };
  b.cards.q1 = { stage: 0, due: '2026-11-07', reps: 4, lapses: 1, last: '2026-11-06' };
  a.cards.q2 = { stage: 1, due: '2026-11-08', reps: 2, lapses: 0, last: '2026-11-05' };
  b.cards.q2 = { stage: 1, due: '2026-11-08', reps: 3, lapses: 0, last: '2026-11-05' };
  b.cards.q3 = { stage: 0, due: '2026-11-04', reps: 1, lapses: 0, last: '2026-11-03' };
  b.archive.cards.q1 = { stage: 4, due: '2026-12-01', reps: 9, lapses: 0, last: '2026-10-01' };
  a.done = { 'java-01': '2026-11-02' }; b.done = { 'java-01': '2026-11-01', 'java-02': '2026-11-04' };
  a.log = { '2026-11-05': 10 }; b.log = { '2026-11-05': 4, '2026-11-06': 7 };
  b.seenUpdate = 3;
  const before = JSON.stringify(a);
  const m = C.mergeState(a, b);
  assert.equal(JSON.stringify(a), before, '不修改原记录');
  assert.equal(m.cards.q1.last, '2026-11-06');
  assert.equal(m.cards.q2.reps, 3);
  assert.ok(m.cards.q3);
  assert.equal(m.archive.cards.q1, undefined, '当前记录中有的题不再留在归档');
  assert.deepEqual(m.done, { 'java-01': '2026-11-01', 'java-02': '2026-11-04' });
  assert.deepEqual(m.log, { '2026-11-05': 10, '2026-11-06': 7 });
  assert.equal(m.profile.route, 'java');
  assert.equal(m.seenUpdate, 3);
  const empty = C.mergeState(C.emptyState(), b);
  assert.equal(empty.profile.route, 'llm', '当前没有设置时用导入的');
  const sum = C.stateSummary(m, { routes: [{ id: 'java', title: 'Java 后端' }] });
  assert.deepEqual(sum, { route: 'Java 后端', cards: 3, done: 2, archived: 0, last: '2026-11-06' });
});

test('连续学习：每学满 7 天得 1 次保护，最多 2 次；中断一天用掉保护，连着中断归零', () => {
  const log = {};
  for (let i = 0; i < 7; i++) log[C.addDays('2026-11-01', i)] = 3;   // 11-01 到 11-07
  let s = C.streakInfo(log, '2026-11-08', {});
  assert.deepEqual([s.days, s.freezes], [7, 1], '今天还没学不算中断');
  s = C.streakInfo(log, '2026-11-09', {});      // 11-08 没学
  assert.deepEqual([s.days, s.freezes, s.used], [7, 0, ['2026-11-08']]);
  log['2026-11-09'] = 2;
  assert.equal(C.streak(log, '2026-11-09', {}), 8, '用掉保护后连续天数接着算');
  s = C.streakInfo(log, '2026-11-12', {});      // 11-10、11-11 都没学，保护已经用完
  assert.deepEqual([s.days, s.freezes], [0, 0]);
  // 学满 21 天也最多存 2 次
  const long = {};
  for (let i = 0; i < 21; i++) long[C.addDays('2026-11-01', i)] = 1;
  assert.equal(C.streakInfo(long, '2026-11-22', {}).freezes, 2);
  assert.equal(C.streakInfo(long, '2026-11-24', {}).days, 21, '中断两天用掉两次保护');
  assert.equal(C.streakInfo(long, '2026-11-25', {}).days, 0);
  assert.ok(C.isMilestone(7) && C.isMilestone(400) && !C.isMilestone(8));
});

test('回答对照：取要点中的术语，去掉题目里已有的和单位，忽略大小写和括号', () => {
  const terms = C.keyTerms('String 和 StringBuilder 有什么区别？', 'String 不可变；StringBuilder 非线程安全，StringBuffer 的方法用 synchronized 修饰，append() 返回自身。容量按 2 倍扩容，单位 MB。');
  assert.deepEqual(terms, ['StringBuffer', 'synchronized', 'append()']);
  const r = C.compareAnswer('StringBuffer 加了 Synchronized 锁', terms);
  assert.deepEqual(r, { hit: ['StringBuffer', 'synchronized'], miss: ['append()'] });
  assert.deepEqual(C.keyTerms('什么是幻觉？', '模型说出“看似合理但错误”的内容'), ['看似合理但错误']);
});

// ---------- 真实数据 ----------
const file = process.argv[2] || path.join(__dirname, '../dist/data.json');
if (fs.existsSync(file)) {
  const data = JSON.parse(fs.readFileSync(file));
  test('真实数据：每条路线都能定级并排出计划', () => {
    data.routes.forEach(route => {
      const p = C.createPlacement(route, data);
      route.stages.forEach((s, i) => assert(p.stages[i].pool.length >= 2, route.id + ' 阶段 ' + s.title + ' 题目不足两道'));
      // 模拟一位读者：前一半阶段都会，后一半都不会
      let next, guard = 0;
      while ((next = C.nextPlacementQuestion(p)) && guard++ < 500) {
        C.answerPlacement(p, next.stage, next.id, next.stage < route.stages.length / 2 ? C.KNOWN : C.FORGOT);
      }
      assert.equal(C.nextPlacementQuestion(p), null);
      const asked = p.stages.reduce((n, s) => n + s.asked.length, 0);
      assert(asked <= route.stages.length * 3, route.id + ' 定级题数过多：' + asked);
      const plan = C.buildPlan({ route: route.id, minutes: 90, start: '2026-11-01', placement: p }, data);
      const total = route.stages.reduce((n, s) => n + s.days.length, 0);
      assert.equal(plan.counts.learn + plan.counts.check, total);
      assert(plan.counts.check > 0 && plan.counts.learn > 0);
      const short = C.buildPlan({ route: route.id, minutes: 60, start: '2026-11-01', deadline: '2026-11-08', placement: p }, data);
      assert(short.days.length <= 7, route.id + ' 一周的计划超过 7 天');
    });
  });
  test('真实数据：题目都有要点和原文链接，链接都指向笔记网站或外部地址', () => {
    Object.values(data.questions).forEach(q => {
      assert(q.text && q.points && q.links.length, q.id);
      q.links.forEach(l => assert(/^(https?:\/\/|\/#\/notes\/)/.test(l.href), l.href));
    });
  });
}
console.log(`核心逻辑测试通过：${passed} 项。`);

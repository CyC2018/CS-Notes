// 学习站的核心逻辑：日期、复习调度、定级、学习计划、提示词和本地数据。
// 不访问页面和存储，浏览器和 Node 测试共用同一份代码。
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LearnCore = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ---------- 日期：一律用本地日期的 YYYY-MM-DD，避免时区让“今天”跨天 ----------
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function today(now) {
    var d = now ? new Date(now) : new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function parseDate(s) {
    var p = String(s).split('-').map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  }
  function addDays(s, n) {
    var d = parseDate(s);
    d.setDate(d.getDate() + n);
    return today(d);
  }
  function daysBetween(a, b) {
    return Math.round((parseDate(b) - parseDate(a)) / 86400000);
  }
  function isDate(s) {
    return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && today(parseDate(s)) === s;
  }

  // ---------- 复习调度 ----------
  // 固定间隔：答“会”时间隔逐级拉长，“模糊”保持当前级别并减半，“不会”回到第一级。
  // 不用 SM-2、FSRS：题卡只有几百张，自评只有三档，固定间隔可解释，读者能预期下次什么时候出现。
  var INTERVALS = [1, 3, 7, 15, 30, 60];
  var FORGOT = 0, FUZZY = 1, KNOWN = 2;

  function newCard() { return { stage: -1, due: null, reps: 0, lapses: 0, last: null }; }

  function schedule(card, rating, on) {
    var next = Object.assign(newCard(), card);
    var interval;
    if (rating === KNOWN) {
      next.stage = Math.min(Math.max(next.stage, 0) + 1, INTERVALS.length - 1);
      interval = INTERVALS[next.stage];
    } else if (rating === FUZZY) {
      next.stage = Math.max(next.stage, 0);
      interval = Math.max(1, Math.floor(INTERVALS[next.stage] / 2));
    } else if (rating === FORGOT) {
      if (next.stage > 0) next.lapses += 1;
      next.stage = 0;
      interval = INTERVALS[0];
    } else {
      throw new Error('未知的自评：' + rating);
    }
    next.reps += 1;
    next.last = on;
    next.due = addDays(on, interval);
    return next;
  }

  function isDue(card, on) { return !!card && !!card.due && card.due <= on; }

  // 今天要复习的题：先到期最久的，同样到期的高频题优先
  function dueList(cards, questions, on) {
    return Object.keys(cards).filter(function (id) { return questions[id] && isDue(cards[id], on); })
      .sort(function (a, b) {
        return cards[a].due.localeCompare(cards[b].due) || (questions[b].heat - questions[a].heat) || a.localeCompare(b);
      });
  }

  // 有学习活动的日期：当天自评过题，或完成了计划中的一天
  function activeDays(log, done) {
    var days = {};
    Object.keys(log || {}).forEach(function (d) { if (log[d] > 0) days[d] = true; });
    Object.keys(done || {}).forEach(function (id) { days[done[id]] = true; });
    return days;
  }
  // 连续学习天数：从今天（今天还没学则从昨天）往前数
  // 连续学习：每连续学满 7 天得到 1 次“保护”（最多存 2 次），某天没学时自动用掉 1 次，连续天数不断（没学的那天不计数）。
  // 偶尔有事中断一天不至于前功尽弃；连着几天不学仍会归零。今天还没学时不算中断
  var FREEZE_EVERY = 7, FREEZE_MAX = 2;
  function streakInfo(log, on, done) {
    var active = activeDays(log, done), days = Object.keys(active).filter(function (d) { return d <= on; }).sort();
    var out = { days: 0, freezes: 0, used: [] };
    if (!days.length) return out;
    var run = 0, earned = 0, freezes = 0, used = [];
    for (var d = days[0]; d <= on; d = addDays(d, 1)) {
      if (active[d]) {
        run += 1; earned += 1;
        if (earned === FREEZE_EVERY) { freezes = Math.min(FREEZE_MAX, freezes + 1); earned = 0; }
      } else if (d === on) {
        break;
      } else if (freezes > 0 && run > 0) {
        freezes -= 1; used.push(d);
      } else {
        run = 0; earned = 0; used = [];
      }
    }
    out.days = run; out.freezes = run ? freezes : 0; out.used = run ? used : [];
    return out;
  }
  function streak(log, on, done) { return streakInfo(log, on, done).days; }
  // 值得庆祝的连续天数
  var MILESTONES = [3, 7, 14, 21, 30, 50, 75, 100, 150, 200, 365];
  function isMilestone(n) { return MILESTONES.indexOf(n) !== -1 || (n > 365 && n % 100 === 0); }
  // 一次复习的题数上限，约占每天时间的三成（每题约 1.5 分钟）；超出的留到下一次，避免中断几天后一次面对几十道题
  function reviewLimit(minutes) {
    return Math.max(15, Math.round((minutes || 90) * 0.3 / 1.5));
  }
  // 某条路线各阶段的掌握情况：连续答“会”到间隔 7 天以上算掌握，自评过但还没到算复习中
  function mastery(route, data, cards) {
    return route.stages.map(function (stage) {
      var ids = [];
      stage.days.forEach(function (d) { data.days[d].questions.forEach(function (q) { if (ids.indexOf(q) === -1) ids.push(q); }); });
      var solid = 0, learning = 0;
      ids.forEach(function (q) {
        var c = cards[q];
        if (c && c.stage >= 2) solid += 1;
        else if (c && c.stage >= 0) learning += 1;
      });
      return { title: stage.title, total: ids.length, solid: solid, learning: learning };
    });
  }

  // ---------- 定级 ----------
  // 每个阶段先问两道题（高频优先、来自不同的天）；两道结论一致就判定，不一致再问第三道。
  // 读者可以整段跳过没学过的阶段。结果按阶段给出“掌握、部分、薄弱、未学”。
  function stageCandidates(route, stageIndex, data) {
    var stage = route.stages[stageIndex], seen = {}, list = [];
    stage.days.forEach(function (dayId, order) {
      data.days[dayId].questions.forEach(function (qid, i) {
        if (seen[qid]) return;
        seen[qid] = true;
        list.push({ id: qid, day: dayId, heat: data.questions[qid].heat, order: order * 10 + i });
      });
    });
    // 高频在前；同热度按路线顺序，保证能覆盖阶段中不同的天
    list.sort(function (a, b) { return b.heat - a.heat || a.order - b.order; });
    var picked = [], days = {};
    list.forEach(function (c) { if (!days[c.day]) { days[c.day] = true; picked.push(c.id); } });
    list.forEach(function (c) { if (picked.indexOf(c.id) === -1) picked.push(c.id); });
    return picked;
  }

  // 每个阶段记下标题：路线增删阶段后按标题找回定级结果
  function createPlacement(route, data) {
    return {
      route: route.id,
      stages: route.stages.map(function (s, i) { return { title: s.title, pool: stageCandidates(route, i, data), asked: [], ratings: {}, skipped: false }; })
    };
  }

  function stageResult(stage) {
    if (stage.skipped) return 'unknown';
    var values = stage.asked.map(function (id) { return stage.ratings[id]; }).filter(function (v) { return v !== undefined; });
    if (!values.length) return null;
    var known = values.filter(function (v) { return v === KNOWN; }).length;
    var forgot = values.filter(function (v) { return v === FORGOT; }).length;
    if (values.length >= 2 && known === values.length) return 'mastered';
    if (values.length >= 2 && forgot === values.length) return 'weak';
    if (values.length >= 3 || values.length >= stage.pool.length) {
      // “模糊”算半个“会”：都答模糊时是部分掌握，答“会”的天在计划中只做自测，其余的天照常学
      var fuzzy = values.length - known - forgot;
      return (known + fuzzy / 2) * 2 >= values.length ? 'partial' : 'weak';
    }
    return null;
  }

  // 下一道题：{stage, id}；全部问完返回 null
  function nextPlacementQuestion(placement) {
    for (var i = 0; i < placement.stages.length; i++) {
      var stage = placement.stages[i];
      if (stageResult(stage)) continue;
      var id = stage.pool.filter(function (q) { return stage.asked.indexOf(q) === -1; })[0];
      if (id) return { stage: i, id: id };
    }
    return null;
  }

  function answerPlacement(placement, stageIndex, id, rating) {
    var stage = placement.stages[stageIndex];
    if (stage.asked.indexOf(id) === -1) stage.asked.push(id);
    stage.ratings[id] = rating;
    return placement;
  }

  function skipStage(placement, stageIndex) {
    placement.stages[stageIndex].skipped = true;
    return placement;
  }

  function placementProgress(placement) {
    var done = placement.stages.filter(function (s) { return stageResult(s); }).length;
    return { done: done, total: placement.stages.length };
  }

  // ---------- 学习计划 ----------
  // 每天的设计用时（学习路线说明中写的范围取中间值），已掌握的天只做当天的自测
  var DAY_MINUTES = { java: 75, llm: 75, sprint: 105 };
  var REVIEW_MINUTES = 15;
  var REVIEW_RESERVE = 15;

  // 每天的处理方式：learn 按路线学习，check 只做自测确认（定级显示已掌握）
  function dayModes(route, data, placement) {
    var modes = {};
    route.stages.forEach(function (stage, i) {
      var st = placement ? placement.stages[i] : null;
      var result = st ? stageResult(st) : null;
      stage.days.forEach(function (dayId) {
        var mode = 'learn';
        if (result === 'mastered') mode = 'check';
        else if (result === 'partial') {
          // 这一天被问到的题都答“会”，才认为这一天已掌握
          var asked = data.days[dayId].questions.filter(function (q) { return st.ratings[q] !== undefined; });
          if (asked.length && asked.every(function (q) { return st.ratings[q] === KNOWN; })) mode = 'check';
        }
        modes[dayId] = mode;
      });
    });
    return modes;
  }

  function dayHeat(dayId, data) {
    return data.days[dayId].questions.reduce(function (sum, q) { return sum + data.questions[q].heat; }, 0);
  }

  // 生成计划：保持路线顺序（前面的内容是后面的基础），按每天的可用时间装箱；
  // 有面试日期且时间不够时，先去掉“只做自测”的天，再去掉热度最低的学习日
  function buildPlan(options, data) {
    var route = data.routes.filter(function (r) { return r.id === options.route; })[0];
    if (!route) throw new Error('未知的路线：' + options.route);
    var budget = Math.max(30, options.minutes || 90);
    // 每天先留出复习的时间，剩下的用来学新内容
    var room = Math.max(30, budget - REVIEW_RESERVE);
    var modes = dayModes(route, data, options.placement);
    var items = [], doneToday = [];
    route.stages.forEach(function (stage) {
      stage.days.forEach(function (dayId) {
        var doneOn = options.done && options.done[dayId];
        // 今天完成的天仍算在今天，占用今天的时间；否则完成一天后，明天的内容会被顺延到今天
        if (doneOn && doneOn === options.start) {
          var m = modes[dayId];
          doneToday.push({ day: dayId, mode: m, minutes: m === 'learn' ? DAY_MINUTES[route.id] || 75 : REVIEW_MINUTES, heat: dayHeat(dayId, data), done: true });
          return;
        }
        if (doneOn) return;
        var mode = modes[dayId];
        items.push({ day: dayId, mode: mode, minutes: mode === 'learn' ? DAY_MINUTES[route.id] || 75 : REVIEW_MINUTES, heat: dayHeat(dayId, data) });
      });
    });
    var start = options.start;
    var available = options.deadline && isDate(options.deadline) ? Math.max(0, daysBetween(start, options.deadline)) : null;
    var dropped = [];
    var usedToday = doneToday.reduce(function (n, i) { return n + i.minutes; }, 0);
    function pack(list) {
      var days = doneToday.length ? [doneToday.slice()] : [], used = usedToday;
      list.forEach(function (item) {
        // 一项超过当天剩余时间时放到下一天；一天至少放一项，即使它本身超过预算
        if (!days.length || (used > 0 && used + item.minutes > room * 1.15)) { days.push([]); used = 0; }
        days[days.length - 1].push(item);
        used += item.minutes;
      });
      return days;
    }
    var calendar = pack(items);
    if (available !== null) {
      // 每天之外还要留出复习的时间，计划只排到面试前一天
      var order = items.slice().sort(function (a, b) {
        return (a.mode === 'check' ? 0 : 1) - (b.mode === 'check' ? 0 : 1) || a.heat - b.heat || items.indexOf(b) - items.indexOf(a);
      });
      while (calendar.length > available && order.length) {
        var cut = order.shift();
        dropped.push(cut);
        items = items.filter(function (i) { return i !== cut; });
        calendar = pack(items);
      }
    }
    return {
      route: route.id, budget: budget, start: start, deadline: options.deadline || null,
      days: calendar.map(function (list, i) { return { date: addDays(start, i), items: list }; }),
      dropped: dropped.map(function (d) { return d.day; }),
      counts: {
        learn: items.filter(function (i) { return i.mode === 'learn'; }).length,
        check: items.filter(function (i) { return i.mode === 'check'; }).length
      }
    };
  }

  // ---------- 复制给 AI 的提示词 ----------
  function aiPrompt(question, answer) {
    var refs = question.links.map(function (l) { return '- ' + l.text + '：' + l.href; }).join('\n');
    var mine = answer && answer.trim() ? answer.trim() : '（还没作答。请先给一个提示，不要直接给出完整答案。）';
    return [
      '我在准备技术面试，下面是一道题和我的回答。',
      '请先指出我的回答中正确、错误和遗漏的地方，再像面试官一样追问 2～3 个相关问题，每次只问一个，等我回答后再继续。',
      '参考要点来自 CS-Notes，已经人工核对；如果你的看法与参考要点不一致，请说明依据。',
      '',
      '题目：' + question.text,
      '',
      '我的回答：' + mine,
      '',
      '参考要点：' + question.points,
      '',
      '原文：',
      refs
    ].join('\n');
  }

  // ---------- 模拟面试 ----------
  // 从路线中抽题：高频题优先，自评过但还不牢的题加分，random 用于打乱同分的题
  function mockSet(route, data, cards, n, random) {
    random = random || Math.random;
    var ids = [];
    route.stages.forEach(function (stage) {
      stage.days.forEach(function (d) { data.days[d].questions.forEach(function (q) { if (ids.indexOf(q) === -1) ids.push(q); }); });
    });
    return ids.map(function (q) {
      var c = cards[q], shaky = c && c.stage >= 0 && c.stage < 2;
      return { id: q, score: data.questions[q].heat * 2 + (shaky ? 3 : 0) + random() * 2 };
    }).sort(function (a, b) { return b.score - a.score; }).slice(0, n).map(function (x) { return x.id; });
  }

  // ---------- 日历 ----------
  // 把计划导出为 iCalendar（RFC 5545）：每个计划日一个全天事件
  function icsText(value) {
    return String(value).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
  }
  // 每行不超过 75 个字节，续行以空格开头；按 UTF-8 计算，不拆开一个字符
  function icsFold(line) {
    var out = [], current = '', bytes = 0;
    Array.from(line).forEach(function (ch) {
      var cp = ch.codePointAt(0), size = cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4;
      if (bytes + size > (out.length ? 74 : 75)) { out.push(current); current = ''; bytes = 0; }
      current += ch;
      bytes += size;
    });
    out.push(current);
    return out.join('\r\n ');
  }
  function planCalendar(plan, data, siteUrl, stamp) {
    var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//CS-Notes//Learn//ZH', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:CS-Notes 学习计划'];
    plan.days.forEach(function (entry) {
      var titles = entry.items.map(function (i) { var d = data.days[i.day]; return '第 ' + d.n + ' 天：' + d.title; });
      var date = entry.date.replace(/-/g, '');
      lines.push('BEGIN:VEVENT', 'UID:' + plan.route + '-' + date + '@cs-notes-learn', 'DTSTAMP:' + stamp,
        'DTSTART;VALUE=DATE:' + date, 'DTEND;VALUE=DATE:' + addDays(entry.date, 1).replace(/-/g, ''),
        'SUMMARY:' + icsText('CS-Notes ' + titles.join('、')),
        'DESCRIPTION:' + icsText(entry.items.map(function (i) { return siteUrl + '#/day/' + i.day; }).join('\n')),
        'URL:' + siteUrl + '#/day/' + entry.items[0].day, 'TRANSP:TRANSPARENT', 'END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    return lines.map(icsFold).join('\r\n') + '\r\n';
  }

  // ---------- 本地数据 ----------
  // 版本 2 起增加 archive（下线内容的记录）和 seenUpdate（读者看过的最后一条更新记录）
  var STORE_VERSION = 2;
  var ARCHIVE_LIMIT = 2000;
  function emptyState() {
    return { version: STORE_VERSION, profile: null, placement: null, cards: {}, done: {}, log: {}, archive: { cards: {}, done: {}, profile: null }, seenUpdate: 0 };
  }
  function cleanCard(c) {
    if (!c || typeof c !== 'object') return null;
    var stage = Number(c.stage);
    if (!(stage >= -1 && stage < INTERVALS.length && stage === Math.floor(stage))) return null;
    return {
      stage: stage, due: isDate(c.due) ? c.due : null,
      reps: Math.max(0, Math.floor(Number(c.reps) || 0)), lapses: Math.max(0, Math.floor(Number(c.lapses) || 0)),
      last: isDate(c.last) ? c.last : null
    };
  }
  function cleanProfile(p) {
    if (!p || typeof p !== 'object' || typeof p.route !== 'string' || !/^[a-z][a-z0-9-]{0,30}$/.test(p.route)) return null;
    var minutes = Number(p.minutes);
    return {
      route: p.route,
      minutes: [60, 90, 120, 180].indexOf(minutes) !== -1 ? minutes : 90,
      deadline: isDate(p.deadline) ? p.deadline : null,
      start: isDate(p.start) ? p.start : null
    };
  }
  // 编号只允许小写字母和数字；查找时只看对象自身的属性，避免 constructor 这类名字碰到原型上的属性
  var QUESTION_ID = /^[0-9a-z]{1,32}$/, DAY_ID = /^[a-z][a-z0-9]*-\d{2,}$/;
  function own(map, key) { return !!map && Object.prototype.hasOwnProperty.call(map, key); }
  function limit(map) {
    var keys = Object.keys(map);
    if (keys.length <= ARCHIVE_LIMIT) return map;
    var out = {};
    keys.slice(keys.length - ARCHIVE_LIMIT).forEach(function (k) { out[k] = map[k]; });
    return out;
  }

  // 读入记录：来自本机的旧版本或用户选择的文件，逐项检查，只保留认识的字段。
  // 题目或天在当前内容中找不到（已下线，或来自更新的版本）时放进 archive，不丢弃；它们重新上线后自动恢复。
  function sanitize(input, data) {
    if (!input || typeof input !== 'object' || typeof input.version !== 'number' || input.version < 1) throw new Error('不是本站导出的学习记录');
    if (input.version > STORE_VERSION) throw new Error('这份记录来自更新版本的学习站，请刷新页面后再试');
    var questions = data.questions, days = data.days || {}, routes = data.routes;
    var out = emptyState(), routeIds = routes.map(function (r) { return r.id; });
    var archive = input.archive && typeof input.archive === 'object' ? input.archive : {};
    function eachCard(map, fn) {
      if (!map || typeof map !== 'object') return;
      Object.keys(map).forEach(function (id) { if (QUESTION_ID.test(id)) { var c = cleanCard(map[id]); if (c) fn(id, c); } });
    }
    // 先放归档中的，再放当前的：同一道题两边都有时以当前的为准
    [archive.cards, input.cards].forEach(function (map) {
      eachCard(map, function (id, c) {
        if (own(questions, id)) { out.cards[id] = c; delete out.archive.cards[id]; } else out.archive.cards[id] = c;
      });
    });
    [archive.done, input.done].forEach(function (map) {
      if (!map || typeof map !== 'object') return;
      Object.keys(map).forEach(function (id) {
        if (!DAY_ID.test(id) || !isDate(map[id])) return;
        if (own(days, id)) { out.done[id] = map[id]; delete out.archive.done[id]; } else out.archive.done[id] = map[id];
      });
    });
    out.archive.cards = limit(out.archive.cards);
    out.archive.done = limit(out.archive.done);
    var log = input.log && typeof input.log === 'object' ? input.log : {};
    Object.keys(log).forEach(function (day) {
      var n = Math.floor(Number(log[day]));
      if (isDate(day) && n > 0) out.log[day] = Math.min(n, 10000);
    });
    // 每天一条，最多保留 10 年
    var keys = Object.keys(out.log).sort();
    if (keys.length > 3660) keys.slice(0, keys.length - 3660).forEach(function (d) { delete out.log[d]; });
    // 路线下线时把设置放进归档，读者换路线后不再需要；路线重新上线且读者没有换路线时恢复
    var profile = cleanProfile(input.profile), archived = cleanProfile(archive.profile);
    if (profile && routeIds.indexOf(profile.route) !== -1) out.profile = profile;
    else if (profile) out.archive.profile = profile;
    else if (archived && routeIds.indexOf(archived.route) !== -1) out.profile = archived;
    else if (archived) out.archive.profile = archived;
    if (out.profile && out.archive.profile && out.archive.profile.route === out.profile.route) out.archive.profile = null;
    var placement = input.placement || (out.profile && archive.placement);
    if (placement && out.profile && placement.route === out.profile.route && Array.isArray(placement.stages)) {
      out.placement = remapPlacement(placement, routes.filter(function (r) { return r.id === out.profile.route; })[0], data);
    } else if (input.placement && out.archive.profile && input.placement.route === out.archive.profile.route && Array.isArray(input.placement.stages)) {
      // 路线下线时定级结果也先存着，只留格式正确的字段
      out.archive.placement = {
        route: input.placement.route,
        stages: input.placement.stages.slice(0, 50).filter(function (st) { return st && typeof st === 'object'; }).map(function (st) {
          var asked = (Array.isArray(st.asked) ? st.asked : []).filter(function (q) { return QUESTION_ID.test(q); }).slice(0, 50), ratings = {};
          asked.forEach(function (q) { var v = st.ratings && st.ratings[q]; if (v === 0 || v === 1 || v === 2) ratings[q] = v; });
          return { title: typeof st.title === 'string' ? st.title.slice(0, 100) : undefined, asked: asked, ratings: ratings, skipped: st.skipped === true };
        })
      };
    }
    var seen = Math.floor(Number(input.seenUpdate));
    out.seenUpdate = seen > 0 ? seen : 0;
    return out;
  }
  // ---------- 回答对照 ----------
  // 从参考要点里取出术语（英文名词、类名、方法名和带引号的说法），去掉题目中已经出现的和单位；
  // 读者写了回答时，对照哪些提到了、哪些没提到，只作提示，不打分
  var TERM_STOP = ['a', 'an', 'the', 'is', 'of', 'to', 'in', 'and', 'or', 'vs', 'on', 'for', 'it', 'be', 'by', 'as', 'at', 'id', 'kb', 'mb', 'gb', 'tb', 'ms', 'ns', 'us', 'qps', 'tps'];
  function termKey(t) { return t.toLowerCase().replace(/\(\)$/, ''); }
  function keyTerms(question, points) {
    var seen = {}, out = [], asked = String(question || '').toLowerCase();
    function add(t) {
      var k = termKey(t);
      if (k.length < 2 || TERM_STOP.indexOf(k) !== -1 || seen[k] || asked.indexOf(k) !== -1) return;
      seen[k] = true; out.push(t);
    }
    var text = String(points || ''), m;
    var en = /[A-Za-z][A-Za-z0-9+#_\-]*(?:\.[A-Za-z][A-Za-z0-9_]*)*(?:\(\))?/g, quoted = /“([^”]{2,10})”/g;
    while ((m = en.exec(text))) add(m[0]);
    while ((m = quoted.exec(text))) add(m[1]);
    return out.slice(0, 10);
  }
  function compareAnswer(answer, terms) {
    var a = String(answer || '').toLowerCase().replace(/\s+/g, ' ');
    var hit = [], miss = [];
    terms.forEach(function (t) { (a.indexOf(termKey(t)) !== -1 ? hit : miss).push(t); });
    return { hit: hit, miss: miss };
  }

  // 合并两份已经清理过的记录（换设备、两台设备都学过时用）：
  // 同一道题取最近一次自评的那份，同样新时取复习次数多的；完成的天取较早的日期；每天的学习量取较大的；
  // 路线设置、定级以当前浏览器为准，当前没有时用导入的
  function mergeState(current, incoming) {
    var out = JSON.parse(JSON.stringify(current));
    function newer(a, b) {
      if (!a) return b;
      if (!b) return a;
      var la = a.last || '', lb = b.last || '';
      if (la !== lb) return la > lb ? a : b;
      return (b.reps || 0) > (a.reps || 0) ? b : a;
    }
    [['cards', out.cards, incoming.cards], ['archive', out.archive.cards, incoming.archive.cards]].forEach(function (x) {
      Object.keys(x[2]).forEach(function (id) { x[1][id] = newer(x[1][id], x[2][id]); });
    });
    [[out.done, incoming.done], [out.archive.done, incoming.archive.done]].forEach(function (x) {
      Object.keys(x[1]).forEach(function (id) { if (!x[0][id] || x[1][id] < x[0][id]) x[0][id] = x[1][id]; });
    });
    // 当前的和归档的只留一份：题目或天在当前记录中有时，以当前为准
    Object.keys(out.cards).forEach(function (id) { delete out.archive.cards[id]; });
    Object.keys(out.done).forEach(function (id) { delete out.archive.done[id]; });
    Object.keys(incoming.log).forEach(function (d) { out.log[d] = Math.max(out.log[d] || 0, incoming.log[d]); });
    if (!out.profile) { out.profile = incoming.profile; out.placement = incoming.placement; }
    else if (!out.placement && incoming.placement && incoming.profile && incoming.profile.route === out.profile.route) out.placement = incoming.placement;
    if (!out.archive.profile) out.archive.profile = incoming.archive.profile;
    out.seenUpdate = Math.max(out.seenUpdate || 0, incoming.seenUpdate || 0);
    return out;
  }
  // 一份记录的概况，导入前给读者看
  function stateSummary(st, data) {
    var route = st.profile && data.routes.filter(function (r) { return r.id === st.profile.route; })[0];
    var days = Object.keys(st.log).sort();
    return { route: route ? route.title : null, cards: Object.keys(st.cards).length, done: Object.keys(st.done).length,
      archived: Object.keys(st.archive.cards).length + Object.keys(st.archive.done).length, last: days.length ? days[days.length - 1] : null };
  }
  // 定级结果按阶段标题对应到当前路线；旧版本的记录没有标题，阶段数相同时按顺序对应。
  // 每个阶段的候选题按当前内容重新排，已经问过的题保留自评，下线的题去掉
  function remapPlacement(input, route, data) {
    var old = input.stages.filter(function (s) { return s && typeof s === 'object'; });
    var byIndex = old.length === route.stages.length && old.every(function (s) { return typeof s.title !== 'string'; });
    return {
      route: route.id,
      stages: route.stages.map(function (stage, i) {
        var match = byIndex ? old[i] : old.filter(function (s) { return s.title === stage.title; })[0];
        var fresh = stageCandidates(route, i, data);
        if (!match) return { title: stage.title, pool: fresh, asked: [], ratings: {}, skipped: false };
        var asked = (Array.isArray(match.asked) ? match.asked : []).filter(function (q, k, list) { return fresh.indexOf(q) !== -1 && list.indexOf(q) === k; });
        var ratings = {};
        asked.forEach(function (q) { var v = match.ratings && match.ratings[q]; if (v === 0 || v === 1 || v === 2) ratings[q] = v; });
        asked = asked.filter(function (q) { return ratings[q] !== undefined; });
        return { title: stage.title, pool: asked.concat(fresh.filter(function (q) { return asked.indexOf(q) === -1; })), asked: asked, ratings: ratings, skipped: match.skipped === true };
      })
    };
  }

  // ---------- 内容更新 ----------
  // 读者上次看过之后的更新，按读者自己的记录归纳：学过的天里新增的题、当前路线新增的天、练过的题中修改和下线的
  function updateSummary(state, data) {
    var entries = (data.updates || []).filter(function (u) { return u.seq > (state.seenUpdate || 0); });
    if (!entries.length) return null;
    var routeId = state.profile && state.profile.route;
    var fresh = {}, newDays = {}, edited = {}, retired = {}, changedDays = {};
    entries.forEach(function (u) {
      (u.added.questions || []).forEach(function (q) {
        var qd = data.questions[q];
        if (qd && !state.cards[q] && qd.days.some(function (d) { return state.done[d]; })) fresh[q] = true;
      });
      (u.added.days || []).forEach(function (d) { if (data.days[d] && data.days[d].route === routeId && !state.done[d]) newDays[d] = true; });
      (u.edited.questions || []).forEach(function (q) { if (state.cards[q] && data.questions[q]) edited[q] = true; });
      (u.retired.questions || []).forEach(function (q) { if (state.archive.cards[q]) retired[q] = true; });
      (u.edited.days || []).forEach(function (d) { if (state.done[d] && data.days[d]) changedDays[d] = true; });
    });
    // 页面只带最近的若干条更新；读者落下的比这还多时，最早的几次看不到明细，只提示有过调整
    var oldest = (data.updates || [])[0];
    var summary = {
      latest: entries[entries.length - 1].seq, date: entries[entries.length - 1].date,
      fresh: Object.keys(fresh), newDays: Object.keys(newDays), edited: Object.keys(edited), retired: Object.keys(retired),
      changedDays: Object.keys(changedDays), missedOlder: !!(oldest && state.seenUpdate > 0 && state.seenUpdate < oldest.seq - 1)
    };
    summary.relevant = summary.fresh.length + summary.newDays.length + summary.edited.length + summary.retired.length + summary.changedDays.length > 0 || summary.missedOlder;
    return summary;
  }
  // 学过的天里还没练过的题，按路线顺序；内容更新后新增的题从这里练
  function unpracticed(route, data, state) {
    var out = [];
    route.stages.forEach(function (stage) {
      stage.days.forEach(function (d) {
        if (!state.done[d]) return;
        data.days[d].questions.forEach(function (q) { if (!state.cards[q] && out.indexOf(q) === -1) out.push(q); });
      });
    });
    return out;
  }

  return {
    today: today, addDays: addDays, daysBetween: daysBetween, isDate: isDate,
    INTERVALS: INTERVALS, FORGOT: FORGOT, FUZZY: FUZZY, KNOWN: KNOWN,
    newCard: newCard, schedule: schedule, isDue: isDue, dueList: dueList, streak: streak, streakInfo: streakInfo, isMilestone: isMilestone, FREEZE_EVERY: FREEZE_EVERY, activeDays: activeDays,
    reviewLimit: reviewLimit, mastery: mastery,
    createPlacement: createPlacement, nextPlacementQuestion: nextPlacementQuestion, answerPlacement: answerPlacement,
    skipStage: skipStage, stageResult: stageResult, placementProgress: placementProgress,
    dayModes: dayModes, buildPlan: buildPlan, DAY_MINUTES: DAY_MINUTES, REVIEW_MINUTES: REVIEW_MINUTES,
    aiPrompt: aiPrompt, mockSet: mockSet, planCalendar: planCalendar, icsFold: icsFold,
    updateSummary: updateSummary, unpracticed: unpracticed, mergeState: mergeState, stateSummary: stateSummary, keyTerms: keyTerms, compareAnswer: compareAnswer, remapPlacement: remapPlacement, emptyState: emptyState, sanitize: sanitize, STORE_VERSION: STORE_VERSION
  };
});

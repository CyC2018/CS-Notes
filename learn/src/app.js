// 学习站的页面：今天、设置、定级、计划、每天的内容、复习和数据。
// 所有记录只写入 localStorage，不发出除 data.json 之外的任何请求。
(function () {
  'use strict';
  var C = window.LearnCore;
  var KEY = 'cs-learn-v1';
  var main = document.getElementById('main');
  var data = null, state = null, storageOk = true;
  // 当前页面的点击处理：main 上只注册一次监听，换页时替换处理函数
  var onClick = null;

  // ---------- 工具 ----------
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // 测试时可以用 ?today=YYYY-MM-DD 模拟日期
  function now() {
    var forced = new URLSearchParams(location.search).get('today');
    return C.isDate(forced) ? forced : C.today();
  }
  var WEEK = '日一二三四五六';
  function dateLabel(d, withWeek) {
    var p = d.split('-').map(Number), date = new Date(p[0], p[1] - 1, p[2]);
    return p[1] + ' 月 ' + p[2] + ' 日' + (withWeek ? ' 周' + WEEK[date.getDay()] : '');
  }
  function relative(d) {
    var n = C.daysBetween(now(), d);
    return n <= 0 ? '今天' : n === 1 ? '明天' : n + ' 天后';
  }
  // 计划的时间线上用：宽屏写“11 月 2 日”，手机上写“11/2”，读屏软件读完整日期
  function shortDate(d) {
    var p = d.split('-').map(Number);
    return '<span class="d-long">' + dateLabel(d) + '</span><span class="d-short" aria-hidden="true">' + p[1] + '/' + p[2] + '</span>';
  }
  function ago(d) {
    var n = C.daysBetween(d, now());
    return n <= 0 ? '今天' : n === 1 ? '昨天' : n + ' 天前';
  }
  var toastTimer;
  function toast(text) {
    var box = document.getElementById('toast');
    box.textContent = text;
    box.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { box.hidden = true; }, 2600);
  }
  function route(id) { return data.routes.filter(function (r) { return r.id === id; })[0]; }
  function day(id) { return data.days[id]; }
  function stageOf(d) { return route(d.route).stages[d.stage]; }
  function totalDays(r) { return r.stages.reduce(function (n, s) { return n + s.days.length; }, 0); }
  function doneCount(r) { return r.stages.reduce(function (n, s) { return n + s.days.filter(function (d) { return state.done[d]; }).length; }, 0); }

  // ---------- 图标与小部件 ----------
  // 线条图标，24×24，颜色跟随文字；以 < 开头的是完整的元素，其余是 path 的 d
  var ICONS = {
    home: 'M4 11.5 12 5l8 6.5V20h-5v-5h-6v5H4z',
    plan: '<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 9.5h16M8.5 3v4M15.5 3v4"/>',
    review: 'M19 12a7 7 0 1 1-2.05-4.95M19 4.5V9h-4.5',
    bank: '<rect x="5" y="4" width="14" height="16" rx="2.5"/><path d="M8.5 9h7M8.5 12.5h7M8.5 16h4"/>',
    progress: 'M5 19v-6M10 19V9M15 19v-4M20 19V5',
    flag: '<path d="M5.5 20.5V4.5M5.5 5h11l-2 4 2 4h-11"/>',
    shield: '<path d="M12 3.5 19 6v5.6c0 4.3-2.9 7.7-7 8.9-4.1-1.2-7-4.6-7-8.9V6z"/>',
    flame: '<path class="fill" d="M12 2.8c.4 2.9 4.9 5.6 4.9 10.3a4.9 4.9 0 0 1-9.8 0c0-1.9.9-3.4 2-4.5.1 1.6.8 2.6 1.8 3-.5-3.4.3-6.3 1.1-8.8z"/>',
    check: 'M5 12.5l4.5 4.5L19 7.5',
    x: 'M6.5 6.5l11 11M17.5 6.5l-11 11',
    wave: 'M4 13.5c2-3.5 4-3.5 6 0s4 3.5 6 0 3-2.5 4-1.5',
    arrow: 'M5 12h14M13 6l6 6-6 6',
    back: 'M19 12H5M11 6l-6 6 6 6',
    clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4.5l3 2"/>',
    book: 'M12 6.5C10.5 5 8 4.5 4 4.5v13c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2v-13c-4 0-6.5.5-8 2zM12 6.5v13',
    quiz: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.6a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1.1.9-1.1 1.6v.3M12 16.7v.1"/>',
    code: 'M8.5 8 4.5 12l4 4M15.5 8l4 4-4 4M13.5 5.5l-3 13',
    algo: '<circle cx="6" cy="6.5" r="2.2"/><circle cx="18" cy="6.5" r="2.2"/><circle cx="12" cy="17.5" r="2.2"/><path d="M7.2 8.4l3.6 7.2M16.8 8.4l-3.6 7.2M8.2 6.5h7.6"/>',
    share: 'M12 4v11M7.5 8.5 12 4l4.5 4.5M5 13v5.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V13',
    copy: '<rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2"/><path d="M15.5 8.5V6A1.5 1.5 0 0 0 14 4.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"/>',
    sparkle: 'M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9zM18.5 16l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z',
    mic: '<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5"/>',
    trophy: 'M8 4.5h8v4.5a4 4 0 0 1-8 0zM8 6.5H5.5a2.5 2.5 0 0 0 2.6 3.4M16 6.5h2.5a2.5 2.5 0 0 1-2.6 3.4M12 13v3.5M8.5 20h7M9.5 16.5h5V20h-5z',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>',
    chev: 'M9.5 6l6 6-6 6',
    sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    download: 'M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14',
    external: 'M14 4.5h5.5V10M19.5 4.5 11 13M17.5 14v4.5a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5v-10A1.5 1.5 0 0 1 6 7h4.5',
    bell: 'M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5H5zM10 20.5h4',
    layers: 'M12 4 3.5 8.5 12 13l8.5-4.5zM3.5 12.5 12 17l8.5-4.5',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8" class="fill"/>',
    lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
    notes: 'M7 4.5h7.5L18 8v11.5H7zM14 4.5V8.5h4M10 12.5h5M10 16h5'
  };
  function icon(name, cls) {
    var body = ICONS[name] || '';
    return '<svg class="i' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      (body.charAt(0) === '<' ? body : '<path d="' + body + '"/>') + '</svg>';
  }
  // 环形进度：value / max，中间写 label
  function ring(value, max, label, sub, size) {
    size = size || 112;
    var r = 44, c = 2 * Math.PI * r, pct = max ? Math.min(1, value / max) : 0;
    return '<div class="ring" style="--size:' + size + 'px" role="img" aria-label="' + esc(sub ? label + ' ' + sub : label) + '">' +
      '<svg viewBox="0 0 100 100" aria-hidden="true"><circle class="track" cx="50" cy="50" r="' + r + '"/>' +
      (pct > 0 ? '<circle class="value" cx="50" cy="50" r="' + r + '" stroke-dasharray="' + (c * pct).toFixed(1) + ' ' + c.toFixed(1) + '"/>' : '') + '</svg>' +
      '<span><b>' + esc(label) + '</b>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span></div>';
  }
  // ---------- 配色方案 ----------
  // 方案只存在本机的 localStorage（cs-learn-skin），不进入学习记录；页面加载前由 index.html 中的脚本先应用，避免闪烁
  var SKINS = [['', '清爽', '靛蓝主色、白底细边框，默认', ['#5b5bd6', '#eeeefd', '#f6f6f8']], ['paper', '纸面', '暖白纸色、墨绿主色、衬线标题', ['#0f766e', '#e2f0ec', '#f5f1ea']],
    ['play', '活泼', '亮绿主色、厚边框和立体按钮', ['#18874a', '#e3f6ea', '#f7f9fb']]];
  var SKIN_THEME = { '': ['#f6f6f8', '#111114'], paper: ['#f5f1ea', '#17150f'], play: ['#f7f9fb', '#0f171d'] };
  function skin() { var k = document.documentElement.dataset.skin || ''; return SKIN_THEME[k] ? k : ''; }
  function setSkin(k) {
    if (!SKIN_THEME[k]) k = '';
    document.documentElement.dataset.skin = k;
    try { if (k) localStorage.setItem('cs-learn-skin', k); else localStorage.removeItem('cs-learn-skin'); } catch (e) { /* 不能保存时只对当前页面生效 */ }
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    if (metas[0]) metas[0].content = SKIN_THEME[k][0];
    if (metas[1]) metas[1].content = SKIN_THEME[k][1];
  }
  function skinPicker() {
    var current = skin();
    return '<fieldset class="skin-picker"><legend>外观</legend><div class="skins">' + SKINS.map(function (x) {
      return '<label class="choice skin-choice"><input type="radio" name="skin" value="' + x[0] + '"' + (x[0] === current ? ' checked' : '') + '>' +
        '<span class="swatch" aria-hidden="true">' + x[3].map(function (c) { return '<i style="background:' + c + '"></i>'; }).join('') + '</span><strong>' + x[1] + '</strong><span>' + x[2] + '</span></label>';
    }).join('') + '</div><p class="small muted">只影响这个浏览器中的显示，立即生效；深色模式跟随系统。</p></fieldset>';
  }
  function greeting() {
    var h = new Date().getHours();
    return h < 5 ? '夜深了' : h < 11 ? '早上好' : h < 13 ? '中午好' : h < 18 ? '下午好' : '晚上好';
  }

  // ---------- 存储 ----------
  // 本页的代码比记录旧（另一个标签页已经用新版本保存过）时只读，不保存，避免用旧格式覆盖新记录
  var readOnly = false;
  function load() {
    var raw = null;
    try { raw = localStorage.getItem(KEY); } catch (error) { storageOk = false; }
    if (!raw) return C.emptyState();
    var parsed = null;
    try { parsed = JSON.parse(raw); } catch (error) { parsed = null; }
    if (parsed && typeof parsed.version === 'number' && parsed.version > C.STORE_VERSION) {
      readOnly = true;
      showUpdateBar('学习记录已被新版本的学习站更新，刷新页面后继续使用。');
      return C.emptyState();
    }
    try {
      var state = C.sanitize(parsed, data);
      // 旧版本的记录或下线内容的整理结果立即写回，之后的读取都是新格式
      if (JSON.stringify(state) !== raw) { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* 保存失败时下次再试 */ } }
      return state;
    } catch (error) {
      // 记录损坏时保留原文，避免下一次保存覆盖掉
      try { localStorage.setItem(KEY + '-broken-' + Date.now(), raw); } catch (e) { /* 忽略 */ }
      return C.emptyState();
    }
  }
  function save() {
    if (readOnly) { updateBadge(); return; }
    try { localStorage.setItem(KEY, JSON.stringify(state)); storageOk = true; askPersist(); } catch (error) {
      if (storageOk) toast('浏览器不允许保存记录（可能是隐私模式），关闭页面后记录会丢失');
      storageOk = false;
    }
    updateBadge();
  }

  // ---------- 计划与复习 ----------
  function currentPlan() {
    if (!state.profile) return null;
    return C.buildPlan({ route: state.profile.route, minutes: state.profile.minutes, deadline: state.profile.deadline,
      start: now(), placement: state.placement, done: state.done }, data);
  }
  function modes() {
    return state.profile ? C.dayModes(route(state.profile.route), data, state.placement) : {};
  }
  function due() { return C.dueList(state.cards, data.questions, now()); }
  function updateBadge() {
    var chip = document.getElementById('streak-chip');
    if (chip) {
      var streakDays = state && state.profile ? C.streak(state.log, now(), state.done) : 0;
      chip.hidden = !state || !state.profile;
      chip.className = 'streak-chip' + (state && C.activeDays(state.log, state.done)[now()] ? ' lit' : '');
      chip.innerHTML = icon('flame') + '<b>' + streakDays + '</b><span class="sr">天连续学习</span>';
      chip.title = '连续学习 ' + streakDays + ' 天';
    }
    var badge = document.getElementById('due-badge'), n = state ? due().length : 0;
    badge.hidden = !n;
    badge.textContent = n > 99 ? '99+' : n;
    badge.setAttribute('aria-label', n + ' 道题到期');
  }
  function rate(qid, rating) {
    var today = now();
    state.cards[qid] = C.schedule(state.cards[qid] || C.newCard(), rating, today);
    state.log[today] = (state.log[today] || 0) + 1;
    save();
    return state.cards[qid];
  }

  // ---------- 题卡 ----------
  var RATINGS = [['不会', C.FORGOT, 'x'], ['模糊', C.FUZZY, 'wave'], ['会', C.KNOWN, 'check']];
  function cardHtml(q, options) {
    options = options || {};
    var card = state.cards[q.id];
    var meta = [];
    if (q.heat) meta.push('<span class="tag hot">' + icon('flame', 'sm') + (q.heat > 1 ? '面试最常问' : '面试常问') + '</span>');
    if (options.source) meta.push('<span class="meta-text">' + esc(options.source) + '</span>');
    if (card && card.due && !options.hideDue) meta.push('<span class="meta-text">' + icon('clock', 'sm') + (C.isDue(card, now()) ? '今天复习' : '下次复习：' + relative(card.due)) + '</span>');
    var refs = q.links.map(function (l) {
      return '<li><a href="' + esc(l.href) + '" target="_blank" rel="noopener">' + esc(l.text) + icon('external', 'sm') + '</a></li>';
    }).join('');
    var buttons = RATINGS.map(function (r) {
      var next = C.schedule(card || C.newCard(), r[1], now());
      return '<button type="button" class="r' + r[1] + '" data-action="rate" data-rating="' + r[1] + '">' +
        '<span class="rate-icon">' + icon(r[2]) + '</span><span class="rate-text">' + r[0] +
        '<small>' + relative(next.due) + '再看</small></span><kbd class="rate-key" aria-hidden="true">' + (r[1] + 1) + '</kbd></button>';
    }).join('');
    return '<article class="card" data-q="' + esc(q.id) + '" data-source="' + esc(options.source || '') + '" aria-label="题目">' +
      (meta.length ? '<div class="meta">' + meta.join('') + '</div>' : '') +
      '<p class="q">' + esc(q.text) + '</p>' +
      '<label class="answer-label" for="ans-' + esc(q.id) + '">先写下你的回答<span>可选，用来对照要点和复制给 AI，不保存</span></label>' +
      '<textarea id="ans-' + esc(q.id) + '" data-answer rows="2" placeholder="用自己的话说出要点…"></textarea>' +
      '<div class="actions"><button type="button" class="btn primary" data-action="reveal" aria-expanded="false" aria-controls="a-' + esc(q.id) + '">看参考要点</button></div>' +
      '<div class="answer" id="a-' + esc(q.id) + '" tabindex="-1" hidden>' +
      '<p class="answer-title">' + icon('sparkle', 'sm') + '参考要点</p>' +
      '<p class="points">' + esc(q.points) + '</p>' +
      '<ul class="refs" aria-label="原文">' + refs + '</ul>' +
      '<p class="rate-prompt">对照参考要点，你能答出多少？</p>' +
      '<div class="rate" role="group" aria-label="自评">' + buttons + '</div>' +
      '<div class="card-tools"><button type="button" class="btn quiet sm" data-action="copy-ai">' + icon('copy') + '复制给 AI 追问</button>' +
      '<button type="button" class="btn quiet sm" data-action="share-q">' + icon('share') + '分享这道题</button>' +
      '<a class="btn quiet sm" href="' + esc(feedbackUrl(q)) + '" target="_blank" rel="noopener">' + icon('flag') + '要点有误</a></div>' +
      '</div><p class="rated" hidden></p></article>';
  }
  // 反馈题目：打开 GitHub 的新建议题页，预填题号、题目和要点；只有读者自己提交时才会发出，不含学习记录
  var ISSUES = 'https://github.com/CyC2018/CS-Notes/issues/new';
  function feedbackUrl(q) {
    var body = '题号：' + q.id + '\n题目：' + q.text + '\n\n参考要点：\n' + q.points.slice(0, 600) + '\n\n问题（哪里不对、应该怎样）：\n';
    return ISSUES + '?title=' + encodeURIComponent('学习站题目反馈：' + q.text.slice(0, 40)) + '&body=' + encodeURIComponent(body);
  }
  function reveal(cardEl) {
    var answer = cardEl.querySelector('.answer'), button = cardEl.querySelector('[data-action="reveal"]');
    termCheck(cardEl);
    answer.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    button.hidden = true;
    // 焦点放在要点上而不是自评按钮上：按空格展开时，松开空格会点到获得焦点的按钮
    answer.focus({ preventScroll: true });
  }
  // 写了回答再看要点时，列出要点中的术语哪些提到了、哪些没提到，帮助自评；没写回答时不显示
  function termCheck(cardEl) {
    var box = cardEl.querySelector('.term-check'), q = data.questions[cardEl.dataset.q], input = cardEl.querySelector('[data-answer]');
    if (box) box.remove();
    if (!q || !input || input.value.trim().length < 4) return;
    var terms = C.keyTerms(q.text, q.points);
    if (terms.length < 2) return;
    var r = C.compareAnswer(input.value, terms);
    // 只对照英文术语和带引号的说法，中文表述说对了同样算，所以没提到时不给分数，只提示留意
    var head = r.hit.length ? '要点里的术语，你的回答提到了 ' + r.hit.length + ' 个：' : '对照要点时留意这些术语（用中文说对了同样算）：';
    var html = '<p class="term-check"><span class="muted">' + head + '</span>' +
      r.hit.map(function (t) { return '<span class="term hit">' + icon('check', 'sm') + esc(t) + '</span>'; }).join('') +
      r.miss.map(function (t) { return '<span class="term miss">' + esc(t) + '</span>'; }).join('') + '</p>';
    cardEl.querySelector('.answer').insertAdjacentHTML('afterbegin', html);
  }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.cssText = 'position:fixed;top:-200px;opacity:0';
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (error) { ok = false; }
      area.remove();
      (ok ? resolve : reject)();
    });
  }
  function copyForAi(cardEl) {
    var q = data.questions[cardEl.dataset.q];
    copyText(C.aiPrompt(q, cardEl.querySelector('[data-answer]').value)).then(function () {
      toast('已复制，粘贴到你常用的 AI 应用中追问');
    }, function () { toast('复制失败，请检查浏览器的剪贴板权限'); });
  }
  // 自评后把题卡换成一行结果；onDone 用于复习页切换到下一题
  function rateCard(cardEl, rating, onDone) {
    // 记下自评前的卡片，“重新作答”时撤销这一次
    cardEl._undo = { card: state.cards[cardEl.dataset.q] || null, day: now() };
    var card = rate(cardEl.dataset.q, rating);
    cardEl.querySelector('.answer').hidden = true;
    cardEl.querySelector('textarea').hidden = true;
    cardEl.querySelector('.answer-label').hidden = true;
    var note = cardEl.querySelector('.rated');
    note.hidden = false;
    cardEl.classList.add('is-rated', 'rated-' + rating);
    var actions = cardEl.querySelector('.actions');
    if (actions) actions.hidden = true;
    note.innerHTML = '<span class="rated-icon">' + icon(RATINGS[rating][2]) + '</span><span>已记录：' + RATINGS[rating][0] + '，' + esc(relative(card.due)) + '再复习。</span>' +
      '<button type="button" class="btn quiet sm" data-action="again">重新作答</button>';
    if (onDone) onDone(card);
  }
  function resetCard(cardEl) {
    var undo = cardEl._undo, qid = cardEl.dataset.q;
    if (undo) {
      if (undo.card) state.cards[qid] = undo.card; else delete state.cards[qid];
      if (state.log[undo.day] > 1) state.log[undo.day] -= 1; else delete state.log[undo.day];
      save();
    }
    var holder = document.createElement('div');
    holder.innerHTML = cardHtml(data.questions[cardEl.dataset.q], { source: cardEl.dataset.source });
    cardEl.replaceWith(holder.firstChild);
  }
  // 题卡上的通用操作，各页面共用
  function handleCard(event, onRated) {
    var button = event.target.closest('[data-action]');
    var cardEl = button && button.closest('.card');
    if (!cardEl) return false;
    var action = button.dataset.action;
    if (action === 'reveal') reveal(cardEl);
    else if (action === 'copy-ai') copyForAi(cardEl);
    else if (action === 'share-q') shareLink('面试题：' + data.questions[cardEl.dataset.q].text, '这道面试题你能答上来吗？' + data.questions[cardEl.dataset.q].text, questionUrl(cardEl.dataset.q));
    else if (action === 'rate') {
      var rating = Number(button.dataset.rating);
      rateCard(cardEl, rating, onRated && function (card) { onRated(cardEl, card, rating); });
    }
    else if (action === 'again') resetCard(cardEl);
    else return false;
    return true;
  }

  // ---------- 页面：设置 ----------
  var MINUTES = [[60, '1 小时'], [90, '1.5 小时'], [120, '2 小时'], [180, '3 小时']];
  var ROUTE_ICON = { java: 'code', llm: 'sparkle', sprint: 'target' };
  function viewSetup() {
    var p = state.profile || { route: presetRoute, minutes: 90, deadline: null };
    var routes = data.routes.map(function (r) {
      var qn = {};
      r.stages.forEach(function (st) { st.days.forEach(function (id) { day(id).questions.forEach(function (q) { qn[q] = 1; }); }); });
      return '<label class="choice route-choice"><input type="radio" name="route" value="' + r.id + '"' + (p.route === r.id ? ' checked' : '') + ' required>' +
        '<span class="route-icon" aria-hidden="true">' + icon(ROUTE_ICON[r.id] || 'book') + '</span>' +
        '<strong>' + esc(r.title) + '</strong><span>' + esc(r.summary) + '</span>' +
        '<span class="route-meta">' + totalDays(r) + ' 天 · ' + r.stages.length + ' 个阶段 · ' + Object.keys(qn).length + ' 道题</span></label>';
    }).join('');
    var minutes = MINUTES.map(function (m) {
      return '<label class="choice seg"><input type="radio" name="minutes" value="' + m[0] + '"' + (p.minutes === m[0] ? ' checked' : '') + '>' +
        '<strong>' + m[1] + '</strong></label>';
    }).join('');
    var changing = !!state.profile;
    var retiredRoute = !changing && state.archive.profile ? (data.retired.routes[state.archive.profile.route] || { title: state.archive.profile.route }) : null;
    var sample = data.questions[data.days['sprint-01'].questions[0]];
    var qCount = Object.keys(data.questions).length, dCount = data.routes.reduce(function (n, r) { return n + totalDays(r); }, 0);
    var demo = '<div class="demo" aria-hidden="true"><div class="demo-card"><p class="demo-meta"><span class="tag hot">' + icon('flame', 'sm') + '面试最常问</span><span class="meta-text">面试冲刺 第 1 天</span></p>' +
      '<p class="demo-q">' + esc(sample.text) + '</p><div class="demo-lines"><i></i><i></i><i class="short"></i></div>' +
      '<div class="demo-rate"><span class="r0">' + icon('x', 'sm') + '不会</span><span class="r1">' + icon('wave', 'sm') + '模糊</span><span class="r2 on">' + icon('check', 'sm') + '会<small>3 天后再看</small></span></div></div>' +
      '<div class="demo-streak">' + icon('flame') + '<span><b>12</b> 天连续学习</span></div>' +
      '<div class="demo-ring">' + ring(68, 100, '68%', '路线进度', 84) + '</div></div>';
    var intro = '<section class="landing"><div class="landing-hero"><div class="landing-copy"><p class="eyebrow">' + icon('sparkle', 'sm') + 'CS-Notes 学习 · 免费 · 无需注册</p><h1>先测水平，再按天学，<br>记到面试那天</h1>' +
      '<p class="lead">' + qCount + ' 道面试中的真实问题，分为 ' + data.routes.map(function (r) { return r.title; }).join('、') + '三条路线。已经会的跳过，不会的按天学，学过的按间隔复习。</p>' +
      '<div class="actions"><button type="button" class="btn primary big" data-jump="setup">选一条路线开始' + icon('arrow') + '</button><a class="btn big" href="#/q/' + esc(sample.id) + '">先做一道示例题</a></div>' +
      '<ul class="proof"><li><b>' + qCount + '</b>道题</li><li><b>' + data.routes.length + '</b>条路线</li><li><b>' + dCount + '</b>天的内容</li></ul></div>' + demo + '</div>' +
      '<ol class="steps"><li><span class="step-icon">' + icon('target') + '</span><b>定级</b><span>每个阶段两三道题，看参考要点后自评，约 10 分钟</span></li>' +
      '<li><span class="step-icon">' + icon('plan') + '</span><b>按天学</b><span>已经掌握的内容只做自测，其余按路线顺序排进每天</span></li>' +
      '<li><span class="step-icon">' + icon('review') + '</span><b>间隔复习</b><span>答“会”的题间隔拉长，答“不会”的明天再来</span></li></ol>' +
      '<p class="small muted center">' + icon('lock', 'sm') + '记录只保存在你的浏览器中（<a href="#/privacy">数据说明</a>）。想先看看：<a href="#/q/' + esc(sample.id) + '">一道示例题</a>、<a href="#/day/sprint-01">面试冲刺第 1 天</a>。</p></section>';
    if (retiredRoute) {
      intro = '<h1>选一条新的路线</h1><div class="panel notice"><p>你之前学的“' + esc(retiredRoute.title) + '”路线已经下线。已经练过的题和复习安排都保留着，换一条路线后，路线中相同的题会接着按原来的间隔复习。</p></div>';
    }
    return (changing ? '<header class="page-head"><p class="eyebrow">' + icon('sliders', 'sm') + '设置</p><h1>调整学习设置</h1><p class="muted">已完成的天和复习记录保留；更换路线后需要重新定级。</p></header>' : intro) +
      '<form id="setup" class="setup-form' + (changing ? '' : ' panel') + '">' + (changing || retiredRoute ? '' : '<h2 class="form-title">开始之前，选三项</h2>') +
      '<fieldset><legend><span class="num">1</span>学习路线</legend><div class="routes">' + routes + '</div></fieldset>' +
      '<fieldset><legend><span class="num">2</span>每天能用的时间</legend><div class="grid minutes">' + minutes + '</div></fieldset>' +
      '<fieldset><legend><span class="num">3</span>面试日期（可选）</legend><div class="row"><input type="date" name="deadline" min="' + C.addDays(now(), 1) + '" value="' + esc(p.deadline || '') + '" aria-describedby="deadline-help">' +
      '<button type="button" class="btn quiet" data-action="clear-date">不设日期</button></div>' +
      '<p class="small muted" id="deadline-help">设置后，时间不够时先去掉只需自测的天，再去掉面试中问得最少的内容。</p></fieldset>' +
      '<div class="actions">' +
      (changing ? '<button type="submit" class="btn primary" name="go" value="save">保存</button><a class="btn quiet" href="#/plan">取消</a>' :
        '<button type="submit" class="btn primary big" name="go" value="place">开始定级' + icon('arrow') + '</button>' +
        '<button type="submit" class="btn big" name="go" value="skip">跳过定级，从第 1 天开始</button>') +
      '</div></form>' + (changing ? '<div class="panel">' + skinPicker() + '</div>' : '');
  }
  function bindSetup() {
    var form = document.getElementById('setup');
    form.addEventListener('click', function (event) {
      if (event.target.closest('[data-action="clear-date"]')) form.deadline.value = '';
    });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var go = event.submitter ? event.submitter.value : 'save';
      var routeId = (form.querySelector('input[name="route"]:checked') || {}).value;
      if (!routeId) { toast('先选一条学习路线'); return; }
      var deadline = form.deadline.value;
      if (deadline && (!C.isDate(deadline) || deadline <= now())) { toast('面试日期要晚于今天'); form.deadline.focus(); return; }
      var minutes = Number((form.querySelector('input[name="minutes"]:checked') || {}).value) || 90;
      var changedRoute = state.profile && state.profile.route !== routeId;
      if (!state.profile && !state.archive.profile && !Object.keys(state.cards).length) state.seenUpdate = latestUpdate();
      state.profile = { route: routeId, minutes: minutes, deadline: deadline || null, start: (state.profile && state.profile.start) || now() };
      state.archive.profile = null;
      if (changedRoute || go === 'place') state.placement = C.createPlacement(route(routeId), data);
      if (go === 'skip') state.placement = null;
      save();
      location.hash = go === 'place' || (changedRoute && go === 'save') ? '#/placement' : '#/plan';
    });
  }

  // ---------- 页面：定级 ----------
  var RESULT = { mastered: ['掌握', '只做自测'], partial: ['部分掌握', '答“会”的天只做自测'], weak: ['薄弱', '按路线学习'], unknown: ['未学', '按路线学习'] };
  function viewPlacement() {
    if (!state.profile) return viewSetup();
    if (!state.placement) state.placement = C.createPlacement(route(state.profile.route), data);
    var r = route(state.profile.route), next = C.nextPlacementQuestion(state.placement);
    if (!next) return viewPlacementResult();
    var progress = C.placementProgress(state.placement), stage = r.stages[next.stage], st = state.placement.stages[next.stage];
    var q = data.questions[next.id];
    var dots = r.stages.map(function (x, i) { var res = C.stageResult(state.placement.stages[i]); return '<i class="' + (i === next.stage ? 'now' : res ? 'done' : '') + '"></i>'; }).join('');
    return '<header class="page-head"><p class="eyebrow">' + icon('target', 'sm') + '定级 · 约 10 分钟</p><h1>定级：' + esc(r.title) + '</h1></header>' +
      '<div class="progress-line"><span>第 ' + (progress.done + 1) + ' / ' + progress.total + ' 个阶段</span>' +
      '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="' + progress.total + '" aria-valuenow="' + progress.done + '" aria-label="定级进度"><i style="width:' + (progress.done / progress.total * 100) + '%"></i></div></div>' +
      '<div class="stage-dots" aria-hidden="true">' + dots + '</div>' +
      '<h2 class="stage-title">' + icon('layers', 'sm') + esc(stage.title) + '<span class="muted small">本阶段第 ' + (st.asked.length + 1) + ' 题</span></h2>' +
      '<p class="small muted">按真实情况自评：能说出要点中的主要内容算“会”，只记得一部分算“模糊”。</p>' +
      cardHtml(q, { hideDue: true }) +
      '<div class="actions"><button type="button" class="btn" data-action="skip-stage" data-stage="' + next.stage + '">这个阶段没学过，跳过</button>' +
      '<button type="button" class="btn quiet" data-action="finish-placement">结束定级，剩下的按未学处理</button></div>';
  }
  function bindPlacement() {
    onClick = function (event) {
      var button = event.target.closest('[data-action]');
      if (!button) return;
      var action = button.dataset.action;
      if (action === 'rate') {
        var cardEl = button.closest('.card'), next = C.nextPlacementQuestion(state.placement);
        if (!next || next.id !== cardEl.dataset.q) return;
        C.answerPlacement(state.placement, next.stage, next.id, Number(button.dataset.rating));
        // 答“会”“模糊”的题加入复习，过几天确认是不是真的记得；答“不会”的还没学，学到那一天时再练
        if (Number(button.dataset.rating) !== C.FORGOT) rate(next.id, Number(button.dataset.rating));
        else { state.log[now()] = (state.log[now()] || 0) + 1; save(); }  // 仍算作今天的学习量
        render();
      } else if (action === 'skip-stage') {
        C.skipStage(state.placement, Number(button.dataset.stage));
        save();
        render();
      } else if (action === 'finish-placement') {
        state.placement.stages.forEach(function (s) { if (!C.stageResult(s)) s.skipped = true; });
        save();
        render();
      } else if (action === 'redo-placement') {
        state.placement = C.createPlacement(route(state.profile.route), data);
        save();
        render();
      } else {
        handleCard(event);
      }
    };
  }
  function viewPlacementResult() {
    var r = route(state.profile.route), plan = currentPlan();
    var rows = r.stages.map(function (stage, i) {
      var result = C.stageResult(state.placement.stages[i]) || 'unknown';
      return '<div class="result"><span><b>' + esc(stage.title) + '</b> <span class="muted small">' + stage.days.length + ' 天 · ' + RESULT[result][1] + '</span></span>' +
        '<span class="tag ' + result + '">' + RESULT[result][0] + '</span></div>';
    }).join('');
    return '<header class="page-head"><p class="eyebrow">' + icon('check', 'sm') + '定级完成</p><h1>定级结果</h1></header>' +
      '<p>' + esc(r.title) + '共 ' + totalDays(r) + ' 天：按路线学习 ' + plan.counts.learn + ' 天，已掌握、只做自测 ' + plan.counts.check + ' 天。' +
      (plan.dropped.length ? '到面试日期为止时间不够，有 ' + plan.dropped.length + ' 天没有排进计划。' : '') + '</p>' +
      '<div class="panel">' + rows + '</div>' +
      (plan.counts.learn === 0 ? '<div class="panel notice"><p>定级显示所有阶段都已掌握，计划中只有自测。自测时答不上的题，记得打开原文读一遍；也可以先做一轮<a href="#/mock">模拟面试</a>，确认自评没有偏乐观。</p></div>' : '') +
      '<p class="small muted">定级中答“会”和“模糊”的题已经加入复习，过几天会再出现；答“不会”的题学到那一天时再练。</p>' +
      '<div class="actions"><a class="btn primary big" href="#/plan">查看学习计划' + icon('arrow') + '</a>' +
      '<button type="button" class="btn quiet" data-action="redo-placement">重新定级</button></div>';
  }

  // ---------- 页面：今天 ----------
  var MODE = { learn: ['学习', 'learn'], check: ['只做自测', 'mastered'] };
  function planItemHtml(item, d) {
    var done = state.done[item.day];
    return '<a class="plan-item task' + (done ? ' done' : '') + '" href="#/day/' + esc(item.day) + '">' +
      '<span class="task-check" aria-hidden="true">' + (done ? icon('check') : d.n) + '</span>' +
      '<span class="task-body"><span class="task-title">第 ' + d.n + ' 天：' + esc(d.title) + (done ? '<span class="sr">（已完成）</span>' : '') + '</span>' +
      '<span class="task-meta"><span class="tag ' + MODE[item.mode][1] + '">' + MODE[item.mode][0] + '</span>' +
      '<span>' + esc(stageOf(d).title) + '</span><span>' + icon('clock', 'sm') + '约 ' + item.minutes + ' 分钟</span></span></span>' +
      icon('chev', 'task-chev') + '</a>';
  }
  // 最近 7 天的学习情况，今天在最右边
  // 连续学习下面的一行说明：保护的次数、刚用掉保护、离下一次保护还差几天
  function streakNote(today) {
    var info = C.streakInfo(state.log, today, state.done), last = info.used[info.used.length - 1];
    if (!info.days) return '<p class="streak-note">学满 ' + C.FREEZE_EVERY + ' 天得到 1 次保护，偶尔中断一天不会清零。</p>';
    if (last && C.daysBetween(last, today) <= 2) return '<p class="streak-note ice">' + icon('shield', 'sm') + dateLabel(last) + '没有学习，用掉 1 次保护，连续天数保住了。</p>';
    return '<p class="streak-note">' + icon('shield', 'sm') + (info.freezes ? '有 ' + info.freezes + ' 次保护，中断一天会自动使用' : '再学 ' + (C.FREEZE_EVERY - (info.days % C.FREEZE_EVERY || 0)) + ' 天得到 1 次保护') + '</p>';
  }
  // 连续天数到了值得纪念的数字时，完成页上多一句
  function milestoneLine() {
    var n = C.streak(state.log, now(), state.done);
    return C.activeDays(state.log, state.done)[now()] && C.isMilestone(n) ? '<p class="milestone">' + icon('flame', 'sm') + '连续学习 ' + n + ' 天' + (n >= 30 ? '，已经是习惯了' : n >= 7 ? '，坚持住了一周以上' : '') + '。</p>' : '';
  }
  function weekStrip(today) {
    var active = C.activeDays(state.log, state.done), frozen = C.streakInfo(state.log, today, state.done).used, cells = '';
    for (var i = 6; i >= 0; i--) {
      var d = C.addDays(today, -i), on = !!active[d], ice = frozen.indexOf(d) !== -1, p = d.split('-').map(Number);
      var wd = WEEK[new Date(p[0], p[1] - 1, p[2]).getDay()];
      cells += '<li class="' + (on ? 'on' : ice ? 'ice' : '') + (i === 0 ? ' now' : '') + '"><span aria-hidden="true">' + (i === 0 ? '今' : wd) + '</span>' +
        '<i aria-hidden="true">' + (on ? icon('check') : ice ? icon('shield') : '') + '</i><b class="sr">' + dateLabel(d) + (on ? '学习了' : ice ? '没有学习，用了一次保护' : '没有学习') + '</b></li>';
    }
    return '<ol class="week" aria-label="最近 7 天">' + cells + '</ol>';
  }
  function latestUpdate() {
    var list = data.updates || [];
    return list.length ? list[list.length - 1].seq : 0;
  }
  // 内容更新后，按读者自己的记录说明对他有什么影响；和他无关的更新直接记为已读
  function updatePanel(r) {
    var u = C.updateSummary(state, data);
    if (!u) return '';
    if (!u.relevant) { state.seenUpdate = u.latest; save(); return ''; }
    var items = [];
    if (u.fresh.length) items.push('你学过的天里新增了 ' + u.fresh.length + ' 道题 <a class="btn small-btn" href="#/new">练习新题</a>');
    if (u.newDays.length) {
      items.push(r.title + '新增了 ' + u.newDays.length + ' 天：' + u.newDays.slice(0, 3).map(function (id) { var d = day(id); return '<a href="#/day/' + esc(id) + '">第 ' + d.n + ' 天：' + esc(d.title) + '</a>'; }).join('、') +
        (u.newDays.length > 3 ? ' 等' : '') + '，已经排进计划');
    }
    var qLinks = function (ids) { return ids.slice(0, 3).map(function (id) { return '<a href="#/q/' + esc(id) + '">' + esc(data.questions[id].text) + '</a>'; }).join('、') + (ids.length > 3 ? ' 等' : ''); };
    if (u.edited.length) items.push('你练过的题中有 ' + u.edited.length + ' 道改了问法或参考要点：' + qLinks(u.edited) + '。复习记录不变，下次复习时以新内容为准');
    if (u.changedDays.length) items.push('你学过的 ' + u.changedDays.length + ' 天调整了导读或阅读范围：' + u.changedDays.slice(0, 3).map(function (id) { var d = day(id); return '<a href="#/day/' + esc(id) + '">第 ' + d.n + ' 天：' + esc(d.title) + '</a>'; }).join('、') +
      (u.changedDays.length > 3 ? ' 等' : '') + '，有空可以再看一眼，不影响完成状态');
    if (u.missedOlder) items.push('距离你上次打开，学习站更新过多次，更早的调整不再逐条列出；记录都已经按新内容对应好');
    if (u.retired.length) items.push(u.retired.length + ' 道练过的题已下线，复习记录保留，不再安排复习');
    return '<section class="panel update" aria-labelledby="update-title"><h2 id="update-title">' + icon('bell') + '内容更新' + (u.date ? '<span class="muted small">　' + dateLabel(u.date) + '</span>' : '') + '</h2><ul>' +
      items.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul><div class="actions"><button type="button" class="btn quiet" data-action="dismiss-update" data-seq="' + u.latest + '">知道了</button></div></section>';
  }
  // 距离上一次学习过了几天，今天学过或从没学过时为 0
  function lastActive(today) {
    var active = C.activeDays(state.log, state.done), days = Object.keys(active).filter(function (d) { return d < today; }).sort();
    return !days.length || active[today] ? 0 : C.daysBetween(days[days.length - 1], today);
  }
  // 首页最上面只给一个下一步：先定级，再复习，再学今天的内容
  function nextStep(plan, today, dueIds, todays) {
    var placing = state.placement && C.nextPlacementQuestion(state.placement);
    if (placing) {
      var pr = C.placementProgress(state.placement);
      return { icon: 'target', title: '继续定级', text: '还剩 ' + (pr.total - pr.done) + ' 个阶段，完成后计划会跳过已经掌握的内容。', href: '#/placement', label: '继续定级' };
    }
    // 每天的复习有份额（按每天的时间算）：做完份额后先学当天的内容，到期的题积压时不会一直挡住新内容
    var base = C.reviewLimit(state.profile.minutes), limit = base, reviewed = state.log[today] || 0;
    // 积压超过两批时，今天的份额加倍（复习两批），先把积压降下来再学新内容，避免越积越多
    if (dueIds.length > base * 2) limit = base * 2;
    var next = todays.filter(function (item) { return !state.done[item.day]; })[0];
    if (dueIds.length && (reviewed < limit || !next)) {
      var gap = lastActive(today), back = gap >= 3 ? '欢迎回来，上次学习是 ' + gap + ' 天前。' : '';
      var batch = Math.min(dueIds.length, base, reviewed < limit ? Math.max(5, limit - reviewed) : base);
      var todayTotal = Math.max(batch, Math.min(dueIds.length, limit - reviewed)), rest = dueIds.length - todayTotal;
      var plan = todayTotal > batch ? '积压较多，今天复习 ' + todayTotal + ' 道（分两批），' : '';
      return { icon: 'review', title: '先复习 ' + batch + ' 道题', text: back + '约 ' + Math.max(1, Math.round(batch * 1.5)) + ' 分钟。' +
        (rest > 0 ? (next ? plan + '另外 ' + rest + ' 道留到明天，复习完再学今天的内容。' : '共 ' + dueIds.length + ' 道到期，其余的可以接着复习或留到明天。') : plan ? plan.replace(/，$/, '。') : '趁快要忘的时候回忆一次，记得最牢。'),
        href: '#/review', label: '开始复习',
        // 已经复习完一批、积压还没清时，给出先学今天内容的选择，不让新内容一直被挡住
        // 已经复习完一批、积压还没清时，给出先学今天内容的选择；时间紧的日子可以只复习 5 道，保住连续天数
        alt: next && reviewed >= base ? { href: '#/day/' + next.day, label: '先学第 ' + day(next.day).n + ' 天' } :
          batch > QUICK && !reviewed ? { href: '#/review/quick', label: '只有 5 分钟' } : null };
    }
    if (next) {
      var d = day(next.day);
      var backlog = dueIds.length ? '今天的复习份额做完了，还有 ' + dueIds.length + ' 道到期，学完有空可以接着复习，没空就留到明天。' : '';
      return { icon: next.mode === 'check' ? 'quiz' : 'book', minutes: next.minutes, stage: stageOf(d).title, title: '第 ' + d.n + ' 天：' + d.title,
        text: (next.mode === 'check' ? '定级显示已经掌握，只做自测，约 ' : '阅读、自测和动手，约 ') + next.minutes + ' 分钟。' + backlog, href: '#/day/' + next.day, label: next.mode === 'check' ? '开始自测' : '开始学习' };
    }
    return null;
  }
  function heroHtml(cls, eyebrow, title, text, actions, side) {
    return '<section class="hero' + (cls ? ' ' + cls : '') + '" aria-labelledby="next-title"><div class="hero-body"><p class="eyebrow">' + eyebrow + '</p>' +
      '<h2 id="next-title">' + title + '</h2>' + (text ? '<p>' + text + '</p>' : '') + '<div class="actions">' + actions + '</div></div>' +
      (side ? '<div class="hero-side">' + side + '</div>' : '') + '</section>';
  }
  // 路线的各个阶段：完成的天数和当前所在的阶段
  function stagePath(r, plan) {
    var nextDay = plan && plan.days.length ? plan.days[0].items.filter(function (i) { return !state.done[i.day]; })[0] : null;
    var current = nextDay ? day(nextDay.day).stage : -1;
    // 首页只列到当前阶段之后的两个，其余的在计划页
    var upto = Math.max(current, 0) + 2, rest = r.stages.length - 1 - upto;
    return '<ol class="path">' + r.stages.map(function (stage, i) {
      if (i > upto && rest > 1) return '';
      var n = stage.days.filter(function (id) { return state.done[id]; }).length, all = stage.days.length;
      var status = n === all ? 'complete' : i === current ? 'current' : n ? 'started' : '';
      return '<li class="path-stage ' + status + '"><span class="path-dot" aria-hidden="true">' + (n === all ? icon('check') : i + 1) + '</span>' +
        '<span class="path-body"><span class="path-title">' + esc(stage.title) + (status === 'current' ? '<span class="tag learn">进行中</span>' : '') + '</span>' +
        '<span class="bar" aria-hidden="true"><i style="width:' + (n / all * 100) + '%"></i></span>' +
        '<span class="path-meta">' + n + ' / ' + all + ' 天</span></span></li>';
    }).join('') + (rest > 1 ? '<li class="path-more"><a href="#/plan">之后还有 ' + rest + ' 个阶段：' + r.stages.slice(upto + 1).map(function (st) { return esc(st.title); }).join('、') + '</a></li>' : '') + '</ol>';
  }
  function viewHome() {
    if (!state.profile) return viewSetup();
    var r = route(state.profile.route), plan = currentPlan(), today = now(), dueIds = due();
    var todays = plan.days.length && plan.days[0].date === today ? plan.days[0].items : [];
    var finished = doneCount(r), total = totalDays(r), streakDays = C.streak(state.log, today, state.done);
    var m = C.mastery(r, data, state.cards);
    var solid = m.reduce(function (n, x) { return n + x.solid; }, 0), qTotal = m.reduce(function (n, x) { return n + x.total; }, 0);
    var step = nextStep(plan, today, dueIds, todays);
    var pct = total ? Math.round(finished / total * 100) : 0, progressRing = ring(finished, total, pct + '%', '已完成 ' + finished + ' / ' + total + ' 天');
    var html = '<header class="page-head"><p class="eyebrow">' + greeting() + ' · ' + esc(r.title) + '</p><h1>今天 <span class="muted small">' + dateLabel(today, true) + '</span></h1></header>' + updatePanel(r);
    var hero;
    if (step) {
      // 时长已经写在说明里，标签只写所在的阶段
      var chips = step.stage ? '<span class="chip-meta">' + icon('layers', 'sm') + esc(step.stage) + '</span>' : '';
      hero = heroHtml('', icon(step.icon, 'sm') + '下一步', esc(step.title), esc(step.text) + (chips ? '</p><p class="chips">' + chips : ''),
        '<a class="btn primary big" href="' + step.href + '">' + step.label + icon('arrow') + '</a>' + (step.alt ? '<a class="btn big" href="' + step.alt.href + '">' + esc(step.alt.label) + '</a>' : ''), progressRing);
    } else if (finished === total) {
      hero = heroHtml('done', icon('trophy', 'sm') + '全部完成', esc(r.title) + '的 ' + total + ' 天都学完了', '接下来靠复习把记住的内容保持住，也可以做一轮模拟面试检验一下。',
        '<a class="btn primary big" href="#/mock">模拟面试' + icon('arrow') + '</a><a class="btn" href="#/progress">查看进度</a>', progressRing);
    } else if (state.profile.deadline && state.profile.deadline <= today) {
      hero = heroHtml('', icon('mic', 'sm') + '已到面试日期', '祝面试顺利', '可以做一轮模拟面试热身；面试推迟了的话，在设置中修改日期，计划会重新排。',
        '<a class="btn primary big" href="#/mock">模拟面试' + icon('arrow') + '</a><a class="btn" href="#/setup">修改日期</a>', progressRing);
    } else {
      var tomorrow = plan.days.filter(function (entry) { return entry.date > today; })[0];
      hero = heroHtml('done', icon('check', 'sm') + '今天的任务完成了', streakDays > 1 ? '已经连续学习 ' + streakDays + ' 天' : '明天继续',
        tomorrow ? '明天：' + tomorrow.items.map(function (i) { var d = day(i.day); return '第 ' + d.n + ' 天 ' + esc(d.title); }).join('、') + '。想多学一点可以现在开始。' : '',
        tomorrow ? '<a class="btn" href="#/day/' + tomorrow.items[0].day + '">提前学明天的内容</a><a class="btn quiet" href="#/mock">模拟面试</a>' : '', progressRing);
    }
    var mainCol = hero;
    // 今天只有一项、而且就是上面的下一步时不再重复列出
    if (todays.length > 1 || (todays.length === 1 && !(step && step.href === '#/day/' + todays[0].day))) {
      var left = todays.filter(function (i) { return !state.done[i.day]; }).length;
      mainCol += '<section class="block"><div class="block-head"><h2>今天的计划</h2><span class="muted small">' + (left ? '还剩 ' + left + ' 项' : '都完成了') + '</span></div>' +
        '<div class="tasks">' + todays.map(function (item) { return planItemHtml(item, day(item.day)); }).join('') + '</div></section>';
    }
    mainCol += '<section class="block"><div class="block-head"><h2>学习路径</h2><a class="small" href="#/plan">完整计划</a></div>' + stagePath(r, plan) + '</section>';
    var last = plan.days[plan.days.length - 1];
    var side = '<div class="stats">' +
      '<div class="stat streak' + (C.activeDays(state.log, state.done)[today] ? ' lit' : '') + '"><span class="stat-icon">' + icon('flame') + '</span><b>' + streakDays + '</b><span>天连续学习</span>' + weekStrip(today) + streakNote(today) + '</div>' +
      '<div class="stat"><span class="stat-icon">' + icon('plan') + '</span><b>' + finished + '<small> / ' + total + '</small></b><span>天已完成</span></div>' +
      '<div class="stat"><span class="stat-icon">' + icon('target') + '</span><b>' + solid + '<small> / ' + qTotal + '</small></b><span>道题已掌握</span></div></div>';
    if (last && finished < total) {
      side += '<p class="muted small forecast">' + icon('clock', 'sm') + '按现在的计划，' + (plan.dropped.length ? '面试前能学完 ' + (total - plan.dropped.length) + ' / ' + total + ' 天，' : '') + '预计 ' + dateLabel(last.date) + '（' + relative(last.date) + '）学完。没按计划完成时，剩下的内容自动顺延。</p>';
    }
    side += '<nav class="quick" aria-label="更多">' +
      '<a href="#/mock">' + icon('mic') + '<span>模拟面试<small>按热度抽 8 道题</small></span>' + icon('chev', 'task-chev') + '</a>' +
      '<a href="#/review">' + icon('review') + '<span>复习<small>' + (dueIds.length ? dueIds.length + ' 道到期' : '今天没有到期的题') + '</small></span>' + icon('chev', 'task-chev') + '</a>' +
      '<a href="#/bank">' + icon('bank') + '<span>题库<small>' + Object.keys(data.questions).length + ' 道题，可搜索</small></span>' + icon('chev', 'task-chev') + '</a>' +
      '<a href="#/setup">' + icon('sliders') + '<span>调整设置<small>路线、每天的时间、面试日期</small></span>' + icon('chev', 'task-chev') + '</a></nav>';
    return html + '<div class="home"><div class="home-main">' + mainCol + '</div><aside class="home-side" aria-label="学习概况">' + side + '</aside></div>';
  }

  // ---------- 页面：计划 ----------
  function viewPlan() {
    if (!state.profile) return viewSetup();
    var r = route(state.profile.route), plan = currentPlan(), today = now();
    var minutes = MINUTES.filter(function (m) { return m[0] === state.profile.minutes; })[0];
    var last = plan.days[plan.days.length - 1];
    var html = '<header class="page-head"><p class="eyebrow">' + icon('plan', 'sm') + esc(r.title) + '</p><h1>学习计划</h1>' +
      '<p class="chips"><span class="chip-meta">' + icon('clock', 'sm') + '每天 ' + (minutes ? minutes[1] : state.profile.minutes + ' 分钟') + '</span>' +
      (state.profile.deadline ? '<span class="chip-meta">' + icon('mic', 'sm') + '面试 ' + dateLabel(state.profile.deadline) + '</span>' : '') +
      '<a class="chip-meta link" href="#/setup">' + icon('sliders', 'sm') + '调整</a></p></header>' +
      '<div class="stats plan-stats"><div class="stat"><b>' + (plan.counts.learn + plan.counts.check) + '<small> 天</small></b><span>待学' + (plan.counts.check ? '，其中 ' + plan.counts.check + ' 天只做自测' : '') + '</span></div>' +
      '<div class="stat"><b>' + plan.days.length + '<small> 天</small></b><span>排完需要</span></div>' +
      '<div class="stat"><b>' + (last ? shortDate(last.date) : '—') + '</b><span>预计学完' + (last ? '（' + relative(last.date) + '）' : '') + '</span></div></div>' +
      '<p class="muted small">没按计划完成时，剩下的内容会从今天起顺延。</p>' +
      (plan.days.length ? '<div class="actions inline"><button type="button" class="btn" data-action="calendar">' + icon('download') + '加到日历</button><span class="small muted">导出 .ics 文件，在手机或电脑的日历中打开，每个计划日一个全天提醒</span></div>' : '');
    if (plan.dropped.length) {
      html += '<div class="panel notice"><p>到面试日期为止时间不够，以下 ' + plan.dropped.length + ' 天没有排进计划（先去掉只需自测的天，再去掉面试中问得最少的内容），有空时可以直接打开：</p><p class="small">' +
        plan.dropped.map(function (id) { var d = day(id); return '<a href="#/day/' + esc(id) + '">第 ' + d.n + ' 天：' + esc(d.title) + '</a>'; }).join('、') + '</p></div>';
    }
    var lastStage = null;
    html += '<div class="timeline">' + plan.days.map(function (entry) {
      var first = day(entry.items[0].day), label = '';
      if (first.stage !== lastStage) { lastStage = first.stage; label = '<p class="timeline-stage">' + icon('layers', 'sm') + esc(stageOf(first).title) + '</p>'; }
      var p = entry.date.split('-').map(Number), wd = WEEK[new Date(p[0], p[1] - 1, p[2]).getDay()];
      return label + '<section class="plan-day' + (entry.date === today ? ' today' : '') + '"><div class="plan-date"><time datetime="' + entry.date + '">' +
        (entry.date === today ? '今天' : shortDate(entry.date)) + '</time><span class="plan-week" aria-hidden="true">' + (entry.date === today ? shortDate(entry.date) : '周' + wd) + '</span></div><div class="tasks">' +
        entry.items.map(function (item) { return planItemHtml(item, day(item.day)); }).join('') + '</div></section>';
    }).join('') + '</div>';
    var done = Object.keys(state.done).filter(function (id) { return day(id) && day(id).route === r.id; })
      .sort(function (a, b) { return day(a).n - day(b).n; });
    if (done.length) {
      html += '<details class="panel"><summary>' + icon('check', 'sm') + '已完成 ' + done.length + ' 天</summary><p class="small">' +
        done.map(function (id) { var d = day(id); return '<a href="#/day/' + esc(id) + '">第 ' + d.n + ' 天：' + esc(d.title) + '</a>'; }).join('、') + '</p></details>';
    }
    return html;
  }

  // ---------- 页面：每天的内容 ----------
  function viewDay(id) {
    var d = day(id);
    if (!d) {
      var gone = data.retired && data.retired.days[id];
      return gone ? '<h1>' + esc(gone.title) + '</h1><p>路线调整后，这一天的内容已经合并到别的天或下线。完成记录和复习记录都保留着。</p><div class="actions"><a class="btn primary" href="#/plan">查看现在的计划</a></div>'
        : '<h1>没有找到这一天</h1><p><a href="#/plan">返回计划</a></p>';
    }
    var r = route(d.route), mode = state.profile && state.profile.route === d.route ? modes()[id] : null;
    var siblings = [].concat.apply([], r.stages.map(function (s) { return s.days; })), at = siblings.indexOf(id);
    var reading = d.reading.map(function (l) {
      return '<li><a class="source" href="' + esc(l.href) + '" target="_blank" rel="noopener">' + icon('notes') +
        '<span><small>' + esc(l.note || '笔记') + '</small>' + esc(l.text) + '</span>' + (l.heat ? '<span class="tag hot">' + icon('flame', 'sm') + '常问</span>' : '') + icon('external', 'sm') + '</a></li>';
    }).join('');
    var rated = d.questions.filter(function (q) { return state.cards[q]; }).length;
    var steps = [['s-read', 'book', '阅读']].concat([['s-quiz', 'quiz', '自测']], d.practice ? [['s-practice', 'code', '动手']] : [], d.algos.length ? [['s-algo', 'algo', '算法']] : []);
    function head(i, sid, name, extra) {
      return '<div class="step-head"><span class="step-num" aria-hidden="true">' + icon(steps[i][1]) + '</span><h2 id="' + sid + '-t">' + name + '</h2>' + (extra || '') + '</div>';
    }
    var html = '<nav class="crumbs" aria-label="位置"><a href="#/plan">' + icon('back', 'sm') + '计划</a><span>' + esc(r.title) + '</span><span>' + esc(stageOf(d).title) + '</span></nav>' +
      '<header class="page-head day-head"><p class="eyebrow">第 ' + d.n + ' / ' + siblings.length + ' 天</p><h1>第 ' + d.n + ' 天：' + esc(d.title) + '</h1>' +
      '<p class="chips">' + (mode === 'check' ? '<span class="tag mastered">只做自测</span>' : '') +
      '<span class="chip-meta">' + icon('book', 'sm') + d.reading.length + ' 个小节</span><span class="chip-meta">' + icon('quiz', 'sm') + d.questions.length + ' 道自测</span>' +
      (d.practice ? '<span class="chip-meta">' + icon('code', 'sm') + '1 项动手</span>' : '') + (d.algos.length ? '<span class="chip-meta">' + icon('algo', 'sm') + d.algos.length + ' 道算法</span>' : '') + '</p></header>' +
      (mode === 'check' ? '<p class="notice-line">定级显示这部分已经掌握，直接做下面的自测；有答不上的再读原文。</p>' : '') +
      (d.guide ? '<p class="guide">' + esc(d.guide) + '</p>' : '');
    var body = '<section class="step" id="s-read">' + head(0, 's-read', '阅读') + '<p>' + esc(d.readingText) + '</p><ul class="sources" aria-label="打开原文">' + reading + '</ul></section>' +
      '<section class="step" id="s-quiz">' + head(1, 's-quiz', '自测', '<span class="step-count" id="quiz-count">' + rated + ' / ' + d.questions.length + '</span>') +
      '<p class="small muted">先自己回答，再看参考要点并自评；自评后加入复习。</p>' +
      d.questions.map(function (qid) { return cardHtml(data.questions[qid]); }).join('') + '</section>';
    var i = 2;
    if (d.practice) {
      body += '<section class="step" id="s-practice">' + head(i++, 's-practice', '动手') + '<p>' + esc(d.practice) + '</p>' + (d.expect ? '<details class="panel"><summary>预期结果</summary><p>' + esc(d.expect) + '</p></details>' : '') + '</section>';
    }
    if (d.algos.length) {
      body += '<section class="step" id="s-algo">' + head(i++, 's-algo', '算法') + '<ul class="sources">' + d.algos.map(function (a) {
        return '<li><a class="source" href="' + esc(a.href) + '" target="_blank" rel="noopener">' + icon('algo') + '<span>' + esc(a.text) + '</span>' + icon('external', 'sm') + '</a></li>';
      }).join('') + '</ul></section>';
    }
    body += '<div class="finish"><div class="actions"><button type="button" data-action="toggle-done"></button></div><div id="done-note" aria-live="polite"></div></div>' +
      '<nav class="pager" aria-label="翻页">' + (at > 0 ? '<a href="#/day/' + siblings[at - 1] + '">' + icon('back', 'sm') + '<span><small>上一天</small>' + esc(day(siblings[at - 1]).title) + '</span></a>' : '<span></span>') +
      (at < siblings.length - 1 ? '<a class="next" href="#/day/' + siblings[at + 1] + '"><span><small>下一天</small>' + esc(day(siblings[at + 1]).title) + '</span>' + icon('arrow', 'sm') + '</a>' : '') + '</nav>';
    var toc = '<aside class="day-side" aria-label="本页"><p class="side-title">本页</p><ol class="toc">' + steps.map(function (st) {
      return '<li><button type="button" data-jump="' + st[0] + '">' + icon(st[1], 'sm') + st[2] + (st[0] === 's-quiz' ? '<span class="toc-count" id="toc-quiz">' + rated + '/' + d.questions.length + '</span>' : '') + '</button></li>';
    }).join('') + '</ol><div class="bar" aria-hidden="true"><i id="toc-bar" style="width:' + (rated / d.questions.length * 100) + '%"></i></div>' +
      '<p class="small muted" id="toc-state">' + (state.done[id] ? '已完成' : '自评完再标记完成') + '</p></aside>';
    return html + '<div class="day-layout"><div class="day-main">' + body + '</div>' + toc + '</div>';
  }
  function bindDay(id) {
    var d = day(id);
    function counts() {
      var n = d.questions.filter(function (q) { return state.cards[q]; }).length, all = d.questions.length;
      var a = document.getElementById('quiz-count'), b = document.getElementById('toc-quiz'), bar = document.getElementById('toc-bar'), st = document.getElementById('toc-state');
      if (a) a.textContent = n + ' / ' + all;
      if (b) b.textContent = n + '/' + all;
      if (bar) bar.style.width = (n / all * 100) + '%';
      if (st) st.textContent = state.done[id] ? '已完成' : n === all ? '自测都做完了，可以标记完成' : '自评完再标记完成';
    }
    onClick = function (event) {
      if (handleCard(event)) {
        var current = main.querySelector('[data-action="toggle-done"]');
        if (current && !state.done[id]) doneButton(current, id);
        counts();
        return;
      }
      var button = event.target.closest('[data-action="toggle-done"]');
      if (!button) return;
      if (state.done[id]) delete state.done[id];
      else state.done[id] = now();
      save();
      // 只更新按钮，不重绘页面，题卡上写了一半的回答和展开的要点都保留
      doneButton(button, id, !!state.done[id]);
      if (!state.done[id]) toast('已撤销完成标记');
      counts();
    };
    var button = main.querySelector('[data-action="toggle-done"]');
    if (button) doneButton(button, id);
  }
  function doneButton(button, id, justDone) {
    var done = state.done[id], d = day(id);
    button.className = 'btn' + (done ? ' quiet' : ' primary big');
    button.setAttribute('aria-pressed', String(!!done));
    button.innerHTML = done ? icon('check') + '已完成（' + dateLabel(done) + '），撤销' : icon('check') + '完成这一天';
    var note = document.getElementById('done-note');
    if (!note) return;
    var unrated = d.questions.filter(function (q) { return !state.cards[q]; }).length;
    if (!done) {
      note.innerHTML = unrated ? '<p class="small muted">还有 ' + unrated + ' 道自测没有自评，自评后才会加入复习。</p>' : '';
      return;
    }
    if (!justDone) { note.innerHTML = ''; return; }
    // 刚完成时给出进度和下一步，学完一个阶段时单独说明
    var r = route(d.route), stage = stageOf(d), plan = state.profile && state.profile.route === d.route ? currentPlan() : null;
    var stageDone = stage.days.every(function (x) { return state.done[x]; });
    var next = null, today = false;
    (plan ? plan.days : []).some(function (entry) {
      next = entry.items.filter(function (i) { return !state.done[i.day]; })[0];
      today = entry.date === now();
      return !!next;
    });
    note.innerHTML = '<section class="hero done celebrate"><div class="hero-body"><p class="eyebrow">' + icon(stageDone ? 'trophy' : 'check', 'sm') + (stageDone ? '阶段完成' : '第 ' + d.n + ' 天完成') + '</p>' +
      '<h2>' + (stageDone ? esc(stage.title) + '的 ' + stage.days.length + ' 天都学完了' : '已完成 ' + doneCount(r) + ' / ' + totalDays(r) + ' 天') + '</h2>' +
      '<p>' + (unrated ? '还有 ' + unrated + ' 道自测没有自评，自评后才会按间隔复习。' : '今天自评的题会在 1～3 天后出现在复习中。') +
      (C.streak(state.log, now(), state.done) > 1 ? '已经连续学习 ' + C.streak(state.log, now(), state.done) + ' 天。' : '') + '</p>' +
      milestoneLine() + '<div class="actions">' + (next ? '<a class="btn primary" href="#/day/' + next.day + '">' + (today ? '继续今天的第 ' : '提前学第 ') + day(next.day).n + ' 天' + icon('arrow') + '</a>' : '') +
      '<a class="btn" href="#/">返回今天</a>' + (stageDone ? '<a class="btn quiet" href="#/progress">查看进度和分享</a>' : '') + '</div></div>' +
      '<div class="hero-side">' + ring(doneCount(r), totalDays(r), Math.round(doneCount(r) / totalDays(r) * 100) + '%', '路线进度') + '</div></section>';
  }

  // ---------- 页面：复习与模拟面试 ----------
  // 两者共用一套逐题作答的流程。复习进入时取一次到期列表，按每天的时间分批，答“不会”的题明天再出现；
  // 模拟面试按热度和不牢的程度抽 8 道，自评同样计入复习安排
  var sessions = { review: null, mock: null, 'new': null };
  var MOCK_SIZE = 8, QUICK = 5, quickNext = false;
  function startSession(kind) {
    var queue;
    if (kind === 'review') queue = due().slice(0, quickNext ? QUICK : C.reviewLimit(state.profile.minutes));
    else if (kind === 'new') queue = C.unpracticed(route(state.profile.route), data, state).slice(0, C.reviewLimit(state.profile.minutes));
    else queue = C.mockSet(route(state.profile.route), data, state.cards, MOCK_SIZE);
    sessions[kind] = { date: now(), queue: queue, index: 0, counts: [0, 0, 0], missed: [] };
    return sessions[kind];
  }
  function sessionSummary(kind, session) {
    var total = session.queue.length, c = session.counts;
    var rest = kind === 'review' ? due().length : kind === 'new' ? C.unpracticed(route(state.profile.route), data, state).length : 0;
    var missed = session.missed.map(function (id) {
      var q = data.questions[id], l = q.links[0];
      return '<li><span>' + esc(q.text) + '</span>' + (l ? ' <a href="' + esc(l.href) + '" target="_blank" rel="noopener">读原文' + icon('external', 'sm') + '</a>' : '') + '</li>';
    }).join('');
    var score = Math.round((c[2] + c[1] * 0.5) / total * 100);
    var html = '<div class="session-done"><div class="session-summary">' + ring(c[2] + c[1] * 0.5, total, kind === 'mock' ? String(score) : c[2] + '/' + total, kind === 'mock' ? '分' : '答“会”', 132) +
      '<div><p class="eyebrow">' + icon(kind === 'mock' ? 'mic' : 'review', 'sm') + { review: '复习', mock: '模拟面试', 'new': '练习新题' }[kind] + ' · ' + total + ' 道题</p>' +
      '<h1>' + { review: '这一轮复习完成了', mock: '模拟面试结束', 'new': '新题练完了' }[kind] + '</h1>' +
      '<div class="score"><span class="score-item r2">' + icon('check', 'sm') + '<b>' + c[2] + '</b>会</span><span class="score-item r1">' + icon('wave', 'sm') + '<b>' + c[1] + '</b>模糊</span><span class="score-item r0">' + icon('x', 'sm') + '<b>' + c[0] + '</b>不会</span></div></div></div>' +
      (kind === 'mock' ? '<p>按“会”计 1 分、“模糊”计半分，这一轮得 ' + score + ' 分。' + (score >= 80 ? '高频题基本都能答上来。' : score >= 50 ? '还有一些题需要补，答不上的题明天会出现在复习中。' : '先把答不上的题对应的原文读一遍，明天在复习中再试。') + '</p>' :
        '<p>' + (c[0] ? '答“不会”的题明天再出现，' : '') + '答“会”的题间隔会拉长。' + (kind === 'new' ? (rest ? '还有 ' + rest + ' 道新题。' : '自评过的题已经加入复习。') : rest ? '还有 ' + rest + ' 道到期的题。' : '今天到期的题都复习完了。') + '</p>');
    if (missed) html += '<h2>需要再看的题</h2><ul class="missed">' + missed + '</ul>';
    html += milestoneLine();
    html += '<div class="actions">' +
      (rest ? '<button type="button" class="btn primary" data-action="more">再' + (kind === 'new' ? '练' : '复习') + ' ' + Math.min(rest, C.reviewLimit(state.profile.minutes)) + ' 道</button><a class="btn" href="#/">先到这里</a>' :
        kind === 'mock' ? '<button type="button" class="btn primary" data-action="more">再来一轮</button><a class="btn" href="#/">返回今天</a>' :
        '<a class="btn primary" href="#/">返回今天</a>') + '</div></div>';
    return html;
  }
  function viewSession(kind) {
    if (!state.profile) return viewSetup();
    var session = sessions[kind];
    // 上一轮已经做完、又从别的页面进来时，开始新的一轮
    if (!session || session.date !== now() || quickNext || (entering && session.index >= session.queue.length)) session = startSession(kind);
    quickNext = false;
    var total = session.queue.length;
    if (!total && kind === 'new') {
      return '<div class="empty"><span class="empty-icon">' + icon('check') + '</span><h1>练习新题</h1><p>学过的天里没有还没练过的题。</p><div class="actions"><a class="btn primary" href="#/">返回今天</a></div></div>';
    }
    if (!total) {
      var upcoming = Object.keys(state.cards).map(function (id) { return state.cards[id].due; }).filter(Boolean).sort();
      return '<div class="empty"><span class="empty-icon">' + icon('check') + '</span><h1>复习</h1><p>今天没有到期的题。' +
        (upcoming.length ? '下一批在 ' + dateLabel(upcoming[0]) + '（' + relative(upcoming[0]) + '），共 ' + upcoming.filter(function (d) { return d === upcoming[0]; }).length + ' 道。' :
          '还没有加入复习的题：定级和每天的自测中自评过的题会自动加入。') + '</p>' +
        '<p class="small muted">复习的间隔是 1、3、7、15、30、60 天：答“会”就拉长一级，“模糊”保持并减半，“不会”从 1 天重新开始。</p>' +
        '<div class="actions"><a class="btn primary" href="#/mock">' + icon('mic') + '做一轮模拟面试</a><a class="btn" href="#/">返回今天</a></div></div>';
    }
    if (session.index >= total) return sessionSummary(kind, session);
    var q = data.questions[session.queue[session.index]];
    var source = q.days.map(function (id) { var d = day(id); return route(d.route).title + ' 第 ' + d.n + ' 天'; })[0];
    var segs = '';
    for (var k = 0; k < total; k++) segs += '<i class="' + (k < session.index ? 'done' : k === session.index ? 'now' : '') + '"></i>';
    return '<div class="session"><div class="session-top"><a class="icon-btn" href="#/" aria-label="退出，回到今天">' + icon('x') + '</a>' +
      '<div class="progress-line"><span>' + (session.index + 1) + ' / ' + total + '</span>' +
      '<div class="bar segs' + (total > 24 ? ' dense' : '') + '" role="progressbar" aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + session.index + '" aria-label="进度">' + segs + '</div></div>' +
      '<span class="session-tally" aria-label="已答：会 ' + session.counts[2] + '，模糊 ' + session.counts[1] + '，不会 ' + session.counts[0] + '"><span class="r2">' + icon('check', 'sm') + session.counts[2] + '</span><span class="r0">' + icon('x', 'sm') + session.counts[0] + '</span></span></div>' +
      '<h1 class="session-title">' + { review: '复习', mock: '模拟面试', 'new': '练习新题' }[kind] + '</h1>' +
      (kind === 'new' && session.index === 0 ? '<p class="small muted">这些题是笔记更新后加进你学过的天里的，自评后和其它题一样按间隔复习。</p>' : '') +
      (kind === 'mock' && session.index === 0 ? '<p class="small muted">像在面试中一样，先用一两分钟把答案说出来或写下来，再看参考要点自评。题目按面试中被问到的频率和你还不牢的程度抽取。</p>' : '') +
      cardHtml(q, { source: source, hideDue: true }) +
      '<p class="keys">快捷键：<kbd>空格</kbd> 看参考要点，<kbd>1</kbd> 不会，<kbd>2</kbd> 模糊，<kbd>3</kbd> 会</p></div>';
  }
  function bindSession(kind) {
    onClick = function (event) {
      if (event.target.closest('[data-action="more"]')) { startSession(kind); render(); main.focus({ preventScroll: true }); window.scrollTo(0, 0); return; }
      handleCard(event, function (cardEl, card, rating) {
        var session = sessions[kind];
        session.counts[rating] += 1;
        if (rating !== C.KNOWN) session.missed.push(cardEl.dataset.q);
        session.index += 1;
        setTimeout(function () { render(); }, 250);
      });
    };
  }
  document.addEventListener('keydown', function (event) {
    if (['review/', 'mock/', 'new/'].indexOf(currentView) === -1 || event.metaKey || event.ctrlKey || event.altKey || event.isComposing) return;
    if (event.target.closest && event.target.closest('textarea, input')) return;
    var cardEl = main.querySelector('.card');
    if (!cardEl) return;
    var answer = cardEl.querySelector('.answer');
    if ((event.key === ' ' || event.key === 'Enter') && answer.hidden && !cardEl.querySelector('.rated:not([hidden])')) {
      event.preventDefault();
      reveal(cardEl);
    } else if (!answer.hidden && /^[123]$/.test(event.key)) {
      event.preventDefault();
      cardEl.querySelector('[data-rating="' + (Number(event.key) - 1) + '"]').click();
    }
  });

  // ---------- 分享 ----------
  function siteUrl() { return location.origin + location.pathname.replace(/index\.html$/, ''); }
  function questionUrl(id) { return siteUrl() + '#/q/' + id; }
  // 手机上用系统分享面板（可以直接发到微信等应用），电脑上复制链接更顺手
  function canShareNative() { return !!navigator.share && window.matchMedia('(pointer: coarse)').matches; }
  function shareLink(title, text, url) {
    if (canShareNative()) {
      navigator.share({ title: title, text: text, url: url }).catch(function (error) {
        if (error && error.name !== 'AbortError') copyText(text + ' ' + url).then(function () { toast('已复制链接'); });
      });
      return;
    }
    copyText(text + '\n' + url).then(function () { toast('已复制链接，可以粘贴给朋友'); }, function () { toast('复制失败：' + url); });
  }

  // 分享图片：1080×1440 竖图，适合朋友圈和聊天；全部在本地用 canvas 绘制
  var CARD = { w: 1080, h: 1440 };
  function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
  function wrapText(g, text, maxWidth) {
    var lines = [], line = '';
    Array.from(text).forEach(function (ch) {
      if (g.measureText(line + ch).width > maxWidth && line) { lines.push(line); line = ch; } else line += ch;
    });
    if (line) lines.push(line);
    return lines;
  }
  // 版面自上而下：标题 120～210、完成天数 250～430、三个数字 470～560、各阶段 610 起，最多到底部文字区上方 40 像素；
  // 阶段多时按可用高度缩小行高和字号，保证不会压到底部的说明和二维码
  // 分享图的配色，与 app.css 中各方案的浅色变量一致
  var SKIN_CARD = {
    '': { theme: '#5b5bd6', soft: '#e3e3fb', ink: '#15151c', muted: '#5e5e6a', line: '#e4e4ea', bg: '#f6f6f8' },
    paper: { theme: '#0f766e', soft: '#d6ebe6', ink: '#1f1b16', muted: '#6a6155', line: '#e4dccf', bg: '#f5f1ea' },
    play: { theme: '#18874a', soft: '#d5f0de', ink: '#17222c', muted: '#5d6974', line: '#e1e8ee', bg: '#f7f9fb' }
  };
  function drawShareCard(canvas) {
    var r = route(state.profile.route), today = now(), m = C.mastery(r, data, state.cards);
    var finished = doneCount(r), total = totalDays(r), streakDays = C.streak(state.log, today, state.done);
    var solid = m.reduce(function (n, x) { return n + x.solid; }, 0), seen = Object.keys(state.cards).length;
    canvas.width = CARD.w; canvas.height = CARD.h;
    var g = canvas.getContext('2d'), font = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif';
    // 固定使用当前配色方案的浅色，不随页面的深色模式变化
    var pal = SKIN_CARD[skin()] || SKIN_CARD[''];
    var theme = pal.theme, soft = pal.soft, ink = pal.ink, muted = pal.muted, line = pal.line, left = 120, right = CARD.w - 120;
    g.textBaseline = 'alphabetic';
    g.fillStyle = pal.bg; g.fillRect(0, 0, CARD.w, CARD.h);
    g.fillStyle = '#fff'; roundRect(g, 60, 60, CARD.w - 120, CARD.h - 120, 36); g.fill();
    g.fillStyle = theme; g.font = '600 34px ' + font; g.fillText('CS-Notes 学习', left, 150);
    g.fillStyle = muted; g.font = '30px ' + font; g.fillText(dateLabel(today) + ' · ' + r.title, left, 198);
    g.fillStyle = ink; g.font = '700 132px ' + font; g.fillText(String(finished), left, 360);
    var w = g.measureText(String(finished)).width;
    g.fillStyle = muted; g.font = '500 48px ' + font; g.fillText('/ ' + total + ' 天', left + w + 18, 360);
    g.font = '30px ' + font; g.fillText('已完成的学习天数', left, 408);
    g.fillStyle = line; roundRect(g, left, 432, right - left, 16, 8); g.fill();
    g.fillStyle = theme; roundRect(g, left, 432, Math.max(16, (right - left) * finished / total), 16, 8); g.fill();
    [[streakDays, '天连续学习'], [solid, '道题已掌握'], [seen, '道题练过']].forEach(function (item, i) {
      var x = left + i * 290;
      g.fillStyle = ink; g.font = '700 64px ' + font; g.fillText(String(item[0]), x, 540);
      g.fillStyle = muted; g.font = '28px ' + font; g.fillText(item[1], x, 582);
    });
    var qrSize = 220, qrX = right - qrSize, footTop = CARD.h - 120 - qrSize - 30;
    g.fillStyle = ink; g.font = '600 34px ' + font; g.fillText('各阶段掌握', left, 650);
    var top = 676, bottom = footTop - 40;
    if (m.length <= 6) {
      // 阶段少：一行一个，名称在左、进度条在中间、数字在右
      var rowH = Math.min(58, (bottom - top) / m.length), size = 28, barH = 20;
      g.font = size + 'px ' + font;
      var labelW = Math.min(360, Math.max.apply(null, m.map(function (st) { return g.measureText(st.title).width; })));
      var barX = left + labelW + 28, barW = right - barX - 110;
      m.forEach(function (st, i) {
        var mid = top + i * rowH + rowH / 2;
        g.textBaseline = 'middle';
        g.fillStyle = ink; g.font = size + 'px ' + font; g.fillText(fitText(g, st.title, labelW), left, mid);
        stageBar(g, barX, mid - barH / 2, barW, barH, st, soft, theme);
        g.fillStyle = muted; g.font = '26px ' + font; g.fillText(st.solid + '/' + st.total, barX + barW + 18, mid);
      });
    } else {
      // 阶段多：分两列，每格上面是名称和数字、下面是进度条，字号不小于 24 像素，手机上看分享图时仍然认得出
      var colW = (right - left - 48) / 2, perCol = Math.ceil(m.length / 2), cellH = Math.min(64, (bottom - top) / perCol);
      m.forEach(function (st, i) {
        var x = left + Math.floor(i / perCol) * (colW + 48), y = top + (i % perCol) * cellH;
        g.textBaseline = 'alphabetic';
        g.fillStyle = muted; g.font = '22px ' + font;
        var count = st.solid + '/' + st.total, countW = g.measureText(count).width;
        g.fillText(count, x + colW - countW, y + 26);
        g.fillStyle = ink; g.font = '24px ' + font; g.fillText(fitText(g, st.title, colW - countW - 16), x, y + 26);
        stageBar(g, x, y + 36, colW, 10, st, soft, theme);
      });
    }
    g.textBaseline = 'alphabetic';
    // 底部：一句介绍、说明和二维码
    g.strokeStyle = line; g.lineWidth = 2; g.beginPath(); g.moveTo(left, footTop); g.lineTo(right, footTop); g.stroke();
    var qrY = footTop + 30;
    g.fillStyle = ink; g.font = '600 36px ' + font;
    g.fillText('先定级，再按天学，', left, qrY + 52);
    g.fillText('用间隔复习记牢面试题', left, qrY + 102);
    g.fillStyle = muted; g.font = '28px ' + font;
    wrapText(g, '免费、无需注册，记录只保存在自己的浏览器中。扫码开始。', qrX - left - 40).forEach(function (t, i) { g.fillText(t, left, qrY + 156 + i * 40); });
    drawQr(g, siteUrl(), qrX, qrY, qrSize);
    g.strokeStyle = line; g.lineWidth = 2; roundRect(g, 60, 60, CARD.w - 120, CARD.h - 120, 36); g.stroke();
  }
  // 超出宽度时截断并加省略号
  function fitText(g, text, width) {
    if (g.measureText(text).width <= width) return text;
    while (g.measureText(text + '…').width > width && text.length > 2) text = text.slice(0, -1);
    return text + '…';
  }
  function stageBar(g, x, y, w, h, st, soft, theme) {
    g.fillStyle = soft; roundRect(g, x, y, w, h, h / 2); g.fill();
    if (st.solid) { g.fillStyle = theme; roundRect(g, x, y, Math.max(h, w * st.solid / st.total), h, h / 2); g.fill(); }
  }
  function roundRect(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }
  function drawQr(g, text, x, y, size) {
    var q = window.LearnQR.encode(text), cell = Math.floor(size / (q.size + 2)), offset = (size - cell * q.size) / 2;
    g.fillStyle = '#fff'; g.fillRect(x, y, size, size);
    g.fillStyle = '#1f2d33';
    q.modules.forEach(function (row, yy) { row.forEach(function (dark, xx) { if (dark) g.fillRect(x + offset + xx * cell, y + offset + yy * cell, cell, cell); }); });
  }
  function shareCardBlob(callback) {
    var canvas = document.createElement('canvas');
    drawShareCard(canvas);
    canvas.toBlob(callback, 'image/png');
  }

  // ---------- 页面：进度 ----------
  function heatmap(today) {
    // 最近 16 周，每列一周，从周一到周日；颜色按当天自评题数和完成天数分 4 级
    var weeks = 16, counts = {}, cells = '';
    Object.keys(state.log).forEach(function (d) { counts[d] = (counts[d] || 0) + state.log[d]; });
    Object.keys(state.done).forEach(function (id) { var d = state.done[id]; counts[d] = (counts[d] || 0) + 5; });
    var p = today.split('-').map(Number), weekday = (new Date(p[0], p[1] - 1, p[2]).getDay() + 6) % 7;
    var first = C.addDays(today, -weekday - (weeks - 1) * 7), active = 0;
    for (var i = 0; i < weeks * 7; i++) {
      var d = C.addDays(first, i), n = counts[d] || 0, future = d > today;
      if (n) active++;
      var level = !n ? 0 : n < 5 ? 1 : n < 10 ? 2 : n < 20 ? 3 : 4;
      cells += '<i class="l' + level + (future ? ' future' : '') + '" title="' + dateLabel(d) + (n ? '' : '：没有学习') + '"></i>';
    }
    return '<div class="heat-block"><div class="heat" role="img" aria-label="最近 16 周有 ' + active + ' 天在学习">' + cells + '</div>' +
      '<p class="small muted heat-legend">最近 16 周有 ' + active + ' 天在学习 <span aria-hidden="true">少 <i class="l0"></i><i class="l1"></i><i class="l2"></i><i class="l3"></i><i class="l4"></i> 多</span></p></div>';
  }
  // 热力图旁边的摘要：本周、最长连续、累计自评
  function weekSummary(today) {
    var active = C.activeDays(state.log, state.done), week = 0, best = 0, run = 0;
    for (var i = 0; i < 7; i++) if (active[C.addDays(today, -i)]) week++;
    for (var k = 111; k >= 0; k--) { if (active[C.addDays(today, -k)]) { run++; best = Math.max(best, run); } else run = 0; }
    var reviews = Object.keys(state.log).reduce(function (n, d) { return n + state.log[d]; }, 0);
    return '<dl class="heat-summary"><div><dt>最近 7 天</dt><dd>' + week + '<small> 天</small></dd></div><div><dt>最长连续</dt><dd>' + best + '<small> 天</small></dd></div>' +
      '<div><dt>累计自评</dt><dd>' + reviews + '<small> 次</small></dd></div></dl>';
  }
  function viewProgress() {
    if (!state.profile) return viewSetup();
    var r = route(state.profile.route), today = now(), m = C.mastery(r, data, state.cards);
    var solid = m.reduce(function (n, x) { return n + x.solid; }, 0), qTotal = m.reduce(function (n, x) { return n + x.total; }, 0);
    var streakDays = C.streak(state.log, today, state.done);
    var html = '<header class="page-head"><p class="eyebrow">' + icon('progress', 'sm') + esc(r.title) + ' · 从 ' + dateLabel(state.profile.start || today) + ' 开始</p><h1>进度</h1></header>' +
      '<div class="progress-top"><div class="panel progress-ring">' + ring(doneCount(r), totalDays(r), Math.round(doneCount(r) / totalDays(r) * 100) + '%', '路线完成', 120) +
      '<div><b class="big-num">' + doneCount(r) + '<small> / ' + totalDays(r) + ' 天</small></b><p class="muted small">' + r.stages.filter(function (st) { return st.days.every(function (x) { return state.done[x]; }); }).length + ' / ' + r.stages.length + ' 个阶段学完</p></div></div>' +
      '<div class="stats">' +
      '<div class="stat streak' + (streakDays ? ' lit' : '') + '"><span class="stat-icon">' + icon('flame') + '</span><b>' + streakDays + '</b><span>天连续学习</span></div>' +
      '<div class="stat"><span class="stat-icon">' + icon('target') + '</span><b>' + solid + '<small> / ' + qTotal + '</small></b><span>道题已掌握</span></div>' +
      '<div class="stat"><span class="stat-icon">' + icon('review') + '</span><b>' + Object.keys(state.cards).length + '</b><span>道题练过</span></div></div></div>' +
      '<section class="panel"><div class="block-head"><h2>学习记录</h2><span class="muted small">最近 16 周</span></div><div class="heat-wrap">' + heatmap(today) + weekSummary(today) + '</div></section>' +
      '<section class="panel"><div class="block-head"><h2>各阶段掌握</h2></div><p class="small muted">连续答“会”、复习间隔到 7 天以上的题算掌握；练过但还没到的算复习中。</p><div class="mastery-grid">' +
      m.map(function (st, i) {
        var days = r.stages[i].days, doneDays = days.filter(function (d) { return state.done[d]; }).length;
        return '<div class="mastery"><div class="mastery-head"><span>' + esc(st.title) + '</span><span class="muted small">' + doneDays + '/' + days.length + ' 天 · 掌握 ' + st.solid + '/' + st.total + ' 题</span></div>' +
          '<div class="stack" aria-hidden="true"><i class="solid" style="width:' + (st.solid / st.total * 100) + '%"></i><i class="learning" style="width:' + (st.learning / st.total * 100) + '%"></i></div></div>';
      }).join('') + '</div><p class="small muted legend"><i class="solid"></i>掌握 <i class="learning"></i>复习中 <i></i>没练过</p></section>';
    // 答错过的题：遗忘次数多的在前
    var shaky = Object.keys(state.cards).filter(function (id) { var c = state.cards[id]; return c.lapses > 0 || (c.stage === 0 && c.reps > 0); })
      .sort(function (a, b) { return state.cards[b].lapses - state.cards[a].lapses || (data.questions[b].heat - data.questions[a].heat); }).slice(0, 10);
    if (shaky.length) {
      html += '<section class="panel"><div class="block-head"><h2>常忘的题</h2><a class="small" href="#/bank">在题库中查看</a></div><ul class="missed">' + shaky.map(function (id) {
        var q = data.questions[id], c = state.cards[id];
        return '<li><a href="#/q/' + esc(id) + '">' + esc(q.text) + '</a> <span class="tag weak">' + (c.lapses ? '忘过 ' + c.lapses + ' 次' : '上次答“不会”') + '</span></li>';
      }).join('') + '</ul></section>';
    }
    html += '<section class="panel share-panel"><div class="share"><img id="share-preview" alt="进度分享图预览" width="270" height="360">' +
      '<div class="share-body"><h2>' + icon('share') + '分享进度</h2><p class="small muted">生成一张进度图，可以发到朋友圈或学习群；图中的二维码指向本站首页，不包含你的学习记录。</p><div class="actions">' +
      (canShareNative() && navigator.canShare ? '<button type="button" class="btn primary" data-action="share-image">' + icon('share') + '分享图片</button>' : '') +
      '<button type="button" class="btn' + (canShareNative() && navigator.canShare ? '' : ' primary') + '" data-action="save-image">' + icon('download') + '保存图片</button>' +
      '<button type="button" class="btn" data-action="share-site">' + icon('copy') + '复制邀请链接</button></div></div></div></section>' +
      '<div class="actions"><a class="btn quiet" href="#/data">' + icon('download') + '导出或导入记录</a></div>';
    // 练过的题多了、又很久没备份时，在页面底部轻提示一次导出
    var exported = lastExport(), n = Object.keys(state.cards).length;
    if (n >= 20 && (!exported || C.daysBetween(exported, now()) >= 14)) {
      html += '<p class="small muted backup-note">' + icon('lock', 'sm') + n + ' 道题的复习记录只在这个浏览器中，' + (exported ? '上次导出是 ' + ago(exported) : '还没有导出过') + '，换设备或清理浏览器前记得<a href="#/data">导出</a>。</p>';
    }
    return html;
  }
  function bindProgress() {
    var preview = document.getElementById('share-preview'), url = null;
    shareCardBlob(function (blob) { if (blob && preview) { url = URL.createObjectURL(blob); preview.src = url; } });
    onClick = function (event) {
      var button = event.target.closest('[data-action]');
      if (!button) return;
      var action = button.dataset.action, name = 'cs-notes-learn-' + now() + '.png';
      if (action === 'save-image') {
        shareCardBlob(function (blob) { downloadBlob(blob, name); toast('图片已保存'); });
      } else if (action === 'share-image') {
        shareCardBlob(function (blob) {
          var file = new File([blob], name, { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({ files: [file], title: 'CS-Notes 学习进度' }).catch(function () { /* 取消分享时不提示 */ });
          } else { downloadBlob(blob, name); toast('当前浏览器不能直接分享图片，已保存到本地'); }
        });
      } else if (action === 'share-site') {
        shareLink('CS-Notes 学习', '我在用 CS-Notes 学习准备面试：先定级，再按天学，用间隔复习记牢面试题。免费、无需注册。', siteUrl());
      }
    };
  }
  function downloadBlob(blob, name) {
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(link.href); }, 1000);
  }

  // ---------- 页面：题库 ----------
  // 全部自测题按路线和阶段排列，可以搜索和筛选；每道题链接到单独的页面
  var bankQuery = { text: '', filter: 'all', route: null };
  var FILTERS = [['all', '全部'], ['hot', '面试常问'], ['new', '没练过'], ['shaky', '常忘'], ['solid', '已掌握']];
  function bankMatch(q) {
    var c = state.cards[q.id], f = bankQuery.filter;
    if (f === 'hot' && !q.heat) return false;
    if (f === 'new' && c) return false;
    if (f === 'shaky' && !(c && (c.lapses > 0 || (c.stage === 0 && c.reps > 0)))) return false;
    if (f === 'solid' && !(c && c.stage >= 2)) return false;
    if (bankQuery.text) {
      var hay = (q.text + ' ' + q.points).toLowerCase();
      return bankQuery.text.toLowerCase().split(/\s+/).filter(Boolean).every(function (t) { return hay.indexOf(t) !== -1; });
    }
    return true;
  }
  function bankList() {
    var r = route(bankQuery.route), seen = {}, shown = 0, html = '';
    r.stages.forEach(function (stage) {
      var rows = '';
      stage.days.forEach(function (id) {
        day(id).questions.forEach(function (qid) {
          if (seen[qid]) return;
          seen[qid] = true;
          var q = data.questions[qid], c = state.cards[qid];
          if (!bankMatch(q)) return;
          shown++;
          var status = !c ? '' : c.stage >= 2 ? '<span class="tag mastered">已掌握</span>' : (c.lapses > 0 || c.stage === 0) ? '<span class="tag weak">常忘</span>' : '<span class="tag">复习中</span>';
          rows += '<li><a href="#/q/' + esc(qid) + '">' + esc(q.text) + '</a>' + (q.heat ? '<span class="tag hot">' + icon('flame', 'sm') + (q.heat > 1 ? '最常问' : '常问') + '</span>' : '') + status + icon('chev', 'task-chev') + '</li>';
        });
      });
      if (rows) html += '<h2 class="bank-stage">' + esc(stage.title) + '</h2><ul class="bank">' + rows + '</ul>';
    });
    return { html: html || '<div class="empty small-empty"><span class="empty-icon">' + icon('search') + '</span><p class="muted">没有符合条件的题，换个关键词或筛选试试。</p></div>', count: shown };
  }
  function viewBank() {
    if (!bankQuery.route) bankQuery.route = state.profile ? state.profile.route : data.routes[0].id;
    var list = bankList();
    return '<header class="page-head"><p class="eyebrow">' + icon('bank', 'sm') + Object.keys(data.questions).length + ' 道面试题</p><h1>题库</h1></header>' +
      '<div class="tabs" role="group" aria-label="路线">' + data.routes.map(function (r) {
        return '<button type="button" class="chip" data-route="' + r.id + '" aria-pressed="' + (r.id === bankQuery.route) + '">' + esc(r.title) + '</button>';
      }).join('') + '</div>' +
      '<div class="bank-tools"><div class="search">' + icon('search') + '<input type="search" id="bank-search" placeholder="搜索题目和要点，例如 索引、volatile" value="' + esc(bankQuery.text) + '" aria-label="搜索题目"></div>' +
      '<div class="tabs" role="group" aria-label="筛选">' + FILTERS.map(function (f) {
        return '<button type="button" class="chip" data-filter="' + f[0] + '" aria-pressed="' + (f[0] === bankQuery.filter) + '">' + f[1] + '</button>';
      }).join('') + '</div></div>' +
      '<p class="small muted" id="bank-count" aria-live="polite">' + list.count + ' 道题</p><div id="bank-list">' + list.html + '</div>';
  }
  function bindBank() {
    var input = document.getElementById('bank-search'), timer;
    function refresh() {
      var list = bankList();
      document.getElementById('bank-list').innerHTML = list.html;
      document.getElementById('bank-count').textContent = list.count + ' 道题';
    }
    input.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { bankQuery.text = input.value.trim(); refresh(); }, 120);
    });
    onClick = function (event) {
      var chip = event.target.closest('.chip');
      if (!chip) return;
      if (chip.dataset.route) bankQuery.route = chip.dataset.route;
      if (chip.dataset.filter) bankQuery.filter = chip.dataset.filter;
      chip.parentNode.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      refresh();
    };
  }

  // ---------- 页面：单道题（分享出去的链接） ----------
  function viewQuestion(id) {
    var q = data.questions[id];
    if (!q) {
      var gone = data.retired && data.retired.questions[id];
      return gone ? '<h1>这道题已下线</h1><p class="lead">' + esc(gone.text) + '</p><p>笔记更新后这道题不再出现在学习路线中，复习记录保留，不会再安排复习。</p><div class="actions"><a class="btn primary" href="#/bank">去题库看看</a></div>'
        : '<h1>没有找到这道题</h1><p>链接可能不完整。<a href="#/bank">去题库看看</a></p>';
    }
    var d = day(q.days[0]), r = route(d.route);
    var html = '<nav class="crumbs" aria-label="位置"><a href="#/bank">' + icon('back', 'sm') + '题库</a><span>' + esc(r.title) + '</span><span>第 ' + d.n + ' 天：' + esc(d.title) + '</span></nav>' +
      '<h1 class="sr">' + esc(q.text) + '</h1>' + cardHtml(q, { source: '', hideDue: false });
    if (!state.profile) {
      html += heroHtml('', icon('sparkle', 'sm') + 'CS-Notes 学习', '这样的面试题，按计划一道道掌握',
        '先用 ' + Object.keys(data.questions).length + ' 道真实面试题自评定级，按你的水平和面试日期排出每天的计划，再用间隔复习记牢。免费、无需注册，记录只保存在你的浏览器中。',
        '<a class="btn primary big" href="#/setup">开始定级' + icon('arrow') + '</a><a class="btn" href="#/day/' + esc(d.id) + '">看这道题所在的一天</a>');
    } else {
      html += '<div class="actions"><a class="btn" href="#/day/' + esc(d.id) + '">打开第 ' + d.n + ' 天</a><a class="btn quiet" href="#/">返回今天</a></div>';
    }
    return html;
  }

  // ---------- 页面：数据 ----------
  // ---------- 学习记录：导出、导入、数据说明 ----------
  var EXPORTED = 'cs-learn-exported', pendingImport = null, persisted = null;
  function lastExport() { try { return localStorage.getItem(EXPORTED); } catch (e) { return null; } }
  function markExported() { try { localStorage.setItem(EXPORTED, now()); } catch (e) { /* 忽略 */ } }
  // 导出的文件就是本地记录本身，另加导出日期和来源，导入时忽略这两项
  function exportText(pretty) {
    return JSON.stringify(Object.assign({ app: 'cs-notes-learn', exportedAt: now() }, state), null, pretty ? 2 : 0);
  }
  // 请浏览器把本站数据当作需要长期保存的数据（不保证同意）；只在开始学习后请求一次
  function askPersist() {
    if (persisted !== null || !navigator.storage || !navigator.storage.persist || !state.profile) return;
    persisted = false;
    navigator.storage.persisted().then(function (yes) { return yes || navigator.storage.persist(); }).then(function (yes) { persisted = !!yes; }, function () {});
  }
  function exportNote() {
    var d = lastExport(), n = Object.keys(state.cards).length;
    if (d) return '上次导出：' + dateLabel(d) + '（' + ago(d) + '）。';
    return n ? '还没有导出过。' : '';
  }
  function viewData() {
    var cards = Object.keys(state.cards).length, days = Object.keys(state.done).length, reviews = Object.keys(state.log).reduce(function (n, d) { return n + state.log[d]; }, 0);
    var html = '<header class="page-head"><p class="eyebrow">' + icon('lock', 'sm') + '只保存在这个浏览器中</p><h1>学习记录</h1></header>' +
      '<p>学习记录只保存在当前浏览器中，不上传。清除浏览器数据、换浏览器或换设备时记录不会跟着走，可以导出成文件或复制成文字，在另一处导入。<a href="#/privacy">数据与隐私说明</a></p>' +
      (storageOk ? '' : '<div class="panel notice"><p><strong>当前浏览器不允许保存记录</strong>（可能是隐私模式），关闭页面后记录会丢失，请及时导出。</p></div>') +
      '<div class="stats"><div class="stat"><b>' + cards + '</b><span>道题在复习中</span></div><div class="stat"><b>' + days + '</b><span>天已完成</span></div><div class="stat"><b>' + reviews + '</b><span>次自评</span></div></div>' +
      (Object.keys(state.archive.cards).length || Object.keys(state.archive.done).length ? '<p class="small muted">另有 ' + Object.keys(state.archive.cards).length + ' 道题、' + Object.keys(state.archive.done).length +
        ' 天的记录属于已经下线的内容，保留在记录中、随导出一起保存，内容重新上线时自动恢复。</p>' : '');
    if (pendingImport) return html + importPreview();
    return html +
      '<section class="panel"><h2>导出</h2><p class="small muted">' + exportNote() + '文件和文字的内容一样，都可以在另一处导入。</p>' +
      '<div class="actions"><button type="button" class="btn primary" data-action="export">' + icon('download') + '导出成文件</button>' +
      '<button type="button" class="btn" data-action="copy-export">' + icon('copy') + '复制成文字</button></div>' +
      '<p class="small muted">在手机和电脑之间转移时，复制成文字后发给自己（例如文件传输助手），在另一台设备上粘贴导入。</p></section>' +
      '<section class="panel drop-zone" id="drop-zone"><h2>导入</h2><p class="small muted">选择导出的文件、把文件拖到这里，或粘贴导出的文字。导入前会显示文件中的内容，可以选择合并或替换。</p>' +
      '<div class="actions"><button type="button" class="btn" data-action="import">' + icon('share') + '选择文件</button><input type="file" id="import-file" accept="application/json,.json" hidden>' +
      '<button type="button" class="btn" data-action="paste-open">粘贴文字</button></div>' +
      '<div id="paste-box" hidden><label class="field-label" for="paste-text">导出的文字</label><textarea id="paste-text" rows="4" spellcheck="false" placeholder="{&quot;app&quot;:&quot;cs-notes-learn&quot;, …}"></textarea>' +
      '<div class="actions"><button type="button" class="btn primary" data-action="paste-import">读取</button></div></div></section>' +
      '<div class="panel">' + skinPicker() + '</div>' +
      '<p class="small"><button type="button" class="btn quiet" data-action="reset">清空学习记录</button></p>' +
      '<h2>关于题目和参考要点</h2><p>题目来自 CS-Notes 学习路线中的自测题，是面试中的常见问法；参考要点由作者编写并对照原文核对。热度标记来自笔记中的高频小节标记。“复制给 AI 追问”只把题目、你的回答和参考要点复制到剪贴板，由你粘贴到自己使用的 AI 应用中，本站不调用任何 AI 服务。</p>';
  }
  function importPreview() {
    var inc = C.stateSummary(pendingImport.state, data), cur = C.stateSummary(state, data);
    var line = function (x) { return (x.route ? esc(x.route) + '，' : '没有选路线，') + x.cards + ' 道题、' + x.done + ' 天' + (x.last ? '，最后学习 ' + dateLabel(x.last) : '') + (x.archived ? '，另有 ' + x.archived + ' 条下线内容的记录' : ''); };
    var empty = !state.profile && !cur.cards && !cur.done;
    return '<section class="panel import-preview" aria-labelledby="import-title"><h2 id="import-title">导入前确认</h2>' +
      '<dl class="compare"><div><dt>要导入的记录' + (pendingImport.exportedAt ? '（' + dateLabel(pendingImport.exportedAt) + ' 导出）' : '') + '</dt><dd>' + line(inc) + '</dd></div>' +
      (empty ? '' : '<div><dt>这个浏览器中现有的记录</dt><dd>' + line(cur) + '</dd></div>') + '</dl>' +
      (empty ? '' : '<p class="small muted">合并：两边的记录都保留，同一道题取最近一次自评的那份，路线和每天的时间用这个浏览器的设置。替换：只留下导入的记录，现有的会被覆盖。</p>') +
      '<div class="actions">' + (empty ? '<button type="button" class="btn primary" data-action="import-replace">导入</button>' :
        '<button type="button" class="btn primary" data-action="import-merge">合并</button><button type="button" class="btn" data-action="import-replace">替换</button>') +
      '<button type="button" class="btn quiet" data-action="import-cancel">取消</button></div></section>';
  }
  function readImport(text) {
    var raw;
    try { raw = JSON.parse(String(text).trim()); } catch (e) { throw new Error('内容不是本站导出的记录（无法解析）'); }
    var imported = C.sanitize(raw, data);
    var any = function (o) { return Object.keys(o).length > 0; };
    if (!imported.profile && !imported.archive.profile && !any(imported.cards) && !any(imported.done) && !any(imported.archive.cards)) throw new Error('里面没有可用的学习记录');
    pendingImport = { state: imported, exportedAt: C.isDate(raw.exportedAt) ? raw.exportedAt : null };
    render();
    // 焦点移到确认框的标题上，读屏软件会读出要导入的内容
    var title = document.getElementById('import-title');
    if (title) { title.setAttribute('tabindex', '-1'); title.focus({ preventScroll: true }); title.closest('section').scrollIntoView({ block: 'center' }); }
  }
  function importFile(file) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast('文件过大，不是本站导出的记录'); return; }
    file.text().then(readImport).catch(function (error) { toast('导入失败：' + error.message); });
  }
  function bindData() {
    onClick = function (event) {
      var button = event.target.closest('[data-action]');
      if (!button) return;
      var action = button.dataset.action;
      if (action === 'export') {
        downloadBlob(new Blob([exportText(true)], { type: 'application/json' }), 'cs-notes-learn-' + now() + '.json');
        markExported(); toast('已导出'); render();
      } else if (action === 'copy-export') {
        copyText(exportText(false)).then(function () { markExported(); toast('已复制，可以粘贴到另一台设备上导入'); render(); }, function () { toast('复制失败，请改用导出成文件'); });
      } else if (action === 'import') {
        document.getElementById('import-file').click();
      } else if (action === 'paste-open') {
        var box = document.getElementById('paste-box'); box.hidden = false; document.getElementById('paste-text').focus();
      } else if (action === 'paste-import') {
        try { readImport(document.getElementById('paste-text').value); } catch (error) { toast('导入失败：' + error.message); }
      } else if (action === 'import-merge' || action === 'import-replace') {
        state = action === 'import-merge' ? C.mergeState(state, pendingImport.state) : pendingImport.state;
        pendingImport = null;
        sessions = { review: null, mock: null, 'new': null };
        save();
        render();
        toast((action === 'import-merge' ? '已合并：' : '已导入：') + Object.keys(state.cards).length + ' 道题、' + Object.keys(state.done).length + ' 天');
      } else if (action === 'import-cancel') {
        pendingImport = null; render();
      } else if (action === 'reset') {
        if (!window.confirm('清空后无法恢复，建议先导出。确定清空全部学习记录吗？')) return;
        state = C.emptyState();
        sessions = { review: null, mock: null, 'new': null };
        save();
        location.hash = '#/';
        toast('已清空');
      }
    };
    var input = document.getElementById('import-file');
    if (input) input.addEventListener('change', function () { importFile(input.files[0]); input.value = ''; });
    var zone = document.getElementById('drop-zone');
    if (zone) {
      ['dragenter', 'dragover'].forEach(function (type) { zone.addEventListener(type, function (event) { event.preventDefault(); zone.classList.add('dragging'); }); });
      ['dragleave', 'drop'].forEach(function (type) { zone.addEventListener(type, function () { zone.classList.remove('dragging'); }); });
      zone.addEventListener('drop', function (event) { event.preventDefault(); importFile(event.dataTransfer.files[0]); });
    }
  }

  // 数据与隐私：放在页脚和学习记录页中，不在主流程里出现
  function viewPrivacy() {
    var keep = persisted ? '浏览器已同意长期保存本站的数据。' : '';
    return '<header class="page-head"><p class="eyebrow">' + icon('lock', 'sm') + '最后更新：2026 年 10 月 31 日</p><h1>数据与隐私</h1></header>' +
      '<div class="prose">' +
      '<p>CS-Notes 学习是一个纯静态的网站：没有账号系统，没有后端服务器，也没有数据库。下面说明使用过程中会产生哪些数据、放在哪里。</p>' +
      '<h2>不收集个人信息</h2><ul>' +
      '<li>不需要注册或登录，不要求填写姓名、手机号、邮箱等任何个人信息；</li>' +
      '<li>不使用 Cookie，不加载统计、广告或其它第三方脚本，页面只请求本站自己的文件；</li>' +
      '<li>不调用任何 AI 服务。“复制给 AI 追问”只是把内容放进剪贴板，是否粘贴、粘贴到哪里由你决定。</li></ul>' +
      '<h2>学习记录保存在你的浏览器中</h2><ul>' +
      '<li>路线设置、定级结果、完成的天、每道题的复习安排和每天的学习量，保存在当前浏览器的 localStorage 中（cs-learn-v1），不上传、不同步；</li>' +
      '<li>外观选择和上次导出的日期也只保存在本机（cs-learn-skin、cs-learn-exported）；</li>' +
      '<li>题卡中输入的回答只留在当前页面，离开或刷新后就没有了；</li>' +
      '<li>为了离线使用，浏览器会缓存本站的页面、脚本和题目文件，其中不含学习记录；</li>' +
      '<li>分享图和二维码在浏览器中本地生成，只有你保存或分享时才会离开这台设备。</li></ul>' +
      '<h2>访问日志</h2><p>和所有网站一样，提供网站托管和加速的服务商在传送页面时，会按其规则记录访问日志（例如 IP 地址、访问时间、浏览器类型），用于运行和安全防护。本站不另外收集这些信息，也不把它们和学习记录关联。</p>' +
      '<h2>保存、转移和删除</h2><ul>' +
      '<li>记录只在这一个浏览器中。清除浏览器数据、使用隐私模式，或在 Safari 中较长时间没有访问本站时，浏览器可能删除这些记录；建议定期在<a href="#/data">学习记录</a>页导出，添加到主屏幕后使用也更不容易被清理。' + keep + '</li>' +
      '<li>导出的文件或文字由你自己保管，导入时只在浏览器中读取，不经过服务器；</li>' +
      '<li>在<a href="#/data">学习记录</a>页可以随时清空，也可以在浏览器设置中清除本站数据。</li></ul>' +
      '<h2>外部链接和反馈</h2><p>页面中指向 GitHub 等其它网站的链接，打开后适用那些网站自己的规则。“要点有误”和“反馈建议”会打开 GitHub 的新建议题页并预填题目内容，只有你自己提交时才会发出，不包含学习记录。</p>' +
      '<h2>联系</h2><p>对这些说明有疑问，可以在 <a href="https://github.com/CyC2018/CS-Notes/issues" target="_blank" rel="noopener">GitHub Issues</a> 中提出。说明有变化时会更新本页的日期。</p>' +
      '</div>';
  }

  // ---------- 路由 ----------
  var currentView = null, entering = false, presetRoute = null;
  var TITLES = { home: '今天', setup: '设置', placement: '定级', plan: '学习计划', day: '', q: '', review: '复习', mock: '模拟面试', 'new': '练习新题', bank: '题库', progress: '进度', data: '学习记录', privacy: '数据与隐私' };
  // 页面出错时不留白屏：说明情况，给出刷新和导出记录的办法（导出不依赖出错的页面）
  function render() {
    try { renderPage(); } catch (error) {
      if (window.console) console.error(error);
      main.innerHTML = '<div class="empty"><h1>页面出错了</h1><p>这个页面没有正常显示，学习记录没有受影响。可以先刷新；如果一直出错，请先导出记录，再到 GitHub 反馈。</p>' +
        '<div class="actions"><button type="button" class="btn primary" data-rescue="reload">刷新</button><button type="button" class="btn" data-rescue="export">导出记录</button><a class="btn quiet" href="#/">返回今天</a></div></div>';
    }
  }
  main.addEventListener('click', function (event) {
    var rescue = event.target.closest && event.target.closest('[data-rescue]');
    if (!rescue) return;
    if (rescue.dataset.rescue === 'reload') location.reload();
    else downloadBlob(new Blob([localStorage.getItem(KEY) || '{}'], { type: 'application/json' }), 'cs-notes-learn-' + now() + '.json');
  });
  function renderPage() {
    var hash = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    var parts = hash.split('/'), name = parts[0] || 'home', html;
    // 从笔记网站的学习路线进来：还没有设置时预先选中这条路线，已经在学时回到今天
    if (name === 'start') {
      if (!state.profile && route(parts[1])) presetRoute = parts[1];
      location.replace('#/' + (state.profile ? '' : 'setup'));
      return;
    }
    entering = currentView !== (parts[0] || 'home') + '/' + parts.slice(1).join('/');
    onClick = null;
    // 还没有设置时，除了单独打开某一天和数据页，都显示设置
    if (!state.profile && ['day', 'data', 'q', 'bank'].indexOf(name) === -1) name = 'setup';
    if (['home', 'setup', 'placement', 'plan', 'review', 'mock', 'new', 'progress', 'data', 'privacy', 'day', 'q', 'bank'].indexOf(name) === -1) name = 'home';
    if (name === 'day') html = viewDay(parts[1]);
    else if (name === 'setup') html = viewSetup();
    else if (name === 'placement') html = viewPlacement();
    else if (name === 'plan') html = viewPlan();
    else if (name === 'review' || name === 'mock' || name === 'new') { if (name === 'review' && parts[1] === 'quick' && entering) quickNext = true; html = viewSession(name); }
    else if (name === 'data') html = viewData();
    else if (name === 'privacy') html = viewPrivacy();
    else if (name === 'progress') html = viewProgress();
    else if (name === 'q') html = viewQuestion(parts[1]);
    else if (name === 'bank') html = viewBank();
    else html = viewHome();
    var view = name + '/' + parts.slice(1).join('/'), changed = currentView !== view;
    currentView = view;
    main.dataset.view = name;
    main.innerHTML = html;
    if (name === 'setup' && document.getElementById('setup')) bindSetup();
    else if (name === 'placement') bindPlacement();
    else if (name === 'day') bindDay(parts[1]);
    else if (name === 'review' || name === 'mock' || name === 'new') bindSession(name);
    else if (name === 'data') bindData();
    else if (name === 'progress' && state.profile) bindProgress();
    else if (name === 'bank') bindBank();
    else if (name === 'plan' && state.profile) onClick = function (event) {
      if (!event.target.closest('[data-action="calendar"]')) return;
      var stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
      downloadBlob(new Blob([C.planCalendar(currentPlan(), data, siteUrl(), stamp)], { type: 'text/calendar' }), 'cs-notes-plan.ics');
      toast('已导出日历文件，计划调整后可以重新导出');
    };
    else onClick = function (event) {
      var dismiss = event.target.closest('[data-action="dismiss-update"]');
      if (dismiss) {
        state.seenUpdate = Math.max(state.seenUpdate || 0, Number(dismiss.dataset.seq) || 0);
        save();
        dismiss.closest('.update').remove();
        return;
      }
      handleCard(event);
    };
    var heading = main.querySelector('h1');
    document.title = ((name === 'day' || name === 'q') && heading ? heading.textContent : TITLES[name] || '') + ' · CS-Notes 学习';
    document.querySelectorAll('[data-nav]').forEach(function (link) {
      var owner = { day: 'plan', mock: 'review', 'new': 'review', data: 'progress', privacy: 'progress', q: 'bank' }[name] || name;
      if (link.dataset.nav === owner) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    updateBadge();
    if (changed) {
      window.scrollTo(0, 0);
      main.focus({ preventScroll: true });
    }
  }
  // 回答框随内容变高，空着时只占两行
  main.addEventListener('input', function (event) {
    var t = event.target;
    if (!t.matches || !t.matches('textarea[data-answer]')) return;
    t.style.height = 'auto';
    t.style.height = Math.min(t.scrollHeight + 2, 420) + 'px';
  });
  main.addEventListener('change', function (event) {
    if (event.target.name === 'skin') { setSkin(event.target.value); toast('已切换为“' + SKINS.filter(function (x) { return x[0] === event.target.value; })[0][1] + '”'); }
  });
  main.addEventListener('click', function (event) {
    // 页内跳转：hash 已经用于路由，用按钮滚动到对应的元素
    var jump = event.target.closest('[data-jump]');
    if (jump) {
      var target = document.getElementById(jump.dataset.jump);
      if (target) {
        target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        var focusable = target.querySelector('input, button');
        if (focusable && jump.dataset.jump === 'setup') setTimeout(function () { focusable.focus({ preventScroll: true }); }, 400);
      }
      return;
    }
    if (onClick) onClick(event);
  });
  window.addEventListener('hashchange', render);
  // 其它标签页修改了记录时同步过来，避免两个标签页互相覆盖
  window.addEventListener('storage', function (event) {
    if (event.key !== KEY) return;
    state = load();
    sessions = { review: null, mock: null, 'new': null };
    render();
  });

  // 离线缓存只在 HTTPS 或本机地址下可用
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || /^(127\.0\.0\.1|localhost)$/.test(location.hostname))) {
    // 部署新版本后：打开着的页面在切回前台时检查更新，新版本接管后提示刷新；页面本身先走网络，刷新即可拿到新内容
    var hadController = !!navigator.serviceWorker.controller;
    // 新版本接管时，从网络取一次最新的入口页（加查询参数，不读离线缓存）：里面引用的脚本和数据版本号和本页不同（本页是旧版本）才提示刷新；
    // 刚刷新过的页面已经是新版本，不再提示；取不到（离线）时也不提示，反正刷新不了
    var pageFiles = [document.currentScript.getAttribute('src'), document.currentScript.dataset.src];
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (!hadController) { hadController = true; return; }
      fetch('./?check=' + Date.now(), { cache: 'no-store', credentials: 'omit' }).then(function (response) { return response.text(); }).then(function (html) {
        if (pageFiles.some(function (f) { return html.indexOf('"' + f + '"') === -1; })) showUpdateBar();
      }).catch(function () { /* 离线时不提示 */ });
    });
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').then(function (registration) {
        document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') registration.update().catch(function () {}); });
      }).catch(function () { /* 不支持时照常使用 */ });
    });
  }

  function showUpdateBar(message) {
    if (document.getElementById('update-bar')) return;
    var bar = document.createElement('div');
    bar.id = 'update-bar';
    bar.className = 'update-bar';
    bar.setAttribute('role', 'status');
    bar.innerHTML = '<span>' + (message || '学习站已更新，刷新后使用新的内容。你的记录不受影响。') + '</span><button type="button" class="btn primary">刷新</button>';
    bar.querySelector('button').addEventListener('click', function () { location.reload(); });
    document.body.appendChild(bar);
  }

  setSkin(skin());
  document.querySelectorAll('[data-nav]').forEach(function (link) { link.insertAdjacentHTML('afterbegin', icon(link.dataset.nav)); });
  document.querySelector('.notes-link').insertAdjacentHTML('afterbegin', icon('notes'));
  var source = document.currentScript.dataset.src;
  fetch(source, { credentials: 'omit' }).then(function (response) {
    if (!response.ok) throw new Error(response.status);
    return response.json();
  }).then(function (loaded) {
    if (loaded.version !== 1) throw new Error('数据版本不兼容');
    data = loaded;
    state = load();
    render();
  }).catch(function () {
    main.innerHTML = '<div class="empty"><h1>载入失败</h1><p>题目数据没有载入，请检查网络后重试。学习记录保存在浏览器中，不受影响。</p><div class="actions"><button type="button" class="btn primary" data-rescue="reload">重试</button></div></div>';
  });
})();

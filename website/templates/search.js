(function () {
  'use strict';

  function normalize(value) {
    return String(value).normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  var preparedIndexes = new WeakMap();
  function prepareIndex(index) {
    var prepared = preparedIndexes.get(index);
    if (prepared) return prepared;
    prepared = [];
    index.documents.forEach(function (doc) {
      var page = normalize(doc.title);
      doc.sections.forEach(function (section, i) {
        // 文章开头没有正文的部分与一级标题重复，不单独作为结果
        if (i === 0 && !section.text && doc.sections.length > 1 && normalize(doc.sections[1].title) === page) return;
        var heading = normalize(section.title);
        var body = normalize(section.text);
        // 学习路线只是阅读导读，附录是实验过程，排在讲解正文之后
        var penalty = (/^学习路线/.test(doc.title) ? 45 : 0) + (/^a\d+ /.test(heading) ? 40 : 0);
        prepared.push({ page: page, heading: heading, body: body, text: heading + ' ' + page + ' ' + body,
          lead: body.slice(0, 120), flatHeading: heading.replace(/ /g, ''), flatBody: body.replace(/ /g, ''), penalty: penalty, pageTitle: doc.title, path: doc.path, section: section });
      });
    });
    preparedIndexes.set(index, prepared);
    return prepared;
  }

  function occurrences(text, term) {
    var count = 0, offset = 0, found;
    while (count < 6 && (found = text.indexOf(term, offset)) !== -1) {
      count++;
      offset = found + term.length;
    }
    return count;
  }

  // 英文词在标题中单独出现时才算完整命中，避免 RAG 命中 Storage
  function wholeWord(text, term) {
    if (!/^[a-z0-9]+$/.test(term)) return true;
    return new RegExp('(^|[^a-z0-9])' + term + '($|[^a-z0-9])').test(text);
  }

  // 中英文连写时在两者之间切开，例如“hashmap扩容”按“hashmap”和“扩容”搜索
  var CJK = /[㐀-鿿豈-﫿]/;
  function splitTerms(query) {
    var terms = [];
    joinMixed(query).split(' ').forEach(function (word) {
      (word.match(/[㐀-鿿豈-﫿]+|[^㐀-鿿豈-﫿]+/g) || []).forEach(function (part) {
        if (part && terms.indexOf(part) === -1) terms.push(part);
      });
    });
    return terms;
  }

  // 笔记中统一了术语（垃圾收集、I/O、哈希、新生代……），读者常用的另一种说法也要能搜到
  var SYNONYMS = [
    ['垃圾收集', '垃圾回收'], ['i/o', 'io'], ['哈希', '散列', 'hash'], ['新生代', '年轻代'], ['重排序', '指令重排'],
    ['首部', '头部'], ['幻读', '幻影读'], ['脏读', '读脏数据'], ['b+tree', 'b+树', 'b+ 树'], ['多路复用', 'i/o 复用', '复用'],
    ['多版本并发控制', 'mvcc'], ['java 虚拟机', 'jvm']
  ];
  // 中英文混写的术语（“b+ 树”“i/o 复用”）在切词前换成一个整体，否则会被切成“b+”和“树”两个词分别匹配
  var MIXED = [];
  SYNONYMS.forEach(function (group) {
    var whole = group.filter(function (word) { return !/ /.test(word) && !(CJK.test(word) && /[a-z]/.test(word)); })[0];
    if (!whole) return;
    group.forEach(function (word) {
      if (word === whole || !(CJK.test(word) && /[a-z]/.test(word))) return;
      var pattern = word.replace(/ /g, '').split('').map(function (c) { return c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join(' ?');
      MIXED.push([new RegExp(pattern, 'g'), whole]);
    });
  });
  function joinMixed(query) {
    MIXED.forEach(function (item) { query = query.replace(item[0], item[1]); });
    return query;
  }
  // 词中含有另一种说法时也替换，例如“散列冲突”同时按“哈希冲突”搜索
  function alternatives(term) {
    var result = [term];
    SYNONYMS.forEach(function (group) {
      group.forEach(function (word) {
        if (term.indexOf(word) === -1) return;
        group.forEach(function (other) {
          var variant = term.split(word).join(other);
          if (result.indexOf(variant) === -1) result.push(variant);
        });
      });
    });
    return result;
  }
  function firstHit(text, choices) {
    for (var i = 0; i < choices.length; i++) if (text.includes(choices[i])) return choices[i];
    return null;
  }

  function score(entry, groups, normalizedQuery) {
    var total = 0;
    for (var i = 0; i < groups.length; i++) {
      var term = firstHit(entry.text, groups[i]);
      if (!term) return null;
      // 小节标题正好是搜索词时最相关，例如“死锁的必要条件”中的“必要条件”；标题用的是另一种说法时也算（搜 MVCC，标题是“多版本并发控制”）
      var head = firstHit(entry.heading, groups[i]) || term;
      total += (entry.heading === head ? 30 : 0) + (entry.heading.includes(head) ? (wholeWord(entry.heading, head) ? 40 : 25) : 0) +
        (entry.page.includes(term) ? 15 : 0) + (entry.lead.includes(term) ? 10 : 0) + occurrences(entry.body, term);
    }
    var phrase = groups.length > 1 && normalizedQuery ? normalizedQuery.replace(/ /g, '') : '';
    if (phrase) total += (entry.flatHeading.includes(phrase) ? 25 : 0) + (entry.flatBody.includes(phrase) ? 10 : 0);
    return total - entry.penalty + (entry.heading === normalizedQuery ? 100 : 0);
  }

  // 整句的问法：先去掉“什么是”“为什么”这类词再搜（“什么是幂等”按“幂等”搜）
  var QUESTION = /什么是|是什么|为什么要|为什么|为啥|怎么样|怎么|如何|有哪些|哪些|有什么|区别是|作用是|原理是|的区别|区别|对比|比较|异同|和|与|跟|及|吗|呢|么|的|了|？|\?/g;
  function stripQuestion(query) {
    // 去掉后剩下的单个汉字或单个字母没有意义（“和为 S”去掉“和”只剩“为”和“s”），这时不用去掉后的版本
    var terms = splitTerms(normalize(query.replace(QUESTION, ' '))).filter(function (term) { return term.length > 1; });
    return terms.length ? terms.join(' ') : '';
  }
  // 仍然没有结果时按相邻两个字的词组匹配，至少命中七成；原文中连续出现的长片段（“四个条件”）额外加分
  function bigrams(terms) {
    var pairs = [];
    terms.forEach(function (term) {
      if (!CJK.test(term)) return;
      for (var i = 0; i + 1 < term.length; i++) {
        var pair = term.slice(i, i + 2);
        if (pairs.indexOf(pair) === -1) pairs.push(pair);
      }
    });
    return pairs;
  }
  function fuzzyScore(entry, pairs, segments) {
    var hit = 0, total = 0;
    pairs.forEach(function (pair) {
      if (!entry.text.includes(pair)) return;
      hit++;
      total += (entry.heading.includes(pair) ? 12 : 0) + (entry.page.includes(pair) ? 4 : 0) + Math.min(occurrences(entry.body, pair), 3);
    });
    if (hit < Math.max(2, Math.ceil(pairs.length * .7))) return null;
    segments.forEach(function (segment) {
      if (segment.length > 2 && entry.text.includes(segment)) total += segment.length * 6;
    });
    return total + hit * 5 - entry.penalty;
  }

  function search(index, query, limit) {
    var normalizedQuery = normalize(query).slice(0, 120);
    if (!normalizedQuery) return [];
    var entries = prepareIndex(index), results = [], fuzzy = false, used = [];
    var seen = {};
    function collect(scoreOf) {
      entries.forEach(function (entry) {
        var value = scoreOf(entry);
        if (value === null) return;
        var section = entry.section, key = entry.path + '?' + section.id;
        if (seen[key]) { seen[key].score = Math.max(seen[key].score, value); return; }
        seen[key] = { page: entry.pageTitle, path: entry.path, title: section.title || entry.pageTitle,
          id: section.id, text: section.text, score: value, penalty: entry.penalty };
        results.push(seen[key]);
      });
    }
    function exact(text) {
      var terms = splitTerms(text);
      if (!terms.length) return;
      var groups = terms.map(alternatives);
      used = used.concat([].concat.apply([], groups));
      collect(function (entry) { return score(entry, groups, text); });
    }
    exact(normalizedQuery);
    // 去掉问法后的结果合并进来：“死锁的必要条件”原文只出现在学习路线中，正文的小节标题是“必要条件”
    var stripped = stripQuestion(normalizedQuery);
    if (stripped && stripped !== normalizedQuery) exact(stripped);
    if (!results.length) {
      var terms = splitTerms(stripped || normalizedQuery);
      var pairs = bigrams(terms.map(function (term) { return alternatives(term)[0]; }));
      var ascii = terms.filter(function (term) { return !CJK.test(term); }).map(alternatives);
      if (pairs.length >= 2) {
        fuzzy = true;
        used = pairs.concat([].concat.apply([], ascii));
        collect(function (entry) {
          if (ascii.some(function (group) { return !firstHit(entry.text, group); })) return null;
          return fuzzyScore(entry, pairs, terms);
        });
      }
      // 只剩英文词时（“HashMap和Hashtable的区别”中的“区别”找不到同一节），只按英文词搜
      if (!results.length && ascii.length && ascii.length < terms.length) {
        fuzzy = true;
        used = [].concat.apply([], ascii);
        collect(function (entry) { return score(entry, ascii, ''); });
      }
    }
    results.sort(function (a, b) { return b.score - a.score || a.penalty - b.penalty; });
    var shown = results.slice(0, limit || 20);
    shown.total = results.length;
    shown.fuzzy = fuzzy;
    shown.terms = used;
    return shown;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { search: search, normalize: normalize, highlight: highlight, snippet: snippet };
    return;
  }

  var indexPromise;
  function loadIndex() {
    if (!indexPromise) {
      indexPromise = fetch(window.CS_NOTES_SEARCH_INDEX, { credentials: 'omit' }).then(function (response) {
        if (!response.ok) throw new Error('Search index unavailable');
        return response.json();
      }).then(function (index) {
        if (index.version !== 1 || !Array.isArray(index.documents)) throw new Error('Invalid search index');
        prepareIndex(index);
        return index;
      }).catch(function (error) { indexPromise = null; throw error; });
    }
    return indexPromise;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }

  function snippet(text, terms) {
    var lower = normalize(text), position = -1;
    // 先找最长的词：“死锁的四个条件”的摘要应定位到“四个条件”，而不是第一次出现“死锁”的地方
    (Array.isArray(terms) ? terms.slice() : normalize(terms).split(' ')).sort(function (a, b) { return b.length - a.length; })
      .some(function (term) { position = term ? lower.indexOf(term) : -1; return position !== -1; });
    var start = Math.max(0, position - 45);
    return (start ? '…' : '') + text.slice(start, start + 170) + (text.length > start + 170 ? '…' : '');
  }

  // 摘要和标题中标出搜索词：先按搜索词切分原文再逐段转义，不会匹配到转义后的实体
  function highlight(text, query) {
    var terms = (Array.isArray(query) ? query : normalize(query).split(' ')).filter(Boolean).sort(function (a, b) { return b.length - a.length; }).map(function (term) {
      return term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    });
    if (!terms.length) return escapeHtml(text);
    var pattern = new RegExp('(' + terms.join('|') + ')', 'gi');
    return String(text).split(pattern).map(function (part, index) {
      return index % 2 ? '<mark>' + escapeHtml(part) + '</mark>' : escapeHtml(part);
    }).join('');
  }

  function mountSearch() {
    var sidebar = document.querySelector('.sidebar');
    if (!sidebar || sidebar.querySelector('.site-search')) return;
    var wrapper = document.createElement('div');
    wrapper.className = 'search site-search';
    var mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    wrapper.innerHTML = '<input type="search" role="combobox" aria-expanded="false" aria-autocomplete="list" aria-label="搜索全部笔记" aria-controls="site-search-results" placeholder="搜索全部笔记" autocomplete="off" enterkeyhint="search">' +
      '<kbd class="search-key" aria-hidden="true">' + (mac ? '⌘K' : 'Ctrl K') + '</kbd>' +
      '<p class="search-status" role="status" aria-live="polite"></p>' +
      '<div id="site-search-results" class="results-panel" role="listbox" aria-label="搜索结果" hidden></div>';
    sidebar.insertBefore(wrapper, sidebar.firstChild);
    var input = wrapper.querySelector('input');
    var status = wrapper.querySelector('.search-status');
    var panel = wrapper.querySelector('.results-panel');
    var timer;
    var sequence = 0;

    function update() {
      var query = input.value.trim();
      var request = ++sequence;
      panel.hidden = !query;
      panel.innerHTML = '';
      input.setAttribute('aria-expanded', String(!!query));
      setActive(-1);
      if (!query) { status.textContent = ''; return; }
      status.textContent = '正在搜索…';
      loadIndex().then(function (index) {
        if (request !== sequence) return;
        var results = search(index, query);
        status.textContent = !results.length ? '没有找到相关内容，可以换个说法或减少关键词' :
          (results.fuzzy ? '没有完全匹配的内容，以下是相近的章节' :
            results.total > results.length ? '找到 ' + results.total + ' 个相关章节，显示前 ' + results.length + ' 个' : '找到 ' + results.length + ' 个相关章节');
        lastTerms = results.terms;
        panel.innerHTML = results.map(function (result, i) {
          var url = '/#' + result.path.split('/').map(encodeURIComponent).join('/') +
            (result.id ? '?id=' + encodeURIComponent(result.id) : '');
          return '<a class="matching-post" id="search-result-' + i + '" role="option" aria-selected="false" tabindex="-1" href="' + escapeHtml(url) + '"><strong>' + highlight(result.title, results.terms) +
            '</strong><small>' + escapeHtml(result.page) + '</small><p>' + highlight(snippet(result.text, results.terms), results.terms) + '</p></a>';
        }).join('');
        markCurrent();
      }).catch(function () {
        if (request === sequence) status.textContent = '搜索暂时不可用，请稍后重试。';
      });
    }
    input.addEventListener('focus', function () { loadIndex().catch(function () {}); });
    input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(update, 140); });
    // 当前选中的结果：焦点一直在输入框里，可以接着修改搜索词
    var active = -1, lastTerms = [];
    function options() { return Array.from(panel.querySelectorAll('.matching-post')); }
    function setActive(i) {
      var list = options();
      active = list.length ? Math.max(-1, Math.min(i, list.length - 1)) : -1;
      list.forEach(function (link, j) { link.setAttribute('aria-selected', String(j === active)); });
      if (active >= 0) {
        input.setAttribute('aria-activedescendant', list[active].id);
        list[active].scrollIntoView({ block: 'nearest' });
      } else {
        input.removeAttribute('aria-activedescendant');
      }
    }
    input.addEventListener('keydown', function (event) {
      if (event.isComposing || event.keyCode === 229) return;
      var list = options();
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        if (!list.length) return;
        event.preventDefault();
        var step = event.key === 'ArrowDown' ? 1 : -1;
        setActive(active === -1 && step < 0 ? list.length - 1 : active + step >= list.length ? 0 : active + step);
      } else if (event.key === 'Enter') {
        // 结果还没出来时（输入后 140ms 内）先搜一次，再打开第一条
        if (!list.length && input.value.trim()) { clearTimeout(timer); update(); return; }
        if (!list.length) return;
        event.preventDefault();
        (list[active] || list[0]).click();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        if (active >= 0) setActive(-1);
        else if (input.value) { input.value = ''; update(); }
        else input.blur();
      }
    });
    panel.addEventListener('mousemove', function (event) {
      var link = event.target.closest('.matching-post');
      if (link) { var i = options().indexOf(link); if (i !== active) setActive(i); }
    });
    // ⌘K / Ctrl+K 在任何地方聚焦搜索框（手机上同时打开侧边栏）
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'k' && event.key !== 'K' || !(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return;
      event.preventDefault();
      document.body.classList.toggle('close', window.matchMedia('(max-width: 768px)').matches);
      input.focus();
      input.select();
    });
    // 搜索结果在跳转后保留，方便接着看下一条；当前所在的小节标为 aria-current
    function markCurrent() {
      var here = decodeURIComponent(location.hash);
      panel.querySelectorAll('.matching-post').forEach(function (link) {
        var same = decodeURIComponent(link.getAttribute('href').slice(1)) === here;
        if (same) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
      });
    }
    window.addEventListener('hashchange', markCurrent);
    panel.addEventListener('click', function (event) {
      var link = event.target.closest('a');
      if (link) {
        try { sessionStorage.setItem('cs-notes-search-hit', JSON.stringify({ href: link.getAttribute('href'), terms: lastTerms, time: Date.now() })); } catch (error) {}
        setTimeout(markHits, 60);
      }
      if (link && window.matchMedia('(max-width: 768px)').matches) {
        document.body.classList.remove('close');
      }
    });
  }

  var HIT_SKIP = /^(PRE|CODE|SCRIPT|STYLE|MARK|BUTTON|SVG)$/;
  var shownPath = null;
  function clearHits() {
    document.querySelectorAll('mark.search-hit').forEach(function (mark) {
      mark.replaceWith(document.createTextNode(mark.textContent));
    });
  }
  function markHits() {
    var saved;
    try { saved = JSON.parse(sessionStorage.getItem('cs-notes-search-hit')); } catch (error) { return; }
    if (!saved || Date.now() - saved.time > 30000) return;
    var hash = decodeURIComponent(location.hash), href = decodeURIComponent(saved.href.replace(/^\//, ''));
    // 换了文章时，新文章渲染出来之前页面上还是旧文章，等 doneEach 再标
    if (hash !== href || hash.split('?')[0] !== shownPath) return;
    sessionStorage.removeItem('cs-notes-search-hit');
    clearHits();
    var id = new URLSearchParams(href.split('?').slice(1).join('?')).get('id');
    var heading = id && document.getElementById(id), section = document.querySelector('.markdown-section');
    if (!section || !saved.terms || !saved.terms.length) return;
    var level = heading && /^H([1-6])$/.test(heading.tagName) ? Number(heading.tagName[1]) : 0;
    var nodes = [], node = heading || section.firstElementChild;
    for (; node; node = node.nextElementSibling) {
      if (node !== heading && /^H[1-6]$/.test(node.tagName) && Number(node.tagName[1]) <= level) break;
      nodes.push(node);
    }
    var terms = saved.terms.filter(Boolean).sort(function (a, b) { return b.length - a.length; });
    var pattern = new RegExp('(' + terms.map(function (term) { return term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')', 'gi');
    var count = 0;
    nodes.forEach(function (block) {
      var walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, {
        acceptNode: function (text) {
          for (var p = text.parentNode; p && p !== block.parentNode; p = p.parentNode) if (HIT_SKIP.test(p.nodeName.toUpperCase())) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      var texts = [];
      while (walker.nextNode()) texts.push(walker.currentNode);
      texts.forEach(function (text) {
        var parts = text.nodeValue.split(pattern);
        if (parts.length < 2 || count > 60) return;
        var fragment = document.createDocumentFragment();
        parts.forEach(function (part, i) {
          if (!part) return;
          if (i % 2) { var mark = document.createElement('mark'); mark.className = 'search-hit'; mark.textContent = part; fragment.appendChild(mark); count++; }
          else fragment.appendChild(document.createTextNode(part));
        });
        text.replaceWith(fragment);
      });
    });
    if (heading) {
      heading.classList.remove('jump-target');
      void heading.offsetWidth;
      heading.classList.add('jump-target');
    }
  }

  window.$docsify.plugins.push(function (hook) {
    hook.mounted(mountSearch);
    hook.doneEach(mountSearch);
    hook.doneEach(function () {
      shownPath = decodeURIComponent(location.hash.split('?')[0]);
      setTimeout(markHits, 0);
    });
  });
})();

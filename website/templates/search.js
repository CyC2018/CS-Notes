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
      doc.sections.forEach(function (section) {
        var heading = normalize(section.title);
        var body = normalize(section.text);
        prepared.push({ page: page, heading: heading, body: body, text: heading + ' ' + page + ' ' + body,
          pageTitle: doc.title, path: doc.path, section: section });
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

  function search(index, query, limit) {
    var normalizedQuery = normalize(query);
    var terms = normalizedQuery.slice(0, 120).split(' ').filter(Boolean);
    if (!terms.length) return [];
    var results = [];
    prepareIndex(index).forEach(function (entry) {
      if (!terms.every(function (term) { return entry.text.includes(term); })) return;
      var score = terms.reduce(function (sum, term) {
        return sum + (entry.heading.includes(term) ? 40 : 0) + (entry.page.includes(term) ? 15 : 0) +
          occurrences(entry.body, term);
      }, 0);
      if (entry.heading === normalizedQuery) score += 100;
      var section = entry.section;
      results.push({ page: entry.pageTitle, path: entry.path, title: section.title || entry.pageTitle,
        id: section.id, text: section.text, score: score });
    });
    return results.sort(function (a, b) { return b.score - a.score; }).slice(0, limit || 20);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { search: search, normalize: normalize };
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
        var results = search(index, query), terms = normalize(query).split(' ').filter(Boolean);
        status.textContent = results.length ? '找到 ' + results.length + ' 个相关章节' : '没有找到相关内容，可以换个说法或减少关键词';
        lastTerms = terms;
        panel.innerHTML = results.map(function (result, i) {
          var url = '/#' + result.path.split('/').map(encodeURIComponent).join('/') +
            (result.id ? '?id=' + encodeURIComponent(result.id) : '');
          return '<a class="matching-post" id="search-result-' + i + '" role="option" aria-selected="false" tabindex="-1" href="' + escapeHtml(url) + '"><strong>' + highlight(result.title, terms) +
            '</strong><small>' + escapeHtml(result.page) + '</small><p>' + highlight(snippet(result.text, terms), terms) + '</p></a>';
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

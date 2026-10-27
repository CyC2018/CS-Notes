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

  function snippet(text, query) {
    var first = normalize(query).split(' ')[0];
    var position = normalize(text).indexOf(first);
    var start = Math.max(0, position - 45);
    return (start ? '…' : '') + text.slice(start, start + 170) + (text.length > start + 170 ? '…' : '');
  }

  function mountSearch() {
    var sidebar = document.querySelector('.sidebar');
    if (!sidebar || sidebar.querySelector('.site-search')) return;
    var wrapper = document.createElement('div');
    wrapper.className = 'search site-search';
    wrapper.innerHTML = '<input type="search" aria-label="搜索全部笔记" aria-controls="site-search-results" placeholder="搜索全部笔记" autocomplete="off">' +
      '<p class="search-status" role="status" aria-live="polite"></p>' +
      '<div id="site-search-results" class="results-panel" hidden></div>';
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
      if (!query) { status.textContent = ''; return; }
      status.textContent = '正在搜索…';
      loadIndex().then(function (index) {
        if (request !== sequence) return;
        var results = search(index, query);
        status.textContent = results.length ? '找到 ' + results.length + ' 个相关章节' : '没有找到相关内容';
        panel.innerHTML = results.map(function (result) {
          var url = '/#' + result.path.split('/').map(encodeURIComponent).join('/') +
            (result.id ? '?id=' + encodeURIComponent(result.id) : '');
          return '<a class="matching-post" href="' + escapeHtml(url) + '"><strong>' + escapeHtml(result.title) +
            '</strong><small>' + escapeHtml(result.page) + '</small><p>' + escapeHtml(snippet(result.text, query)) + '</p></a>';
        }).join('');
      }).catch(function () {
        if (request === sequence) status.textContent = '搜索暂时不可用，请稍后重试。';
      });
    }
    input.addEventListener('focus', function () { loadIndex().catch(function () {}); });
    input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(update, 140); });
    input.addEventListener('keydown', function (event) {
      if (event.isComposing || event.keyCode === 229) return;
      if (event.key === 'Escape') { input.value = ''; update(); }
      var first = panel.querySelector('a');
      if (first && event.key === 'ArrowDown') { event.preventDefault(); first.focus(); }
      if (first && event.key === 'Enter') { event.preventDefault(); first.click(); }
    });
    panel.addEventListener('click', function (event) {
      if (event.target.closest('a') && window.matchMedia('(max-width: 768px)').matches) {
        document.body.classList.remove('close');
      }
    });
  }

  window.$docsify.plugins.push(function (hook) {
    hook.mounted(mountSearch);
    hook.doneEach(mountSearch);
  });
})();

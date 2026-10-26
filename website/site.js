(function () {
  function decode(value) {
    try { return decodeURIComponent(value); } catch (error) { return value; }
  }
  function encodedRoute(path) { return path.split('/').map(encodeURIComponent).join('/'); }
  function preserveLegacyLinks() {
    var hash = location.hash;
    var legacy = (window.CS_NOTES_LEGACY_ROUTES || {})[decode(location.pathname)];
    if (legacy) {
      var heading = hash && !hash.startsWith('#/') ? '?id=' + encodeURIComponent(decode(hash.slice(1))) : '';
      location.replace('/#' + encodedRoute(legacy) + heading);
      return;
    }
    var route = decode(hash.split('?')[0].replace(/^#\//, '').replace(/\.md$/, ''));
    if (route && !route.includes('/') && window.CS_NOTES_PATHS.includes('/notes/' + route)) {
      location.replace('#/notes/' + encodeURIComponent(route) + (hash.includes('?') ? '?' + hash.split('?').slice(1).join('?') : ''));
    }
  }
  preserveLegacyLinks();
  window.addEventListener('hashchange', preserveLegacyLinks);
  window.$docsify = {
    name: 'CS-Notes',
    repo: 'https://github.com/CyC2018/CS-Notes',
    homepage: 'README.md',
    loadSidebar: true,
    alias: { '/.*/_sidebar.md': '/_sidebar.md' },
    subMaxLevel: 0,
    auto2top: true,
    notFoundPage: true,
    relativePath: false,
    copyCode: { buttonText: '复制', errorText: '复制失败', successText: '已复制' },
    plugins: [function (hook, vm) {
      hook.afterEach(function (content) {
        content = content.replace(/<img\b[^>]*>/gi, function (tag) {
          if (!/\bloading\s*=/i.test(tag)) tag = tag.replace(/<img\b/i, '<img loading="lazy"');
          if (!/\bdecoding\s*=/i.test(tag)) tag = tag.replace(/<img\b/i, '<img decoding="async"');
          return tag;
        });
        var document = new DOMParser().parseFromString(content, 'text/html');
        var heading = document.querySelector('h1');
        var list = heading && heading.nextElementSibling;
        if (list && list.tagName === 'UL' && list.querySelectorAll('a').length > 5 &&
            Array.from(list.querySelectorAll('a')).every(function (link) { return link.getAttribute('href').includes('?id='); })) {
          var details = document.createElement('details');
          details.className = 'article-toc';
          details.innerHTML = '<summary>本文目录</summary>';
          list.replaceWith(details);
          details.appendChild(list);
        }
        return document.body.innerHTML + '<footer class="site-footer"><a href="https://github.com/CyC2018/CS-Notes" target="_blank" rel="noopener">CyC2018 · CS-Notes</a><span> · </span><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">粤ICP备19071404号-1</a></footer>';
      });
      hook.doneEach(function () {
        var heading = document.querySelector('.markdown-section h1, .markdown-section h2');
        document.title = (vm.route.path === '/' || !heading ? 'CS-Notes' : heading.textContent.trim() + ' · CS-Notes') + ' · CyC2018';
        document.querySelectorAll('.markdown-section img').forEach(function (img) {
          img.loading = 'lazy';
          img.decoding = 'async';
        });
        document.querySelectorAll('.article-toc').forEach(function (toc) {
          toc.open = window.matchMedia('(min-width: 769px)').matches;
        });
      });
    }]
  };
})();

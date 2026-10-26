(function () {
  // Preserve links from the earlier website where notes lived at the root.
  var hash = location.hash;
  var route = decodeURIComponent(hash.split('?')[0].replace(/^#\//, '').replace(/\.md$/, ''));
  if (route && !route.includes('/') && route !== 'README' && route !== 'CONTRIBUTING' &&
      window.CS_NOTES_PATHS.includes('/notes/' + route)) {
    location.replace('#/notes/' + encodeURIComponent(route) + (hash.includes('?') ? '?' + hash.split('?').slice(1).join('?') : ''));
  }
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
    search: {
      maxAge: 86400000,
      paths: window.CS_NOTES_PATHS,
      placeholder: '搜索全部笔记',
      noData: '没有找到相关内容',
      depth: 6,
      namespace: 'cs-notes-2026'
    },
    copyCode: { buttonText: '复制', errorText: '复制失败', successText: '已复制' },
    plugins: [function (hook, vm) {
      hook.afterEach(function (content) {
        return content + '<footer class="site-footer"><a href="https://github.com/CyC2018/CS-Notes" target="_blank" rel="noopener">CyC2018 · CS-Notes</a><span> · </span><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">粤ICP备19071404号-1</a></footer>';
      });
      hook.doneEach(function () {
        var heading = document.querySelector('.markdown-section h1, .markdown-section h2');
        document.title = (vm.route.path === '/' || !heading ? 'CS-Notes' : heading.textContent.trim() + ' · CS-Notes') + ' · CyC2018';
        document.querySelectorAll('.markdown-section img').forEach(function (img) {
          img.loading = 'lazy';
          img.decoding = 'async';
        });
      });
    }]
  };
})();

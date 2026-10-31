(function () {
  function decode(value) {
    try { return decodeURIComponent(value); } catch (error) { return value; }
  }
  function encodedRoute(path) { return path.split('/').map(encodeURIComponent).join('/'); }
  function configureImages(root, homepage) {
    if (!root) return;
    root.querySelectorAll('img').forEach(function (img) {
      if (homepage && img.classList.contains('site-logo')) {
        img.loading = 'eager';
        img.setAttribute('fetchpriority', 'high');
      } else if (!img.hasAttribute('loading')) {
        img.loading = 'lazy';
      }
      img.decoding = 'async';
    });
  }
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
  var stopSpy = null;
  // 高频小节：构建网站时把标题和目录中的 🔥 换成了空的 span（hot-1 为一个火焰，hot-2 为两个），这里画出小火焰，侧边栏中也显示同样的标记
  var FLAME = '<svg viewBox="0 0 16 20" aria-hidden="true"><path class="o" d="M8 .6C9.2 4.4 14 6.8 14 12.4A6 6 0 0 1 2 12.4C2 9.2 3.6 7.3 4.9 6.1C5 8.2 5.8 9.5 6.9 9.9C6.2 6.6 7.1 3.2 8 .6Z"/>' +
    '<path class="i" d="M8 11C8.7 12.8 10.6 13.6 10.6 15.7A2.6 2.6 0 0 1 5.4 15.7C5.4 14.3 6.3 13.4 7 12.8C7.1 13.8 7.5 14.4 8.1 14.5C7.7 13.3 7.7 12.1 8 11Z"/></svg>';
  function hotLevel(node) {
    return node.classList.contains('hot-2') ? 2 : 1;
  }
  function fillHot(node, level) {
    node.title = level === 2 ? '面试中最常问' : '面试中常被问到';
    node.setAttribute('role', 'img');
    node.setAttribute('aria-label', level === 2 ? '高频' : '常问');
    node.innerHTML = level === 2 ? FLAME + FLAME : FLAME;
  }
  function hotBadge(level) {
    var badge = document.createElement('span');
    badge.className = 'hot hot-' + level;
    fillHot(badge, level);
    return badge;
  }
  function drawHot(section) {
    section.querySelectorAll('.hot:empty').forEach(function (node) { fillHot(node, hotLevel(node)); });
  }

  // 步骤动图：GitHub 上直接播放 GIF；网站上用同一个 GIF 的各帧（构建时拆出）做播放器，可以暂停、逐步查看
  function stepAnimations(section) {
    var map = window.CS_NOTES_ANIMATIONS || {};
    section.querySelectorAll('img').forEach(function (img) {
      if (img.dataset.anim) return;
      var key;
      try { key = decodeURI(new URL(img.getAttribute('src'), location.href).pathname); } catch (error) { return; }
      var anim = map[key];
      if (!anim) return;
      img.dataset.anim = '1';
      anim.frames.forEach(function (src) { new Image().src = src; });
      var index = 0, timer = null, playing = false, visible = false;
      var bar = document.createElement('div');
      bar.className = 'anim-bar';
      bar.innerHTML = '<button type="button" data-step="-1" aria-label="上一步">上一步</button>' +
        '<button type="button" data-play aria-label="暂停">暂停</button>' +
        '<button type="button" data-step="1" aria-label="下一步">下一步</button><span class="anim-count"></span>';
      var playButton = bar.querySelector('[data-play]'), count = bar.querySelector('.anim-count');
      function show(i) {
        index = (i + anim.frames.length) % anim.frames.length;
        img.src = anim.frames[index];
        count.textContent = (index + 1) + ' / ' + anim.frames.length;
      }
      function schedule() {
        clearTimeout(timer);
        if (playing && visible) timer = setTimeout(function () { show(index + 1); schedule(); }, anim.durations[index]);
      }
      function setPlaying(value) {
        playing = value;
        playButton.textContent = value ? '暂停' : '播放';
        playButton.setAttribute('aria-label', playButton.textContent);
        schedule();
      }
      bar.addEventListener('click', function (event) {
        var button = event.target.closest('button');
        if (!button) return;
        if (button.hasAttribute('data-play')) { setPlaying(!playing); return; }
        setPlaying(false);
        show(index + Number(button.dataset.step));
      });
      img.after(bar);
      show(0);
      setPlaying(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          visible = entries[entries.length - 1].isIntersecting;
          schedule();
        }, { threshold: 0.25 }).observe(img);
      } else {
        visible = true;
        schedule();
      }
    });
  }

  function articleToc(vm) {
    // 侧边栏中显示当前文章的二、三级标题：文章在侧边栏中时挂在它下面，否则放在侧边栏顶部
    var nav = document.querySelector('.sidebar-nav');
    var section = document.querySelector('.markdown-section');
    if (stopSpy) { stopSpy(); stopSpy = null; }
    if (!nav || !section) return;
    nav.querySelectorAll('.page-toc, .page-toc-block').forEach(function (node) { node.remove(); });
    // Docsify 按前缀匹配当前项：“首页”的 #/ 会匹配所有文章，地址带 ?id= 时又匹配不到，这里按完整路径重新标记
    var target = decode('#' + vm.route.path), active = null;
    nav.querySelectorAll('li > a').forEach(function (link) {
      var same = !active && decode((link.getAttribute('href') || '').split('?')[0]) === target;
      link.parentNode.classList.toggle('active', same);
      if (same) active = link.parentNode;
    });
    if (vm.route.path === '/') return;
    drawHot(section);
    var heads = Array.from(section.querySelectorAll('h2[id], h3[id]'));
    if (heads.length < 2) return;
    var route = '#' + encodedRoute(vm.route.path) + '?id=';
    var root = document.createElement('ul');
    root.className = 'page-toc';
    var group = null, flat = false, links = {};
    heads.forEach(function (heading) {
      var title = heading.textContent.trim();
      if (heading.tagName === 'H3' && (flat || !group)) return;
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = route + encodeURIComponent(heading.id);
      a.textContent = a.title = title;
      li.appendChild(a);
      var mark = heading.querySelector('.hot');
      if (mark) a.appendChild(hotBadge(hotLevel(mark)));
      links[heading.id] = li;
      if (heading.tagName === 'H2') {
        root.appendChild(li);
        group = li;
        flat = /^(附录|参考资料)/.test(title);
      } else {
        var sub = group.querySelector(':scope > ul');
        if (!sub) {
          sub = document.createElement('ul');
          group.appendChild(sub);
          group.classList.add('has-sub');
        }
        sub.appendChild(li);
      }
    });
    if (active) {
      active.appendChild(root);
    } else {
      var block = document.createElement('div');
      block.className = 'page-toc-block';
      var name = document.createElement('p');
      name.className = 'page-toc-title';
      name.textContent = (section.querySelector('h1') || {}).textContent || decode(vm.route.path.split('/').pop());
      block.appendChild(name);
      block.appendChild(root);
      nav.insertBefore(block, nav.firstChild);
    }
    var sidebar = document.querySelector('.sidebar');
    var pending = false;
    function update() {
      pending = false;
      var current = null;
      for (var i = 0; i < heads.length; i++) {
        if (heads[i].getBoundingClientRect().top > 90) break;
        if (links[heads[i].id]) current = links[heads[i].id];
      }
      root.querySelectorAll('li.current, li.open').forEach(function (li) { li.classList.remove('current', 'open'); });
      if (!current) return;
      current.classList.add('current');
      var top = current.parentNode === root ? current : current.parentNode.parentNode;
      top.classList.add('open');
      if (sidebar) {
        var offset = current.getBoundingClientRect().top - sidebar.getBoundingClientRect().top;
        if (offset < 60 || offset > sidebar.clientHeight - 60) sidebar.scrollTop += offset - sidebar.clientHeight / 3;
      }
    }
    function onScroll() {
      if (!pending) { pending = true; requestAnimationFrame(update); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    stopSpy = function () { window.removeEventListener('scroll', onScroll); };
    update();
  }
  preserveLegacyLinks();
  window.addEventListener('hashchange', preserveLegacyLinks);
  // 学习路线的文章开头提示可以在学习站中按这条路线定级、排计划
  var LEARN_ROUTES = { 'Java 后端': 'java', '大模型应用开发': 'llm', '面试冲刺': 'sprint' };
  function learnCallout(vm, section) {
    var match = decode(vm.route.path).match(/^\/notes\/学习路线 - (.+)$/), id = match && LEARN_ROUTES[match[1]];
    if (!section || !id || section.querySelector('.learn-callout')) return;
    var box = document.createElement('a');
    box.className = 'learn-callout';
    box.href = '/learn/#/start/' + id;
    box.innerHTML = '<b>在学习站中按这条路线学</b><span>先做一轮自评定级，跳过已经掌握的天，按每天的时间和面试日期排出计划，自评过的题按间隔复习。</span>';
    var heading = section.querySelector('h1');
    (heading || section.firstChild).insertAdjacentElement(heading ? 'afterend' : 'beforebegin', box);
  }
  // 学习站中有这篇笔记的题时，文章末尾提示读完练一练（只抽这篇笔记的题，还没开始学也可以练）
  // 学习站的记录：同一个网站，保存在这个浏览器的 localStorage 中，不上传；入口处据此写出读者自己的进度
  function learnRecord() {
    try { var record = JSON.parse(localStorage.getItem('cs-learn-v1')); return record && record.cards ? record : null; } catch (error) { return null; }
  }
  function localDay() {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }
  // 首页的学习站横幅：已经在学的读者显示今天到期的复习和完成的天数，按钮改为“继续”
  function learnBanner(section) {
    var banner = section && section.querySelector('.learn-banner'), record = learnRecord();
    if (!banner || !record || !record.profile || banner.dataset.personal) return;
    var today = localDay(), cards = record.cards, done = Object.keys(record.done || {}).length;
    var due = Object.keys(cards).filter(function (id) { return cards[id].due && cards[id].due <= today; }).length;
    banner.dataset.personal = '1';
    banner.querySelector('b').textContent = '继续学习';
    banner.querySelector('.learn-banner-text span').textContent = (due ? '今天有 ' + due + ' 道题到了该复习的时候，' : '') + '已经学完 ' + done + ' 天' + (due ? '' : '，接着学下一天');
    banner.querySelector('.learn-banner-go').textContent = '继续';
  }
  function practiceCallout(vm, section) {
    var match = decode(vm.route.path).match(/^\/notes\/(.+)$/), note = match && match[1];
    var ids = note && (window.CS_NOTES_LEARN_TOPICS || {})[note];
    if (!section || !ids || ids.length < 2 || section.querySelector('.learn-practice')) return;
    var record = learnRecord(), today = localDay();
    var tried = record ? ids.filter(function (id) { return record.cards[id]; }) : [];
    var due = tried.filter(function (id) { return record.cards[id].due && record.cards[id].due <= today; });
    var box = document.createElement('a');
    box.className = 'learn-callout learn-practice';
    box.href = '/learn/#/mock/' + encodeURIComponent(note);
    box.innerHTML = '<b>读完练一练</b><span>' + (tried.length
      ? '这篇笔记有 ' + ids.length + ' 道面试题，你练过 ' + tried.length + ' 道' + (due.length ? '，其中 ' + due.length + ' 道到了该复习的时候' : '') + '。再练一组，自评后按间隔安排复习。'
      : '学习站中有 ' + ids.length + ' 道和这篇笔记有关的面试题：先自己答，再对照参考要点自评，自评过的题会按间隔提醒复习。') + '</span>';
    // 放在上一篇、下一篇之前
    var after = section.querySelector('.page-nav') || section.querySelector('.site-footer');
    if (after) after.insertAdjacentElement('beforebegin', box); else section.appendChild(box);
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
    copyCode: { buttonText: '复制', errorText: '复制失败', successText: '已复制' },
    plugins: [function (hook, vm) {
      hook.afterEach(function (content) {
        var document = new DOMParser().parseFromString(content, 'text/html');
        configureImages(document, vm.route.path === '/');
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
        configureImages(document.querySelector('.markdown-section'), vm.route.path === '/');
        stepAnimations(document.querySelector('.markdown-section'));
        articleToc(vm);
        learnCallout(vm, document.querySelector('.markdown-section'));
        practiceCallout(vm, document.querySelector('.markdown-section'));
        learnBanner(document.querySelector('.markdown-section'));
        document.querySelectorAll('.article-toc').forEach(function (toc) {
          toc.open = window.matchMedia('(min-width: 769px)').matches;
        });
      });
    }]
  };
})();

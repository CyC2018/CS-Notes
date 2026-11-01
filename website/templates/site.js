(function () {
  function decode(value) {
    try { return decodeURIComponent(value); } catch (error) { return value; }
  }
  function encodedRoute(path) { return path.split('/').map(encodeURIComponent).join('/'); }
  function configureImages(root, homepage) {
    if (!root) return;
    var first = root.querySelector('img');
    root.querySelectorAll('img').forEach(function (img) {
      if (homepage && img.classList.contains('site-logo')) {
        img.loading = 'eager';
        img.setAttribute('fetchpriority', 'high');
      } else if (!img.hasAttribute('loading')) {
        // 文章的第一张图常在首屏内，延迟加载会推迟最大内容绘制，直接加载
        img.loading = !homepage && img === first ? 'eager' : 'lazy';
      }
      img.decoding = 'async';
      // 笔记中的配图大多没写说明，读屏软件只能读出文件名；用所在小节的标题作为说明
      if (!img.hasAttribute('alt')) {
        var heading = null;
        for (var node = img; node && node !== root && !heading; node = node.previousElementSibling || node.parentElement) {
          if (/^H[1-6]$/.test(node.tagName) && node !== img) heading = node;
        }
        var title = heading ? heading.textContent.replace(/[#¶]/g, '').trim() : '';
        img.alt = title ? title + (/[!-~]$/.test(title) ? ' ' : '') + '的配图' : '配图';
      }
    });
    // 复制代码插件写的 aria-hidden="hidden" 不是有效值；插件的按钮在本插件之后才加上
    setTimeout(function () {
      root.querySelectorAll('.docsify-copy-code-button [aria-hidden="hidden"]').forEach(function (node) { node.setAttribute('aria-hidden', 'true'); });
    });
  }
  // 正文中裸写的网址后面紧跟中文时，marked 会把“，请求能够发出去……”也算进链接，截到第一个中文字符或全角标点为止
  var WIDE = /[\u3000-\u303f\uff00-\uffef\u4e00-\u9fff]/;
  function trimAutolinks(root) {
    root.querySelectorAll('a[href^="http"]').forEach(function (link) {
      var text = link.textContent, cut = text.search(WIDE);
      if (cut <= 0 || decode(link.getAttribute('href')) !== text) return;
      link.textContent = text.slice(0, cut);
      link.setAttribute('href', text.slice(0, cut));
      link.after(root.createTextNode(text.slice(cut)));
    });
  }
  // 离线时提示显示的是缓存的版本；sw.js 缓存读过的文章，离线时也能打开
  function offlineNote(section) {
    if (!section || section.querySelector('.offline-note')) return;
    // sw.js 给没缓存过的文章返回的说明页：Docsify 会把它记在内存里，联网后要刷新页面才能重新下载
    if (/^当前离线/.test((section.querySelector('h1') || {}).textContent || '')) {
      var retry = document.createElement('p');
      retry.innerHTML = '<a href="javascript:location.reload()">重新加载</a>';
      section.appendChild(retry);
      window.addEventListener('online', function () { location.reload(); }, { once: true });
      return;
    }
    if (navigator.onLine !== false) return;
    var note = document.createElement('p');
    note.className = 'offline-note';
    note.setAttribute('role', 'status');
    note.textContent = '当前离线，显示的是这台设备上次缓存的内容。';
    section.insertBefore(note, section.firstChild);
  }
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === '127.0.0.1' || location.hostname === 'localhost')) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').catch(function () {}); });
  }
  // Docsify 生成的目录按钮和 GitHub 角标是英文名称，读屏软件读成 Menu、View source on GitHub
  function nameControls() {
    var toggle = document.querySelector('.sidebar-toggle');
    if (toggle) { toggle.setAttribute('aria-label', '打开或收起目录'); toggle.title = '目录'; }
    var corner = document.querySelector('.github-corner');
    if (corner) corner.setAttribute('aria-label', '在 GitHub 上查看源码');
    // 角标放进导航地标，读屏软件按地标浏览时不会漏掉它
    if (corner && !corner.closest('nav, header, aside, main, footer')) {
      var nav = document.createElement('nav');
      nav.setAttribute('aria-label', '源码仓库');
      corner.parentNode.insertBefore(nav, corner);
      nav.appendChild(corner);
    }
    // 比页面宽的代码块和表格需要横向滚动，加入 Tab 顺序后可以用方向键滚动
    document.querySelectorAll('.markdown-section pre > code, .markdown-section table').forEach(function (box) {
      if (box.scrollWidth > box.clientWidth) box.tabIndex = 0;
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
    // 只剩一个链接的旧页面（例如“算法”）直接换成它指向的笔记，不留在中间页
    var stub = (window.CS_NOTES_STUBS || {})[decode(hash.split('?')[0].slice(1)).replace(/\.md$/, '')];
    if (stub) {
      location.replace('#' + encodedRoute(stub));
      return;
    }
    var route = decode(hash.split('?')[0].replace(/^#\//, '').replace(/\.md$/, ''));
    if (route && !route.includes('/') && window.CS_NOTES_PATHS.includes('/notes/' + route)) {
      location.replace('#/notes/' + encodeURIComponent(route) + (hash.includes('?') ? '?' + hash.split('?').slice(1).join('?') : ''));
    }
  }
  // 目录页下的子文章不在侧边栏中，构建时按目录页正文的链接顺序记下（CS_NOTES_TREE）
  function treeParent(path) {
    var tree = window.CS_NOTES_TREE || {};
    for (var parent in tree) {
      if (tree[parent].indexOf(path) !== -1) return parent;
    }
    return null;
  }
  function pageTitle(path) { return path.split('/').pop(); }
  // 侧边栏中已在分类下面，子文章的标题去掉“分类 - ”前缀，例如“计算机网络 - 传输层”显示为“传输层”
  function childLabel(section, path, parent) {
    var title = ((section.querySelector('h1') || {}).textContent || pageTitle(path)).trim();
    var prefix = pageTitle(parent).replace(/ - 目录$/, '');
    var short = title.indexOf(prefix) === 0 ? title.slice(prefix.length).replace(/^\s*-\s*/, '') : title;
    return short || title;
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

  // 打开文章时让侧边栏中的当前项可见（直接打开链接时它可能在侧边栏底部）
  function revealInSidebar(item) {
    var sidebar = document.querySelector('.sidebar');
    if (!item || !sidebar) return;
    var link = item.querySelector(':scope > a') || item;
    var offset = link.getBoundingClientRect().top - sidebar.getBoundingClientRect().top;
    if (offset < 80 || offset > sidebar.clientHeight - 80) sidebar.scrollTop += offset - sidebar.clientHeight / 3;
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
    var parentPath = !active && treeParent(decode(vm.route.path)), parentItem = null;
    if (parentPath) {
      nav.querySelectorAll('li > a').forEach(function (link) {
        if (!parentItem && decode((link.getAttribute('href') || '').split('?')[0]) === '#' + parentPath) parentItem = link.parentNode;
      });
      if (parentItem) parentItem.classList.add('active-parent');
    }
    nav.querySelectorAll('li.active-parent').forEach(function (li) { if (li !== parentItem) li.classList.remove('active-parent'); });
    revealInSidebar(active || parentItem);
    if (vm.route.path === '/') return;
    drawHot(section);
    var heads = Array.from(section.querySelectorAll('h2[id], h3[id]'));
    if (heads.length < 2) {
      if (parentItem) {
        var only = document.createElement('div');
        only.className = 'page-toc-block page-toc-child';
        only.innerHTML = '<p class="page-toc-title"></p>';
        only.firstChild.textContent = childLabel(section, decode(vm.route.path), parentPath);
        parentItem.appendChild(only);
      }
      return;
    }
    var route = '#' + encodedRoute(decode(vm.route.path)) + '?id=';
    var root = document.createElement('ul');
    root.className = 'page-toc';
    var group = null, flat = false, links = {};
    heads.forEach(function (heading) {
      var title = headingText(heading);
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
    } else if (parentItem) {
      var child = document.createElement('div');
      child.className = 'page-toc-block page-toc-child';
      var label = document.createElement('p');
      label.className = 'page-toc-title';
      label.textContent = childLabel(section, decode(vm.route.path), parentPath);
      child.appendChild(label);
      child.appendChild(root);
      parentItem.appendChild(child);
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
  // 阅读辅助：顶部阅读进度、右下角的深色模式和回到顶部按钮、按 / 聚焦搜索
  var THEME_KEY = 'cs-notes-theme', PROGRESS_KEY = 'cs-notes-progress';
  function storage(key, value) {
    try {
      if (value === undefined) return JSON.parse(localStorage.getItem(key));
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) { return null; }
  }
  var MOON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></svg>';
  var SUN = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>';
  var UP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg>';
  function isDark() { return document.documentElement.dataset.theme === 'dark'; }
  function setTheme(dark, save) {
    if (dark) document.documentElement.dataset.theme = 'dark';
    else delete document.documentElement.dataset.theme;
    var button = document.querySelector('.theme-toggle');
    if (button) {
      button.innerHTML = dark ? SUN : MOON;
      button.title = dark ? '切换到浅色模式' : '切换到深色模式';
      button.setAttribute('aria-label', button.title);
    }
    if (save) storage(THEME_KEY, dark ? 'dark' : 'light');
    // 手动选过配色时，浏览器顶栏的颜色跟着页面，而不是跟着系统
    var meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || (dark ? '#1a1d1c' : '#f3f2ee');
  }
  function flashHeading(target) {
    if (!/^H[2-6]$/.test(target.tagName)) return;
    target.classList.remove('jump-target');
    void target.offsetWidth;
    target.classList.add('jump-target');
  }
  function reducedMotion() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function switchTheme(dark, button) {
    if (!document.startViewTransition || reducedMotion() || document.hidden) return setTheme(dark, true);
    var box = button.getBoundingClientRect(), x = box.left + box.width / 2, y = box.top + box.height / 2;
    var r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    document.startViewTransition(function () { setTheme(dark, true); }).ready.then(function () {
      document.documentElement.animate({ clipPath: ['circle(0 at ' + x + 'px ' + y + 'px)', 'circle(' + r + 'px at ' + x + 'px ' + y + 'px)'] },
        { duration: 420, easing: 'cubic-bezier(.4, 0, .2, 1)', pseudoElement: '::view-transition-new(root)' });
    }).catch(function () {});
  }
  // 阅读设置：字号五档、行距三档，记在本地；页面载入前 index.html 中的脚本已经按记录设好
  var READING_KEY = 'cs-notes-reading', SIZES = ['15', '16', '17', '18', '19.5'], LEADINGS = [['compact', '紧凑'], ['normal', '标准'], ['loose', '宽松']];
  function readingPrefs() {
    var saved = storage(READING_KEY) || {};
    return { size: /^[0-4]$/.test(saved.size) ? +saved.size : 1, leading: /^(compact|loose)$/.test(saved.leading) ? saved.leading : 'normal' };
  }
  function applyReading(prefs, save) {
    var html = document.documentElement;
    if (prefs.size === 1) delete html.dataset.size; else html.dataset.size = String(prefs.size);
    if (prefs.leading === 'normal') delete html.dataset.leading; else html.dataset.leading = prefs.leading;
    if (save) {
      if (prefs.size === 1 && prefs.leading === 'normal') { try { localStorage.removeItem(READING_KEY); } catch (error) {} }
      else storage(READING_KEY, prefs);
    }
  }
  function readingPanel(tools) {
    var toggle = tools.querySelector('.reading-toggle'), panel = document.createElement('div');
    panel.className = 'reading-panel';
    panel.id = 'reading-panel';
    panel.hidden = true;
    panel.setAttribute('role', 'group');
    panel.setAttribute('aria-label', '阅读设置');
    panel.innerHTML = '<div class="row"><span>字号</span><div class="seg"><button type="button" data-step="-1" aria-label="缩小字号">A−</button>' +
      '<output aria-live="polite"></output><button type="button" data-step="1" aria-label="放大字号">A+</button></div></div>' +
      '<div class="row"><span>行距</span><div class="seg">' + LEADINGS.map(function (item) {
        return '<button type="button" data-leading="' + item[0] + '">' + item[1] + '</button>';
      }).join('') + '</div></div><button type="button" class="reset">恢复默认</button>';
    document.body.appendChild(panel);
    function render() {
      var prefs = readingPrefs();
      panel.querySelector('output').textContent = SIZES[prefs.size] + 'px';
      panel.querySelector('[data-step="-1"]').disabled = prefs.size === 0;
      panel.querySelector('[data-step="1"]').disabled = prefs.size === SIZES.length - 1;
      panel.querySelectorAll('[data-leading]').forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.leading === prefs.leading)); });
      panel.querySelector('.reset').hidden = prefs.size === 1 && prefs.leading === 'normal';
    }
    // 改字号后让读者正在看的那一行留在原处，不因上方内容变长而跳走
    function keepPlace(change) {
      // 记下视口上方 60px 处落在哪个段落的百分之几，改完后把同一位置移回来
      var section = document.querySelector('.markdown-section'), anchor = null, ratio = 0, LINE = 60;
      if (section && window.scrollY > 0) {
        var nodes = section.querySelectorAll('p, li, h2, h3, h4, pre, table, img');
        for (var i = 0; i < nodes.length; i++) {
          var box = nodes[i].getBoundingClientRect();
          if (box.bottom > LINE) { anchor = nodes[i]; ratio = box.height ? Math.max(0, (LINE - box.top) / box.height) : 0; break; }
        }
      }
      change();
      if (anchor) {
        var now = anchor.getBoundingClientRect();
        window.scrollBy(0, now.top + ratio * now.height - LINE);
      }
    }
    function set(next) { keepPlace(function () { applyReading(next, true); }); render(); }
    function open(value) {
      panel.hidden = !value;
      toggle.setAttribute('aria-expanded', String(value));
      if (value) { render(); panel.querySelector('button:not(:disabled)').focus(); }
    }
    toggle.addEventListener('click', function () { open(panel.hidden); });
    panel.addEventListener('click', function (event) {
      var button = event.target.closest('button');
      if (!button || button.disabled) return;
      var prefs = readingPrefs();
      if (button.dataset.step) prefs.size = Math.max(0, Math.min(SIZES.length - 1, prefs.size + Number(button.dataset.step)));
      else if (button.dataset.leading) prefs.leading = button.dataset.leading;
      else { prefs = { size: 1, leading: 'normal' }; toggle.focus(); }
      set(prefs);
    });
    document.addEventListener('click', function (event) {
      if (!panel.hidden && !panel.contains(event.target) && !toggle.contains(event.target)) open(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !panel.hidden) { open(false); toggle.focus(); }
    });
    // 其它标签页改了设置时同步
    window.addEventListener('storage', function (event) {
      if (event.key === READING_KEY) { applyReading(readingPrefs(), false); render(); }
    });
  }
  // 手机上侧边栏打开时向左滑收起；从屏幕左侧向右滑打开（避开代码块、表格等能横向滚动的区域）
  function sidebarSwipe() {
    var start = null, mobile = window.matchMedia('(max-width: 768px)');
    function scrollable(node) {
      for (; node && node !== document.body; node = node.parentElement) {
        if (node.scrollWidth > node.clientWidth + 1 && /auto|scroll/.test(getComputedStyle(node).overflowX)) return true;
      }
      return false;
    }
    document.addEventListener('touchstart', function (event) {
      start = null;
      if (!mobile.matches || event.touches.length !== 1) return;
      var touch = event.touches[0], open = document.body.classList.contains('close');
      if (!open && (touch.clientX > 48 || scrollable(event.target))) return;
      if (event.target.closest && event.target.closest('.medium-zoom-overlay, .medium-zoom-image--opened, .reading-panel')) return;
      start = { x: touch.clientX, y: touch.clientY, open: open, time: Date.now() };
    }, { passive: true });
    document.addEventListener('touchend', function (event) {
      if (!start) return;
      var touch = event.changedTouches[0], dx = touch.clientX - start.x, dy = touch.clientY - start.y;
      var horizontal = Math.abs(dx) > 60 && Math.abs(dy) < Math.abs(dx) / 2 && Date.now() - start.time < 600;
      if (horizontal && (start.open ? dx < 0 : dx > 0)) document.body.classList.toggle('close', !start.open);
      start = null;
    }, { passive: true });
    document.addEventListener('touchcancel', function () { start = null; }, { passive: true });
  }
  // 学习路线的文章开头提示可以在学习站中按这条路线定级、排计划
  var LEARN_ROUTES = { 'Java 后端': 'java', '大模型应用开发': 'llm', '面试冲刺': 'sprint' };
  function learnCallout(vm, section) {
    var match = decode(vm.route.path).match(/^\/notes\/学习路线 - (.+)$/), id = match && LEARN_ROUTES[match[1]];
    if (!id || section.querySelector('.learn-callout')) return;
    var box = document.createElement('a');
    box.className = 'learn-callout';
    box.href = '/learn/#/start/' + id;
    box.innerHTML = '<b>在学习站中按这条路线学</b><span>先做一轮自评定级，跳过已经掌握的天，按每天的时间和面试日期排出计划，自评过的题按间隔复习。</span>';
    var heading = section.querySelector('h1');
    var meta = section.querySelector('.article-meta');
    (meta || heading || section.firstChild).insertAdjacentElement(meta || heading ? 'afterend' : 'beforebegin', box);
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
  // 首页的“今日面试题”：每天按日期换一道面试最常问的题（同一天所有读者看到的一样），链接到这道题的页面，先想再看要点
  function dailyQuestion(section) {
    var banner = section && section.querySelector('.learn-banner'), sections = window.CS_NOTES_LEARN_SECTIONS;
    if (!banner || !sections || section.querySelector('.learn-daily')) return;
    var seen = {}, hot = [];
    Object.keys(sections).forEach(function (note) {
      Object.keys(sections[note]).forEach(function (anchor) {
        sections[note][anchor].forEach(function (q) { if (q[2] > 1 && !seen[q[0]]) { seen[q[0]] = true; hot.push(q); } });
      });
    });
    if (!hot.length) return;
    hot.sort(function (a, b) { return a[0] < b[0] ? -1 : 1; });
    var p = localDay().split('-').map(Number), q = hot[Math.floor(Date.UTC(p[0], p[1] - 1, p[2]) / 864e5) % hot.length];
    var record = learnRecord(), done = record && record.cards[q[0]] && record.cards[q[0]].last === localDay();
    var link = document.createElement('a'), label = document.createElement('span'), text = document.createElement('span'), go = document.createElement('span');
    link.className = 'learn-q learn-daily';
    link.href = '/learn/q/' + q[0] + '.html';
    label.className = 'learn-q-label';
    label.textContent = '今日面试题';
    text.className = 'learn-q-text';
    text.textContent = q[1];
    go.className = 'learn-q-go';
    go.textContent = done ? '今天练过了' : '想一想';
    link.appendChild(label); link.appendChild(text); link.appendChild(go);
    banner.insertAdjacentElement('afterend', link);
  }
  // 小节标题下列出这一节的面试题（显示第一道的题目和题数），点进去只练这一节；练过的显示已练或到期
  function sectionQuestions(vm, section) {
    var match = decode(vm.route.path).match(/^\/notes\/(.+)$/), note = match && match[1];
    var sections = note && (window.CS_NOTES_LEARN_SECTIONS || {})[note];
    if (!section || !sections || section.querySelector('.learn-q')) return;
    var record = learnRecord(), today = localDay();
    Object.keys(sections).forEach(function (anchor) {
      var heading = (section.ownerDocument || document).getElementById(anchor), list = sections[anchor];
      if (!heading || !section.contains(heading) || !/^H[2-6]$/.test(heading.tagName)) return;
      var tried = record ? list.filter(function (q) { return record.cards[q[0]]; }) : [];
      var due = tried.filter(function (q) { var c = record.cards[q[0]]; return c.due && c.due <= today; }).length;
      var link = document.createElement('a');
      link.className = 'learn-q' + (due ? ' due' : '');
      link.href = '/learn/#/mock/' + encodeURIComponent(note + '@' + anchor);
      var label = document.createElement('span'), text = document.createElement('span'), go = document.createElement('span');
      label.className = 'learn-q-label';
      label.textContent = list.some(function (q) { return q[2] > 1; }) ? '面试最常问' : '面试题';
      text.className = 'learn-q-text';
      text.textContent = list[0][1];
      go.className = 'learn-q-go';
      go.textContent = due ? '到期复习' : tried.length === list.length ? '已练 · 再练' : list.length > 1 ? '练 ' + list.length + ' 道' : '练一练';
      link.appendChild(label); link.appendChild(text); link.appendChild(go);
      heading.insertAdjacentElement('afterend', link);
    });
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
  function mountTools() {
    if (document.querySelector('.reading-tools')) return;
    // Docsify 在手机上把冒泡到 body 的点击都当作关闭侧边栏：点搜索框、分类标题或空白处时也会收起。
    // 侧边栏内只有点链接才收起，点侧边栏外仍然收起
    var sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.addEventListener('click', function (event) {
      if (!event.target.closest('a')) event.stopPropagation();
    });
    var skip = document.createElement('button');
    skip.type = 'button';
    skip.className = 'skip-link';
    skip.textContent = '跳到正文';
    skip.addEventListener('click', function () {
      var section = document.querySelector('.markdown-section');
      if (!section) return;
      section.setAttribute('tabindex', '-1');
      section.focus();
    });
    document.body.insertBefore(skip, document.body.firstChild);
    var bar = document.createElement('div');
    bar.className = 'read-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var tools = document.createElement('div');
    tools.className = 'reading-tools';
    tools.innerHTML = '<button type="button" class="to-top" title="回到顶部" aria-label="回到顶部" hidden>' + UP + '</button>' +
      '<button type="button" class="reading-toggle" title="阅读设置" aria-label="阅读设置" aria-expanded="false" aria-controls="reading-panel">Aa</button>' +
      '<button type="button" class="theme-toggle"></button>';
    document.body.appendChild(tools);
    var top = tools.querySelector('.to-top');
    top.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
    tools.querySelector('.theme-toggle').addEventListener('click', function (event) { switchTheme(!isDark(), event.currentTarget); });
    readingPanel(tools);
    sidebarSwipe();
    setTheme(isDark(), false);
    // 没有手动选过时跟随系统切换
    var media = window.matchMedia('(prefers-color-scheme: dark)');
    if (media.addEventListener) media.addEventListener('change', function (event) {
      if (!storage(THEME_KEY)) setTheme(event.matches, false);
    });
    var pending = false;
    function update() {
      pending = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
      top.hidden = window.scrollY < 800;
    }
    window.addEventListener('scroll', function () {
      if (!pending) { pending = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
    document.addEventListener('keydown', function (event) {
      if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
      var target = event.target;
      if (target.closest && target.closest('input, textarea, select, [contenteditable="true"]')) return;
      var input = document.querySelector('.site-search input');
      if (!input) return;
      event.preventDefault();
      document.body.classList.toggle('close', window.matchMedia('(max-width: 768px)').matches);
      input.focus();
      input.select();
    });
  }

  // 文章标题下的阅读时长和源文件链接；文末按侧边栏的顺序给出上一篇、下一篇
  function articleMeta(vm, section) {
    if (section.querySelector('.article-meta')) return;
    var clone = section.cloneNode(true);
    clone.querySelectorAll('pre, .article-toc, .site-footer').forEach(function (node) { node.remove(); });
    var text = clone.textContent.replace(/\s+/g, '');
    var code = Array.from(section.querySelectorAll('pre')).reduce(function (sum, pre) {
      return sum + pre.textContent.split('\n').length;
    }, 0);
    // 技术文章按每分钟约 400 字、代码约 40 行估算
    var minutes = Math.max(1, Math.round(text.length / 400 + code / 40));
    var meta = document.createElement('p');
    meta.className = 'article-meta';
    var source = 'https://github.com/CyC2018/CS-Notes/blob/master' + encodedRoute(decode(vm.route.path)) + '.md';
    var parent = treeParent(decode(vm.route.path));
    meta.innerHTML = (parent ? '<a class="meta-category" href="' + routeHref(parent) + '"></a>' : '') +
      '<span>约 ' + text.length.toLocaleString('zh-CN') + ' 字，阅读约 ' + minutes + ' 分钟</span>' +
      '<a href="' + source + '" target="_blank" rel="noopener">在 GitHub 上查看</a>';
    if (parent) meta.querySelector('.meta-category').textContent = categoryName(parent);
    var heading = section.querySelector('h1');
    if (heading) heading.after(meta); else section.insertBefore(meta, section.firstChild);
  }
  function routeHref(path) { return '#' + encodedRoute(path); }
  function sidebarPages() {
    var seen = {}, pages = [];
    document.querySelectorAll('.sidebar-nav a').forEach(function (link) {
      if (link.closest('.page-toc, .page-toc-block')) return;
      var href = decode((link.getAttribute('href') || '').split('?')[0]);
      if (!/^#\/notes\//.test(href) || seen[href]) return;
      seen[href] = true;
      pages.push({ path: href.slice(1), title: link.textContent.trim() });
    });
    return pages;
  }
  function categoryName(path) { return pageTitle(path).replace(/ - 目录$/, ''); }
  // 上一篇、下一篇：侧边栏中的文章按侧边栏顺序；目录页下的子文章按目录页中的顺序，两端回到目录页和侧边栏的下一项
  function neighbours(path) {
    var pages = sidebarPages(), tree = window.CS_NOTES_TREE || {};
    function at(list, i) { return i >= 0 && i < list.length ? list[i] : null; }
    function index(target) {
      for (var i = 0; i < pages.length; i++) if (pages[i].path === target) return i;
      return -1;
    }
    var parent = treeParent(path);
    if (parent) {
      var siblings = tree[parent], i = siblings.indexOf(path), k = index(parent);
      var sibling = function (j) { return at(siblings, j) && { path: siblings[j], title: pageTitle(siblings[j]) }; };
      return [sibling(i - 1) || (k !== -1 && pages[k]), sibling(i + 1) || at(pages, k + 1)];
    }
    var n = index(path);
    if (n === -1) return null;
    var children = tree[path];
    return [at(pages, n - 1), children ? { path: children[0], title: pageTitle(children[0]) } : at(pages, n + 1)];
  }
  function pageNavigation(vm, section) {
    if (section.querySelector('.page-nav')) return;
    var pair = neighbours(decode(vm.route.path));
    if (!pair || (!pair[0] && !pair[1])) return;
    var nav = document.createElement('nav');
    nav.className = 'page-nav';
    nav.setAttribute('aria-label', '上一篇和下一篇');
    [[pair[0], 'prev', '上一篇'], [pair[1], 'next', '下一篇']].forEach(function (item) {
      if (!item[0]) { nav.appendChild(document.createElement('span')); return; }
      var a = document.createElement('a');
      a.className = item[1];
      a.href = routeHref(item[0].path);
      a.innerHTML = '<small>' + item[2] + '</small>';
      var title = document.createElement('span');
      title.textContent = item[0].title;
      a.appendChild(title);
      nav.appendChild(a);
    });
    section.insertBefore(nav, section.querySelector('.site-footer'));
  }


  // 二到四级标题后的“#”按钮：复制指向这一节的完整链接，方便分享
  function notice(text) {
    var old = document.querySelector('.copy-notice');
    if (old) old.remove();
    var tip = document.createElement('div');
    tip.className = 'copy-notice';
    tip.setAttribute('role', 'status');
    tip.textContent = text;
    document.body.appendChild(tip);
    setTimeout(function () { tip.remove(); }, 1600);
  }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.cssText = 'position:fixed;top:-100px;opacity:0';
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (error) { ok = false; }
      area.remove();
      (ok ? resolve : reject)();
    });
  }
  function headingText(heading) {
    var copy = heading.cloneNode(true);
    copy.querySelectorAll('.heading-link').forEach(function (node) { node.remove(); });
    return copy.textContent.trim();
  }
  function headingLinks(vm, section) {
    section.querySelectorAll('h2[id], h3[id], h4[id]').forEach(function (heading) {
      if (heading.querySelector('.heading-link')) return;
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'heading-link';
      button.textContent = '#';
      button.title = '复制本节链接';
      button.setAttribute('aria-label', '复制“' + headingText(heading) + '”的链接');
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        var url = location.origin + '/#' + encodedRoute(decode(vm.route.path)) + '?id=' + encodeURIComponent(heading.id);
        copyText(url).then(function () { notice('已复制本节链接'); }, function () { notice('复制失败，请手动复制地址栏'); });
      });
      heading.appendChild(button);
    });
  }

  // 记住每篇文章读到的小节：再次打开时提示继续阅读，首页给出最近读过的文章
  var stopProgress = null;
  function readingProgress(vm, section) {
    if (stopProgress) { stopProgress(); stopProgress = null; }
    var old = document.querySelector('.resume-toast');
    if (old) old.remove();
    var path = decode(vm.route.path);
    var saved = storage(PROGRESS_KEY) || {};
    if (path === '/') {
      var last = Object.keys(saved).filter(function (key) { return key !== '/'; })
        .sort(function (a, b) { return saved[b].time - saved[a].time; })[0];
      var grid = section.querySelector('.topic-grid');
      if (!last || !grid || section.querySelector('.recent-read')) return;
      var recent = document.createElement('p');
      recent.className = 'recent-read';
      recent.innerHTML = '<span>上次阅读：</span>';
      var link = document.createElement('a');
      link.href = '#' + encodedRoute(last) + (saved[last].id ? '?id=' + encodeURIComponent(saved[last].id) : '');
      link.textContent = saved[last].page + (saved[last].heading ? ' · ' + saved[last].heading : '');
      recent.appendChild(link);
      grid.after(recent);
      return;
    }
    var heads = Array.from(section.querySelectorAll('h2[id], h3[id], h4[id]'));
    if (heads.length < 3) return;
    var page = ((section.querySelector('h1') || {}).textContent || path.split('/').pop()).trim();
    var record = saved[path];
    var target = record && record.id && document.getElementById(record.id);
    if (!vm.route.query.id && target && heads.indexOf(target) > 1) {
      var toast = document.createElement('div');
      toast.className = 'resume-toast';
      toast.setAttribute('role', 'status');
      toast.innerHTML = '<span>上次读到：</span>';
      var name = document.createElement('b');
      name.textContent = record.heading;
      toast.appendChild(name);
      toast.insertAdjacentHTML('beforeend', '<button type="button" class="go">继续阅读</button><button type="button" class="close" aria-label="关闭">×</button>');
      toast.addEventListener('click', function (event) {
        var button = event.target.closest('button');
        if (!button) return;
        toast.remove();
        if (button.classList.contains('go')) {
          target.scrollIntoView();
          // 前面的图片延迟加载，加载后位置会下移，稍后再对齐一次
          setTimeout(function () { target.scrollIntoView(); }, 600);
        }
      });
      document.body.appendChild(toast);
      setTimeout(function () { toast.remove(); }, 12000);
    }
    var lastId = null, timer = null;
    function save() {
      var current = null;
      for (var i = 0; i < heads.length; i++) {
        if (heads[i].getBoundingClientRect().top > 90) break;
        current = heads[i];
      }
      var id = current ? current.id : null;
      if (id === lastId) return;
      lastId = id;
      var all = storage(PROGRESS_KEY) || {};
      all[path] = { page: page, id: id, heading: current ? headingText(current) : '', time: Date.now() };
      // 只保留最近的 100 篇
      Object.keys(all).sort(function (a, b) { return all[b].time - all[a].time; }).slice(100)
        .forEach(function (key) { delete all[key]; });
      storage(PROGRESS_KEY, all);
    }
    function onScroll() { clearTimeout(timer); timer = setTimeout(save, 400); }
    window.addEventListener('scroll', onScroll, { passive: true });
    stopProgress = function () { clearTimeout(timer); window.removeEventListener('scroll', onScroll); };
  }

  // Docsify 只在点击链接时滚动到小节或回到顶部；在地址栏修改或粘贴链接时它当作历史导航，停在上一篇的位置。
  // 用 Navigation API 区分前进后退（交给浏览器恢复位置）和其它导航；不支持的浏览器保持 Docsify 原来的行为。
  var lastNavigation = null, lastPath = null;
  var navigating = false, savingY = false;
  if (window.navigation && navigation.addEventListener) {
    navigation.addEventListener('navigate', function (event) {
      // 下面保存滚动位置的 replaceState 也会触发 navigate，不是导航
      if (savingY) return;
      // Docsify 渲染时会用 replaceState 规范化地址，不能覆盖之前的 push 或 traverse
      if (event.navigationType === 'replace' && lastNavigation) return;
      lastNavigation = event.navigationType;
      navigating = true;
    });
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }
  // 前进后退时浏览器在正文渲染出来之前恢复位置，只能回到顶部；这里把滚动位置记在当前历史记录中，渲染后再恢复
  var saveTimer = null;
  window.addEventListener('scroll', function () {
    clearTimeout(saveTimer);
    if (navigating) return;
    saveTimer = setTimeout(function () {
      if (navigating) return;
      savingY = true;
      try { history.replaceState(Object.assign({}, history.state, { csNotesY: Math.round(window.scrollY) }), '', location.href); } catch (error) {}
      savingY = false;
    }, 150);
  }, { passive: true });
  // 跳到小节后，途经的图片（外链的图片没有预先留出高度）加载时会把正文撑高，目标标题落到视口下方。
  // 跳转后的几秒内正文高度一变就把目标标题对齐回 top 处，读者自己滚动、点击或按键后停止
  var stopPin = null;
  function pinTarget(target, top, delay, force) {
    if (stopPin) stopPin();
    var section = document.querySelector('.markdown-section');
    if (!target || !section || !window.ResizeObserver) return;
    var started = Date.now(), observer, timer, STOP = ['wheel', 'touchstart', 'keydown', 'mousedown'];
    function align() {
      if (Date.now() - started > 8000 || !target.isConnected) return stop();
      var off = Math.round(target.getBoundingClientRect().top - top);
      if (Math.abs(off) > 2) window.scrollBy(0, off);
    }
    function stop() {
      clearTimeout(timer);
      if (observer) observer.disconnect();
      STOP.forEach(function (type) { window.removeEventListener(type, stop, true); });
      window.removeEventListener('hashchange', stop);
      stopPin = null;
    }
    STOP.forEach(function (type) { window.addEventListener(type, stop, true); });
    window.addEventListener('hashchange', stop);
    stopPin = stop;
    // 等 Docsify 的滚动动画（约 500ms）和上面的平滑校正结束后再开始
    timer = setTimeout(function () {
      // 不知道导航类型时（浏览器不支持 Navigation API），离目标远说明是浏览器恢复的位置，不对齐
      if (!force && Math.abs(target.getBoundingClientRect().top - top) > 150) return stop();
      align();
      observer = new ResizeObserver(align);
      observer.observe(section);
    }, delay);
  }
  function settleScroll(vm) {
    var type = lastNavigation, path = vm.route.path, previous = lastPath;
    lastNavigation = null;
    lastPath = path;
    // 恢复或跳转完成后再恢复记录，避免把中途的位置写进历史记录
    setTimeout(function () { navigating = false; }, 200);
    if (type === 'traverse' || type === 'reload') {
      var y = history.state && history.state.csNotesY;
      setTimeout(function () {
        var saved = vm.route.query.id && document.getElementById(vm.route.query.id);
        if (typeof y === 'number') window.scrollTo(0, y);
        else if (saved) saved.scrollIntoView();
        else window.scrollTo(0, 0);
      }, 0);
      return;
    }
    if (!type) {
      if (vm.route.query.id) pinTarget(document.getElementById(vm.route.query.id), 0, 600, false);
      return;
    }
    setTimeout(function () {
      var id = vm.route.query.id, target = id && document.getElementById(id);
      if (target) {
        if (Math.abs(target.getBoundingClientRect().top) > 120) target.scrollIntoView();
        pinTarget(target, 0, 550, true);
      } else if (previous !== null && previous !== path) {
        window.scrollTo(0, 0);
      }
    }, 0);
  }
  // 同一篇文章内只改 ?id= 时 Docsify 不重新渲染，doneEach 不会触发，在这里滚动
  window.addEventListener('hashchange', function () {
    var type = lastNavigation, hash = location.hash, path = decode(hash.split('?')[0].slice(1));
    if (!type && path === decode(lastPath || '')) {
      var plain = new URLSearchParams(hash.split('?').slice(1).join('?')).get('id');
      if (plain) pinTarget(document.getElementById(plain), 0, 600, false);
    }
    if (!type || path !== decode(lastPath || '')) return;
    if (type === 'traverse') {
      lastNavigation = null;
      var y = history.state && history.state.csNotesY;
      setTimeout(function () {
        if (typeof y === 'number') window.scrollTo(0, y);
        navigating = false;
      }, 50);
      return;
    }
    var id = new URLSearchParams(hash.split('?').slice(1).join('?')).get('id');
    setTimeout(function () {
      lastNavigation = null;
      navigating = false;
      var target = id && document.getElementById(id);
      if (!target) return;
      // 在地址栏中改 ?id= 时 Docsify 不滚动，偏差大时直接跳；点链接时它已滚到附近，只做平滑的小校正
      var off = target.getBoundingClientRect().top - 20;
      if (Math.abs(off) > 4) window.scrollBy({ top: off, behavior: Math.abs(off) > 2000 || reducedMotion() ? 'auto' : 'smooth' });
      flashHeading(target);
      pinTarget(target, 20, 700, true);
    }, 560);
  });
  preserveLegacyLinks();
  window.addEventListener('hashchange', preserveLegacyLinks);
  window.$docsify = {
    name: 'CS-Notes',
    repo: 'https://github.com/CyC2018/CS-Notes',
    homepage: 'README.txt',
    ext: '.txt',
    loadSidebar: true,
    alias: { '/.*/_sidebar.txt': '/_sidebar.txt' },
    subMaxLevel: 0,
    auto2top: true,
    notFoundPage: true,
    relativePath: false,
    copyCode: { buttonText: '复制', errorText: '复制失败', successText: '已复制' },
    plugins: [function (hook, vm) {
      // 托管平台对不存在的文件返回首页的 HTML（状态码 200），这时不当成笔记显示，改为显示“页面暂未找到”
      hook.beforeEach(function (content, next) {
        if (!/^\s*<!doctype html/i.test(content)) return next(content);
        fetch('/_404.txt').then(function (response) { return response.ok ? response.text() : ''; }).catch(function () { return ''; }).then(function (text) {
          next(text && !/^\s*<!doctype html/i.test(text) ? text : '# 页面暂未找到\n\n[返回首页](/)');
        });
      });
      hook.afterEach(function (content) {
        var document = new DOMParser().parseFromString(content, 'text/html');
        configureImages(document, vm.route.path === '/');
        trimAutolinks(document);
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
        if (/^\/notes\//.test(vm.route.path) && !document.querySelector('h1#页面暂未找到')) {
          articleMeta(vm, document.body);
          sectionQuestions(vm, document.body);
        }
        return document.body.innerHTML + '<footer class="site-footer"><a href="https://github.com/CyC2018/CS-Notes" target="_blank" rel="noopener">CyC2018 · CS-Notes</a><span> · </span><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">粤ICP备19071404号-1</a></footer>';
      });
      hook.doneEach(function () {
        nameControls();
        offlineNote(document.querySelector('.markdown-section'));
        // 没有一级标题的文章（设计模式各篇从“## 5. 中介者”开始）用文件名，书签和标签页上更好认
        var heading = document.querySelector('.markdown-section h1');
        var name = heading ? heading.textContent.trim() : (/^\/notes\//.test(vm.route.path) ? decode(vm.route.path.split('/').pop()) : '');
        document.title = (vm.route.path === '/' || !name ? 'CS-Notes' : name + ' · CS-Notes') + ' · CyC2018';
        configureImages(document.querySelector('.markdown-section'), vm.route.path === '/');
        stepAnimations(document.querySelector('.markdown-section'));
        settleScroll(vm);
        articleToc(vm);
        mountTools();
        var section = document.querySelector('.markdown-section');
        if (section && /^\/notes\//.test(vm.route.path) && !section.querySelector('h1#页面暂未找到')) {
          articleMeta(vm, section);
          pageNavigation(vm, section);
          headingLinks(vm, section);
          learnCallout(vm, section);
          practiceCallout(vm, section);
          sectionQuestions(vm, section);
        }
        learnBanner(section);
        dailyQuestion(section);
        if (section) readingProgress(vm, section);
        document.querySelectorAll('.article-toc').forEach(function (toc) {
          toc.open = window.matchMedia('(min-width: 769px)').matches;
        });
      });
    }]
  };
})();

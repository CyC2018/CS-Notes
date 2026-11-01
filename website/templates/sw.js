// 离线与弱网：安装时缓存入口页和本次构建的脚本、样式；读过的文章、侧边栏和配图在访问时缓存。
// 文章和入口页先走网络，3 秒内没有返回或断网时用缓存；带内容哈希的文件直接用缓存。学习站（/learn/）有自己的缓存，这里不处理。
// 下面的构建号和文件列表由 build.py 写入。
var BUILD = '__BUILD__';
var SHELL = __SHELL__;
// 带哈希的脚本、样式不按构建号分开存：缓存的旧入口页（弱网时先显示）引用的旧文件还要能读到，超过上限时删最早的
var STATIC = 'cs-notes-static', PAGES = 'cs-notes-pages', IMAGES = 'cs-notes-images';
var LIMITS = {};
LIMITS[STATIC] = 40;
LIMITS[PAGES] = 120;
LIMITS[IMAGES] = 300;
self.addEventListener('install', function (event) {
  // 构建号 BUILD 写在这个文件里，构建变化时浏览器会重新安装
  event.waitUntil(caches.open(STATIC).then(function (cache) { return cache.addAll(SHELL); }).then(function () { return trim(STATIC); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});
// 缓存条目超过上限时删掉最早放入的
function trim(name) {
  return caches.open(name).then(function (cache) {
    return cache.keys().then(function (keys) {
      return Promise.all(keys.slice(0, Math.max(0, keys.length - LIMITS[name])).map(function (key) { return cache.delete(key); }));
    });
  });
}
function put(name, request, response) {
  if (!response || !response.ok || response.type !== 'basic') return;
  var copy = response.clone();
  caches.open(name).then(function (cache) { return cache.put(request, copy); }).then(function () { if (LIMITS[name]) return trim(name); });
}
function offlinePage(path) {
  var title = decodeURIComponent(path.split('/').pop().replace(/\.(md|txt)$/, ''));
  return new Response('# 当前离线\n\n《' + title + '》还没有在这台设备上打开过，联网后再试。已经读过的文章离线时也能打开。\n',
    { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-CS-Notes-Offline': '1' } });
}
// 先走网络，等待超过 wait 毫秒或失败时用缓存（所有缓存中找）；都没有时由 fallback 给出内容
function networkFirst(request, name, wait, fallback) {
  return caches.match(request, { ignoreSearch: true }).then(function (cached) {
    var network = fetch(request).then(function (response) { put(name, request, response); return response; });
    var settled = network.catch(function () { return null; });
    var timer = new Promise(function (resolve) { setTimeout(resolve, wait); });
    return Promise.race(cached ? [settled, timer] : [settled]).then(function (first) {
      if (first) return first;
      if (cached) return cached;
      return fallback ? fallback() : Response.error();
    });
  });
}
function cacheFirst(request, name) {
  return caches.match(request).then(function (hit) {
    return hit || fetch(request).then(function (response) { put(name, request, response); return response; });
  });
}
self.addEventListener('fetch', function (event) {
  var request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.indexOf('/learn/') === 0 || url.searchParams.has('release')) return;
  var path = url.pathname;
  if (request.mode === 'navigate') {
    // 网站只有首页一个入口，其它地址（旧文章的 .html 链接等）照常走网络
    if (path === '/' || path === '/index.html') event.respondWith(networkFirst(new Request('/'), STATIC, 3000, null));
  } else if (/^\/(app|vendor|style)-[0-9a-f]{16}\.(js|css)$|^\/search-index-[0-9a-f]+\.json$|^\/optimized\//.test(path)) {
    event.respondWith(cacheFirst(request, /^\/optimized\//.test(path) ? IMAGES : STATIC));
  } else if (/\.(md|txt)$/.test(path)) {
    event.respondWith(networkFirst(request, PAGES, 3000, /^\/_sidebar\.(md|txt)$/.test(path) ? null : function () { return offlinePage(path); }));
  } else if (/\.(png|jpe?g|gif|svg|webp)$/.test(path)) {
    event.respondWith(networkFirst(request, IMAGES, 3000, null));
  }
});

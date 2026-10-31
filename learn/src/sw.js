// 离线缓存：安装时缓存本次构建的全部文件，之后优先读缓存；构建号变化时换用新的缓存并删除旧的。
// 下面的构建号和文件列表由 build.py 写入。
var CACHE = 'cs-learn-__BUILD__';
var FILES = __FILES__;
self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(CACHE).then(function (cache) { return cache.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('cs-learn-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  // 页面本身先走网络，保证更新后能拿到新的入口；离线时用缓存
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(function () { return caches.match('./'); }));
    return;
  }
  event.respondWith(caches.match(request).then(function (hit) { return hit || fetch(request); }));
});

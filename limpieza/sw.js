// Keeps a saved copy of the Limpieza page for when the internet is down.
// Always the network first: the saved copy is used only when the network fails,
// so a new version always reaches the computer as soon as it's online.
// Raise VERSION with the page's version, and list the page's current files.
var VERSION = 3;
var CACHE = 'limpieza';
var FILES = [
  './', 'sin-reunion.js', 'limpieza-v3.js', 'limpieza-v3.css', 'manifest-v3.webmanifest',
  'grupo1-fondo-v3.svg', 'grupo2-fondo-v3.svg', 'grupo3-fondo-v3.svg',
  'grupo4-fondo-v3.svg', 'grupo5-fondo-v3.svg', 'grupo6-fondo-v3.svg', 'sin-reunion-fondo-v3.svg',
  'icono-v3-180.png', 'icono-v3-192.png', 'icono-v3-512.png'
];

function fresh(url) { return new Request(url, { cache: 'no-cache' }); }

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES.map(fresh)); }).then(function () { return self.skipWaiting(); }));
});

// Drop saved files from older versions.
self.addEventListener('activate', function (e) {
  var keep = FILES.map(function (f) { return new URL(f, self.registration.scope).href; });
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return c.keys().then(function (reqs) {
      return Promise.all(reqs.map(function (r) {
        var url = r.url.split('?')[0];
        return keep.indexOf(url) < 0 ? c.delete(r) : null;
      }));
    });
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.registration.scope)) return;
  var url = new URL(req.url);
  var key = url.origin + url.pathname; // saved without ?t=… or ?fecha=…
  // The page and its scripts skip the browser's own short-term copy, so they're always the newest.
  var always = req.mode === 'navigate' || /\.(js|html)$|\/$/.test(url.pathname);
  e.respondWith(
    (always ? fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' }) : fetch(req))
      .then(function (res) {
        if (res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(key, copy); });
        }
        return res;
      })
      .catch(function () {
        return caches.open(CACHE).then(function (c) {
          return c.match(key).then(function (hit) { return hit || c.match(self.registration.scope); });
        });
      })
  );
});

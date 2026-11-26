// Service worker: keeps the gym app available offline.
const CACHE = 'palestra-v1';
const FILES = ['./', 'index.html', 'fonts.css', 'manifest.webmanifest', 'icons/apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png',
  'fonts/inter-latin-400-normal.woff2', 'fonts/inter-latin-500-normal.woff2', 'fonts/inter-latin-600-normal.woff2', 'fonts/inter-latin-700-normal.woff2',
  'fonts/barlow-condensed-latin-700-normal.woff2'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES.map((f) => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== CACHE).map((x) => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req, { cache: 'no-cache' }).then((res) => { const c = res.clone(); caches.open(CACHE).then((x) => x.put('index.html', c)); return res; }).catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((res) => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then((x) => x.put(req, c)); } return res; })));
});

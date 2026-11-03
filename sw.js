// Masraf Paylaş – çevrimdışı önbellek.
// Uygulamayı güncellediğinizde aşağıdaki sürüm numarasını artırın (v1 → v2 ...).
const CACHE = 'masraf-paylas-v1';
const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './fonts/bricolage-grotesque-latin-600-normal.woff2',
  './fonts/bricolage-grotesque-latin-700-normal.woff2',
  './fonts/bricolage-grotesque-latin-ext-600-normal.woff2',
  './fonts/bricolage-grotesque-latin-ext-700-normal.woff2',
  './fonts/figtree-latin-400-normal.woff2',
  './fonts/figtree-latin-500-normal.woff2',
  './fonts/figtree-latin-600-normal.woff2',
  './fonts/figtree-latin-700-normal.woff2',
  './fonts/figtree-latin-ext-400-normal.woff2',
  './fonts/figtree-latin-ext-500-normal.woff2',
  './fonts/figtree-latin-ext-600-normal.woff2',
  './fonts/figtree-latin-ext-700-normal.woff2',
  './fonts/ibm-plex-mono-latin-500-normal.woff2',
  './fonts/ibm-plex-mono-latin-600-normal.woff2',
  './fonts/ibm-plex-mono-latin-ext-500-normal.woff2',
  './fonts/ibm-plex-mono-latin-ext-600-normal.woff2',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Sayfa: önce internet (güncel sürüm), yoksa önbellek. Diğer dosyalar: önce önbellek.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put('./index.html', copy)); return res; })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }
  event.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
});

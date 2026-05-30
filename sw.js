// ══════════════════════════════════════════════
//  sw.js  —  Service Worker (BaZaw Note)
// ══════════════════════════════════════════════

const CACHE_NAME = 'bazaw-note-v1';

const CACHE_FILES = [
  './',
  './index.html',
  './css/style.css',
  './js/api.js',
  './js/app.js',
  './js/apartments.js',
  './js/goods.js',
  './js/finance.js',
  './js/property.js',
  './js/bank.js',
  './manifest.json'
];

// ── Install: cache အကုန် သိမ်းမည် ─────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHE_FILES);
    })
  );
  self.skipWaiting();
});

// ── Activate: ဟောင်းတဲ့ cache ဖျက်မည် ─────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: Network first, cache fallback ───────
self.addEventListener('fetch', event => {
  // Google Sheets API calls — cache မလုပ်ဘူး
  if (event.request.url.includes('script.google.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Network အောင်မြင်ရင် cache update လုပ်မည်
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => {
        // Offline ဖြစ်ရင် cache ကနေ ပြမည်
        return caches.match(event.request);
      })
  );
});

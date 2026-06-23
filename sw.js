// Eric's Live Channels — service worker.
// Network-first for the app shell AND for the shared widget/feed on
// colonialbeachapp.com, so the channels always stay in sync; cache is only a
// fallback when offline. Cache-first for icons/manifest (rarely change).
const CACHE = 'eric-live-channels-v1';
const PRECACHE = ['/', '/index.html', '/manifest.json', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // Shared channels bundle + live feed: NETWORK-FIRST so the app stays synced
  // with every town. Cache the latest good copy for offline fallback.
  const isChannelsSource = url.hostname.indexOf('colonialbeachapp.com') !== -1
    && (url.pathname.endsWith('channels-widget.js') || url.pathname.endsWith('channels.json'));
  if (isChannelsSource) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res && res.ok) { const clone = res.clone(); caches.open(CACHE).then(c => c.put(e.request, clone)); }
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // Other cross-origin (fonts, YouTube, radio streams, thumbnails): pass through.
  if (url.origin !== self.location.origin) return;

  // App shell HTML/JS: network-first, fall back to cache / index.html offline.
  const isShell = e.request.destination === 'document'
    || url.pathname === '/' || url.pathname === '/index.html'
    || url.pathname.endsWith('.js') || url.pathname.endsWith('.html');
  if (isShell) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res && res.ok) { const clone = res.clone(); caches.open(CACHE).then(c => c.put(e.request, clone)); }
        return res;
      }).catch(() => caches.match(e.request).then(c => c || caches.match('/index.html')))
    );
    return;
  }

  // Icons, manifest, images: cache-first.
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res && res.ok) { const clone = res.clone(); caches.open(CACHE).then(c => c.put(e.request, clone)); }
      return res;
    }).catch(() => undefined))
  );
});

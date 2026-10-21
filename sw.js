/* =====================================================================
 * Huonville Primary School Registration System - Service Worker
 * ---------------------------------------------------------------------
 * FIX: the previous worker used a "cache-first" strategy for the app
 * itself. Once the app was installed, it kept serving the OLD cached
 * copy of the page forever - even after the user uninstalled and
 * reinstalled it - so it could get stuck and never connect to the cloud.
 *
 * This version:
 *   1. Serves the APP (same-origin HTML/JS) NETWORK-FIRST, so the
 *      installed app always loads the latest code when online and only
 *      falls back to the cached copy when truly offline.
 *   2. NEVER intercepts Firebase / Google live traffic, so the cloud
 *      connection is never broken by the cache.
 *   3. Still caches the static CDN libraries (Font Awesome, Chart.js,
 *      jsPDF, Firebase SDK) so the app works offline.
 *   4. Uses a new cache name + skipWaiting/clients.claim so it replaces
 *      the old broken worker automatically on the next launch.
 * ===================================================================== */

const CACHE_NAME = 'hvr-school-reg-v3';

// Static, versioned libraries that are safe to cache long-term.
const STATIC_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-database-compat.js',
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-storage-compat.js'
];

// Live cloud endpoints that must go straight to the network, untouched.
function isFirebaseLive(hostAndPath) {
  return /(firebaseio\.com|firebasedatabase\.app|googleapis\.com|identitytoolkit|firebaseinstallations|firebaselogging|accounts\.google\.com)/.test(hostAndPath);
}

// Let the page tell us to activate a freshly installed worker immediately.
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;

  // Never interfere with writes (POST/PUT) or Firebase requests.
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 1) Leave all Firebase / Google live traffic completely alone.
  if (isFirebaseLive(url.hostname + url.pathname)) return;

  // 2) The app itself (same origin) -> NETWORK FIRST.
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(req)
        .then(resp => {
          if (resp && resp.status === 200) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
          }
          return resp;
        })
        .catch(() => caches.match(req).then(cached => cached || caches.match('./')))
    );
    return;
  }

  // 3) Static CDN libraries -> cache first (immutable, versioned URLs).
  event.respondWith(
    caches.match(req).then(cached =>
      cached ||
      fetch(req).then(resp => {
        if (resp && resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        }
        return resp;
      }).catch(() => cached)
    )
  );
});

const CACHE_NAME = 'health0-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo_initial.png',
  '/logo192.png',
  '/logo512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Only cache available assets, avoid failing the install if some are missing during dev
        return cache.addAll(urlsToCache).catch(err => console.warn('Service Worker: Some initial assets failed to cache', err));
      })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip interception for development-only requests (Vite, HMR, chrome extensions)
  if (
    url.pathname.startsWith('/@vite') || 
    url.pathname.startsWith('/node_modules') || 
    url.pathname.startsWith('/src') ||
    url.hostname === 'localhost' && url.port === '5173' && !url.pathname.match(/\.(png|jpg|jpeg|svg|webp)$/)
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        
        return fetch(event.request)
          .catch(err => {
            // Gracefully handle fetch failures (offline, local server down)
            console.debug('Service Worker: Fetch failed for', event.request.url, err);
            return new Response('Network error occurred', { status: 408, statusText: 'Network Timeout' });
          });
      })
  );
});

const CACHE_NAME = 'syed-cycle-mart-v15';

const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './images/TI Cycles of India.svg',
  './images/Hercules.png',
  './images/hero-logo.jpg',
  './images/avon-new-logo.jpg',
  './images/hero-showroom-banner-1600.webp',
  './images/hero-showroom-banner-960.webp',
  './images/hero-showroom-banner.png',
  './images/hero_banner_wholesale_1782917333222.png',
  './images/product-kids-bmx-900.webp',
  './images/product-kids-bmx.png',
  './images/product-ladies-classic-900.webp',
  './images/product-ladies-classic.png',
  './images/product_kids_bmx_1782905799723.png',
  './images/product_ladies_classic_1782905809912.png',
  './images/showroom_hero_creative_1782920797194.png',
  './images/spare_parts_showcase_1782917345554.png',
  './images/syed_cycle_mart_logo_1782916268892.png',
  './images/contact_form_bg_1782901744445.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
        return undefined;
      })))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
        }
        return networkResponse;
      });
    })
  );
});

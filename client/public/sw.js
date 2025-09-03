const CACHE_NAME = 'industry-guru-v1';
const urlsToCache = [
  '/',
  '/assets/css/style.css',
  '/assets/img/logo.png',
  '/assets/img/Carousel.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
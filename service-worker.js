const cacheName = 'maydayz-smokn-bbq-v1';
const filesToCache = [
    '/',
    '/src/html/about.html',
    '/src/html/catering.html',
    '/src/html/option.html',
    '/src/html/login.html',
    '/src/css/output.css',
    '/src/js/index.js',
    '/src/assets/Images/MAYDAYZ-FAV.png',
    '/manifest.json'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
const CACHE_NAME = 'dcm-v6-offline';
const ASSETS = [
    '/',
    '/index.html',
    '/dashboard.html',
    '/quiz.html',
    '/styles/glassmorphism.css',
    '/styles/modern-normalize.css',
    '/js/session-manager.js',
    '/js/dashboard-engine.js'
];

// INSTALL
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('📦 [Service Worker] Caching all: app shell and content');
            return cache.addAll(ASSETS);
        })
    );
});

// FETCH
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// ACTIVATE (Clean up old caches)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('🧹 [Service Worker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
});

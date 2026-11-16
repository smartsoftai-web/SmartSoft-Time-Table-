onst CACHE_NAME = 'smartsoft-timetable-v3'; 
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    'https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js'
];

self.addEventListener('install', event => {
    self.skipWaiting(); 
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                if(!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                const resClone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, resClone);
                });
                return response;
            })
            .catch(() => caches.match(event.request)) 
    );
});

const CACHE_NAME = 'smartsoft-timetable-v2'; 
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json'
];

// Install Event - අලුත් කේතය Cache කිරීම
self.addEventListener('install', event => {
    self.skipWaiting(); // අලුත් අප්ඩේට් එක ආපු ගමන් පරණ එක අයින් කර බලහත්කාරයෙන් අලුත් එක ක්‍රියාත්මක කරයි
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        })
    );
});

// Activate Event - පරණ Caches මකා දැමීම
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

// Fetch Event - අන්තර්ජාලයෙන්/සර්වර් එකෙන් අලුත් දත්ත ගැනීම (Network First)
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // සර්වර් එකෙන් අලුත් ෆයිල් එකක් ආවොත් ඒක අලුතින් cache එකට දානවා
                const resClone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, resClone);
                });
                return response;
            })
            .catch(() => caches.match(event.request)) // සර්වර් එක වැඩ නැත්නම් විතරක් පරණ Cache එක දෙනවා
    );
});

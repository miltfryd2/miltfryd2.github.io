self.addEventListener('install', function (event) {
    console.log('The service worker is being installed.');
    event.waitUntil(
        caches.open('health-diet').then(function(cache) {
            return cache.addAll([
                '/index.html',
                '/favicon.ico',
                '/style.css',
                '/manifest.json',
                '/assets/close.svg',
                '/assets/complete.svg',
                '/assets/delete.svg',
                '/assets/downArrow.svg',
                '/assets/edit.svg',
                '/assets/icon.svg',
                '/assets/192.png',
                '/assets/512.png',
                '/assets/logo.svg',
                '/assets/reactivate.svg',
                '/assets/SourceSansPro.ttf',
                '/assets/upArrow.svg',
                '/assets/heartapple.jpg',
                '/assets/apples.jpg',
                '/assets/applesPNG.png',
                '/assets/applesPNG2.png',
                '/assets/indexBtn.png',
                '/assets/minus.png',
                '/assets/plus.png',
                '/common.js',
                '/script.js'
            ]);
        })
    );
});

self.addEventListener('fetch', function (event) {
    console.log('The service worker is serving the asset.');
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || caches.match('/index.html');
        })
    );
});
// use a cacheName for cache versioning
var cacheName = 'v1:static';

// during the install phase you usually want to cache static assets
self.addEventListener('install', function(e) {
    // once the SW is installed, go ahead and fetch the resources to make this work offline
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll([
				'/',
                '/index.html',
				'/api/data.json',
				'/scripts/arrival.js',
				'/scripts/main.js',
				'/scripts/page.js',
                '/css/style.css',
				'/images/launcher-icon.png',
				'/images/launcher-icon-96.png',
				'/images/launcher-icon-144.png',
				'/images/launcher-icon-192.png',
				'/images/launcher-icon-256.png',
                '/offline.html'
				]).then(function() {
					self.skipWaiting();
            });
        })
    );
});

// when the browser fetches a url
self.addEventListener('fetch', function(event) {
// either respond with the cached object or go ahead and fetch the actual url
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
// retrieve from cache
                return response;
            }
// fetch as normal
            return fetch(event.request);
        })
    );
});
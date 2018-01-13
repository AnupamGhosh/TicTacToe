var CACHE_NAME = 'TicTacToe-v-3';
var urlsToCache = [
	'./',
	'style.css',
	'script.js',
	'TicTacToe.js'
];

self.addEventListener('install', e => {
	self.skipWaiting();
	e.waitUntil(
		caches.open(CACHE_NAME)
		.then(cache => cache.addAll(urlsToCache))
	)
});

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys()
		.then(cacheNames => Promise.all(
			cacheNames.map(cacheName => {
				if (cacheName.startsWith('TicTacToe') && cacheName != CACHE_NAME) {
					return caches.delete(cacheName);
				}
			})
		))
	);
});

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request)
		// Cache hit - return response
		.then(response => response || fetch(event.request))
	);
});

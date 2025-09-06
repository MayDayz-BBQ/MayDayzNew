// A simple service worker for a stale-while-revalidate caching strategy.

const cacheName = 'maydayz-smokn-bbq-v2';

// The activate event is used to clean up old caches.
// This is important for preventing old, stale content from being served.
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== cacheName) {
                    // Delete all old caches
                    return caches.delete(key);
                }
            }));
        })
    );
});

// The fetch event is where the magic happens.
self.addEventListener('fetch', (e) => {
    // Only handle HTTP/HTTPS requests
    if (!e.request.url.startsWith('http')) {
        return;
    }

    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            // Immediately serve the cached response, if available.
            // This makes the page load instantly for repeat visitors.
            const networkFetch = fetch(e.request).then((networkResponse) => {
                // After getting the new response, open the cache and update it.
                // We use a clone because a response can only be read once.
                const clonedResponse = networkResponse.clone();
                caches.open(cacheName).then((cache) => {
                    cache.put(e.request, clonedResponse);
                });
                return networkResponse;
            }).catch(() => {
                // If the network request fails, we can return a fallback response here,
                // but for this simple version, we'll just let the fetch fail silently.
            });

            // Return the cached response if it exists, otherwise return the network fetch.
            return cachedResponse || networkFetch;
        })
    );
});

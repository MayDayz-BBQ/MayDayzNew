// A robust service worker for a stale-while-revalidate caching strategy.

const cacheName = 'maydayz-smokn-bbq-v2';

// The activate event is used to clean up old caches.
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
    // We want to handle all GET requests that are not coming from external domains.
    if (e.request.method !== 'GET') {
        // Corrected: Return early for non-GET requests to prevent the `put` error.
        return;
    }

    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            // A request for the network, we must clone it because a request can only be used once.
            const fetchPromise = fetch(e.request).then((networkResponse) => {
                // Corrected: We must check if the response is valid before caching.
                // Status 200 is good, type 'basic' means it's from the same origin.
                if (networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const clonedResponse = networkResponse.clone();
                    caches.open(cacheName).then((cache) => {
                        // The put() operation is now safe to execute.
                        cache.put(e.request, clonedResponse);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // If the network fails, but a cached response exists, we return the cached response.
                // If both fail, the browser will handle the network error.
                return cachedResponse;
            });

            // Return the cached response immediately if it exists, otherwise return the network promise.
            return cachedResponse || fetchPromise;
        })
    );
});
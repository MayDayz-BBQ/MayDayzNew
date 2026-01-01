  self.addEventListener("install", (event) => {
    event.waitUntil(self.skipWaiting());
  });
  
  self.addEventListener("activate", (event) => {
    event.waitUntil(
      caches.keys().then((keys) => {
        return Promise.all(keys.map(key => caches.delete(key)));
      }).then(() => {
        return self.registration.unregister();
      }).then(() => {
        console.log("SW Unregistered");
      })
    );
  });
  
  self.addEventListener("fetch", (event) => {
    // console.log('[SW] Fetch event - passing through for unregistering SW:', event.request.url);
    return;
  });
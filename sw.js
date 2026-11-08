// Offline support: cache the whole game on first visit.
const CACHE = "ls-lights-v1";
const FILES = [
  "./", "index.html", "manifest.webmanifest",
  "fonts/fonts.css", "fonts/bungee.woff2", "fonts/barlow-400.woff2", "fonts/barlow-600.woff2",
  "fonts/barlow-700.woff2", "fonts/share-tech-mono.woff2",
  "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
    const copy = res.clone();
    caches.open(CACHE).then(c => c.put(e.request, copy));
    return res;
  }).catch(() => caches.match("index.html"))));
});

const CACHE_NAME = "3d-library-shell-v4-2-5";
const BASE_URL = new URL("./", self.registration.scope);
const APP_INDEX = new URL("index.html", BASE_URL).href;
const LABEL_ROUTE = new URL("label-studio/", BASE_URL).href;
const LABEL_INDEX = new URL("label-studio/index.html", BASE_URL).href;
const LABEL_PREFIX = new URL("label-studio/", BASE_URL).pathname;
const APP_SHELL = [
  BASE_URL.href, APP_INDEX, new URL("style.css", BASE_URL).href,
  new URL("script.js", BASE_URL).href, new URL("manifest.json", BASE_URL).href,
  new URL("icons/icon-192.png", BASE_URL).href, new URL("icons/icon-512.png", BASE_URL).href,
  LABEL_ROUTE, LABEL_INDEX, new URL("label-studio/style.css", BASE_URL).href,
  new URL("label-studio/app.js", BASE_URL).href,
  new URL("label-studio/manifest.webmanifest", BASE_URL).href,
  new URL("label-studio/icon.svg", BASE_URL).href
];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((key) => key.startsWith("3d-library-shell-") && key !== CACHE_NAME).map((key) => caches.delete(key))
  )));
  self.clients.claim();
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith(LABEL_PREFIX)) {
    if (request.mode === "navigate") {
      event.respondWith(fetch(request).then((response) => {
        if (response.ok) { const copy = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)); }
        return response;
      }).catch(async () => (await caches.match(request)) || caches.match(LABEL_INDEX) || caches.match(LABEL_ROUTE)));
      return;
    }
    event.respondWith(caches.match(request).then((cached) => {
      const network = fetch(request).then((response) => {
        if (response.ok) { const copy = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)); }
        return response;
      }).catch(() => cached);
      return cached || network;
    }));
    return;
  }
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then((response) => {
      const copy = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(APP_INDEX, copy)); return response;
    }).catch(() => caches.match(APP_INDEX)));
    return;
  }
  event.respondWith(caches.match(request).then((cached) => {
    const network = fetch(request).then((response) => {
      if (response.ok) { const copy = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)); }
      return response;
    }).catch(() => cached);
    return cached || network;
  }));
});

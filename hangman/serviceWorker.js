addEventListener('install', event => {
    event.waitUntil(cacheAssets());
})

async function cacheAssets() {
    const cache = await caches.open("hangman");
    return cache.addAll(["index.html", "js/app.js", "js/game.js", "js/hangman.js",
    "icon/android/launcher-icon-36x36.png",
    "icon/android/launcher-icon-48x48.png",
        "icon/android/launcher-icon-72x72.png",
        "icon/android/launcher-icon-96x96.png",
        "icon/android/launcher-icon-144x144.png",
        "icon/android/launcher-icon-192x192.png"
    ]);
}


addEventListener('fetch', event => {
    event.respondWith(fetchResource(event.request))
})

async function fetchResource(request) {
    const cache = caches.open("hangman");
    let response = await cache.match(request)
    if(!response) {
        response = await fetch(request);
        cache.put(request, response.clone())
    }
    return response;
}
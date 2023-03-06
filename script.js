let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    const installButton = document.getElementById('install-button');
    installButton.style.display = 'block';
    installButton.addEventListener('click', (event) => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
            installButton.style.display = 'none';
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const storedStylesheet = localStorage.getItem("stylesheet");
    if (storedStylesheet) {
        const stylesheet = document.getElementById("stylesheet");
        stylesheet.setAttribute("href", storedStylesheet);
        const button = document.getElementById("toggleBtn");
        if (storedStylesheet.endsWith("style.css")) {
            button.textContent = "LM";
        } else {
            button.textContent = "DM";
        }
    }
});
function switchCss() {
    const stylesheet = document.getElementById("stylesheet");
    const button = document.getElementById("toggleBtn");
    if (stylesheet.getAttribute("href") === "style.css") {
        stylesheet.setAttribute("href", "dark.css");
        button.textContent = "DM";
    } else {
        stylesheet.setAttribute("href", "style.css");
        button.textContent = "LM";
    }
    localStorage.setItem("stylesheet", stylesheet.getAttribute("href"));
}
// This is the "Offline page" service worker

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE = "pwabuilder-page";
const offlineFallbackPage = "offline.html";
self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});
self.addEventListener('install', async (event) => {
    event.waitUntil(
        caches.open(CACHE)
            .then((cache) => cache.add(offlineFallbackPage))
    );
});
if (workbox.navigationPreload.isSupported()) {
    workbox.navigationPreload.enable();
}
self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith((async () => {
            try {
                const preloadResp = await event.preloadResponse;
                if (preloadResp) {
                    return preloadResp;
                }
                const networkResp = await fetch(event.request);
                return networkResp;
            } catch (error) {
                const cache = await caches.open(CACHE);
                const cachedResp = await cache.match(offlineFallbackPage);
                return cachedResp;
            }
        })());
    }
});
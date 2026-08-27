/* One service worker for everything: shell cache + background push.
   Two workers registered on the same scope overwrite each other, so
   the messaging handler lives here rather than in its own file. */
const CACHE = 'mesimot-v14';
const SHELL = ['./', './index.html', './manifest.webmanifest',
               './icon/icon-192.png', './icon/icon-512.png',
               './icon/icon-maskable-512.png', './new.html'];

/* cache each file on its own: addAll() rejects the WHOLE install if a single
   file 404s, and a worker that never installs also makes the app
   un-installable — one wrong path would silently cost us the icon too. */
self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all(SHELL.map(u =>
      c.add(u).catch(err => console.warn('[sw] skipped', u, err))));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.origin !== location.origin) return;          // Firebase & fonts go to the network
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});

/* ---------- background push ---------- */
try {
  importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js');

  firebase.initializeApp({
    apiKey:            "AIzaSyDKsD3KMyoewuBxgl-tFF4QCvYKOGS0aqI",
    authDomain:        "mesimot-adef5.firebaseapp.com",
    databaseURL:       "https://mesimot-adef5-default-rtdb.europe-west1.firebasedatabase.app",
    projectId:         "mesimot-adef5",
    storageBucket:     "mesimot-adef5.firebasestorage.app",
    messagingSenderId: "258471745644",
    appId:             "1:258471745644:web:2fd37e48695e1042c7a049"
  });

  firebase.messaging().onBackgroundMessage(payload => {
    const d = payload.data || {};
    self.registration.showNotification(d.title || 'המטלות שלנו', {
      body: d.body || '',
      icon: 'icon/icon-192.png',
      badge: 'icon/icon-192.png',
      dir: 'rtl', lang: 'he',
      tag: d.tag || 'mesimot',
      data: { url: d.url || './' }
    });
  });
} catch (err) {
  // no push on this browser — caching must keep working regardless
  console.warn('messaging unavailable in sw:', err);
}

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) if ('focus' in c) return c.focus();
    return clients.openWindow((e.notification.data && e.notification.data.url) || './');
  }));
});

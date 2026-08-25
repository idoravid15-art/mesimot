/* Handles push notifications while the app is closed.
   Paste the SAME config you put at the top of index.html. */
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
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-192.png',
    dir: 'rtl',
    lang: 'he',
    tag: d.tag || 'mesimot',
    data: { url: d.url || './' }
  });
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) if ('focus' in c) return c.focus();
    return clients.openWindow(e.notification.data?.url || './');
  }));
});

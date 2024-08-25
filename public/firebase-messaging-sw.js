// import toast from "react-hot-toast"
/* eslint-disable no-undef */

importScripts('https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.8/firebase-messaging.js');

const firebaseConfig = {
  apiKey: 'AIzaSyBBxI30RVs9ogbbIwMx80PpvzAJYBmumlg',
  authDomain: 'socon-41444.firebaseapp.com',
  projectId: 'socon-41444',
  storageBucket: 'socon-41444.appspot.com',
  messagingSenderId: '629265353230',
  appId: '1:629265353230:web:83b55f8d2f5b92c6b34a5f',
  measurementId: 'G-JSLVTW93L1'
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  // toast.success(notificationTitle)
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || payload.notification.image
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  if (event.action) {
    console.log('Opening window with action:', event.action);
    clients.openWindow(event.action);
  } else {
    console.log(
      'No action specified. Opening default action:',
      'http://localhost:3000/login/homepage'
    );
    clients.openWindow('https://app.socialcontinent.xyz/notification');
  }
  event.notification.close();
});

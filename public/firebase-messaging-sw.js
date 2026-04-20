importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDQuBiOZmdX1JuSzWmHEDFHdBTTTdBU934",
  authDomain: "haeseola-a83de.firebaseapp.com",
  databaseURL: "https://haeseola-a83de-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "haeseola-a83de",
  storageBucket: "haeseola-a83de.firebasestorage.app",
  messagingSenderId: "103075772011",
  appId: "1:103075772011:web:613534af89be2ac84ca32e"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/vite.svg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

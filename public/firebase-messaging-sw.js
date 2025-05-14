importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
const firebaseConfig = {
  apiKey: "AIzaSyDQV5dab2vwU1rdlxsfaSMTDtfgP0kOP2Q",
  authDomain: "medrem-fbcb0.firebaseapp.com",
  projectId: "medrem-fbcb0",
  storageBucket: "medrem-fbcb0.firebasestorage.app",
  messagingSenderId: "954226199500",
  appId: "1:954226199500:web:6c134554da50db66dd6b69",
  measurementId: "G-XW9DFRX8H7"
};

firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onMessage((payload) => {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

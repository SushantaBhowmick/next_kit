// importScripts("https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging-compat.js");
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyC9qPE37Fi-NOrS7_1XOsmKewg1nweGwg8",
    authDomain: "fir-cloud-messaging-75bae.firebaseapp.com",
    projectId: "fir-cloud-messaging-75bae",
    storageBucket: "fir-cloud-messaging-75bae.firebasestorage.app",
    messagingSenderId: "20788342180",
    appId: "1:20788342180:web:66083246d3d30e7bce6531",
    measurementId: "G-F997MBPMF4"
  };

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions={
        body: payload.notification.body,
        icon: "🔥",
    };
    self.registration.showNotification(notificationTitle, notificationOptions)
})
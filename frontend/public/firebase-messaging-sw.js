importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// PENTING: File ini berjalan terpisah di background dan tidak bisa membaca process.env.
// Anda HARUS MENGGANTI teks di bawah dengan nilai asli dari Firebase Project Anda.
const firebaseConfig = {
  apiKey: "API_KEY_ANDA",
  authDomain: "ews-aplication.firebaseapp.com",
  projectId: "ews-aplication",
  storageBucket: "ews-aplication.appspot.com",
  messagingSenderId: "MESSAGING_SENDER_ID_ANDA",
  appId: "APP_ID_ANDA"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Menangkap notifikasi saat aplikasi ditutup/berjalan di background
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Menerima pesan background ', payload);
  
  const notificationTitle = payload.data?.title || payload.notification?.title || 'Peringatan EWS Flood Guard';
  const notificationOptions = {
    body: payload.data?.message || payload.notification?.body || 'Cek dashboard untuk detail.',
    icon: '/favicon.ico', // Ganti jika Anda punya logo 192x192 PNG
    badge: '/favicon.ico',
    data: {
      url: '/user/dashboard' // URL yang dibuka saat notifikasi di-klik
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Event listener saat notifikasi di-klik
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
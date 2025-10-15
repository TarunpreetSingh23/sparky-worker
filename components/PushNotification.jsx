// components/PushNotification.jsx

import { useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/messaging';
// Note: You may need to install the firebase package: npm install firebase

// Your Firebase Configuration (same as in service worker)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  projectId: "YOUR_PROJECT_ID",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase client-side

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const messaging = typeof window !== 'undefined' && firebase.messaging.isSupported() ? firebase.messaging() : null;

export const usePushNotifications = () => {
  useEffect(() => {
    if (!messaging) return;

    // 1. Register the service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
            messaging.useServiceWorker(registration);
            console.log('Service Worker successfully registered.');
        })
        .catch((err) => {
            console.error('Service Worker registration failed:', err);
        });
    }

    // 2. Request notification permission and get the token
    const getToken = async () => {
      try {
        const currentToken = await messaging.getToken({
          vapidKey: "YOUR_VAPID_KEY_FROM_FIREBASE", // Paste your VAPID key here
        });

        if (currentToken) {
          console.log('FCM Registration Token:', currentToken);
          // 🔑 IMPORTANT: Send this token to your backend/database
          // so you can use it later to send push notifications.
          // Example: saveTokenToDB(currentToken, userId); 
        } else {
          console.log('No registration token available. Request permission.');
        }
      } catch (err) {
        console.error('An error occurred while retrieving token.', err);
      }
    };

    // 3. Request permission on component mount
    if (Notification.permission === 'granted') {
        getToken();
    } else if (Notification.permission !== 'denied') {
        // Only prompt if permission hasn't been denied
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                getToken();
            }
        });
    }
    
    // 4. Handle token refresh (important for long-term reliability)
    messaging.onTokenRefresh(() => {
        getToken();
    });

  }, []);
};

// Use this hook in your main layout or a high-level component
// Example: In your Next.js page:
// import { usePushNotifications } from '../components/PushNotification';
// export default function Home() {
//   usePushNotifications();
//   // ... rest of your component
// }
// pages/api/send-push.js
import * as admin from 'firebase-admin';

// Initialize Firebase Admin only once
if (!admin.apps.length) {
  // Replace with the path to your service account JSON file
  const serviceAccount = require('../../path/to/your/serviceAccountKey.json'); 
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // 🔑 You must fetch the user's token from your database here
    const registrationToken = 'THE_USER_FCM_TOKEN_FROM_YOUR_DB'; 
    
    const message = {
      notification: {
        title: 'New Service Alert!',
        body: 'Check out the new deals on Cleaning Services today.',
        icon: '/logo.png' // Icon to show in the notification tray
      },
      data: {
        url: 'https://yourwebsite.com/deals', // Optional deep link
      },
      token: registrationToken
    };

    try {
      // Send the message
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
      res.status(200).json({ success: true, messageId: response });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
import * as admin from 'firebase-admin';
import Worker from '@/models/Worker'; // Your Mongoose Worker Model

// This function is called when a new task is created or assigned.
export async function sendTaskNotification(workerId, taskId, taskDescription) {
    try {
        // 1. Lookup Worker and their Push Token
        const worker = await Worker.findOne({ workerId: workerId });

        // IMPORTANT: The Worker model must have a 'pushToken' field
        if (!worker || !worker.pushToken) {
            console.warn(`Worker ${workerId} not found or no push token available.`);
            return;
        }

        const registrationToken = worker.pushToken;

        // 2. Construct the Message Payload
        const message = {
            notification: {
                title: '🚨 New Task Assigned!',
                body: `Task #${taskId}: ${taskDescription}`,
                icon: '/icons/task-icon.png'
            },
            data: {
                taskId: taskId.toString(),
                click_action: 'https://yourwebsite.com/worker/tasks' // Deep link to the task page
            },
            token: registrationToken
        };

        // 3. Send the Notification via FCM
        const response = await admin.messaging().send(message);
        console.log('Successfully sent task notification:', response);
        return true;

    } catch (error) {
        console.error('Error sending task notification:', error);
        return false;
    }
}

// Ensure you initialize the Firebase Admin SDK once when your app starts
// (Check previous answer for Admin SDK initialization steps).
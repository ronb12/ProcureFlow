import { getFirestore } from 'firebase-admin/firestore';
// import { getAuth } from 'firebase-admin/auth';

const db = getFirestore();
// const auth = getAuth();

export interface NotificationData {
  type:
    | 'status_change'
    | 'approval_needed'
    | 'purchase_completed'
    | 'reconciliation_due';
  requestId: string;
  newStatus?: string;
  actorUid: string;
  message?: string;
}

export async function sendNotification(data: NotificationData): Promise<void> {
  try {
    // Get request data
    const requestDoc = await db
      .collection('requests')
      .doc(data.requestId)
      .get();
    if (!requestDoc.exists) {
      console.error('Request not found for notification:', data.requestId);
      return;
    }

    const request = requestDoc.data();
    const requesterId = request?.requesterId;

    if (!requesterId) {
      console.error('No requester ID found for request:', data.requestId);
      return;
    }

    // Get requester user data
    const requesterDoc = await db.collection('users').doc(requesterId).get();
    if (!requesterDoc.exists) {
      console.error('Requester not found:', requesterId);
      return;
    }

    const requester = requesterDoc.data();
    const requesterEmail = requester?.email;

    if (!requesterEmail) {
      console.error('No email found for requester:', requesterId);
      return;
    }

    // Get actor user data
    const actorDoc = await db.collection('users').doc(data.actorUid).get();
    const actorName = actorDoc.exists ? actorDoc.data()?.name : 'Unknown User';

    // Generate notification message
    const message = generateNotificationMessage(data, request, actorName);

    // Store notification in database
    await db.collection('notifications').add({
      userId: requesterId,
      type: data.type,
      requestId: data.requestId,
      message,
      read: false,
      createdAt: new Date(),
    });

    // Send email notification (if configured)
    if (process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY) {
      await sendEmailNotification(requesterEmail, message, data.requestId);
    }

    console.log('Notification sent successfully:', data.requestId);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

function generateNotificationMessage(
  data: NotificationData,
  request: any,
  actorName: string
): string {
  const vendor = request?.vendor || 'Unknown Vendor';
  const total = request?.totalEstimate || 0;

  switch (data.type) {
    case 'status_change':
      return `Your request for ${vendor} ($${total.toFixed(2)}) has been updated to "${data.newStatus}" by ${actorName}.`;

    case 'approval_needed':
      return `Your request for ${vendor} ($${total.toFixed(2)}) is ready for approval.`;

    case 'purchase_completed':
      return `Your request for ${vendor} ($${total.toFixed(2)}) has been purchased by ${actorName}.`;

    case 'reconciliation_due':
      return `Your request for ${vendor} ($${total.toFixed(2)}) is ready for reconciliation.`;

    default:
      return data.message || `Update for your request ${data.requestId}`;
  }
}

async function sendEmailNotification(
  email: string,
  message: string,
  requestId: string
): Promise<void> {
  // This is a placeholder for email sending
  // In a real implementation, you would use SendGrid, Resend, or another email service

  console.log('Email notification would be sent to:', email);
  console.log('Message:', message);
  console.log('Request ID:', requestId);

  // Example SendGrid implementation:
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  //
  // const msg = {
  //   to: email,
  //   from: 'noreply@procureflow.com',
  //   subject: 'ProcureFlow Notification',
  //   text: message,
  //   html: `<p>${message}</p><p><a href="https://your-app.com/requests/${requestId}">View Request</a></p>`,
  // };
  //
  // await sgMail.send(msg);
}

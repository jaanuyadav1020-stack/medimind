// sw.js

// This event fires when the service worker is installed.
self.addEventListener('install', event => {
  // skipWaiting() forces the waiting service worker to become the active service worker.
  self.skipWaiting();
});

// This event fires when the service worker is activated.
self.addEventListener('activate', event => {
  // clients.claim() allows an active service worker to set itself as the controller for all clients within its scope.
  event.waitUntil(self.clients.claim());
});

// This is the main logic for handling clicks on notifications.
self.addEventListener('notificationclick', event => {
  const reminder = event.notification.data?.reminder;

  // Close the notification that was clicked.
  event.notification.close();

  // Exit early if we don't have the necessary reminder data.
  if (!reminder) {
    return;
  }

  // Determine the snooze duration based on the action button that was clicked.
  const action = event.action; // e.g., 'snooze-5', 'snooze-15'
  let snoozeMinutes = 0;
  if (action === 'snooze-5') snoozeMinutes = 5;
  if (action === 'snooze-15') snoozeMinutes = 15;
  if (action === 'snooze-30') snoozeMinutes = 30;

  if (snoozeMinutes > 0) {
    // If a snooze action was clicked, schedule a new notification for the future.
    // Note: setTimeout in a service worker is not guaranteed for long periods,
    // but it is generally reliable for short intervals like this.
    setTimeout(() => {
      self.registration.showNotification(`Snoozed: ${reminder.medicineName}`, {
        body: `It's time to take your medication.`,
        icon: '/vite.svg',
        tag: reminder.id + '-snoozed-' + Date.now(), // Unique tag for snoozed notification
        requireInteraction: true,
        data: { reminder }, // Pass the original reminder data again for re-snoozing
        actions: [
          { action: 'snooze-5', title: 'Snooze 5 min' },
          { action: 'snooze-15', title: 'Snooze 15 min' },
          { action: 'snooze-30', title: 'Snooze 30 min' },
        ],
      });
    }, snoozeMinutes * 60 * 1000);
  } else {
    // If the notification body itself (or a non-snooze button) was clicked,
    // focus the existing app window or open a new one.
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
        if (clientList.length > 0) {
          let client = clientList[0];
          // Try to find a focused client to focus that one.
          for (let i = 0; i < clientList.length; i++) {
            if (clientList[i].focused) {
              client = clientList[i];
            }
          }
          return client.focus();
        }
        // Otherwise, open a new window.
        return self.clients.openWindow('/');
      })
    );
  }
});

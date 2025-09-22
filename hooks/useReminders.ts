import { useState, useEffect, useCallback, useRef } from 'react';
import { Reminder, Day } from '../types';
import { DAYS_OF_WEEK } from '../constants';

// Helper function for safer date initialization from localStorage
const getInitialLastCheck = (): Date => {
  const storedDateString = localStorage.getItem('medimind_last_check');
  if (storedDateString) {
    const date = new Date(storedDateString);
    // Check if the date is valid.
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  // Return current time if nothing is stored or the stored value is invalid.
  return new Date();
};

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    try {
      const savedReminders = localStorage.getItem('medimind_reminders');
      return savedReminders ? JSON.parse(savedReminders) : [];
    } catch (error) {
      console.error("Failed to parse reminders from localStorage", error);
      return [];
    }
  });

  const lastCheckTimeRef = useRef<Date>(getInitialLastCheck());

  useEffect(() => {
    localStorage.setItem('medimind_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const addReminder = (reminder: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: new Date().toISOString() + Math.random(),
    };
    setReminders(prev => [...prev, newReminder].sort((a,b) => a.time.localeCompare(b.time)));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };
  
  const updateReminder = (updatedReminder: Reminder) => {
    setReminders(prev => 
      prev
        .map(r => r.id === updatedReminder.id ? updatedReminder : r)
        .sort((a,b) => a.time.localeCompare(b.time))
    );
  };

  const checkReminders = useCallback(() => {
    const now = new Date();
    // To prevent multiple rapid checks, ensure at least 5 seconds have passed.
    if (now.getTime() - lastCheckTimeRef.current.getTime() < 5000) {
        return;
    }
    
    const dayOfWeek = DAYS_OF_WEEK[now.getDay()] as Day;
    
    // To prevent a flood of notifications on first load after a long time,
    // we cap the lookback window. Don't show notifications older than 12 hours.
    const lookbackLimit = new Date(now);
    lookbackLimit.setHours(lookbackLimit.getHours() - 12);

    const startTime = lastCheckTimeRef.current > lookbackLimit ? lastCheckTimeRef.current : lookbackLimit;

    reminders.forEach(reminder => {
      // Check if the reminder is scheduled for today
      if (reminder.days.includes(dayOfWeek)) {
        const [hours, minutes] = reminder.time.split(':').map(Number);
        
        const reminderDateTime = new Date(now);
        reminderDateTime.setHours(hours, minutes, 0, 0);

        // Check if the reminder time falls within our check window (startTime to now).
        if (reminderDateTime > startTime && reminderDateTime <= now) {
           if (Notification.permission === 'granted' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
              // FIX: Cast notification options to 'any' to resolve a TypeScript error.
              // The 'actions' property is valid for service worker notifications but may
              // be missing from the NotificationOptions type in this project's configuration.
              registration.showNotification(`Time for your: ${reminder.medicineName}`, {
                body: `It's your scheduled time (${reminder.time}) to take your medication.`,
                icon: '/vite.svg',
                tag: reminder.id, // Use a tag to prevent duplicate notifications
                requireInteraction: true, // Keep notification until user interaction
                data: { reminder }, // Pass the full reminder object to the SW
                actions: [
                  { action: 'snooze-5', title: 'Snooze 5 min' },
                  { action: 'snooze-15', title: 'Snooze 15 min' },
                  { action: 'snooze-30', title: 'Snooze 30 min' },
                ]
              } as any);
            });
          } else if (Notification.permission === 'granted') {
            // Fallback for browsers without service worker support
            new Notification(`Time for your: ${reminder.medicineName}`, {
              body: `It's your scheduled time (${reminder.time}) to take your medication.`,
              icon: '/vite.svg',
              tag: reminder.id,
              requireInteraction: true,
            });
          }
        }
      }
    });
    
    // Update the last check time for the next interval
    lastCheckTimeRef.current = now;
    localStorage.setItem('medimind_last_check', now.toISOString());
  }, [reminders]);

  useEffect(() => {
    // When the app loads, immediately check for any missed reminders.
    checkReminders();

    // Check every minute as a fallback
    const interval = setInterval(checkReminders, 60000);

    // Also check when the tab becomes visible, as setInterval is throttled in background tabs
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkReminders();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkReminders]);


  return { reminders, addReminder, deleteReminder, updateReminder };
};

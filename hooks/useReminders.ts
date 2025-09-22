
import { useState, useEffect, useCallback } from 'react';
import { Reminder, Day } from '../types';
import { DAYS_OF_WEEK } from '../constants';

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
  
  const checkReminders = useCallback(() => {
    const now = new Date();
    const dayOfWeek = DAYS_OF_WEEK[now.getDay()] as Day;
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    reminders.forEach(reminder => {
      if (reminder.time === currentTime && reminder.days.includes(dayOfWeek)) {
        console.log(`Triggering notification for ${reminder.medicineName}`);
        new Notification('MediMind Reminder', {
          body: `It's time to take your ${reminder.medicineName}.`,
          icon: '/vite.svg', 
        });
      }
    });
  }, [reminders]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkReminders();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [checkReminders]);


  return { reminders, addReminder, deleteReminder };
};


import React, { useState, useEffect } from 'react';
import { useReminders } from '../hooks/useReminders';
import AddReminderModal from '../components/AddReminderModal';
import ReminderList from '../components/ReminderList';
import { PlusIcon, UserCircleIcon, LogoutIcon, BellIcon, PillIcon } from '../components/icons/Icons';

interface HomePageProps {
  user: { email: string };
  onLogout: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ user, onLogout }) => {
  const { reminders, addReminder, deleteReminder } = useReminders();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(setNotificationPermission);
    }
  }, []);

  const requestNotification = () => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(setNotificationPermission);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-500 rounded-full text-white">
                <PillIcon className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">MediMind</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden sm:block text-gray-600">
                Welcome, {user.email.split('@')[0]}
              </span>
              <UserCircleIcon className="w-8 h-8 text-gray-500" />
              <button
                onClick={onLogout}
                className="p-2 rounded-full hover:bg-gray-100 transition"
                aria-label="Logout"
              >
                <LogoutIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {notificationPermission !== 'granted' && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <BellIcon className="w-6 h-6 mr-3" />
              <p>Enable notifications to get medication alerts.</p>
            </div>
            <button onClick={requestNotification} className="font-bold py-1 px-3 rounded bg-yellow-200 hover:bg-yellow-300">
              Enable
            </button>
          </div>
        )}

        <ReminderList reminders={reminders} onDelete={deleteReminder} />

        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-110"
          aria-label="Add new reminder"
        >
          <PlusIcon className="w-8 h-8" />
        </button>
      </main>

      {isModalOpen && (
        <AddReminderModal
          onClose={() => setIsModalOpen(false)}
          onAddReminder={addReminder}
        />
      )}
    </div>
  );
};

export default HomePage;

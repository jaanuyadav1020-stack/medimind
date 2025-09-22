import React from 'react';
import { Reminder } from '../types';
import ReminderItem from './ReminderItem';
import { CalendarIcon } from './icons/Icons';

interface ReminderListProps {
  reminders: Reminder[];
  onDelete: (id: string) => void;
  onEdit: (reminder: Reminder) => void;
}

const ReminderList: React.FC<ReminderListProps> = ({ reminders, onDelete, onEdit }) => {
  if (reminders.length === 0) {
    return (
      <div className="text-center py-20 px-4">
        <div className="inline-block p-5 bg-blue-100 rounded-full">
            <CalendarIcon className="w-16 h-16 text-blue-500" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-gray-700">No Reminders Yet</h2>
        <p className="mt-2 text-gray-500">
          Click the '+' button to add your first medication reminder.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reminders.map(reminder => (
        <ReminderItem key={reminder.id} reminder={reminder} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
};

export default ReminderList;
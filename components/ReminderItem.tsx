import React from 'react';
import { Reminder, Day, TimeSlot } from '../types';
import { TrashIcon, ClockIcon, SunIcon, MoonIcon, PencilIcon } from './icons/Icons';
import { DAYS_OF_WEEK } from '../constants';

interface ReminderItemProps {
  reminder: Reminder;
  onDelete: (id: string) => void;
  onEdit: (reminder: Reminder) => void;
}

const TimeSlotIcon = ({ timeSlot }: { timeSlot: TimeSlot }) => {
    switch (timeSlot) {
        case TimeSlot.Morning:
        case TimeSlot.Afternoon:
            return <SunIcon className="w-6 h-6 text-yellow-500" />;
        case TimeSlot.Evening:
            return <MoonIcon className="w-6 h-6 text-indigo-500" />;
        default:
            return <ClockIcon className="w-6 h-6 text-gray-500" />;
    }
};

const ReminderItem: React.FC<ReminderItemProps> = ({ reminder, onDelete, onEdit }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex items-start space-x-4 transition-all hover:shadow-lg">
      <div className="flex-shrink-0 p-3 bg-blue-100 rounded-full">
        <TimeSlotIcon timeSlot={reminder.timeSlot} />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">{reminder.medicineName}</h3>
          <p className="text-xl font-mono font-semibold text-blue-600 flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-gray-400"/>
            {reminder.time}
          </p>
        </div>
        <p className="text-sm text-gray-500">{reminder.timeSlot}</p>
        
        <div className="mt-3 flex space-x-1.5">
          {DAYS_OF_WEEK.map(day => (
            <span
              key={day}
              className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-full
                ${reminder.days.includes(day) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}
            >
              {day.slice(0,1)}
            </span>
          ))}
        </div>
      </div>
       <div className="flex items-center">
         <button
          onClick={() => onEdit(reminder)}
          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-100 rounded-full transition"
          aria-label="Edit reminder"
         >
          <PencilIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(reminder.id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-full transition"
          aria-label="Delete reminder"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ReminderItem;
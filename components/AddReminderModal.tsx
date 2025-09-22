import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Reminder, Day, TimeSlot } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import { extractTextFromImage } from '../services/geminiService';
import { XIcon, PhotographIcon, SparklesIcon, ClockIcon, CalendarIcon, PillIcon } from './icons/Icons';


interface AddReminderModalProps {
  onClose: () => void;
  onSaveReminder: (reminder: Omit<Reminder, 'id'> | Reminder) => void;
  reminderToEdit?: Reminder | null;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });


const AddReminderModal: React.FC<AddReminderModalProps> = ({ onClose, onSaveReminder, reminderToEdit }) => {
  const [medicineName, setMedicineName] = useState('');
  const [timeSlot, setTimeSlot] = useState<TimeSlot>(TimeSlot.Morning);
  const [time, setTime] = useState('08:00');
  const [days, setDays] = useState<Day[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = !!reminderToEdit;

  useEffect(() => {
    if (reminderToEdit) {
      setMedicineName(reminderToEdit.medicineName);
      setTimeSlot(reminderToEdit.timeSlot);
      setTime(reminderToEdit.time);
      setDays(reminderToEdit.days);
      setImagePreviewUrl(null); // No image preview in edit mode
      setError('');
    }
  }, [reminderToEdit]);


  useEffect(() => {
    // Clean up the object URL to avoid memory leaks
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleDayToggle = (day: Day) => {
    setDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const clearImage = () => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl(null);
    setMedicineName(isEditMode ? medicineName : ''); // Don't clear name in edit mode unless new image is uploaded
    setError('');
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Create a URL for the new image and set it for preview
      const newPreviewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(newPreviewUrl);

      setIsProcessing(true);
      setError('');
      setMedicineName('');
      
      try {
        const base64Image = await fileToBase64(file);
        const extractedName = await extractTextFromImage(base64Image, file.type);
        setMedicineName(extractedName);
      } catch (err) {
        console.error(err);
        setError("Failed to process image. Please try again.");
      } finally {
        setIsProcessing(false);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineName || days.length === 0) {
      setError('Please fill in the medicine name and select at least one day.');
      return;
    }
    const reminderData = { medicineName, timeSlot, time, days };
    
    if (isEditMode) {
      onSaveReminder({ ...reminderData, id: reminderToEdit.id });
    } else {
      onSaveReminder(reminderData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative transition-transform transform scale-95 animate-modal-enter">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <XIcon className="w-6 h-6" />
        </button>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">{isEditMode ? 'Edit Reminder' : 'New Reminder'}</h2>
          
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2"><PillIcon className="w-5 h-5 text-gray-500" />Medicine Name</label>

            {imagePreviewUrl ? (
                <div className="relative group w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-2 bg-gray-50">
                    <img src={imagePreviewUrl} alt="Medication preview" className="max-h-full max-w-full object-contain rounded-md" />
                    {isProcessing && (
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center rounded-lg text-white transition-opacity">
                            <SparklesIcon className="w-8 h-8 animate-spin" />
                            <p className="mt-2 text-sm font-semibold">Reading Image...</p>
                        </div>
                    )}
                    {!isProcessing && (
                         <button 
                            type="button" 
                            onClick={clearImage}
                            className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-40 rounded-full text-white opacity-0 group-hover:opacity-100 hover:bg-opacity-60 transition-all"
                            aria-label="Remove image"
                          >
                            <XIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ) : (
                <label 
                    htmlFor="image-upload" 
                    className="cursor-pointer w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-blue-500 transition mb-2"
                >
                    <PhotographIcon className="w-8 h-8" />
                    <span className="mt-1 text-sm font-semibold">Upload a Photo</span>
                    <span className="text-xs">to automatically read medicine name</span>
                </label>
            )}

            <input 
                id="image-upload" 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload} 
                disabled={isProcessing} 
            />
            
            <input
                type="text"
                value={medicineName}
                onChange={e => setMedicineName(e.target.value)}
                placeholder={isProcessing ? "Reading from image..." : "e.g., Aspirin 81mg"}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={isProcessing}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2"><ClockIcon className="w-5 h-5 text-gray-500"/>Time</label>
            <div className="flex space-x-2">
              <select 
                value={timeSlot} 
                onChange={e => setTimeSlot(e.target.value as TimeSlot)}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                {Object.values(TimeSlot).map(ts => <option key={ts} value={ts}>{ts}</option>)}
              </select>
              <input 
                type="time" 
                value={time} 
                onChange={e => setTime(e.target.value)} 
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2"><CalendarIcon className="w-5 h-5 text-gray-500"/>Repeat on</label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {DAYS_OF_WEEK.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`p-2 text-sm font-semibold rounded-lg border-2 transition ${
                    days.includes(day)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
              {isEditMode ? 'Save Changes' : 'Add Reminder'}
            </button>
          </div>
        </form>
      </div>
       <style>{`
            @keyframes modal-enter {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
            .animate-modal-enter {
                animation: modal-enter 0.2s ease-out forwards;
            }
        `}</style>
    </div>
  );
};

export default AddReminderModal;

export enum Day {
  Mon = 'Mon',
  Tue = 'Tue',
  Wed = 'Wed',
  Thu = 'Thu',
  Fri = 'Fri',
  Sat = 'Sat',
  Sun = 'Sun',
}

export enum TimeSlot {
  Morning = 'Morning',
  Afternoon = 'Afternoon',
  Evening = 'Evening',
}

export interface Reminder {
  id: string;
  medicineName: string;
  timeSlot: TimeSlot;
  time: string; // HH:mm format
  days: Day[];
}

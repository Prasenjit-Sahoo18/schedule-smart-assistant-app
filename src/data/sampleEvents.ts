
import { CalendarEvent } from "../types";

// Helper to create dates relative to today
const today = new Date();
const getRelativeDate = (dayOffset: number, hourOffset = 0, minuteOffset = 0): Date => {
  const date = new Date(today);
  date.setDate(date.getDate() + dayOffset);
  date.setHours(today.getHours() + hourOffset, today.getMinutes() + minuteOffset, 0, 0);
  return date;
};

export const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Meeting",
    start: getRelativeDate(0, 1), // Today, 1 hour from now
    end: getRelativeDate(0, 2), // Today, 2 hours from now
    description: "Weekly team sync to discuss project progress",
    category: "work",
    location: "Conference Room A"
  },
  {
    id: "2",
    title: "Lunch with Alex",
    start: getRelativeDate(1, 0), // Tomorrow, same time
    end: getRelativeDate(1, 1), // Tomorrow, 1 hour later
    description: "Catching up over lunch",
    category: "personal",
    location: "Cafe Downtown"
  },
  {
    id: "3",
    title: "Project Deadline",
    start: getRelativeDate(3, -1), // 3 days from now, 1 hour earlier
    end: getRelativeDate(3, 0), // 3 days from now, same time
    description: "Final submission of the quarterly project",
    category: "important",
    location: "Office"
  },
  {
    id: "4",
    title: "Doctor's Appointment",
    start: getRelativeDate(5, 2), // 5 days from now, 2 hours later
    end: getRelativeDate(5, 3), // 5 days from now, 3 hours later
    description: "Annual checkup",
    category: "personal",
    location: "Medical Center"
  },
  {
    id: "5",
    title: "Client Presentation",
    start: getRelativeDate(2, -2), // 2 days from now, 2 hours earlier
    end: getRelativeDate(2, 0), // 2 days from now, same time
    description: "Presenting new product features to the client",
    category: "work",
    location: "Client Office"
  }
];

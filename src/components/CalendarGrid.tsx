
import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns";
import { CalendarEvent } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EventForm from "./EventForm";

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  // Get all days in the current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Add days from previous and next months to fill the grid
  const startDay = monthStart.getDay(); // 0-6, 0 is Sunday
  const prefixDays = Array.from({ length: startDay }, (_, i) => {
    const date = new Date(monthStart);
    date.setDate(-i);
    return date;
  }).reverse();
  
  const endDay = 6 - monthEnd.getDay(); // 0-6, 6 is Saturday
  const suffixDays = Array.from({ length: endDay }, (_, i) => {
    const date = new Date(monthEnd);
    date.setDate(monthEnd.getDate() + i + 1);
    return date;
  });
  
  const allDays = [...prefixDays, ...days, ...suffixDays];
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setShowEventForm(true);
  };
  
  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setSelectedDate(event.start);
    setShowEventForm(true);
  };
  
  const handleCloseEventForm = () => {
    setShowEventForm(false);
    setSelectedEvent(null);
  };

  return (
    <div className="p-4">
      {/* Day headings */}
      <div className="calendar-grid mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="calendar-grid border rounded-md overflow-hidden bg-white">
        {allDays.map((date, index) => {
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isToday = isSameDay(date, new Date());
          
          // Filter events for this day
          const dayEvents = events.filter(event => 
            isSameDay(date, new Date(event.start))
          );
          
          return (
            <div 
              key={index}
              className={`calendar-day border p-1 h-24 ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}`}
              onClick={() => handleDateClick(date)}
            >
              <div className="w-full flex justify-between items-start">
                <span 
                  className={`
                    inline-flex items-center justify-center w-7 h-7 text-sm 
                    ${isToday ? 'calendar-day-current' : ''}
                  `}
                >
                  {format(date, 'd')}
                </span>
                {isToday && <div className="text-xs text-calendar-highlight font-medium">Today</div>}
              </div>
              
              <div className="w-full mt-1 overflow-hidden">
                {dayEvents.slice(0, 3).map((event) => (
                  <div 
                    key={event.id}
                    className={`calendar-event calendar-event-${event.category || 'default'}`}
                    onClick={(e) => handleEventClick(event, e)}
                  >
                    {format(new Date(event.start), 'h:mm a')} - {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 mt-1">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Event Form Dialog */}
      <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? "Edit Event" : "Add New Event"}
            </DialogTitle>
          </DialogHeader>
          <EventForm 
            event={selectedEvent} 
            selectedDate={selectedDate} 
            onSubmit={(event) => {
              if (selectedEvent) {
                onEditEvent(event);
              } else {
                onAddEvent(event);
              }
              handleCloseEventForm();
            }}
            onDelete={selectedEvent ? () => {
              onDeleteEvent(selectedEvent.id);
              handleCloseEventForm();
            } : undefined}
            onCancel={handleCloseEventForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarGrid;

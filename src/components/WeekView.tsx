
import React, { useState } from "react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { CalendarEvent } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EventForm from "./EventForm";

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  // Get the start of the week (Sunday)
  const weekStart = startOfWeek(currentDate);
  
  // Generate days of the week
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  // Time slots from 8am to 8pm
  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8);
  
  const handleTimeSlotClick = (day: Date, hour: number) => {
    const date = new Date(day);
    date.setHours(hour);
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
  
  const getEventsForDayAndHour = (day: Date, hour: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return isSameDay(day, eventDate) && eventDate.getHours() === hour;
    });
  };

  return (
    <div className="p-4">
      {/* Week days header */}
      <div className="grid grid-cols-8 border-b">
        <div className="text-center p-2 font-medium text-gray-500">
          Time
        </div>
        {weekDays.map((day, index) => {
          const isToday = isSameDay(day, new Date());
          return (
            <div
              key={index}
              className={`text-center p-2 ${isToday ? 'bg-blue-50 rounded-t-md' : ''}`}
            >
              <div className="font-medium">{format(day, 'EEE')}</div>
              <div className={`text-lg ${isToday ? 'text-calendar-highlight font-semibold' : ''}`}>
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Time slots */}
      <div className="overflow-auto max-h-[calc(100vh-240px)]">
        {timeSlots.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b">
            <div className="text-xs text-gray-500 p-2 text-right">
              {format(new Date().setHours(hour), 'h:mm a')}
            </div>
            
            {weekDays.map((day, dayIndex) => {
              const eventsForSlot = getEventsForDayAndHour(day, hour);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div
                  key={dayIndex}
                  className={`p-1 h-16 border-l cursor-pointer ${isToday ? 'bg-blue-50' : ''}`}
                  onClick={() => handleTimeSlotClick(day, hour)}
                >
                  {eventsForSlot.map((event) => (
                    <div
                      key={event.id}
                      className={`calendar-event calendar-event-${event.category || 'default'} animate-fade-in`}
                      onClick={(e) => handleEventClick(event, e)}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-xs">
                        {format(new Date(event.start), 'h:mm')} - {format(new Date(event.end), 'h:mm a')}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
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

export default WeekView;

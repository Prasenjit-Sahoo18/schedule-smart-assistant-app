
import React, { useState } from "react";
import { format, isSameDay } from "date-fns";
import { CalendarEvent } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EventForm from "./EventForm";

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}

const DayView: React.FC<DayViewProps> = ({
  currentDate,
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent
}) => {
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  // Filter events for the current day
  const dayEvents = events.filter(event => 
    isSameDay(currentDate, new Date(event.start))
  );
  
  // Time slots from 8am to 8pm
  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8);
  
  const handleTimeSlotClick = (hour: number) => {
    const date = new Date(currentDate);
    date.setHours(hour);
    setSelectedTime(date);
    setSelectedEvent(null);
    setShowEventForm(true);
  };
  
  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setSelectedTime(new Date(event.start));
    setShowEventForm(true);
  };
  
  const handleCloseEventForm = () => {
    setShowEventForm(false);
    setSelectedEvent(null);
  };
  
  const getEventsForHour = (hour: number) => {
    return dayEvents.filter(event => {
      const eventStart = new Date(event.start);
      return eventStart.getHours() === hour;
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        {format(currentDate, 'EEEE, MMMM d, yyyy')}
      </h2>
      
      {/* Time slots */}
      <div className="overflow-auto max-h-[calc(100vh-230px)]">
        {timeSlots.map((hour) => {
          const eventsForHour = getEventsForHour(hour);
          
          return (
            <div 
              key={hour} 
              className="grid grid-cols-[100px_1fr] border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => handleTimeSlotClick(hour)}
            >
              <div className="text-sm text-gray-500 p-3 text-right">
                {format(new Date().setHours(hour), 'h:mm a')}
              </div>
              
              <div className="p-2 min-h-[80px]">
                {eventsForHour.map((event) => (
                  <div 
                    key={event.id} 
                    className={`calendar-event calendar-event-${event.category || 'default'} animate-fade-in p-2`}
                    onClick={(e) => handleEventClick(event, e)}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-xs flex justify-between">
                      <span>
                        {format(new Date(event.start), 'h:mm')} - {format(new Date(event.end), 'h:mm a')}
                      </span>
                      {event.location && (
                        <span className="text-white/80">📍 {event.location}</span>
                      )}
                    </div>
                  </div>
                ))}
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
            selectedDate={selectedTime} 
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

export default DayView;

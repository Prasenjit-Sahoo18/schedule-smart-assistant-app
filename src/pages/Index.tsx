
import React, { useState } from 'react';
import { addMonths, addWeeks, addDays, subMonths, subWeeks, subDays } from 'date-fns';
import { CalendarViewType, CalendarEvent } from '@/types';
import Header from '@/components/Header';
import CalendarGrid from '@/components/CalendarGrid';
import WeekView from '@/components/WeekView';
import DayView from '@/components/DayView';
import AIAssistant from '@/components/AIAssistant';
import { sampleEvents } from '@/data/sampleEvents';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  // State
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<CalendarViewType>('month');
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Navigation handlers
  const goToPrevious = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (view === 'day') {
      setCurrentDate(subDays(currentDate, 1));
    }
  };
  
  const goToNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (view === 'day') {
      setCurrentDate(addDays(currentDate, 1));
    }
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Event handlers
  const handleAddEvent = (event: CalendarEvent) => {
    setEvents([...events, event]);
    toast({
      title: "Event Created",
      description: `${event.title} has been added to your calendar.`,
    });
  };
  
  const handleEditEvent = (updatedEvent: CalendarEvent) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
    toast({
      title: "Event Updated",
      description: `${updatedEvent.title} has been updated.`,
    });
  };
  
  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
    toast({
      title: "Event Deleted",
      description: "The event has been removed from your calendar.",
      variant: "destructive",
    });
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header 
          currentDate={currentDate}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onToday={goToToday}
          view={view}
          onViewChange={setView}
          onToggleAIAssistant={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
          isAIAssistantOpen={isAIAssistantOpen}
        />
        
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto">
            {view === 'month' && (
              <CalendarGrid 
                currentDate={currentDate}
                events={events}
                onAddEvent={handleAddEvent}
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            )}
            {view === 'week' && (
              <WeekView 
                currentDate={currentDate}
                events={events}
                onAddEvent={handleAddEvent}
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            )}
            {view === 'day' && (
              <DayView 
                currentDate={currentDate}
                events={events}
                onAddEvent={handleAddEvent}
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            )}
          </div>
          
          {isAIAssistantOpen && (
            <div className="w-80 border-l bg-white">
              <AIAssistant 
                events={events}
                onCreateEvent={handleAddEvent}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;

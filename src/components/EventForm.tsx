
import React, { useState, useEffect } from "react";
import { CalendarEvent } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EventFormProps {
  event: CalendarEvent | null;
  selectedDate: Date | null;
  onSubmit: (event: CalendarEvent) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({
  event,
  selectedDate,
  onSubmit,
  onDelete,
  onCancel
}) => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState("12:00");
  const [endTime, setEndTime] = useState("13:00");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("default");
  const [location, setLocation] = useState("");
  
  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setStartDate(new Date(event.start));
      setEndDate(new Date(event.end));
      setStartTime(format(new Date(event.start), 'HH:mm'));
      setEndTime(format(new Date(event.end), 'HH:mm'));
      setDescription(event.description || "");
      setCategory(event.category || "default");
      setLocation(event.location || "");
    } else if (selectedDate) {
      setStartDate(selectedDate);
      setEndDate(selectedDate);
      // Default to current time rounded to nearest hour
      const now = new Date();
      now.setMinutes(0, 0, 0);
      setStartTime(format(now, 'HH:mm'));
      now.setHours(now.getHours() + 1);
      setEndTime(format(now, 'HH:mm'));
    }
  }, [event, selectedDate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !startDate || !endDate) return;
    
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    
    const start = new Date(startDate);
    start.setHours(startHour, startMinute, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(endHour, endMinute, 0, 0);
    
    const newEvent: CalendarEvent = {
      id: event?.id || crypto.randomUUID(),
      title,
      start,
      end,
      description,
      category: category as any,
      location
    };
    
    onSubmit(newEvent);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Event Title*
          </label>
          <Input
            id="title"
            type="text"
            placeholder="Add title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date*
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto">
                <Calendar
                  mode="single"
                  selected={startDate || undefined}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
              Start Time*
            </label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date*
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto">
                <Calendar
                  mode="single"
                  selected={endDate || undefined}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => 
                    startDate ? date < startDate : false
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
              End Time*
            </label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="important">Important</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <Input
            id="location"
            type="text"
            placeholder="Add location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Textarea
            id="description"
            placeholder="Add description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        {onDelete && (
          <Button 
            type="button" 
            variant="destructive"
            onClick={onDelete}
            className="mr-auto"
          >
            Delete
          </Button>
        )}
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {event ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;

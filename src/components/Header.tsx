
import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarViewType } from "@/types";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  LayoutGrid, 
  LayoutList, 
  LayoutPanelTop
} from "lucide-react";

interface HeaderProps {
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  view: CalendarViewType;
  onViewChange: (view: CalendarViewType) => void;
  onToggleAIAssistant: () => void;
  isAIAssistantOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({
  currentDate,
  onPrevious,
  onNext,
  onToday,
  view,
  onViewChange,
  onToggleAIAssistant,
  isAIAssistantOpen
}) => {
  // Format the current date based on the view
  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'long', 
      year: 'numeric'
    };
    
    if (view === 'week') {
      // For week view, show the date range
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      const startMonth = startOfWeek.toLocaleDateString('default', { month: 'short' });
      const endMonth = endOfWeek.toLocaleDateString('default', { month: 'short' });
      
      if (startMonth === endMonth) {
        return `${startMonth} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
      } else {
        return `${startMonth} ${startOfWeek.getDate()} - ${endMonth} ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
      }
    } else if (view === 'day') {
      // For day view, show the specific date
      options.weekday = 'long';
      options.day = 'numeric';
      return currentDate.toLocaleDateString('default', options);
    }
    
    // For month view, show month and year
    return currentDate.toLocaleDateString('default', options);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-2 mb-4 md:mb-0">
        <CalendarIcon className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>
      </div>
      
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center border rounded-md overflow-hidden">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onViewChange('month')}
            className={`rounded-none ${view === 'month' ? 'bg-primary text-primary-foreground' : ''}`}
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            Month
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onViewChange('week')}
            className={`rounded-none ${view === 'week' ? 'bg-primary text-primary-foreground' : ''}`}
          >
            <LayoutList className="h-4 w-4 mr-1" />
            Week
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onViewChange('day')}
            className={`rounded-none ${view === 'day' ? 'bg-primary text-primary-foreground' : ''}`}
          >
            <LayoutPanelTop className="h-4 w-4 mr-1" />
            Day
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={onNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="font-medium text-lg ml-2">{formatDate()}</div>
        
        <Button 
          variant={isAIAssistantOpen ? "default" : "outline"} 
          size="sm" 
          onClick={onToggleAIAssistant}
          className="ml-auto"
        >
          AI Assistant
        </Button>
      </div>
    </div>
  );
};

export default Header;

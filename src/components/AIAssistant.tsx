
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { AIAssistantMessage, CalendarEvent } from "@/types";

interface AIAssistantProps {
  events: CalendarEvent[];
  onCreateEvent: (event: CalendarEvent) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ events, onCreateEvent }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AIAssistantMessage[]>([
    {
      id: "welcome",
      content: "Hello! I'm your AI calendar assistant. How can I help you manage your schedule today?",
      timestamp: new Date(),
      isUser: false
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to the bottom of the messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: AIAssistantMessage = {
      id: crypto.randomUUID(),
      content: input,
      timestamp: new Date(),
      isUser: true
    };
    
    setMessages([...messages, userMessage]);
    setInput("");
    
    // Process the user's message and generate a response
    setTimeout(() => {
      const response = processUserMessage(input, events);
      
      const assistantMessage: AIAssistantMessage = {
        id: crypto.randomUUID(),
        content: response.message,
        timestamp: new Date(),
        isUser: false
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // If the AI suggests creating an event
      if (response.suggestedEvent) {
        onCreateEvent(response.suggestedEvent);
      }
    }, 1000);
  };
  
  // Process user message and generate a response
  const processUserMessage = (message: string, events: CalendarEvent[]) => {
    const lowerMessage = message.toLowerCase();
    
    // Check for common queries
    if (lowerMessage.includes("schedule") || lowerMessage.includes("create") || lowerMessage.includes("add event")) {
      // Extract potential event details from message
      let title = "";
      let date = new Date();
      let startTime = new Date();
      startTime.setHours(12, 0, 0, 0);
      let endTime = new Date();
      endTime.setHours(13, 0, 0, 0);
      
      // Very basic NLP to extract title (anything after "add" or "schedule")
      if (lowerMessage.includes("meeting")) title = "Meeting";
      else if (lowerMessage.includes("appointment")) title = "Appointment";
      else if (lowerMessage.includes("call")) title = "Call";
      else title = "New Event";
      
      // Create a suggested event
      const suggestedEvent: CalendarEvent = {
        id: crypto.randomUUID(),
        title,
        start: startTime,
        end: endTime,
        description: "Created by AI Assistant",
        category: "default"
      };
      
      return {
        message: `I've created a new event titled "${title}" for today at 12:00 PM. You can edit the details as needed.`,
        suggestedEvent
      };
    } else if (lowerMessage.includes("event") && lowerMessage.includes("today")) {
      // Check for today's events
      const today = new Date();
      const todayEvents = events.filter(event => 
        isSameDay(today, new Date(event.start))
      );
      
      if (todayEvents.length === 0) {
        return {
          message: "You don't have any events scheduled for today.",
          suggestedEvent: null
        };
      } else {
        const eventList = todayEvents
          .map(event => `- ${event.title} at ${format(new Date(event.start), 'h:mm a')}`)
          .join('\n');
        
        return {
          message: `You have ${todayEvents.length} event(s) today:\n${eventList}`,
          suggestedEvent: null
        };
      }
    } else if (lowerMessage.includes("help")) {
      return {
        message: "I can help you manage your calendar! Try asking me things like:\n- Schedule a meeting\n- What events do I have today?\n- Help me organize my day\n- Create a new appointment",
        suggestedEvent: null
      };
    } else {
      return {
        message: "I'm here to help with your calendar. You can ask me to schedule events, check your availability, or help organize your day.",
        suggestedEvent: null
      };
    }
  };
  
  // Helper function to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  };
  
  // Helper function to format dates
  const format = (date: Date, formatStr: string) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour = hours % 12 || 12;
    
    if (formatStr === 'h:mm a') {
      return `${hour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }
    
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">AI Calendar Assistant</h2>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.isUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="whitespace-pre-line">{message.content}</div>
                <div
                  className={`text-xs mt-1 ${
                    message.isUser ? 'text-primary-foreground/70' : 'text-gray-500'
                  }`}
                >
                  {format(message.timestamp, 'h:mm a')}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event, EventContextType } from '../types';
import { eventService } from '../services/eventService';

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};

interface EventProviderProps {
  children: React.ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [popularEvents, setPopularEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [liveEvents, setLiveEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [allEvents, popular, upcoming, live] = await Promise.all([
        eventService.getAllEvents(),
        eventService.getPopularEvents(),
        eventService.getUpcomingEvents(),
        eventService.getLiveEvents(),
      ]);

      setEvents(allEvents);
      setPopularEvents(popular);
      setUpcomingEvents(upcoming);
      setLiveEvents(live);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const searchEvents = async (query: string, location?: string): Promise<Event[]> => {
    try {
      setError(null);
      return await eventService.searchEvents(query, location);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search events');
      return [];
    }
  };

  const addEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const newEvent = await eventService.createEvent(eventData);
      setEvents(prev => [...prev, newEvent]);
      
      // Update filtered lists
      if (newEvent.isPopular) {
        setPopularEvents(prev => [...prev, newEvent]);
      }
      if (newEvent.status === 'upcoming') {
        setUpcomingEvents(prev => [...prev, newEvent]);
      }
      if (newEvent.status === 'live') {
        setLiveEvents(prev => [...prev, newEvent]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (id: string, eventData: Partial<Event>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedEvent = await eventService.updateEvent(id, eventData);
      
      setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event));
      setPopularEvents(prev => prev.map(event => event.id === id ? updatedEvent : event));
      setUpcomingEvents(prev => prev.map(event => event.id === id ? updatedEvent : event));
      setLiveEvents(prev => prev.map(event => event.id === id ? updatedEvent : event));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await eventService.deleteEvent(id);
      
      setEvents(prev => prev.filter(event => event.id !== id));
      setPopularEvents(prev => prev.filter(event => event.id !== id));
      setUpcomingEvents(prev => prev.filter(event => event.id !== id));
      setLiveEvents(prev => prev.filter(event => event.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const value: EventContextType = {
    events,
    popularEvents,
    upcomingEvents,
    liveEvents,
    loading,
    error,
    searchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    fetchEvents,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};
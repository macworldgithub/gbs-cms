// import React, { createContext, useContext, useState, useEffect } from "react";
// import { Event, EventContextType } from "../types";
// import { eventService } from "../services/eventService";
// import { AUTH_TOKEN } from "../utils/config/server";

// const EventContext = createContext<EventContextType | undefined>(undefined);

// export const useEvent = () => {
//   const context = useContext(EventContext);
//   if (!context) {
//     throw new Error("useEvent must be used within an EventProvider");
//   }
//   return context;
// };

// interface EventProviderProps {
//   children: React.ReactNode;
// }

// export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [popularEvents, setPopularEvents] = useState<Event[]>([]);
//   const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
//   const [liveEvents, setLiveEvents] = useState<Event[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const token = localStorage.getItem("token") || "";

//   const fetchEvents = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const [allEvents, popular, upcoming, live] = await Promise.all([
//         eventService.getAllEvents(),
//         eventService.getPopularEvents(),
//         eventService.getUpcomingEvents(),
//         eventService.getLiveEvents(),
//       ]);

//       setEvents(allEvents);
//       setPopularEvents(popular);
//       setUpcomingEvents(upcoming);
//       setLiveEvents(live);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to fetch events");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const searchEvents = async (
//     query: string,
//     location?: string
//   ): Promise<Event[]> => {
//     try {
//       setError(null);
//       return await eventService.searchEvents(query, location);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to search events");
//       return [];
//     }
//   };

//   const addEvent = async (
//     eventData: Omit<Event, "id" | "createdAt" | "updatedAt">
//   ) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const newEvent = await eventService.createEvent(eventData);
//       setEvents((prev) => [...prev, newEvent]);

//       // Update filtered lists
//       if (newEvent.isPopular) {
//         setPopularEvents((prev) => [...prev, newEvent]);
//       }
//       if (newEvent.status === "upcoming") {
//         setUpcomingEvents((prev) => [...prev, newEvent]);
//       }
//       if (newEvent.status === "live") {
//         setLiveEvents((prev) => [...prev, newEvent]);
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to add event");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const addEvent = async (
//   //   eventData: Omit<Event, "id" | "createdAt" | "updatedAt">
//   // ) => {
//   //   try {
//   //     setLoading(true);
//   //     setError(null);

//   //     const response = await fetch(
//   //       "https://gbs.westsidecarcare.com.au/events",
//   //       {
//   //         method: "POST",
//   //         headers: {
//   //           Accept: "application/json",
//   //           "Content-Type": "application/json",
//   //           Authorization: `Bearer ${token}`,
//   //         },
//   //         body: JSON.stringify(eventData),
//   //       }
//   //     );

//   //     if (!response.ok) {
//   //       throw new Error("Failed to create event");
//   //     }

//   //     const newEvent = await response.json();

//   //     setEvents((prev) => [...prev, newEvent]);

//   //     // Update filtered lists
//   //     if (newEvent.isPopular) {
//   //       setPopularEvents((prev) => [...prev, newEvent]);
//   //     }
//   //     if (newEvent.status === "upcoming") {
//   //       setUpcomingEvents((prev) => [...prev, newEvent]);
//   //     }
//   //     if (newEvent.status === "live") {
//   //       setLiveEvents((prev) => [...prev, newEvent]);
//   //     }
//   //   } catch (err) {
//   //     setError(err instanceof Error ? err.message : "Failed to add event");
//   //     throw err;
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const updateEvent = async (id: string, eventData: Partial<Event>) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const updatedEvent = await eventService.updateEvent(
//         id,
//         eventData,
//         AUTH_TOKEN
//       );

//       setEvents((prev) =>
//         prev.map((event) => (event.id === id ? updatedEvent : event))
//       );
//       setPopularEvents((prev) =>
//         prev.map((event) => (event.id === id ? updatedEvent : event))
//       );
//       setUpcomingEvents((prev) =>
//         prev.map((event) => (event.id === id ? updatedEvent : event))
//       );
//       setLiveEvents((prev) =>
//         prev.map((event) => (event.id === id ? updatedEvent : event))
//       );
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to update event");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteEvent = async (id: string) => {
//     try {
//       setLoading(true);
//       setError(null);
//       await eventService.deleteEvent(id, AUTH_TOKEN);

//       setEvents((prev) => prev.filter((event) => event.id !== id));
//       setPopularEvents((prev) => prev.filter((event) => event.id !== id));
//       setUpcomingEvents((prev) => prev.filter((event) => event.id !== id));
//       setLiveEvents((prev) => prev.filter((event) => event.id !== id));
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to delete event");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const value: EventContextType = {
//     events,
//     popularEvents,
//     upcomingEvents,
//     liveEvents,
//     loading,
//     error,
//     searchEvents,
//     addEvent,
//     updateEvent,
//     deleteEvent,
//     fetchEvents,
//   };

//   return (
//     <EventContext.Provider value={value}>{children}</EventContext.Provider>
//   );
// };

import React, { createContext, useContext, useState, useEffect } from "react";
import { Event, EventContextType } from "../types";
import { eventService } from "../services/eventService";
import { AUTH_TOKEN } from "../utils/config/server";
const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvent must be used within an EventProvider");
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

  const token = AUTH_TOKEN;

  const fetchEvents = async (state?: string) => {
    try {
      setLoading(true);
      setError(null);

      const { events: allEvents, total } = await eventService.getAllEvents(
        state
      );
      const featured = await eventService.getFeaturedEvents(state);

      const now = new Date();
      const upcoming = allEvents.filter((event) => event.startDate > now);
      const live = allEvents.filter(
        (event) => event.startDate <= now && event.endDate >= now
      );

      setEvents(allEvents);
      setPopularEvents(featured);
      setUpcomingEvents(upcoming);
      setLiveEvents(live);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const searchEvents = async (
    query: string,
    state?: string
  ): Promise<Event[]> => {
    try {
      setError(null);
      return await eventService.searchEvents(query, state);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search events");
      return [];
    }
  };

  const addEvent = async (
    eventData: Omit<Event, "id" | "createdAt" | "updatedAt">,
    file?: File | null
  ) => {
    try {
      setLoading(true);
      setError(null);
      const newEvent = await eventService.createEvent(eventData, token);

      if (file) {
        const { url, key } = await eventService.getImageUploadUrl(
          newEvent.id,
          file.name,
          file.type,
          token
        );
        await fetch(url, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });
        await eventService.updateEventImage(newEvent.id, key, token);
        newEvent.image = (await eventService.getEventImageUrl(newEvent.id)).url;
      }

      setEvents((prev) => [...prev, newEvent]);
      if (newEvent.isPopular) setPopularEvents((prev) => [...prev, newEvent]);
      if (newEvent.status === "upcoming")
        setUpcomingEvents((prev) => [...prev, newEvent]);
      if (newEvent.status === "live")
        setLiveEvents((prev) => [...prev, newEvent]);
      alert("Event created successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add event");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (
    id: string,
    eventData: Partial<Event>,
    file?: File | null
  ) => {
    try {
      setLoading(true);
      setError(null);
      const updatedEvent = await eventService.updateEvent(id, eventData, token);

      if (file) {
        const { url, key } = await eventService.getImageUploadUrl(
          id,
          file.name,
          file.type,
          token
        );
        await fetch(url, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });
        await eventService.updateEventImage(id, key, token);
        updatedEvent.image = (await eventService.getEventImageUrl(id)).url;
      }

      setEvents((prev) => prev.map((e) => (e.id === id ? updatedEvent : e)));
      setPopularEvents((prev) =>
        prev.map((e) => (e.id === id ? updatedEvent : e))
      );
      setUpcomingEvents((prev) =>
        prev.map((e) => (e.id === id ? updatedEvent : e))
      );
      setLiveEvents((prev) =>
        prev.map((e) => (e.id === id ? updatedEvent : e))
      );
      alert("Event updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update event");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await eventService.deleteEvent(id, token);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setPopularEvents((prev) => prev.filter((e) => e.id !== id));
      setUpcomingEvents((prev) => prev.filter((e) => e.id !== id));
      setLiveEvents((prev) => prev.filter((e) => e.id !== id));
      alert("Event deleted successfully!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete event";
      setError(message);
      alert(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const bookEvent = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const booked = await eventService.bookEvent(id, token);
      setEvents((prev) => prev.map((e) => (e.id === id ? booked : e)));
      alert("Event booked successfully!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to book event";
      setError(message);
      alert(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      setLoading(true);
      setError(null);
      const toggled = await eventService.toggleFeatured(id, isFeatured, token);
      setEvents((prev) => prev.map((e) => (e.id === id ? toggled : e)));
      setPopularEvents((prev) =>
        isFeatured ? [...prev, toggled] : prev.filter((e) => e.id !== id)
      );
      alert(`Event ${isFeatured ? "featured" : "unfeatured"} successfully!`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to toggle featured"
      );
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
    bookEvent,
    toggleFeatured,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
};

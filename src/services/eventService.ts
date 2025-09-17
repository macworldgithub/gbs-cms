// import { Event, EventCategory, EventStatus, Location } from '../types';

// class EventService {
//   private events: Event[] = [
//     {
//       id: '1',
//       title: 'Tech Conference 2024',
//       description: 'Annual technology conference featuring the latest innovations',
//       image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=400',
//       category: 'technology',
//       status: 'upcoming',
//       startDate: new Date('2024-03-15T09:00:00'),
//       endDate: new Date('2024-03-15T18:00:00'),
//       location: {
//         id: '1',
//         name: 'Convention Center',
//         address: '123 Tech Street',
//         city: 'San Francisco',
//         country: 'USA',
//         coordinates: { lat: 37.7749, lng: -122.4194 }
//       },
//       organizer: { id: '1' } as any,
//       attendees: [],
//       maxAttendees: 500,
//       price: 299,
//       tags: ['technology', 'innovation', 'networking'],
//       isPopular: true,
//       isLive: false,
//       createdAt: new Date('2024-01-01'),
//       updatedAt: new Date('2024-01-01'),
//     },
//     {
//       id: '2',
//       title: 'Live Music Festival',
//       description: 'Three-day music festival with top artists',
//       image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
//       category: 'music',
//       status: 'live',
//       startDate: new Date(),
//       endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//       location: {
//         id: '2',
//         name: 'Central Park',
//         address: 'Central Park West',
//         city: 'New York',
//         country: 'USA',
//         coordinates: { lat: 40.7829, lng: -73.9654 }
//       },
//       organizer: { id: '2' } as any,
//       attendees: [],
//       maxAttendees: 10000,
//       price: 150,
//       tags: ['music', 'festival', 'live'],
//       isPopular: true,
//       isLive: true,
//       createdAt: new Date('2024-01-02'),
//       updatedAt: new Date('2024-01-02'),
//     },
//     {
//       id: '3',
//       title: 'Food & Wine Expo',
//       description: 'Culinary experience with renowned chefs',
//       image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400',
//       category: 'food',
//       status: 'upcoming',
//       startDate: new Date('2024-04-20T11:00:00'),
//       endDate: new Date('2024-04-20T20:00:00'),
//       location: {
//         id: '3',
//         name: 'Grand Hotel',
//         address: '456 Culinary Ave',
//         city: 'Los Angeles',
//         country: 'USA',
//         coordinates: { lat: 34.0522, lng: -118.2437 }
//       },
//       organizer: { id: '1' } as any,
//       attendees: [],
//       maxAttendees: 200,
//       price: 75,
//       tags: ['food', 'wine', 'culinary'],
//       isPopular: false,
//       isLive: false,
//       createdAt: new Date('2024-01-03'),
//       updatedAt: new Date('2024-01-03'),
//     },
//   ];

//   async getAllEvents(): Promise<Event[]> {
//     await new Promise(resolve => setTimeout(resolve, 400));
//     return this.events;
//   }

//   async getPopularEvents(): Promise<Event[]> {
//     await new Promise(resolve => setTimeout(resolve, 300));
//     return this.events.filter(event => event.isPopular);
//   }

//   async getUpcomingEvents(): Promise<Event[]> {
//     await new Promise(resolve => setTimeout(resolve, 300));
//     return this.events.filter(event => event.status === 'upcoming');
//   }

//   async getLiveEvents(): Promise<Event[]> {
//     await new Promise(resolve => setTimeout(resolve, 300));
//     return this.events.filter(event => event.status === 'live');
//   }

//   async searchEvents(query: string, location?: string): Promise<Event[]> {
//     await new Promise(resolve => setTimeout(resolve, 400));

//     const lowercaseQuery = query.toLowerCase();
//     return this.events.filter(event => {
//       const matchesQuery = event.title.toLowerCase().includes(lowercaseQuery) ||
//                           event.description.toLowerCase().includes(lowercaseQuery) ||
//                           event.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery));

//       const matchesLocation = !location ||
//                              event.location.city.toLowerCase().includes(location.toLowerCase()) ||
//                              event.location.country.toLowerCase().includes(location.toLowerCase());

//       return matchesQuery && matchesLocation;
//     });
//   }

//   async createEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
//     await new Promise(resolve => setTimeout(resolve, 500));

//     const newEvent: Event = {
//       id: Date.now().toString(),
//       ...eventData,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     this.events.push(newEvent);
//     return newEvent;
//   }

//   async updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
//     await new Promise(resolve => setTimeout(resolve, 400));

//     const index = this.events.findIndex(event => event.id === id);
//     if (index === -1) {
//       throw new Error('Event not found');
//     }

//     this.events[index] = {
//       ...this.events[index],
//       ...eventData,
//       updatedAt: new Date(),
//     };

//     return this.events[index];
//   }

//   async deleteEvent(id: string): Promise<void> {
//     await new Promise(resolve => setTimeout(resolve, 300));

//     const index = this.events.findIndex(event => event.id === id);
//     if (index === -1) {
//       throw new Error('Event not found');
//     }

//     this.events.splice(index, 1);
//   }

//   async getEventsByCategory(category: EventCategory): Promise<Event[]> {
//     await new Promise(resolve => setTimeout(resolve, 300));
//     return this.events.filter(event => event.category === category);
//   }

//   async getEventsByLocation(city: string): Promise<Event[]> {
//     await new Promise(resolve => setTimeout(resolve, 300));
//     return this.events.filter(event =>
//       event.location.city.toLowerCase() === city.toLowerCase()
//     );
//   }
// }

// export const eventService = new EventService();

// import { Event, EventCategory, EventStatus, Location } from "../types";

// const API_BASE_URL = "https://gbs.westsidecarcare.com.au";

// class EventService {
//   async getAllEvents(
//     state?: string,
//     page?: number,
//     limit?: number
//   ): Promise<Event[]> {
//     const params = new URLSearchParams();
//     if (state) params.append("state", state);
//     if (page) params.append("page", page.toString());
//     if (limit) params.append("limit", limit.toString());

//     const response = await fetch(`${API_BASE_URL}/events?${params.toString()}`);
//     const data = await response.json();

//     // Map API response to your Event type
//     return data.map((e: any) => ({
//       id: e._id,
//       title: e.title,
//       description: e.description,
//       image: e.imageUrl || "",
//       category: e.category || "",
//       status: "", // If available in API, map it
//       startDate: new Date(e.startDate),
//       endDate: new Date(e.endDate),
//       location: {
//         id: "",
//         name: e.locationNames?.[0] || "",
//         address: "",
//         city: e.locationNames?.[0]?.split(",")[0] || "",
//         country: e.locationNames?.[0]?.split(",")[1]?.trim() || "",
//         coordinates: {
//           lat: e.area?.coordinates?.[0]?.[0]?.[0]?.[0] || 0,
//           lng: e.area?.coordinates?.[0]?.[0]?.[0]?.[1] || 0,
//         },
//       },
//       organizer: e.creator
//         ? {
//             id: e.creator._id,
//             name: e.creator.name,
//             avatar: e.creator.avatarUrl,
//           }
//         : {},
//       attendees: e.attendees || [],
//       maxAttendees: 0,
//       price: 0,
//       tags: [],
//       isPopular: e.isFeatured || false,
//       isLive: false,
//       createdAt: new Date(e.createdAt),
//       updatedAt: new Date(e.updatedAt),
//     }));
//   }

//   // Example: Get popular events (filter after fetching)
//   async getPopularEvents(): Promise<Event[]> {
//     const events = await this.getAllEvents();
//     return events.filter((event) => event.isPopular);
//   }

//   async getUpcomingEvents(): Promise<Event[]> {
//     const events = await this.getAllEvents();
//     const now = new Date();
//     return events.filter((event) => event.startDate > now);
//   }

//   async getLiveEvents(): Promise<Event[]> {
//     const events = await this.getAllEvents();
//     return events.filter((event) => event.isLive);
//   }

//   async searchEvents(query: string, location?: string): Promise<Event[]> {
//     const events = await this.getAllEvents();
//     const lowercaseQuery = query.toLowerCase();
//     return events.filter((event) => {
//       const matchesQuery =
//         event.title.toLowerCase().includes(lowercaseQuery) ||
//         event.description.toLowerCase().includes(lowercaseQuery);

//       const matchesLocation =
//         !location ||
//         event.location.city.toLowerCase().includes(location.toLowerCase()) ||
//         event.location.country.toLowerCase().includes(location.toLowerCase());

//       return matchesQuery && matchesLocation;
//     });
//   }

// }

// export const eventService = new EventService();

// import { Event } from "../types";

// const API_BASE_URL = "https://gbs.westsidecarcare.com.au";

// class EventService {
//   async getAllEvents(
//     state?: string,
//     page?: number,
//     limit?: number
//   ): Promise<Event[]> {
//     const params = new URLSearchParams();
//     if (state) params.append("state", state);
//     if (page) params.append("page", page.toString());
//     if (limit) params.append("limit", limit.toString());

//     const response = await fetch(`${API_BASE_URL}/events?${params.toString()}`);
//     const data = await response.json();

//     return data.map((e: any) => ({
//       id: e._id,
//       title: e.title,
//       description: e.description,
//       image: e.imageUrl || "",
//       category: e.category || "",
//       status: "",
//       startDate: new Date(e.startDate),
//       endDate: new Date(e.endDate),
//       location: {
//         id: "",
//         name: e.locationNames?.[0] || "",
//         address: "",
//         city: e.locationNames?.[0]?.split(",")[0] || "",
//         country: e.locationNames?.[0]?.split(",")[1]?.trim() || "",
//         coordinates: {
//           lat: e.area?.coordinates?.[0]?.[0]?.[0]?.[0] || 0,
//           lng: e.area?.coordinates?.[0]?.[0]?.[0]?.[1] || 0,
//         },
//       },
//       organizer: e.creator
//         ? {
//             id: e.creator._id,
//             name: e.creator.name,
//             avatar: e.creator.avatarUrl,
//           }
//         : {},
//       attendees: e.attendees || [],
//       maxAttendees: 0,
//       price: 0,
//       tags: [],
//       isPopular: e.isFeatured || false,
//       isLive: false,
//       createdAt: new Date(e.createdAt),
//       updatedAt: new Date(e.updatedAt),
//     }));
//   }

//   async getPopularEvents(): Promise<Event[]> {
//     const events = await this.getAllEvents();
//     return events.filter((event) => event.isPopular);
//   }

//   async getUpcomingEvents(): Promise<Event[]> {
//     const events = await this.getAllEvents();
//     const now = new Date();
//     return events.filter((event) => event.startDate > now);
//   }

//   async getLiveEvents(): Promise<Event[]> {
//     const events = await this.getAllEvents();
//     return events.filter((event) => event.isLive);
//   }

//   async searchEvents(query: string, location?: string): Promise<Event[]> {
//     const events = await this.getAllEvents();
//     const lowercaseQuery = query.toLowerCase();
//     return events.filter((event) => {
//       const matchesQuery =
//         event.title.toLowerCase().includes(lowercaseQuery) ||
//         event.description.toLowerCase().includes(lowercaseQuery);

//       const matchesLocation =
//         !location ||
//         event.location.city.toLowerCase().includes(location.toLowerCase()) ||
//         event.location.country.toLowerCase().includes(location.toLowerCase());

//       return matchesQuery && matchesLocation;
//     });
//   }

//   // 🔹 Update Event
//   async updateEvent(
//     id: string,
//     data: Partial<Event>,
//     token: string
//   ): Promise<Event> {
//     const response = await fetch(`${API_BASE_URL}/events/${id}`, {
//       method: "PUT",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       const err = await response.json();
//       throw new Error(err.message || "Update failed");
//     }

//     return await response.json();
//   }

//   // 🔹 Delete Event
//   async deleteEvent(id: string, token: string): Promise<void> {
//     const response = await fetch(`${API_BASE_URL}/events/${id}`, {
//       method: "DELETE",
//       headers: {
//         Accept: "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       const err = await response.json();
//       throw new Error(err.message || "Delete failed");
//     }
//   }
// }

// export const eventService = new EventService();

import { Event } from "../types";

const API_BASE_URL = "https://gbs.westsidecarcare.com.au";

class EventService {
  // 🔹 Get All Events
  async getAllEvents(
    state?: string,
    page?: number,
    limit?: number
  ): Promise<Event[]> {
    const params = new URLSearchParams();
    if (state) params.append("state", state);
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());

    const response = await fetch(`${API_BASE_URL}/events?${params.toString()}`);
    const data = await response.json();

    return data.map((e: any) => ({
      id: e._id,
      title: e.title,
      description: e.description,
      image: e.imageUrl || "",
      category: e.category || "",
      status: "",
      startDate: new Date(e.startDate),
      endDate: new Date(e.endDate),
      location: {
        id: "",
        name: e.locationNames?.[0] || "",
        address: "",
        city: e.locationNames?.[0]?.split(",")[0] || "",
        country: e.locationNames?.[0]?.split(",")[1]?.trim() || "",
        coordinates: {
          lat: e.area?.coordinates?.[0]?.[0]?.[0]?.[0] || 0,
          lng: e.area?.coordinates?.[0]?.[0]?.[0]?.[1] || 0,
        },
      },
      organizer: e.creator
        ? {
            id: e.creator._id,
            name: e.creator.name,
            avatar: e.creator.avatarUrl,
          }
        : {},
      attendees: e.attendees || [],
      maxAttendees: 0,
      price: 0,
      tags: [],
      isPopular: e.isFeatured || false,
      isLive: false,
      createdAt: new Date(e.createdAt),
      updatedAt: new Date(e.updatedAt),
    }));
  }

  // 🔹 Popular Events
  async getPopularEvents(): Promise<Event[]> {
    const events = await this.getAllEvents();
    return events.filter((event) => event.isPopular);
  }

  // 🔹 Upcoming Events
  async getUpcomingEvents(): Promise<Event[]> {
    const events = await this.getAllEvents();
    const now = new Date();
    return events.filter((event) => event.startDate > now);
  }

  // 🔹 Live Events
  async getLiveEvents(): Promise<Event[]> {
    const events = await this.getAllEvents();
    return events.filter((event) => event.isLive);
  }

  // 🔹 Search Events
  async searchEvents(query: string, location?: string): Promise<Event[]> {
    const events = await this.getAllEvents();
    const lowercaseQuery = query.toLowerCase();
    return events.filter((event) => {
      const matchesQuery =
        event.title.toLowerCase().includes(lowercaseQuery) ||
        event.description.toLowerCase().includes(lowercaseQuery);

      const matchesLocation =
        !location ||
        event.location.city.toLowerCase().includes(location.toLowerCase()) ||
        event.location.country.toLowerCase().includes(location.toLowerCase());

      return matchesQuery && matchesLocation;
    });
  }

  // 🔹 Update Event
  async updateEvent(
    id: string,
    data: Partial<Event>,
    token: string
  ): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json();
      alert(err.message || "Update failed");
      throw new Error(err.message || "Update failed");
    }

    return await response.json();
  }

  // 🔹 Delete Event (with alert handling)
  async deleteEvent(id: string, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json();

      if (err.message === "Only the event creator can delete this event") {
        alert("❌ Only the event creator can delete this event");
      } else {
        alert(err.message || "Delete failed");
      }

      throw new Error(err.message || "Delete failed");
    }

    alert("✅ Event deleted successfully!");
  }
}

export const eventService = new EventService();


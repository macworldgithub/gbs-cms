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

// import { Event } from "../types";

// const API_BASE_URL = "https://gbs.westsidecarcare.com.au";

// class EventService {
//   // 🔹 Get All Events
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

//   // 🔹 Popular Events
//   async getPopularEvents(): Promise<Event[]> {
//     const events = await this.getAllEvents();
//     return events.filter((event) => event.isPopular);
//   }

//   // 🔹 Upcoming Events
//   async getUpcomingEvents(): Promise<Event[]> {
//     const events = await this.getAllEvents();
//     const now = new Date();
//     return events.filter((event) => event.startDate > now);
//   }

//   // 🔹 Live Events
//   async getLiveEvents(): Promise<Event[]> {
//     const events = await this.getAllEvents();
//     return events.filter((event) => event.isLive);
//   }

//   // 🔹 Search Events
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
//       alert(err.message || "Update failed");
//       throw new Error(err.message || "Update failed");
//     }

//     return await response.json();
//   }

//   // 🔹 Delete Event (with alert handling)
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

//       if (err.message === "Only the event creator can delete this event") {
//         alert("❌ Only the event creator can delete this event");
//       } else {
//         alert(err.message || "Delete failed");
//       }

//       throw new Error(err.message || "Delete failed");
//     }

//     alert("✅ Event deleted successfully!");
//   }
// }

// export const eventService = new EventService();

import { Event, EventStatus, UserPreferences, Role } from "../types";

const API_BASE_URL = "https://gbs.westsidecarcare.com.au";

interface RoleResponse {
  _id: string;
  name: string;
  label: string;
  permissions: { permission: string }[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class EventService {
  private mapToEvent(e: any): Event {
    const now = new Date();
    let status: EventStatus = "upcoming";
    if (new Date(e.endDate) < now) status = "completed";
    else if (new Date(e.startDate) <= now && new Date(e.endDate) >= now)
      status = "live";

    const defaultPreferences: UserPreferences = {
      notifications: true,
      darkMode: false,
      language: "en",
      privacy: {
        profileVisibility: "public",
        showEmail: false,
        showPhone: false,
        allowMessages: true,
      },
    };

    const defaultRole: Role = {
      id: "",
      name: "",
      description: "",
      permissions: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return {
      id: e._id,
      title: e.title,
      description: e.description || "",
      image: e.imageUrl || "",
      category: "other",
      status,
      startDate: new Date(e.startDate),
      endDate: new Date(e.endDate),
      state: e.state || "All",
      openToAll: e.openToAll ?? true,
      area: e.area || { type: "MultiPolygon", coordinates: [] },
      location: {
        id: "",
        name: e.locationNames?.[0] || "",
        address: "",
        city: e.locationNames?.[0]?.split(",")[0] || "",
        country: e.locationNames?.[0]?.split(",")[1]?.trim() || "Australia",
        coordinates: {
          lat: e.area?.coordinates?.[0]?.[0]?.[0]?.[1] || 0,
          lng: e.area?.coordinates?.[0]?.[0]?.[0]?.[0] || 0,
        },
      },
      organizer: e.creator
        ? {
            id: e.creator._id,
            name: e.creator.name,
            email: e.creator.email || "",
            avatar: e.creator.avatarUrl || "",
            bio: e.creator.bio || "",
            location: e.creator.location || "",
            phone: e.creator.phone || "",
            dateOfBirth: e.creator.dateOfBirth
              ? new Date(e.creator.dateOfBirth)
              : undefined,
            preferences: e.creator.preferences || defaultPreferences,
            roles: e.creator.roles?.map((r: any) => ({
              id: r._id || "",
              name: r.name || "",
              description: r.description || "",
              permissions:
                r.permissions?.map((p: any) => ({
                  id: p._id || "",
                  name: p.name || "",
                  description: p.description || "",
                  resource: p.resource || "",
                  action: p.action || "",
                  isActive: p.isActive ?? true,
                  createdAt: new Date(p.createdAt || now),
                  updatedAt: new Date(p.updatedAt || now),
                  label: p.label || "",
                })) || [],
              isActive: r.isActive ?? true,
              createdAt: new Date(r.createdAt || now),
              updatedAt: new Date(r.updatedAt || now),
            })) || [defaultRole],
            isActive: e.creator.isActive ?? true,
            createdAt: new Date(e.creator.createdAt || now),
            updatedAt: new Date(e.creator.updatedAt || now),
          }
        : {
            id: "",
            name: "",
            email: "",
            avatar: "",
            preferences: defaultPreferences,
            roles: [defaultRole],
            isActive: true,
            createdAt: now,
            updatedAt: now,
          },
      attendees:
        e.attendees?.map((a: any) => ({
          id: a._id,
          name: a.name,
          email: a.email || "",
          avatar: a.avatarUrl || "",
          preferences: a.preferences || defaultPreferences,
          roles: a.roles?.map((r: any) => ({
            id: r._id || "",
            name: r.name || "",
            description: r.description || "",
            permissions:
              r.permissions?.map((p: any) => ({
                id: p._id || "",
                name: p.name || "",
                description: p.description || "",
                resource: p.resource || "",
                action: p.action || "",
                isActive: p.isActive ?? true,
                createdAt: new Date(p.createdAt || now),
                updatedAt: new Date(p.updatedAt || now),
                label: p.label || "",
              })) || [],
            isActive: r.isActive ?? true,
            createdAt: new Date(r.createdAt || now),
            updatedAt: new Date(r.updatedAt || now),
          })) || [defaultRole],
          isActive: a.isActive ?? true,
          createdAt: new Date(a.createdAt || now),
          updatedAt: new Date(a.updatedAt || now),
        })) || [],
      roles: e.roles?.map((r: any) => r._id?.toString() || r.toString()) || [],
      maxAttendees: 0,
      price: 0,
      tags: [],
      isPopular: e.isFeatured || false,
      isLive: status === "live",
      createdAt: new Date(e.createdAt),
      updatedAt: new Date(e.updatedAt),
    };
  }

  async fetchRoles(token: string): Promise<RoleResponse[]> {
    const response = await fetch(`${API_BASE_URL}/roles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to fetch roles");
    }

    return await response.json();
  }

  async createEvent(data: Partial<Event>, token: string): Promise<Event> {
    if (!data.area) {
      throw new Error("GeoJSON area is required");
    }
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        state: data.state,
        area: data.area,
        openToAll: data.openToAll,
        startDate: data.startDate?.toISOString(),
        endDate: data.endDate?.toISOString(),
        roles: data.roles,
        isFeatured: data.isPopular,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to create event");
    }

    const created = await response.json();
    return this.mapToEvent(created);
  }

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
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to fetch events");
    }

    const data = await response.json();
    // return data.map((e: any) => this.mapToEvent(e));
    return Array.isArray(data.events)
      ? data.events.map((e: any) => this.mapToEvent(e))
      : [];
  }

  async getFeaturedEvents(
    state?: string,
    page?: number,
    limit?: number
  ): Promise<Event[]> {
    const params = new URLSearchParams();
    if (state) params.append("state", state);
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());

    const response = await fetch(
      `${API_BASE_URL}/events/featured?${params.toString()}`
    );
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to fetch featured events");
    }

    const data = await response.json();
    // return data.map((e: any) => this.mapToEvent(e));
    return Array.isArray(data.events)
      ? data.events.map((e: any) => this.mapToEvent(e))
      : [];
  }

  async getEventById(id: string): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`);
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to fetch event");
    }

    const data = await response.json();
    return this.mapToEvent(data);
  }

  async updateEvent(
    id: string,
    data: Partial<Event>,
    token: string
  ): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        state: data.state,
        area: data.area,
        openToAll: data.openToAll,
        startDate: data.startDate?.toISOString(),
        endDate: data.endDate?.toISOString(),
        roles: data.roles,
        isFeatured: data.isPopular,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to update event");
    }

    const updated = await response.json();
    return this.mapToEvent(updated);
  }

  async deleteEvent(id: string, token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to delete event");
    }
  }

  async bookEvent(id: string, token: string): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${id}/book_event`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to book event");
    }

    const booked = await response.json();
    return this.mapToEvent(booked);
  }

  async getImageUploadUrl(
    id: string,
    fileName: string,
    fileType: string,
    token: string
  ): Promise<{ url: string; key: string }> {
    const params = new URLSearchParams({ fileName, fileType });
    const response = await fetch(
      `${API_BASE_URL}/events/${id}/image/upload-url?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to get upload URL");
    }

    return await response.json();
  }

  async updateEventImage(
    id: string,
    fileKey: string,
    token: string
  ): Promise<{ imageUrl: string }> {
    const response = await fetch(`${API_BASE_URL}/events/${id}/image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fileKey }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to update image");
    }

    return await response.json();
  }

  async getEventImageUrl(id: string): Promise<{ url: string }> {
    const response = await fetch(`${API_BASE_URL}/events/${id}/image`);
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to get image URL");
    }

    return await response.json();
  }

  async toggleFeatured(
    id: string,
    isFeatured: boolean,
    token: string
  ): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${id}/feature`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isFeatured }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Failed to toggle featured");
    }

    const toggled = await response.json();
    return this.mapToEvent(toggled);
  }

  async searchEvents(query: string, state?: string): Promise<Event[]> {
    const events = await this.getAllEvents(state);
    const lowercaseQuery = query.toLowerCase();
    return events.filter((event) => {
      const matchesQuery =
        event.title.toLowerCase().includes(lowercaseQuery) ||
        event.description.toLowerCase().includes(lowercaseQuery);
      const matchesState = !state || event.state === state;
      return matchesQuery && matchesState;
    });
  }
}

export const eventService = new EventService();

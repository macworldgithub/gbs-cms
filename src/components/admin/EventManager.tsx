import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, SaveIcon, XIcon, SearchIcon, MapPinIcon } from 'lucide-react';
import { useEvent } from '../../contexts/EventContext';
import { Event, EventCategory, EventStatus } from '../../types';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

export const EventManager: React.FC = () => {
  const { events, loading, error, addEvent, updateEvent, deleteEvent, searchEvents } = useEvent();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    category: 'other' as EventCategory,
    status: 'upcoming' as EventStatus,
    startDate: '',
    endDate: '',
    location: {
      name: '',
      address: '',
      city: '',
      country: '',
      coordinates: { lat: 0, lng: 0 }
    },
    maxAttendees: '',
    price: '',
    tags: '',
    isPopular: false,
  });

  React.useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      category: 'other',
      status: 'upcoming',
      startDate: '',
      endDate: '',
      location: {
        name: '',
        address: '',
        city: '',
        country: '',
        coordinates: { lat: 0, lng: 0 }
      },
      maxAttendees: '',
      price: '',
      tags: '',
      isPopular: false,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const eventData = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        organizer: { id: '1' } as any, // Mock organizer
        attendees: [],
        isLive: formData.status === 'live',
      };

      if (editingId) {
        await updateEvent(editingId, eventData);
      } else {
        await addEvent(eventData);
      }
      resetForm();
    } catch (err) {
      console.error('Failed to save event:', err);
    }
  };

  const handleEdit = (event: Event) => {
    setFormData({
      title: event.title,
      description: event.description,
      image: event.image,
      category: event.category,
      status: event.status,
      startDate: event.startDate.toISOString().slice(0, 16),
      endDate: event.endDate.toISOString().slice(0, 16),
      location: event.location,
      maxAttendees: event.maxAttendees?.toString() || '',
      price: event.price?.toString() || '',
      tags: event.tags.join(', '),
      isPopular: event.isPopular,
    });
    setEditingId(event.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
      } catch (err) {
        console.error('Failed to delete event:', err);
      }
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() && !locationFilter.trim()) {
      setFilteredEvents(events);
      return;
    }
    
    try {
      const searchResults = await searchEvents(searchQuery, locationFilter);
      setFilteredEvents(searchResults);
    } catch (err) {
      console.error('Failed to search events:', err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
        <Button
          onClick={() => setIsAdding(true)}
          className="bg-[#ec2227] hover:bg-[#d41e23] text-white"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Search and Filter */}
      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
          />
          <input
            type="text"
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
          />
          <Button onClick={handleSearch} variant="outline">
            <SearchIcon className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </Card>

      {/* Add/Edit Form */}
      {isAdding && (
        <Card className="p-6 mb-6 border-2 border-[#ec2227]">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Event' : 'Add New Event'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as EventCategory })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                >
                  <option value="music">Music</option>
                  <option value="sports">Sports</option>
                  <option value="technology">Technology</option>
                  <option value="food">Food</option>
                  <option value="art">Art</option>
                  <option value="business">Business</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as EventStatus })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Attendees
                </label>
                <input
                  type="number"
                  value={formData.maxAttendees}
                  onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                />
              </div>
            </div>
            
            {/* Location Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Venue Name
                </label>
                <input
                  type="text"
                  value={formData.location.name}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    location: { ...formData.location, name: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.location.address}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    location: { ...formData.location, address: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    location: { ...formData.location, city: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.location.country}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    location: { ...formData.location, country: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                rows={3}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
                placeholder="music, festival, outdoor"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPopular"
                checked={formData.isPopular}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isPopular" className="text-sm font-medium text-gray-700">
                Mark as Popular Event
              </label>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                className="bg-[#ec2227] hover:bg-[#d41e23] text-white"
                disabled={loading}
              >
                <SaveIcon className="w-4 h-4 mr-2" />
                {editingId ? 'Update' : 'Save'}
              </Button>
              <Button type="button" onClick={resetForm} variant="outline">
                <XIcon className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Events List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ec2227]"></div>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <Card key={event.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-20 h-20 rounded-lg object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <MapPinIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {event.location.city}, {event.location.country}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            event.status === 'live' ? 'bg-red-100 text-red-800' :
                            event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                            event.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {event.status}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">
                            {event.category}
                          </span>
                          {event.isPopular && (
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                              Popular
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    onClick={() => handleEdit(event)}
                    variant="outline"
                    size="sm"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(event.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
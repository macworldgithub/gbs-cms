
import React, { useState } from 'react';

const states = ['VIC', 'NSW', 'QLD', 'SA'];
const tagOptions = ['Corporate Law', 'Contract Review', 'Business Formation'];

export default function BusinessManager() {
  const [business, setBusiness] = useState({
    name: '',
    owner: '',
    rating: '',
    location: '',
    description: '',
    tags: [],
    phone: '',
    email: '',
    profile: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBusiness(prev => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag: string) => {
  //@ts-ignore
    setBusiness(prev => ({
      ...prev,
      //@ts-ignore
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add save logic (API call or local storage)
    alert('Business added!');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add Business Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <input name="name" value={business.name} onChange={handleChange} placeholder="Business Name" className="w-full border p-2 rounded" />
        <input name="owner" value={business.owner} onChange={handleChange} placeholder="Owner Name" className="w-full border p-2 rounded" />
        <input name="rating" value={business.rating} onChange={handleChange} placeholder="Rating (e.g. 4.8)" className="w-full border p-2 rounded" type="number" min="0" max="5" step="0.1" />
        <select name="location" value={business.location} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="">Select State</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <textarea name="description" value={business.description} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded" />
        <div>
          <span className="font-semibold">Tags:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {tagOptions.map(tag => (
              <button
                type="button"
                key={tag}
                //@ts-ignore
                className={`px-3 py-1 rounded ${business.tags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <input name="phone" value={business.phone} onChange={handleChange} placeholder="Phone" className="w-full border p-2 rounded" />
        <input name="email" value={business.email} onChange={handleChange} placeholder="Email" className="w-full border p-2 rounded" />
        <input name="profile" value={business.profile} onChange={handleChange} placeholder="Profile Link" className="w-full border p-2 rounded" />
        <button type="submit" className="w-full bg-red-500 text-white py-2 rounded font-bold">Add Business</button>
      </form>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Preview</h3>
        <div className="bg-gray-50 p-4 rounded shadow">
          <div className="font-bold text-lg">{business.name || 'Business Name'}</div>
          <div className="text-sm text-gray-600 mb-1">by {business.owner || 'Owner Name'}</div>
          <div className="flex items-center mb-1">
            <span className="text-yellow-500 mr-1">★</span>
            <span>{business.rating || '0.0'}</span>
            <span className="ml-2 text-gray-500">{business.location ? ` ${business.location}` : ''}</span>
          </div>
          <div className="mb-2">{business.description || 'Description...'}</div>
          <div className="flex flex-wrap gap-2 mb-2">
            {business.tags.length > 0
              ? business.tags.map(tag => (
                  <span key={tag} className="bg-gray-200 px-2 py-1 rounded text-xs">{tag}</span>
                ))
              : <span className="text-gray-400">No tags</span>}
          </div>
          <div className="flex gap-2">
            <button className="bg-red-500 text-white px-4 py-1 rounded">Call</button>
            <button className="bg-red-500 text-white px-4 py-1 rounded">Email</button>
            <button className="bg-red-500 text-white px-4 py-1 rounded">View Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
}

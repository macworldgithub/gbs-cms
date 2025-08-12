// src/components/AddBusinessModal.tsx
import React from "react";
import { Tag } from "antd";

interface AddBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (business: any) => void;
  business: any;
  setBusiness: React.Dispatch<React.SetStateAction<any>>;
  states: string[];
  tagOptions: string[];
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleTagToggle: (tag: string) => void;
}

export default function AddBusinessModal({
  isOpen,
  onClose,
  onSubmit,
  business,
  setBusiness,
  states,
  tagOptions,
  handleChange,
  handleTagToggle,
}: AddBusinessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded shadow-lg p-6 w-full max-w-lg z-10">
        <h2 className="text-2xl font-bold mb-4">Add Business Listing</h2>
        <form onSubmit={(e) => onSubmit(e)} className="space-y-4">
          <input
            name="name"
            value={business.name}
            onChange={handleChange}
            placeholder="Business Name"
            className="w-full border p-2 rounded"
          />
          <input
            name="owner"
            value={business.owner}
            onChange={handleChange}
            placeholder="Owner Name"
            className="w-full border p-2 rounded"
          />
          <input
            name="rating"
            value={business.rating}
            onChange={handleChange}
            placeholder="Rating (e.g. 4.8)"
            className="w-full border p-2 rounded"
            type="number"
            min="0"
            max="5"
            step="0.1"
          />
          <select
            name="location"
            value={business.location}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <textarea
            name="description"
            value={business.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-2 rounded"
          />
          <div>
            <span className="font-semibold">Tags:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {tagOptions.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  className={`px-3 py-1 rounded ${
                    business.tags.includes(tag)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <input
            name="phone"
            value={business.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full border p-2 rounded"
          />
          <input
            name="email"
            value={business.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border p-2 rounded"
          />
          <input
            name="profile"
            value={business.profile}
            onChange={handleChange}
            placeholder="Profile Link"
            className="w-full border p-2 rounded"
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-red-500 text-white py-2 px-4 rounded font-bold"
            >
              Add Business
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

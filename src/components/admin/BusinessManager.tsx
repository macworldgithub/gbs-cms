import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../ui/button";

import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { Tag } from "antd";
import AddBusinessModal from "./AddBusinessModal";
import { VITE_API_BASE_URL as API_BASE_URL, AUTH_TOKEN } from "../../utils/config/server";
import { toast } from "react-toastify"; // Import toast
const states = ['VIC', 'NSW', 'QLD', 'SA', 'WA'];
const industry = [
  'Professional Services',
  'Construction & Trades',
  'Technology & IT',
  'Health & Wellness',
  'Hospitality & Events',
  'Retail & E-commerce',
  'Manufacturing',
  'Financial Services',
  'Marketing & Media',
  'Auto Industry',
  'Other Services',
];
const tagOptions = ["Corporate Law", "Contract Review", "Business Formation"];

const userId = "689628a1c17000852c2fb4d6";

export default function BusinessManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [businessList, setBusinessList] = useState<any[]>([]);
  const [business, setBusiness] = useState({
    name: "",
    owner: "",
    rating: "",
    about: "",
    website: "",
    state: "",
    address: "",
    location: "",
    description: "",
    tags: [] as string[], // Renamed to 'services' to match payload
    phone: "",
    email: "",
    profile: "",
    industry: "", // Add missing property
    city: "", // Add missing property
    services: [] as string[], // Explicitly define as array for tags/services
    industriesServed: [] as string[], // Explicitly define as array
    lookingFor: "", // Add missing property
    socialLinks: [] as { platform: string; url: string }[], // Define as array of objects
  });

  const fetchBusinesses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/business`, {
        headers: { "Content-Type": "application/json" },
      });
      setBusinessList(response.data || []);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setBusiness((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setBusiness((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ratingValue = business.rating ? parseFloat(business.rating) : 0;


    const payload = {
      companyName: business.name,
      title: business.owner,
      industry: business.industry,
      state: business.location,
      city: business.city,
      about: business.about,
      services: business.services || [], // Use array directly
      industriesServed: business.industriesServed || [], // Use array directly
      lookingFor: business.lookingFor,

      phone: business.phone,
      email: business.email,
      website: business.website,
      rating: ratingValue,
      socialLinks: business.socialLinks
        ? business.socialLinks.split(",").map((url: string) => ({
          platform: "Link",
          url: url.trim(),
        }))
        : [],
      gallery: [],
      testimonials: [],
      memberSince: new Date().toISOString(),
      specialOffers: [],
      isFeatured: false,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/business`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });
      console.log("Response:", response.data);
      await fetchBusinesses();
      toast.success("Business created successfully"); // Show toast on success
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error adding business:", error.response?.data || error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this business?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/business/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });

      toast.success("Business deleted successfully");
      // UI update ke liye fresh list fetch karo
      await fetchBusinesses();
    } catch (error: any) {
      console.error("Error deleting business:", error.response?.data || error.message);
      toast.error("Failed to delete business");
    }
  };


  return (
    <div className="relative max-w-screen mx-auto p-6 ">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Business Management</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#ec2227] hover:bg-[#d41e23] text-white"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Business
        </Button>
      </div>

      <div className="grid gap-4 mt-6 ">
        {businessList.length > 0 ? (
          businessList.map((b) => (



            <div key={b.id} className="bg-gray-50 p-4 rounded shadow flex justify-between items-start">
              <div>
                <div className="font-bold text-lg">{b.companyName}</div>
                <div className="text-sm text-gray-600">by {b.title}</div>
                <div className="text-sm text-gray-600">{b.industry}</div>
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1">{b.rating}</span>
                  <span className="ml-2 text-gray-500">{b.state}</span>
                </div>
                <p className="mt-1">{b.city}</p>
                <p className="mt-1">{b.about}</p>

                <div className="flex flex-wrap gap-2 mt-2">
                  <p className="text-sm font-bold">Services</p>
                  {b.services?.length > 0 ? (
                    b.services.map((service: string) => (
                      <Tag color="blue" key={service}>
                        {service}
                      </Tag>
                    ))
                  ) : (
                    <span className="text-gray-400">No services listed</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  <p className="text-sm font-bold">Industries Served</p>
                  {b.industriesServed?.length > 0 ? (
                    b.industriesServed.map((industry: string) => (
                      <Tag color="green" key={industry}>
                        {industry}
                      </Tag>
                    ))
                  ) : (
                    <span className="text-gray-400">No industries served</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  // onClick={() => handleEdit(role)} // Replace 'role' with 'b' and ensure handleEdit is defined
                  variant="outline"
                  size="sm"
                >
                  <PencilIcon className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleDelete(b._id || b.id)} // backend id field ka naam confirm karein
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>

              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No businesses found</p>
        )}
      </div>

      <AddBusinessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        business={business}
        setBusiness={setBusiness}
        states={states}
        industry={industry}
        tagOptions={tagOptions}
        handleChange={handleChange}
        handleTagToggle={handleTagToggle}
      />
    </div>
  );
}
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { Tag } from "antd";
import AddBusinessModal from "./AddBusinessModal";

const states = ["VIC", "NSW", "QLD", "SA"];
const tagOptions = ["Corporate Law", "Contract Review", "Business Formation"];
const API_BASE_URL = "http://localhost:9000";
const userId = "689628a1c17000852c2fb4d6";

export default function BusinessManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [businessList, setBusinessList] = useState<any[]>([]);
  const [business, setBusiness] = useState({
    name: "",
    owner: "",
    rating: "",
    location: "",
    description: "",
    tags: [] as string[],
    phone: "",
    email: "",
    profile: "",
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
    try {
      await axios.post(`${API_BASE_URL}/business/${userId}`, business, {
        headers: { "Content-Type": "application/json" },
      });
      await fetchBusinesses();
      setIsModalOpen(false);
      setBusiness({
        name: "",
        owner: "",
        rating: "",
        location: "",
        description: "",
        tags: [],
        phone: "",
        email: "",
        profile: "",
      });
    } catch (error) {
      console.error("Error adding business:", error);
    }
  };

  return (
    <div className="relative max-w-screen mx-auto p-6">
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

      <div className="grid gap-4 mt-6">
        {businessList.length > 0 ? (
          businessList.map((b) => (
            <div key={b.id} className="bg-gray-50 p-4 rounded shadow">
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
        tagOptions={tagOptions}
        handleChange={handleChange}
        handleTagToggle={handleTagToggle}
      />
    </div>
  );
}

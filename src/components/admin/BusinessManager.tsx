import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import EditBusinessModal from "./EditBusinessModal";
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { Tag } from "antd";
import { Input, Select } from "antd";
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
  const [showingFeatured, setShowingFeatured] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [businessList, setBusinessList] = useState<any[]>([]);
  const [keyword, setKeyword] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // fixed per page
  const [business, setBusiness] = useState<{
    id?: string;
    name: string;
    owner: string;
    rating: string;
    about: string;
    website: string;
    state: string;
    address: string;
    location: string;
    description: string;
    tags: string[];
    phone: string;
    email: string;
    profile: string;
    industry?: string;
    city?: string;
    lookingFor?: string;
    services?: string[];
    industriesServed?: string[];
    socialLinks: { type: string; url: string }[];
  }>({
    id: "", // default
    name: "",
    owner: "",
    rating: "",
    about: "",
    website: "",
    state: "",
    address: "",
    location: "",
    description: "",
    tags: [],
    phone: "",
    email: "",
    profile: "",
    industry: "",
    city: "",
    lookingFor: "",
    services: [],
    industriesServed: [],
    socialLinks: [],
  });


  const fetchBusinesses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/business`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });

      const data = response.data.filter(
        (business: any) => business.user?._id === userId
      );

      console.log("Fetched businesses:", data);
      setBusinessList(data || []);
    } catch (error: any) {
      console.error("Error fetching businesses:", error);
      toast.error("Failed to fetch businesses");
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
        //@ts-ignore
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

  const handleUpdate = async (id: string) => {
    console.log("Updating business with ID:", id);
    console.log("AUTH_TOKEN:", AUTH_TOKEN);
    if (!id) {
      toast.error("Business ID is missing");
      return;
    }

    try {
      const ratingValue = business.rating ? parseFloat(business.rating) : 0;

      const payload = {
        user: { _id: userId }, // Include user ID
        companyName: business.name,
        title: business.owner,
        industry: business.industry,
        state: business.state,
        city: business.city,
        about: business.about,
        services: business.services || [],
        industriesServed: business.industriesServed || [],
        lookingFor: business.lookingFor,
        phone: business.phone,
        email: business.email,
        website: business.website,
        rating: ratingValue,
        socialLinks: business.socialLinks.map((link: any) => ({
          platform: link.platform || "Link",
          url: link.url,
          _id: link._id, // Preserve _id if present
        })),
        recommendations: selectedBusiness?.recommendations || 0,
        gallery: selectedBusiness?.gallery || [],
        testimonials: selectedBusiness?.testimonials || [],
        memberSince: selectedBusiness?.memberSince || new Date().toISOString(),
        specialOffers: selectedBusiness?.specialOffers || [],
        isFeatured: selectedBusiness?.isFeatured || false,
      };

      console.log("PUT payload:", payload);

      const response = await axios.put(
        `${API_BASE_URL}/business/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        }
      );

      console.log("Response:", response.data);
      toast.success("Business updated successfully");
      await fetchBusinesses();
      setIsEditModalOpen(false);
    } catch (error: any) {
      console.error("Error updating business:", error.response?.data || error.message);
      toast.error("Failed to update business: " + (error.response?.data?.message || error.message));
    }
  };


  const searchBusinesses = async () => {
    try {
      const params = new URLSearchParams();
      if (keyword) params.append("keyword", keyword);
      if (stateFilter) params.append("state", stateFilter);
      if (industryFilter) params.append("industry", industryFilter);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const response = await axios.get(
        `${API_BASE_URL}/business/search?${params.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        }
      );

      console.log("Searched businesses:", response.data);
      setBusinessList(response.data.businesses || []);
    } catch (error: any) {
      console.error("Error searching businesses:", error);
      toast.error("Failed to search businesses");
    }
  };


  useEffect(() => {
    if (keyword || stateFilter || industryFilter) {
      searchBusinesses(); // filters active → search API call
    } else {
      fetchBusinesses(); // no filters → normal API call
    }
  }, [keyword, stateFilter, industryFilter, page]);



  const fetchFeaturedBusinesses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/business/featured`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });
      console.log("Featured businesses:", response.data);
      setBusinessList(response.data || []);
      setShowingFeatured(true);
    } catch (error: any) {
      console.error("Error fetching featured businesses:", error);
      toast.error("Failed to fetch featured businesses");
    }
  };



  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const payload = { isFeatured: !currentStatus };
      await axios.put(`${API_BASE_URL}/business/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });
      toast.success(`Business marked as ${!currentStatus ? "Featured" : "Not Featured"}`);
      await fetchBusinesses(); // refresh list
    } catch (error: any) {
      console.error("Error toggling featured:", error.response?.data || error.message);
      toast.error("Failed to update featured status");
    }
  };

  return (
    <div className="relative max-w-screen mx-auto p-6 ">
      <div className="flex gap-2 justify-end">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#ec2227] hover:bg-[#d41e23] text-white"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Business
        </Button>

        <Button
          onClick={() => {
            if (showingFeatured) {
              fetchBusinesses(); // reset to all
              setShowingFeatured(false);
            } else {
              fetchFeaturedBusinesses(); // only featured
            }
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {showingFeatured ? "Show All" : "Show Featured"}
        </Button>
      </div>

      <div className="flex gap-4 mt-4 ">
        <Input
          placeholder="Search by keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-1/3 border border-black rounded-md "
        />
        <Select
          placeholder="Select State"
          value={stateFilter || undefined}
          onChange={(val) => setStateFilter(val)}
          className="w-1/4 border border-black rounded-md "
          allowClear
        >
          {states.map((st) => (
            <Select.Option key={st} value={st}>{st}</Select.Option>
          ))}
        </Select>

        <Select
          placeholder="Select Industry"
          value={industryFilter || undefined}
          onChange={(val) => setIndustryFilter(val)}
          className="w-1/4 border border-black rounded-md"
          allowClear
        >
          {industry.map((ind) => (
            <Select.Option key={ind} value={ind}>{ind}</Select.Option>
          ))}
        </Select>
      </div>



      <div className="grid gap-4 mt-6 ">
        {businessList.length > 0 ? (
          businessList.map((b) => (

            <div key={b._id} className="bg-gray-50 p-4 rounded shadow flex justify-between items-start">
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
                <p className="mt-2 text-sm">
                  <span className="font-bold">Featured: </span>
                  {b.isFeatured ? "Yes" : "No"}
                </p>

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
                  onClick={() => toggleFeatured(b._id, b.isFeatured)}
                  variant="outline"
                  size="sm"
                  className={b.isFeatured ? "text-green-600" : "text-gray-600"}
                >
                  {b.isFeatured ? "Unfeature" : "Mark Featured"}
                </Button>
                <Button
                  onClick={() => {
                    setSelectedBusiness(b);
                    // setBusiness({
                    //   id: b._id,
                    //   name: b.companyName || "",
                    //   owner: b.title || "",
                    //   industry: b.industry || "",
                    //   city: b.city || "",
                    //   state: b.state || "",
                    //   about: b.about || "",
                    //   phone: b.phone || "",
                    //   email: b.email || "",
                    //   website: b.website || "",
                    //   rating: b.rating?.toString() || "",
                    //   lookingFor: b.lookingFor || "",
                    //   services: b.services || [],
                    //   industriesServed: b.industriesServed || [],
                    //   socialLinks: b.socialLinks || [],
                    // });
                    setIsEditModalOpen(true);
                  }}


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

      <EditBusinessModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        business={business}
        setBusiness={setBusiness}
        onUpdate={() => handleUpdate(business.id!)} // ✅ use the correct id
      />

    </div>
  );
}
import { UploadOutlined } from "@ant-design/icons";
import { Input, Select, Tag, Upload } from "antd";
import axios from "axios";
import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { VITE_API_BASE_URL as API_BASE_URL, AUTH_TOKEN } from "../../utils/config/server";
import { Button } from "../ui/button";
import AddBusinessModal from "./AddBusinessModal";
import EditBusinessModal from "./EditBusinessModal";
import { Images, Star } from "lucide-react"; 

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
  const getEmptyBusiness = () => ({
    name: "",
    owner: "",
    rating: "",
    about: "",
    website: "",
    state: "",
    address: "",
    location: "",
    description: "",
    tags: [] as string[],
    phone: "",
    email: "",
    profile: "",
    industry: "",
    city: "",
    services: [] as string[],
    industriesServed: [] as string[],
    lookingFor: "",
    socialLinks: [] as { platform: string; url: string }[],
  });
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
  const [business, setBusiness] = useState(getEmptyBusiness());

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

    try {
      const ratingValue = business.rating ? parseFloat(business.rating) : 0;

      const payload = {
        companyName: business.name,
        title: business.owner,
        industry: business.industry,
        state: business.location,
        city: business.city,
        about: business.about,
        services: Array.isArray(business.services) ? business.services : [], // Ensure array
        industriesServed: Array.isArray(business.industriesServed)
          ? business.industriesServed
          : [], // Ensure array
        lookingFor: business.lookingFor,
        phone: business.phone,
        email: business.email,
        website: business.website,
        rating: ratingValue,
        socialLinks: Array.isArray(business.socialLinks)
          ? business.socialLinks
          : [], // Ensure array of objects
        gallery: [],
        testimonials: [],
        memberSince: new Date().toISOString(),
        specialOffers: [],
        isFeatured: false,
      };

      console.log("Submitting payload:", payload); // Debug payload

      const response = await axios.post(`${API_BASE_URL}/business`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });

      console.log("Response:", response.data);
      await fetchBusinesses();
      toast.success("Business created successfully");
      setIsModalOpen(false);
      setBusiness(getEmptyBusiness());
    } catch (error: any) {
      console.error("Error adding business:", error.response?.data || error.message);
      toast.error("Failed to add business");
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
      await fetchBusinesses();
    } catch (error: any) {
      console.error("Error deleting business:", error.response?.data || error.message);
      toast.error("Failed to delete business");
    }
  };



  const handleUpdate = async (id: string) => {
    try {
      const payload = {
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
        rating: business.rating ? parseFloat(business.rating) : 0,
        socialLinks: business.socialLinks || [],
      };

      const response = await axios.patch(
        `${API_BASE_URL}/business/${id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        }
      );

      toast.success("Business updated successfully!");
      setIsEditModalOpen(false);
      await fetchBusinesses();
    } catch (error: any) {
      console.error("Error updating business:", error.response?.data || error.message);
      toast.error("Failed to update business");
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
      searchBusinesses();
    } else {
      fetchBusinesses();
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


  const handleLogoUpload = async (businessId: string, file: File) => {
    try {

      const presignUrl = `${API_BASE_URL}/business/${businessId}/logo/upload-url?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}`;

      const presignRes = await axios.get(presignUrl, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      });

      const { url, key } = presignRes.data;


      await axios.put(url, file, {
        headers: { "Content-Type": file.type },
      });


      await axios.patch(
        `${API_BASE_URL}/business/${businessId}/logo`,
        { fileKey: key },
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Logo uploaded successfully!");
      await fetchBusinesses(); // refresh list
    } catch (err: any) {
      console.error("Logo upload error:", err);
      toast.error(err.response?.data?.message || "Failed to upload logo");
    }
  };


  // inside BusinessManager component

  // 📌 Upload Gallery Function
  const handleGalleryUpload = async (businessId: string, files: File[]) => {
    if (!files || files.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    try {
      // 1. Prepare file metadata
      const fileData = files.map((file) => ({
        fileName: file.name,
        fileType: file.type,
      }));

      // 2. Request presigned URLs
      const presignRes = await axios.post(
        `${API_BASE_URL}/business/${businessId}/gallery/upload-urls`,
        fileData,
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { urls } = presignRes.data;

      // 3. Upload to S3
      await Promise.all(
        urls.map((urlData: any, index: number) =>
          axios.put(urlData.url, files[index], {
            headers: { "Content-Type": files[index].type },
          })
        )
      );

      // 4. Add fileKeys to business gallery
      const fileKeys = urls.map((u: any) => u.key);
      await axios.patch(
        `${API_BASE_URL}/business/${businessId}/gallery`,
        { fileKeys },
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Images uploaded to gallery!");
      await fetchBusinesses();
    } catch (err: any) {
      console.error("Gallery upload error:", err);
      toast.error(err.response?.data?.message || "Failed to upload gallery images");
    }
  };


  return (
    <div className="relative max-w-screen mx-auto p-6 ">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Business Management</h2>

        <div className="flex gap-2 justify-end">
          <Button
            className="bg-[#ec2227] hover:bg-[#d41e23] text-white"
            onClick={() => {
              setBusiness(getEmptyBusiness()); // ✅ safe reset
              setIsModalOpen(true);
            }}
          >
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

            <div
              key={b._id}
              className="bg-white rounded-2xl shadow-md p-5 grid grid-cols-12 gap-6"
            >
              {/* Left Side (Logo + Details + Gallery) */}
              <div className="col-span-9 flex flex-col gap-4">
                {/* Logo + Company Name */}
                <div className="flex items-center gap-4">
                  {b.logo ? (
                    <img
                      src={b.logo}
                      alt={`${b.companyName} logo`}
                      className="w-16 h-16 object-cover rounded-full border-2 border-gray-300 shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center rounded-full border-2 border-dashed border-gray-400 bg-gray-100 text-gray-500 text-xs font-semibold">
                      Upload Logo
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-xl">{b.companyName}</h3>
                    <p className="text-sm text-gray-600">by {b.title}</p>
                    <p className="text-sm text-gray-600">{b.industry}</p>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <div className="flex items-center text-sm text-gray-600 gap-2">
                    <span className="text-yellow-500">★</span>
                    <span>{b.rating}</span>
                    <span className="ml-2">{b.state}</span>
                  </div>
                  <p className="mt-1 text-gray-700">{b.city}</p>
                  <p className="mt-1 text-gray-800">{b.about}</p>
                  <p className="mt-2 text-sm">
                    <span className="font-bold">Featured:</span>{" "}
                    {b.isFeatured ? "Yes" : "No"}
                  </p>

                  <div className="mt-2">
                    <p className="text-sm font-bold">Services</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.isArray(b.services) && b.services.length > 0 ? (
                        b.services.map((service: string) => (
                          <Tag color="blue" key={service}>
                            {service}
                          </Tag>
                        ))
                      ) : (
                        <span className="text-gray-400">No services listed</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm font-bold">Industries Served</p>
                    <div className="flex flex-wrap gap-2 mt-1">
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
                </div>

                {/* Gallery */}
                {b.gallery && b.gallery.length > 0 && (
                  <div className="mt-4 pt-2">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {b.gallery.map((img: string, idx: number) => (
                        <img
                          key={idx}
                          src={img}
                          alt="gallery"
                          className="w-24 h-24 object-cover rounded-md border"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side (Buttons) */}
              <div className="flex flex-col items-end gap-2 col-span-3">
  {/* Upload Logo */}
  <Upload
    showUploadList={false}
    beforeUpload={(file) => {
      handleLogoUpload(b._id, file);
      return false;
    }}
  >
    <Button className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 shadow-sm">
      <UploadOutlined />
    </Button>
  </Upload>

  {/* Upload Gallery */}
  <Upload
    multiple
    showUploadList={false}
    beforeUpload={(file, fileList) => {
      handleGalleryUpload(b._id, fileList as File[]);
      return false;
    }}
  >
    <Button className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 shadow-sm">
      <Images className="w-5 h-5" />
    </Button>
  </Upload>

  {/* Mark Featured */}
  <Button
    onClick={() => toggleFeatured(b._id, b.isFeatured)}
    className={`w-10 h-10 flex items-center justify-center rounded-full shadow-sm ${
      b.isFeatured
        ? "bg-green-50 text-green-600 hover:bg-green-100"
        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
    }`}
  >
    <Star className="w-5 h-5" />
  </Button>

  {/* Edit */}
  <Button
    onClick={() => {
      setSelectedBusiness(b);
      setBusiness({
        ...b,
        name: b.companyName || "",
        owner: b.title || "",
        rating: b.rating?.toString() || "",
        about: b.about || "",
        website: b.website || "",
        state: b.state || "",
        city: b.city || "",
        services: b.services || [],
        industriesServed: b.industriesServed || [],
        lookingFor: b.lookingFor || "",
        phone: b.phone || "",
        email: b.email || "",
        socialLinks: b.socialLinks || [],
      });
      setIsEditModalOpen(true);
    }}
    className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 shadow-sm"
  >
    <PencilIcon className="w-5 h-5" />
  </Button>

  {/* Delete */}
  <Button
    onClick={() => handleDelete(b._id || b.id)}
    className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 shadow-sm"
  >
    <TrashIcon className="w-5 h-5" />
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
        onUpdate={handleUpdate}
      />


    </div>
  );
}




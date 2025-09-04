import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { toast } from "react-toastify";
import { VITE_API_BASE_URL as API_BASE_URL } from "../../utils/config/server";
import {
  Gift,
  CalendarDays,
  Plus,
  Tag,
  LocateIcon,
  Pencil,
  Trash2,
  Phone,
  Mail,
  FileText,
  ImagePlus,

} from "lucide-react";

type Offer = {
  _id: string;
  title: string;
  offerType: "Member" | "Partner";
  category: string;
  description: string;
  discount: string;
  expiryDate: string;
  locations: string;
  image?: string;

};

export default function Offers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [open, setOpen] = useState(false);
  const [editOffer, setEditOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewOfferId, setViewOfferId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: "",
    offerType: "",
    location: "",
    status: "",
    page: 1,
    limit: 10,
  });

  // Fetch Offers from API
  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/offer`, {
        method: "GET",
        headers: { accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch offers");
      const data = await res.json();
      setOffers(data);
    } catch (err) {
      console.error("Error fetching offers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (offer: Offer) => {
    setOffers((prev) => [offer, ...prev]);
    setOpen(false);
  };

  const fetchSearchOffers = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (filters.category) query.append("category", filters.category);
      if (filters.offerType) query.append("offerType", filters.offerType);
      if (filters.location) query.append("location", filters.location);
      if (filters.status) query.append("status", filters.status);
      query.append("page", String(filters.page));
      query.append("limit", String(filters.limit));

      const url = `${API_BASE_URL}/offer/search?${query.toString()}`;
      const res = await fetch(url, { headers: { accept: "application/json" } });
      if (!res.ok) throw new Error("Failed to fetch search offers");

      const data = await res.json();
      setOffers(Array.isArray(data.offers) ? data.offers : []);
    } catch (err) {
      console.error("Error searching offers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ DELETE API
  const handleDelete = async (_id: string) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      await fetch(`${API_BASE_URL}/offer/${_id}`, {
        method: "DELETE",
        headers: { accept: "application/json" },
      });
      setOffers((prev) => prev.filter((o) => o._id !== _id));
      toast.success("Offer deleted successfully");
    } catch (err) {
      console.error("Error deleting offer:", err);
      toast.error("Failed to delete offer");
    }
  };


  // ✅ Upload Offer Image (corrected flow)
  const handleImageUpload = async (id: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        // Step 1: Get pre-signed S3 upload URL
        const url = `${API_BASE_URL}/offer/${id}/image/upload-url?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}`;
        const res = await fetch(url, {
          method: "GET",
          headers: { accept: "application/json" },
        });

        if (!res.ok) throw new Error("Failed to get upload URL");

        const { url: uploadUrl, key } = await res.json();

        // Step 2: Upload file directly to S3
        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!uploadRes.ok) throw new Error("Failed to upload file to S3");

        // Step 3: Tell backend the final fileKey
        const patchRes = await fetch(`${API_BASE_URL}/offer/${id}/image`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", accept: "application/json" },
          body: JSON.stringify({ fileKey: key }), // 👈 yahan sirf key bhejna hai
        });

        if (!patchRes.ok) throw new Error("Failed to update offer image");

        toast.success("Offer image uploaded successfully!");
        fetchOffers();
      } catch (err) {
        console.error("Upload error:", err);
        toast.error("Image upload failed!");
      }
    };

    input.click();
  };



  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Gift className="w-6 h-6 text-[#ec2227]" />
          Exclusive offers
        </h2>

        <Button
          onClick={() => setOpen(true)}
          className="bg-[#ec2227] hover:bg-[#d41e23] text-white rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Offer
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-xl mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <input
          name="category"
          placeholder="Category"
          value={filters.category}
          onChange={handleFilterChange}
          className="border rounded-lg px-3 py-2"
        />
        <select
          name="offerType"
          value={filters.offerType}
          onChange={handleFilterChange}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Types</option>
          <option value="Member">Member</option>
          <option value="Partner">Partner</option>
        </select>
        <input
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleFilterChange}
          className="border rounded-lg px-3 py-2"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="popular">Popular</option>
          <option value="expiring-soon">Expiring Soon</option>
        </select>
        <Button
          onClick={fetchSearchOffers}
          className="bg-[#ec2227] hover:bg-[#d41e23] text-white rounded-xl sm:col-span-2 md:col-span-3"
        >
          Search
        </Button>
      </div>

      {loading && <p className="text-gray-600">Loading offers...</p>}

      {/* List */}
      <div className="space-y-4">
        {offers.length === 0 && !loading ? (
          <p className="text-gray-500 text-center py-10">No offers found</p>
        ) : (
          offers.map((o) => (
            <Card key={o._id} className="p-4 sm:p-5 rounded-2xl relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => handleImageUpload(o._id)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <ImagePlus className="w-5 h-5 text-green-600" />
                </button>
                <button
                  onClick={() => setEditOffer(o)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <Pencil className="w-5 h-5 text-blue-600" />
                </button>
                <button
                  onClick={() => handleDelete(o._id)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>

              {/* Offer image */}
              {o.image && (
                <img
                  src={o.image}
                  alt={o.title}
                  className="w-20 h-20 object-cover rounded-xl mb-4"
                />
              )}


              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                    <Gift className="w-6 h-6 text-[#ec2227]" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className=" items-start justify-start gap-3">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      {o.title}
                    </h3>
                    <span className="text-[#ec2227] font-semibold text-sm sm:text-base whitespace-nowrap">
                      {o.discount}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-gray-700">{o.offerType}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs">
                      <Tag className="w-3 h-3" />
                      {o.category}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-gray-600">{o.description}</p>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarDays className="w-4 h-4" />
                      <span>
                        Expires:{" "}
                        {new Date(o.expiryDate).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="ml-auto flex gap-2">
                      <Button
                        onClick={() => setViewOfferId(o._id)}
                        className="bg-[#ec2227] hover:bg-[#d41e23] text-white rounded-lg"
                      >
                        View Details
                      </Button>

                      <Button className="bg-[#ec2227] hover:bg-[#d41e23] text-white rounded-lg">
                        Redeem
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-start gap-2 text-xs sm:text-sm text-gray-600 p-3">
                    <LocateIcon className="w-4 h-4 shrink-0 text-gray-500" />
                    <span className="leading-relaxed">{o.locations}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {open && (
        <AddOfferModal onClose={() => setOpen(false)} onSave={handleAdd} />
      )}

      {editOffer && (
        <UpdateOfferModal
          offer={editOffer}
          onClose={() => setEditOffer(null)}
          onUpdate={(updated) => {
            setOffers((prev) =>
              prev.map((o) => (o._id === updated._id ? updated : o))
            );
            setEditOffer(null);
          }}
        />
      )}

      {viewOfferId && (
        <OfferDetailsModal
          offerId={viewOfferId}
          initialOffer={offers.find((o) => o._id === viewOfferId)}
          onClose={() => setViewOfferId(null)}
        />
      )}
    </div>
  );
}

// OfferDetails
type OfferDetails = {
  _id: string;
  business: string | null;
  image?: string;
  title: string;
  discount: string;
  offerType: string;
  category: string;
  expiryDate: string;
  description: string;
  termsAndConditions: string[];
  howToRedeem: string;
  contactPhone: string;
  contactEmail: string;
  locations: string[];
  redemptionCount: number;
  savedBy: string[];
  reviews: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};


function OfferDetailsModal({
  offerId,
  initialOffer,
  onClose,
}: {
  offerId: string;
  initialOffer?: Offer;
  onClose: () => void;
}) {
  const [offer, setOffer] = useState<OfferDetails | null>(null);
  const [loading, setLoading] = useState(!initialOffer);

  useEffect(() => {
    if (!offerId || offer) return;

    const fetchOfferDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/offer/${offerId}`);
        if (!res.ok) throw new Error("Failed to fetch offer details");
        const data = await res.json();
        setOffer(data);
      } catch (error) {
        console.error("Error fetching offer details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOfferDetails();
  }, [offerId]);

  useEffect(() => {
    if (initialOffer) {
      setOffer((prev) => ({ ...initialOffer, ...prev } as OfferDetails));
    }
  }, [initialOffer]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal box */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto p-6">
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : !offer ? (
          <p className="text-center py-10 text-gray-600">No offer found</p>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">{offer.title}</h2>
            <p className="text-red-500 font-semibold">{offer.discount}</p>
            <p className="text-gray-700">{offer.description}</p>

            {/* Category & Offer Type */}
            <p className="text-sm text-gray-600">
              <strong>Category:</strong> {offer.category}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Type:</strong> {offer.offerType}
            </p>

            {/* Expiry */}
            <p className="flex items-center text-sm text-gray-600">
              <CalendarDays className="w-4 h-4 mr-1" />
              Expires: {new Date(offer.expiryDate).toLocaleDateString()}
            </p>

            {/* Locations */}
            <p className="flex items-center text-sm text-gray-600">
              <LocateIcon className="w-4 h-4 mr-1" />
              {offer.locations.join(", ")}
            </p>

            {/* Phone */}
            {offer.contactPhone && (
              <p className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-1" /> {offer.contactPhone}
              </p>
            )}

            {/* Email */}
            {offer.contactEmail && (
              <p className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-1" /> {offer.contactEmail}
              </p>
            )}

            {/* Terms */}
            {offer.termsAndConditions?.length > 0 && (
              <div>
                <h4 className="font-semibold mt-2 flex items-center">
                  <FileText className="w-4 h-4 mr-1" /> Terms & Conditions
                </h4>
                <ul className="list-disc ml-6 text-sm text-gray-700">
                  {offer.termsAndConditions.map((term, idx) => (
                    <li key={idx}>{term}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Redeem instructions */}
            {offer.howToRedeem && (
              <div>
                <h4 className="font-semibold mt-2">How to Redeem</h4>
                <p className="text-sm text-gray-700">{offer.howToRedeem}</p>
              </div>
            )}

            {/* Extra Info */}
            <p className="text-sm text-gray-600">
              <strong>Redemptions:</strong> {offer.redemptionCount}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Created At:</strong> {new Date(offer.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Updated At:</strong> {new Date(offer.updatedAt).toLocaleString()}
            </p>
          </div>

        )}
        {/* Close Button */}
        <div className="flex justify-end">
          <Button
            onClick={onClose}
            className="bg-[#ec2227] hover:bg-[#d41e23] text-white"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
/* ---------------- Add Offer Modal ---------------- */
function AddOfferModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (offer: Offer) => void;
}) {
  const [form, setForm] = useState({
    businessId: "",
    image: "offer/12345/image/offer-promo.jpg",
    title: "",
    discount: "",
    offerType: "Member",
    category: "",
    expiryDate: "",
    description: "",
    termsAndConditions: [""],
    howToRedeem: "",
    contactPhone: "",
    contactEmail: "",
    locations: [""],
  });

  const [loading, setLoading] = useState(false);
  const [businesses, setBusinesses] = useState<any[]>([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await fetch(`https://gbs.westsidecarcare.com.au/business`);
        if (!res.ok) throw new Error("Failed to fetch businesses");
        const data = await res.json();
        setBusinesses(data);
      } catch (err) {
        console.error("Error fetching businesses:", err);
        toast.error("Failed to load businesses");
      }
    };
    fetchBusinesses();
  }, []);

  const update = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!form.businessId) {
      toast.error("Please select a business");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/offer/${form.businessId}`, // ✅ dynamic businessId
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            expiryDate: form.expiryDate
              ? new Date(form.expiryDate).toISOString()
              : null,
            locations: form.locations.filter((l) => l.trim() !== ""),
            termsAndConditions: form.termsAndConditions.filter(
              (t) => t.trim() !== ""
            ),
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to add offer");
      const created = await res.json();
      onSave(created);
      toast.success("Offer added successfully");
      onClose();
    } catch (err) {
      console.error("Error adding offer:", err);
      toast.error("Failed to add offer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal box with scroll */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto p-5">
        <h4 className="text-lg font-semibold mb-4">Add New Offer</h4>
        <div className="space-y-3">
          {/* Business Select Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business
            </label>
            <select
              name="businessId"
              value={form.businessId}
              onChange={update}
              className="w-full border rounded-lg px-3 py-2 bg-gray-50"
            >
              <option value="">-- Select Business --</option>
              {businesses.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.companyName}
                </option>
              ))}
            </select>
          </div>

          <LabeledInput
            label="Title"
            name="title"
            value={form.title}
            onChange={update}
          />
          <LabeledInput
            label="Discount"
            name="discount"
            value={form.discount}
            onChange={update}
          />
          <LabeledInput
            label="Expiry Date"
            name="expiryDate"
            type="date"
            value={form.expiryDate}
            onChange={update}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={update}
            rows={3}
            className="w-full border rounded-lg px-3 py-2 bg-gray-50"
          />
          <LabeledInput
            label="Location (comma separated)"
            name="locations"
            value={form.locations.join(", ")}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                locations: e.target.value.split(",").map((l) => l.trim()),
              }))
            }
          />
          <LabeledInput
            label="Contact Phone"
            name="contactPhone"
            value={form.contactPhone}
            onChange={update}
          />
          <LabeledInput
            label="Contact Email"
            name="contactEmail"
            value={form.contactEmail}
            onChange={update}
          />
          <textarea
            name="termsAndConditions"
            placeholder="Terms and Conditions (one per line)"
            value={form.termsAndConditions.join("\n")}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                termsAndConditions: e.target.value
                  .split("\n")
                  .map((t) => t.trim()),
              }))
            }
            rows={3}
            className="w-full border rounded-lg px-3 py-2 bg-gray-50"
          />
          <LabeledInput
            label="How to Redeem"
            name="howToRedeem"
            value={form.howToRedeem}
            onChange={update}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Offer Type
            </label>
            <select
              name="offerType"
              value={form.offerType}
              onChange={update}
              className="w-full border rounded-lg px-3 py-2 bg-gray-50"
            >
              <option value="Member">Member</option>
              <option value="Partner">Partner</option>
            </select>
          </div>
          {/* ✅ Category Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={update}
              className="w-full border rounded-lg px-3 py-2 bg-gray-50"
            >
              <option value="">Select Category</option>
              <option value="Restaurant & Dining">Restaurant & Dining</option>
              <option value="Professional Services">Professional Services</option>
              <option value="Retail & Products">Retail & Products</option>
              <option value="Health & Wellness">Health & Wellness</option>
              <option value="Trade Services">Trade Services</option>
              <option value="Energy Suppliers">Energy Suppliers</option>
              <option value="Telecommunications">Telecommunications</option>
              <option value="Automotive">Automotive</option>
              <option value="Insurance">Insurance</option>
              <option value="Travel & Accommodation">Travel & Accommodation</option>
              <option value="Entertainment & Events">Entertainment & Events</option>
              <option value="Technology & Software">Technology & Software</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex justify-end gap-2 sticky bottom-0 bg-white pt-3">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            className="bg-[#ec2227] hover:bg-[#ec2227] text-white"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Update Offer Modal ---------------- */
function UpdateOfferModal({
  offer,
  onClose,
  onUpdate,
}: {
  offer: Offer;
  onClose: () => void;
  onUpdate: (offer: Offer) => void;
}) {
  const [form, setForm] = useState(offer);
  const [loading, setLoading] = useState(false);

  const update = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/offer/${offer._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update offer");
      const updated = await res.json();
      onUpdate(updated); // ✅ send only updated offer
      onClose(); // ✅ close modal
      toast.success("Offer updated successfully");
    } catch (err) {
      console.error("Error updating offer:", err);
      toast.error("Failed to update offer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-4 sm:inset-x-auto sm:right-6 top-10 sm:top-12 bg-white rounded-2xl shadow-2xl w-auto sm:w-[520px] p-5">
        <h4 className="text-lg font-semibold mb-4">Update Offer</h4>
        <div className="space-y-3">
          <LabeledInput
            label="Title"
            name="title"
            value={form.title}
            onChange={update}
          />
          <LabeledInput
            label="Discount"
            name="discount"
            value={form.discount}
            onChange={update}
          />
          <LabeledInput
            label="Expiry Date"
            name="expiryDate"
            type="date"
            value={form.expiryDate?.slice(0, 10) || ""}
            onChange={update}
          />
          <textarea
            name="description"
            value={form.description}
            onChange={update}
            rows={3}
            className="w-full border rounded-lg px-3 py-2 bg-gray-50"
          />
          <LabeledInput
            label="Location"
            name="locations"
            value={form.locations}
            onChange={update}
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button className="bg-[#ec2227] text-white" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Reusable Input ---------------- */
function LabeledInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }
) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        {...rest}
        className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-[#ec2227] focus:outline-none"
      />
    </div>
  );
}

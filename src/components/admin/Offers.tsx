import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { toast } from "react-toastify";
import {
  VITE_API_BASE_URL as API_BASE_URL,
  AUTH_TOKEN,
} from "../../utils/config/server";
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

  useEffect(() => {
    fetchOffers();
  }, []);

  const getAuthHeaders = (): HeadersInit => ({
    accept: "application/json",
    Authorization: `Bearer ${AUTH_TOKEN}`,
  });

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/offer`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        if (res.status === 401) toast.error("Unauthorized access");
        throw new Error("Failed to fetch offers");
      }
      const data = await res.json();
      setOffers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching offers:", err);
      toast.error("Failed to load offers");
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
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();
      setOffers(Array.isArray(data.offers) ? data.offers : []);
    } catch (err) {
      console.error("Error searching offers:", err);
      toast.error("Search failed");
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

  const handleDelete = async (_id: string) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/offer/${_id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Delete failed");
      setOffers((prev) => prev.filter((o) => o._id !== _id));
      toast.success("Offer deleted successfully");
    } catch (err) {
      console.error("Error deleting offer:", err);
      toast.error("Failed to delete offer");
    }
  };

  const handleImageUpload = async (id: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const url = `${API_BASE_URL}/offer/${id}/image/upload-url?fileName=${encodeURIComponent(
          file.name
        )}&fileType=${encodeURIComponent(file.type)}`;
        const res = await fetch(url, {
          method: "GET",
          headers: getAuthHeaders(),
        });

        if (!res.ok) throw new Error("Failed to get upload URL");

        const { url: uploadUrl, key } = await res.json();

        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!uploadRes.ok) throw new Error("Failed to upload to S3");

        const patchRes = await fetch(`${API_BASE_URL}/offer/${id}/image`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({ fileKey: key }),
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          {" "}
          {/* Higher z-index, semi-transparent bg on container */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto p-6 relative">
            {/* Close button inside modal */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <AddOfferModalContent
              onClose={() => setOpen(false)}
              onSave={handleAdd}
            />
          </div>
        </div>
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
              <strong>Created At:</strong>{" "}
              {new Date(offer.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Updated At:</strong>{" "}
              {new Date(offer.updatedAt).toLocaleString()}
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
function AddOfferModalContent({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (offer: Offer) => void;
}) {
  const [form, setForm] = useState({
    businessId: "",
    title: "",
    discount: "",
    offerType: "Member" as "Member" | "Partner",
    category: "",
    expiryDate: "",
    description: "",
    termsAndConditions: [""] as string[],
    howToRedeem: "",
    contactPhone: "",
    contactEmail: "",
    locations: [""] as string[],
    image: "", // Optional - can be added later via upload button
  });

  const [loading, setLoading] = useState(false);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [businessLoading, setBusinessLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setBusinessLoading(true);
        const res = await fetch(`${API_BASE_URL}/business`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        });
        if (!res.ok) {
          if (res.status === 401)
            toast.error("Unauthorized - Please log in again");
          throw new Error("Failed to load businesses");
        }
        const data = await res.json();
        setBusinesses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching businesses:", err);
        toast.error("Failed to load your businesses");
        setBusinesses([]);
      } finally {
        setBusinessLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  const updateField = (name: string, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.businessId) {
      toast.error("Please select a business");
      return;
    }
    if (!form.title || !form.discount || !form.expiryDate) {
      toast.error("Please fill required fields: Title, Discount, Expiry Date");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: form.title.trim(),
        discount: form.discount.trim(),
        offerType: form.offerType,
        category: form.category,
        description: form.description.trim(),
        expiryDate: new Date(form.expiryDate).toISOString(),
        termsAndConditions: form.termsAndConditions.filter(
          (t) => t.trim() !== ""
        ),
        howToRedeem: form.howToRedeem.trim(),
        contactPhone: form.contactPhone.trim(),
        contactEmail: form.contactEmail.trim(),
        locations: form.locations.filter((l) => l.trim() !== ""),
        image: form.image || undefined, // Only send if set
      };

      const res = await fetch(`${API_BASE_URL}/offer/${form.businessId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error: ${res.status} - ${errorText}`);
      }

      const createdOffer = await res.json();
      onSave(createdOffer);
      toast.success("Offer added successfully!");
      onClose();
    } catch (err: any) {
      console.error("Add offer error:", err);
      toast.error(err.message || "Failed to add offer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Add New Exclusive Offer
      </h4>

      <div className="space-y-5">
        {/* Business Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Select Your Business *
          </label>
          {businessLoading ? (
            <p className="text-gray-500">Loading your businesses...</p>
          ) : businesses.length === 0 ? (
            <p className="text-red-500">No businesses found. Add one first.</p>
          ) : (
            <select
              value={form.businessId}
              onChange={(e) => updateField("businessId", e.target.value)}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-[#ec2227] focus:outline-none"
            >
              <option value="">-- Choose Business --</option>
              {businesses.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.companyName} ({b.city || b.state})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Title */}
        <LabeledInput
          label="Offer Title *"
          name="title"
          placeholder="e.g. 20% Off Premium Menswear"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
        />

        {/* Discount */}
        <LabeledInput
          label="Discount Text *"
          name="discount"
          placeholder="e.g. 10% off total bill"
          value={form.discount}
          onChange={(e) => updateField("discount", e.target.value)}
        />

        {/* Offer Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Offer Type
          </label>
          <select
            value={form.offerType}
            onChange={(e) => updateField("offerType", e.target.value)}
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-[#ec2227]"
          >
            <option value="Member">Member Offer</option>
            <option value="Partner">Partner Offer</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-[#ec2227]"
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
            <option value="Travel & Accommodation">
              Travel & Accommodation
            </option>
            <option value="Entertainment & Events">
              Entertainment & Events
            </option>
            <option value="Technology & Software">Technology & Software</option>
          </select>
        </div>

        {/* Expiry Date */}
        <LabeledInput
          label="Expiry Date *"
          name="expiryDate"
          type="date"
          value={form.expiryDate}
          onChange={(e) => updateField("expiryDate", e.target.value)}
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Description
          </label>
          <textarea
            placeholder="Tell members about this great offer..."
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={4}
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-[#ec2227] focus:outline-none"
          />
        </div>

        {/* Locations */}
        <LabeledInput
          label="Locations (comma separated)"
          name="locations"
          placeholder="e.g. Melbourne, Sydney, Brisbane"
          value={form.locations.join(", ")}
          onChange={(e) =>
            updateField(
              "locations",
              e.target.value.split(",").map((l) => l.trim())
            )
          }
        />

        {/* Contact Info */}
        <LabeledInput
          label="Contact Phone"
          name="contactPhone"
          placeholder="+61 4XX XXX XXX"
          value={form.contactPhone}
          onChange={(e) => updateField("contactPhone", e.target.value)}
        />

        <LabeledInput
          label="Contact Email"
          name="contactEmail"
          type="email"
          placeholder="offers@yourbusiness.com"
          value={form.contactEmail}
          onChange={(e) => updateField("contactEmail", e.target.value)}
        />

        {/* How to Redeem */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            How to Redeem
          </label>
          <textarea
            placeholder="e.g. Show this offer on the GBS App at checkout"
            value={form.howToRedeem}
            onChange={(e) => updateField("howToRedeem", e.target.value)}
            rows={3}
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-[#ec2227]"
          />
        </div>

        {/* Terms & Conditions */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Terms & Conditions (one per line)
          </label>
          <textarea
            placeholder="Valid for dine-in only&#10;Not valid with other offers&#10;One use per customer"
            value={form.termsAndConditions.join("\n")}
            onChange={(e) =>
              updateField(
                "termsAndConditions",
                e.target.value.split("\n").map((t) => t.trim())
              )
            }
            rows={4}
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-[#ec2227]"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-200">
        <Button onClick={onClose} variant="outline" className="px-8">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={loading || businessLoading}
          className="bg-[#ec2227] hover:bg-[#d41e23] text-white px-10"
        >
          {loading ? "Saving Offer..." : "Publish Offer"}
        </Button>
      </div>
    </>
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
          <Button
            className="bg-[#ec2227] text-white"
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

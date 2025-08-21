import React, { useState, useEffect } from "react"; 
import { Button } from "../ui/button";
import { Card } from "../ui/card";
// import AddOfferModal from "./AddOfferModal";
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
} from "lucide-react";

type Offer = {
  _id: string;  // ✅ MongoDB ka _id use karo
  title: string;
  offerType: "Member" | "Partner";
  category: string;
  description: string;
  discount: string;
  expiryDate: string;
  locations: string;
};

export default function Offers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [open, setOpen] = useState(false);
  const [editOffer, setEditOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(false);

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

                    <div className="ml-auto">
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

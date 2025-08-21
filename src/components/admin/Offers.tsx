import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Gift,
  CalendarDays,
  Info,
  Plus,
  Building2,
  Tag,
} from "lucide-react";

type Offer = {
  id: string;
  title: string;
  vendor: string;
  vendorType: "Member" | "Partner";
  category: string;
  description: string;
  discountText: string; // e.g. "20% Off"
  expiresAt: string;    // e.g. "2025-03-30"
  note: string;         // small gray strip text
};

export default function Offers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [open, setOpen] = useState(false);
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
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://gbs.westsidecarcare.com.au/offer", {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch offers");
        }

        const data = await res.json();
        // API ke hisaab se agar structure alag hai toh map adjust karna parega
        setOffers(data);
      } catch (err) {
        console.error("Error fetching offers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleAdd = (offer: Offer) => {
    setOffers((prev) => [{ ...offer, id: String(Date.now()) }, ...prev]);
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

    const url = `https://gbs.westsidecarcare.com.au/offer/search?${query.toString()}`;

    const res = await fetch(url, {
      method: "GET",
      headers: { accept: "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch search offers");

    const data = await res.json();

    // ✅ FIX
    setOffers(Array.isArray(data.offers) ? data.offers : []);
  } catch (err) {
    console.error("Error searching offers:", err);
  } finally {
    setLoading(false);
  }
};


  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
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
          <option value="expired">Expired</option>
        </select>
        <input
          type="number"
          name="page"
          value={filters.page}
          onChange={handleFilterChange}
          className="border rounded-lg px-3 py-2"
        />
        <input
          type="number"
          name="limit"
          value={filters.limit}
          onChange={handleFilterChange}
          className="border rounded-lg px-3 py-2"
        />

        <Button
          onClick={fetchSearchOffers}
          className="bg-[#ec2227] hover:bg-[#d41e23] text-white rounded-xl sm:col-span-2 md:col-span-3"
        >
          Search
        </Button>
      </div>


      {/* Loading State */}
      {loading && <p className="text-gray-600">Loading offers...</p>}

      {/* List */}
      <div className="space-y-4">

        {offers.length === 0 && !loading ? (
    <p className="text-gray-500 text-center py-10">No offers found</p>
  ) : (


        offers.map((o) => (
          <Card key={o.id} className="p-4 sm:p-5 rounded-2xl">
            <div className="flex gap-4">
              {/* Left icon */}
              <div className="shrink-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-[#ec2227]" />
                </div>
              </div>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                {/* Title + right discount */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    {o.title}
                  </h3>
                  <span className="text-[#ec2227] font-semibold text-sm sm:text-base whitespace-nowrap">
                    {o.discountText}
                  </span>
                </div>

                {/* Vendor + chips */}
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-gray-700">{o.vendor}</span>

                  {/* VendorType chip */}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      o.vendorType === "Member"
                        ? "bg-red-100 text-[#ec2227]"
                        : "bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    {o.vendorType}
                  </span>

                  {/* Category chip */}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs">
                    <Tag className="w-3 h-3" />
                    {o.category}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-3 text-sm text-gray-600">{o.description}</p>

                {/* Bottom row */}
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarDays className="w-4 h-4" />
                    <span>
                      Expires:{" "}
                      {new Date(o.expiresAt).toLocaleDateString(undefined, {
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

                {/* Note strip */}
                <div className="mt-3 flex items-start gap-2 text-xs sm:text-sm text-gray-600 bg-gray-100 rounded-xl p-3">
                  <Info className="w-4 h-4 shrink-0 text-gray-500" />
                  <span className="leading-relaxed">{o.note}</span>
                </div>
              </div>
            </div>
          </Card>
         ))
  )}
      </div>

      {/* Add Offer Modal (simple UI, no API yet) */}
      {open && (
        <AddOfferModal
          onClose={() => setOpen(false)}
          onSave={handleAdd}
        />
      )}
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
  const [form, setForm] = useState<Offer>({
    id: "",
    title: "",
    vendor: "",
    vendorType: "Member",
    category: "",
    description: "",
    discountText: "",
    expiresAt: "",
    note: "",
  });

  const update = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      {/* Panel */}
      <div className="absolute inset-x-4 sm:inset-x-auto sm:right-6 top-10 sm:top-12 bg-white rounded-2xl shadow-2xl w-auto sm:w-[520px] p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#ec2227]" />
            <h4 className="text-lg font-semibold">Add Offer</h4>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <LabeledInput
            label="Offer Title"
            name="title"
            placeholder="e.g. 20% Off Legal Consultation"
            value={form.title}
            onChange={update}
          />
          <LabeledInput
            label="Vendor"
            name="vendor"
            placeholder="e.g. Elite Legal Solutions"
            value={form.vendor}
            onChange={update}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vendor Type
              </label>
              <select
                name="vendorType"
                value={form.vendorType}
                onChange={update}
                className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-[#ec2227] focus:outline-none"
              >
                <option value="Member">Member</option>
                <option value="Partner">Partner</option>
              </select>
            </div>
            <LabeledInput
              label="Category"
              name="category"
              placeholder="e.g. Professional Services"
              value={form.category}
              onChange={update}
            />
          </div>

          <LabeledInput
            label="Discount Text"
            name="discountText"
            placeholder="e.g. 20% Off"
            value={form.discountText}
            onChange={update}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <LabeledInput
              label="Expiry Date"
              name="expiresAt"
              type="date"
              value={form.expiresAt}
              onChange={update}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={update}
              rows={3}
              placeholder="Write a short description..."
              className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-[#ec2227] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note (small gray strip)
            </label>
            <input
              type="text"
              name="note"
              value={form.note}
              onChange={update}
              placeholder="e.g. Valid for new clients only..."
              className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-[#ec2227] focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <Button
            onClick={onClose}
            variant="outline"
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onSave(form)}
            className="bg-[#ec2227] hover:bg-[#d41e23] text-white rounded-xl"
          >
            Save Offer
          </Button>
        </div>
      </div>
    </div>
  );
}

function LabeledInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
  }
) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        {...rest}
        className={
          "w-full border rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-[#ec2227] focus:outline-none " +
          (props.className || "")
        }
      />            
    </div>
  );
}



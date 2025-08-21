// // src/components/AddBusinessModal.tsx
// import React from "react";

// interface AddBusinessModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (e: React.FormEvent) => void;
//   business: any;
//   setBusiness: React.Dispatch<React.SetStateAction<any>>;
//   states: string[];
//   industry: string[];
//   tagOptions: string[];
//   handleChange: (e: React.ChangeEvent<any>) => void;
//   handleTagToggle: (tag: string) => void;
// }

// export default function AddBusinessModal({
//   isOpen,
//   onClose,
//   onSubmit,
//   business,
//   states,
//   industry, 
//   handleChange,
// }: AddBusinessModalProps) {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50">
//       <div
//         className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//         onClick={onClose}
//       ></div>

//       <div className="relative bg-white rounded shadow-lg p-6 w-full max-w-lg z-10">
//         <h2 className="text-2xl font-bold mb-4">Add Business Listing</h2>
//         <form onSubmit={onSubmit} className="space-y-4">
//           {/* Business Name */}
//           <input
//             name="name"
//             value={business.name}
//             onChange={handleChange}
//             placeholder="Business Name"
//             className="w-full border p-2 rounded"
//           />

//           {/* Owner / Title */}
//           <input
//             name="owner"
//             value={business.owner}
//             onChange={handleChange}
//             placeholder="Owner / Title"
//             className="w-full border p-2 rounded"
//           />

//           {/* Industry */}
//           {/* <input
//             name="industry"
//             value={business.industry || ""}
//             onChange={handleChange}
//             placeholder="Industry (e.g. Technology & IT)"
//             className="w-full border p-2 rounded"
//           /> */}

//            <select
//             name="industry"
//             value={business.industry || ""}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//           >
//             <option value="">Select Industry</option>
//             {industry.map((s) => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>

//           {/* State */}
//           <select
//             name="location"
//             value={business.location}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//           >
//             <option value="">Select State</option>
//             {states.map((s) => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>

//           {/* City */}
//           <input
//             name="city"
//             value={business.city || ""}
//             onChange={handleChange}
//             placeholder="City"
//             className="w-full border p-2 rounded"
//           />

//           {/* About */}
//           <textarea
//             name="about"
//             value={business.about || ""}
//             onChange={handleChange}
//             placeholder="About Business"
//             className="w-full border p-2 rounded"
//           />

//           {/* Services */}
//           <input
//             name="services"
//             value={business.services || ""}
//             onChange={handleChange}
//             placeholder="Services (comma separated)"
//             className="w-full border p-2 rounded"
//           />

//           {/* Industries Served */}
//           <input
//             name="industriesServed"
//             value={business.industriesServed || ""}
//             onChange={handleChange}
//             placeholder="Industries Served (comma separated)"
//             className="w-full border p-2 rounded"
//           />

//           {/* Looking For */}
//           <input
//             name="lookingFor"
//             value={business.lookingFor || ""}
//             onChange={handleChange}
//             placeholder="Looking For (e.g. Partnerships, Investors)"
//             className="w-full border p-2 rounded"
//           />

//           {/* Rating */}
//           <input
//             name="rating"
//             value={business.rating}
//             onChange={handleChange}
//             placeholder="Rating (0 - 5)"
//             className="w-full border p-2 rounded"
//             type="number"
//             min="0"
//             max="5"
//             step="0.1"
//           />

//           {/* Contact Info */}
//           <input
//             name="phone"
//             value={business.phone}
//             onChange={handleChange}
//             placeholder="Phone"
//             className="w-full border p-2 rounded"
//           />
//           <input
//             name="email"
//             value={business.email}
//             onChange={handleChange}
//             placeholder="Email"
//             className="w-full border p-2 rounded"
//           />
//           <input
//             name="website"
//             value={business.website || ""}
//             onChange={handleChange}
//             placeholder="Website"
//             className="w-full border p-2 rounded"
//           />

//           {/* Social Links */}
//           <input
//             name="socialLinks"
//             value={business.socialLinks || ""}
//             onChange={handleChange}
//             placeholder="Social Links (comma separated URLs)"
//             className="w-full border p-2 rounded"
//           />

//           <div className="flex justify-end gap-2 mt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 rounded bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="bg-red-500 text-white py-2 px-4 rounded font-bold"
//             >
//               Add Business
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// src/components/AddBusinessModal.tsx
import React from "react";

interface AddBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  business: any;
  setBusiness: React.Dispatch<React.SetStateAction<any>>;
  states: string[];
  industry: string[];
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
  industry,
  handleChange,
}: AddBusinessModalProps) {
  if (!isOpen) return null;

  // Handle comma-separated inputs for services and industriesServed
  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusiness((prev: any) => ({
      ...prev,
      [name]: value ? value.split(",").map((item) => item.trim()) : [],
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded shadow-lg p-6 w-full max-w-lg z-10">
        <h2 className="text-2xl font-bold mb-4">Add Business Listing</h2>
        <form onSubmit={onSubmit} className="space-y-4">
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
            placeholder="Owner / Title"
            className="w-full border p-2 rounded"
          />
          <select
            name="industry"
            value={business.industry || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Industry</option>
            {industry.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
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
          <input
            name="city"
            value={business.city || ""}
            onChange={handleChange}
            placeholder="City"
            className="w-full border p-2 rounded"
          />
          <textarea
            name="about"
            value={business.about || ""}
            onChange={handleChange}
            placeholder="About Business"
            className="w-full border p-2 rounded"
          />
          <input
            name="services"
            value={business.services.join(", ") || ""}
            onChange={handleArrayInputChange} // Use custom handler
            placeholder="Services (comma separated)"
            className="w-full border p-2 rounded"
          />
          <input
            name="industriesServed"
            value={business.industriesServed.join(", ") || ""}
            onChange={handleArrayInputChange} // Use custom handler
            placeholder="Industries Served (comma separated)"
            className="w-full border p-2 rounded"
          />
          <input
            name="lookingFor"
            value={business.lookingFor || ""}
            onChange={handleChange}
            placeholder="Looking For (e.g. Partnerships, Investors)"
            className="w-full border p-2 rounded"
          />
          <input
            name="rating"
            value={business.rating}
            onChange={handleChange}
            placeholder="Rating (0 - 5)"
            className="w-full border p-2 rounded"
            type="number"
            min="0"
            max="5"
            step="0.1"
          />
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
            name="website"
            value={business.website || ""}
            onChange={handleChange}
            placeholder="Website"
            className="w-full border p-2 rounded"
          />
          <input
            name="socialLinks"
            value={business.socialLinks.map((link: any) => link.url).join(", ") || ""}
            onChange={(e) =>
              setBusiness((prev: any) => ({
                ...prev,
                socialLinks: e.target.value
                  ? e.target.value.split(",").map((url) => ({
                      platform: "Link",
                      url: url.trim(),
                    }))
                  : [],
              }))
            }
            placeholder="Social Links (comma separated URLs)"
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
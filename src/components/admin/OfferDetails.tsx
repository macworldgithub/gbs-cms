// import React, { useEffect, useState } from "react";
// import { Button } from "../ui/button";
// import { Card } from "../ui/card";
// import { CalendarDays, LocateIcon, Mail, Phone, FileText } from "lucide-react";
// import { VITE_API_BASE_URL as API_BASE_URL } from "../../utils/config/server";

// type OfferDetails = {
//   _id: string;
//   title: string;
//   discount: string;
//   description: string;
//   termsAndConditions: string[];
//   howToRedeem: string;
//   contactPhone: string;
//   contactEmail: string;
//   locations: string[];
//   expiryDate: string;
//   image?: string;
// };

// export default function OfferDetailsModal({
//   offerId,
//   onClose,
// }: {
//   offerId: string;
//   onClose: () => void;
// }) {
//   const [offer, setOffer] = useState<OfferDetails | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch Single Offer by ID
//   useEffect(() => {
//     const fetchOfferDetails = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${API_BASE_URL}/offer/${offerId}`);
//         const data = await res.json();
//         setOffer(data);
//       } catch (error) {
//         console.error("Error fetching offer details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOfferDetails();
//   }, [offerId]);

//   if (loading) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
//         <Card className="p-6">Loading...</Card>
//       </div>
//     );
//   }

//   if (!offer) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
//       <Card className="p-6 max-w-lg w-full space-y-4">
//         <h2 className="text-xl font-bold">{offer.title}</h2>
//         <p className="text-red-500">{offer.discount}</p>
//         <p className="text-gray-700">{offer.description}</p>

//         <p className="flex items-center text-sm text-gray-600">
//           <CalendarDays className="w-4 h-4 mr-1" />
//           Expires: {new Date(offer.expiryDate).toLocaleDateString()}
//         </p>

//         <p className="flex items-center text-sm text-gray-600">
//           <LocateIcon className="w-4 h-4 mr-1" />
//           {offer.locations.join(", ")}
//         </p>

//         {offer.contactPhone && (
//           <p className="flex items-center text-sm text-gray-600">
//             <Phone className="w-4 h-4 mr-1" /> {offer.contactPhone}
//           </p>
//         )}

//         {offer.contactEmail && (
//           <p className="flex items-center text-sm text-gray-600">
//             <Mail className="w-4 h-4 mr-1" /> {offer.contactEmail}
//           </p>
//         )}

//         {offer.termsAndConditions?.length > 0 && (
//           <div>
//             <h4 className="font-semibold mt-2 flex items-center">
//               <FileText className="w-4 h-4 mr-1" /> Terms & Conditions
//             </h4>
//             <ul className="list-disc ml-6 text-sm text-gray-700">
//               {offer.termsAndConditions.map((term, idx) => (
//                 <li key={idx}>{term}</li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {offer.howToRedeem && (
//           <div>
//             <h4 className="font-semibold mt-2">How to Redeem</h4>
//             <p className="text-sm text-gray-700">{offer.howToRedeem}</p>
//           </div>
//         )}

//         <div className="flex justify-end">
//           <Button onClick={onClose}>Close</Button>
//         </div>
//       </Card>
//     </div>
//   );
// }

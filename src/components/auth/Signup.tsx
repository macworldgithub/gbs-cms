// import React, { useState } from "react";
// import axios from "axios";
// import { useAuth } from "../../contexts/AuthContext";
// import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
// const SignupPage: React.FC = () => {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phone: "",
//   });
//   const [showPassword, setShowPassword] = useState(false);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const { login } = useAuth();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.post(
//         "https://gbs.westsidecarcare.com.au/user/auth/signup",
//         {
//           name: form.name,
//           email: form.email,
//           password: form.password,
//           phone: form.phone,
//         },
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       console.log("✅ Signup success:", response.data);

//       const { token, user } = response.data;

//       // direct login + redirect dashboard
//       login(token, user);

//     } catch (err: any) {
//       console.error("❌ Signup Error:", err.response?.data || err.message);
//       setError(err.response?.data?.message || "Signup failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md">
//         <h2 className="text-2xl font-bold text-center mb-6">Signup</h2>

//           <p className="text-sm text-gray-600 mb-6">
//           Already have an account?{" "}
//           <a href="/Login" className="text-red-600 font-semibold hover:underline">
//             Login
//           </a>
//         </p>

//         {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

//  <form onSubmit={handleSubmit} className="space-y-4">
//       {/* Full Name */}
//       <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-red-500">
//         <FaUser className="text-gray-500 mr-2" />
//         <input
//           type="text"
//           name="name"
//           value={form.name}
//           onChange={handleChange}
//           placeholder="Full Name"
//           required
//           className="w-full bg-transparent outline-none"
//         />
//       </div>

//       {/* Email */}
//       <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-red-500">
//         <FaEnvelope className="text-gray-500 mr-2" />
//         <input
//           type="email"
//           name="email"
//           value={form.email}
//           onChange={handleChange}
//           placeholder="Email"
//           required
//           className="w-full bg-transparent outline-none"
//         />
//       </div>

//       {/* Password with show/hide */}
//       <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-red-500">
//         <FaLock className="text-gray-500 mr-2" />
//         <input
//           type={showPassword ? "text" : "password"}
//           name="password"
//           value={form.password}
//           onChange={handleChange}
//           placeholder="Password"
//           required
//           className="w-full bg-transparent outline-none"
//         />
//         <button
//           type="button"
//           onClick={() => setShowPassword(!showPassword)}
//           className="ml-2 text-gray-500 focus:outline-none"
//         >
//           {showPassword ? <FaEyeSlash /> : <FaEye />}
//         </button>
//       </div>

//       {/* Phone */}
//       <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-red-500">
//         <FaPhone className="text-gray-500 mr-2" />
//         <input
//           type="text"
//           name="phone"
//           value={form.phone}
//           onChange={handleChange}
//           placeholder="Phone"
//           required
//           className="w-full bg-transparent outline-none"
//         />
//       </div>

//       {/* Button */}
//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold"
//       >
//         {loading ? "Signing up..." : "Signup"}
//       </button>
//     </form>

//       </div>
//     </div>
//   );
// };

// export default SignupPage;

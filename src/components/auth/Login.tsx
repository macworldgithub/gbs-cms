// import React, { useState } from "react";
// import axios from "axios";
// import { useAuth } from "../../contexts/AuthContext";
// import { FaEnvelope, FaLock } from "react-icons/fa";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const Login: React.FC = () => {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [showPassword, setShowPassword] = useState(false);

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
//         "https://gbs.westsidecarcare.com.au/user/auth/signin",
//         {
//           email: form.email,
//           password: form.password,
//         },
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       const { token, user } = response.data;
//       login(token, user);
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Login failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
//       <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 sm:p-8">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">
//           Sign in to your account
//         </h2>
//         <p className="text-sm text-gray-600 mb-6">
//           Don’t have an account?{" "}
//           <a href="/Signup" className="text-red-600 font-semibold hover:underline">
//             Sign Up
//           </a>
//         </p>

//         {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Email Input */}
//           <div className="flex items-center border rounded-lg px-3 py-2">
//             <FaEnvelope className="text-gray-400 mr-2" />
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder="Email"
//               required
//               className="w-full outline-none"
//             />
//           </div>

//           {/* Password Input */}
//           <div className="flex items-center border rounded-lg px-3 py-2">
//             <FaLock className="text-gray-400 mr-2" />
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               placeholder="Password"
//               required
//               className="w-full outline-none"
//             />
//            <button
//   type="button"
//   onClick={() => setShowPassword(!showPassword)}
//   className="text-gray-500 ml-2 focus:outline-none"
// >
//   {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
// </button>
//           </div>

//           {/* Remember me + Forgot Password */}
//           <div className="flex items-center justify-between text-sm">
//             <label className="flex items-center space-x-2">
//               <input type="checkbox" className="text-red-600" />
//               <span className="text-gray-700">Remember me</span>
//             </label>
//                   </div>

//           {/* Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-lg font-semibold hover:opacity-90"
//           >
//             {loading ? "Logging in..." : "Sign In"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

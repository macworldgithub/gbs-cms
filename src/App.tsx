// import { Routes, Route, Navigate } from "react-router-dom";
// import { useAuth } from "./contexts/AuthContext";
// import { AdminDashboard } from "./components/admin/AdminDashboard";
// import Login from "./components/auth/Login";
// import Signup from "./components/auth/Signup";

// function App() {
//   const { isAuthenticated } = useAuth();

//   return (
//     <Routes>
//       {/* agar login nahi hai to Signup/Login */}
//       <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
//       <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />} />

//       {/* agar login hai to dashboard */}
//       <Route path="/dashboard" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />

//       {/* default route */}
//       <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
//     </Routes>
//   );
// }

// export default App;
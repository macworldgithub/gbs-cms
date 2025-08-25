// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import { AppProvider } from "./contexts/AppContext";
// import { LanguageProvider } from "./contexts/LanguageContext";
// import { EventProvider } from "./contexts/EventContext";
// import { ChatProvider } from "./contexts/ChatContext";
// import { RoleProvider } from "./contexts/RoleContext";
// import { PermissionProvider } from "./contexts/PermissionContext";
// import { AuthProvider } from "./contexts/AuthContext";
// import App from "./App";  
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "../index.css";

// createRoot(document.getElementById("app") as HTMLElement).render(
//   <StrictMode>
//     <AppProvider>
//       <LanguageProvider>
//         <EventProvider>
//           <ChatProvider>
//             <RoleProvider>
//               <PermissionProvider>
//                 <AuthProvider>
//                   <BrowserRouter>
//                     <App />
//                     <ToastContainer position="top-right" autoClose={3000} />
//                   </BrowserRouter>
//                 </AuthProvider>
//               </PermissionProvider>
//             </RoleProvider>
//           </ChatProvider>
//         </EventProvider>
//       </LanguageProvider>
//     </AppProvider>
//   </StrictMode>
// );


import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AppProvider } from "./contexts/AppContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { EventProvider } from "./contexts/EventContext";
import { ChatProvider } from "./contexts/ChatContext";
import { RoleProvider } from "./contexts/RoleContext";
import { PermissionProvider } from "./contexts/PermissionContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../index.css";
createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <AppProvider>
      <LanguageProvider>
        <EventProvider>
          <ChatProvider>
            <RoleProvider>
              <PermissionProvider>
                 <>
                  <AdminDashboard />
                  <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    closeOnClick
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                  />
                </>
              </PermissionProvider>
            </RoleProvider>
          </ChatProvider>
        </EventProvider>
      </LanguageProvider>
    </AppProvider>
  </StrictMode>
);

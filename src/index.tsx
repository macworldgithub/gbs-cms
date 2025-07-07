import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AppProvider } from "./contexts/AppContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { EventProvider } from "./contexts/EventContext";
import { ChatProvider } from "./contexts/ChatContext";
import { RoleProvider } from "./contexts/RoleContext";
import { PermissionProvider } from "./contexts/PermissionContext";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <AppProvider>
      <LanguageProvider>
        <EventProvider>
          <ChatProvider>
            <RoleProvider>
              <PermissionProvider>
                <AdminDashboard />
              </PermissionProvider>
            </RoleProvider>
          </ChatProvider>
        </EventProvider>
      </LanguageProvider>
    </AppProvider>
  </StrictMode>,
);
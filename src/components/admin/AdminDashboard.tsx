import React, { useEffect, useState } from "react";
import { VITE_API_BASE_URL as API_BASE_URL } from "../../utils/config/server";
import {
  UsersIcon,
  CalendarIcon,
  MessageSquareIcon,
  LanguagesIcon,
  BarChart3Icon,
  SettingsIcon,
  ShieldIcon,
  ShieldCheckIcon,
  Gift,
} from "lucide-react";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { UserManager } from "./UserManager";
import { EventManager } from "./EventManager";
import { ChatManager } from "./ChatManager";
import { RoleManager } from "./RoleManager";
import { PermissionManager } from "./PermissionManager";
import { LanguageManager } from "../LanguageManager";
import NotificationMain from "./Notification";
import BusinessManager from "./BusinessManager";
import Offers from "./Offers";
import axios from "axios";

type AdminSection =
  | "overview"
  | "users"
  | "events"
  | "chats"
  | "roles"
  | "permissions"
  | "languages"
  | "notification"
  | "settings"
  | "business"
  | "offers";

export const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");

  const menuItems = [
    { id: "overview", label: "Overview", icon: BarChart3Icon },
    { id: "users", label: "Users", icon: UsersIcon },
    // { id: "events", label: "Events", icon: CalendarIcon },
    // { id: "chats", label: "Chats", icon: MessageSquareIcon },
    { id: "roles", label: "Roles", icon: ShieldIcon },
    { id: "permissions", label: "Permissions", icon: ShieldCheckIcon },
    // { id: "languages", label: "Languages", icon: LanguagesIcon },
    { id: "business", label: "Business", icon: BarChart3Icon },
        { id: "offers", label: "Offers", icon: Gift },
    // { id: "settings", label: "Settings", icon: SettingsIcon },
    { id: "notification", label: "Notification", icon: Bell },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <AdminOverview />;
      case "users":
        return <UserManager />;
      case "events":
        return <EventManager />;
      case "chats":
        return <ChatManager />;
      case "roles":
        return <RoleManager />;
      case "permissions":
        return <PermissionManager />;
      case "languages":
        return <LanguageManager />;
      case "settings":
        return <AdminSettings />;
      case "notification":
        return <NotificationMain />;
      case "business":
        return <BusinessManager />;
      case "offers":
        return <Offers />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        <nav className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                onClick={() => setActiveSection(item.id as AdminSection)}
                variant={activeSection === item.id ? "default" : "ghost"}
                className={`w-full justify-start mb-2 ${
                  activeSection === item.id
                    ? "bg-[#ec2227] text-white hover:bg-[#d41e23]"
                    : "hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{renderContent()}</div>
    </div>
  );
};

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBusinesses: 0,
    totalRoles: 0,
    totalOffers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/analytics/dashboard-counts`
        );
        setStats({
          totalUsers: res.data.totalUsers,
          totalBusinesses: res.data.totalBusinesses,
          totalOffers: res.data.totalOffers,
          totalRoles: res.data.totalRoles,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Dashboard Overview
      </h2>
       {loading ? (
        <p>Loading stats...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalUsers}
                </p>
              </div>
              <UsersIcon className="w-8 h-8 text-[#ec2227]" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Businesses
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalBusinesses}
                </p>
              </div>
              <BarChart3Icon className="w-8 h-8 text-[#ec2227]" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Offers
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalOffers}
                </p>
              </div>
              <Gift className="w-8 h-8 text-[#ec2227]" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Roles</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalRoles}
                </p>
              </div>
              <ShieldIcon className="w-8 h-8 text-[#ec2227]" />
            </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">New user registered</span>
              <span className="text-xs text-gray-400 ml-auto">2 min ago</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Event created</span>
              <span className="text-xs text-gray-400 ml-auto">5 min ago</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">New role assigned</span>
              <span className="text-xs text-gray-400 ml-auto">10 min ago</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Permission updated</span>
              <span className="text-xs text-gray-400 ml-auto">15 min ago</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Button className="w-full justify-start bg-[#ec2227] hover:bg-[#d41e23]">
              <UsersIcon className="w-4 h-4 mr-2" />
              Add New User
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Create Event
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <ShieldIcon className="w-4 h-4 mr-2" />
              Manage Roles
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <LanguagesIcon className="w-4 h-4 mr-2" />
              Manage Languages
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const AdminSettings: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Application Configuration
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Application Name
            </label>
            <input
              type="text"
              defaultValue="Event Management App"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Language
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2227]">
              <option value="en">English</option>
              <option value="id">Indonesian</option>
              <option value="zh">Chinese</option>
              <option value="ko">Korean</option>
            </select>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="maintenance" className="mr-2" />
            <label
              htmlFor="maintenance"
              className="text-sm font-medium text-gray-700"
            >
              Maintenance Mode
            </label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="rbac" defaultChecked className="mr-2" />
            <label htmlFor="rbac" className="text-sm font-medium text-gray-700">
              Enable Role-Based Access Control
            </label>
          </div>
          <Button className="bg-[#ec2227] hover:bg-[#d41e23] text-white">
            Save Settings
          </Button>
        </div>
      </Card>
    </div>
  );
};

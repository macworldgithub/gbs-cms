import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Check,
  X,
  Users,
  Search,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Role } from "../types/role";
import { roleService } from "../services/roleService";

interface RoleSelectorProps {
  selectedRoleIds: string[];
  onRoleChange: (roleIds: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRoleIds,
  onRoleChange,
  placeholder = "Select roles...",
  className = "",
}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching roles...");

      const data = await roleService.findAll();
      console.log("Roles fetched successfully:", data);
      setRoles(data);

      if (data.length === 0) {
        setError("No roles available. Please create some roles first.");
      }
    } catch (err) {
      const errorMessage =
        "Failed to fetch roles. Please check your API connection.";
      setError(errorMessage);
      console.error("Error fetching roles:", err);

      // Set some mock data for development if API fails
      const mockRoles: Role[] = [
        {
          _id: "1",
          name: "admin",
          label: "Administrator",
          permissions: [{ permission: "all", value: true, _id: "1" }],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          __v: 0,
        },
        {
          _id: "2",
          name: "user",
          label: "Regular User",
          permissions: [{ permission: "read", value: true, _id: "2" }],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          __v: 0,
        },
      ];
      setRoles(mockRoles);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRoles = roles
    .filter((role) =>
      role.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      //@ts-ignore
      (role) => !selectedRoleIds.some((selected) => selected._id === role._id)
    );

  //@ts-ignore
  const selectedRoleIdsOnly = selectedRoleIds.map((r) => r._id);

  const selectedRoles = roles.filter((role) =>
    selectedRoleIdsOnly.includes(role._id)
  );

  const handleRoleToggle = (roleId: string) => {
    // Normalize the selected roles to just their IDs
    const selectedIds = selectedRoleIds.map((r: any) =>
      typeof r === "string" ? r : r._id
    );

    const isSelected = selectedIds.includes(roleId);

    if (isSelected) {
      // Remove by filtering out the role
      const updated = selectedRoleIds.filter(
        (r: any) => (typeof r === "string" ? r : r._id) !== roleId
      );
      onRoleChange(updated);
      console.log(updated, "Removed role");
    } else {
      const role = roles.find((r) => r._id === roleId);
      if (role) {
        const updated = [...selectedRoleIds, role];
        //@ts-ignore
        onRoleChange(updated);
        console.log(updated, "Added role");
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Users className="w-4 h-4 inline mr-1" />
        Roles
        {selectedRoles.length > 0 && (
          <span className="ml-2 text-xs text-blue-600 font-normal">
            ({selectedRoles.length} selected)
          </span>
        )}
      </label>

      {/* Selected roles display */}
      {/* {selectedRoles.length > 0 && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex flex-wrap gap-2">
            {selectedRoles.map((role) => (
              <span
                key={role._id}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
              >
                {role.label}
                <button
                  type="button"
                  onClick={() => handleRemoveRole(role._id)}
                  className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-600 hover:bg-blue-200 hover:text-blue-800 focus:outline-none transition-colors"
                  title={`Remove ${role.label}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedRoles.length > 1 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center px-2 py-1 rounded text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-100 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )} */}

      {/* Dropdown trigger */}
      <div
        className="relative w-full px-4 py-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <span
            className={`${
              selectedRoles.length > 0
                ? "text-gray-900 font-medium"
                : "text-gray-500"
            }`}
          >
            {selectedRoles.length > 0
              ? `${selectedRoles.length} role${
                  selectedRoles.length > 1 ? "s" : ""
                } selected`
              : placeholder}
          </span>
          <div className="flex items-center space-x-2">
            {isLoading && (
              <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />
            )}
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search input */}
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <RefreshCw className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2" />
                <span>Loading roles...</span>
              </div>
            ) : error ? (
              <div className="p-4 text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-600 text-sm mb-2">{error}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    fetchRoles();
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  Try Again
                </button>
              </div>
            ) : filteredRoles.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm">
                  {searchTerm
                    ? "No roles found matching your search."
                    : "No roles available."}
                </p>
                {!searchTerm && (
                  <p className="text-xs text-gray-400 mt-1">
                    Contact your administrator to create roles.
                  </p>
                )}
              </div>
            ) : (
              filteredRoles.map((role) => (
                <div
                  key={role._id}
                  className="flex items-center px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleToggle(role._id);
                  }}
                >
                  <div className="flex items-center justify-center w-5 h-5 mr-3">
                    {selectedRoleIds.includes(role._id) && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {role.label}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {role.name} • {role.permissions.length} permission
                      {role.permissions.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  {selectedRoleIds.includes(role._id) && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer with role count */}
          {!isLoading && !error && filteredRoles.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                {filteredRoles.length} role
                {filteredRoles.length !== 1 ? "s" : ""} available
                {selectedRoles.length > 0 &&
                  ` • ${selectedRoles.length} selected`}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

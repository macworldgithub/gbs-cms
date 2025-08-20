"use client";
import React from "react";
import { Modal } from "antd";
import { Button, Input } from "antd";
import { toast } from "react-toastify";

interface EditBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: any;
  setBusiness: React.Dispatch<React.SetStateAction<any>>;
  onUpdate: (id: string) => void;
}

export default function EditBusinessModal({
  isOpen,
  onClose,
  business,
  setBusiness,
  onUpdate,
}: EditBusinessModalProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusiness((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      className="backdrop-blur-sm"
      bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }} // scrollable content
    >
      <h2 className="text-xl font-bold mb-4">Edit Business</h2>

      <div className="flex flex-col gap-3">
  <Input
    name="name"
    value={business.name}
    onChange={handleChange}
    placeholder="Business Name"
  />
  <Input
    name="owner"
    value={business.owner}
    onChange={handleChange}
    placeholder="Owner"
  />
  <Input
    name="industry"
    value={business.industry}
    onChange={handleChange}
    placeholder="Industry"
  />
  <Input
    name="city"
    value={business.city}
    onChange={handleChange}
    placeholder="City"
  />
  <Input
    name="state"
    value={business.state}
    onChange={handleChange}
    placeholder="State"
  />
  <Input
    name="about"
    value={business.about}
    onChange={handleChange}
    placeholder="About"
  />
  <Input
    name="phone"
    value={business.phone}
    onChange={handleChange}
    placeholder="Phone"
  />
  <Input
    name="email"
    value={business.email}
    onChange={handleChange}
    placeholder="Email"
  />
  <Input
    name="website"
    value={business.website}
    onChange={handleChange}
    placeholder="Website"
  />
  <Input
    name="rating"
    value={business.rating}
    onChange={handleChange}
    placeholder="Rating"
  />
  <Input
    name="lookingFor"
    value={business.lookingFor}
    onChange={handleChange}
    placeholder="Looking For"
  />
  <Input
    name="services"
    value={business.services?.join(", ")}
    onChange={(e) =>
      setBusiness((prev: any) => ({
        ...prev,
        services: e.target.value.split(",").map((s) => s.trim()),
      }))
    }
    placeholder="Services (comma separated)"
  />
  <Input
    name="industriesServed"
    value={business.industriesServed?.join(", ")}
    onChange={(e) =>
      setBusiness((prev: any) => ({
        ...prev,
        industriesServed: e.target.value.split(",").map((s) => s.trim()),
      }))
    }
    placeholder="Industries Served (comma separated)"
  />
  <Input
    name="socialLinks"
    value={
      Array.isArray(business.socialLinks)
        ? business.socialLinks.map((s: any) => s.url).join(", ")
        : ""
    }
    onChange={(e) =>
      setBusiness((prev: any) => ({
        ...prev,
        socialLinks: e.target.value.split(",").map((url) => ({
          platform: "Link",
          url: url.trim(),
        })),
      }))
    }
    placeholder="Social Links (comma separated)"
  />
</div>


      <div className="flex justify-end gap-2 mt-6">
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="primary"
          className="bg-[#ec2227]"
          onClick={() => onUpdate(business._id || business.id)}
        >
          Update
        </Button>
      </div>
    </Modal>
  );
}

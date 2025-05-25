"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/dash-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import AppointmentFormSkeleton from "./loading";

export default function ScheduleAppointmentPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  // form state
  const [form, setForm] = useState({
    clerkId: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    location: "",
    status: "Pending",
    details: "",
  });

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [doctorAdding, setDoctorAdding] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [newDoctorName, setNewDoctorName] = useState("");
  const [newDoctorAddress, setNewDoctorAddress] = useState("");

  const STATUS_OPTIONS = [
    { value: "Pending", label: "Pending" },
    { value: "Confirmed", label: "Confirmed" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  // Generic form updater
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Controlled select updater
  const handleSelect = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Doctor‐specific handler: if “Other”, open dialog; otherwise pick from list and prefill location
  const handleDoctorSelect = (val) => {
    if (val === "other") {
      setShowAddDoctor(true);
      setForm((f) => ({ ...f, doctorId: "", location: "" }));
    } else {
      setShowAddDoctor(false);
      const doc = doctors.find((d) => d.doctorId === val);
      handleSelect("doctorId", val);
      if (doc?.address) {
        handleSelect("location", doc.address);
      }
    }
  };

  // load Clerk user ID
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setForm((f) => ({ ...f, clerkId: user.id }));
    }
  }, [isLoaded, isSignedIn, user]);

  // fetch doctors list
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    (async () => {
      try {
        const res = await fetch("/api/get-doctors");
        if (!res.ok) throw new Error("Failed to fetch doctors");
        const { doctorData } = await res.json();
        setDoctors(
          doctorData.map((doc) => ({
            doctorId: String(doc.doctorId),
            doctorName: doc.doctorName,
            address: doc.address,
          }))
        );
      } catch (err) {
        toast.error(err.message || "Something went wrong.");
      }
    })();
  }, [isLoaded, isSignedIn]);

  // submit appointment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/add-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Failed to schedule");
      }

      // format for toast
      const formattedDate = new Date(form.appointmentDate).toLocaleDateString("en-GB");
      const [hour, minute] = form.appointmentTime.split(":");
      const dateObj = new Date();
      dateObj.setHours(+hour, +minute);
      const formattedTime = dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      toast.success("Appointment scheduled successfully", {
        description: `On ${formattedDate} at ${formattedTime} at ${form.location}`,
      });
      setTimeout(() => toast.dismiss(), 3000);
      router.push("/dashboard/appointments");
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  // show skeleton if loading
  if (!isLoaded || !isSignedIn || !user || doctors.length === 0) {
    return (
      <DashboardLayout>
        <AppointmentFormSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-6">Schedule Appointment</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {/* Doctor Select */}
          <div>
            <Label htmlFor="doctorId" className="my-2">
              Select Doctor
            </Label>
            <Select onValueChange={handleDoctorSelect} value={form.doctorId}>
              <SelectTrigger id="doctorId">
                <SelectValue placeholder="Choose a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doc) => (
                  <SelectItem key={doc.doctorId} value={doc.doctorId} className="hover:cursor-pointer">
                    {doc.doctorName} 
                  </SelectItem>
                ))}
                <SelectItem value="other" className={"hover:cursor-pointer"}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add Doctor Dialog */}
          <Dialog open={showAddDoctor} onOpenChange={setShowAddDoctor}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a New Doctor</DialogTitle>
                <DialogDescription>
                  Enter the name and address of the doctor.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-2 mt-4">
                <Label htmlFor="newDoctorName">Doctor’s Name</Label>
                <Input
                  id="newDoctorName"
                  value={newDoctorName}
                  onChange={(e) => setNewDoctorName(e.target.value)}
                  placeholder="Dr. Jane Doe"
                />
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <Label htmlFor="newDoctorAddress">Doctor’s Address</Label>
                <Input
                  id="newDoctorAddress"
                  value={newDoctorAddress}
                  onChange={(e) => setNewDoctorAddress(e.target.value)}
                  placeholder="123 Main St, City, Country"
                />
              </div>

              <DialogFooter className="mt-6 space-x-2">
                <Button
                  type="button"
                  onClick={async () => {
                    if (!newDoctorName.trim()) {
                      return toast.error("Doctor name required");
                    }
                    if (!newDoctorAddress.trim()) {
                      return toast.error("Doctor address required");
                    }
                    try {
                      setDoctorAdding(true);
                      const res = await fetch("/api/add-doctor", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          doctorName: newDoctorName,
                          doctorAddress: newDoctorAddress,
                        }),
                      });
                      if (!res.ok) throw new Error("Failed to add doctor");
                      const { doctor: newDoc } = await res.json();

                      // add into list, then select via the same handler
                      const formatted = {
                        doctorId: String(newDoc.doctorId),
                        doctorName: newDoc.doctorName,
                        address: newDoc.address,
                      };
                      setDoctors((prev) => [...prev, formatted]);
                      handleDoctorSelect(formatted.doctorId);

                      setShowAddDoctor(false);
                      setNewDoctorName("");
                      setNewDoctorAddress("");
                      toast.success("Doctor added successfully!");
                    } catch (err) {
                      toast.error(err.message || "Failed to add doctor");
                    } finally {
                      setDoctorAdding(false);
                    }
                  }}
                  disabled={doctorAdding}
                  className={"hover:cursor-pointer"}
                >
                  {doctorAdding ? "Adding..." : "Add Doctor"}
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setShowAddDoctor(false)}
                  className={"hover:cursor-pointer"}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="appointmentDate">Date</Label>
              <Input
                id="appointmentDate"
                name="appointmentDate"
                type="date"
                value={form.appointmentDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="appointmentTime">Time</Label>
              <Input
                id="appointmentTime"
                name="appointmentTime"
                type="time"
                value={form.appointmentTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(val) => handleSelect("status", val)}
              value={form.status}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Details */}
          <div>
            <Label htmlFor="details">Details</Label>
            <Textarea
              id="details"
              name="details"
              rows={4}
              value={form.details}
              onChange={handleChange}
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <Button type="submit" disabled={submitting} 
            className={"hover:cursor-pointer"}
            >
              {submitting ? "Scheduling..." : "Schedule Appointment"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

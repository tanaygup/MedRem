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
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import AppointmentFormSkeleton from "./loading";


export default function ScheduleAppointmentPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [form, setForm] = useState({
    clerkId: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    location: "",
    status: "pending",
    details: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [doctors, setDoctors] = useState([]);

  const STATUS_OPTIONS = [
    { value: "Pending", label: "Pending" },
    { value: "Confirmed", label: "Confirmed" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSelect = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
  };
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setForm((f) => ({ ...f, clerkId: user.id }));
    }
  }, [isLoaded, isSignedIn, user]);
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    const fetchDoctors = async () => {
      try {
        const res = await fetch("../../api/get-doctors");
        if (!res.ok) throw new Error("Failed to fetch doctors");
        const data = await res.json();
        setDoctors(data.doctorData);
      } catch (err) {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message || "Something went wrong.",
        });
      }
    };
    fetchDoctors();
  }, [isLoaded, isSignedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("../../api/add-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error((await res.json()).message || "Failed to schedule");


      const formattedDate = new Date(form.appointmentDate).toLocaleDateString(
        "en-GB"
      ); 
      const [hour, minute] = form.appointmentTime.split(":");
      const dateObj = new Date();
      dateObj.setHours(hour, minute);
      const formattedTime = dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      toast.success("Appointment scheduled successfully", {
        description: `On ${formattedDate} at ${formattedTime} at ${form.location}`,
      });
      setTimeout(() => {
        toast.dismiss();
      }
      , 3000);
      router.push("/dashboard/appointments");
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Something went wrong.",
      });
    } finally {
      setSubmitting(false);
    }
  };
  if (!isLoaded || !isSignedIn || !user || doctors.length == 0)
    return (
      <DashboardLayout><AppointmentFormSkeleton /></DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-6">Schedule Appointment</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {/* Doctor */}
          <div>
            <Label htmlFor="doctorId">Select Doctor</Label>
            <Select
              onValueChange={(val) => handleSelect("doctorId", val)}
              value={form.doctorId}
            >
              <SelectTrigger id="doctorId">
                <SelectValue placeholder="Choose a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doc) => (
                  <SelectItem key={doc.doctorId} value={String(doc.doctorId)}>
                    {doc.doctorName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
            <Button type="submit" disabled={submitting}>
              {submitting ? "Scheduling..." : "Schedule Appointment"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

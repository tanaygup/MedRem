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
import { useParams, useSearchParams, useRouter } from "next/navigation";
import AppointmentFormSkeleton from "./loading";

// Helper: normalize time strings into 24h "HH:MM" format
function normalizeTime(raw) {
  const trimmed = raw.trim().toLowerCase();
  // if already in 24h HH:MM, return directly
  if (/^\d{2}:\d{2}$/.test(trimmed)) return trimmed;
  // convert separators
  const clean = trimmed.replace('.', ':').replace(/\s+/, ' ');
  const parts = clean.split(' ');
  if (parts.length !== 2) return '';
  const timePart = parts[0];
  const modifier = parts[1];
  const [hStr, mStr] = timePart.split(':');
  let hours = parseInt(hStr, 10);
  const minutes = parseInt(mStr || '0', 10);
  if (modifier === 'pm' && hours < 12) hours += 12;
  if (modifier === 'am' && hours === 12) hours = 0;
  const hh = hours.toString().padStart(2, '0');
  const mm = minutes.toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

export default function ScheduleAppointmentPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { appointmentId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Grab raw params
  const rawDoctorId = searchParams.get("doctorId") || "";
  const rawDate = searchParams.get("appointmentDate") || "";
  const rawTimeRaw = searchParams.get("appointmentTime") || "";
  const rawLocation = searchParams.get("location") || "";
  const rawDetails = searchParams.get("details") || "";
  const rawStatus = searchParams.get("status") || "Pending";
  const rawDoctorName = searchParams.get("doctorName") || "";

  // Normalize time to HH:MM
  const rawTime = normalizeTime(rawTimeRaw);

  // Initialize form state from raw params once
  const [form, setForm] = useState({
    clerkId: "",
    doctorId: rawDoctorId,
    appointmentDate: rawDate,
    appointmentTime: rawTime,
    location: rawLocation,
    status: rawStatus,
    details: rawDetails,
  });
  const [submitting, setSubmitting] = useState(false);

  const STATUS_OPTIONS = [
    { value: "Pending", label: "Pending" },
    { value: "Confirmed", label: "Confirmed" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  // Stamp in clerkId when auth is ready
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setForm(f => ({ ...f, clerkId: user.id }));
    }
  }, [isLoaded, isSignedIn, user]);

  const handleChange = (
    e
  ) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSelect = (name, value) => {
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res= await fetch('../../../api/reschedule-appointment', {
        method:"PUT" ,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          appointmentId,
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to schedule appointment");
      }
      toast.success(
        `Appointment ${appointmentId ? 'updated' : 'scheduled'} successfully`
      );
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

  if (!isLoaded || !isSignedIn || !user) {
    return (
      <DashboardLayout>
        <AppointmentFormSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-6">
          {appointmentId ? "Update" : "Schedule"} Appointment
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {/* Doctor */}
          <div>
            <Label htmlFor="doctorId">Selected Doctor</Label>
            <Select value={form.doctorId} disabled>
              <SelectTrigger id="doctorId">
                <SelectValue placeholder="Select doctor" />
              </SelectTrigger>
              <SelectContent>
                {rawDoctorName && (
                  <SelectItem value={form.doctorId}>
                    {rawDoctorName}
                  </SelectItem>
                )}
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
              disabled
            />
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={form.status}
              onValueChange={(val) => handleSelect("status", val)}
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
            <Button type="submit" disabled={submitting} className="hover:cursor-pointer">
              {submitting ? "Saving..." : appointmentId ? "Update" : "Schedule"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

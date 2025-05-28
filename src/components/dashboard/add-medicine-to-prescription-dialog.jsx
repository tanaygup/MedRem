"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Though not in schema, might be useful for notes on medicine later
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Added Alert imports
// import { supabase } from "@/utils/supabase/client"; // Removed Supabase client import
import { toast } from "sonner";

export function AddMedicineToPrescriptionDialog({
  open,
  onOpenChange,
  prescriptionId,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!prescriptionId) {
      setError("Critical: Prescription ID is missing. Cannot save medicine.");
      toast.error("Error: Prescription ID missing.");
      setIsLoading(false);
      return;
    }

    const medicineData = {
      prescriptionId: prescriptionId, // Ensure this is named as the API expects
      medicineName: event.target.elements.medicineName.value,
      dosage: event.target.elements.dosage.value,
      medsLeft: event.target.elements.medsLeft.value || null, // API will handle parseInt
      totalDosesTaken: event.target.elements.totalDosesTaken.value || null,
      totalDoses: event.target.elements.totalDoses.value || null,
    };

    try {
      const response = await fetch("/api/medicines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(medicineData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error ||
            `API request failed with status ${response.status}`
        );
      }

      toast.success(responseData.message || "Medicine added successfully!");
      event.target.reset();
      onOpenChange(false); // Close dialog
      // Optionally, trigger a refetch of prescriptions on the parent page if needed here
      // This might involve passing a callback prop from the parent page.
      // For now, a page refresh on the prescriptions page might be needed to see updates,
      // or the parent page could re-fetch in its own useEffect based on some trigger.
    } catch (err) {
      console.error("Error submitting medicine via API:", err);
      setError(err.message);
      toast.error(err.message || "Failed to add medicine.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setError(null); // Clear error when dialog is closed
        }
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-[450px]">
        {" "}
        {/* Adjusted width slightly */}
        <DialogHeader>
          <DialogTitle>
            Add Medicine to Prescription #{prescriptionId}
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new medicine.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* medicineName */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="medicineName" className="text-right">
                Medicine Name
              </Label>
              <Input
                id="medicineName"
                name="medicineName"
                className="col-span-3"
                required
              />
            </div>
            {/* dosage */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dosage" className="text-right">
                Dosage
              </Label>
              <Input
                id="dosage"
                name="dosage"
                className="col-span-3"
                required
                placeholder="e.g., 1 tablet, 10ml"
              />
            </div>
            {/* medsLeft */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="medsLeft" className="text-right">
                Medications Left
              </Label>
              <Input
                id="medsLeft"
                name="medsLeft"
                type="number"
                className="col-span-3"
                placeholder="e.g., 30"
              />
            </div>
            {/* totalDosesTaken */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalDosesTaken" className="text-right">
                Doses Taken
              </Label>
              <Input
                id="totalDosesTaken"
                name="totalDosesTaken"
                type="number"
                className="col-span-3"
                placeholder="e.g., 0"
              />
            </div>
            {/* totalDoses */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalDoses" className="text-right">
                Total Doses
              </Label>
              <Input
                id="totalDoses"
                name="totalDoses"
                type="number"
                className="col-span-3"
                placeholder="e.g., 60"
              />
            </div>
          </div>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setError(null);
                  onOpenChange(false);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Medicine"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Default export is good practice for components like this if not tree-shaking specific exports
export default AddMedicineToPrescriptionDialog;

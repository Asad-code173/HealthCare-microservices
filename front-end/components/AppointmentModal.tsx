"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import "react-datepicker/dist/react-datepicker.css";

export const AppointmentModal = ({
  type,
  appointment,
}: {
  type: "schedule" | "cancel";
  appointment: { id: string; patientName: string; doctorName: string };
}) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSchedule = async () => {
    try {
      const res = await fetch("/api/store/appointments/confirm-appointment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: appointment.id }),
      });
      if (res.ok) {
        alert("Appointment scheduled successfully!");
      } else {
        alert("Failed to schedule appointment.");
      }
    } catch {
      alert("Something went wrong.");
    }
  };

  const handleCancel = async () => {
    if (!reason.trim()) {
      alert("Please enter a cancellation reason.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/store/appointments/cancel-appointment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: appointment.id, cancellationReason: reason }),
      });
      if (res.ok) {
        alert("Appointment cancelled successfully!");
        setOpen(false);
      } else {
        alert("Failed to cancel appointment.");
      }
    } catch {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (type === "schedule") {
    return (
      <Button variant="ghost" className="capitalize text-green-500" onClick={handleSchedule}>
        Schedule
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="capitalize text-red-500">
          Cancel
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle>Cancel Appointment</DialogTitle>
          <DialogDescription>
            Please provide a reason for cancellation.
          </DialogDescription>
        </DialogHeader>
        <textarea
          className="w-full rounded-md border border-dark-500 bg-dark-400 p-3 text-sm text-white placeholder:text-dark-600 focus:outline-none"
          rows={4}
          placeholder="Enter cancellation reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <Button
          onClick={handleCancel}
          disabled={loading}
          className="shad-danger-btn w-full mt-2"
        >
          {loading ? "Cancelling..." : "Confirm Cancellation"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
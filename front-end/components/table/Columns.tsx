"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AppointmentModal } from "../AppointmentModal";
import { StatusBadge } from "../StatusBadge";



export interface Appointment {
  id: string;
  patientName: string;
  status: string;
  schedule: string;
  doctorName: string;
}

export const columns: ColumnDef<Appointment, unknown>[] = [
  {
    header: "S.No",
    cell: ({ row }) => (
      <p className="text-14-medium">{row.index + 1}</p>
    ),
  },

  {
    accessorKey: "patientName",
    header: "Patient",
    cell: ({ row }) => (
      <p className="text-14-medium">{row.original.patientName}</p>
    ),
  },

  {
  accessorKey: "status",
  header: "Status",
  cell: ({ row }) => (
    <div className="min-w-[115px]">
      <StatusBadge status={row.original.status.toLowerCase() as "pending" | "confirmed" | "scheduled" | "cancelled"} />
    </div>
  ),
},

  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => (
      <p className="text-14-regular min-w-[100px]">
        {new Date(row.original.schedule).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </p>
    ),
  },

  {
    accessorKey: "doctorName",
    header: "Doctor",
    cell: ({ row }) => (
      <p className="whitespace-nowrap">{row.original.doctorName}</p>
    ),
  },

 {
  id: "actions",
  header: () => <div className="pl-4">Actions</div>,
  cell: ({ row }) => (
    <div className="flex gap-1">
      <AppointmentModal type="schedule" appointment={row.original} />
      <AppointmentModal type="cancel" appointment={row.original} />
    </div>
  ),
},
];
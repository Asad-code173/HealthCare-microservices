"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

type WorkingHours = { start: string; end: string };

export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone?: string;
  experience: number;
  avatar?: string;
  available: boolean;
  workingDays: string[];
  workingHours: WorkingHours;
};

function formatTo12Hour(time: string) {
  const [hourStr, minute] = time.split(":");
  const hour = parseInt(hourStr);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 || 12;
  return `${h}:${minute} ${ampm}`;
}

function DoctorAvatar({ name, avatar }: { name: string; avatar?: string }) {
  const initials = name
    .replace("Dr. ", "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (avatar) {
    return (
      <Image
        src={avatar}
        alt={name}
        width={32}
        height={32}
        className="h-8 w-8 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#22d3ee] to-[#3b82f6] text-[11px] font-bold text-[#0d1117]">
      {initials}
    </div>
  );
}

function AvailableBadge({ available }: { available: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium
        ${available
          ? "bg-[rgba(36,174,124,0.15)] text-[#24ae7c]"
          : "bg-[rgba(242,78,67,0.15)] text-[#f24e43]"
        }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${available ? "bg-[#24ae7c]" : "bg-[#f24e43]"}`} />
      {available ? "Available" : "Unavailable"}
    </span>
  );
}

export const doctorColumns: ColumnDef<Doctor>[] = [
  {
    header: "S.No",
    cell: ({ row }) => (
      <p className="text-14-medium text-[#6b7280]">{row.index + 1}</p>
    ),
  },

  {
    accessorKey: "name",
    header: "Doctor",
    cell: ({ row }) => {
      const { name, specialization, avatar } = row.original;
      return (
        <div className="flex items-center gap-3">
          <DoctorAvatar name={name} avatar={avatar} />
          <div className="min-w-0">
            <p className="text-14-medium truncate text-[#e2e8f0]">{name}</p>
            <p className="text-[12px] text-[#6b7280] truncate hidden sm:block">
              {specialization}
            </p>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "specialization",
    header: "Specialization",
    cell: ({ row }) => (
      <p className="text-14-regular hidden sm:block text-[#9ca3af]">
        {row.original.specialization}
      </p>
    ),
  },

  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <p className="text-14-regular hidden md:block truncate max-w-[180px] text-[#9ca3af]">
        {row.original.email}
      </p>
    ),
  },

  {
    accessorKey: "experience",
    header: "Experience",
    cell: ({ row }) => (
      <p className="text-14-regular text-[#9ca3af]">
        {row.original.experience} yrs
      </p>
    ),
  },

{
  accessorKey: "workingHours",
  header: "Hours",
  cell: ({ row }) => {
    const { start, end } = row.original.workingHours;
    return (
      <p className="text-14-regular hidden lg:block text-[#9ca3af] whitespace-nowrap">
        {formatTo12Hour(start)} – {formatTo12Hour(end)}
      </p>
    );
  },
},
  {
    accessorKey: "available",
    header: "Status",
    cell: ({ row }) => <AvailableBadge available={row.original.available} />,
  },
];
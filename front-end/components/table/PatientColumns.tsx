"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

export type Patient = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  birthDate: string;
  primaryPhysician: string;
  privacyConsent: boolean;
  createdAt: string;
};

function GenderBadge({ gender }: { gender: string }) {
  const colors: Record<string, string> = {
    MALE: "bg-[rgba(59,130,246,0.15)] text-[#3b82f6]",
    FEMALE: "bg-[rgba(236,72,153,0.15)] text-[#ec4899]",
    OTHER: "bg-[rgba(107,114,128,0.15)] text-[#9ca3af]",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium ${colors[gender] || colors.OTHER}`}>
      {gender.charAt(0) + gender.slice(1).toLowerCase()}
    </span>
  );
}

function ViewButton({ id }: { id: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(`/admin/patients/${id}`)}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6b7280] hover:bg-[#1f2937] hover:text-[#24ae7c] transition-colors"
      aria-label="View patient"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </button>
  );
}

export const patientColumns: ColumnDef<Patient>[] = [
  {
    header: "S.No",
    cell: ({ row }) => (
      <p className="text-14-medium text-[#6b7280]">{row.index + 1}</p>
    ),
  },
  {
    accessorKey: "fullName",
    header: "Patient",
    cell: ({ row }) => {
      const { fullName } = row.original;
      const initials = fullName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
      return (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#24ae7c] to-[#3b82f6] text-[11px] font-bold text-white">
            {initials}
          </div>
          <p className="text-14-medium text-[#e2e8f0] truncate">{fullName}</p>
        </div>
      );
    },
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
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <p className="text-14-regular hidden sm:block text-[#9ca3af]">
        {row.original.phone}
      </p>
    ),
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => <GenderBadge gender={row.original.gender} />,
  },
  {
    accessorKey: "primaryPhysician",
    header: "Physician",
    cell: ({ row }) => (
      <p className="text-14-regular hidden lg:block text-[#9ca3af] truncate max-w-[140px]">
        {row.original.primaryPhysician}
      </p>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Registered",
    cell: ({ row }) => (
      <p className="text-14-regular hidden lg:block text-[#9ca3af] whitespace-nowrap">
        {new Date(row.original.createdAt).toLocaleDateString()}
      </p>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <ViewButton id={row.original.id} />,
  },
];
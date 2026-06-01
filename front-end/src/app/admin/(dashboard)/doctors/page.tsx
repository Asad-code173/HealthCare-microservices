"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DataTable } from "@/components/table/DataTable";
import { doctorColumns, Doctor } from "../../../../../components/table/DoctorColumns";
import { StatCard } from "@/components/StatCard";

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/store/doctors/get-doctors", {
          credentials: "include",
        });
        const data = await res.json();
        console.log("Doctors response:", data);
        setDoctors(data.data.data || []);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalDoctors = doctors.length;
  const availableCount = doctors.filter((d) => d.available).length;
  const unavailableCount = doctors.filter((d) => !d.available).length;

  return (
    <div className="space-y-6 p-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-24-bold text-[#e2e8f0]">Doctors</h1>
          <p className="text-14-regular text-[#6b7280]">
            {totalDoctors} doctors registered
          </p>
        </div>

        <Link
          href="/admin/create-doctors"
          className="flex w-fit items-center gap-2 rounded-lg bg-[#24ae7c] px-4 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Doctor
        </Link>
      </div>

      {/* Stat cards */}
      <section className="admin-stat">
        <StatCard type="appointments" count={totalDoctors} label="Total doctors" icon="/assets/icons/appointments.svg" />
        <StatCard type="pending" count={availableCount} label="Available doctors" icon="/assets/icons/pending.svg" />
        <StatCard type="cancelled" count={unavailableCount} label="Unavailable doctors" icon="/assets/icons/cancelled.svg" />
      </section>

      {/* Search */}
      <div className="flex items-center gap-3 rounded-lg border border-[#363a3d] bg-[#1a1d21] px-3 py-2 w-full sm:max-w-sm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search by name, specialization or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-[13px] text-[#e2e8f0] placeholder:text-[#4b5563] outline-none"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-[#6b7280] hover:text-[#e2e8f0] transition-colors" aria-label="Clear search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <p className="text-14-regular text-[#6b7280]">Loading doctors...</p>
      ) : (
        <div className="overflow-x-auto">
          <DataTable columns={doctorColumns} data={filtered} />
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/table/DataTable";
import { patientColumns, Patient } from "@/components/table/PatientColumns";
import { StatCard } from "@/components/StatCard";

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("/api/store/patients/get-patients", {
          credentials: "include",
        });
        const data = await res.json();
        console.log("Patients response:", data)
        setPatients(data.data.patients || []);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filtered = patients.filter(
    (p) =>
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  const totalPatients = patients.length;
  const maleCount = patients.filter((p) => p.gender === "MALE").length;
  const femaleCount = patients.filter((p) => p.gender === "FEMALE").length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-24-bold text-[#e2e8f0]">Patients</h1>
        <p className="text-14-regular text-[#6b7280]">
          {totalPatients} patients registered
        </p>
      </div>

      {/* Stat cards */}
      <section className="admin-stat">
        <StatCard type="appointments" count={totalPatients} label="Total patients" icon="/assets/icons/appointments.svg" />
        <StatCard type="pending" count={maleCount} label="Male patients" icon="/assets/icons/pending.svg" />
        <StatCard type="cancelled" count={femaleCount} label="Female patients" icon="/assets/icons/cancelled.svg" />
      </section>

      {/* Search */}
      <div className="flex items-center gap-3 rounded-lg border border-[#363a3d] bg-[#1a1d21] px-3 py-2 w-full sm:max-w-sm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-[13px] text-[#e2e8f0] placeholder:text-[#4b5563] outline-none"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-[#6b7280] hover:text-[#e2e8f0] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <p className="text-14-regular text-[#6b7280]">Loading patients...</p>
      ) : (
        <div className="overflow-x-auto">
          <DataTable columns={patientColumns} data={filtered} />
        </div>
      )}
    </div>
  );
}
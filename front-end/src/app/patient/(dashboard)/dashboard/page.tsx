"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/StatCard";

type Appointment = {
  id: string;
  doctorName: string;
  schedule: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  reason: string;
  cancellationReason: string
};

const STATUS_STYLES = {
  CONFIRMED: {
    dot: "bg-[#24ae7c]",
    badge: "bg-[#0d2e20] text-[#24ae7c]",
    label: "Scheduled",
  },
  PENDING: {
    dot: "bg-[#f59e0b]",
    badge: "bg-[#2a2010] text-[#f59e0b]",
    label: "Pending",
  },
  CANCELLED: {
    dot: "bg-[#f87171]",
    badge: "bg-[#2a1010] text-[#f87171]",
    label: "Cancelled",
  },
  COMPLETED: {
    dot: "bg-[#3b82f6]",
    badge: "bg-[#0f172a] text-[#3b82f6]",
    label: "Completed",
  },
};

export default function PatientDashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch("/api/store/appointments/get-appointments", {
          credentials: "include",
        });


        const data = await res.json();

        console.log("Appointmentss response:", data);

        if (res.ok) {
          setAppointments(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch appointments", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const upcoming = appointments.length;

  const pending = appointments.filter(
    (a) => a.status === "PENDING"
  ).length;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-[22px] font-semibold text-[#f1f5f9]">
          Welcome back 👋
        </h1>
        <p className="mt-1 text-[13px] text-[#4b5563]">
          Here are your upcoming appointments.
        </p>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          type="appointments"
          count={upcoming}
          label="Upcoming appointments"
          icon="/assets/icons/appointments.svg"
        />
        <StatCard
          type="pending"
          count={pending}
          label="Pending confirmation"
          icon="/assets/icons/pending.svg"
        />
      </div>
      {/* Appointment List */}
      <div className="rounded-xl border border-[#1f2937] bg-[#111827]">
        <div className="flex items-center justify-between border-b border-[#1f2937] px-6 py-4">
          <h2 className="text-[14px] font-medium text-[#e2e8f0]">
            Upcoming appointments
          </h2>

          <Link
            href="/patient/book-appointment"
            className="flex items-center gap-1 rounded-lg bg-[#24ae7c] px-3 py-[6px] text-[12px] font-medium text-white no-underline transition-colors hover:bg-[#1d9a6c]"
          >
            <i className="ti ti-plus text-[14px]" />
            Book new
          </Link>
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-gray-400">
            Loading appointments...
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1a1d1f]">
              <i className="ti ti-calendar-off text-[22px] text-[#4b5563]" />
            </div>

            <p className="text-[13px] text-[#4b5563]">
              No upcoming appointments
            </p>

            <Link
              href="/patient/book-appointment"
              className="mt-1 rounded-lg bg-[#24ae7c] px-4 py-2 text-[13px] font-medium text-white no-underline transition-colors hover:bg-[#1d9a6c]"
            >
              Book your first appointment
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-[#1f2937]">
            {appointments.map((apt) => {
              const status =
                STATUS_STYLES[apt.status] || STATUS_STYLES.PENDING;

              const date = new Date(apt.schedule);

              return (
                <li
                  key={apt.id}
                  className="flex items-center gap-4 px-6 py-4"
                >
                  <div
                    className={`h-2 w-2 shrink-0 rounded-full ${status.dot}`}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-[#e2e8f0]">
                      {apt.reason}
                    </p>

                    <p className="text-[11px] text-[#4b5563]">
                      Doctor Name: {apt.doctorName}
                    </p>
                    {apt.status === "CANCELLED" && apt.cancellationReason && (
                      <p className="text-[11px] text-[#f87171]">
                        Cancellation Reason: {apt.cancellationReason}
                      </p>
                    )}
                  </div>

                  <div className="hidden text-right sm:block">
                    <p className="text-[12px] text-[#9ca3af]">
                      {date.toLocaleDateString()}
                    </p>

                    <p className="text-[11px] text-[#4b5563]">
                      {date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <p className="hidden text-[11px] text-[#4b5563] md:block">
                    #{apt.id.slice(0, 8)}
                  </p>

                  <span
                    className={`shrink-0 rounded-full px-3 py-[3px] text-[11px] font-medium ${status.badge}`}
                  >
                    {status.label}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>


    </div>
  );
}
"use client";
import { useEffect, useState } from "react";
import { StatCard } from "../../../../../components/StatCard";
import { columns } from "../../../../../components/table/Columns";
import { DataTable } from "../../../../../components/table/DataTable";

interface Appointment {
  id: string;
  patientName: string;
  status: string;
  schedule: string;
  doctorName: string;
}

interface AppointmentStats {
  scheduled: number;
  pending: number;
  cancelled: number;
}

const AdminPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<AppointmentStats>({
    scheduled: 0,
    pending: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch("/api/store/appointments/get-appointments",{
            credentials: "include",
        });
        const data = await res.json();
       

        const list: Appointment[] = Array.isArray(data?.data) ? data.data : [];
        setAppointments(list);

        setStats({
          scheduled: list.filter((a) => a.status === "CONFIRMED").length,
          pending: list.filter((a) => a.status === "PENDING").length,
          cancelled: list.filter((a) => a.status === "CANCELLED").length,
        });
      } catch (err) {
        console.error("Appointments fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">
            Start the day with managing new appointments
          </p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={stats.scheduled}
            label="Scheduled appointments"
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            count={stats.pending}
            label="Pending appointments"
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="cancelled"
            count={stats.cancelled}
            label="Cancelled appointments"
            icon="/assets/icons/cancelled.svg"
          />
        </section>

        {loading ? (
          <p className="text-dark-700">Loading appointments...</p>
        ) : (
          <DataTable columns={columns} data={appointments} />
        )}
      </main>
    </div>
  );
};

export default AdminPage;
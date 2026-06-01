"use client";

import { useState } from "react";
import { Sidebar } from "../../../../components/Sidebar";
import { Header } from "../../../../components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    
      <div className="flex min-h-screen bg-[#0d1117]">
      {/* ── Sidebar ── */}
      <Sidebar
        userName="Admin User"
        userRole="Super Admin"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Main area ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header/>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
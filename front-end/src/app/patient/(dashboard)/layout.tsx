"use client";

import { useState } from "react";
import { PatientSidebar } from "../../../../components/PatientSidebar";
import { PatientHeader } from "../../../../components/PatientHeader";




export default function PatientLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-[#0d0f10]">

            {/* Sidebar */}
            <PatientSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main area — header + page content */}
            <div className="flex flex-1 flex-col overflow-hidden">

                {/* Header */}
                <PatientHeader
                    onMenuToggle={() => setSidebarOpen((prev) => !prev)}
                />

                {/* Page content */}
                <main className="flex-1 overflow-y-auto bg-[#131619] p-6">
                    {children}
                </main>

            </div>
        </div>
    );
}
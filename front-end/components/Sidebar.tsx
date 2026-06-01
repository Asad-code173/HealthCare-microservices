"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";


const NAV_ITEMS: NavItem[] = [
  { href: "/admin/dashboard", icon: "layout-dashboard", label: "Dashboard" },
  { href: "/admin/patients",  icon: "users",            label: "Patients" },
  { href: "/admin/doctors",   icon: "stethoscope",      label: "Doctors" },
];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={`relative flex items-center gap-[10px] rounded-lg px-[10px] py-2 text-[13.5px] transition-all duration-150 no-underline mb-[1px]
        ${active
          ? "bg-[rgba(34,211,238,0.08)] text-[#22d3ee]"
          : "text-[#9ca3af] hover:bg-[#1f2937] hover:text-[#e2e8f0]"
        }`}
    >
      {active && (
        <span className="absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-[3px] bg-[#22d3ee]" />
      )}
      <i className={`ti ti-${item.icon} w-5 text-center text-[17px] shrink-0`} aria-hidden="true" />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge !== undefined && (
        <span
          className={`shrink-0 rounded-full px-[7px] py-[1px] text-[11px] font-semibold
            ${item.badgeVariant === "orange"
              ? "bg-[rgba(249,115,22,0.12)] text-[#f97316]"
              : "bg-[rgba(34,211,238,0.12)] text-[#22d3ee]"
            }`}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

// Export so Header can call it
export function useSidebar() {
  return useState(false);
}

interface SidebarFullProps extends SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ userName = "Admin User", userRole = "Super Admin", open, onClose }: SidebarFullProps) {
  const pathname = usePathname();

  return (
    <>
      {/* ── Backdrop (mobile only) ── */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-[220px] flex-col overflow-y-auto
          border-r border-[#1f2937] bg-[#111827] scrollbar-hide
          transition-transform duration-200
          md:translate-x-0 md:sticky md:top-0
          ${open ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Main navigation"
      >
        {/* ── Logo ── */}
        <div className="flex shrink-0 items-center gap-[10px] border-b border-[#1f2937] px-5 pb-[14px] pt-[18px]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#22d3ee] to-[#3b82f6]">
            <Image
              src="/assets/icons/logo-icon.svg"
              alt="CarePulse"
              width={20}
              height={20}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-[#f1f5f9]">
            CarePulse
          </span>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex flex-1 flex-col gap-0 px-[10px] py-[10px]">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={pathname.startsWith(item.href)}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}
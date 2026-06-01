"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const [open, setOpen] = useState(false);
  const [initials, setInitials] = useState("AU");
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("/api/store/auth/me", { credentials: "include" });
        const data = await res.json();
        const name = data?.data?.data?.username || data?.data?.data?.name || "";        
        if (name) {
          const parts = name.trim().split(" ");
          const ini = parts.length >= 2
            ? parts[0][0] + parts[1][0]
            : parts[0][0];
          setInitials(ini.toUpperCase());
        }
      } catch {}
    };
    fetchMe();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/store/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Logout failed");
      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-end border-b border-[#1f2937] bg-[#0d1117] px-4">
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#22d3ee] to-[#3b82f6] text-[12px] font-bold text-[#0d1117]"
        >
          {initials}
        </button>

        {open && (
          <div className="absolute right-0 top-10 z-50 w-36 overflow-hidden rounded-xl border border-[#1f2937] bg-[#111827] shadow-xl">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-[10px] text-[13px] text-[#f87171] hover:bg-[#1f2937]"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
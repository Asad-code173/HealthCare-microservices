"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


interface PatientHeaderProps {
    onMenuToggle: () => void;
}

export function PatientHeader({ onMenuToggle }: PatientHeaderProps) {
    const [username, setUsername] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await fetch("/api/store/auth/me", { credentials: "include" });
                const data = await res.json();
                const name = data?.data?.data?.username || data?.data?.data?.name || "";
                if (name) {
                    setUsername(name);
                }
            } catch { }
        };
        fetchMe();
    }, []);

    const initials = username.trim()[0]?.toUpperCase() || "?";
    async function handleSignOut() {
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
    }

    return (
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-[#1f2937] bg-[#111827] px-4 md:px-6">

            {/* Hamburger — mobile only */}
            <button
                onClick={onMenuToggle}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9ca3af] hover:bg-[#1f2937] hover:text-[#e2e8f0] md:hidden"
                aria-label="Toggle navigation"
            >
                <i className="ti ti-menu-2 text-[20px]" aria-hidden="true" />
            </button>

            {/* Logo — mobile only */}
            <div className="flex items-center gap-[10px] md:hidden">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#24ae7c] to-[#3b82f6]">
                    <Image
                        src="/assets/icons/logo-icon.svg"
                        alt="CarePulse"
                        width={16}
                        height={16}
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                    />
                </div>
                <span className="text-[14px] font-semibold text-[#f1f5f9]">CarePulse</span>
            </div>

            <div className="flex-1" />

          
            <div className="relative group">
                <button
                    className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-[#1f2937] transition-colors"
                    aria-label="Account menu"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#22d3ee] to-[#3b82f6] text-[12px] font-bold text-[#0d1117]">
                        {initials || "?"}
                    </div>

                    <i className="ti ti-chevron-down text-[14px] text-[#4b5563] hidden md:block" aria-hidden="true" />
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-[#1f2937] bg-[#111827] py-1 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">

                    <div className="border-t border-[#1f2937] mt-1 pt-1">
                        <button
                            onClick={handleSignOut}
                            className="flex w-full items-center gap-2 px-3 py-[7px] text-[13px] text-[#f87171] hover:bg-[#1f2937] transition-colors"
                        >
                            <i className="ti ti-logout text-[15px]" aria-hidden="true" />
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
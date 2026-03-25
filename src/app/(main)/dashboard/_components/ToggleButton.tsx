"use client";
import { useDashboardContext } from "./DashboardContext";
import { useEffect, useState } from "react";

export default function ToggleButton() {
    const { isMenuOpen, toggleMenu } = useDashboardContext();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="h-8 w-8 rounded-md bg-[#FAF5E8]/10 border border-[#B8841E]/20" />
        );
    }

    return (
        <button
            onClick={() => toggleMenu()}
            aria-label={isMenuOpen ? "Close sidebar" : "Open sidebar"}
            className="flex items-center justify-center h-8 w-8 rounded-md text-[#F5EDD0]/60 hover:text-[#EDD085] hover:bg-[#B8841E]/10 border border-transparent hover:border-[#B8841E]/25 transition-all duration-200"
        >
            {isMenuOpen ? (
                /* X icon */
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                </svg>
            ) : (
                /* Hamburger icon */
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
            )}
        </button>
    );
}

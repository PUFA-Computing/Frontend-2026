"use client";
import { useDashboardContext } from "./DashboardContext";

export default function DashboardContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isMenuOpen } = useDashboardContext();

    return (
        <main
            className={`flex-1 min-h-[calc(100vh-4rem)] bg-[#F5EDD0] transition-all duration-500 ease-in-out ${
                isMenuOpen ? "lg:ml-64" : "ml-0"
            }`}
        >
            <div className="p-4 sm:p-6 lg:p-8">
                {children}
            </div>
        </main>
    );
}

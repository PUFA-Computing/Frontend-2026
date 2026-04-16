import AspirationCard from "@/components/aspiration/AspirationCard";
import { fetchAspirations } from "@/services/api/aspiration";
import Aspirations from "@/models/aspiration";
import NoData from "@/components/ui/NoData";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { Suspense } from "react";
import { FaRegLightbulb } from "react-icons/fa";

export default async function AspirationsCards() {
    const aspirations = await fetchAspirations();

    if (!aspirations?.length) {
        return (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl bg-[#E5D5A5]/20 border border-[#B8841E]/15 p-8 text-center shadow-inner">
                <div className="mb-4 rounded-full bg-[#E5D5A5]/50 p-4 border border-[#B8841E]/20 text-[#B8841E]">
                    <FaRegLightbulb className="text-3xl" />
                </div>
                <h3 className="mb-2 text-xl font-display font-semibold text-[#0D1B3E]">No Aspirations Submitted</h3>
                <p className="max-w-md font-serif text-[#1A1A2E]/70">
                    There are currently no aspirations available. Please check back later or be the first to share your thoughts!
                </p>
            </div>
        );
    }

    //TODO: Handle likes based on user loggedin

    return (
        <div className="w-full">
            <div className="mb-6 flex items-center justify-between border-b border-[#B8841E]/15 pb-4">
                <h3 className="text-lg font-display font-medium text-[#0D1B3E]">
                    Showing <span className="font-bold text-[#B8841E]">{aspirations.length}</span> aspirations
                </h3>
                <div className="text-sm font-serif text-[#1A1A2E]/50 uppercase tracking-widest">
                    Latest updates first
                </div>
            </div>
            
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
                <Suspense fallback={
                    <div className="col-span-full flex justify-center py-12">
                        <CircularProgress />
                    </div>
                }>
                    {aspirations.map((aspiration) => (
                        <AspirationCard
                            key={aspiration.id}
                            aspiration={aspiration}
                        />
                    ))}
                </Suspense>
            </div>
        </div>
    );
}

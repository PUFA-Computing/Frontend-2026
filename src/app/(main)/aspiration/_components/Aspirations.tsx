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
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl bg-gray-50 p-8 text-center">
                <div className="mb-4 rounded-full bg-blue-100 p-4">
                    <FaRegLightbulb className="text-3xl text-blue-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-800">No Aspirations Submitted</h3>
                <p className="max-w-md text-gray-600">
                    There are currently no aspirations available. Please check back later or be the first to share your thoughts!
                </p>
            </div>
        );
    }

    //TODO: Handle likes based on user loggedin

    return (
        <div className="w-full">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-700">
                    Showing {aspirations.length} aspirations
                </h3>
                <div className="text-sm text-gray-500">
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

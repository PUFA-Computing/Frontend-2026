import CompreciationCard from "@/components/main/CompreciationCard";
import { db } from "@/lib/db";
import Logo from "@/assets/backgroundimg.svg";

export default async function CompreciationCards() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 bg-gradient-to-br from-[#B48322] to-[#F2B233] rounded-full flex items-center justify-center mb-8 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#B48322] to-[#F2B233]">
                Coming Soon!
            </h3>
            
            <p className="text-gray-600 text-center max-w-md mb-8">
                We're working on showcasing amazing projects from our talented Computing students. Check back soon to see the innovative work from our community!
            </p>
            
            <div className="flex space-x-2 justify-center">
                <div className="w-3 h-3 rounded-full bg-[#B48322] animate-bounce"></div>
                <div className="w-3 h-3 rounded-full bg-[#D49C28] animate-bounce delay-75"></div>
                <div className="w-3 h-3 rounded-full bg-[#F2B233] animate-bounce delay-150"></div>
            </div>
        </div>
    );
}

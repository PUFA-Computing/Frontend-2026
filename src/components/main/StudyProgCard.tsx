import Link from "next/link";
import Button from "@/components/Button";
import { StudyProgramDataProps } from "@/lib/common.type";

export default function StudyProgCard({
    title,
    article,
    link,
}: StudyProgramDataProps) {
    return (
        <div className="group w-full translate-y-0 transform rounded-xl bg-gradient-to-br from-[#1d1c20] via-[#1d1c20] to-[#716c81] p-6 text-center transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_10px_40px_-15px_rgba(255,215,0,0.3)] border border-[#FFD700]/10 hover:border-[#FFD700]/30">
            <div className="relative">
                {/* Gold accent line at top */}
                <div className="absolute -top-6 left-1/2 h-1 w-24 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-30 transition-all duration-500 group-hover:w-32 group-hover:opacity-70"></div>
                
                <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] to-white transition-all duration-300 group-hover:from-[#FFD700] group-hover:to-[#FFD700] md:text-xl">{title}</p>
                
                <div className="relative my-8">
                    <hr className="mx-auto w-16 border-[#FFD700]/20 transition-all duration-500 group-hover:w-24 group-hover:border-[#FFD700]/40" />
                    <div className="absolute -top-[1px] left-1/2 h-[2px] w-0 -translate-x-1/2 transform bg-gradient-to-r from-[#FFD700] to-white transition-all duration-500 group-hover:w-24"></div>
                </div>
                
                <p className="my-12 h-[8rem] text-gray-400 transition-all duration-300 group-hover:text-white/90">
                    {article}
                </p>
                
                <Link href={link || "/"} className="inline-block w-full">
                    <Button className="w-full bg-gradient-to-r from-[#242424] to-[#1E1E1E] border-[#FFD700]/30 text-[#FFD700] transition-all duration-300 hover:border-[#FFD700] hover:bg-gradient-to-r hover:from-[#FFD700] hover:to-[#FFD700] hover:text-black hover:shadow-[0_0_20px_-5px_rgba(255,215,0,0.5)]">
                        See Details
                    </Button>
                </Link>
            </div>
        </div>
    );
}
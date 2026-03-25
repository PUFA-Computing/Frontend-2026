"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import ProjectForm from "./_components/ProjectForm";
import { Loader2, ArrowLeft, Lightbulb, Code2 } from "lucide-react";

export default function ProjectsNewPage() {
   const { data: session, status } = useSession();
   const router = useRouter();

   useEffect(() => {
      if (status === "unauthenticated") {
         router.push("/auth/signin");
      }
   }, [status, router]);

   if (status === "loading") {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
         </div>
      );
   }

   if (!session) {
      return null;
   }

   return (
      <div className="min-h-screen">
         {/* Hero Section */}
         <section className="relative w-full flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-[#F5EDD0]">
            <div className="absolute inset-0 bg-gradient-to-b from-[#EDE0BB]/80 to-[#F5EDD0]" />
            
            {/* Top corner ornaments */}
            <div className="absolute top-28 left-8 w-12 h-12 border-l border-t border-[#B8841E]/40 hidden md:block" />
            <div className="absolute top-28 right-8 w-12 h-12 border-r border-t border-[#B8841E]/40 hidden md:block" />

            <div className="relative container mx-auto px-6 max-w-7xl z-10 flex flex-col items-center text-center">
               <div className="relative z-10 max-w-3xl flex flex-col items-center text-center">
                  {/* Back Button */}
                  <Link
                     href="/projects"
                     className="mb-8 inline-flex items-center rounded-none border border-[#B8841E]/30 bg-[#FAF5E8]/60 px-4 py-2 text-sm font-serif font-medium text-[#0D1B3E] transition-all hover:bg-[#B8841E]/10"
                  >
                     <ArrowLeft className="mr-2 h-4 w-4" />
                     <span className="text-sm font-medium">Back to Projects</span>
                  </Link>

                  <div className="mb-6 inline-flex items-center justify-center border border-[#B8841E]/30 bg-[#FAF5E8]/60 px-4 py-1.5 shadow-parch-sm">
                     <Code2 className="mr-2 h-4 w-4 text-[#B8841E]" />
                     <p className="font-serif text-xs tracking-[0.2em] font-medium text-[#B8841E] uppercase">Faculty of Computing</p>
                  </div>
                  <h1 className="mb-6 text-4xl font-display italic text-[#0D1B3E] sm:text-5xl md:text-6xl text-balance leading-[1.1]">
                     Submit Your <span className="text-[#B8841E]">Project</span>
                  </h1>
                  
                  {/* Ornamental rule */}
                  <div className="flex items-center justify-center gap-3 w-full mb-6">
                      <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#B8841E]/40" />
                      <span className="text-[#B8841E]/50 text-xs">✦</span>
                      <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#B8841E]/40" />
                  </div>
                  
                  <p className="mb-8 text-lg font-serif text-[#1A1A2E]/65 max-w-2xl text-balance">
                     Share your amazing work with the computizen community. Your project will be reviewed by our team before publication.
                  </p>

                  {/* Info Badge */}
                  <div className="inline-flex items-center gap-2 border border-[#B8841E]/40 px-6 py-2.5 bg-[#FAF5E8]/40 shadow-parch-sm">
                     <Lightbulb className="w-5 h-5 text-[#B8841E]" />
                     <p className="text-sm text-[#1A1A2E]/80 font-serif">
                        <span className="font-bold text-[#0D1B3E]">Note:</span> Projects require admin approval before appearing on the main page
                     </p>
                  </div>
               </div>
            </div>
         </section>

         {/* Form Section */}
         <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:px-8">
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 lg:p-10">
               <ProjectForm />
            </div>
         </section>
      </div>
   );
}

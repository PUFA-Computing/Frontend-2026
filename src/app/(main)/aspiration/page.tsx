import React from "react";
import { CiSearch } from "react-icons/ci";
import { FaLightbulb } from "react-icons/fa";
import AspirationForm from "./_components/Form";
import AspirationsCards from "./_components/Aspirations";
import { Metadata } from "next";

export const revalidate = 600;
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
   title: "Aspirations",
   description:
      "A place for computizens to share their aspirations, ideas, and suggestions with us.",
};

export default function page() {
   return (
      <div className="min-h-screen bg-[#F5EDD0]">
         {/* Hero Section */}
         {/* Hero Section */}
         <section className="relative w-full flex flex-col items-center justify-center pt-32 pb-24 overflow-hidden bg-[#F5EDD0]">
            <div className="absolute inset-0 bg-gradient-to-b from-[#EDE0BB]/80 to-[#F5EDD0]" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url('/doodle.svg')` }}></div>
            
            {/* Top corner ornaments */}
            <div className="absolute top-28 left-8 w-12 h-12 border-l border-t border-[#B8841E]/40 hidden md:block" />
            <div className="absolute top-28 right-8 w-12 h-12 border-r border-t border-[#B8841E]/40 hidden md:block" />

            <div className="relative container mx-auto px-6 flex flex-col items-center text-center max-w-4xl z-10">
               <div className="mb-6 inline-flex items-center justify-center border border-[#B8841E]/30 bg-[#FAF5E8]/60 px-4 py-1.5 shadow-parch-sm">
                  <FaLightbulb className="mr-2 text-[#B8841E]" />
                  <p className="font-serif text-xs tracking-[0.2em] font-medium text-[#B8841E] uppercase">Faculty of Computing</p>
               </div>
               
               <h1 className="font-display italic text-6xl sm:text-7xl md:text-8xl text-[#0D1B3E] mb-6 leading-[0.9]">
                  Aspirations
               </h1>
               
               {/* Ornamental rule */}
               <div className="flex items-center justify-center gap-3 w-full mb-6">
                  <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#B8841E]/40" />
                  <span className="text-[#B8841E]/50 text-xs">✦</span>
                  <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#B8841E]/40" />
               </div>
               
               <p className="font-serif text-lg text-[#1A1A2E]/65 max-w-2xl text-balance mb-2">
                  A place for computizens to share their aspirations, ideas, and suggestions with us.
               </p>
               <p className="font-serif text-[#B8841E]/80 mb-8 italic">
                  Your voice matters. Help us build a better computing community together.
               </p>
            </div>
         </section>

         {/* Form Section */}
         <section className="container mx-auto max-w-5xl px-4 py-12 md:px-6 lg:py-16">
            <div className="relative z-10 -mt-8 md:-mt-16 lg:-mt-24">
               <AspirationForm />
            </div>
         </section>

         {/* Aspirations Library Section */}
         <section className="container mx-auto max-w-5xl px-4 pb-16 md:px-6 lg:pb-24">
            <div className="mb-12 text-center">
               <h2 className="mb-2 text-3xl font-display font-bold tracking-tight text-[#0D1B3E] md:text-4xl relative inline-block">
                  Aspirations Library
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#B8841E]/40 rounded-full" />
               </h2>
               <p className="mx-auto max-w-2xl text-[#1A1A2E]/70 font-serif mt-4">
                  Explore what others have shared and learn from our community's collective wisdom.
               </p>
            </div>
            
            {/* Search Bar */}
            <div className="mb-12 flex justify-center">
               <div className="relative w-full max-w-2xl">
                  <input
                     type="text"
                     className="w-full rounded-full border border-[#B8841E]/30 bg-[#FAF5E8] py-3 pl-12 pr-4 shadow-parch-sm transition-all focus:border-[#B8841E] focus:outline-none focus:ring-2 focus:ring-[#B8841E]/20 text-[#0D1B3E] font-serif placeholder:text-[#1A1A2E]/40"
                     placeholder="Search aspirations..."
                  />
                  <CiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[#B8841E]" />
               </div>
            </div>
            
            {/* Aspirations Cards */}
            <div className="rounded-xl bg-[#FAF5E8] border border-[#B8841E]/20 p-6 shadow-parch-md md:p-8 lg:p-10">
               <AspirationsCards />
            </div>
         </section>
      </div>
   );
}

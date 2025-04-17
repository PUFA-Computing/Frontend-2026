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
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
         {/* Hero Section */}
         <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-16 text-white">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url('/doodle.svg')` }}></div>
            <div className="container mx-auto max-w-7xl px-6 md:px-10">
               <div className="flex flex-col items-start space-y-4 md:w-2/3">
                  <div className="flex items-center space-x-3">
                     <FaLightbulb className="text-2xl text-yellow-300" />
                     <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                        Aspirations
                     </h1>
                  </div>
                  <p className="text-lg font-medium text-blue-100 md:text-xl">
                     A place for computizens to share their aspirations, ideas, and
                     suggestions with us.
                  </p>
                  <p className="text-blue-100">
                     Your voice matters. Help us build a better computing community together.
                  </p>
               </div>
            </div>
         </section>

         {/* Form Section */}
         <section className="container mx-auto max-w-6xl px-4 py-12 md:px-6 lg:py-16">
            <div className="relative z-10 -mt-8 md:-mt-16 lg:-mt-24">
               <AspirationForm />
            </div>
         </section>

         {/* Aspirations Library Section */}
         <section className="container mx-auto max-w-6xl px-4 pb-16 md:px-6 lg:pb-24">
            <div className="mb-12 text-center">
               <h2 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                  Aspirations Library
               </h2>
               <p className="mx-auto max-w-2xl text-gray-600">
                  Explore what others have shared and learn from our community's collective wisdom.
               </p>
            </div>
            
            {/* Search Bar */}
            <div className="mb-12 flex justify-center">
               <div className="relative w-full max-w-2xl">
                  <input
                     type="text"
                     className="w-full rounded-full border-2 border-gray-300 bg-white py-3 pl-12 pr-4 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                     placeholder="Search aspirations..."
                  />
                  <CiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500" />
               </div>
            </div>
            
            {/* Aspirations Cards */}
            <div className="rounded-xl bg-white p-6 shadow-lg md:p-8 lg:p-10">
               <AspirationsCards />
            </div>
         </section>
      </div>
   );
}

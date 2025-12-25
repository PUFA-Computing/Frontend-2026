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
         <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-900 px-4 py-16 sm:px-6 md:px-8 lg:px-16">
            {/* Decorative elements */}
            <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-blue-500 opacity-10"></div>
            <div className="absolute -right-20 bottom-10 h-60 w-60 rounded-full bg-purple-500 opacity-10"></div>
            <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-indigo-500 opacity-5"></div>

            <div className="relative mx-auto max-w-7xl">
               <div className="relative z-10 max-w-3xl">
                  {/* Back Button */}
                  <Link
                     href="/projects"
                     className="mb-6 inline-flex items-center gap-2 text-indigo-100 hover:text-white transition-colors"
                  >
                     <ArrowLeft className="w-5 h-5" />
                     <span className="text-sm font-medium">Back to Projects</span>
                  </Link>

                  <br />

                  <div className="mb-6 inline-flex items-center rounded-full bg-indigo-500/20 px-4 py-1 backdrop-blur-sm">
                     <Code2 className="mr-2 h-4 w-4 text-indigo-100" />
                     <p className="text-sm font-medium text-indigo-100">Faculty of Computer Science</p>
                  </div>
                  <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                     Submit Your <span className="text-amber-400">Project</span>
                  </h1>
                  <p className="mb-8 text-xl text-indigo-100">
                     Share your amazing work with the computizen community. Your project will be reviewed by our team before publication.
                  </p>

                  {/* Info Badge */}
                  <div className="inline-flex items-center gap-2 rounded-lg bg-amber-500/20 px-4 py-2 backdrop-blur-sm border border-amber-400/30">
                     <Lightbulb className="w-5 h-5 text-amber-300" />
                     <p className="text-sm text-amber-100">
                        <span className="font-semibold">Note:</span> Projects require admin approval before appearing on the main page
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

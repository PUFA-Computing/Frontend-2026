import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 600;
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Projects",
};

export default function ProjectsPage() {
    return (
        <div className="w-full min-h-screen">
            <section className="mx-auto max-w-7xl p-5 md:p-10">
                <div className="space-y-2">
                    <h1 className="text-[2rem] font-black tracking-wide md:text-[2.5rem]">
                        CS Projects
                    </h1>
                    <p className="text-sm font-[500] text-[#353535]">
                        The latest projects uploaded by computizens
                    </p>
                </div>
            </section>
            
            {/* Coming Soon Content */}
            <section className="mx-auto max-w-7xl p-5 py-[3rem] md:p-10">
                <div className="flex flex-col items-center justify-center space-y-8 py-16">
                    <div className="text-center animate-fade-in">
                        <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Projects Gallery Coming Soon
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            We're working on showcasing amazing projects from our talented computizens. 
                            Stay tuned for an exciting collection of innovative work!
                        </p>
                    </div>
                    
                    <div className="relative w-full max-w-2xl h-64 md:h-80 mt-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg overflow-hidden">
                            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-100 rounded-full opacity-70"></div>
                            <div className="absolute -top-16 -left-16 w-64 h-64 bg-purple-100 rounded-full opacity-70"></div>
                            
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6 w-full max-w-lg">
                                    {[1, 2, 3, 4, 5, 6].map((item) => (
                                        <div 
                                            key={item}
                                            className="aspect-square bg-white rounded-lg shadow-md flex items-center justify-center hover:scale-105 transition-transform duration-300"
                                        >
                                            <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8">
                        <Link 
                            href="/" 
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

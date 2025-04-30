"use client";
import { GetAspirationById } from "@/services/api/aspiration";
import { useParams, useRouter } from "next/navigation";
import ReplyAspirationsPage from "@/app/(admin)/admin/aspirations/[id]/_components/ReplyAspirationsPage";
import { useEffect, useState } from "react";
import Aspirations from "@/models/aspiration";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function ReplyPage() {
    const params = useParams<{ id: string }>();
    console.log('Raw ID parameter:', params.id);
    
    // Pastikan ID valid dengan menghapus karakter non-numerik
    const cleanId = params.id.replace(/[^0-9]/g, '');
    const id = parseInt(cleanId, 10);
    console.log('Parsed ID:', id);

    const [aspiration, setAspiration] = useState<Aspirations | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('Fetching aspiration with ID:', id);
        GetAspirationById(id)
            .then((data) => {
                console.log('Received aspiration data:', data);
                // Pastikan data memiliki semua properti yang diperlukan
                if (data && typeof data === 'object') {
                    // Jika data diterima dalam format yang berbeda dari yang diharapkan
                    // Kita perlu memeriksa struktur data dan mengambil data aspirasi yang benar
                    let aspirationData;
                    
                    // Periksa apakah data memiliki properti 'data' atau 'result'
                    if ('data' in data) {
                        aspirationData = data.data;
                    } else if ('result' in data) {
                        aspirationData = data.result;
                    } else {
                        aspirationData = data;
                    }
                    
                    setAspiration(aspirationData as Aspirations);
                } else {
                    console.error('Invalid aspiration data format:', data);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching aspiration:', error);
                setLoading(false);
            });
    }, [id]);

    const router = useRouter();
    
    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (!aspiration) return (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="text-red-500 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Aspiration not found</h3>
            <p className="text-sm text-gray-500 mt-1">The aspiration you're looking for doesn't exist or has been removed</p>
            <button 
                onClick={() => router.push('/admin/aspirations')} 
                className="mt-4 inline-flex items-center rounded-md bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
            >
                <ArrowLeftIcon className="h-4 w-4 mr-1.5" />
                Back to Aspirations
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => router.push('/admin/aspirations')} 
                    className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-1.5" />
                    Back
                </button>
                <h1 className="text-xl font-semibold text-gray-900 ml-2">Aspiration Details</h1>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <ReplyAspirationsPage aspiration={aspiration} />
            </div>
        </div>
    );
}

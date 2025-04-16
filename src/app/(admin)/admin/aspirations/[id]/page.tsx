"use client";
import { GetAspirationById } from "@/services/api/aspiration";
import { useParams } from "next/navigation";
import ReplyAspirationsPage from "@/app/(admin)/admin/aspirations/[id]/_components/ReplyAspirationsPage";
import { useEffect, useState } from "react";
import Aspirations from "@/models/aspiration";

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

    if (loading) return <div>Loading...</div>;

    if (!aspiration) return <div>Aspiration not found</div>;

    return (
        <section>
            <ReplyAspirationsPage aspiration={aspiration} />
        </section>
    );
}

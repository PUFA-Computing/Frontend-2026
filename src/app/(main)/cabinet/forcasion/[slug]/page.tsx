import { divisionPage } from "@/lib/page";
import { redirect } from "next/navigation";
import React from "react";
import SwiperCard from "./_components/SwiperCard";
import EventsAndWorkplan from "@/components/cabinet/EventsAndWorkplan";
import Header from "@/components/cabinet/Header";

interface CabinetProps {
    params: { slug: string };
}

export default function page({ params }: CabinetProps) {
    const { slug } = params;

    const divisionData = divisionPage.find((divisions) => divisions.slug === slug);
    if (!divisionData) {
        if (typeof window !== 'undefined') {
            redirect("/404")
        }
        return null;
    }

    const { division, description, button, banner, member } = divisionData;

    // Map division slugs to their corresponding image files in the cabinet folder
    const getImagesForDivision = (slug: string): { image: string; image2?: string } => {
        switch(slug) {
            case 'board-of-director':                   return { image: '/images/cabinet/2025-2026/BOD.webp' };
            case 'communication-and-multimedia':        return { image: '/images/cabinet/2025-2026/Com.webp', image2: '/images/cabinet/2025-2026/Mulmed.webp' };
            case 'external-relation':                   return { image: '/images/cabinet/2025-2026/External.webp' };
            case 'entrepreneur':                        return { image: '/images/cabinet/2025-2026/Entre.webp' };
            case 'internal-relation':                   return { image: '/images/cabinet/2025-2026/Internal.webp' };
            case 'art-and-sport':                       return { image: '/images/cabinet/2025-2026/AnS.webp' };
            case 'research-and-technology':             return { image: '/images/cabinet/2025-2026/coming-soon.webp' };
            case 'student-development-and-competition': return { image: '/images/cabinet/2025-2026/SDC.webp' };
            case 'student-welfare-advocacy':            return { image: '/images/cabinet/2025-2026/SWA.webp' };
            default: return { image: '/placeholder.svg' };
        }
    };

    const { image: divisionImage, image2: divisionImage2 } = getImagesForDivision(slug);

    return (
        <section>
            <Header
                title={division}
                description={description}
                image={divisionImage}
                image2={divisionImage2}
            />
            <EventsAndWorkplan buttons={button} />
            <SwiperCard members={member} />
        </section>
    );
}

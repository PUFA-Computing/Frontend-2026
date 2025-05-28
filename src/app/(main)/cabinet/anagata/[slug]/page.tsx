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
    const getImageForDivision = (slug: string) => {
        switch(slug) {
            case 'board-of-director': return '/images/cabinet/BOD.JPG';
            case 'communication-and-multimedia': return '/images/cabinet/CnM.JPG';
            case 'external-relation': return '/images/cabinet/ER.JPG';
            case 'entrepreneur': return '/images/cabinet/Entre.JPG';
            case 'internal-relation': return '/images/cabinet/IR.JPG';
            case 'art-and-sport': return '/images/cabinet/ANS.JPG';
            case 'research-and-technology': return '/images/cabinet/RnT.png';
            case 'student-development-and-competition': return '/images/cabinet/SDC.JPG';
            case 'student-welfare-advocacy': return '/images/cabinet/SWA.JPG';
            default: return '/placeholder.svg';
        }
    };

    // Get the appropriate image for this division
    const divisionImage = getImageForDivision(slug);

    return (
        <section>
            <Header
                title={division}
                description={description}
                image={divisionImage}
            />
            <EventsAndWorkplan buttons={button} />
            {/* member */}
            <SwiperCard members={member} />
        </section>
    );
}

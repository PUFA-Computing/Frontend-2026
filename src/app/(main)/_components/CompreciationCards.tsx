import CompreciationCard from "@/components/main/CompreciationCard";
import { db } from "@/lib/db";
import Logo from "@/assets/backgroundimg.svg";

export default async function CompreciationCards() {
    // Sample data until database is connected
    const sampleProjects = [
        {
            id: 1,
            title: "DreamScape AR",
            description:
                "A game that helps visualize campus performance and provides recommendations for improvement using augmented reality technology.",
            createdAt: new Date("2023-11-28"),
            major: "Informatics",
            teamMembers: ["Fatimah & Amelia"],
            imageUrl: Logo,
        },
        {
            id: 2,
            title: "Desa Harapan",
            description:
                "A system designed to monitor and enhance village performance through data-driven insights and community engagement.",
            createdAt: new Date("2023-12-01"),
            major: "Information Systems",
            teamMembers: ["Guido Sijabok"],
            imageUrl: Logo,
        },
        {
            id: 3,
            title: "EcoVision",
            description:
                "An innovative platform that promotes environmental awareness through interactive visualization and real-time data analysis.",
            createdAt: new Date("2023-12-05"),
            major: "Visual Communication Design",
            teamMembers: ["Sarah & Team"],
            imageUrl: Logo,
        },
    ];
    // const projects = ({
    //     select: {
    //        id: true,
    //        title: true,
    //        description: true,
    //        createdAt: true,
    //        major: true,
    //        teamMembers: true,
    //        ProjectImage: {
    //           select: {
    //              imageUrl: true,
    //           },
    //        },
    //     },
    //     take: 3,
    //     orderBy: {
    //        createdAt: "desc",
    //     },
    //  });

    const dateConvert = (date: Date) => {
        const months = [
            // "Jan",
            // "Feb",
            // "Mar",
            // "Apr",
            // "May",
            // "Jun",
            // "Jul",
            // "Aug",
            // "Sep",
            // "Oct",
            // "Nov",
            // "Dec",

            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        return `${date.getDate().toString().padStart(2, "0")} ${
            months[date.getMonth()]
            // } ${date.getFullYear().toString().padStart(2, "0")}`;
        } ${date.getFullYear()}`;
    };

    return (
        // <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        // {/*{projects.map((project) => (*/}
        // {/*   <CompreciationCard*/}
        // {/*      key={project.id}*/}
        // {/*      date={dateConvert(project.createdAt)}*/}
        // {/*      title={project.title}*/}
        // {/*      name={project.teamMembers[0]}*/}
        // {/*      description={project.description}*/}
        // {/*      major={project.major}*/}
        // {/*   />*/}
        // {/*))}*/}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sampleProjects.map((project) => (
                <CompreciationCard
                    key={project.id}
                    date={dateConvert(project.createdAt)}
                    title={project.title}
                    name={project.teamMembers[0]}
                    description={project.description}
                    major={project.major}
                    imageUrl={project.imageUrl}
                />
            ))}
        </div>
    );
}

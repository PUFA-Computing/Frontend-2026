import { db } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";

export default async function ProjectsCard() {
   const projects = await db.project.findMany({
      select: {
         id: true,
         title: true,
         description: true,
         major: true,
         teamMembers: true,
         teamName: true,
         batch: true,
         codeLink: true,
         ProjectImage: {
            select: {
               imageUrl: true,
            },
         },
      },
      orderBy: {
         createdAt: "desc",
      },
   });

   function isWhatType(link: string) {
      const sourceCode = ["drive.google.com", "github.com", "gitlab.com"];
      const presentation = [
         "docs.google.com",
         "youtube.com",
         "slides.google.com",
      ];

      return sourceCode.some((sc) => link.includes(sc))
         ? "sc"
         : presentation.some((pr) => link.includes(pr))
           ? "ss"
           : "other";
   }

   //TODO: Make the image swipeable
   return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
         {projects.map((project) => (
            <div
               className="flex flex-col gap-4 rounded-lg border  border-black"
               key={project.id}
            >
               <div>
                  {project.ProjectImage.map((image) => (
                     <img
                        key={image.imageUrl}
                        src={image.imageUrl || "/PUComputing.png"}
                        alt={project.title}
                        width={256}
                        height={256}
                        className="mx-auto max-h-64 w-full rounded-t-lg"
                     />
                  ))}
               </div>
               <div className="flex flex-grow flex-col justify-between p-3">
                  <div className="space-y-2">
                     {project.teamName && <p>Team Name: {project.teamName}</p>}
                     <p>Members: {project.teamMembers.join(", ")}</p>
                     <p className="text-center font-semibold">
                        {project.title}
                     </p>
                     <p className="text-zinc-600">{project.description}</p>
                  </div>
                  <div className="flex flex-row justify-between">
                     <Link
                        className="text-blue-500 duration-300 hover:text-blue-600 hover:underline"
                        href={project.codeLink}
                        target="_blank"
                     >
                        {isWhatType(project.codeLink) === "sc"
                           ? "Source Code"
                           : "Presentation Link"}
                     </Link>
                     <p className="text-end text-sm">
                        {project.major} - {project.batch}
                     </p>
                  </div>
               </div>
            </div>
         ))}
      </div>
   );
}

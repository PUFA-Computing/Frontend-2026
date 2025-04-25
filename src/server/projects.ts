"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import "server-only";
import { z } from "zod";

const CreateProjectSchema = z.object({
   title: z.string({ required_error: "Title is required" }).min(5, {
      message: "Title must be at least 5 characters",
   }),
   description: z
      .string({ required_error: "Description is required" })
      .min(10, { message: "Description must be at least 10 characters" }),
   major: z
      .string({ required_error: "Major is required" })
      .min(1, { message: "Major is required" }),
   images: z
      .array(z.string({ required_error: "Images is required" }))
      .min(1, { message: "Images is required" }),
   teamName: z.string().nullable(),
   teamMembers: z.array(
      z.string({ required_error: "Team Members is required" })
   ),
   batch: z.string({ required_error: "Batch is required" }).min(4, {
      message: "Batch is required",
   }),
   codeLink: z.string({ required_error: "Code Link is required" }).min(4, {
      message: "Code Link is required",
   }),
});

export async function CreateProject(form: unknown) {
   const result = CreateProjectSchema.safeParse(form);
   if (!result.success) {
      let errorMessage = "";
      result.error.issues.forEach((issue) => {
         errorMessage += issue.message + ". ";
      });
      return { error: errorMessage };
   }
   const data = result.data;
   const putDb = await db.project.create({
      data: {
         title: data.title,
         description: data.description,
         major: data.major,
         teamMembers: JSON.stringify(data.teamMembers), // Convert array to JSON string
         teamName: data.teamName,
         batch: data.batch,
         codeLink: data.codeLink,
      },
   });
   if (!putDb) {
      return { error: "Failed to create project" };
   }
   for (const image of data.images) {
      const putImage = await db.projectImage.create({
         data: {
            imageUrl: image,
            projectId: putDb.id,
         },
      });
   }
   revalidatePath("/projects");
   return { error: false, message: "Project created", id: putDb.id };
}

"use client";
import Button from "@/components/Button";
import Textarea from "@/components/Textarea";
import Input2 from "@/components/Input";
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { CreateProject } from "@/server/projects";
import { z } from "zod";
import { redirect } from "next/navigation";
import Swal from "sweetalert2";
import { useState } from "react";
import TeamMembers from "./TeamMembers";
import Images from "./Images";

export default function ProjectForm() {
   const [members, setMembers] = useState<string[]>([""]);
   const [images, setImages] = useState<File[]>([]);
   const majors = [
      {
         name: "Informatics",
         category: "Computing",
      },
      {
         name: "Information System",
         category: "Computing",
      },
   ];

   const majorCategories = Array.from(
      new Set(majors.map((major) => major.category))
   );

   const FormDataSchema = z.object({
      title: z.string({ required_error: "Title is required" }).min(5, {
         message: "Title must be at least 5 characters",
      }),
      teamName: z.string().nullable(),
      teamMembers: z.array(
         z.string({ required_error: "Team Members is required" })
      ),
      batch: z.string({ required_error: "Batch is required" }).min(4, {
         message: "Batch is required",
      }),
      description: z
         .string({ required_error: "Description is required" })
         .min(10, { message: "Description must be at least 10 characters" }),
      major: z
         .string({ required_error: "Major is required" })
         .min(1, { message: "Major is required" }),
      codeLink: z.string({ required_error: "Code Link is required" }).min(4, {
         message: "Code Link is required",
      }),
   });

   async function uploadImage(file: File) {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch("/api/upload", {
         method: "POST",
         body: formData,
      });
      const data = await response.json();
      if (data.error) {
         alert(data.error);
         return;
      }
      return data.url;
   }

   async function handleAction(form: FormData) {
      const data = {
         teamName: form.get("teamName"),
         teamMembers: members,
         title: form.get("title"),
         description: form.get("description"),
         major: form.get("major"),
         batch: form.get("batch"),
         codeLink: form.get("codeLink"),
      };

      const result = FormDataSchema.safeParse(data);
      if (
         data.teamMembers.length > 1 &&
         !data.teamName &&
         data.teamName !== ""
      ) {
         return Swal.fire({
            icon: "error",
            title: "Error",
            text: "Team Name is required when there are more than 1 team members.",
         });
      }
      if (!result.success) {
         let errorMessage = "";
         result.error.issues.forEach((issue) => {
            errorMessage += issue.message + ".\n";
         });
         Swal.fire({
            icon: "error",
            title: "Error",
            text: errorMessage,
         });
         return;
      }

      const sourceCode = ["drive.google.com", "github.com", "gitlab.com"];
      const presentation = [
         "docs.google.com",
         "youtube.com",
         "slides.google.com",
      ];

      if (
         !sourceCode.some((sc) => result.data.codeLink.includes(sc)) &&
         !presentation.some((pr) => result.data.codeLink.includes(pr))
      ) {
         return Swal.fire({
            icon: "error",
            title: "Error",
            text: "Invalid allowable link, please use Google Drive, Github, Gitlab, Google Docs, Google Slides, Youtube",
         });
      }

      const imageUrls = [];

      for (const image of images) {
         const imageUrl = await uploadImage(image);
         if (!imageUrl) return;
         imageUrls.push(imageUrl);
      }

      const serializedData = JSON.parse(JSON.stringify(result.data));
      serializedData.images = imageUrls;

      const response = await CreateProject(serializedData);
      if (response.error) {
         Swal.fire({
            icon: "error",
            title: "Error",
            text: response.error as string,
         });
         return;
      }
      Swal.fire({
         icon: "success",
         title: "Success",
         text: "Project created successfully",
      });
      redirect("/projects");
   }

   const batches = [
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
      "2026",
   ];

   return (
      <form className="space-y-4" action={handleAction}>
         <Input2
            label="Team Name"
            placeholder="Team Name"
            htmlFor="teamName"
            name="teamName"
            type="text"
         />
         <TeamMembers members={members} setMembers={setMembers} />
         <Input2
            label="Title"
            placeholder="Your Title Project"
            htmlFor="name"
            name="title"
            type="text"
         />
         <div className="space-y-2">
            <label htmlFor="description" className="block">
               Description
            </label>
            <Textarea
               id="description"
               name="description"
               placeholder="Project Description"
            ></Textarea>
         </div>
         <div className="space-y-2">
            <label htmlFor="major">Major</label>
            <Select name="major">
               <SelectTrigger id="major" className="w-full">
                  <SelectValue placeholder="Select Major" />
               </SelectTrigger>
               <SelectContent>
                  <SelectGroup className="bg-white">
                     {majorCategories.map((category) => (
                        <SelectGroup key={category}>
                           <SelectLabel>{category}</SelectLabel>
                           {majors
                              .filter((major) => major.category === category)
                              .map((major) => (
                                 <SelectItem
                                    key={major.name}
                                    value={major.name}
                                 >
                                    {major.name}
                                 </SelectItem>
                              ))}
                        </SelectGroup>
                     ))}
                  </SelectGroup>
               </SelectContent>
            </Select>
         </div>
         <div className="space-y-2">
            <label htmlFor="batch">Batch</label>
            <Select
               name="batch"
               defaultValue={new Date().getFullYear().toString()}
            >
               <SelectTrigger id="batch" className="w-full">
                  <SelectValue placeholder="Select Batch" />
               </SelectTrigger>
               <SelectContent>
                  <SelectGroup className="bg-white">
                     {batches.map((batch) => (
                        <SelectItem key={batch} value={batch}>
                           {batch}
                        </SelectItem>
                     ))}
                  </SelectGroup>
               </SelectContent>
            </Select>
         </div>
         <Images images={images} setImages={setImages} />
         <Input2
            label="Code Link Or Presentation Link"
            placeholder="Google Drive, Github, Gitlab, Google Docs, Google Slides, Youtube"
            htmlFor="codeLink"
            name="codeLink"
            type="text"
         />
         <Button type="submit" className="w-full">
            Submit
         </Button>
      </form>
   );
}

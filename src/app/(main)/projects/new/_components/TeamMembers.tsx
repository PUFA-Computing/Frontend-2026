"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, User, Linkedin } from "lucide-react";

export interface TeamMember {
   name: string;
   linkedinUrl: string;
}

interface TeamMembersProps {
   members: TeamMember[];
   setMembers: (members: TeamMember[]) => void;
   errors?: { [key: number]: { name?: string; linkedinUrl?: string } };
   disabled?: boolean;
}

export default function TeamMembers({
   members,
   setMembers,
   errors = {},
   disabled = false,
}: TeamMembersProps) {
   const addMember = () => {
      if (members.length < 10) {
         setMembers([...members, { name: "", linkedinUrl: "" }]);
      }
   };

   const removeMember = (index: number) => {
      if (members.length > 1) {
         const newMembers = members.filter((_, i) => i !== index);
         setMembers(newMembers);
      }
   };

   const updateMember = (index: number, field: keyof TeamMember, value: string) => {
      const newMembers = [...members];
      newMembers[index] = { ...newMembers[index], [field]: value };
      setMembers(newMembers);
   };

   return (
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <div>
               <label className="block text-sm font-medium text-gray-700">
                  Team Members <span className="text-red-500">*</span>
               </label>
               <p className="text-xs text-gray-500 mt-1">
                  Add 1-10 team members with their LinkedIn profiles
               </p>
            </div>
            <Button
               type="button"
               onClick={addMember}
               disabled={disabled || members.length >= 10}
               variant="outline"
               size="sm"
               className="flex items-center gap-2"
            >
               <Plus className="w-4 h-4" />
               Add Member
            </Button>
         </div>

         <div className="space-y-4">
            {members.map((member, index) => (
               <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3"
               >
                  <div className="flex items-center justify-between mb-2">
                     <span className="text-sm font-medium text-gray-700">
                        Member {index + 1}
                     </span>
                     {members.length > 1 && (
                        <Button
                           type="button"
                           onClick={() => removeMember(index)}
                           disabled={disabled}
                           variant="ghost"
                           size="sm"
                           className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                           <Trash2 className="w-4 h-4" />
                        </Button>
                     )}
                  </div>

                  {/* Name Input */}
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Full Name
                     </label>
                     <Input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateMember(index, "name", e.target.value)}
                        placeholder="e.g., John Doe"
                        disabled={disabled}
                        className={errors[index]?.name ? "border-red-500" : ""}
                     />
                     {errors[index]?.name && (
                        <p className="text-xs text-red-500">{errors[index].name}</p>
                     )}
                  </div>

                  {/* LinkedIn URL Input */}
                  <div className="space-y-1">
                     <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                        <Linkedin className="w-3 h-3" />
                        LinkedIn Profile URL
                     </label>
                     <Input
                        type="url"
                        value={member.linkedinUrl}
                        onChange={(e) => updateMember(index, "linkedinUrl", e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                        disabled={disabled}
                        className={errors[index]?.linkedinUrl ? "border-red-500" : ""}
                     />
                     {errors[index]?.linkedinUrl && (
                        <p className="text-xs text-red-500">{errors[index].linkedinUrl}</p>
                     )}
                  </div>
               </div>
            ))}
         </div>

         {members.length >= 10 && (
            <p className="text-xs text-amber-600">
               Maximum number of team members (10) reached
            </p>
         )}
      </div>
   );
}

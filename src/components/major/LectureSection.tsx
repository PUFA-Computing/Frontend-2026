"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Award, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Lecturer {
  id: string;
  name: string;
  position: string;
  image: string;
  isChief?: boolean;
}

interface LecturersSectionProps {
  lecturers: Lecturer[];
}

export default function LecturersSection({ lecturers }: LecturersSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const chiefMembers = lecturers.filter((lecturer) => lecturer.isChief);
  const facultyMembers = lecturers.filter((lecturer) => !lecturer.isChief);

  const filteredFaculty = facultyMembers.filter((lecturer) => {
    return (
      lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.position.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <section className="py-16 bg-white relative">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#B8841E]/5 rounded-full blur-[100px] -mr-[250px] -mt-[250px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0D1B3E]/5 rounded-full blur-[100px] -ml-[250px] -mb-[250px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0D1B3E]/5 shadow-sm">
              <Users className="h-8 w-8 text-[#0D1B3E]" />
            </div>
            <div>
              <h2 className="text-4xl font-display font-bold tracking-tight text-[#0D1B3E]">Our Faculty</h2>
              <p className="text-gray-500 font-light mt-1 text-lg">Meet our distinguished academic team</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="chief" className="w-full">
          <TabsList className="h-12 bg-[#0D1B3E]/5 p-1 rounded-xl w-full max-w-md mx-auto flex mb-8">
            <TabsTrigger value="chief" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[#B8841E] rounded-lg data-[state=active]:shadow-sm transition-all text-base">
              <Award className="mr-2 h-4 w-4" />
              Chief
            </TabsTrigger>
            <TabsTrigger value="faculty" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[#0D1B3E] rounded-lg data-[state=active]:shadow-sm transition-all text-base">
              <Users className="mr-2 h-4 w-4" />
              All Lecturers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chief" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {chiefMembers.map((lecturer) => (
                <LecturerCard key={lecturer.id} lecturer={lecturer} featured />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="faculty" className="mt-0">
            {filteredFaculty.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {filteredFaculty.map((lecturer) => (
                  <LecturerCard key={lecturer.id} lecturer={lecturer} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No faculty members found matching your search criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => setSearchTerm("")}
                  className="mt-4"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

function LecturerCard({ lecturer, featured = false }: { lecturer: Lecturer; featured?: boolean }) {
  return (
    <motion.div className="mt-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }}>
      <Dialog>
        <DialogTrigger asChild>
          <Card className={`overflow-hidden h-full cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl group ${featured ? "ring-1 ring-[#B8841E]/20" : ""}`}>
            <div className="relative">
              {featured && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-[#B8841E] text-white hover:bg-[#B8841E]/90 shadow-md border-none px-3 py-1 font-medium tracking-wide">Chief</Badge>
                </div>
              )}
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B3E]/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Image
                  src={lecturer.image || "/placeholder.svg"}
                  alt={lecturer.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>
            <CardContent className="p-6">
              <h3 className="font-display font-bold text-xl line-clamp-1 text-[#0D1B3E] group-hover:text-[#B8841E] transition-colors">{lecturer.name}</h3>
              <p className="text-gray-500 font-light text-sm mt-2">{lecturer.position}</p>
            </CardContent>
          </Card>
        </DialogTrigger>
      </Dialog>
    </motion.div>
  );
}

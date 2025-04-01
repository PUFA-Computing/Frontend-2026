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
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Our Faculty</h2>
              <p className="text-muted-foreground">Meet our distinguished academic team</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="chief" className="w-full">
          <TabsList className="h-10 bg-muted/50 p-1">
            <TabsTrigger value="chief" className="data-[state=active]:bg-white rounded-md px-6">
              <Award className="mr-2 h-4 w-4" />
              Chief
            </TabsTrigger>
            <TabsTrigger value="faculty" className="data-[state=active]:bg-white rounded-md px-6">
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
    <motion.div className="mt-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}>
      <Dialog>
        <DialogTrigger asChild>
          <Card className={`overflow-hidden h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px] ${featured ? "border-primary/20" : ""}`}>
            <div className="relative">
              {featured && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="bg-primary hover:bg-primary">Chief</Badge>
                </div>
              )}
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={lecturer.image || "/placeholder.svg"}
                  alt={lecturer.name}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg line-clamp-1">{lecturer.name}</h3>
              <p className="text-primary text-sm font-medium mt-1">{lecturer.position}</p>
            </CardContent>
          </Card>
        </DialogTrigger>
      </Dialog>
    </motion.div>
  );
}

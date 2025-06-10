// Import the new LecturersSection component
import Image from "next/image"
import ListCard from "@/components/major/ListCard"
import VnMSection from "@/components/major/VnMSection"
import LecturersSection from "@/components/major/LectureSection"
import UpdateNotice from "@/components/major/UpdateNotice"
import { majorPage } from "@/lib/page"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { BookOpen, GraduationCap, Info } from "lucide-react"

interface StudyProgramPageProps {
  params: { slug: string }
}

export default function StudyProgramPage({ params }: StudyProgramPageProps) {
  const { slug } = params

  const programData = majorPage.find((program) => program.slug === slug)

  if (!programData) {
    redirect("/404")
  }

  const { image, vision, mission, profession, description, lecturers, name } = programData

  // Transform lecturers data to match the new LecturersSection component
  const formattedLecturers = lecturers.map((lecturer, index) => ({
    id: `lecturer-${index}`,
    name: lecturer.name,
    position: lecturer.position || "Lecturer",
    image: lecturer.image.src,
    isChief: lecturer.position === "Head of Study Program" || lecturer.position === "Dean Faculty of Computing",
  }))

  return (
    <section className="flex flex-col items-center pb-24">
      {/* Hero Section */}
      <div className="relative w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10 rounded-b-3xl" />
        <Image
          width={1920}
          height={600}
          src={image || "/placeholder.svg"}
          alt={programData.name}
          className="w-full h-[50vh] object-cover rounded-b-3xl"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 z-20 p-8 md:p-12 text-white">
          <div className="container mx-auto">
            <Badge className="mb-4 bg-primary hover:bg-primary/90">Study Program</Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{name}</h1>
            <p className="text-white/80 max-w-2xl">{description.split(" ").slice(0, 20).join(" ")}...</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {/* Information Update Notice */}
        <div className="my-8">
          <UpdateNotice />
        </div>
        
        {/* About Section */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 my-8">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">About Study Program</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">{description}</p>
        </div>

        {/* Career and Vision/Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 h-full">
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Future Field and Career</h2>
            </div>
            <ListCard content={profession} />
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 h-full">
            <VnMSection missionContent={mission} visionContent={vision} />
          </div>
        </div>

        {/* Replace the old lecturers section with the new component */}
        <div className="mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center">
            <div className="bg-blue-100 p-1.5 rounded-full mr-3">
              <Info className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-sm text-blue-700">Faculty information may not reflect the current academic year. We're working to update this section.</p>
          </div>
          <LecturersSection lecturers={formattedLecturers} />
        </div>
      </div>
    </section>
  )
}

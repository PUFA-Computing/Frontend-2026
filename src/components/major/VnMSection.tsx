"use client"
import ListVisionAndMissionCard from "@/components/major/ListVisionAndMissionCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Target } from "lucide-react"

interface VnMSectionProps {
  visionContent: string[]
  missionContent: string[]
}

export default function VnMSection({ visionContent, missionContent }: VnMSectionProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <Target className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">Vision & Mission</h2>
      </div>

      <Tabs defaultValue="vision" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="vision" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Vision
          </TabsTrigger>
          <TabsTrigger value="mission" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Mission
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vision">
          <ListVisionAndMissionCard content={visionContent} type="vision" />
        </TabsContent>

        <TabsContent value="mission">
          <ListVisionAndMissionCard content={missionContent} type="mission" />
        </TabsContent>
      </Tabs>
    </div>
  )
}


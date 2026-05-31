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
      <div className="flex items-center gap-4 mb-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0D1B3E]/10 text-[#0D1B3E]">
          <Target className="h-7 w-7" />
        </div>
        <h2 className="text-3xl font-display font-bold text-[#0D1B3E]">Vision & Mission</h2>
      </div>

      <Tabs defaultValue="vision" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#0D1B3E]/5 p-1 rounded-xl">
          <TabsTrigger value="vision" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#B8841E] data-[state=active]:shadow-sm transition-all py-2.5">
            <Eye className="h-4 w-4" />
            <span className="font-semibold tracking-wide">Vision</span>
          </TabsTrigger>
          <TabsTrigger value="mission" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#0D1B3E] data-[state=active]:shadow-sm transition-all py-2.5">
            <Target className="h-4 w-4" />
            <span className="font-semibold tracking-wide">Mission</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vision" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ListVisionAndMissionCard content={visionContent} type="vision" />
        </TabsContent>

        <TabsContent value="mission" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ListVisionAndMissionCard content={missionContent} type="mission" />
        </TabsContent>
      </Tabs>
    </div>
  )
}


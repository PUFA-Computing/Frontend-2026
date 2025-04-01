import type React from "react"
import { Check, Target } from "lucide-react"

interface ListVisionAndMissionProps {
  content: string[]
  type: "vision" | "mission"
}

const ListVisionAndMissionCard: React.FC<ListVisionAndMissionProps> = ({ content, type }) => {
  return (
    <div className="space-y-4">
      {content.map((item, index) => (
        <div key={index} className="flex items-start gap-3">
          {type === "mission" ? (
            <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Target className="h-3 w-3 text-primary" />
            </div>
          ) : (
            <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-3 w-3 text-primary" />
            </div>
          )}
          <span className="text-gray-700">{item}</span>
        </div>
      ))}
    </div>
  )
}

export default ListVisionAndMissionCard


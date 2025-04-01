import type React from "react"
import { Check } from "lucide-react"

interface ListProps {
  content: string[]
}

const ListCard: React.FC<ListProps> = ({ content }) => {
  return (
    <ul className="space-y-4">
      {content.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Check className="h-3 w-3 text-primary" />
          </div>
          <span className="text-gray-700">{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default ListCard


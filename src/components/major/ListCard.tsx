import type React from "react"
import { Check } from "lucide-react"

interface ListProps {
  content: string[]
}

const ListCard: React.FC<ListProps> = ({ content }) => {
  return (
    <ul className="space-y-5">
      {content.map((item, index) => (
        <li key={index} className="flex items-start gap-4 group">
          <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#B8841E]/10 transition-colors duration-300 group-hover:bg-[#B8841E]/20">
            <Check className="h-3.5 w-3.5 text-[#B8841E]" />
          </div>
          <span className="text-gray-600 font-light leading-relaxed group-hover:text-gray-800 transition-colors duration-300">{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default ListCard


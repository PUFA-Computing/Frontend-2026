import type React from "react"

interface SeperatorProps {
  className?: string
}

const Seperator: React.FC<SeperatorProps> = ({ className = "" }) => {
  return (
    <div className="relative py-4">
      <div className="absolute inset-0 flex items-center">
        <div className={`w-full border-t ${className}`}></div>
      </div>
      <div className="relative flex justify-center">
        <span className="bg-gradient-to-b from-slate-50 to-slate-100 px-4 text-gray-400">•••</span>
      </div>
    </div>
  )
}

export default Seperator
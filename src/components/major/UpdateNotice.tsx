import { InfoIcon } from "lucide-react"


export default function UpdateNotice() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-100 rounded-full opacity-50" />
      <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-amber-100 rounded-full opacity-30" />
      
      <div className="flex items-start relative z-10">
        <div className="bg-amber-100 p-2 rounded-full mr-3 mt-0.5">
          <InfoIcon className="h-5 w-5 text-amber-700" />
        </div>
        
        <div>
          <h4 className="font-medium text-amber-900 mb-1 text-base">Information Notice</h4>
          <p className="text-amber-800 text-sm leading-relaxed">
          Faculty information may not reflect the current academic year. We're working to update this section.
          </p>
        </div>
      </div>
    </div>
  )
}

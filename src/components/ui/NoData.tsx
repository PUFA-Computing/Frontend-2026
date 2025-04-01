import React from "react"
import { CalendarX } from "lucide-react"

interface NoDataProps {
  title: string
  message: string
}

export default function NoData({ title, message }: NoDataProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-white p-10 text-center shadow-md">
      <div className="mb-4 rounded-full bg-indigo-50 p-4">
        <CalendarX className="h-10 w-10 text-indigo-500" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="max-w-md text-gray-600">{message}</p>
    </div>
  )
}


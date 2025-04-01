import type React from "react"
import type { ReactNode } from "react"

interface PageHeadingProps {
  title: string
  description: string
  borderColor?: string
  icon?: ReactNode
}

const PageHeading: React.FC<PageHeadingProps> = ({ title, description, borderColor = "amber-400", icon }) => {
  return (
    <section className="bg-gradient-to-r from-indigo-900 to-purple-800 px-4 py-16 sm:px-6 md:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="relative border-l-4 border-amber-400 pl-6">
          <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-amber-400"></div>
          <div className="absolute -left-2 bottom-0 h-4 w-4 rounded-full bg-amber-400"></div>
          <div className="flex items-center">
            {icon && <div className="mr-3">{icon}</div>}
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">{title}</h1>
          </div>
          <p className="mt-3 text-lg text-indigo-100">{description}</p>
        </div>
      </div>
    </section>
  )
}

export default PageHeading
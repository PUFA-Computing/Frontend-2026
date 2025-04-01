import Link from "next/link"
import Image from "next/image"

/**
 * OrganizationLogo component displays an organization's logo and title.
 *
 * @component
 * @example
 * // Example usage of OrganizationLogo component
 * <OrganizationLogo
 *    image="path/to/image.jpg"
 *    title="Event Organization Name"
 *    link="/events/organization"
 * />
 */

interface OrganizationLogoProps {
  image: string
  title: string
  link: string
}

export default function LogoOrganizationEventPage({ image, title, link }: OrganizationLogoProps) {
  return (
    <Link href={link}>
      <div className="group flex flex-col items-center justify-center">
        <div className="mb-4 overflow-hidden rounded-xl bg-white p-4 shadow-md transition-all duration-300 group-hover:shadow-xl">
          <div className="relative h-24 w-24">
            <Image
              src={image || "/placeholder.svg"}
              alt={`${title} logo`}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </div>
        <h3 className="text-center text-sm font-medium text-gray-800 transition-colors group-hover:text-indigo-700">
          {title}
        </h3>
      </div>
    </Link>
  )
}


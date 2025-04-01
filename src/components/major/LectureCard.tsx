import Image from "next/image"
import type React from "react"
import { Card, CardContent } from "@/components/ui/card"

/**
 * Props for the LectureCard component.
 */
interface LectureCardProps {
    /**
     * The path or URL to the lecturer's image.
     */
    image: string;

    /**
     * The name of the lecturer.
     */
    name: string;

    /**
     * The position or title of the lecturer.
     */
    position?: string;
}

/**
 * LectureCard component for displaying information about a lecturer.
 *
 * @component
 * @example
 * const lecturer: LectureCardProps = {
 *   image: "path/to/lecturer-image.jpg",
 *   name: "John Doe",
 *   position: "Professor of Computer Science",
 * };
 * <LectureCard {...lecturer} />
 *
 * @param {LectureCardProps} props - The properties of the LectureCard component.
 * @returns {JSX.Element} - The rendered LectureCard component.
 */
const LectureCard: React.FC<LectureCardProps> = ({ image, name, position }) => {
    return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px] group">
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <Image
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            src={image || "/placeholder.svg"}
            alt={`${name}'s photo`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg">{name}</h3>
          {position && <p className="text-primary font-medium text-sm mt-1">{position}</p>}
        </CardContent>
      </Card>
    )
  }
  
  export default LectureCard

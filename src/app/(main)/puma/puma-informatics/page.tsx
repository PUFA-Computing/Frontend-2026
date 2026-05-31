import BGIMAGE from "@/assets/background/PUMA_IT.jpg"
import LOGO from "@/assets/logo/PUMA_IT.png"
import PUMAHero from "@/components/puma/PUMAHero"
import About from "@/components/puma/About"
import { PUMAInformaticsVnM, PUMAInformatics, aboutContentInformatics } from "@/lib/data"
import VisionAndMission from "@/components/puma/VisionAndMission"
import LogoSection from "@/components/puma/LogoSection"
import PUMAStructure from "@/components/puma/PUMAStructure"

function Page() {
  return (
    <main className="min-h-screen bg-[#F8F9FC] text-[#0D1B3E] overflow-hidden">
      <PUMAHero 
        image={BGIMAGE.src}
        logo={LOGO.src}
        title="PUMA Informatics"
        slogan='"TOGETHER WE THRIVE, UNITED WE THRIVE"'
        cabinet="Kaustav CABINET PERIOD 2024/2025"
      />
      
      <div className="container mx-auto max-w-6xl px-6 -mt-6">
        {/* About Section */}
        <About content={aboutContentInformatics} />
        
        {/* Logo Philosophy Section */}
        <LogoSection
          title="Letter C, IT, and Circuits"
          image={LOGO.src}
          description="This logo reflects the identity of PUMA Informatics under the Computer Science faculty. By using elements such as the letter C, IT, and circuits, this logo depicts the attachment, diversity, and unity within PUMA Informatics."
        />
        
        {/* Division Structure Section */}
        <PUMAStructure
          divisions={PUMAInformatics}
        />
        
        {/* Vision and Mission Section */}
        <VisionAndMission
          visi={PUMAInformaticsVnM.vision}
          misi={PUMAInformaticsVnM.mission}
        />
      </div>
    </main>
  )
}

export default Page
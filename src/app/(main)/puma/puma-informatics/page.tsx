import BGIMAGE from "@/assets/background/PUMA_IT.jpg"
import LOGO from "@/assets/logo/PUMA_IT.png"
import PUMASection from "@/components/puma/PUMASection"
import About from "@/components/puma/About"
import Background from "@/components/puma/Background"
import { PUMAInformaticsVnM, PUMAInformatics, aboutContentInformatics } from "@/lib/data"
import VisionAndMission from "@/components/puma/VisionAndMission"
import PUMASectionMobile from "@/components/puma/PUMASectionMobile"
import LogoSection from "@/components/puma/LogoSection"
import PUMAStructure from "@/components/puma/PUMAStructure"

function Page() {
  return (
    <main className="min-h-screen bg-white text-gray-800 overflow-hidden">
      <Background image={BGIMAGE.src} logo={LOGO.src} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section - Responsive for all devices */}
        <PUMASectionMobile
        logo={LOGO.src}
        title="PUMA Informatics"
        slogan='"TOGETHER WE THRIVE, UNITED WE THRIVE"'
        cabinet="Kaustav CABINET PERIOD 2024/2025"
        />
        <PUMASection
        title="PUMA Informatics"
        slogan='"TOGETHER WE THRIVE, UNITED WE THRIVE"'
        cabinet="Kaustav CABINET PERIOD 2024/2025"
        />
        
        {/* About Section */}
        <About content={aboutContentInformatics} />
        
        {/* Logo Philosophy Section */}
        <LogoSection
          title="Letter C, IT, and Circuits"
          image={LOGO.src}
          description="This logo reflects the identity of PUMA
                      Informatics under the Computer Science faculty. By
                      using elements such as the letter C, IT, and
                      circuits, this logo depicts the attachment,
                      diversity, and unity within PUMA Informatics."
        />
        
        {/* Division Structure Section */}
        <PUMAStructure
          divisions={PUMAInformatics}
          color1="#FFFFFF"
          color2="#353535"
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
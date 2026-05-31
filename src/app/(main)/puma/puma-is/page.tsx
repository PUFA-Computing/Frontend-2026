import BGIMAGE from "@/assets/background/PUMA_IS.png";
import LOGO from "@/assets/logo/PUMA_IS.png";

import PUMAHero from "@/components/puma/PUMAHero";
import About from "@/components/puma/About";
import LogoSection from "@/components/puma/LogoSection";
import PUMAStructure from "@/components/puma/PUMAStructure";
import VisionAndMission from "@/components/puma/VisionAndMission";

import { aboutContentIS, PUMAInformationSystem, PUMAInformationSystemVnM } from "@/lib/data";

function Page() {
  return (
    <main className="min-h-screen bg-[#F8F9FC] text-[#0D1B3E] overflow-hidden">
      <PUMAHero
        image={BGIMAGE.src}
        logo={LOGO.src}
        title="PUMA Information System"
        slogan="“Navigate Now, Together be The Best”"
        cabinet="VIRSANTANA CABINET PERIOD 2024/2025"
      />

      <div className="container mx-auto max-w-6xl px-6 -mt-6">
        <About content={aboutContentIS} />

        <LogoSection
          title="Orange & Blue 'I' and 'S' Block Patterns with White Blocks"
          image={LOGO.src}
          description={
            <ul className="space-y-4 text-left list-none">
              <li className="flex gap-3 items-start">
                <span className="text-[#B8841E] mt-0.5">✦</span>
                <span className="text-[#3D4D6A] font-light"><strong className="text-[#0D1B3E] font-semibold">Black Circle</strong>: Represents diversity and togetherness, with black symbolizing Computing characteristics.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-[#B8841E] mt-0.5">✦</span>
                <span className="text-[#3D4D6A] font-light"><strong className="text-[#0D1B3E] font-semibold">Letters I and S Blocks</strong>: Reflect "Information System" formed from several connected blocks.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-[#B8841E] mt-0.5">✦</span>
                <span className="text-[#3D4D6A] font-light"><strong className="text-[#0D1B3E] font-semibold">Orange & Blue Blocks</strong>: Orange for Business, Blue for Technology — highlighting the IS combination.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-[#B8841E] mt-0.5">✦</span>
                <span className="text-[#3D4D6A] font-light"><strong className="text-[#0D1B3E] font-semibold">Two White Blocks</strong>: Represent collaboration between PUMA IS and other organizations in the Faculty of Computing.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-[#B8841E] mt-0.5">✦</span>
                <span className="text-[#3D4D6A] font-light"><strong className="text-[#0D1B3E] font-semibold">Circuit</strong>: Represents unity among diverse individuals. The diamond shape in the center symbolizes strength, eternity, and love.</span>
              </li>
            </ul>
          }
        />

        <PUMAStructure
          divisions={PUMAInformationSystem}
        />

        <VisionAndMission
          visi={PUMAInformationSystemVnM.vision}
          misi={PUMAInformationSystemVnM.mission}
        />
      </div>
    </main>
  );
}

export default Page;

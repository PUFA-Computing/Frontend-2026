import BGIMAGE from "@/assets/background/PUMA_IS.png";
import LOGO from "@/assets/logo/PUMA_IS.png";

import Background from "@/components/puma/Background";
import PUMASection from "@/components/puma/PUMASection";
import PUMASectionMobile from "@/components/puma/PUMASectionMobile";
import About from "@/components/puma/About";
import LogoSection from "@/components/puma/LogoSection";
import PUMAStructure from "@/components/puma/PUMAStructure";
import VisionAndMission from "@/components/puma/VisionAndMission";

import { aboutContentIS, PUMAInformationSystem, PUMAInformationSystemVnM } from "@/lib/data";

function Page() {
  return (
    <section>
      <Background image={BGIMAGE.src} logo={LOGO.src} />

      <PUMASectionMobile
        logo={LOGO.src}
        title="PUMA Information System"
        slogan="“Navigate Now, Together be The Best”"
        cabinet="VIRSANTANA CABINET PERIOD 2024/2025"
      />

      <PUMASection
        title="PUMA Information System"
        slogan="“Navigate Now, Together be The Best”"
        cabinet="VIRSANTANA CABINET PERIOD 2024/2025"
      />

      <About content={aboutContentIS} />

      <LogoSection
        title="Orange & Blue 'I' and 'S' Block Patterns with White Blocks"
        image={LOGO.src}
        description={
          <ul className="space-y-2 text-left list-none">
            <li>
              ✨ <b>Black Circle</b>: Represents diversity and togetherness, with black symbolizing Computing characteristics.
            </li>
            <li>
              ✨ <b>Letters I and S Blocks</b>: Reflect "Information System" formed from several connected blocks.
            </li>
            <li>
              ✨ <b>Orange & Blue Blocks</b>: Orange for Business, Blue for Technology — highlighting the IS combination.
            </li>
            <li>
              ✨ <b>Two White Blocks</b>: Represent collaboration between PUMA IS and other organizations in the Faculty of Computing.
            </li>
            <li>
              ✨ <b>Circuit</b>: Represents unity among diverse individuals. The diamond shape in the center symbolizes strength, eternity, and love.
            </li>
          </ul>
        }
      />

      <PUMAStructure
        divisions={PUMAInformationSystem}
        color1="#f97316"
        color2="#99f6e4"
      />

      <VisionAndMission
        visi={PUMAInformationSystemVnM.vision}
        misi={PUMAInformationSystemVnM.mission}
      />
    </section>
  );
}

export default Page;

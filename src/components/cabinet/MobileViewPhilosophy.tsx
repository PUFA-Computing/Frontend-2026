import React from "react";
import LogoPhilosophyCard from "./LogoPhilosophyCard";

export default function MobileViewPhilosophy() {
   return (
      <div className="block md:hidden">
         <div className="grid grid-cols-1 gap-y-10">
            <LogoPhilosophyCard
               image="/logo/forcasionLetterA.svg"
               title="Letter A"
               description="To strengthen relationships with faculty, PUFA Computing members, Computizens, PUSB, PUSC, all PUMA, Academic Communities, Alumni, and CnC."
            />
            <LogoPhilosophyCard
               image="/logo/forcasionBridge.svg"
               title="Bridge & 25 Pillars"
               description=" A bridge means PUFA Computing as an intermediary for
                     computing faculty to achieve a bright future. 25 Pillars
                     which means 25 people consisting of a combination of BoD,
                     HoD, and VoD."
            />
            <LogoPhilosophyCard
               image="/logo/forcasionSun.svg"
               title="SUN"
               description="The brilliant sun represents a bright future for the
                     computing faculty, with 9 sides of sunshine representing
                     the 9 divisions of PUFA Computing."
            />
         </div>
      </div>
   );
}

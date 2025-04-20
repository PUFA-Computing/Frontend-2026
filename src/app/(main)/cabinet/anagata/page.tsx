import Image from "next/image"
import Logo from "@/assets/forcasionlogo.png"
import Logo2 from "@/assets/PUComSci.png"
import Link from "next/link"
import { ChevronRight, ExternalLink } from "lucide-react"

export default function Page() {
   return (
      <div className="min-h-screen bg-white text-gray-800">
         

         {/* Hero Section - Modern Design */}
         <section className="relative h-[60vh] w-full overflow-hidden pt-20">
                {/* Background with subtle gradient and pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-[#F2B233]/5 -z-10"></div>
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay -z-10"></div>
                
                {/* Decorative elements */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-[#B48322]/5 rounded-full blur-3xl -z-5"></div>
                <div className="absolute bottom-20 left-20 w-72 h-72 bg-[#F2B233]/5 rounded-full blur-3xl -z-5"></div>
                
                <div className="container relative mx-auto flex h-full flex-col items-center justify-center px-4">
                    {/* Logo with modern styling - Moved down to avoid navbar overlap */}
                    <div className="relative mb-8 mt-16">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#B48322] to-[#F2B233] rounded-full blur opacity-75"></div>
                        <div className="relative bg-white rounded-full p-1">
                            <Image
                                src={Logo}
                                alt="Forcasion Logo"
                                width={180}
                                height={180}
                                className="rounded-full object-cover"
                                priority
                            />
                        </div>
                    </div>
                    
                    {/* Heading with modern typography */}
                    <h1 className="mb-4 text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#000000] via-[#B48322] to-[#F2B233] text-center">
                        FORCASION CABINET
                    </h1>
                    
                    {/* Tagline with elegant styling */}
                    <p className="mb-8 text-xl italic text-gray-600 max-w-2xl text-center">
                        "Together We Stand, Together We Succeed"
                    </p>
                    
                    {/* Decorative divider */}
                    <div className="w-24 h-1 bg-gradient-to-r from-[#B48322] to-[#F2B233] mx-auto mb-8"></div>
                </div>
            </section>

         {/* Vision & Mission - Modern Cards */}
         <section className="py-20 bg-gradient-to-b from-white to-gray-50">
                <div className="container mx-auto px-4">
                    {/* Section header */}
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-[#B48322]/10 text-[#B48322] text-xs sm:text-sm font-medium rounded-full mb-4">Our Purpose</span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#000000] via-[#B48322] to-[#F2B233]">
                            Vision & Mission
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#B48322] to-[#F2B233] mx-auto mb-6"></div>
                    </div>
                    
                    {/* Cards with modern design */}
                    <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
                        <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-xl border border-gray-100 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 rounded-full bg-[#B48322]/10 flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-[#B48322]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-[#B48322]">
                                    Vision
                                </h2>
                            </div>
                            <p className="text-lg leading-relaxed text-gray-700">
                                To create a united, communicative, and
                                competitive faculty where students from all
                                departments actively participate in academic and
                                non-academic activities and are fully supported
                                in achieving their highest potential.
                            </p>
                        </div>
                        
                        <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-xl border border-gray-100 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 rounded-full bg-[#B48322]/10 flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-[#B48322]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-[#B48322]">
                                    Mission
                                </h2>
                            </div>
                            <ul className="space-y-4 text-gray-700">
                                {[
                                    "Solidify - Enhance Solidarity and Cohesion Across Departments",
                                    "Communicate - Improve Effective Communication",
                                    "Organize - Encourage Participation in Academic and Non-Academic Activities",
                                    "Participate - Provide Support and Motivation to Students",
                                    "Encourage - Encourage Participation and Support Student Activities"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <svg className="w-5 h-5 text-[#B48322] mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                        </svg>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

      {/* Division Section - Modern Design */}
      <section id="divisions" className="py-24 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#F2B233]/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#B48322]/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-[#B48322]/5 to-[#F2B233]/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="container mx-auto px-4 relative">
          {/* Section header with modern styling */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[#B48322]/10 text-[#B48322] text-xs sm:text-sm font-medium rounded-full mb-4">Team Structure</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#000000] via-[#B48322] to-[#F2B233]">
              Our Divisions
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#B48322] to-[#F2B233] mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base md:text-lg">
              Meet the dedicated teams that work together to bring our vision to life and serve the Computing Faculty community.
            </p>
          </div>

          {/* Desktop View */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Center Logo */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#B48322] to-[#F2B233] opacity-30 blur-md"></div>
                  <Image
                    src={Logo2}
                    alt="Logo PUFA Computing"
                    width={180}
                    height={180}
                    className="bg-white/80 backdrop-blur-sm relative h-[180px] w-[180px] rounded-full border-4 border-[#B48322]/50 object-cover p-4 transition-all duration-500 hover:scale-105"
                  />
                </div>
              </div>

              {/* Divisions Grid */}
              <div className="grid grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="flex flex-col gap-8 pr-24">
                  {[
                    {
                      title: "Board of Director",
                      description:
                        "Is a representative of the highest division consisting of Chairperson, Vice Chairperson, Secretary and Treasurer.",
                      link: "anagata/board-of-director",
                      color: "from-[#B48322] to-[#F2B233]",
                      icon: "👑"
                    },
                    {
                      title: "External Relations",
                      description: "This division organize activities or events related to parties outside the campus. To build relationships with the community, other campus and companies. It also have purpose to share knowledge and experience with each other.",
                      link: "anagata/external-relation",
                      color: "from-[#B48322] to-[#F2B233]",
                      icon: "🤝"
                    },
                    {
                      title: "Internal Relations",
                      description:
                        "This division has the main task of strengthening the relationship between students and students, students and lecturers, students and alumni and PUMA - PUFA",
                      link: "anagata/internal-relation",
                      color: "from-[#B48322] to-[#F2B233]",
                      icon: "🏛️"
                    },
                    {
                      title: "Art and Sport",
                      description:
                        "Is a division that focuses on developing interest and burning the arts and sports in the computing sphere. This division also in charge of organizing both arts and sports activities so that computizens has a place to channel their non-academics potential.",
                      link: "anagata/art-and-sport",
                      color: "from-[#B48322] to-[#F2B233]",
                      icon: "🎨"
                    },
                    {
                      title: "Communication and Multimedia",
                      description:
                        "Is a division that handles PUFA Computing social media such as Instagram, LinkedIn, LINE OA, and youtube. Multimedia division is responsible to in charge of creating and editing templates content to be posted on social media PUFA Computing.",
                      link: "anagata/communication-and-multimedia",
                      color: "from-[#B48322] to-[#F2B233]",
                      icon: "📱"
                    },
                  ].map((division, index) => (
                    <Link
                      key={index}
                      href={division.link}
                      className="group flex flex-col items-end rounded-xl bg-white/80 backdrop-blur-sm p-6 text-right transition-all duration-500 hover:-translate-y-2 hover:shadow-xl border border-gray-100 shadow-md relative overflow-hidden"
                    >
                      {/* Right accent border */}
                      <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-[#B48322] to-[#F2B233]"></div>
                      
                      <div className="flex items-center justify-end mb-3">
                        <h3 className="mr-3 text-xl font-bold text-gray-800 group-hover:text-[#B48322] transition-colors duration-300">
                          {division.title}
                        </h3>
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#B48322]/10 text-lg">
                          {division.icon}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{division.description}</p>
                      <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-end text-[#B48322] transition-all duration-300 group-hover:-translate-x-1">
                        <span className="mr-1 text-sm font-medium">Learn more</span>
                        <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-8 pl-24">
                  {[
                    {
                      title: "Research and Technology",
                      description:
                        "Is a division in charge of developing creative ideas in the field of technology and sharing knowledge in the field of technology which aims to develop human resources, especially students within the campus itself.",
                      link: "anagata/research-and-technology",
                      color: "from-[#B48322] to-[#F2B233]",
                      icon: "💡"
                    },
                    {
                      title: "Student Development and Competition",
                      description:
                        "Is a division that focuses on improving the quality and optimizing the potential of Computizen in academic field, with the hope that it can have high competitiveness and contribute fully to the Faculty of Computing, President University, and Indonesia. ",
                      link: "anagata/student-development-and-competition",
                      color: "from-[#B48322] to-[#F2B233]",
                      icon: "🚀"
                    },
                    {
                      title: "Student Welfare Advocacy",
                      description:
                        "Is a division that serves as a bridge between Computizens (students) and the campus (faculty).SWA is responsible for accommodating aspirations and suggestions, as well as assisting and defending problems experienced by Computizens.",
                      link: "anagata/student-welfare-advocacy",
                      color: "from-[#B48322] to-[#F2B233]",
                      icon: "⚖️"
                    },
                    {
                      title: "Entrepreneurship",
                      description:
                        "Is a new division at PUFA Computing this cabinet, this division aims to develop computizens interests and talents in entrepreneurship and business.",
                      link: "anagata/entrepreneur",
                      color: "from-[#B48322] to-[#F2B233]",
                      icon: "💼"
                    },
                  ].map((division, index) => (
                    <Link
                      key={index}
                      href={division.link}
                      className="group flex flex-col items-start rounded-xl bg-white/80 backdrop-blur-sm p-6 text-left transition-all duration-500 hover:-translate-y-2 hover:shadow-xl border border-gray-100 shadow-md relative overflow-hidden"
                    >
                      {/* Left accent border */}
                      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#B48322] to-[#F2B233]"></div>
                      
                      <div className="flex items-center mb-3">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#B48322]/10 text-lg mr-3">
                          {division.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#B48322] transition-colors duration-300">
                          {division.title}
                        </h3>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{division.description}</p>
                      <div className="mt-4 pt-2 border-t border-gray-100 flex items-center text-[#B48322] transition-all duration-300 group-hover:translate-x-1">
                        <span className="mr-1 text-sm font-medium">Learn more</span>
                        <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile View - Modern Design */}
          <div className="grid gap-5 md:hidden">
            {[
              {
                title: "Board of Director",
                description:
                  "Is a representative of the highest division consisting of Chairperson, Vice Chairperson, Secretary and Treasurer.",
                link: "anagata/board-of-director",
                color: "from-[#B48322] to-[#F2B233]",
                icon: "👑"
              },
              {
                title: "External Relations",
                description: "This division organize activities or events related to parties outside the campus. To build relationships with the community, other campus and companies. It also have purpose to share knowledge and experience with each other.",
                link: "anagata/external-relation",
                color: "from-[#B48322] to-[#F2B233]",
                icon: "🤝"
              },
              {
                title: "Internal Relations",
                description:
                  "This division has the main task of strengthening the relationship between students and students, students and lecturers, students and alumni and PUMA - PUFA",
                link: "anagata/internal-relation",
                color: "from-[#B48322] to-[#F2B233]",
                icon: "🏛️"
              },
              {
                title: "Art and Sport",
                description:
                  "Is a division that focuses on developing interest and burning the arts and sports in the computing sphere. This division also in charge of organizing both arts and sports activities so that computizens has a place to channel their non-academics potential.",
                link: "anagata/art-and-sport",
                color: "from-[#B48322] to-[#F2B233]",
                icon: "🎨"
              },
              {
                title: "Communication and Multimedia",
                description:
                  "Is a division that handles PUFA Computing social media such as Instagram, LinkedIn, LINE OA, and youtube. Multimedia division is responsible to in charge of creating and editing templates content to be posted on social media PUFA Computing.",
                link: "anagata/communication-and-multimedia",
                color: "from-[#B48322] to-[#F2B233]",
                icon: "📱"
              },
              {
                title: "Research and Technology",
                description:
                  "Is a division in charge of developing creative ideas in the field of technology and sharing knowledge in the field of technology which aims to develop human resources, especially students within the campus itself.",
                link: "anagata/research-and-technology",
                color: "from-[#B48322] to-[#F2B233]",
                icon: "💡"
              },
              {
                title: "Student Development and Competition",
                description:
                  "Is a division that focuses on improving the quality and optimizing the potential of Computizen in academic field, with the hope that it can have high competitiveness and contribute fully to the Faculty of Computing, President University, and Indonesia. ",
                link: "anagata/student-development-and-competition",
                color: "from-[#B48322] to-[#F2B233]",
                icon: "🚀"
              },
              {
                title: "Student Welfare Advocacy",
                description:
                  "Is a division that serves as a bridge between Computizens (students) and the campus (faculty).SWA is responsible for accommodating aspirations and suggestions, as well as assisting and defending problems experienced by Computizens.",
                link: "anagata/student-welfare-advocacy",
                color: "from-[#B48322] to-[#F2B233]",
                icon: "⚖️"
              },
              {
                title: "Entrepreneurship",
                description:
                  "Entrepreneurship is a new division at PUFA Computing this cabinet, this division aims to develop computizens interests and talents in entrepreneurship and business.",
                link: "anagata/entrepreneur",
                color: "from-[#B48322] to-[#F2B233]",
                icon: "💼"
              },
            ].map((division, index) => (
              <Link
                key={index}
                href={division.link}
                className="group flex items-start rounded-xl bg-white/80 backdrop-blur-sm p-5 text-left transition-all duration-300 shadow-md hover:shadow-lg border border-gray-100 relative"
              >
                {/* Top accent border */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#B48322] to-[#F2B233]"></div>
                
                <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-[#B48322]/10 text-lg mr-3">
                  {division.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#B48322] transition-colors duration-300">{division.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{division.description}</p>
                  
                  {/* Learn more link */}
                  <div className="mt-3 flex items-center text-[#B48322] transition-all duration-300 group-hover:translate-x-1">
                    <span className="text-xs font-medium">Learn more</span>
                    <ChevronRight className="h-3 w-3 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-amber-400 sm:text-4xl">Event Timeline</h2>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:sticky md:top-24 md:self-start">
              <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-xl border border-gray-100 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                <span className="inline-block rounded-full bg-[#B48322]/10 text-[#B48322] px-3 py-1 text-xs font-medium mb-4">
                  2024-2025
                </span>
                <h3 className="mt-4 text-2xl font-bold text-gray-800 sm:text-3xl">FORCASION Events</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-[#B48322] to-[#F2B233] mt-4 mb-4"></div>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  Here's our event timeline for the academic year 2024-2025. Various events are organized throughout the year to engage students and enhance their university experience.
                </p>
                <Link
                  href="/events"
                  className="mt-6 inline-flex items-center rounded-full bg-gradient-to-r from-[#000000] to-[#B48322] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#B48322]/30 group"
                >
                  Explore All Events
                  <ExternalLink className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            <div className="relative col-span-2">
              <div className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-[#B48322] via-[#F2B233] to-transparent md:left-0"></div>

              {[
                {
                  date: "October 2024",
                  title: "CML (Computing Major Leader)",
                  description:
                    "CML helps organize and facilitate events, activities, and meetings that involve students from their class or department. They coordinate logistics, gather participants, and ensure that events run smoothly.",
                  icon: "👥"
                },
                {
                  date: "November 2024",
                  title: "COMPSHADOW & COMPBRAINTS",
                  description:
                    "COMPSHADOW is a welcoming event for new students, while COMPBRAINTS is a competitive event where students can showcase their talents and skills in various computing fields.",
                  isMultiple: true,
                  events: ["COMPSHADOW", "COMPBRAINTS"],
                  icon: "🎮"
                },
                {
                  date: "January 2025",
                  title: "New Year Events",
                  description:
                    "Special events to kick off the new year with various activities and programs for students to participate in.",
                  icon: "🎆"
                },
                {
                  date: "February 2025",
                  title: "CSGO x Senior High School & COMPRUSADER",
                  description:
                    "CSGO x Senior High School event promotes our campus and increases its recognition among high school students through engaging sports and esports competitions. COMPRUSADER is another exciting event for students.",
                  isMultiple: true,
                  events: ["CSGO x Senior High School", "COMPRUSADER"],
                  icon: "🏆"
                },
                {
                  date: "March 2025",
                  title: "SOSPRO (Ramadhan)",
                  description:
                    "Special social project activities during the Ramadhan month, focusing on community service and charitable initiatives.",
                  icon: "🌙"
                },
                {
                  date: "April 2025",
                  title: "COMPBIRTHDAY & Achievement Gala",
                  description:
                    "The Computing Achievement Gala is an event designed to recognize and celebrate the exceptional achievements of students within the Faculty of Computing. The gala aims to highlight both academic and non-academic successes, fostering a culture of excellence.",
                  isMultiple: true,
                  events: ["COMPBIRTHDAY", "Computing Achievement Gala"],
                  icon: "🎓"
                },
                {
                  date: "May 2025",
                  title: "COMPSTUD",
                  description:
                    "An academic event focused on student development and learning, providing opportunities for students to enhance their skills and knowledge.",
                  icon: "📚"
                },
                {
                  date: "June 2025",
                  title: "BIZCONNECT",
                  description:
                    "A networking event connecting students with business professionals and industry experts to build relationships and explore career opportunities.",
                  icon: "🤝"
                },
                {
                  date: "July 2025",
                  title: "COMPBRAINST II",
                  description:
                    "The second iteration of the COMPBRAINST event, focusing on innovation, creativity, and problem-solving in computing.",
                  icon: "💡"
                },
                {
                  date: "September 2025",
                  title: "COMPSPHERE",
                  description:
                    "A comprehensive event showcasing various aspects of computing and technology, with exhibitions, workshops, and competitions.",
                  icon: "🌐"
                },
                {
                  date: "October 2025",
                  title: "COMPRECEN",
                  description:
                    "An event celebrating recent achievements and recognizing outstanding contributions within the computing community.",
                  icon: "🏅"
                },
                {
                  date: "November 2025",
                  title: "COMPSHADOW II (FAREWELL)",
                  description:
                    "A farewell event for graduating students, celebrating their journey and achievements throughout their time at the university.",
                  icon: "👋"
                },
              ].map((event, index) => (
                <div
                  key={index}
                  className="group relative mb-8 ml-8 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[#B48322]/50 hover:shadow-xl hover:shadow-[#B48322]/10 md:ml-12"
                >
                  <div className="absolute -left-8 top-6 flex items-center justify-center h-8 w-8 rounded-full border-2 border-[#B48322] bg-white text-[#B48322] transition-all duration-300 group-hover:bg-[#B48322] group-hover:text-white md:-left-14">
                    {event.icon}
                  </div>
                  <span className="inline-block rounded-full bg-[#B48322]/10 px-3 py-1 text-xs font-medium text-[#B48322] mb-2">
                    {event.date}
                  </span>
                  {event.isMultiple ? (
                    <div className="mt-2">
                      {event.events?.map((subEvent, idx) => (
                        <h3 key={idx} className="mb-1 text-xl font-bold text-gray-800 group-hover:text-[#B48322] transition-colors duration-300">
                          {subEvent}
                        </h3>
                      ))}
                    </div>
                  ) : (
                    <h3 className="mt-2 text-xl font-bold text-gray-800 group-hover:text-[#B48322] transition-colors duration-300">{event.title}</h3>
                  )}
                  <p className="mt-3 text-gray-600 leading-relaxed">{event.description}</p>
                  
                  {/* Read more button */}
                  <div className="mt-4 text-right">
                    <span className="inline-flex items-center text-sm font-medium text-[#B48322] transition-all duration-300 group-hover:translate-x-1 cursor-pointer">
                      Learn more
                      <svg className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      
    </div>
  )
}


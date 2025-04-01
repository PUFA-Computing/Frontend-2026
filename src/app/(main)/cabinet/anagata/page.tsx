import Image from "next/image"
import Logo from "@/assets/forcasionlogo.png"
import Link from "next/link"
import { ChevronRight, ExternalLink } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/30 via-black to-black"></div>
        </div>
        <div className="container relative mx-auto flex h-full flex-col items-center justify-center px-4">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 opacity-70 blur-sm"></div>
            <Image
              src={Logo || "/placeholder.svg"}
              alt="Forcasion Logo"
              width={200}
              height={200}
              className="relative rounded-full border-4 border-[#FFD700] bg-black/50 p-2 transition-all duration-500 hover:scale-105"
            />
          </div>
          <h1 className="mt-8 bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:text-6xl">
            FORCASION CABINET
          </h1>
          <p className="mt-4 text-xl italic text-amber-300">"Together We Stand, Together We Succeed"</p>
          <div className="mt-8 flex space-x-4">
            <Link
              href="#vision"
              className="rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-2 font-medium text-black transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30"
            >
              Learn More
            </Link>
            <Link
              href="#divisions"
              className="rounded-full border border-amber-500 px-6 py-2 font-medium text-amber-400 transition-all duration-300 hover:bg-amber-500/10 hover:shadow-lg hover:shadow-amber-500/20"
            >
              Our Divisions
            </Link>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section id="vision" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-amber-400 sm:text-4xl">Our Vision & Mission</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="group rounded-2xl border border-amber-500/30 bg-gradient-to-br from-black to-zinc-900 p-8 shadow-lg shadow-amber-500/5 transition-all duration-300 hover:shadow-amber-500/20">
              <div className="mb-6 flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-yellow-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-amber-400 group-hover:text-amber-300">Vision</h3>
              </div>
              <p className="text-lg leading-relaxed text-gray-300">
                To create a united, communicative, and competitive faculty where students from all departments actively
                participate in academic and non-academic activities and are fully supported in achieving their highest
                potential.
              </p>
            </div>

            <div className="group rounded-2xl border border-amber-500/30 bg-gradient-to-br from-black to-zinc-900 p-8 shadow-lg shadow-amber-500/5 transition-all duration-300 hover:shadow-amber-500/20">
              <div className="mb-6 flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-yellow-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-amber-400 group-hover:text-amber-300">Mission</h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                {[
                  "Foster interdepartmental collaboration and unity",
                  "Facilitate academic and professional growth",
                  "Create engaging events and programs",
                  "Support student initiatives and development",
                  "Build strong community relationships",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 mt-1 text-amber-400">•</span>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Division Section */}
      <section id="divisions" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-amber-400 sm:text-4xl">Our Divisions</h2>

          {/* Desktop View */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Center Logo */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 opacity-30 blur-md"></div>
                  <Image
                    src="/logo/PUFA_Computing.png"
                    alt="Logo PUFA Computing"
                    width={200}
                    height={200}
                    className="relative h-[200px] w-[200px] rounded-full border-4 border-amber-500/50 object-cover p-2 transition-all duration-500 hover:scale-105"
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
                      color: "from-amber-400 to-yellow-500",
                    },
                    {
                      title: "External Relations",
                      description: "This division organize activities or events related to parties outside the campus.",
                      link: "anagata/external-relation",
                      color: "from-emerald-400 to-green-500",
                    },
                    {
                      title: "Internal Relations",
                      description:
                        "This division has the main task of strengthening the relationship between students and students, students and lecturers, students and alumni and PUMA - PUFA",
                      link: "anagata/internal-relation",
                      color: "from-amber-400 to-yellow-500",
                    },
                    {
                      title: "Art and Sport",
                      description:
                        "Division that focuses on developing interest and burning the arts and sports in the computing sphere.",
                      link: "anagata/art-and-sport",
                      color: "from-emerald-400 to-green-500",
                    },
                    {
                      title: "Communication and Multimedia",
                      description:
                        "Com: Division that handles PUFA Computing social media such as Instagram, LinkedIn, LINE OA, and youtube. Mul: Responsible to in charge of creating and editing templates content to be posted on social media PUFA",
                      link: "anagata/communication-and-multimedia",
                      color: "from-amber-400 to-yellow-500",
                    },
                  ].map((division, index) => (
                    <Link
                      key={index}
                      href={division.link}
                      className="group flex flex-col items-end rounded-xl border border-amber-500/20 bg-black/40 p-6 text-right transition-all duration-300 hover:border-amber-500/50 hover:bg-black/60 hover:shadow-lg hover:shadow-amber-500/10"
                    >
                      <div className="flex items-center justify-end">
                        <h3 className="mr-3 text-xl font-bold text-amber-400 group-hover:text-amber-300">
                          {division.title}
                        </h3>
                        <div className={`h-4 w-4 rounded-full bg-gradient-to-br ${division.color}`}></div>
                      </div>
                      <p className="mt-2 text-sm text-gray-300">{division.description}</p>
                      <div className="mt-3 flex items-center justify-end text-amber-400 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="mr-1 text-sm">Learn more</span>
                        <ChevronRight className="h-4 w-4" />
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
                        "Division in charge of developing creative ideas and sharing knowledge and sharing knowledge in the field of technology.",
                      link: "anagata/research-and-technology",
                      color: "from-amber-400 to-yellow-500",
                    },
                    {
                      title: "Student Development and Competition",
                      description:
                        "Is a representative of the highest division consisting of Chairperson, Vice Chairperson, Secretary and Treasurer.",
                      link: "anagata/student-development-and-competition",
                      color: "from-emerald-400 to-green-500",
                    },
                    {
                      title: "Student Welfare Advocacy",
                      description:
                        "Responsible for accommodating aspirations and suggestions, as well as assisting and defending problems experienced by Computizens.",
                      link: "anagata/student-welfare-advocacy",
                      color: "from-amber-400 to-yellow-500",
                    },
                    {
                      title: "Entrepreneurship",
                      description:
                        "This division aims to develop computizens interests and talents in entrepreneurship and business.",
                      link: "anagata/entrepreneur",
                      color: "from-emerald-400 to-green-500",
                    },
                  ].map((division, index) => (
                    <Link
                      key={index}
                      href={division.link}
                      className="group flex flex-col items-start rounded-xl border border-amber-500/20 bg-black/40 p-6 text-left transition-all duration-300 hover:border-amber-500/50 hover:bg-black/60 hover:shadow-lg hover:shadow-amber-500/10"
                    >
                      <div className="flex items-center">
                        <div className={`mr-3 h-4 w-4 rounded-full bg-gradient-to-br ${division.color}`}></div>
                        <h3 className="text-xl font-bold text-amber-400 group-hover:text-amber-300">
                          {division.title}
                        </h3>
                      </div>
                      <p className="mt-2 text-sm text-gray-300">{division.description}</p>
                      <div className="mt-3 flex items-center text-amber-400 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="mr-1 text-sm">Learn more</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="grid gap-4 md:hidden">
            {[
              {
                title: "Board of Director",
                description:
                  "Is a representative of the highest division consisting of Chairperson, Vice Chairperson, Secretary and Treasurer.",
                link: "anagata/board-of-director",
                color: "from-amber-400 to-yellow-500",
              },
              {
                title: "External Relations",
                description: "This division organize activities or events related to parties outside the campus.",
                link: "anagata/external-relation",
                color: "from-emerald-400 to-green-500",
              },
              {
                title: "Internal Relations",
                description:
                  "This division has the main task of strengthening the relationship between students and students, students and lecturers, students and alumni and PUMA - PUFA",
                link: "anagata/internal-relation",
                color: "from-amber-400 to-yellow-500",
              },
              {
                title: "Art and Sport",
                description:
                  "Division that focuses on developing interest and burning the arts and sports in the computing sphere.",
                link: "anagata/art-and-sport",
                color: "from-emerald-400 to-green-500",
              },
              {
                title: "Communication and Multimedia",
                description:
                  "Com: Division that handles PUFA Computing social media such as Instagram, LinkedIn, LINE OA, and youtube. Mul: Responsible to in charge of creating and editing templates content to be posted on social media PUFA",
                link: "anagata/communication-and-multimedia",
                color: "from-amber-400 to-yellow-500",
              },
              {
                title: "Research and Technology",
                description:
                  "Division in charge of developing creative ideas and sharing knowledge and sharing knowledge in the field of technology.",
                link: "anagata/research-and-technology",
                color: "from-amber-400 to-yellow-500",
              },
              {
                title: "Student Development and Competition",
                description:
                  "Is a representative of the highest division consisting of Chairperson, Vice Chairperson, Secretary and Treasurer.",
                link: "anagata/student-development-and-competition",
                color: "from-emerald-400 to-green-500",
              },
              {
                title: "Student Welfare Advocacy",
                description:
                  "Responsible for accommodating aspirations and suggestions, as well as assisting and defending problems experienced by Computizens.",
                link: "anagata/student-welfare-advocacy",
                color: "from-amber-400 to-yellow-500",
              },
              {
                title: "Entrepreneurship",
                description:
                  "This division aims to develop computizens interests and talents in entrepreneurship and business.",
                link: "anagata/entrepreneur",
                color: "from-emerald-400 to-green-500",
              },
            ].map((division, index) => (
              <Link
                key={index}
                href={division.link}
                className="group flex flex-col rounded-xl border border-amber-500/20 bg-black/40 p-4 transition-all duration-300 hover:border-amber-500/50 hover:bg-black/60"
              >
                <div className="flex items-center">
                  <div className={`mr-3 h-3 w-3 rounded-full bg-gradient-to-br ${division.color}`}></div>
                  <h3 className="text-lg font-bold text-amber-400">{division.title}</h3>
                </div>
                <p className="mt-2 text-xs text-gray-300">{division.description}</p>
                <div className="mt-2 flex items-center text-amber-400">
                  <span className="mr-1 text-xs">Learn more</span>
                  <ChevronRight className="h-3 w-3" />
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
              <div className="rounded-xl border border-amber-500/30 bg-black/50 p-6 shadow-lg shadow-amber-500/5">
                <span className="inline-block rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-3 py-1 text-xs font-medium text-black">
                  2023-2024
                </span>
                <h3 className="mt-4 text-2xl font-bold text-white sm:text-3xl">Working Process of Fest</h3>
                <p className="mt-2 text-gray-300">
                  Here's your guide to the tech fest process. Go through all the steps to know the exact process of the
                  fest.
                </p>
                <Link
                  href="/events"
                  className="mt-6 inline-flex items-center rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-2 text-sm font-medium text-black transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30"
                >
                  Explore All Events
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="relative col-span-2">
              <div className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-amber-500 via-amber-400 to-transparent md:left-0"></div>

              {[
                {
                  date: "November 2023",
                  title: "Compbraints",
                  description:
                    "Pick your favourite event(s) and register in that event by filling the form corresponding to that event. Its that easy.",
                },
                {
                  date: "December 2023",
                  title: "Compshadow I Welcoming",
                  description:
                    "Participate online. The links for your registered events will be sent to you via email and whatsapp groups. Use those links and show your talent.",
                },
                {
                  date: "February 2024",
                  title: "CSGO",
                  description:
                    "The ultimate genius will be revealed by our judging panel and the results will be announced on the whatsapp groups and will be mailed to you.",
                },
                {
                  date: "March 2024",
                  title: "Social Project & Compstud",
                  description:
                    "The winners will be contacted by our team for their addresses and the winning goodies will be sent at their addresses.",
                  isMultiple: true,
                  events: ["Social Project", "Compstud"],
                },
              ].map((event, index) => (
                <div
                  key={index}
                  className="group relative mb-8 ml-8 rounded-xl border border-amber-500/20 bg-black/40 p-6 transition-all duration-300 hover:border-amber-500/50 hover:bg-black/60 hover:shadow-lg hover:shadow-amber-500/10 md:ml-12"
                >
                  <div className="absolute -left-8 top-6 h-4 w-4 rounded-full border-2 border-amber-500 bg-black transition-all duration-300 group-hover:bg-amber-500 md:-left-14"></div>
                  <span className="inline-block rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
                    {event.date}
                  </span>
                  {event.isMultiple ? (
                    <div className="mt-2">
                      {event.events?.map((subEvent, idx) => (
                        <h3 key={idx} className="mb-1 text-xl font-bold text-white">
                          {subEvent}
                        </h3>
                      ))}
                    </div>
                  ) : (
                    <h3 className="mt-2 text-xl font-bold text-white">{event.title}</h3>
                  )}
                  <p className="mt-2 text-gray-300">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      
    </div>
  )
}


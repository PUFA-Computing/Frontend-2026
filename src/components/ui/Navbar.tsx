"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import Logo from "@/assets/PUComSci.png"
import PUMA_IS from "@/assets/logo/PUMA_IS.png"
import PUMA_IT from "@/assets/logo/PUMA_IT.png"
import Image from "next/image"
import { signOut, useSession } from "next-auth/react"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isOthersOpen, setIsOthersOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const [showMobileLogos, setShowMobileLogos] = useState(false)
  const session = useSession()

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setVisible(false)
      } else {
        setVisible(true)
      }
      setLastScrollY(window.scrollY)
    }
    window.addEventListener("scroll", controlNavbar)
    return () => window.removeEventListener("scroll", controlNavbar)
  }, [lastScrollY])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleMobileLogos = () => {
    setShowMobileLogos(!showMobileLogos)
    if (!showMobileLogos) {
      setIsOthersOpen(false)
      setIsMobileMenuOpen(false)
    }
  }

  const NavbarOthers = [
    {
      title: "Others",
      items: [
        { title: "CSML", href: "/vote" },
        { title: "Aspirations", href: "/aspiration" },
        { title: "Merch", href: "/merch" },
        { title: "Our Partners", href: "/partners" },
        { title: "Projects", href: "/projects" },
        { title: "History", href: "/history" },
        { title: "Change Log", href: "/change-log" },
      ],
    },
  ]

  const handleLogout = () => signOut()
  const dashboard = () => { window.location.href = "/dashboard" }

  return (
    <>
      {/* ══ PROFILE BUTTON (TOP RIGHT) ══ */}
      <div className={`fixed right-4 sm:right-12 top-4 sm:top-8 z-50 transition-all duration-500 ${visible ? "translate-y-0" : "-translate-y-32"}`}>
        <div className="relative">
          <button
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsOthersOpen(false); setShowMobileLogos(false) }}
            className={`rounded-full bg-[#FAF5E8]/90 border border-[#B8841E]/30 shadow-parch-sm p-2.5 transition-all duration-300 hover:scale-105 hover:bg-[#F0E6C8] ${isProfileOpen ? "bg-[#EDE0BB]" : ""}`}
          >
            <svg className="w-6 h-6 text-[#0D1B3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>

          {/* Profile Dropdown */}
          <div className={`absolute right-0 mt-3 w-52 rounded-xl bg-[#FAF5E8]/95 py-2 shadow-parch-lg border border-[#B8841E]/20 backdrop-blur-md transition-all duration-300 ${isProfileOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
            {session.status === "authenticated" ? (
              <>
                <button onClick={dashboard} className="block font-serif w-full px-4 py-2.5 text-left text-sm text-[#0D1B3E] hover:bg-[#F0E6C8]/60 hover:text-[#B8841E] transition-colors">Dashboard</button>
                <button onClick={handleLogout} className="block font-serif w-full px-4 py-2.5 text-left text-sm text-[#0D1B3E] hover:bg-[#F0E6C8]/60 hover:text-[#B8841E] transition-colors">Logout</button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="block font-serif px-4 py-2.5 text-sm text-[#0D1B3E] hover:bg-[#F0E6C8]/60 hover:text-[#B8841E] transition-colors" onClick={() => setIsProfileOpen(false)}>Log in</Link>
                <Link href="/auth/signup" className="block font-serif px-4 py-2.5 text-sm text-[#0D1B3E] hover:bg-[#F0E6C8]/60 hover:text-[#B8841E] transition-colors" onClick={() => setIsProfileOpen(false)}>Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ══ DESKTOP NAV ══ */}
      <header className={`fixed left-1/2 top-8 z-40 -translate-x-1/2 transition-all duration-500 ${visible ? "translate-y-0" : "-translate-y-32"} hidden sm:block`}>
        <nav className={`relative flex top-[-6px] h-14 items-center justify-center transition-all duration-500 ${isMenuOpen ? "w-[300px] sm:w-[420px] h-[50px] sm:h-[65px]" : "w-[270px] bg-transparent border-none"} rounded-full bg-[#F5EDD0]/85 backdrop-blur-xl shadow-[0_2px_16px_rgba(26,26,46,0.1)] border border-[#B8841E]/30 overflow-visible`}>
          
          {/* Top shimmer highlight */}
          <div className={`absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#D9A84A]/40 to-transparent pointer-events-none rounded-full transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0"}`} />

          {/* PUMA Informatics Logo - Left */}
          <div className={`absolute left-0 z-50 transition-all duration-700 ease-in-out ${isMenuOpen ? "opacity-0 -translate-x-24 scale-50 pointer-events-none" : "opacity-100 translate-x-0 scale-100 pointer-events-auto animate-fade-in-left"}`}>
            <Link href="/puma/puma-informatics">
              <div className="flex items-center justify-center w-20 h-20 transition-all duration-300 bg-[#FAF5E8] border border-[#B8841E]/20 rounded-full shadow-parch-md cursor-pointer group hover:scale-110 hover:shadow-gold-sm hover:border-[#B8841E]/40">
                <div className="relative h-[67px] w-[67px] transition-transform duration-500 hover:-rotate-12">
                  <Image alt="PUMA Informatics" src={PUMA_IT || "/placeholder.svg"} width="67" height="67" className="pointer-events-none" />
                </div>
              </div>
            </Link>
          </div>

          {/* PUMA IS Logo - Right */}
          <div className={`absolute right-0 z-50 transition-all duration-700 ease-in-out ${isMenuOpen ? "opacity-0 translate-x-24 scale-50 pointer-events-none" : "opacity-100 translate-x-0 scale-100 pointer-events-auto animate-fade-in-right"}`}>
            <Link href="/puma/puma-is">
              <div className="flex items-center justify-center w-20 h-20 transition-all duration-300 bg-[#FAF5E8] border border-[#B8841E]/20 rounded-full shadow-parch-md cursor-pointer group hover:scale-110 hover:shadow-gold-sm hover:border-[#B8841E]/40">
                <div className="relative h-[67px] w-[67px] transition-transform duration-500 group-hover:rotate-12">
                  <Image alt="PUMA IS" src={PUMA_IS || "/placeholder.svg"} width="67" height="67" className="pointer-events-none" />
                </div>
              </div>
            </Link>
          </div>

          {/* Main Logo in center circle */}
          <div className="absolute z-40 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
            <div onClick={toggleMenu} className="flex items-center justify-center w-20 h-20 transition-all duration-300 bg-[#FAF5E8] border border-[#B8841E]/20 rounded-full shadow-parch-md cursor-pointer group hover:scale-110 hover:shadow-gold-sm hover:border-[#B8841E]/40">
              <div className="relative transition-transform duration-700 ease-in-out">
                <Image alt="PU Computing" src={Logo || "/placeholder.svg"} width="55" height="55" className="pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Left Navigation Items */}
          <div className={`pointer-events-none flex items-center space-x-6 sm:space-x-5 ml-10 sm:ml-3.5 transition-all duration-500 ${!isMenuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100 pointer-events-auto"}`}>
            <Link href="/" className="group relative text-sm sm:text-[14px] font-serif font-medium tracking-wide text-[#0D1B3E] hover:text-[#B8841E] transition-colors">
              <span className="relative inline-block transition-all duration-300">
                Home
                <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#B8841E] to-transparent transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </span>
            </Link>
            <Link href="/events" className="group relative text-sm sm:text-[14px] font-serif font-medium tracking-wide text-[#0D1B3E] hover:text-[#B8841E] transition-colors">
              <span className="relative inline-block transition-all duration-300">
                Events
                <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#B8841E] to-transparent transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </span>
            </Link>
          </div>

          {/* Right Navigation Items */}
          <div className={`pointer-events-none flex items-center space-x-6 sm:space-x-5 pl-12 sm:ml-20 transition-all duration-500 ${!isMenuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100 pointer-events-auto"}`}>
            <Link href="/news" className="group relative text-sm sm:text-[14px] font-serif font-medium tracking-wide text-[#0D1B3E] hover:text-[#B8841E] transition-colors">
              <span className="relative inline-block transition-all duration-300">
                News
                <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#B8841E] to-transparent transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </span>
            </Link>
            <div className="relative group">
              <button className="group relative text-sm sm:text-[14px] top-[-0.7px] font-serif font-medium tracking-wide text-[#0D1B3E] hover:text-[#B8841E] transition-colors flex items-center">
                <span className="relative inline-block transition-all duration-300">
                  Others
                  <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#B8841E] to-transparent transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                </span>
                <svg className="inline-block w-2 h-2 ml-1 transition-transform duration-300 sm:h-3 sm:w-3 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 invisible w-48 py-2 mt-4 transition-all duration-300 transform scale-95 border border-[#B8841E]/20 shadow-parch-lg opacity-0 rounded-xl bg-[#FAF5E8]/95 backdrop-blur-md group-hover:opacity-100 group-hover:visible group-hover:scale-100">
                <div className="py-2">
                  {NavbarOthers[0].items.map((item) => (
                    <Link key={item.title} href={item.href} className="relative block px-4 py-2 font-serif text-sm transition-colors duration-300 group/item hover:bg-[#F0E6C8]/60">
                      <span className="relative inline-block transition-all duration-300 text-[#0D1B3E]/80 group-hover/item:text-[#B8841E]">
                        {item.title}
                        <span className="absolute inset-x-0 bottom-0 h-px transition-transform duration-300 transform scale-x-0 bg-gradient-to-r from-transparent via-[#B8841E]/60 to-transparent group-hover/item:scale-x-100"></span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* ══ MOBILE BOTTOM NAV ══ */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 bg-[#FAF5E8]/95 backdrop-blur-xl border-t border-[#B8841E]/20 shadow-[0_-4px_16px_rgba(26,26,46,0.05)] transition-all duration-500 sm:hidden ${visible ? "translate-y-0" : "translate-y-full"}`}>
        <div className="flex items-center justify-around h-16">
          <Link href="/" className="flex flex-col items-center justify-center p-2 text-[#0D1B3E]/60 hover:text-[#B8841E] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            <span className="mt-1 text-xs font-serif font-medium">Home</span>
          </Link>
          <Link href="/events" className="flex flex-col items-center justify-center p-2 text-[#0D1B3E]/60 hover:text-[#B8841E] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <span className="mt-1 text-xs font-serif font-medium">Events</span>
          </Link>
          <div className="relative -mt-8">
            <button onClick={toggleMobileLogos} className="flex flex-col items-center justify-center p-3 bg-[#FAF5E8] border border-[#B8841E]/25 rounded-full shadow-parch-lg transition-transform hover:scale-105 hover:border-[#B8841E]/40">
               <Image alt="PU Computing" src={Logo || "/placeholder.svg"} width="32" height="32" className="pointer-events-none" />
            </button>
          </div>
          <Link href="/news" className="flex flex-col items-center justify-center p-2 text-[#0D1B3E]/60 hover:text-[#B8841E] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
            <span className="mt-1 text-xs font-serif font-medium">News</span>
          </Link>
          <div className="relative">
            <button onClick={() => { setIsOthersOpen(!isOthersOpen); setIsProfileOpen(false); setShowMobileLogos(false) }} className="flex flex-col items-center justify-center p-2 text-[#0D1B3E]/60 hover:text-[#B8841E] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              <span className="mt-1 text-xs font-serif font-medium">Others</span>
            </button>
            {/* Others Dropdown Base for Mobile */}
            <div className={`absolute bottom-16 right-0 w-48 rounded-xl bg-[#FAF5E8]/95 py-2 shadow-parch-lg backdrop-blur-md border border-[#B8841E]/20 transition-all duration-300 ${isOthersOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}>
              <div className="py-2">
                {NavbarOthers[0].items.map((item) => (
                  <Link key={item.title} href={item.href} className="block px-4 py-2.5 text-sm font-serif text-[#0D1B3E]/80 hover:text-[#B8841E] hover:bg-[#F0E6C8]/60 transition-colors" onClick={() => setIsOthersOpen(false)}>
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ MOBILE LOGO POP-UP ══ */}
      <div className={`fixed bottom-0 left-0 right-0 z-30 pointer-events-none transition-all duration-500 sm:hidden ${showMobileLogos ? "opacity-100" : "opacity-0"}`}>
        <div className="flex items-center justify-center mb-24">
          <div className="flex space-x-6">
            <Link href="/puma/puma-informatics" className={`pointer-events-auto transition-all duration-500 ${showMobileLogos ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`} onClick={() => setShowMobileLogos(false)}>
              <div className="flex items-center justify-center w-16 h-16 bg-[#FAF5E8] border border-[#B8841E]/20 rounded-full shadow-parch-md">
                <Image alt="PUMA Informatics" src={PUMA_IT || "/placeholder.svg"} width="50" height="50" className="pointer-events-none" />
              </div>
            </Link>
            <div className="w-14 h-16 pointer-events-none"></div> {/* Spacer for central logo */}
            <Link href="/puma/puma-is" className={`pointer-events-auto transition-all duration-500 ${showMobileLogos ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`} style={{ transitionDelay: "50ms" }} onClick={() => setShowMobileLogos(false)}>
              <div className="flex items-center justify-center w-16 h-16 bg-[#FAF5E8] border border-[#B8841E]/20 rounded-full shadow-parch-md">
                <Image alt="PUMA IS" src={PUMA_IS || "/placeholder.svg"} width="50" height="50" className="pointer-events-none" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

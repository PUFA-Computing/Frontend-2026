/**
 * Navbar Component
 *
 * The Navbar component represents the navigation bar of the website, including links, dropdowns, and user authentication options.
 *
 * @component
 * @example
 * // Usage of the Navbar component in another React component or page
 * import Navbar from 'path/to/Navbar';
 * // Render the component
 * <Navbar />;
 */
"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import Logo from "@/assets/PUComSci.png"
import PUMA_IS from "@/assets/logo/PUMA_IS.png"
import PUMA_IT from "@/assets/logo/PUMA_IT.png"
import Image from "next/image"
import { signOut, useSession } from "next-auth/react"

/**
 * Navbar Component
 *
 * @returns {JSX.Element} - React element representing the Navbar.
 */
export default function Navbar() {
  // State for mobile menu and user authentication
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isOthersOpen, setIsOthersOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const [showMobileLogos, setShowMobileLogos] = useState(false)
  const session = useSession()

  // Add this near the top of the component
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        // Scrolling down & past 100px
        setVisible(false)
      } else {
        // Scrolling up
        setVisible(true)
      }
      setLastScrollY(window.scrollY)
    }

    window.addEventListener("scroll", controlNavbar)

    // Cleanup
    return () => {
      window.removeEventListener("scroll", controlNavbar)
    }
  }, [lastScrollY])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleMobileLogos = () => {
    setShowMobileLogos(!showMobileLogos)
    // Close other menus when logos are shown
    if (!showMobileLogos) {
      setIsOthersOpen(false)
      setIsMobileMenuOpen(false)
    }
  }

  // Navigation links for PUMA and Others sections
  const NavbarOthers = [
    {
      title: "Others",
      items: [
        {
          title: "CSML",  //
          href: "/vote",  //
        },
        {
          title: "Aspirations",
          href: "/aspiration",
        },
        {
          title: "Merch",
          href: "/merch",
        },
        {
          title: "Our Partners",
          href: "/partners",
        },
        {
          title: "Projects",
          href: "/projects",
        },
        {
          title: "History",
          href: "/history",
        },
        {
          title: "Change Log",
          href: "/change-log",
        },
      ],
    },
  ]

  const NavbarPuma = [
    {
      title: "PUMA",
      items: [
        {
          title: "PUMA Informatics",
          href: "/puma/puma-informatics",
        },
        {
          title: "PUMA IS",
          href: "/puma/puma-is",
        },
      ],
    },
  ]

  /**
   * Handle Logout
   *
   * Function to handle user logout.
   */
  const handleLogout = () => {
    signOut()
  }

  const dashboard = () => {
    window.location.href = "/dashboard"
  }

  return (
    <>
      {/* Profile Menu in Top Right */}
      <div
        className={`fixed right-4 sm:right-12 top-4 sm:top-8 z-50 transition-all duration-500 ${visible ? "translate-y-0" : "-translate-y-32"}`}
      >
        <div className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen)
              setIsOthersOpen(false)
              setShowMobileLogos(false)
            }}
            className={`rounded-full bg-black/90 p-2.5 transition-all duration-300 hover:scale-105 ${isProfileOpen ? "bg-white/10" : ""}`}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>

          {/* Profile Dropdown */}
          <div
            className={`absolute right-0 mt-3 w-52 rounded-xl bg-black/95 py-2 shadow-xl backdrop-blur-sm transition-all duration-300 ${isProfileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
          >
            {session.status === "authenticated" ? (
              <>
                <button
                  onClick={dashboard}
                  className="block w-full px-4 py-2.5 text-left text-sm text-white hover:bg-white/10"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2.5 text-left text-sm text-white hover:bg-white/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="block px-4 py-2.5 text-sm text-white hover:bg-white/10"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-4 py-2.5 text-sm text-white hover:bg-white/10"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`fixed left-1/2 top-8 z-40 -translate-x-1/2 transition-all duration-500 ${visible ? "translate-y-0" : "-translate-y-32"} hidden sm:block`}
      >
        <nav
          className={`relative flex top-[-6px] h-14 items-center justify-center transition-all duration-500 ${isMenuOpen ? "w-[300px] sm:w-[420px] h-[50px] sm:h-[65px]" : "w-[270px] bg-transparent border-none"} rounded-full bg-black/90 overflow-visible border border-white/40`}
        >
          {/* PUMA Informatics Logo - Left */}
          <div
            className={`absolute left-0 z-50 transition-all duration-700 ease-in-out ${isMenuOpen ? "opacity-0 -translate-x-24 scale-50" : "opacity-100 translate-x-0 scale-100 animate-fade-in-left"}`}
          >
            <Link href="/puma/puma-informatics">
              <div className="flex items-center justify-center w-20 h-20 transition-all duration-300 bg-white rounded-full shadow-lg cursor-pointer group hover:scale-110 hover:shadow-xl">
                <div className="relative h-[67px] w-[67px] transition-transform duration-500 hover:-rotate-12">
                  <Image
                    alt="PUMA Informatics"
                    src={PUMA_IT || "/placeholder.svg"}
                    width="67"
                    height="67"
                    className="pointer-events-none"
                  />
                </div>
              </div>
            </Link>
          </div>

          {/* PUMA IS Logo - Right */}
          <div
            className={`absolute right-0 z-50 transition-all duration-700 ease-in-out ${isMenuOpen ? "opacity-0 translate-x-24 scale-50" : "opacity-100 translate-x-0 scale-100 animate-fade-in-right"}`}
          >
            <Link href="/puma/puma-is">
              <div className="flex items-center justify-center w-20 h-20 transition-all duration-300 bg-white rounded-full shadow-lg cursor-pointer group hover:scale-110 hover:shadow-xl">
                <div className="relative h-[67px] w-[67px] transition-transform duration-500 group-hover:rotate-12">
                  <Image
                    alt="PUMA IS"
                    src={PUMA_IS || "/placeholder.svg"}
                    width="67"
                    height="67"
                    className="pointer-events-none"
                  />
                </div>
              </div>
            </Link>
          </div>

          {/* Main Logo in center circle */}
          <div className="absolute z-40 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
            <div
              onClick={toggleMenu}
              className="flex items-center justify-center w-20 h-20 transition-all duration-300 bg-white rounded-full shadow-lg cursor-pointer group hover:scale-110 hover:shadow-xl"
            >
              <div className={`relative transition-transform duration-700 ease-in-out"`}>
                <Image
                  alt="PU Computing"
                  src={Logo || "/placeholder.svg"}
                  width="55"
                  height="55"
                  className="pointer-events-none"
                  style={{ filter: "brightness(0)" }}
                />
              </div>
            </div>
          </div>

          {/* Left Navigation Items */}
          <div
            className={`pointer-events-none flex items-center space-x-6 sm:space-x-5 ml-10 sm:ml-3.5    text-white transition-all duration-500 ${!isMenuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100 pointer-events-auto"}`}
          >
            <Link href="/" className="group relative text-sm sm:text-[14px] font-medium tracking-wide">
              <span className="relative inline-block transition-all duration-300 group-hover:text-white group-hover:animate-cyber-glow">
                Home
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-white/0 via-white to-white/0 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </span>
            </Link>
            <Link href="/events" className="group relative text-sm sm:text-[14px] font-medium tracking-wide">
              <span className="relative inline-block transition-all duration-300 group-hover:text-white group-hover:animate-cyber-glow">
                Events
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-white/0 via-white to-white/0 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </span>
            </Link>
          </div>

          {/* Right Navigation Items */}
          <div
            className={`pointer-events-none flex items-center space-x-6 sm:space-x-5 pl-12 sm:ml-20 text-white transition-all duration-500 ${!isMenuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100 pointer-events-auto"}`}
          >
            <Link href="/news" className="group relative text-sm sm:text-[14px] font-medium tracking-wide">
              <span className="relative inline-block transition-all duration-300 group-hover:text-white group-hover:animate-cyber-glow">
                News
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-white/0 via-white to-white/0 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </span>
            </Link>
            <div className="relative group">
              <button className="group relative text-sm sm:text-[14px] top-[-0.7px] font-medium tracking-wide">
                <span className="relative inline-block transition-all duration-300 group-hover:text-white group-hover:animate-cyber-glow">
                  Others
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-white/0 via-white to-white/0 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                </span>
                <svg
                  className="inline-block w-2 h-2 ml-1 transition-transform duration-300 sm:h-3 sm:w-3 group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 invisible w-48 py-2 mt-2 transition-all duration-300 transform scale-95 border shadow-xl opacity-0 rounded-xl bg-black/95 backdrop-blur-lg border-white/10 group-hover:opacity-100 group-hover:visible group-hover:scale-100">
                <div className="py-2">
                  {NavbarOthers[0].items.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="relative block px-4 py-2 text-sm transition-all duration-300 group/item hover:bg-white/5"
                    >
                      <span className="relative inline-block transition-all duration-300 text-white/80 group-hover/item:text-white">
                        {item.title}
                        <span className="absolute inset-x-0 bottom-0 h-px transition-transform duration-300 transform scale-x-0 bg-gradient-to-r from-transparent via-white to-transparent group-hover/item:scale-x-100"></span>
                      </span>
                      <span className="absolute inset-0 w-full h-0.5 bg-white/20 transform scale-x-0 group-hover/item:scale-x-100 group-hover/item:animate-scanline pointer-events-none"></span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          {/* <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`fixed right-4 top-4 z-50 rounded p-2 text-white hover:text-gray-300 lg:hidden ${!isMenuOpen ? "opacity-0" : "opacity-100"}`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button> */}
        </nav>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bottom-16 z-40 bg-black/95 backdrop-blur-sm transform transition-all duration-300 sm:hidden ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <div className="flex flex-col items-center justify-center h-full p-4 pb-20 overflow-y-auto text-white">
            <div className="w-full max-w-xs my-4 border-t border-white/20"></div>

            <div className="mb-2 font-bold text-center text-white/70">PUMA</div>
            <div className="flex justify-center mb-6 space-x-8">
              <Link
                href="/puma/puma-informatics"
                className="flex flex-col items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center justify-center w-16 h-16 mb-2 bg-white rounded-full shadow-lg">
                  <Image
                    alt="PUMA Informatics"
                    src={PUMA_IT || "/placeholder.svg"}
                    width="50"
                    height="50"
                    className="pointer-events-none"
                  />
                </div>
                <span className="text-sm">Informatics</span>
              </Link>
              <Link
                href="/puma/puma-is"
                className="flex flex-col items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center justify-center w-16 h-16 mb-2 bg-white rounded-full shadow-lg">
                  <Image
                    alt="PUMA IS"
                    src={PUMA_IS || "/placeholder.svg"}
                    width="50"
                    height="50"
                    className="pointer-events-none"
                  />
                </div>
                <span className="text-sm">IS</span>
              </Link>
            </div>

            <div className="w-full max-w-xs my-4 border-t border-white/20"></div>

            <div className="mb-2 font-bold text-center text-white/70">Others</div>
            <div className="grid w-full max-w-xs grid-cols-2 gap-4">
              {NavbarOthers[0].items.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="flex items-center justify-center px-4 py-3 transition-colors rounded-lg bg-white/5 hover:bg-white/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-black/90 border-t border-white/20 transition-all duration-500 sm:hidden ${visible ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="flex items-center justify-around h-16">
          <Link href="/" className="flex flex-col items-center justify-center p-2 text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="mt-1 text-xs">Home</span>
          </Link>
          <Link href="/events" className="flex flex-col items-center justify-center p-2 text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="mt-1 text-xs">Events</span>
          </Link>
          <div className="relative -mt-8">
            <button
              onClick={toggleMobileLogos}
              className="flex flex-col items-center justify-center p-3 bg-white rounded-full shadow-lg"
            >
              <Image
                alt="PU Computing"
                src={Logo || "/placeholder.svg"}
                width="32"
                height="32"
                className="pointer-events-none"
                style={{ filter: "brightness(0)" }}
              />
            </button>
          </div>
          <Link href="/news" className="flex flex-col items-center justify-center p-2 text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <span className="mt-1 text-xs">News</span>
          </Link>
          <div className="relative">
            <button
              onClick={() => {
                setIsOthersOpen(!isOthersOpen)
                setIsProfileOpen(false)
                setShowMobileLogos(false)
              }}
              className="flex flex-col items-center justify-center p-2 text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="mt-1 text-xs">Others</span>
            </button>

            {/* Others Dropdown for Mobile */}
            <div
              className={`absolute bottom-16 right-0 w-48 rounded-xl bg-black/95 py-2 shadow-xl backdrop-blur-sm transition-all duration-300 ${isOthersOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}
            >
              <div className="py-2">
                {NavbarOthers[0].items.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="block px-4 py-2.5 text-sm text-white hover:bg-white/10"
                    onClick={() => setIsOthersOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Logo Animation */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-30 pointer-events-none transition-all duration-500 sm:hidden ${showMobileLogos ? "opacity-100" : "opacity-0"}`}
      >
        <div className="flex items-center justify-center mb-20">
          <div className="flex space-x-4">
            <Link
              href="/puma/puma-informatics"
              className={`pointer-events-auto transition-all duration-500 ${showMobileLogos ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
              onClick={() => setShowMobileLogos(false)}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg">
                <Image
                  alt="PUMA Informatics"
                  src={PUMA_IT || "/placeholder.svg"}
                  width="50"
                  height="50"
                  className="pointer-events-none"
                />
              </div>
            </Link>
            <div className="w-16 h-16"></div> {/* Spacer for center logo */}
            <Link
              href="/puma/puma-is"
              className={`pointer-events-auto transition-all duration-500 ${showMobileLogos ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
              style={{ transitionDelay: "100ms" }}
              onClick={() => setShowMobileLogos(false)}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg">
                <Image
                  alt="PUMA IS"
                  src={PUMA_IS || "/placeholder.svg"}
                  width="50"
                  height="50"
                  className="pointer-events-none"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}


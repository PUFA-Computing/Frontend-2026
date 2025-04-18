"use client";
import { FiMenu, FiX } from "react-icons/fi";
import { useDashboardContext } from "./DashboardContext";
import { useEffect, useState } from "react";

export default function ToggleButton() {
    const { isMenuOpen, toggleMenu } = useDashboardContext();
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Hide toggle button on scroll down, show on scroll up
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY && window.scrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <button
            className={`fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-50 rounded-full bg-gradient-to-r ${isMenuOpen ? 'from-red-500 to-red-600' : 'from-[#02ABF3] to-blue-600'} 
                p-2 sm:p-3 text-white shadow-lg transition-all duration-300 
                ${isHovered ? 'scale-110 shadow-xl' : ''} 
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
            onClick={() => toggleMenu()}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label={isMenuOpen ? 'Close sidebar menu' : 'Open sidebar menu'}
        >
            <div className="relative">
                {isMenuOpen ? 
                    <FiX className="h-5 w-5 sm:h-6 sm:w-6 transition-all duration-300" /> : 
                    <FiMenu className="h-5 w-5 sm:h-6 sm:w-6 transition-all duration-300" />
                }
                {isHovered && (
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-xs text-white opacity-90 shadow-lg">
                        {isMenuOpen ? 'Close Menu' : 'Open Menu'}
                    </span>
                )}
            </div>
        </button>
    );
}

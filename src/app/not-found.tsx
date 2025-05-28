"use client";

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Gold/black color palette from the logo
const colors = {
  gold: '#D4AF37',
  lightGold: '#F4D160',
  darkGold: '#9E7C0C',
  black: '#000000',
  offBlack: '#121212',
  white: '#FFFFFF',
};

export default function NotFound() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        {/* Animated geometric shapes */}
        <motion.div 
          className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 opacity-20"
          style={{ backgroundColor: colors.gold }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full -ml-48 -mb-48 opacity-20"
          style={{ backgroundColor: colors.lightGold }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 0.2 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', delay: 0.5 }}
        />
        
        {/* Animated triangles */}
        <motion.div 
          className="absolute top-1/4 left-1/4"
          initial={{ rotate: 0, opacity: 0 }}
          animate={{ rotate: 360, opacity: 0.3 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 border-t-[16px] border-l-[8px] border-r-[8px] border-b-0 border-solid" style={{ borderColor: `${colors.gold} transparent transparent` }}></div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-1/4 right-1/4"
          initial={{ rotate: 180, opacity: 0 }}
          animate={{ rotate: -180, opacity: 0.3 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-12 h-12 border-t-[12px] border-l-[6px] border-r-[6px] border-b-0 border-solid" style={{ borderColor: `${colors.lightGold} transparent transparent` }}></div>
        </motion.div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      </div>

      <motion.div 
        className="text-center max-w-3xl mx-auto relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="mb-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={isLoaded ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.h1 
            className="text-9xl font-black mb-4"
            style={{ color: colors.gold }}
            initial={{ y: -20 }}
            animate={isLoaded ? { y: 0 } : {}}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 15,
              delay: 0.3
            }}
          >
            404
          </motion.h1>
          <motion.div 
            className="h-1 w-24 mx-auto mb-8"
            style={{ backgroundColor: colors.gold }}
            initial={{ width: 0 }}
            animate={isLoaded ? { width: 96 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          ></motion.div>
        </motion.div>
        
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-4 text-white"
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Page Not Found
        </motion.h2>
        
        <motion.p 
          className="text-lg mb-10 text-gray-300"
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>
        
        <motion.div 
          className="flex flex-col md:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 text-black rounded-lg transition-all duration-300 group"
            style={{ backgroundColor: colors.gold }}
          >
            <motion.div
              whileHover={{ x: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.div>
            <span className="font-medium">Back to Home</span>
          </Link>
          
          {/* <Link 
            href="/puma" 
            className="inline-flex items-center gap-2 px-6 py-3 border rounded-lg transition-all duration-300 group"
            style={{ borderColor: colors.gold, color: colors.gold }}
          >
            <motion.span 
              className="font-medium"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              View Active PUMAs
            </motion.span>
          </Link> */}
        </motion.div>
        
        <motion.div 
          className="mt-16 text-gray-500"
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          <p>PUFA Computer Science — President University</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

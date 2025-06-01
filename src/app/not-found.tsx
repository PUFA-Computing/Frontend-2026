import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        {/* Static geometric shapes */}
        <div 
          className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 opacity-20"
          style={{ backgroundColor: colors.gold }}
        />
        <div 
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full -ml-48 -mb-48 opacity-20"
          style={{ backgroundColor: colors.lightGold }}
        />
        
        {/* Static triangles */}
        <div className="absolute top-1/4 left-1/4 opacity-30">
          <div className="w-16 h-16 border-t-[16px] border-l-[8px] border-r-[8px] border-b-0 border-solid" 
               style={{ borderColor: `${colors.gold} transparent transparent` }}></div>
        </div>
        
        <div className="absolute bottom-1/4 right-1/4 opacity-30">
          <div className="w-12 h-12 border-t-[12px] border-l-[6px] border-r-[6px] border-b-0 border-solid" 
               style={{ borderColor: `${colors.lightGold} transparent transparent` }}></div>
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]">
        </div>
      </div>

      <div className="text-center max-w-3xl mx-auto relative z-10">
        <div className="mb-8">
          <h1 
            className="text-9xl font-black mb-4"
            style={{ color: colors.gold }}
          >
            404
          </h1>
          <div 
            className="h-1 w-24 mx-auto mb-8"
            style={{ backgroundColor: colors.gold }}
          ></div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Page Not Found
        </h2>
        
        <p className="text-lg mb-10 text-gray-300">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 text-black rounded-lg transition-all duration-300 hover:bg-opacity-90"
            style={{ backgroundColor: colors.gold }}
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back to Home</span>
            </span>
          </Link>
        </div>
        
        <div className="mt-16 text-gray-500">
          <p>PUFA Computer Science — President University</p>
        </div>
      </div>
    </div>
  );
}

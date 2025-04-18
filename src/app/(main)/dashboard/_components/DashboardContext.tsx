"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface ContextProps {
   isMenuOpen: boolean;
   setIsMenuOpen: (value: boolean) => void;
   toggleMenu: (bool?: boolean) => void;
}

const DashboardContext = createContext<ContextProps>({
   isMenuOpen: true,
   setIsMenuOpen: () => {},
   toggleMenu: (bool?: boolean) => {},
});

export const DashboardContextProvider = ({
   children,
}: {
   children: React.ReactNode;
}) => {
   const [isMenuOpen, setIsMenuOpen] = useState(true);
   useEffect(() => {
      const width = window.innerWidth;
      if (width < 1024) {
         setIsMenuOpen(false);
      }
   }, []);
   const toggleMenu = (bool?: boolean) => {
		if(bool != undefined) {
			setIsMenuOpen(bool)
		} else {
			setIsMenuOpen(!isMenuOpen);
		}
   };
   return (
      <DashboardContext.Provider value={{ isMenuOpen, setIsMenuOpen, toggleMenu }}>
         {children}
      </DashboardContext.Provider>
   );
};

export const useDashboardContext = () => useContext(DashboardContext);
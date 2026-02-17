"use client";

import React, {
  createContext,
  useState,
  useContext,
//   ReactElement,
  ReactNode,
} from "react";

interface Size {
  size: {
    width: number;
    height: number;
  };
  setSize: ({width,height}:{width:number;height:number}) => void;
}

const NavbarContext = createContext<Size | undefined>(undefined);

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  //   const [userSize, setUserSize] = useState({ width: 0, height: 0 });

  return (
    <NavbarContext.Provider value={{ size, setSize }}>
      {children}
    </NavbarContext.Provider>
  );
}

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error("useNavbar must be used within NavbarProvider");
  }
  return context;
};

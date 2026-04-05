"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface HeaderColorContextType {
  headerColor: string;
  setHeaderColor: (color: string) => void;
  isImmersive: boolean;
  setIsImmersive: (val: boolean) => void;
}

const HeaderColorContext = createContext<HeaderColorContextType | undefined>(undefined);

export function HeaderColorProvider({ children }: { children: ReactNode }) {
  const [headerColor, setHeaderColor] = useState("#9a0c52"); // Default maroon
  const [isImmersive, setIsImmersive] = useState(false);

  return (
    <HeaderColorContext.Provider value={{ headerColor, setHeaderColor, isImmersive, setIsImmersive }}>
      {children}
    </HeaderColorContext.Provider>
  );
}

export function useHeaderColor() {
  const context = useContext(HeaderColorContext);
  if (context === undefined) {
    throw new Error("useHeaderColor must be used within a HeaderColorProvider");
  }
  return context;
}

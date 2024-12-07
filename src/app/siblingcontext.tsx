// siblingContext.tsx
"use client";
import React, { createContext, useContext, useState } from 'react';

type Sibling = 'Tony' | 'Abby' | 'Andy';

interface SiblingContextType {
  sibling: Sibling | null;
  setSibling: (sibling: Sibling) => void;
}

const SiblingContext = createContext<SiblingContextType | undefined>(undefined);

interface SiblingProviderProps {
  children: React.ReactNode;
}

export const SiblingProvider: React.FC<SiblingProviderProps> = ({ children }) => {
  const [sibling, setSibling] = useState<Sibling | null>(null);

  return (
    <SiblingContext.Provider value={{ sibling, setSibling }}>
      {children}
    </SiblingContext.Provider>
  );
};

export const useSibling = (): SiblingContextType => {
  const context = useContext(SiblingContext);
  if (!context) {
    throw new Error('useSibling must be used within a SiblingProvider');
  }
  return context;
};

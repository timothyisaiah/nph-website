import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface IndicatorContextType {
  selectedIndicator: string | null;
  setSelectedIndicator: (indicator: string | null) => void;
}

const IndicatorContext = createContext<IndicatorContextType | undefined>(undefined);

export const useIndicator = () => {
  const context = useContext(IndicatorContext);
  if (context === undefined) {
    throw new Error('useIndicator must be used within an IndicatorProvider');
  }
  return context;
};

interface IndicatorProviderProps {
  children: ReactNode;
}

export const IndicatorProvider: React.FC<IndicatorProviderProps> = ({ children }) => {
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null);

  return (
    <IndicatorContext.Provider value={{ selectedIndicator, setSelectedIndicator }}>
      {children}
    </IndicatorContext.Provider>
  );
}; 
import React, { createContext, useContext, ReactNode } from 'react';

interface ScopeContextType {
  scopeId: string;
}

const ScopeContext = createContext<ScopeContextType | undefined>(undefined);

export const useScopeContext = (): ScopeContextType => {
  const context = useContext(ScopeContext);
  if (!context) {
    throw new Error('useScopeContext must be used within a ScopeProvider');
  }
  return context;
};

interface ScopeProviderProps {
  scopeId: string;
  children: ReactNode;
}

export const ScopeProvider: React.FC<ScopeProviderProps> = ({ scopeId, children }) => {
  return (
    <ScopeContext.Provider value={{ scopeId }}>
      {children}
    </ScopeContext.Provider>
  );
};

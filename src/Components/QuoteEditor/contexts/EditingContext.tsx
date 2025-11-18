import React, { createContext, useContext } from 'react';

interface EditingContextValue {
  startEditing: (fieldPath: string, currentValue: string) => void;
  stopEditing: () => void;
}

const EditingContext = createContext<EditingContextValue | null>(null);

export const EditingProvider: React.FC<{
  startEditing: (fieldPath: string, currentValue: string) => void;
  stopEditing: () => void;
  children: React.ReactNode;
}> = ({ startEditing, stopEditing, children }) => {
  return (
    <EditingContext.Provider value={{ startEditing, stopEditing }}>
      {children}
    </EditingContext.Provider>
  );
};

export const useEditingContext = (): EditingContextValue => {
  const context = useContext(EditingContext);
  if (!context) {
    return {
      startEditing: () => {},
      stopEditing: () => {}
    };
  }
  return context;
};

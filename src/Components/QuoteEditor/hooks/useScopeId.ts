import { useMemo } from 'react';

export const useScopeId = (): string => {
  const scopeId = useMemo(() => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `qe-${timestamp}-${random}`;
  }, []);

  return scopeId;
};

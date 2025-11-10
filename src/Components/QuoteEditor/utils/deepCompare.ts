import type { QuoteData } from '../QuoteEditor.types';

export const deepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;

  if (obj1 == null || obj2 == null) return obj1 === obj2;

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
};

export const hasQuoteDataChanged = (prev: QuoteData | null, next: QuoteData | null): boolean => {
  if (prev === next) return false;
  if (!prev || !next) return true;

  return !deepEqual(prev, next);
};

export const createDataFingerprint = (data: QuoteData): string => {
  try {
    return JSON.stringify({
      sections: data.sections?.length,
      optionBlocks: data.optionBlocks?.length,
      totals: data.totals,
      quoteNumber: data.quote?.number,
      quoteVersion: data.quote?.version,
    });
  } catch {
    return String(Date.now());
  }
};

/**
 * Utilitaires pour les calculs sécurisés des totaux et montants
 */

/**
 * Assure qu'un nombre est valide et non null/undefined
 */
export const safeNumber = (value: any): number => {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
};

/**
 * Calcule le montant HT de manière sécurisée
 */
export const calculatePriceHT = (quantity: any, unitPrice: any): number => {
  return safeNumber(quantity) * safeNumber(unitPrice);
};

/**
 * Calcule le montant de TVA de manière sécurisée
 */
export const calculateVATAmount = (priceHT: any, vatRate: any): number => {
  const ht = safeNumber(priceHT);
  const rate = safeNumber(vatRate);
  return ht * (rate / 100);
};

/**
 * Calcule le montant TTC de manière sécurisée
 */
export const calculatePriceTTC = (priceHT: any, vatAmount: any): number => {
  return safeNumber(priceHT) + safeNumber(vatAmount);
};

/**
 * Interface pour les totaux sécurisés
 */
export interface SafeTotals {
  ht: number;
  tva: number;
  ttc: number;
}

/**
 * Calcule les sous-totaux d'une section de manière sécurisée
 */
export const calculateSectionSubTotal = (lines: any[] = []): SafeTotals => {
  return lines.reduce(
    (acc, line) => ({
      ht: acc.ht + safeNumber(line?.priceHT),
      tva: acc.tva + safeNumber(line?.vatAmount),
      ttc: acc.ttc + safeNumber(line?.priceTTC)
    }),
    { ht: 0, tva: 0, ttc: 0 }
  );
};

/**
 * Interface pour la répartition de la TVA par taux
 */
export interface VATBreakdown {
  rate: number;
  amount: number;
}

/**
 * Calcule la répartition de la TVA par taux
 */
export const calculateVATBreakdown = (sections: any[] = []): VATBreakdown[] => {
  const vatByRate = new Map<number, number>();

  sections.forEach(section => {
    const lines = section?.lines || [];
    lines.forEach((line: any) => {
      const vatRate = safeNumber(line?.vatRate);
      const vatAmount = safeNumber(line?.vatAmount);

      if (vatRate > 0 && vatAmount > 0) {
        const currentAmount = vatByRate.get(vatRate) || 0;
        vatByRate.set(vatRate, currentAmount + vatAmount);
      }
    });
  });

  return Array.from(vatByRate.entries())
    .map(([rate, amount]) => ({ rate, amount }))
    .sort((a, b) => a.rate - b.rate);
};

/**
 * Calcule les totaux globaux de manière sécurisée
 */
export const calculateGlobalTotals = (sections: any[] = []): SafeTotals & { vatBreakdown?: VATBreakdown[] } => {
  const totals = sections.reduce(
    (acc, section) => {
      const subTotal = section?.subTotal || { ht: 0, tva: 0, ttc: 0 };
      return {
        ht: acc.ht + safeNumber(subTotal.ht),
        tva: acc.tva + safeNumber(subTotal.tva),
        ttc: acc.ttc + safeNumber(subTotal.ttc)
      };
    },
    { ht: 0, tva: 0, ttc: 0 }
  );

  const vatBreakdown = calculateVATBreakdown(sections);

  return {
    ...totals,
    vatBreakdown: vatBreakdown.length > 0 ? vatBreakdown : undefined
  };
};

/**
 * Normalise une ligne de devis avec des valeurs par défaut sécurisées
 */
export const normalizeQuoteLine = (line: any): any => {
  return {
    date: line?.date || new Date().toISOString().split('T')[0],
    description: line?.description || '',
    durationHours: safeNumber(line?.durationHours) || 1,
    pax: safeNumber(line?.pax) || 1,
    unitPrice: safeNumber(line?.unitPrice),
    priceHT: safeNumber(line?.priceHT),
    vatRate: line?.vatRate || 20,
    vatAmount: safeNumber(line?.vatAmount),
    quantity: safeNumber(line?.quantity) || 1,
    priceTTC: safeNumber(line?.priceTTC),
    calculable: line?.calculable !== false
  };
};

/**
 * Recalcule une ligne de devis si elle est calculable
 */
export const recalculateQuoteLine = (line: any): any => {
  const normalized = normalizeQuoteLine(line);
  
  if (normalized.calculable && typeof normalized.vatRate === 'number') {
    normalized.priceHT = calculatePriceHT(normalized.quantity, normalized.unitPrice);
    normalized.vatAmount = calculateVATAmount(normalized.priceHT, normalized.vatRate);
    normalized.priceTTC = calculatePriceTTC(normalized.priceHT, normalized.vatAmount);
  }
  
  return normalized;
};
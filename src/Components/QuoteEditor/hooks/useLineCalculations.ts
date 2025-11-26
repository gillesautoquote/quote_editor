import { useCallback } from 'react';
import {
  calculatePriceHT,
  calculateVATAmount,
  calculatePriceTTC,
  recalculateQuoteLine
} from '../utils/calculationUtils';
import type { QuoteLine } from '../entities/QuoteData';

/**
 * Hook personnalisé pour gérer les calculs de ligne de manière centralisée
 *
 * OBJECTIF: Éliminer les régressions en garantissant que:
 * 1. Tous les calculs passent par une seule fonction
 * 2. Les changements sont toujours propagés de manière synchrone
 * 3. Aucun calcul n'est oublié lors d'une mise à jour
 */
export const useLineCalculations = () => {
  /**
   * Met à jour un champ d'une ligne et recalcule automatiquement tous les montants dépendants
   *
   * @param line - La ligne à mettre à jour
   * @param field - Le champ à modifier
   * @param value - La nouvelle valeur
   * @returns La ligne mise à jour avec tous les calculs effectués
   */
  const updateLineField = useCallback((
    line: QuoteLine,
    field: keyof QuoteLine,
    value: string | number | boolean
  ): QuoteLine => {
    // Créer une copie de la ligne avec le champ mis à jour
    const updatedLine = { ...line, [field]: value };

    console.log(`[useLineCalculations] Updating field: ${field}, value: ${value}`);
    console.log(`[useLineCalculations] Line before update:`, {
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      vatRate: line.vatRate,
      priceHT: line.priceHT,
      vatAmount: line.vatAmount,
      priceTTC: line.priceTTC
    });

    // Si le champ modifié affecte les calculs, recalculer la ligne entière
    const calculableFields: (keyof QuoteLine)[] = [
      'quantity',
      'unitPrice',
      'vatRate',
      'pax',
      'durationHours'
    ];

    if (calculableFields.includes(field)) {
      // Utiliser la fonction de recalcul existante qui gère déjà toute la logique
      const recalculated = recalculateQuoteLine(updatedLine);

      console.log(`[useLineCalculations] Line after recalculation:`, {
        quantity: recalculated.quantity,
        unitPrice: recalculated.unitPrice,
        vatRate: recalculated.vatRate,
        priceHT: recalculated.priceHT,
        vatAmount: recalculated.vatAmount,
        priceTTC: recalculated.priceTTC
      });

      return recalculated;
    }

    // Pour les autres champs, retourner simplement la ligne mise à jour
    return updatedLine;
  }, []);

  /**
   * Recalcule manuellement une ligne sans changer de champ
   * Utile pour forcer un recalcul complet
   */
  const recalculateLine = useCallback((line: QuoteLine): QuoteLine => {
    console.log('[useLineCalculations] Force recalculating line');
    return recalculateQuoteLine(line);
  }, []);

  /**
   * Calcule les montants d'une ligne directement à partir des valeurs
   * Utilisé pour les calculs à la volée sans mutation d'état
   */
  const calculateLineAmounts = useCallback((
    quantity: number,
    unitPrice: number,
    vatRate: number
  ): { priceHT: number; vatAmount: number; priceTTC: number } => {
    const priceHT = calculatePriceHT(quantity, unitPrice);
    const vatAmount = calculateVATAmount(priceHT, vatRate);
    const priceTTC = calculatePriceTTC(priceHT, vatAmount);

    return { priceHT, vatAmount, priceTTC };
  }, []);

  return {
    updateLineField,
    recalculateLine,
    calculateLineAmounts
  };
};

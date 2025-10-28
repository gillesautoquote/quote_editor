import { useCallback } from 'react';
import { pdf } from '@react-pdf/renderer';
import { QuotePDFDocument } from '../pdf/QuotePDFDocument';
import type { QuoteData } from '../entities/QuoteData';

const convertImageToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const blob = await response.blob();

    // Convert WebP to PNG using canvas
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0);

        // Convert to PNG base64
        const base64 = canvas.toDataURL('image/png');
        resolve(base64);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = URL.createObjectURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return '';
  }
};

const prepareDataWithBase64Logo = async (data: QuoteData): Promise<QuoteData> => {
  if (data.company.logoUrl && data.company.logoUrl.trim() !== '') {
    const base64Logo = await convertImageToBase64(data.company.logoUrl);
    return {
      ...data,
      company: {
        ...data.company,
        logoUrl: base64Logo || data.company.logoUrl,
      },
    };
  }
  return data;
};

export const usePDFExport = (useTabs = true) => {
  const exportToPDF = useCallback(async (data: QuoteData): Promise<void> => {
    try {
      const preparedData = await prepareDataWithBase64Logo(data);
      const doc = <QuotePDFDocument data={preparedData} useTabs={useTabs} />;
      const blob = await pdf(doc).toBlob();

      const fileName = `devis-${data.quote.number}-${data.quote.version}.pdf`;

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();

      URL.revokeObjectURL(url);

      console.log(`PDF exporté: ${fileName}`);
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      throw new Error('Impossible d\'exporter le PDF. Veuillez réessayer.');
    }
  }, [useTabs]);

  const generatePDFBlob = useCallback(async (data: QuoteData): Promise<Blob> => {
    try {
      const preparedData = await prepareDataWithBase64Logo(data);
      const doc = <QuotePDFDocument data={preparedData} useTabs={useTabs} />;
      return await pdf(doc).toBlob();
    } catch (error) {
      console.error('Erreur lors de la génération du blob PDF:', error);
      throw new Error('Impossible de générer le PDF.');
    }
  }, [useTabs]);

  return {
    exportToPDF,
    generatePDFBlob
  };
};
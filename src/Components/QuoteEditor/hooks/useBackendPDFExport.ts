import { useCallback, useState } from 'react';
import type { QuoteData } from '../QuoteEditor.types';

interface PDFExportState {
  isLoading: boolean;
  error: string | null;
}

export const useBackendPDFExport = () => {
  const [state, setState] = useState<PDFExportState>({
    isLoading: false,
    error: null,
  });

  const exportToPDF = useCallback(async (data: QuoteData): Promise<void> => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    if (!backendUrl) {
      console.error('VITE_BACKEND_URL not configured');
      setState({ isLoading: false, error: 'Backend URL non configuré' });
      throw new Error('Backend URL non configuré');
    }

    setState({ isLoading: true, error: null });

    try {
      console.log('[Backend PDF] Starting export...');

      const response = await fetch(`${backendUrl}/api/pdf/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quoteData: data }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Backend PDF] Error response:', response.status, errorText);
        throw new Error(`Erreur ${response.status}: ${errorText || response.statusText}`);
      }

      const contentType = response.headers.get('Content-Type');

      if (contentType && contentType.includes('application/pdf')) {
        const blob = await response.blob();
        const fileName = `devis-${data.quote.number}-${data.quote.version}.pdf`;

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();

        URL.revokeObjectURL(url);

        console.log(`[Backend PDF] Export réussi: ${fileName}`);
        setState({ isLoading: false, error: null });
      } else {
        throw new Error('Le serveur n\'a pas retourné un PDF');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('[Backend PDF] Export failed:', error);
      setState({ isLoading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null });
  }, []);

  return {
    exportToPDF,
    isLoading: state.isLoading,
    error: state.error,
    reset,
  };
};

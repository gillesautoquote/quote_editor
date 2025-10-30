import React, { useEffect, useState } from 'react';
import { QuoteEditor } from './Components/QuoteEditor/QuoteEditor';
import { QuotePageHeader } from './Components/QuoteEditor/components/QuotePage/components/QuotePageHeader';
import { QuotePageFooter } from './Components/QuoteEditor/components/QuotePage/components/QuotePageFooter';
import type { QuoteData } from './Components/QuoteEditor/QuoteEditor.types';

declare global {
  interface Window {
    __PDF_READY__?: boolean;
  }
}

const PrintableQuote: React.FC = () => {
  const [data, setData] = useState<QuoteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializePrint = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (!token) {
          setError('Token manquant dans l\'URL');
          setLoading(false);
          return;
        }

        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        if (!backendUrl) {
          setError('VITE_BACKEND_URL non configuré');
          setLoading(false);
          return;
        }

        const response = await fetch(`${backendUrl}/api/pdf/data?token=${token}`);

        if (!response.ok) {
          if (response.status === 400) {
            setError('Token invalide ou manquant');
          } else if (response.status === 404) {
            setError('Données non trouvées');
          } else if (response.status === 410) {
            setError('Token expiré ou déjà utilisé');
          } else {
            setError(`Erreur serveur: ${response.status}`);
          }
          setLoading(false);
          return;
        }

        const quoteData = await response.json();
        setData(quoteData);
        setLoading(false);

        await document.fonts.ready;

        await Promise.all(
          Array.from(document.images)
            .filter(img => !img.complete)
            .map(img => new Promise(resolve => {
              img.onload = img.onerror = () => resolve(null);
            }))
        );

        const Paged = await import('pagedjs');
        await new Paged.Previewer().preview();

        (window as any).__PDF_READY__ = true;
        console.log('PDF ready for capture');

      } catch (err) {
        console.error('Error initializing print view:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        setLoading(false);
      }
    };

    initializePrint();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <p>Chargement des données du devis...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'Arial, sans-serif', color: '#d32f2f' }}>
        <h2>Erreur</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <p>Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <>
      <div className="print-header">
        <QuotePageHeader
          company={data.company}
          quote={data.quote}
          onFieldUpdate={() => {}}
          readonly={true}
          printMode={true}
        />
      </div>

      <div className="print-footer">
        <QuotePageFooter
          footer={data.footer}
          onFieldUpdate={() => {}}
          onCompanyNameUpdate={() => {}}
          onWebsiteUpdate={() => {}}
          readonly={true}
          printMode={true}
        />
      </div>

      <QuoteEditor
        data={data}
        printMode={true}
        flatMode={true}
        showHeader={false}
        showFooter={false}
        readonly={true}
        showToolbar={false}
        showAddSection={false}
        showAddBlock={false}
      />
    </>
  );
};

export default PrintableQuote;

import { useEffect, useState } from 'react';
import { QuoteFlatView } from './Components/QuoteEditor/components/QuotePage/QuoteFlatView';
import { QuotePageHeader } from './Components/QuoteEditor/components/QuotePage/components/QuotePageHeader';
import { QuotePageFooter } from './Components/QuoteEditor/components/QuotePage/components/QuotePageFooter';
import type { QuoteData } from './Components/QuoteEditor/entities/QuoteData';

export default function PrintableQuote() {
  const [data, setData] = useState<QuoteData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (!token) throw new Error('Token manquant');

        const base = String(import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');
        const resp = await fetch(`${base}/api/pdf/data?token=${encodeURIComponent(token)}`);
        if (!resp.ok) throw new Error(`Data fetch failed: ${resp.status}`);
        const quoteData = await resp.json();

        // Normalisation minimale
        const normalized: any = { ...quoteData };
        if (!normalized.itinerary && Array.isArray(normalized.itineraryData)) {
          normalized.itinerary = normalized.itineraryData;
        }
        setData(normalized);

        // Attendre que React ait monté le DOM
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

        // Fonts + images
        // @ts-ignore
        await document.fonts.ready;
        await Promise.all(
          Array.from(document.images)
            .filter(img => !img.complete)
            .map(img => new Promise(res => { img.onload = img.onerror = () => res(null); }))
        );

        // Pagination Paged.js
        const Paged = await import('pagedjs');
        // @ts-ignore
        const previewer = new (Paged as any).Previewer();
        await previewer.preview();

        // Signal readiness
        // @ts-ignore
        (window as any).__PDF_READY__ = true;
        console.log('[Print] PDF READY');
      } catch (e: any) {
        console.error('[Print] Error:', e);
        setError(e?.message || 'Erreur');
        // @ts-ignore
        (window as any).__PDF_READY__ = true;
      }
    };
    run();
  }, []);

  if (error) return <div style={{ padding: 24, color: 'red' }}>Erreur: {error}</div>;
  if (!data) return <div style={{ padding: 24 }}>Chargement des données...</div>;

  return (
    <>
      {/* Running elements capturés par Paged.js */}
      <div className="print-header">
        <QuotePageHeader
          company={data.company}
          quote={data.quote}
          onFieldUpdate={() => {}}
          readonly
        />
      </div>
      <div className="print-footer">
        <QuotePageFooter
          footer={data.footer}
          onFieldUpdate={() => {}}
          onCompanyNameUpdate={() => {}}
          onWebsiteUpdate={() => {}}
          readonly
          printMode
        />
      </div>

      {/* Corps du devis (flat) */}
      <div data-component="quote-flat-view">
        <QuoteFlatView
          data={data}
          onUpdateData={() => {}}
          readonly
          printMode
          allowWidthControl={false}
          showHeader={false}
          showFooter={false}
        />
      </div>
    </>
  );
}

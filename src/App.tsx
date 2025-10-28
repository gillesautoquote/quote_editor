import React, { useState, useCallback } from 'react';
import { QuoteEditor, globalEventEmitter, EVENTS } from './Components/QuoteEditor';
import quoteDataMock from './Components/QuoteEditor/mocks/data.mock.json';
import type { QuoteData } from './Components/QuoteEditor/entities/QuoteData';

const App: React.FC = () => {
  console.log('[App] quoteDataMock loaded:', {
    sections: quoteDataMock?.sections?.length,
    optionBlocks: quoteDataMock?.optionBlocks?.length,
    totals: quoteDataMock?.totals,
    itinerary: quoteDataMock?.itinerary?.length,
    itineraryData: quoteDataMock?.itinerary
  });

  const [quoteData, setQuoteData] = useState<QuoteData>(quoteDataMock as QuoteData);
  const [readonly, setReadonly] = useState<boolean>(false);
  const [autoSave, setAutoSave] = useState<boolean>(true);

  const handleQuoteChange = useCallback((newData: QuoteData): void => {
    setQuoteData(newData);
    console.log('Quote data updated:', newData);
  }, []);

  const handleSave = useCallback(async (data: QuoteData): Promise<void> => {
    console.log('Saving quote data...', data);

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Quote saved successfully!');
        resolve();
      }, 1000);
    });
  }, []);

  const handleExportJSON = (): void => {
    const dataStr = JSON.stringify(quoteData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `devis-${quoteData.quote.number}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = (): void => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser le devis ?')) {
      setQuoteData(quoteDataMock as QuoteData);
    }
  };

  const handleTriggerPDFExport = (): void => {
    console.log('🚀 Déclenchement export PDF via événement global');
    globalEventEmitter.emit(EVENTS.EXPORT_PDF);
  };

  return (
    <div className="tw-min-h-screen tw-bg-gray-100">
      <div className="tw-container tw-mx-auto tw-px-4 tw-py-4">
        <div className="tw-mb-4">
          <div>
            <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-overflow-hidden">
              <div className="tw-bg-indigo-600 tw-text-white tw-p-4">
                <div className="tw-flex tw-flex-col md:tw-flex-row tw-items-start md:tw-items-center tw-justify-between tw-gap-4">
                  <div>
                    <h1 className="tw-text-2xl tw-font-bold tw-mb-1">Démonstration QuoteEditor</h1>
                    <p className="tw-text-sm tw-text-indigo-100">Composant React standalone pour l'édition de devis</p>
                  </div>
                  <div>
                    <div className="tw-flex tw-flex-wrap tw-gap-2">
                      <button
                        type="button"
                        onClick={() => setReadonly(!readonly)}
                        className={`tw-px-3 tw-py-1.5 tw-rounded tw-text-sm tw-font-medium tw-transition-colors ${
                          readonly
                            ? 'tw-bg-yellow-500 tw-text-white hover:tw-bg-yellow-600'
                            : 'tw-bg-white/20 tw-text-white hover:tw-bg-white/30 tw-border tw-border-white/30'
                        }`}
                      >
                        {readonly ? 'Mode lecture' : 'Mode édition'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setAutoSave(!autoSave)}
                        className={`tw-px-3 tw-py-1.5 tw-rounded tw-text-sm tw-font-medium tw-transition-colors ${
                          autoSave
                            ? 'tw-bg-green-500 tw-text-white hover:tw-bg-green-600'
                            : 'tw-bg-white/20 tw-text-white hover:tw-bg-white/30 tw-border tw-border-white/30'
                        }`}
                      >
                        Auto-save: {autoSave ? 'ON' : 'OFF'}
                      </button>
                      <button
                        type="button"
                        onClick={handleExportJSON}
                        className="tw-px-3 tw-py-1.5 tw-rounded tw-text-sm tw-font-medium tw-bg-white/20 tw-text-white hover:tw-bg-white/30 tw-border tw-border-white/30 tw-transition-colors"
                      >
                        Exporter JSON
                      </button>
                      <button
                        type="button"
                        onClick={handleTriggerPDFExport}
                        className="tw-px-3 tw-py-1.5 tw-rounded tw-text-sm tw-font-bold tw-text-white tw-bg-gradient-to-br tw-from-green-500 tw-to-teal-500 hover:tw-from-green-600 hover:tw-to-teal-600 tw-transition-all"
                      >
                        🔥 PDF via Événement Global
                      </button>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="tw-px-3 tw-py-1.5 tw-rounded tw-text-sm tw-font-medium tw-bg-white/20 tw-text-white hover:tw-bg-white/30 tw-border tw-border-white/30 tw-transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tw-p-0">
                <div className="tw-bg-blue-50 tw-border-l-4 tw-border-blue-500 tw-text-blue-900 tw-p-4 tw-m-4 tw-mb-0 tw-rounded">
                  <h6 className="tw-font-semibold tw-mb-2">Instructions d'utilisation:</h6>
                  <ul className="tw-mb-2 tw-text-sm tw-space-y-1">
                    <li><strong>Double-cliquez</strong> sur n'importe quel texte pour l'éditer</li>
                    <li>Utilisez <strong>Ctrl+Z</strong> / <strong>Ctrl+Y</strong> pour annuler/rétablir</li>
                    <li>Les modifications sont automatiquement sauvegardées (si activé)</li>
                    <li>Ajoutez des lignes et sections avec les boutons <strong>+</strong></li>
                    <li>Supprimez des éléments avec l'icône corbeille au survol</li>
                    <li>Réorganisez avec les poignées de glisser-déposer</li>
                    <li><strong>Exportez en PDF</strong> pour obtenir un document professionnel</li>
                  </ul>
                  <div className="tw-bg-green-50 tw-border tw-border-green-200 tw-text-green-800 tw-p-3 tw-mt-2 tw-mb-0 tw-rounded tw-text-sm">
                    🔥 <strong>Nouveau :</strong> Le bouton <strong>"PDF via Événement Global"</strong> démontre comment déclencher l'export PDF depuis n'importe quel composant, sans ref ni prop !
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-4">
          <div className="lg:tw-col-span-3">
            <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-overflow-hidden">
              <div className="tw-bg-green-600 tw-text-white tw-p-4">
                <h5 className="tw-text-lg tw-font-semibold tw-mb-0">🚀 Sidebar Indépendante</h5>
              </div>
              <div className="tw-p-4">
                <p className="tw-text-sm tw-text-gray-600 tw-mb-3">
                  Cette sidebar démontre comment déclencher l'export PDF du QuoteEditor depuis un composant complètement indépendant.
                </p>

                <div className="tw-flex tw-flex-col tw-gap-2">
                  <button
                    type="button"
                    onClick={handleTriggerPDFExport}
                    className="tw-w-full tw-px-4 tw-py-2 tw-bg-green-600 tw-text-white tw-rounded tw-font-medium hover:tw-bg-green-700 tw-transition-colors"
                  >
                    📄 Télécharger PDF
                  </button>

                  <button
                    type="button"
                    onClick={() => globalEventEmitter.emit(EVENTS.QUOTE_DATA_CHANGED, quoteData)}
                    className="tw-w-full tw-px-3 tw-py-1.5 tw-bg-white tw-text-blue-600 tw-border tw-border-blue-300 tw-rounded tw-text-sm hover:tw-bg-blue-50 tw-transition-colors"
                  >
                    📡 Test événement données
                  </button>

                  <button
                    type="button"
                    onClick={() => globalEventEmitter.emit(EVENTS.SAVE_QUOTE)}
                    className="tw-w-full tw-px-3 tw-py-1.5 tw-bg-white tw-text-yellow-600 tw-border tw-border-yellow-300 tw-rounded tw-text-sm hover:tw-bg-yellow-50 tw-transition-colors"
                  >
                    💾 Test événement sauvegarde
                  </button>
                </div>

                <hr className="tw-my-3 tw-border-gray-200" />

                <div className="tw-text-sm tw-text-gray-600">
                  <strong>🎯 Principe :</strong><br />
                  Ces boutons utilisent un système d'événements global pour communiquer avec le QuoteEditor sans aucune dépendance directe.
                </div>
              </div>
            </div>
          </div>

          <div className="lg:tw-col-span-9">
            <QuoteEditor
              data={quoteData}
              onChange={handleQuoteChange}
              onSave={handleSave}
              autoSave={autoSave}
              readonly={readonly}
              usePDFV2={true}
            />
          </div>
        </div>

        <div className="tw-mt-4">
          <div>
            <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-overflow-hidden">
              <div className="tw-bg-gray-50 tw-border-b tw-border-gray-200 tw-p-4">
                <h5 className="tw-text-lg tw-font-semibold tw-mb-0">État actuel des données</h5>
              </div>
              <div className="tw-p-4">
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
                  <div>
                    <h6 className="tw-font-semibold tw-mb-2">Informations générales</h6>
                    <ul className="tw-list-none tw-space-y-1 tw-text-sm">
                      <li><strong>Numéro:</strong> {quoteData.quote.number}</li>
                      <li><strong>Version:</strong> {quoteData.quote.version}</li>
                      <li><strong>Client:</strong> {quoteData.recipient.fullName}</li>
                      <li><strong>Total TTC:</strong> {quoteData.totals.ttc.toFixed(2)} €</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="tw-font-semibold tw-mb-2">Statistiques</h6>
                    <ul className="tw-list-none tw-space-y-1 tw-text-sm">
                      <li><strong>Sections:</strong> {quoteData.sections.length}</li>
                      <li><strong>Lignes total:</strong> {quoteData.sections.reduce((acc, s) => acc + s.lines.length, 0)}</li>
                      <li><strong>Blocs options:</strong> {quoteData.optionBlocks.length}</li>
                      <li><strong>Notes NB:</strong> {quoteData.optionBlocks.find(block => block.id === 'nota_bene')?.notes?.length || 0}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

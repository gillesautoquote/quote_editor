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
  const [flatMode, setFlatMode] = useState<boolean>(false);
  const [printMode, setPrintMode] = useState<boolean>(false);
  const [showHeader, setShowHeader] = useState<boolean>(true);
  const [showFooter, setShowFooter] = useState<boolean>(true);
  const [externalUpdateCounter, setExternalUpdateCounter] = useState<number>(0);

  const handleEvent = useCallback((evt: any): void => {
    console.log('[App] Event received:', evt.type, evt);

    switch (evt.type) {
      case 'ready':
        console.log('[App] QuoteEditor is ready');
        break;
      case 'change':
        console.log('[App] Data changed:', evt.data);
        break;
      case 'save':
        console.log('[App] Saving quote data...', evt.data);
        break;
      case 'export_pdf':
        console.log('[App] PDF exported');
        break;
      case 'error':
        console.error('[App] Error:', evt.code, evt.message);
        break;
      case 'undo':
      case 'redo':
        console.log('[App] History action:', evt.type);
        break;
      case 'action':
        console.log('[App] Action:', evt.name, evt.payload);
        break;
    }
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

  const handleSimulateExternalUpdate = (): void => {
    console.log('[App] Simulating external data update from left column form');
    const updatedData = {
      ...quoteData,
      quote: {
        ...quoteData.quote,
        tagline: `Updated from external form #${externalUpdateCounter + 1}`
      },
      totals: {
        ...quoteData.totals,
        ttc: quoteData.totals.ttc + 100
      }
    };
    setQuoteData(updatedData);
    setExternalUpdateCounter(prev => prev + 1);
    console.log('[App] External data update applied - counter:', externalUpdateCounter + 1);
  };

  const handleUpdateClientName = (): void => {
    console.log('[App] Updating client name from external form');
    const updatedData = {
      ...quoteData,
      recipient: {
        ...quoteData.recipient,
        fullName: `${quoteData.recipient.fullName} (Modified)`,
      }
    };
    setQuoteData(updatedData);
    setExternalUpdateCounter(prev => prev + 1);
  };

  const handleAddSectionExternally = (): void => {
    console.log('[App] Adding new section from external form');
    const newSection = {
      title: `Section externe #${externalUpdateCounter + 1}`,
      columns: undefined,
      missionsLines: [],
      simplesLinesSelect: [],
      lines: [{
        date: new Date().toISOString().split('T')[0],
        description: 'Ligne ajoutée depuis le formulaire externe',
        durationHours: 1,
        pax: 1,
        unitPrice: 50,
        priceHT: 50,
        vatRate: 20,
        vatAmount: 10,
        quantity: 1,
        priceTTC: 60,
        calculable: true
      }],
      subTotal: { ht: 50, tva: 10, ttc: 60 }
    };

    const updatedData = {
      ...quoteData,
      sections: [...quoteData.sections, newSection],
      totals: {
        ht: quoteData.totals.ht + 50,
        tva: quoteData.totals.tva + 10,
        ttc: quoteData.totals.ttc + 60
      }
    };
    setQuoteData(updatedData);
    setExternalUpdateCounter(prev => prev + 1);
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
                      <button
                        type="button"
                        onClick={() => setFlatMode(!flatMode)}
                        className={`tw-px-3 tw-py-1.5 tw-rounded tw-text-sm tw-font-medium tw-transition-colors ${
                          flatMode
                            ? 'tw-bg-purple-500 tw-text-white hover:tw-bg-purple-600'
                            : 'tw-bg-white/20 tw-text-white hover:tw-bg-white/30 tw-border tw-border-white/30'
                        }`}
                      >
                        📄 {flatMode ? 'Mode Flat ON' : 'Mode Flat OFF'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPrintMode(!printMode)}
                        className={`tw-px-3 tw-py-1.5 tw-rounded tw-text-sm tw-font-medium tw-transition-colors ${
                          printMode
                            ? 'tw-bg-orange-500 tw-text-white hover:tw-bg-orange-600'
                            : 'tw-bg-white/20 tw-text-white hover:tw-bg-white/30 tw-border tw-border-white/30'
                        }`}
                      >
                        🖨️ {printMode ? 'Print ON' : 'Print OFF'}
                      </button>
                    </div>
                  </div>

                  <div className="tw-border-t tw-border-white/20 tw-pt-3 tw-mt-3">
                    <div className="tw-text-xs tw-text-white/80 tw-mb-2 tw-font-medium">Mode Flat - Contrôles:</div>
                    <div className="tw-flex tw-flex-wrap tw-gap-2">
                      <button
                        type="button"
                        onClick={() => setShowHeader(!showHeader)}
                        disabled={!flatMode}
                        className={`tw-px-3 tw-py-1.5 tw-rounded tw-text-sm tw-font-medium tw-transition-colors ${
                          !flatMode ? 'tw-opacity-50 tw-cursor-not-allowed' : ''
                        } ${
                          showHeader
                            ? 'tw-bg-blue-500 tw-text-white hover:tw-bg-blue-600'
                            : 'tw-bg-white/20 tw-text-white hover:tw-bg-white/30 tw-border tw-border-white/30'
                        }`}
                        title={!flatMode ? 'Activez le mode Flat pour utiliser ce contrôle' : ''}
                      >
                        Header {showHeader ? 'ON' : 'OFF'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowFooter(!showFooter)}
                        disabled={!flatMode}
                        className={`tw-px-3 tw-py-1.5 tw-rounded tw-text-sm tw-font-medium tw-transition-colors ${
                          !flatMode ? 'tw-opacity-50 tw-cursor-not-allowed' : ''
                        } ${
                          showFooter
                            ? 'tw-bg-teal-500 tw-text-white hover:tw-bg-teal-600'
                            : 'tw-bg-white/20 tw-text-white hover:tw-bg-white/30 tw-border tw-border-white/30'
                        }`}
                        title={!flatMode ? 'Activez le mode Flat pour utiliser ce contrôle' : ''}
                      >
                        Footer {showFooter ? 'ON' : 'OFF'}
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
                    <li>Ajoutez des lignes et sections avec les boutons <strong>+</strong></li>
                    <li>Supprimez des éléments avec l'icône corbeille au survol</li>
                    <li>Réorganisez avec les poignées de glisser-déposer</li>
                    <li><strong>Exportez en PDF</strong> pour obtenir un document professionnel</li>
                  </ul>
                  <div className="tw-bg-purple-50 tw-border tw-border-purple-200 tw-text-purple-800 tw-p-3 tw-mt-2 tw-mb-2 tw-rounded tw-text-sm">
                    📄 <strong>Mode Flat :</strong> Affiche tout le contenu de manière linéaire (Introduction → Programme → Services → Cotation → Conditions → Signature) pour une pagination optimale. Idéal pour la génération PDF avec Paged.js!
                  </div>
                  <div className="tw-bg-orange-50 tw-border tw-border-orange-200 tw-text-orange-800 tw-p-3 tw-mt-2 tw-mb-2 tw-rounded tw-text-sm">
                    🖨️ <strong>Mode Print :</strong> Active les optimisations d'impression (boutons masqués, espacements réduits, protection contre les coupures de page). Combine avec Mode Flat pour un rendu PDF optimal!
                  </div>
                  <div className="tw-bg-green-50 tw-border tw-border-green-200 tw-text-green-800 tw-p-3 tw-mt-2 tw-mb-2 tw-rounded tw-text-sm">
                    🔥 <strong>Astuce :</strong> Activez <strong>Mode Flat</strong> + <strong>Mode Print</strong> ensemble pour prévisualiser exactement ce qui sera dans le PDF. Les deux boutons peuvent aussi être activés indépendamment!
                  </div>
                  <div className="tw-bg-cyan-50 tw-border tw-border-cyan-200 tw-text-cyan-800 tw-p-3 tw-mt-2 tw-mb-0 tw-rounded tw-text-sm">
                    ⚙️ <strong>Nouveauté :</strong> En mode Flat, vous pouvez masquer le <strong>Header</strong> et/ou le <strong>Footer</strong> pour gérer vous-même les en-têtes/pieds de page répétés avec Paged.js. Le contenu brut est ainsi prêt pour votre pagination personnalisée!
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
                <h5 className="tw-text-lg tw-font-semibold tw-mb-0">🚀 Formulaire Externe</h5>
                <p className="tw-text-xs tw-mt-1 tw-text-green-100">Simule la colonne gauche</p>
              </div>
              <div className="tw-p-4">
                <div className="tw-bg-blue-50 tw-border tw-border-blue-200 tw-rounded tw-p-3 tw-mb-4">
                  <div className="tw-text-xs tw-font-semibold tw-text-blue-900 tw-mb-1">✅ Réactivité en temps réel</div>
                  <div className="tw-text-xs tw-text-blue-700">
                    Updates: <span className="tw-font-bold">{externalUpdateCounter}</span>
                  </div>
                </div>

                <p className="tw-text-sm tw-text-gray-600 tw-mb-3 tw-font-semibold">
                  Actions externes (depuis le formulaire):
                </p>

                <div className="tw-flex tw-flex-col tw-gap-2">
                  <button
                    type="button"
                    onClick={handleSimulateExternalUpdate}
                    className="tw-w-full tw-px-4 tw-py-2 tw-bg-blue-600 tw-text-white tw-rounded tw-font-medium hover:tw-bg-blue-700 tw-transition-colors tw-text-sm"
                  >
                    🔄 Modifier tagline + total
                  </button>

                  <button
                    type="button"
                    onClick={handleUpdateClientName}
                    className="tw-w-full tw-px-3 tw-py-2 tw-bg-purple-600 tw-text-white tw-rounded tw-font-medium hover:tw-bg-purple-700 tw-transition-colors tw-text-sm"
                  >
                    👤 Modifier nom client
                  </button>

                  <button
                    type="button"
                    onClick={handleAddSectionExternally}
                    className="tw-w-full tw-px-3 tw-py-2 tw-bg-orange-600 tw-text-white tw-rounded tw-font-medium hover:tw-bg-orange-700 tw-transition-colors tw-text-sm"
                  >
                    ➕ Ajouter une section
                  </button>
                </div>

                <hr className="tw-my-3 tw-border-gray-200" />

                <p className="tw-text-sm tw-text-gray-600 tw-mb-2 tw-font-semibold">
                  Actions PDF:
                </p>

                <div className="tw-flex tw-flex-col tw-gap-2">
                  <button
                    type="button"
                    onClick={handleTriggerPDFExport}
                    className="tw-w-full tw-px-4 tw-py-2 tw-bg-green-600 tw-text-white tw-rounded tw-font-medium hover:tw-bg-green-700 tw-transition-colors tw-text-sm"
                  >
                    📄 Export PDF
                  </button>
                </div>

                <hr className="tw-my-3 tw-border-gray-200" />

                <div className="tw-text-xs tw-text-gray-600 tw-bg-gray-50 tw-p-2 tw-rounded">
                  <strong>🎯 Démonstration:</strong><br />
                  Ces boutons modifient les données du devis depuis le parent. Le QuoteEditor dans la colonne droite réagit instantanément aux changements et les ajoute à l'historique undo/redo.
                </div>
              </div>
            </div>
          </div>

          <div className="lg:tw-col-span-9">
            <QuoteEditor
              data={quoteData}
              onEvent={handleEvent}
              readonly={readonly}
              flatMode={flatMode}
              printMode={printMode}
              showHeader={showHeader}
              showFooter={showFooter}
              usePDFV2={true}
              showAddBlock={true}
              showTemplateSelector={true}
              showReset={true}
              useTabs={true}
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

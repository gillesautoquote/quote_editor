# Exemple d'Intégration Complète - QuoteEditor Réactif

Ce document présente un exemple complet d'intégration du QuoteEditor dans une application avec formulaire externe.

## Architecture 2 Colonnes

```tsx
import React, { useState, useCallback } from 'react';
import { QuoteEditor } from './Components/QuoteEditor';
import type { QuoteData } from './Components/QuoteEditor/QuoteEditor.types';

export default function QuoteManagementPage() {
  // État central partagé entre le formulaire et le QuoteEditor
  const [quoteData, setQuoteData] = useState<QuoteData>(initialQuoteData);
  const [isEditing, setIsEditing] = useState(false);

  // Gestionnaire pour les modifications internes (depuis QuoteEditor)
  const handleQuoteInternalChange = useCallback((newData: QuoteData) => {
    console.log('[Parent] Internal change detected from QuoteEditor');
    // Optionnel : synchroniser avec votre backend
    // await api.updateQuote(newData);
  }, []);

  // Gestionnaires pour le formulaire externe (colonne gauche)
  const handleClientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuoteData(prev => ({
      ...prev,
      recipient: {
        ...prev.recipient,
        fullName: e.target.value
      }
    }));
  };

  const handleClientOrganizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuoteData(prev => ({
      ...prev,
      recipient: {
        ...prev.recipient,
        organization: e.target.value
      }
    }));
  };

  const handleQuoteTaglineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuoteData(prev => ({
      ...prev,
      quote: {
        ...prev.quote,
        tagline: e.target.value
      }
    }));
  };

  const handleAddServiceLine = () => {
    const newLine = {
      date: new Date().toISOString().split('T')[0],
      description: 'Nouvelle prestation',
      durationHours: 1,
      pax: 1,
      unitPrice: 0,
      priceHT: 0,
      vatRate: 20,
      vatAmount: 0,
      quantity: 1,
      priceTTC: 0,
      calculable: true
    };

    setQuoteData(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title: 'Nouvelle section',
          columns: undefined,
          missionsLines: [],
          simplesLinesSelect: [],
          lines: [newLine],
          subTotal: { ht: 0, tva: 0, ttc: 0 }
        }
      ]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">

          {/* COLONNE GAUCHE : Formulaire de Modification */}
          <div className="col-span-4">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                📝 Modifier le devis
              </h2>

              {/* Section Client */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">
                  Client
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={quoteData.recipient.fullName}
                    onChange={handleClientNameChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Jean Dupont"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organisation
                  </label>
                  <input
                    type="text"
                    value={quoteData.recipient.organization}
                    onChange={handleClientOrganizationChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Entreprise XYZ"
                  />
                </div>
              </div>

              {/* Section Devis */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">
                  Détails du devis
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={quoteData.quote.tagline}
                    onChange={handleQuoteTaglineChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Voyage d'affaires à Paris"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">
                  Actions
                </h3>

                <button
                  onClick={handleAddServiceLine}
                  className="w-full mb-3 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  ➕ Ajouter une section
                </button>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                    isEditing
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {isEditing ? '🔒 Mode lecture' : '✏️ Mode édition'}
                </button>
              </div>

              {/* Statistiques en temps réel */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  📊 Statistiques en temps réel
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    <strong>Total TTC :</strong> {quoteData.totals.ttc.toFixed(2)} €
                  </li>
                  <li>
                    <strong>Sections :</strong> {quoteData.sections.length}
                  </li>
                  <li>
                    <strong>Lignes :</strong>{' '}
                    {quoteData.sections.reduce((acc, s) => acc + s.lines.length, 0)}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : QuoteEditor Réactif */}
          <div className="col-span-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                <h2 className="text-xl font-bold">
                  📄 Aperçu du devis (en temps réel)
                </h2>
                <p className="text-sm text-blue-100 mt-1">
                  Les modifications du formulaire apparaissent instantanément
                </p>
              </div>

              <QuoteEditor
                data={quoteData}
                onChange={handleQuoteInternalChange}
                readonly={!isEditing}
                showToolbar={true}
                showAddSection={isEditing}
                showAddBlock={isEditing}
                showReset={false}
                allowWidthControl={true}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
```

## Points Clés de l'Intégration

### 1. État Centralisé

```tsx
const [quoteData, setQuoteData] = useState<QuoteData>(initialQuoteData);
```

L'état est géré au niveau du parent et partagé entre :
- Le formulaire (colonne gauche) qui le modifie
- Le QuoteEditor (colonne droite) qui le reflète

### 2. Modifications Externes

```tsx
const handleClientNameChange = (e) => {
  setQuoteData(prev => ({
    ...prev,
    recipient: {
      ...prev.recipient,
      fullName: e.target.value
    }
  }));
  // ✅ Le QuoteEditor détecte et applique le changement automatiquement
};
```

Chaque modification de `quoteData` déclenche une mise à jour immédiate du QuoteEditor.

### 3. Modifications Internes

```tsx
const handleQuoteInternalChange = useCallback((newData: QuoteData) => {
  console.log('[Parent] Internal change detected from QuoteEditor');
  // Les modifications internes ne remontent QUE via onChange
  // Ne PAS faire setQuoteData(newData) ici pour éviter les boucles
}, []);
```

Les modifications faites directement dans le QuoteEditor remontent via `onChange`.

### 4. Undo/Redo Global

Les changements externes ET internes sont tous les deux dans l'historique :

```tsx
// L'utilisateur peut faire Ctrl+Z pour annuler :
// - Ses propres modifications dans le QuoteEditor
// - Les modifications faites via le formulaire externe
```

## Flux de Données

```
┌─────────────────────────────────────────────────────────────┐
│                         Parent Component                      │
│                                                               │
│  const [quoteData, setQuoteData] = useState(...)             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
         │                                        ▲
         │                                        │
         ▼ (data prop)                           │ (onChange callback)
┌──────────────────────┐               ┌─────────────────────┐
│  Formulaire Externe  │               │   QuoteEditor       │
│  (Colonne Gauche)    │               │   (Colonne Droite)  │
│                      │               │                     │
│  - Input nom         │               │  - Édition inline   │
│  - Input org         │               │  - Calculs auto     │
│  - Input tagline     │               │  - Undo/Redo        │
│  - Bouton ajouter    │               │  - Export PDF       │
│                      │               │                     │
│  onChange → setQuoteData(...)        │   détecte via useEffect │
│                      │               │   + deep comparison │
└──────────────────────┘               └─────────────────────┘
         │                                        │
         └────────── Synchronisation ─────────────┘
                    instantanée et bidirectionnelle
```

## Avantages de cette Architecture

### ✅ Séparation des Responsabilités
- **Formulaire** : Interface simplifiée pour modifications ciblées
- **QuoteEditor** : Visualisation riche et édition avancée

### ✅ Expérience Utilisateur Optimale
- Feedback visuel immédiat
- Pas de latence perceptible
- Undo/Redo global cohérent

### ✅ Maintenabilité
- Code découplé et testable
- État centralisé facile à débugger
- Pas de prop drilling complexe

### ✅ Performance
- Deep comparison évite les re-renders inutiles
- Mémorisation des callbacks avec `useCallback`
- Updates atomiques et efficaces

## Cas d'Usage Avancés

### Synchronisation avec Backend

```tsx
const handleQuoteInternalChange = useCallback(async (newData: QuoteData) => {
  console.log('[Parent] Saving to backend...');
  try {
    await api.updateQuote(newData.quote.number, newData);
    console.log('[Parent] Saved successfully');
  } catch (error) {
    console.error('[Parent] Save failed:', error);
    // Gérer l'erreur (toast, rollback, etc.)
  }
}, []);
```

### Validation Avant Application

```tsx
const handleClientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newName = e.target.value;

  // Validation
  if (newName.length > 100) {
    console.error('Nom trop long');
    return;
  }

  setQuoteData(prev => ({
    ...prev,
    recipient: {
      ...prev.recipient,
      fullName: newName
    }
  }));
};
```

### Mode Collaborative (WebSocket)

```tsx
useEffect(() => {
  const socket = io('ws://your-server');

  socket.on('quote:updated', (updatedData: QuoteData) => {
    console.log('[WebSocket] Quote updated by another user');
    setQuoteData(updatedData);
    // ✅ Le QuoteEditor se synchronise automatiquement
  });

  return () => socket.disconnect();
}, []);
```

## Testing

### Test de Réactivité

```tsx
import { render, fireEvent, waitFor } from '@testing-library/react';
import QuoteManagementPage from './QuoteManagementPage';

test('should update QuoteEditor when form changes', async () => {
  const { getByLabelText, getByText } = render(<QuoteManagementPage />);

  const nameInput = getByLabelText('Nom complet');
  fireEvent.change(nameInput, { target: { value: 'New Name' } });

  await waitFor(() => {
    expect(getByText('New Name')).toBeInTheDocument();
  });
});
```

## Conclusion

Cette architecture offre :
- **Réactivité totale** entre formulaire et QuoteEditor
- **Historique unifié** pour une UX cohérente
- **Performance optimale** grâce aux optimisations intégrées
- **Simplicité d'intégration** avec quelques lignes de code

Le QuoteEditor gère automatiquement toute la complexité de la synchronisation, vous permettant de vous concentrer sur votre logique métier.

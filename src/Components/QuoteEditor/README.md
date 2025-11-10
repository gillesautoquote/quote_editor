# QuoteEditor - Composant React Standalone

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/react-18.3.1-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.5.3-blue.svg)

## 🎯 Vue d'ensemble

**QuoteEditor** est un composant React standalone complet pour la création, l'édition et l'export de devis professionnels. Il combine une interface d'édition intuitive avec un générateur PDF intégré haute qualité, 100% autonome et prêt à l'emploi.

## ✨ Fonctionnalités principales

- **🖊️ Édition en temps réel** - Double-clic pour éditer n'importe quel champ
- **🔄 Réactivité complète** - Synchronisation instantanée avec les données externes
- **📊 Tableaux dynamiques** - Sections avec lignes modifiables et calculs automatiques TVA
- **🧩 Blocs d'options** - Système modulaire de blocs personnalisables avec drag & drop
- **🗂️ Onglets dynamiques** - Gestion des onglets (ajout, suppression, réorganisation)
- **📄 Export PDF** - Génération PDF haute qualité via @react-pdf/renderer
- **🎨 Thème dynamique** - Couleurs personnalisables selon l'identité de l'entreprise
- **💾 Auto-sauvegarde** - Sauvegarde automatique configurable
- **⏮️ Undo/Redo** - Historique des modifications complet (Ctrl+Z/Ctrl+Y) incluant changements externes
- **📱 Responsive** - Interface adaptative desktop/mobile
- **🎯 Drag & Drop** - Réorganisation intuitive des éléments
- **🌍 i18n** - Support FR/EN intégré

## 🚀 Installation et utilisation

### Mode Standalone (recommandé)

```tsx
import React from 'react';
import { QuoteEditor } from './Components/QuoteEditor';
import type { ComponentEvent } from './Components/QuoteEditor';

function App() {
  const handleEvent = (evt: ComponentEvent) => {
    switch (evt.type) {
      case 'ready':
        console.log('Composant prêt');
        break;
      case 'change':
        console.log('Données modifiées:', evt.path, evt.value);
        break;
      case 'save':
        console.log('Sauvegarde demandée:', evt.data);
        // Votre logique de sauvegarde
        break;
      case 'error':
        console.error('Erreur:', evt.code, evt.message);
        break;
    }
  };

  return (
    <QuoteEditor
      data={myQuoteData}
      locale="fr"
      theme="light"
      onEvent={handleEvent}
    />
  );
}
```

### Mode Mock (développement)

```tsx
<QuoteEditor
  mock={true}
  locale="fr"
  theme="light"
  onEvent={handleEvent}
/>
```

### Mode Legacy (compatibilité)

```tsx
<QuoteEditor
  data={quoteData}
  onChange={setQuoteData}
  onSave={handleSave}
  autoSave={true}
  readonly={false}
/>
```

## 📋 API Props

### Props Standalone

| Prop | Type | Requis | Défaut | Description |
|------|------|--------|--------|-------------|
| `data` | `QuoteData` | ❌* | - | Données du devis |
| `mock` | `boolean` | ❌ | `false` | Mode mock avec données de test |
| `locale` | `'fr' \| 'en'` | ❌ | `'fr'` | Langue de l'interface |
| `theme` | `'light' \| 'dark'` | ❌ | `'light'` | Thème visuel |
| `className` | `string` | ❌ | - | Classes CSS personnalisées |
| `onEvent` | `(evt: ComponentEvent) => void` | ❌ | - | Callback pour tous les événements |
| `readonly` | `boolean` | ❌ | `false` | Mode lecture seule |
| `printMode` | `boolean` | ❌ | `false` | Mode impression |
| `flatMode` | `boolean` | ❌ | `false` | Vue aplatie (sans onglets) |
| `showToolbar` | `boolean` | ❌ | `true` | Afficher la barre d'outils |
| `showAddSection` | `boolean` | ❌ | `false` | Bouton "+ Tableau" |
| `showAddBlock` | `boolean` | ❌ | `false` | Bouton "+ Liste" |
| `showReset` | `boolean` | ❌ | `false` | Bouton "Réinitialiser" |
| `allowWidthControl` | `boolean` | ❌ | `true` | Contrôles de largeur |
| `showHeader` | `boolean` | ❌ | `true` | Afficher l'en-tête |
| `showFooter` | `boolean` | ❌ | `true` | Afficher le pied de page |

*Requis si `mock` n'est pas `true`

### Events (ComponentEvent)

```typescript
type ComponentEvent =
  | { type: 'ready' }
  | { type: 'error'; code: string; message: string }
  | { type: 'change'; path: string; value: unknown; data: QuoteData }
  | { type: 'save'; data: QuoteData }
  | { type: 'export_pdf'; data: QuoteData }
  | { type: 'undo'; data: QuoteData }
  | { type: 'redo'; data: QuoteData }
  | { type: 'action'; name: string; payload?: unknown };
```

## 🏗️ Structure des données

```typescript
interface QuoteData {
  company: Company;              // Infos entreprise + logo + couleur principale
  recipient: Recipient;          // Destinataire du devis
  quote: Quote;                  // Métadonnées (numéro, dates, tagline)
  sections: QuoteSection[];      // Tableaux de prestations avec calculs TVA
  totals: Totals;               // Totaux HT/TTC/TVA calculés automatiquement
  optionBlocks: OptionBlock[];  // Blocs personnalisables (conditions, programme)
  signatureFrame: SignatureFrame; // Encart signature avec instructions
  clientSignature: ClientSignature; // Zone signature client
  footer: Footer;               // Pied de page (copyright, mentions)
  selectDefinitions: Record<string, SelectDefinition>; // Définitions des sélecteurs
  visibleTabIds?: string[];     // IDs des onglets visibles
}
```

## 🎨 Personnalisation du thème

Le composant applique automatiquement la couleur principale de l'entreprise :

```typescript
const customData: QuoteData = {
  company: {
    name: 'Ma Société',
    logoUrl: '/path/to/logo.png',
    mainColor: '#009955', // Couleur verte personnalisée
    // ... autres champs
  },
  // ... reste des données
};
```

La couleur est automatiquement appliquée à :
- En-têtes de sections
- Boutons d'action
- Éléments interactifs
- PDF exporté

## 📄 Export PDF

L'export PDF génère un document professionnel avec :
- Mise en page A4 optimisée
- Couleurs de thème cohérentes
- Pagination automatique intelligente
- Respect des sections visibles (selon `visibleTabIds`)

```typescript
// Via ref
const editorRef = useRef<QuoteEditorHandle>(null);
await editorRef.current?.exportToPDF();

// Via événement
const handleEvent = (evt: ComponentEvent) => {
  if (evt.type === 'export_pdf') {
    console.log('PDF généré avec les données:', evt.data);
  }
};
```

## 🎮 Contrôles utilisateur

### Raccourcis clavier

| Action | Raccourci | Description |
|--------|-----------|-------------|
| **Éditer** | `Double-clic` | Édite n'importe quel texte |
| **Annuler** | `Ctrl+Z` | Annule la dernière action |
| **Rétablir** | `Ctrl+Y` / `Ctrl+Shift+Z` | Rétablit l'action annulée |
| **Sauvegarder** | `Ctrl+S` | Force la sauvegarde |
| **Échapper** | `Escape` | Annule l'édition en cours |

### Méthodes impératives via ref

```typescript
import { useRef } from 'react';
import type { QuoteEditorHandle } from './Components/QuoteEditor';

function App() {
  const editorRef = useRef<QuoteEditorHandle>(null);

  return (
    <>
      <button onClick={() => editorRef.current?.exportToPDF()}>
        Exporter PDF
      </button>
      <button
        onClick={() => editorRef.current?.undo()}
        disabled={!editorRef.current?.canUndo}
      >
        Annuler
      </button>
      <button
        onClick={() => editorRef.current?.redo()}
        disabled={!editorRef.current?.canRedo}
      >
        Rétablir
      </button>

      <QuoteEditor
        ref={editorRef}
        data={quoteData}
        onEvent={handleEvent}
      />
    </>
  );
}
```

## 🧩 Composants et Hooks exportés

### Composants

```typescript
import { QuoteEditor } from './Components/QuoteEditor';
```

### Types

```typescript
import type {
  QuoteEditorProps,
  QuoteEditorHandle,
  QuoteData,
  Company,
  Recipient,
  Quote,
  QuoteSection,
  QuoteLine,
  OptionBlock,
  ComponentEvent
} from './Components/QuoteEditor';
```

### Hooks

```typescript
import {
  useQuoteEditor,
  usePDFExport,
  useListManager,
  useDragAndDrop,
  useFieldPath,
  useColorTheme
} from './Components/QuoteEditor';
```

### Utilitaires

```typescript
import {
  normalizeQuoteData,
  validateQuoteData,
  globalEventEmitter,
  EVENTS
} from './Components/QuoteEditor';
```

## 🎯 Calculs automatiques

Le composant gère automatiquement :
- **Calculs de lignes** : Prix unitaire × Quantité = Total HT
- **Totaux par section** : Somme des lignes avec gestion multi-TVA
- **Totaux globaux** : Agrégation de toutes les sections
- **Ventilation TVA** : Détail par taux (5.5%, 10%, 20%)
- **Prix TTC** : Calcul automatique HT + TVA

## 📱 Modes d'affichage

### Mode Onglets (par défaut)
Navigation par onglets avec gestion dynamique (ajout/suppression/réorganisation).

### Mode Flat (`flatMode={true}`)
Vue aplatie sans onglets, toutes les sections visibles d'un coup. Idéal pour l'impression.

### Mode Print (`printMode={true}`)
Optimisé pour l'impression avec styles adaptés et gestion des sauts de page.

### Mode Preview (`previewMode={true}`)
Vue de prévisualisation épurée sans contrôles d'édition.

## 🌐 Internationalisation

Le composant supporte FR et EN :

```tsx
<QuoteEditor
  data={quoteData}
  locale="en"
  onEvent={handleEvent}
/>
```

Textes traduits :
- Interface utilisateur
- Messages d'erreur
- Labels des champs
- Tooltips

## ⚡ Performance

- **Optimisations** : Mémorisation avec `useMemo` et `useCallback`
- **Debounce** : Auto-sauvegarde avec délai configurable
- **Réactivité intelligente** : Deep comparison pour éviter les re-renders inutiles
- **Historique optimisé** : Limitation automatique à 50 entrées
- **Taille bundle** : ~600KB gzippé (incluant @react-pdf/renderer)
- **Compatibilité** : React 18.3+, navigateurs modernes

## 🔄 Réactivité et Intégration

**Le QuoteEditor est conçu pour être entièrement réactif aux changements externes.**

Cas d'usage typique : Interface à 2 colonnes
- **Colonne gauche** : Formulaire de modification des données
- **Colonne droite** : QuoteEditor qui reflète instantanément les changements

```tsx
const [quoteData, setQuoteData] = useState<QuoteData>(initialData);

// Modifier depuis le formulaire parent
const handleUpdateFromForm = () => {
  setQuoteData(prev => ({
    ...prev,
    recipient: { ...prev.recipient, fullName: "Nouveau nom" }
  }));
  // ✅ Le QuoteEditor se met à jour immédiatement
};

<QuoteEditor data={quoteData} onChange={handleInternalChanges} />
```

Caractéristiques :
- ✅ **Synchronisation instantanée** : Chaque changement de la prop `data` est détecté et appliqué
- ✅ **Historique préservé** : Les changements externes sont ajoutés à l'historique undo/redo
- ✅ **Pas de conflit** : L'édition interne et les mises à jour externes ne se chevauchent jamais
- ✅ **Performance optimisée** : Deep comparison pour éviter les re-renders inutiles

📖 **Pour plus de détails, consultez le [Guide de Réactivité](/docs/REACTIVITY_GUIDE.md)**

## 🔧 Technologies utilisées

- **React 18.3** - Framework UI
- **TypeScript 5.5** - Typage strict
- **Tailwind CSS** - Styles avec préfixe `tw-`
- **@react-pdf/renderer** - Génération PDF
- **lucide-react** - Icônes
- **clsx** - Composition de classes

## ✅ Conformité

Le composant respecte les standards :
- ✅ **Standalone** - Zéro dépendance au parent
- ✅ **TypeScript strict** - Typage complet sans `any`
- ✅ **Tailwind préfixé** - Toutes les classes avec `tw-`
- ✅ **Pas de SCSS** - CSS-in-JS uniquement
- ✅ **Mode mock** - Données de test intégrées
- ✅ **Validation** - Runtime validation avec retours d'erreur
- ✅ **Events** - API événementielle complète

## 🐛 Gestion d'erreurs

Le composant émet des événements d'erreur structurés :

```typescript
const handleEvent = (evt: ComponentEvent) => {
  if (evt.type === 'error') {
    switch (evt.code) {
      case 'NO_DATA':
        console.error('Aucune donnée fournie');
        break;
      case 'INVALID_DATA':
        console.error('Données invalides:', evt.message);
        break;
      case 'LOAD_ERROR':
        console.error('Erreur de chargement');
        break;
    }
  }
};
```

## 📦 Structure du projet

```
QuoteEditor/
├── index.ts                    # Exports publics
├── QuoteEditor.tsx            # Composant principal
├── QuoteEditor.types.ts       # Types publics
├── README.md                  # Ce fichier
├── entities/
│   └── QuoteData.ts          # Modèles de données
├── hooks/
│   ├── useQuoteEditor.ts     # Hook principal
│   ├── usePDFExport.tsx      # Export PDF
│   ├── useListManager.ts     # Gestion listes
│   ├── useDragAndDrop.ts     # Drag & drop
│   ├── useFieldPath.ts       # Chemins de données
│   └── useColorTheme.ts      # Gestion thème
├── components/
│   ├── QuotePage/            # Pages de devis
│   ├── QuoteSection/         # Sections/tableaux
│   ├── QuoteTabs/            # Système d'onglets
│   ├── OptionBlock/          # Blocs options
│   ├── EditableField/        # Champs éditables
│   └── shared/               # Composants partagés
├── pdf/
│   ├── QuotePDFDocument.tsx  # Document PDF
│   ├── components/           # Composants PDF
│   └── styles/               # Styles PDF
├── utils/
│   ├── calculationUtils.ts   # Calculs TVA
│   ├── dataValidator.ts      # Validation
│   ├── eventEmitter.ts       # Events
│   └── ...
├── i18n/
│   └── translations.ts       # FR/EN
└── mocks/
    └── data.mock.json        # Données de test
```

## 📄 Licence

Composant propriétaire - Tous droits réservés

---

**Version 1.0.0** - Composant production-ready 🚀

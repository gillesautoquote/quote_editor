# QuoteEditor - Composant React Standalone

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/react-18.3.1-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.5.3-blue.svg)

## 🎯 Vue d'ensemble

**QuoteEditor** est un composant React standalone complet pour la création, l'édition et l'export de devis professionnels. Il combine une interface d'édition intuitive avec un générateur PDF intégré haute qualité.

## ✨ Fonctionnalités principales

- **🖊️ Édition en temps réel** - Double-clic pour éditer n'importe quel champ
- **📊 Tableaux dynamiques** - Sections avec lignes modifiables et calculs automatiques
- **🧩 Blocs d'options** - Système modulaire de blocs personnalisables avec drag & drop
- **📄 Export PDF** - Génération PDF haute qualité avec mise en page professionnelle
- **🎨 Thème dynamique** - Couleurs personnalisables selon l'identité de l'entreprise
- **💾 Auto-sauvegarde** - Sauvegarde automatique configurable
- **⏮️ Undo/Redo** - Historique des modifications complet (Ctrl+Z/Ctrl+Y)
- **📱 Responsive** - Interface adaptative desktop/mobile
- **🎯 Drag & Drop** - Réorganisation intuitive des éléments

## 🚀 Installation rapide

```tsx
import React, { useState } from 'react';
import { QuoteEditor } from './Components/QuoteEditor/QuoteEditor';
import { quoteDataMock } from './Components/QuoteEditor/mocks/quoteDataMock';
import type { QuoteData } from './Components/QuoteEditor/entities/QuoteData';

function App() {
  const [quoteData, setQuoteData] = useState<QuoteData>(quoteDataMock);

  const handleSave = async (data: QuoteData) => {
    console.log('Saving quote:', data);
    // Votre logique de sauvegarde ici
    // Ex: await api.saveQuote(data);
  };

  return (
    <QuoteEditor
      data={quoteData}
      onChange={setQuoteData}
      onSave={handleSave}
      autoSave={true}
      readonly={false}
    />
  );
}
```

## 📋 Props de base

### Props essentielles

| Prop | Type | Requis | Défaut | Description |
|------|------|--------|--------|-------------|
| `data` | `QuoteData` | ✅ | - | Données complètes du devis |
| `onChange` | `(data: QuoteData) => void` | ✅ | - | Callback appelé à chaque modification |
| `onSave` | `(data: QuoteData) => Promise<void>` | ❌ | - | Callback de sauvegarde asynchrone |
| `autoSave` | `boolean` | ❌ | `true` | Active la sauvegarde automatique |
| `readonly` | `boolean` | ❌ | `false` | Mode lecture seule |

### Props de configuration avancée

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `className` | `string` | - | Classes CSS personnalisées |
| `showToolbar` | `boolean` | `true` | Afficher la barre d'outils |
| `toolbarActions` | `string[]` | `['all']` | Actions à afficher dans la toolbar |
| `showAddSection` | `boolean` | `false` | Afficher bouton "+ Tableau" |
| `showAddBlock` | `boolean` | `false` | Afficher bouton "+ Liste" |
| `showReset` | `boolean` | `false` | Afficher bouton "Réinitialiser" |
| `showTemplateSelector` | `boolean` | `false` | Afficher sélecteur de templates |
| `allowWidthControl` | `boolean` | `true` | Contrôles de largeur des blocs |
| `ref` | `React.Ref<QuoteEditorHandle>` | - | Référence pour méthodes impératives |

## 📚 Documentation détaillée

| Document | Description |
|----------|-------------|
| **[API.md](./API.md)** | API complète et callbacks détaillés |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Architecture interne et patterns |
| **[TYPES.md](./TYPES.md)** | Types TypeScript complets |
| **[HOOKS.md](./HOOKS.md)** | Hooks personnalisés |
| **[EXAMPLES.md](./EXAMPLES.md)** | Exemples d'intégration avancés |
| **[CUSTOMIZATION.md](./CUSTOMIZATION.md)** | Guide de personnalisation |

## 🎨 Exemple avec thème personnalisé

```tsx
import { QuoteEditor } from './Components/QuoteEditor/QuoteEditor';

const customData: QuoteData = {
  ...quoteDataMock,
  company: {
    ...quoteDataMock.company,
    mainColor: '#00AA55', // Couleur verte personnalisée
    name: 'Ma Société',
    logoUrl: '/path/to/logo.png'
  }
};

<QuoteEditor
  data={customData}
  onChange={setQuoteData}
  onSave={handleSave}
  autoSave={true}
/>
```

## 💾 Gestion de la sauvegarde

```tsx
const handleSave = async (data: QuoteData): Promise<void> => {
  try {
    // Option 1: API REST
    await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    // Option 2: Base de données locale
    await db.quotes.put(data);
    
    // Option 3: Fichier JSON local
    localStorage.setItem(`quote_${data.quote.number}`, JSON.stringify(data));
    
    console.log('Devis sauvegardé avec succès');
  } catch (error) {
    console.error('Erreur de sauvegarde:', error);
    throw error; // Le composant affichera l'erreur
  }
};
```

## 📖 Mode lecture seule

```tsx
// Pour l'affichage de devis validés ou archivés
<QuoteEditor
  data={archivedQuote}
  onChange={() => {}} // Callback vide
  readonly={true}
/>
```

## 🎯 Callbacks essentiels

### `onChange(data: QuoteData)`
Appelé à **chaque modification** de données :
- Édition de texte
- Ajout/suppression de lignes
- Réorganisation d'éléments
- Modification de couleurs

### `onSave(data: QuoteData)`
Appelé pour la **sauvegarde persistante** :
- Automatiquement (si `autoSave=true`)
- Manuellement (bouton Sauvegarder)
- Raccourci clavier (Ctrl+S)

## 🏗️ Structure des données

```tsx
interface QuoteData {
  company: Company;           // Infos entreprise + logo + couleur
  recipient: Recipient;       // Destinataire du devis
  quote: Quote;              // Métadonnées du devis
  sections: QuoteSection[];  // Tableaux de prestations
  totals: Totals;           // Totaux calculés
  optionBlocks: OptionBlock[]; // Blocs personnalisables
  signatureFrame: SignatureFrame; // Encart signature
  clientSignature: ClientSignature; // Signature finale
  footer: Footer;           // Pied de page
  selectDefinitions: Record<string, SelectDefinition>; // Sélecteurs
}
```

## 🎮 Contrôles utilisateur

### Raccourcis clavier

| Action | Raccourci | Description |
|--------|-----------|-------------|
| **Éditer** | `Double-clic` | Édite n'importe quel texte |
| **Annuler** | `Ctrl+Z` | Annule la dernière action |
| **Rétablir** | `Ctrl+Y` | Rétablit l'action annulée |
| **Sauvegarder** | `Ctrl+S` | Force la sauvegarde |
| **Échapper** | `Escape` | Annule l'édition en cours |

### Méthodes impératives via ref

```tsx
import { useRef } from 'react';
import type { QuoteEditorHandle } from './Components/QuoteEditor/entities/QuoteData';

function App() {
  const editorRef = useRef<QuoteEditorHandle>(null);

  const handleExternalExport = async () => {
    await editorRef.current?.exportToPDF();
  };

  const handleExternalUndo = () => {
    if (editorRef.current?.canUndo) {
      editorRef.current.undo();
    }
  };

  return (
    <>
      <button onClick={handleExternalExport}>Exporter PDF</button>
      <button onClick={handleExternalUndo} disabled={!editorRef.current?.canUndo}>
        Annuler
      </button>

      <QuoteEditor
        ref={editorRef}
        data={quoteData}
        onChange={setQuoteData}
      />
    </>
  );
}
```

## 📦 Exemples d'intégration

### Avec React Hook Form
```tsx
import { useForm, Controller } from 'react-hook-form';

function QuoteForm() {
  const { control, handleSubmit } = useForm();
  
  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <Controller
        name="quote"
        control={control}
        render={({ field }) => (
          <QuoteEditor
            data={field.value}
            onChange={field.onChange}
            onSave={async (data) => {
              field.onChange(data);
              // Sauvegarde additionnelle
            }}
          />
        )}
      />
    </form>
  );
}
```

### Avec Redux
```tsx
import { useSelector, useDispatch } from 'react-redux';
import { updateQuote, saveQuote } from './quoteSlice';

function ConnectedQuoteEditor() {
  const dispatch = useDispatch();
  const quoteData = useSelector(state => state.quote.data);
  
  return (
    <QuoteEditor
      data={quoteData}
      onChange={(data) => dispatch(updateQuote(data))}
      onSave={(data) => dispatch(saveQuote(data))}
    />
  );
}
```

## 🐛 Gestion d'erreurs

```tsx
const [error, setError] = useState<string | null>(null);

const handleSave = async (data: QuoteData) => {
  try {
    await api.saveQuote(data);
    setError(null);
  } catch (err) {
    setError('Erreur de sauvegarde: ' + err.message);
    throw err; // Important: relancer pour que le composant sache
  }
};

return (
  <>
    {error && <div className="alert alert-danger">{error}</div>}
    <QuoteEditor
      data={quoteData}
      onChange={setQuoteData}
      onSave={handleSave}
    />
  </>
);
```

## 📱 Responsive Design

Le composant s'adapte automatiquement :
- **Desktop** : Interface complète avec toolbar
- **Tablet** : Colonnes adaptatives pour les blocs
- **Mobile** : Vue empilée optimisée

## 🎨 Personnalisation avancée

```tsx
// CSS Custom Properties pour override
:root {
  --dynamic-primary-color: #your-brand-color;
  --page-width: 21cm;
  --page-margin: 1cm;
}
```

## 📄 Export PDF

L'export PDF est automatiquement configuré et génère un document professionnel avec :
- Mise en page A4 optimisée
- Couleurs de thème cohérentes
- Pagination automatique
- Protection contre les coupures d'éléments

## ⚡ Performance

- **Optimisations** : Debounce automatique, mémorisation des rendus
- **Taille bundle** : ~200KB gzippé avec dépendances PDF
- **Compatibilité** : React 16.8+ (hooks), navigateurs modernes

## 🤝 Support

Pour des questions spécifiques :
1. Consultez les exemples dans `EXAMPLES.md`
2. Vérifiez les types dans `TYPES.md`
3. Examinez l'architecture dans `ARCHITECTURE.md`

---

**Version 1.0.0** - Composant prêt pour la production 🚀
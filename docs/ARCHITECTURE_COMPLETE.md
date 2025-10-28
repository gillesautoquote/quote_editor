# QuoteEditor - Architecture et Organisation Complète

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture globale](#architecture-globale)
3. [Structure des dossiers](#structure-des-dossiers)
4. [Composants principaux](#composants-principaux)
5. [Système de gestion des données](#système-de-gestion-des-données)
6. [Hooks personnalisés](#hooks-personnalisés)
7. [Système de thème dynamique](#système-de-thème-dynamique)
8. [Génération PDF](#génération-pdf)
9. [Flux de données](#flux-de-données)
10. [Patterns et conventions](#patterns-et-conventions)

---

## 🎯 Vue d'ensemble

**QuoteEditor** est un composant React avancé permettant de créer, éditer et générer des devis professionnels au format PDF. Il gère des structures de données complexes avec calculs automatiques, drag & drop, édition inline et thème dynamique.

### Statistiques
- **97 fichiers** TypeScript/TSX
- **~15 000 lignes** de code
- **Architecture modulaire** avec séparation stricte des responsabilités
- **Double mode** : Legacy et Standalone
- **2 moteurs PDF** : V1 (classique) et V2 (paginé)

---

## 🏗️ Architecture globale

### Principe de conception

L'architecture suit les principes suivants :

1. **Single Responsibility Principle** : Chaque composant/hook/utilitaire a une responsabilité unique
2. **Composition** : Les composants complexes sont composés de sous-composants spécialisés
3. **Immutabilité** : Les données sont traitées de manière immuable
4. **Typage strict** : TypeScript utilisé dans 100% du code
5. **Séparation présentation/logique** : Hooks pour la logique, composants pour l'UI

### Schéma conceptuel

```
┌────────────────────────────────────────────────────────────┐
│                       QuoteEditor                           │
│  (Composant racine avec orchestration globale)             │
└──────────────────┬────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
   ┌────▼─────┐         ┌────▼─────┐
   │  Hooks   │         │Components│
   │ Logique  │         │    UI    │
   └──────────┘         └──────────┘
        │                     │
   ┌────▼─────┐         ┌────▼─────┐
   │  Utils   │         │   PDF    │
   │ Calculs  │         │Generators│
   └──────────┘         └──────────┘
```

---

## 📁 Structure des dossiers

```
src/Components/QuoteEditor/
│
├── QuoteEditor.tsx              # Composant racine
├── QuoteEditor.types.ts         # Types standalone mode
├── index.ts                     # Point d'entrée public
│
├── entities/
│   └── QuoteData.ts            # Types legacy + interfaces de données
│
├── hooks/                       # Hooks React personnalisés
│   ├── useQuoteEditor.ts       # Gestion état + historique
│   ├── useColorTheme.ts        # Thème dynamique
│   ├── usePDFExport.tsx        # Export PDF V1
│   ├── useDragAndDrop.ts       # Drag & drop générique
│   ├── useListManager.ts       # Gestion listes
│   └── useFieldPath.ts         # Chemins de données
│
├── components/                  # Composants UI
│   ├── QuotePage/              # Page de devis complète
│   │   ├── QuotePage.tsx
│   │   └── components/
│   │       ├── QuotePageHeader.tsx
│   │       ├── QuotePageRecipient.tsx
│   │       ├── QuotePageIntro.tsx
│   │       ├── QuotePageTotals.tsx
│   │       └── QuotePageFooter.tsx
│   │
│   ├── QuoteTabs/              # Système d'onglets
│   │   ├── QuoteTabs.tsx       # Conteneur d'onglets
│   │   └── QuoteTabContent.tsx # Contenu par onglet
│   │
│   ├── QuoteSection/           # Section de cotation
│   │   ├── QuoteSection.tsx
│   │   ├── TableHeader.tsx
│   │   └── components/
│   │       ├── TableRow.tsx
│   │       ├── SubtotalRow.tsx
│   │       ├── SectionActions.tsx
│   │       └── DropIndicator.tsx
│   │
│   ├── OptionBlock/            # Blocs d'options
│   │   ├── OptionBlock.tsx
│   │   ├── ColumnControls.tsx
│   │   ├── OptionSelector.tsx
│   │   ├── StyleSelector.tsx
│   │   └── components/
│   │       ├── OptionBlockHeader.tsx
│   │       ├── OptionBlockContent.tsx
│   │       ├── OptionRow.tsx
│   │       ├── NoteRow.tsx
│   │       └── TripProgramBlock.tsx
│   │
│   ├── SignatureSection/       # Section signature
│   │   └── SignatureSection.tsx
│   │
│   ├── CarbonImpact/          # Impact carbone
│   │   └── CarbonImpact.tsx
│   │
│   ├── EditableField/         # Champs éditables
│   │   ├── EditableField.tsx
│   │   └── EditableMarkdownField.tsx
│   │
│   ├── InstructionsFrame/     # Cadre d'instructions
│   │   └── InstructionsFrame.tsx
│   │
│   └── shared/                # Composants partagés
│       ├── AddButton.tsx
│       ├── BlocksContainer.tsx
│       ├── DragDropListItem.tsx
│       └── QuoteEditorToolbar.tsx
│
├── utils/                      # Utilitaires
│   ├── calculationUtils.ts    # Calculs financiers
│   ├── colorUtils.ts          # Gestion des couleurs
│   ├── textUtils.ts           # Formatage texte
│   ├── dateFormatters.ts      # Formatage dates
│   ├── blockUtils.ts          # Utilitaires blocs
│   ├── dataValidator.ts       # Validation données
│   ├── eventEmitter.ts        # Événements globaux
│   └── itineraryConverters.ts # Conversion itinéraires
│
├── pdf/                        # Moteur PDF V1
│   ├── QuotePDFDocument.tsx   # Document principal
│   ├── components/            # Composants PDF
│   ├── styles/                # Styles PDF
│   └── utils/                 # Utilitaires PDF
│
├── pdf-v2/                     # Moteur PDF V2 (paginé)
│   ├── PDFDocumentV2.tsx      # Document V2
│   ├── components/            # Composants réutilisables
│   ├── generators/            # Générateurs de pages
│   ├── hooks/                 # Hook PDF V2
│   ├── styles/                # Styles V2
│   └── utils/                 # Utilitaires V2
│
├── i18n/                       # Internationalisation
│   └── translations.ts        # Traductions FR/EN
│
└── mocks/                      # Données de test
    └── data.mock.json         # Données mock complètes
```

---

## 🧩 Composants principaux

### 1. QuoteEditor (Racine)

**Fichier** : `QuoteEditor.tsx` (550 lignes)

**Responsabilités** :
- Orchestration globale du composant
- Gestion du mode Legacy vs Standalone
- Application du thème dynamique
- Gestion de l'historique (Undo/Redo)
- Exposition de l'API via `useImperativeHandle`
- Chargement et validation des données
- Coordination des événements

**Props principales** :
```typescript
interface QuoteEditorProps {
  data?: QuoteData;           // Données du devis
  mock?: boolean;             // Charger données mock
  locale?: 'fr' | 'en';      // Langue
  theme?: 'light' | 'dark';  // Thème
  readonly?: boolean;         // Mode lecture seule
  onEvent?: (evt: ComponentEvent) => void; // Événements
  showToolbar?: boolean;      // Afficher toolbar
  // ... autres options
}
```

**API exposée** :
```typescript
interface QuoteEditorHandle {
  exportToPDF: () => Promise<void>;
  saveData: () => Promise<void>;
  undo: () => void;
  redo: () => void;
  getData: () => QuoteData;
  canUndo: boolean;
  canRedo: boolean;
}
```

**Cycle de vie** :
1. Chargement des données (initialData ou mock)
2. Validation des données
3. Application du thème couleur
4. Rendu de la toolbar (optionnel)
5. Rendu du contenu (Tabs ou Page)
6. Écoute des événements globaux (PDF export)

---

### 2. QuoteTabs

**Fichier** : `components/QuoteTabs/QuoteTabs.tsx`

**Responsabilités** :
- Gestion des onglets (Introduction, Programme, Cotation, Conditions, Signature)
- Drag & drop des onglets pour réorganisation
- Ajout/suppression dynamique d'onglets
- Application du thème couleur sur les onglets

**Onglets disponibles** :
1. **Introduction** : Destinataire + intro
2. **Programme** : Itinéraire + impact carbone
3. **Cotation** : Sections de prix + totaux
4. **Conditions** : Blocs d'options (inclus/exclus)
5. **Signature** : Bon de commande + signature client

**Fonctionnalités** :
- Navigation par onglets
- Réorganisation par drag & drop
- Menu d'ajout d'onglets cachés
- Suppression d'onglets (minimum 1)
- Couleur dynamique selon `company.mainColor`

---

### 3. QuotePage

**Fichier** : `components/QuotePage/QuotePage.tsx`

**Responsabilités** :
- Affichage d'une page de devis complète
- Configuration flexible du contenu à afficher
- Gestion de la largeur (800px ou 1200px)
- Format A4 pour l'impression

**Structure** :
```tsx
<QuotePage>
  <QuotePageHeader />       {/* Logo + infos société */}
  <QuotePageRecipient />    {/* Destinataire */}
  <QuotePageIntro />        {/* Introduction */}
  <QuoteSection />          {/* Sections de cotation */}
  <QuotePageTotals />       {/* Totaux généraux */}
  <OptionBlock />           {/* Blocs d'options */}
  <SignatureSection />      {/* Signature */}
  <QuotePageFooter />       {/* Footer légal */}
</QuotePage>
```

---

### 4. QuoteSection

**Fichier** : `components/QuoteSection/QuoteSection.tsx`

**Responsabilités** :
- Affichage d'une section de cotation (tableau de lignes)
- Calculs automatiques (HT, TVA, TTC)
- Gestion des colonnes configurables
- Drag & drop des lignes
- Ajout/suppression de lignes

**Calculs gérés** :
```typescript
// Formules appliquées automatiquement
priceHT = quantity × unitPrice
vatAmount = priceHT × (vatRate / 100)
priceTTC = priceHT + vatAmount
```

**Colonnes disponibles** :
- Date
- Description
- Durée (heures)
- PAX (nombre de personnes)
- Prix unitaire HT
- Prix HT
- Taux TVA
- Quantité
- Prix TTC

---

### 5. OptionBlock

**Fichier** : `components/OptionBlock/OptionBlock.tsx`

**Responsabilités** :
- Affichage de blocs d'options (inclus/exclus/notes)
- Support multi-colonnes (1 à 4 colonnes)
- 3 types de blocs :
  1. **List** : Liste à puces
  2. **Notes** : Paragraphes de texte
  3. **Programme-voyage** : Itinéraire détaillé
- Couleur personnalisable par bloc
- Drag & drop des items

**Configuration** :
```typescript
interface OptionBlock {
  id: string;
  title: string;
  color?: string;              // Couleur du bloc
  columns?: number;            // 1-4 colonnes
  showTitle?: boolean;         // Afficher titre
  type: 'list' | 'notes' | 'programme-voyage';
  rows?: OptionRow[];          // Pour type=list
  notes?: NoteItem[];          // Pour type=notes
  tripSteps?: TripProgramStep[]; // Pour type=programme-voyage
}
```

---

## 💾 Système de gestion des données

### Structure QuoteData

```typescript
interface QuoteData {
  company: Company;              // Infos société
  recipient: Recipient;          // Destinataire
  quote: Quote;                  // Infos devis
  sections: QuoteSection[];      // Sections de cotation
  totals: {                      // Totaux généraux
    ht: number;
    tva: number;
    ttc: number;
    vatBreakdown?: VATBreakdown[];
  };
  optionBlocks: OptionBlock[];   // Blocs d'options
  signatureFrame: SignatureFrame;
  clientSignature: ClientSignature;
  footer: Footer;
  selectDefinitions: Record<string, SelectDefinition>;
  itinerary?: DaySchedule[];     // Itinéraire (optionnel)
  carbonImpact?: CarbonImpact;   // Impact carbone (optionnel)
}
```

### Validation et normalisation

**Fichier** : `utils/dataValidator.ts`

```typescript
// Validation
validateQuoteData(data): { valid: boolean; errors: string[] }

// Normalisation (valeurs par défaut)
normalizeQuoteData(data): QuoteData
```

### Calculs automatiques

**Fichier** : `utils/calculationUtils.ts`

Fonctions principales :
- `safeNumber(value)` : Convertit en nombre sûr
- `calculatePriceHT(quantity, unitPrice)` : Calcul HT
- `calculateVATAmount(priceHT, vatRate)` : Calcul TVA
- `calculatePriceTTC(priceHT, vatAmount)` : Calcul TTC
- `calculateSectionSubTotal(lines)` : Sous-total section
- `calculateGlobalTotals(sections)` : Totaux globaux
- `calculateVATBreakdown(sections)` : Répartition TVA par taux

---

## 🎣 Hooks personnalisés

### 1. useQuoteEditor

**Fichier** : `hooks/useQuoteEditor.ts`

**Responsabilités** :
- Gestion de l'état des données
- Historique Undo/Redo (50 états max)
- Auto-save avec debounce (1 seconde)
- Validation des changements
- Raccourcis clavier (Ctrl+Z, Ctrl+Y, Ctrl+S)

**API** :
```typescript
const {
  data,              // Données actuelles
  updateData,        // Mettre à jour les données
  saveData,          // Sauvegarder
  saveState,         // État de sauvegarde
  canUndo,           // Peut annuler
  canRedo,           // Peut refaire
  undo,              // Annuler
  redo,              // Refaire
  editingState,      // État d'édition
  startEditing,      // Démarrer édition
  stopEditing        // Arrêter édition
} = useQuoteEditor(initialData, onChange, onSave, autoSave);
```

---

### 2. useColorTheme

**Fichier** : `hooks/useColorTheme.ts`

**Responsabilités** :
- Génération des variantes de couleur (hover, light, lighter, dark)
- Application des CSS variables dynamiques
- Support des couleurs grises spéciales

**Calculs** :
```typescript
// À partir de mainColor: "#009955"
{
  primary: "0, 153, 85",           // RGB
  hover: "0, 130, 72",             // -15% luminosité
  light: "216, 239, 229",          // +85% luminosité
  lighter: "234, 246, 241",        // +92% luminosité
  dark: "0, 130, 72"               // -15% luminosité
}
```

**Variables CSS injectées** :
```css
--color-primary: 0, 153, 85;
--color-primary-hover: 0, 130, 72;
--color-primary-light: 216, 239, 229;
--color-primary-lighter: 234, 246, 241;
--color-primary-dark: 0, 130, 72;
```

---

### 3. usePDFExport

**Fichier** : `hooks/usePDFExport.tsx`

Gestion de l'export PDF avec @react-pdf/renderer

---

### 4. useDragAndDrop

**Fichier** : `hooks/useDragAndDrop.ts`

Logique générique de drag & drop pour les listes

---

## 🎨 Système de thème dynamique

### Principe

Le système applique **automatiquement** la couleur de l'entreprise (`company.mainColor`) à tous les éléments de l'interface.

### Flux

```
1. Lecture de company.mainColor (#009955)
   ↓
2. Conversion HEX → RGB (0, 153, 85)
   ↓
3. Génération des variantes (hover, light, lighter, dark)
   ↓
4. Injection des CSS variables dans :root
   ↓
5. Tailwind utilise rgb(var(--color-primary))
   ↓
6. Interface colorée automatiquement
```

### Configuration Tailwind

**Fichier** : `tailwind.config.js`

```javascript
colors: {
  primary: {
    DEFAULT: 'rgb(var(--color-primary, 0 153 85))',
    hover: 'rgb(var(--color-primary-hover, 0 122 68))',
    light: 'rgb(var(--color-primary-light, 230 245 238))',
    lighter: 'rgb(var(--color-primary-lighter, 240 250 245))',
    dark: 'rgb(var(--color-primary-dark, 0 122 68))',
  }
}
```

Les **fallbacks** (0 153 85) sont utilisés uniquement si le JavaScript ne s'exécute pas.

### Application dans les composants

```tsx
// Automatic via Tailwind classes
<button className="tw-bg-primary tw-text-white hover:tw-bg-primary-hover">
  Bouton
</button>

// Manual via style
<div style={{ color: data.company.mainColor }}>
  Texte coloré
</div>
```

---

## 📄 Génération PDF

### Deux moteurs

#### PDF V1 (Legacy)
- Fichier : `pdf/QuotePDFDocument.tsx`
- Toutes les données sur une seule page PDF
- Simple mais limité

#### PDF V2 (Moderne)
- Fichier : `pdf-v2/PDFDocumentV2.tsx`
- Pagination automatique
- Génération page par page :
  1. **IntroductionPageGenerator** : Page d'introduction
  2. **ProgrammePageGenerator** : Programme de voyage
  3. **CotationPageGenerator** : Cotation détaillée
  4. **ConditionsPageGenerator** : Conditions générales
  5. **SignaturePageGenerator** : Bon de commande

### Architecture PDF V2

```
PDFDocumentV2
├── usePDFGeneratorV2 (hook)
├── tabMapper (mapping onglets → générateurs)
├── paginationManager (gestion des pages)
└── generators/
    ├── IntroductionPageGenerator
    ├── ProgrammePageGenerator
    ├── CotationPageGenerator
    ├── ConditionsPageGenerator
    └── SignaturePageGenerator
```

### Utilisation

```typescript
// Dans App.tsx
const quoteEditorRef = useRef<QuoteEditorHandle>(null);

// Export PDF
await quoteEditorRef.current?.exportToPDF();
```

---

## 🔄 Flux de données

### Diagramme

```
App.tsx (Parent)
    │
    ├─ initialData (QuoteData)
    ├─ onChange(newData)
    └─ onSave(data)
    │
    ▼
QuoteEditor
    │
    ├─ useQuoteEditor(initialData, onChange, onSave)
    │   │
    │   ├─ State: currentData
    │   ├─ History: [states...]
    │   └─ updateData(newData)
    │
    ▼
QuotePage / QuoteTabs
    │
    ├─ Reçoit: data, onUpdateData
    │
    ▼
Composants enfants (QuoteSection, OptionBlock, etc.)
    │
    ├─ Reçoit: data, onUpdate
    ├─ Modifie localement
    └─ Remonte: onUpdate(modifiedData)
    │
    ▼
useQuoteEditor.updateData
    │
    ├─ Ajoute à l'historique
    ├─ Déclenche onChange (vers parent)
    └─ Auto-save (si activé)
```

### Immutabilité

**Principe** : Les données ne sont **jamais mutées directement**. On crée toujours de nouvelles copies.

**Exemple** :
```typescript
// ❌ MAUVAIS - Mutation directe
data.sections[0].lines[0].quantity = 5;
updateData(data);

// ✅ BON - Copie immuable
const newData = {
  ...data,
  sections: data.sections.map((section, i) =>
    i === 0
      ? {
          ...section,
          lines: section.lines.map((line, j) =>
            j === 0 ? { ...line, quantity: 5 } : line
          )
        }
      : section
  )
};
updateData(newData);
```

---

## 🎯 Patterns et conventions

### 1. Composants

- **Nom** : PascalCase (ex: `QuoteEditor`)
- **Fichier** : PascalCase.tsx (ex: `QuoteEditor.tsx`)
- **Props** : Interface TypeScript stricte
- **Export** : Export nommé par défaut

### 2. Hooks

- **Nom** : camelCase avec préfixe `use` (ex: `useQuoteEditor`)
- **Fichier** : camelCase.ts (ex: `useQuoteEditor.ts`)
- **Retour** : Objet avec propriétés nommées

### 3. Utilitaires

- **Nom** : camelCase (ex: `calculatePriceHT`)
- **Fichier** : camelCase.ts (ex: `calculationUtils.ts`)
- **Pure functions** : Pas d'effets de bord

### 4. Types

- **Interfaces** : PascalCase (ex: `QuoteData`)
- **Fichier** : PascalCase.ts ou types.ts

### 5. CSS / Tailwind

- **Préfixe** : `tw-` (ex: `tw-bg-primary`)
- **Responsive** : Mobile first
- **Thème** : Utiliser `rgb(var(--color-primary))` via Tailwind

### 6. Gestion des événements

```typescript
// Handler pattern
const handleSomething = (param: Type): void => {
  // Logic here
};

// Callback pattern
<Component onChange={handleSomething} />
```

### 7. Conditional rendering

```tsx
{condition && <Component />}
{condition ? <ComponentA /> : <ComponentB />}
```

---

## 📚 Bonnes pratiques

### Performance

1. **Memoization** : Utiliser `useMemo` et `useCallback` pour les calculs coûteux
2. **Lazy loading** : Import dynamique des composants lourds
3. **Virtual scrolling** : Pour les grandes listes (si nécessaire)

### Accessibilité

1. **ARIA labels** : Sur tous les éléments interactifs
2. **Keyboard navigation** : Support complet du clavier
3. **Focus management** : Gestion du focus lors des modales

### Maintenance

1. **Commentaires** : Uniquement pour la logique complexe
2. **Console logs** : Utiliser `console.log('[ComponentName]', ...)` pour le debug
3. **TypeScript strict** : Aucun `any` sauf exception justifiée
4. **Tests** : Couvrir les utilitaires et hooks critiques

---

## 🔧 Points d'extension

### Ajouter un nouveau type de bloc

1. Créer l'interface dans `entities/QuoteData.ts`
2. Ajouter le type dans `OptionBlock.type`
3. Créer le composant dans `components/OptionBlock/components/`
4. Mettre à jour `OptionBlockContent.tsx`

### Ajouter un nouvel onglet

1. Ajouter dans `TABS` de `QuoteTabs.tsx`
2. Créer le générateur dans `pdf-v2/generators/`
3. Mettre à jour `QuoteTabContent.tsx`
4. Mettre à jour `tabMapper.ts`

### Ajouter une colonne

1. Mettre à jour `ColumnDefinition` dans `entities/QuoteData.ts`
2. Ajouter la colonne dans `QuoteSection/TableHeader.tsx`
3. Ajouter la cellule dans `QuoteSection/TableRow.tsx`

---

## 🚀 Utilisation

### Mode Legacy (avec props)

```tsx
import { QuoteEditor } from './Components/QuoteEditor';

function App() {
  const [data, setData] = useState(quoteData);
  
  return (
    <QuoteEditor
      data={data}
      onChange={setData}
      onSave={async (data) => {
        await api.saveQuote(data);
      }}
      autoSave={true}
      readonly={false}
    />
  );
}
```

### Mode Standalone (avec événements)

```tsx
import { QuoteEditor } from './Components/QuoteEditor';

function App() {
  return (
    <QuoteEditor
      data={quoteData}
      locale="fr"
      theme="light"
      onEvent={(evt) => {
        if (evt.type === 'save') {
          api.saveQuote(evt.data);
        }
      }}
    />
  );
}
```

### Avec mock data

```tsx
<QuoteEditor mock={true} />
```

---

## 📖 Conclusion

**QuoteEditor** est un composant d'entreprise robuste, extensible et maintenable. Son architecture modulaire permet d'ajouter facilement de nouvelles fonctionnalités tout en préservant la qualité du code.

**Points forts** :
- Architecture claire et séparée
- Typage TypeScript strict
- Thème dynamique automatique
- Double mode Legacy/Standalone
- Export PDF paginé (V2)
- Historique Undo/Redo
- Drag & drop natif
- Calculs automatiques sécurisés

**Maintenance** :
- Code bien organisé par responsabilité
- Composants découplés et réutilisables
- Hooks testables indépendamment
- Utilitaires purs sans effets de bord

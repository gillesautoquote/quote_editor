# API Reference - QuoteEditor

## Interface principale

### QuoteEditorProps

```tsx
interface QuoteEditorProps {
  data: QuoteData;
  onChange: (data: QuoteData) => void;
  onSave?: (data: QuoteData) => Promise<void>;
  autoSave?: boolean;
  readonly?: boolean;
  className?: string;
  showToolbar?: boolean;
  toolbarActions?: string[];
  showAddSection?: boolean;
  showAddBlock?: boolean;
  showReset?: boolean;
  showTemplateSelector?: boolean;
  allowWidthControl?: boolean;
  ref?: React.Ref<QuoteEditorHandle>;
}

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

## Props détaillées

### `data: QuoteData` (requis)

Objet contenant toutes les données du devis.

**Utilisation :**
```tsx
const [quoteData, setQuoteData] = useState<QuoteData>(quoteDataMock);

<QuoteEditor data={quoteData} ... />
```

**Structure :**
- `company` : Informations de l'entreprise émettrice
- `recipient` : Informations du destinataire
- `quote` : Métadonnées du devis (numéro, version, dates...)
- `sections` : Tableaux de prestations avec lignes et totaux
- `optionBlocks` : Blocs personnalisables (inclus/exclus/notes...)
- `signatureFrame` : Encart de signature avec lignes avant/après
- `clientSignature` : Signature finale du devis
- `footer` : Informations de pied de page (légales, contact...)
- `selectDefinitions` : Définitions des sélecteurs pour les blocs

---

### `onChange: (data: QuoteData) => void` (requis)

Callback appelé à **chaque modification** des données.

**Fréquence d'appel :**
- Édition de texte (debounced)
- Ajout/suppression d'éléments (immédiat)
- Drag & drop (immédiat)
- Changement de couleur (immédiat)

**Utilisation typique :**
```tsx
const handleChange = (newData: QuoteData) => {
  setQuoteData(newData);
  
  // Optionnel : validation en temps réel
  validateQuote(newData);
  
  // Optionnel : sauvegarde locale
  localStorage.setItem('draft', JSON.stringify(newData));
};

<QuoteEditor onChange={handleChange} ... />
```

**Pattern avec historique personnalisé :**
```tsx
const [history, setHistory] = useState<QuoteData[]>([]);
const [currentIndex, setCurrentIndex] = useState(0);

const handleChange = (newData: QuoteData) => {
  // Ajouter à l'historique
  const newHistory = [...history.slice(0, currentIndex + 1), newData];
  setHistory(newHistory);
  setCurrentIndex(newHistory.length - 1);
  setQuoteData(newData);
};
```

---

### `onSave?: (data: QuoteData) => Promise<void>` (optionnel)

Callback de sauvegarde persistante asynchrone.

**Quand est-il appelé :**
- Auto-sauvegarde (si `autoSave=true`, délai 1s)
- Clic sur bouton "Sauvegarder"
- Raccourci Ctrl+S
- Avant export PDF (optionnel)

**Signature obligatoire :**
```tsx
const handleSave = async (data: QuoteData): Promise<void> => {
  // Votre logique ici
  // DOIT être async et retourner Promise<void>
  // DOIT throw en cas d'erreur
};
```

**Exemples d'implémentation :**

#### API REST
```tsx
const handleSave = async (data: QuoteData): Promise<void> => {
  const response = await fetch('/api/quotes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
  }
};
```

#### Base de données locale (IndexedDB)
```tsx
import { openDB } from 'idb';

const handleSave = async (data: QuoteData): Promise<void> => {
  const db = await openDB('QuotesDB', 1);
  await db.put('quotes', data, data.quote.number);
};
```

#### Fichier JSON (Node.js)
```tsx
const handleSave = async (data: QuoteData): Promise<void> => {
  await fetch('/api/save-quote', {
    method: 'POST',
    body: JSON.stringify({
      filename: `quote-${data.quote.number}.json`,
      data: data
    })
  });
};
```

**Gestion d'erreurs :**
```tsx
const handleSave = async (data: QuoteData): Promise<void> => {
  try {
    await myApiCall(data);
    console.log('✅ Sauvegarde réussie');
  } catch (error) {
    console.error('❌ Erreur de sauvegarde:', error);
    
    // IMPORTANT: Relancer l'erreur pour que le composant la gère
    throw error;
  }
};
```

---

### `autoSave?: boolean` (défaut: `true`)

Active/désactive la sauvegarde automatique.

**Comportement :**
- `true` : Sauvegarde automatique 1s après modification
- `false` : Sauvegarde manuelle uniquement

**Cas d'usage :**
```tsx
// Mode brouillon - pas de sauvegarde auto
<QuoteEditor autoSave={false} ... />

// Mode production - sauvegarde auto
<QuoteEditor autoSave={true} ... />

// Contrôle conditionnel
<QuoteEditor autoSave={user.permissions.autoSave} ... />
```

---

### `readonly?: boolean` (défaut: `false`)

Mode lecture seule - désactive toute édition.

**Effets :**
- Masque tous les boutons d'édition
- Désactive les événements de modification
- Masque la toolbar d'édition
- Conserve l'export PDF

**Cas d'usage :**
```tsx
// Consultation de devis validé
<QuoteEditor readonly={true} data={validatedQuote} onChange={() => {}} />

// Mode conditionnel selon permissions
<QuoteEditor readonly={!user.canEdit} ... />

// Prévisualisation avant validation
<QuoteEditor readonly={isPreviewMode} ... />
```

---

### `className?: string` (optionnel)

Classes CSS personnalisées pour le conteneur principal.

**Utilisation :**
```tsx
<QuoteEditor
  className="my-custom-quote-editor shadow-lg"
  data={quoteData}
  onChange={setQuoteData}
/>
```

---

### `showToolbar?: boolean` (défaut: `true`)

Affiche ou masque la barre d'outils (toolbar) en haut du composant.

**Utilisation :**
```tsx
// Masquer complètement la toolbar
<QuoteEditor showToolbar={false} ... />

// Afficher la toolbar (défaut)
<QuoteEditor showToolbar={true} ... />
```

---

### `toolbarActions?: string[]` (défaut: `['all']`)

Sélectionne quelles actions afficher dans la toolbar.

**Options disponibles :**
- `'all'` : Toutes les actions (défaut)
- `'save'` : Bouton Sauvegarder
- `'undo'` : Bouton Annuler
- `'redo'` : Bouton Rétablir
- `'pdf'` : Bouton Exporter PDF
- `'reset'` : Bouton Réinitialiser
- `'addSection'` : Bouton Ajouter tableau
- `'addBlock'` : Bouton Ajouter liste

**Utilisation :**
```tsx
// Afficher uniquement sauvegarde et export PDF
<QuoteEditor
  toolbarActions={['save', 'pdf']}
  data={quoteData}
  onChange={setQuoteData}
/>

// Toolbar complète avec undo/redo
<QuoteEditor
  toolbarActions={['save', 'undo', 'redo', 'pdf']}
  data={quoteData}
  onChange={setQuoteData}
/>
```

---

### `showAddSection?: boolean` (défaut: `false`)

Affiche le bouton "+ Tableau" pour ajouter de nouvelles sections.

**Utilisation :**
```tsx
// Permettre l'ajout de sections
<QuoteEditor showAddSection={true} ... />
```

---

### `showAddBlock?: boolean` (défaut: `false`)

Affiche le bouton "+ Liste" pour ajouter de nouveaux blocs d'options.

**Utilisation :**
```tsx
// Permettre l'ajout de blocs
<QuoteEditor showAddBlock={true} ... />
```

---

### `showReset?: boolean` (défaut: `false`)

Affiche le bouton "Réinitialiser" dans la toolbar.

**Utilisation :**
```tsx
// Afficher le bouton reset
<QuoteEditor showReset={true} ... />
```

---

### `showTemplateSelector?: boolean` (défaut: `false`)

Affiche le sélecteur de templates dans la toolbar.

**Utilisation :**
```tsx
// Afficher le sélecteur de templates
<QuoteEditor showTemplateSelector={true} ... />
```

---

### `allowWidthControl?: boolean` (défaut: `true`)

Permet le contrôle de la largeur des colonnes dans les blocs d'options.

**Utilisation :**
```tsx
// Désactiver les contrôles de largeur
<QuoteEditor allowWidthControl={false} ... />
```

---

### `ref?: React.Ref<QuoteEditorHandle>` (optionnel)

Référence pour accéder aux méthodes impératives du composant.

**Méthodes disponibles via ref :**
- `exportToPDF()` : Exporter le devis en PDF
- `saveData()` : Sauvegarder manuellement
- `undo()` : Annuler la dernière action
- `redo()` : Rétablir l'action annulée
- `getData()` : Récupérer les données actuelles
- `canUndo` : Booléen indiquant si undo est possible
- `canRedo` : Booléen indiquant si redo est possible

**Utilisation :**
```tsx
import { useRef } from 'react';
import type { QuoteEditorHandle } from './entities/QuoteData';

function MyComponent() {
  const editorRef = useRef<QuoteEditorHandle>(null);

  const handleExportPDF = async () => {
    if (editorRef.current) {
      await editorRef.current.exportToPDF();
    }
  };

  const handleUndo = () => {
    if (editorRef.current?.canUndo) {
      editorRef.current.undo();
    }
  };

  return (
    <>
      <button onClick={handleExportPDF}>Export PDF externe</button>
      <button onClick={handleUndo}>Undo externe</button>

      <QuoteEditor
        ref={editorRef}
        data={quoteData}
        onChange={setQuoteData}
      />
    </>
  );
}
```

## Hooks internes exposés

### usePDFExport

```tsx
import { usePDFExport } from './hooks/usePDFExport';

const { exportToPDF, generatePDFBlob } = usePDFExport();

// Export direct
await exportToPDF(quoteData);

// Génération de blob pour traitement
const blob = await generatePDFBlob(quoteData);
```

### useQuoteEditor

```tsx
import { useQuoteEditor } from './hooks/useQuoteEditor';

const {
  data,
  updateData,
  saveState,
  saveData,
  canUndo,
  canRedo,
  undo,
  redo
} = useQuoteEditor(initialData, onChange, onSave, autoSave);
```

## Types de retour

### SaveState

```tsx
interface SaveState {
  isSaving: boolean;           // Sauvegarde en cours
  lastSaved: Date | null;      // Dernière sauvegarde réussie
  hasUnsavedChanges: boolean;  // Modifications non sauvées
}
```

### EditingState

```tsx
interface EditingState {
  isEditing: boolean;    // Mode édition actif
  fieldPath: string;     // Chemin du champ en cours d'édition
  value: string;         // Valeur temporaire
}
```

## Événements clavier

| Raccourci | Action | Condition |
|-----------|--------|-----------|
| `Ctrl+Z` | Undo | `!readonly` |
| `Ctrl+Y` | Redo | `!readonly` |
| `Ctrl+S` | Save | `onSave` défini |
| `Escape` | Annuler édition | En mode édition |
| `Enter` | Valider édition | En mode édition simple |
| `Ctrl+Enter` | Valider édition | En mode édition multiline |

## Exemples avancés

### Intégration avec validation

```tsx
import { z } from 'zod';

const quoteSchema = z.object({
  quote: z.object({
    number: z.string().min(1, 'Numéro requis'),
    validUntil: z.string().refine(date => new Date(date) > new Date(), 'Date invalide')
  })
});

const [errors, setErrors] = useState<string[]>([]);

const handleChange = (data: QuoteData) => {
  setQuoteData(data);
  
  // Validation en temps réel
  const result = quoteSchema.safeParse(data);
  setErrors(result.success ? [] : result.error.errors.map(e => e.message));
};

const handleSave = async (data: QuoteData) => {
  // Validation avant sauvegarde
  const result = quoteSchema.safeParse(data);
  if (!result.success) {
    throw new Error('Données invalides: ' + result.error.errors[0].message);
  }
  
  await api.saveQuote(data);
};
```

### Intégration avec état global

```tsx
// Avec Context
const QuoteContext = createContext<{
  data: QuoteData;
  updateData: (data: QuoteData) => void;
  saveData: () => Promise<void>;
}>();

function QuoteProvider({ children }) {
  const [data, setData] = useState(quoteDataMock);
  
  const saveData = async () => {
    await api.saveQuote(data);
  };
  
  return (
    <QuoteContext.Provider value={{ data, updateData: setData, saveData }}>
      {children}
    </QuoteContext.Provider>
  );
}

function QuoteEditorPage() {
  const { data, updateData, saveData } = useContext(QuoteContext);
  
  return (
    <QuoteEditor
      data={data}
      onChange={updateData}
      onSave={saveData}
    />
  );
}
```

### Sauvegarde avec optimistic updates

```tsx
const [localData, setLocalData] = useState(quoteData);
const [serverData, setServerData] = useState(quoteData);
const [isSync, setIsSync] = useState(true);

const handleChange = (newData: QuoteData) => {
  setLocalData(newData);
  setIsSync(false); // Marquer comme non synchronisé
};

const handleSave = async (data: QuoteData) => {
  try {
    await api.saveQuote(data);
    setServerData(data);
    setIsSync(true);
  } catch (error) {
    // Rollback en cas d'erreur
    setLocalData(serverData);
    throw error;
  }
};

return (
  <>
    {!isSync && <div className="alert alert-warning">Modifications non synchronisées</div>}
    <QuoteEditor
      data={localData}
      onChange={handleChange}
      onSave={handleSave}
    />
  </>
);
```
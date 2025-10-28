# Hooks personnalisés - QuoteEditor

## 🎯 Vue d'ensemble

QuoteEditor utilise plusieurs hooks personnalisés pour encapsuler la logique métier et favoriser la réutilisabilité.

## 📋 Liste des hooks

| Hook | Responsabilité | Réutilisable |
|------|----------------|--------------|
| `useQuoteEditor` | Orchestration principale, état global | ❌ |
| `usePDFExport` | Génération et export PDF | ✅ |
| `useListManager` | Gestion listes (add/remove/reorder) | ✅ |
| `useDragAndDrop` | Drag & drop générique | ✅ |
| `useFieldPath` | Navigation dans l'arbre de données | ✅ |
| `useColorTheme` | Gestion thème couleur dynamique | ✅ |

## 🏗️ useQuoteEditor (Hook principal)

### Usage

```tsx
const {
  data,              // État actuel des données
  updateData,        // Mettre à jour les données
  editingState,      // État d'édition actuel
  startEditing,      // Démarrer l'édition d'un champ
  stopEditing,       // Arrêter l'édition
  updateEditingValue, // Mettre à jour la valeur en cours d'édition
  saveState,         // État de sauvegarde
  saveData,          // Forcer la sauvegarde
  canUndo,          // Peut annuler
  canRedo,          // Peut rétablir
  undo,             // Annuler dernière action
  redo              // Rétablir action annulée
} = useQuoteEditor(initialData, onChange, onSave, autoSave);
```

### Paramètres

```tsx
function useQuoteEditor(
  initialData: QuoteData,                        // Données initiales
  onChange: (data: QuoteData) => void,           // Callback changement
  onSave?: (data: QuoteData) => Promise<void>,   // Callback sauvegarde
  autoSave: boolean = true                       // Auto-sauvegarde activée
)
```

### Fonctionnalités

#### 1. Gestion de l'état des données

```tsx
const updateData = useCallback((newData: QuoteData, addHistory: boolean = true) => {
  setData(newData);
  onChange(newData);
  
  // Ajouter à l'historique pour undo/redo
  if (addHistory) {
    addToHistory(newData);
  }
  
  // Marquer comme non sauvé
  setSaveState(prev => ({ ...prev, hasUnsavedChanges: true }));
  
  // Programmer auto-sauvegarde
  if (autoSave && onSave) {
    scheduleAutoSave();
  }
}, [onChange, addToHistory, autoSave, onSave]);
```

#### 2. Historique undo/redo

```tsx
// Structure de l'historique
interface HistoryState {
  data: QuoteData;
  timestamp: number;
}

const historyRef = useRef<HistoryState[]>([{ data: initialData, timestamp: Date.now() }]);
const historyIndexRef = useRef<number>(0);

const undo = useCallback(() => {
  if (historyIndexRef.current > 0) {
    historyIndexRef.current -= 1;
    const prevData = historyRef.current[historyIndexRef.current].data;
    setData(prevData);
    onChange(prevData);
    updateHistoryStates();
  }
}, [onChange, updateHistoryStates]);

const redo = useCallback(() => {
  if (historyIndexRef.current < historyRef.current.length - 1) {
    historyIndexRef.current += 1;
    const nextData = historyRef.current[historyIndexRef.current].data;
    setData(nextData);
    onChange(nextData);
    updateHistoryStates();
  }
}, [onChange, updateHistoryStates]);
```

#### 3. Auto-sauvegarde avec debounce

```tsx
const autoSaveTimerRef = useRef<NodeJS.Timeout>();

const scheduleAutoSave = useCallback(() => {
  if (autoSaveTimerRef.current) {
    clearTimeout(autoSaveTimerRef.current);
  }
  
  autoSaveTimerRef.current = setTimeout(() => {
    saveData();
  }, 1000); // Délai de 1 seconde
}, [saveData]);
```

#### 4. Raccourcis clavier

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      undo();
    } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault();
      redo();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      saveData();
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [undo, redo, saveData]);
```

## 📄 usePDFExport

### Usage

```tsx
const { exportToPDF, generatePDFBlob, isExporting } = usePDFExport();

// Export direct
await exportToPDF(quoteData);

// Génération de blob pour traitement personnalisé
const blob = await generatePDFBlob(quoteData);
```

### Interface

```tsx
interface PDFExportResult {
  exportToPDF: (data: QuoteData) => Promise<void>;
  generatePDFBlob: (data: QuoteData) => Promise<Blob>;
  isExporting: boolean;
}
```

### Implémentation

```tsx
export const usePDFExport = (): PDFExportResult => {
  const [isExporting, setIsExporting] = useState(false);

  const generatePDFBlob = useCallback(async (data: QuoteData): Promise<Blob> => {
    try {
      setIsExporting(true);
      const doc = <QuotePDFDocument data={data} />;
      return await pdf(doc).toBlob();
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      throw new Error('Impossible de générer le PDF');
    } finally {
      setIsExporting(false);
    }
  }, []);

  const exportToPDF = useCallback(async (data: QuoteData): Promise<void> => {
    try {
      const blob = await generatePDFBlob(data);
      
      // Téléchargement automatique
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `devis-${data.quote.number}-${data.quote.version}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Erreur export PDF:', error);
      throw error;
    }
  }, [generatePDFBlob]);

  return { exportToPDF, generatePDFBlob, isExporting };
};
```

## 📝 useListManager

Hook générique pour la gestion de listes avec add/remove/reorder.

### Usage

```tsx
const listManager = useListManager(items, onUpdate);

// Ajouter un élément
listManager.addItem(newItem);

// Supprimer un élément
listManager.removeItem(index);

// Réorganiser
listManager.reorderItems(fromIndex, toIndex);

// Mettre à jour un élément
listManager.updateItem(index, updatedItem);
```

### Interface

```tsx
interface ListManagerHandlers<T> {
  addItem: (newItem: T) => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, updatedItem: T) => void;
  reorderItems: (fromIndex: number, toIndex: number) => void;
}

function useListManager<T>(
  items: T[],
  onUpdate: (newItems: T[]) => void
): ListManagerHandlers<T>
```

### Implémentation

```tsx
export const useListManager = <T>(
  items: T[],
  onUpdate: (newItems: T[]) => void
): ListManagerHandlers<T> => {
  
  const addItem = useCallback((newItem: T) => {
    const newItems = [...items, newItem];
    onUpdate(newItems);
  }, [items, onUpdate]);

  const removeItem = useCallback((index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onUpdate(newItems);
  }, [items, onUpdate]);

  const updateItem = useCallback((index: number, updatedItem: T) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    onUpdate(newItems);
  }, [items, onUpdate]);

  const reorderItems = useCallback((fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const [draggedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, draggedItem);
    onUpdate(newItems);
  }, [items, onUpdate]);

  return { addItem, removeItem, updateItem, reorderItems };
};
```

### Exemple d'utilisation

```tsx
// Gestion des lignes d'une section
const lineManager = useListManager(section.lines, (newLines) => {
  onUpdateSection({ ...section, lines: newLines });
});

// Ajouter une ligne
const handleAddLine = () => {
  const newLine: QuoteLine = {
    date: new Date().toISOString().split('T')[0],
    description: 'Nouvelle prestation',
    // ... autres propriétés
  };
  lineManager.addItem(newLine);
};

// Supprimer une ligne
const handleRemoveLine = (index: number) => {
  lineManager.removeItem(index);
};
```

## 🎯 useDragAndDrop

Hook générique pour gérer le drag & drop.

### Usage

```tsx
const { 
  handleDragStart, 
  handleDragEnd, 
  handleDragOver, 
  handleDragLeave, 
  handleDrop 
} = useDragAndDrop(enabled);

// Sur l'élément draggable
<div
  draggable={true}
  onDragStart={(e) => handleDragStart(e, index, 'row')}
  onDragEnd={handleDragEnd}
>
  Contenu draggable
</div>

// Sur la zone de drop
<div
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onDrop={(e) => handleDrop(e, dropIndex, onReorder)}
>
  Zone de drop
</div>
```

### Interface

```tsx
interface DragDropHandlers {
  handleDragStart: (e: React.DragEvent, index: number, type: string, data?: any) => void;
  handleDragEnd: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, dropIndex: number, onReorder: (from: number, to: number) => void) => void;
}
```

## 🛣️ useFieldPath

Hook pour naviguer dans l'arbre de données avec notation pointée.

### Usage

```tsx
const { getValueByPath, setValueByPath } = useFieldPath();

// Lire une valeur
const companyName = getValueByPath(quoteData, 'company.name');

// Modifier une valeur
const updatedData = setValueByPath(quoteData, 'company.name', 'Nouveau nom');
```

### Interface

```tsx
interface FieldPathHandlers {
  getValueByPath: (data: QuoteData, path: string) => string;
  setValueByPath: (data: QuoteData, path: string, newValue: string) => QuoteData;
}
```

### Exemples de chemins

```tsx
// Propriétés simples
'company.name'
'recipient.fullName'
'quote.number'

// Arrays (supporté en notation pointée simple)
'sections.0.title'
'optionBlocks.1.title'

// Imbrication complexe
'footer.copyright'
'clientSignature.fullName'
```

## 🎨 useColorTheme

Hook pour gérer le thème de couleur dynamique.

### Usage

```tsx
const { colorVariables, applyColorVariables, mainColor } = useColorTheme(company);

// Appliquer les couleurs
useEffect(() => {
  applyColorVariables();
}, [company.mainColor]);

// Utiliser dans un style
const customStyle = {
  borderColor: colorVariables['--dynamic-primary-color']
};
```

### Interface

```tsx
interface ColorThemeResult {
  colorVariables: Record<string, string>;
  applyColorVariables: (element?: HTMLElement) => void;
  mainColor: string;
}
```

### Variables générées

```tsx
const colorVariables = {
  '--dynamic-primary-color': '#0066cc',
  '--dynamic-primary-contrast': 'white',
  '--dynamic-primary-light': 'rgba(0, 102, 204, 0.1)',
  '--dynamic-primary-lighter': 'rgba(0, 102, 204, 0.05)',
  '--dynamic-primary-dark': '#004499',
  '--dynamic-primary-rgb': '0, 102, 204'
};
```

## 🔧 Hooks d'utilité

### useDebounce

```tsx
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Usage
const debouncedSearchTerm = useDebounce(searchTerm, 300);
```

### usePrevious

```tsx
const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

// Usage - détecter les changements
const prevData = usePrevious(quoteData);
useEffect(() => {
  if (prevData && prevData !== quoteData) {
    console.log('Les données ont changé');
  }
}, [quoteData, prevData]);
```

### useLocalStorage

```tsx
const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
};

// Usage - sauvegarder l'état local
const [draftQuote, setDraftQuote] = useLocalStorage('quote_draft', quoteDataMock);
```

## 🎯 Composition de hooks

Les hooks peuvent être combinés pour des fonctionnalités complexes :

```tsx
// Hook composite pour une ligne de tableau avec debounce
const useTableRow = (initialLine: QuoteLine, onUpdate: (line: QuoteLine) => void) => {
  const [line, setLine] = useState(initialLine);
  const debouncedLine = useDebounce(line, 500);
  
  useEffect(() => {
    if (debouncedLine !== initialLine) {
      onUpdate(debouncedLine);
    }
  }, [debouncedLine, onUpdate]);
  
  const updateField = (field: keyof QuoteLine, value: any) => {
    setLine(prev => ({ ...prev, [field]: value }));
  };
  
  return { line, updateField };
};

// Hook pour la gestion complète d'une section
const useQuoteSection = (section: QuoteSection, onUpdateSection: (section: QuoteSection) => void) => {
  const lineManager = useListManager(section.lines, (lines) => {
    const newSection = { ...section, lines };
    newSection.subTotal = calculateSubTotal(lines);
    onUpdateSection(newSection);
  });
  
  const dragHandlers = useDragAndDrop(true);
  
  return {
    ...lineManager,
    ...dragHandlers,
    section
  };
};
```
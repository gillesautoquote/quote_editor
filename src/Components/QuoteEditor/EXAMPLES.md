# Exemples d'intégration - QuoteEditor

## 🎯 Exemples de base

### 1. Intégration simple

```tsx
import React, { useState } from 'react';
import { QuoteEditor } from './Components/QuoteEditor/QuoteEditor';
import { quoteDataMock } from './Components/QuoteEditor/mocks/quoteDataMock';

function SimpleExample() {
  const [quoteData, setQuoteData] = useState(quoteDataMock);

  return (
    <div className="container-fluid">
      <QuoteEditor
        data={quoteData}
        onChange={setQuoteData}
        readonly={false}
      />
    </div>
  );
}
```

### 2. Avec sauvegarde API

```tsx
import React, { useState, useEffect } from 'react';
import { QuoteEditor } from './Components/QuoteEditor/QuoteEditor';
import type { QuoteData } from './Components/QuoteEditor/entities/QuoteData';

function ApiExample() {
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données depuis l'API
  useEffect(() => {
    const loadQuote = async () => {
      try {
        const response = await fetch('/api/quotes/latest');
        const data = await response.json();
        setQuoteData(data);
      } catch (err) {
        setError('Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    loadQuote();
  }, []);

  // Sauvegarder via API
  const handleSave = async (data: QuoteData): Promise<void> => {
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      console.log('✅ Devis sauvegardé');
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      throw error; // Important pour que le composant gère l'erreur
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!quoteData) return <div>Aucune donnée</div>;

  return (
    <QuoteEditor
      data={quoteData}
      onChange={setQuoteData}
      onSave={handleSave}
      autoSave={true}
    />
  );
}
```

## 🔧 Intégrations avancées

### 3. Avec React Hook Form

```tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { QuoteEditor } from './Components/QuoteEditor/QuoteEditor';
import { quoteDataMock } from './Components/QuoteEditor/mocks/quoteDataMock';

interface FormData {
  quote: QuoteData;
  approvalDate: string;
  comments: string;
}

function FormExample() {
  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      quote: quoteDataMock,
      approvalDate: '',
      comments: ''
    }
  });

  const currentQuote = watch('quote');

  const onSubmit = async (data: FormData) => {
    try {
      console.log('Soumission du formulaire:', data);
      
      // Valider le devis
      await validateQuote(data.quote);
      
      // Sauvegarder avec métadonnées
      await fetch('/api/quotes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      alert('Devis validé avec succès !');
    } catch (error) {
      console.error('Erreur validation:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-lg-9">
          <Controller
            name="quote"
            control={control}
            rules={{
              validate: {
                hasLines: (quote) => 
                  quote.sections.some(s => s.lines.length > 0) || 
                  'Au moins une ligne de prestation requise',
                validTotal: (quote) => 
                  quote.totals.ttc > 0 || 
                  'Le total doit être supérieur à 0'
              }
            }}
            render={({ field }) => (
              <QuoteEditor
                data={field.value}
                onChange={field.onChange}
                autoSave={false} // Pas d'auto-save dans un formulaire
              />
            )}
          />
          {errors.quote && (
            <div className="alert alert-danger mt-2">
              {errors.quote.message}
            </div>
          )}
        </div>
        
        <div className="col-lg-3">
          <div className="card">
            <div className="card-header">
              <h5>Validation</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Date d'approbation</label>
                <Controller
                  name="approvalDate"
                  control={control}
                  rules={{ required: 'Date requise' }}
                  render={({ field }) => (
                    <input
                      type="date"
                      className="form-control"
                      {...field}
                    />
                  )}
                />
                {errors.approvalDate && (
                  <div className="text-danger small">
                    {errors.approvalDate.message}
                  </div>
                )}
              </div>
              
              <div className="mb-3">
                <label className="form-label">Commentaires</label>
                <Controller
                  name="comments"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      className="form-control"
                      rows={3}
                      {...field}
                    />
                  )}
                />
              </div>
              
              <div className="mb-3">
                <strong>Total TTC: {currentQuote.totals.ttc.toFixed(2)} €</strong>
              </div>
              
              <button type="submit" className="btn btn-primary w-100">
                Valider le devis
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
```

### 4. Avec Redux Toolkit

```tsx
// store/quoteSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { QuoteData } from '../Components/QuoteEditor/entities/QuoteData';

interface QuoteState {
  data: QuoteData | null;
  loading: boolean;
  error: string | null;
  lastSaved: string | null;
  isDirty: boolean;
}

const initialState: QuoteState = {
  data: null,
  loading: false,
  error: null,
  lastSaved: null,
  isDirty: false
};

// Actions asynchrones
export const loadQuote = createAsyncThunk(
  'quote/load',
  async (quoteId: string) => {
    const response = await fetch(`/api/quotes/${quoteId}`);
    return response.json();
  }
);

export const saveQuote = createAsyncThunk(
  'quote/save',
  async (data: QuoteData) => {
    const response = await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
);

const quoteSlice = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    updateQuote: (state, action: PayloadAction<QuoteData>) => {
      state.data = action.payload;
      state.isDirty = true;
    },
    resetDirty: (state) => {
      state.isDirty = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadQuote.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadQuote.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.isDirty = false;
      })
      .addCase(saveQuote.fulfilled, (state) => {
        state.lastSaved = new Date().toISOString();
        state.isDirty = false;
      });
  }
});

export const { updateQuote, resetDirty } = quoteSlice.actions;
export default quoteSlice.reducer;

// Composant connecté
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { QuoteEditor } from './Components/QuoteEditor/QuoteEditor';

function ReduxExample() {
  const dispatch = useDispatch();
  const { data, loading, error, isDirty } = useSelector((state: RootState) => state.quote);

  useEffect(() => {
    dispatch(loadQuote('latest'));
  }, [dispatch]);

  const handleChange = (newData: QuoteData) => {
    dispatch(updateQuote(newData));
  };

  const handleSave = async (data: QuoteData) => {
    await dispatch(saveQuote(data)).unwrap();
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!data) return <div>Aucune donnée</div>;

  return (
    <>
      {isDirty && (
        <div className="alert alert-warning">
          ⚠️ Modifications non sauvegardées
        </div>
      )}
      <QuoteEditor
        data={data}
        onChange={handleChange}
        onSave={handleSave}
        autoSave={false} // Redux gère la sauvegarde
      />
    </>
  );
}
```

### 5. Avec Context API

```tsx
// contexts/QuoteContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { QuoteData } from '../Components/QuoteEditor/entities/QuoteData';

interface QuoteState {
  data: QuoteData | null;
  history: QuoteData[];
  historyIndex: number;
  isLoading: boolean;
  error: string | null;
}

type QuoteAction = 
  | { type: 'SET_DATA'; payload: QuoteData }
  | { type: 'ADD_TO_HISTORY'; payload: QuoteData }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const quoteReducer = (state: QuoteState, action: QuoteAction): QuoteState => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    
    case 'ADD_TO_HISTORY':
      const newHistory = [...state.history.slice(0, state.historyIndex + 1), action.payload];
      return {
        ...state,
        data: action.payload,
        history: newHistory.slice(-50), // Limiter à 50 éléments
        historyIndex: Math.min(newHistory.length - 1, 49)
      };
    
    case 'UNDO':
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        return {
          ...state,
          data: state.history[newIndex],
          historyIndex: newIndex
        };
      }
      return state;
    
    case 'REDO':
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        return {
          ...state,
          data: state.history[newIndex],
          historyIndex: newIndex
        };
      }
      return state;
    
    default:
      return state;
  }
};

interface QuoteContextValue extends QuoteState {
  updateData: (data: QuoteData) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  saveData: () => Promise<void>;
}

const QuoteContext = createContext<QuoteContextValue | undefined>(undefined);

export const QuoteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(quoteReducer, {
    data: null,
    history: [],
    historyIndex: -1,
    isLoading: false,
    error: null
  });

  const updateData = (data: QuoteData) => {
    dispatch({ type: 'ADD_TO_HISTORY', payload: data });
  };

  const undo = () => dispatch({ type: 'UNDO' });
  const redo = () => dispatch({ type: 'REDO' });

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  const saveData = async () => {
    if (!state.data) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await fetch('/api/quotes/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state.data)
      });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erreur de sauvegarde' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <QuoteContext.Provider value={{
      ...state,
      updateData,
      undo,
      redo,
      canUndo,
      canRedo,
      saveData
    }}>
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuote = () => {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote must be used within QuoteProvider');
  }
  return context;
};

// Utilisation
function ContextExample() {
  const { data, updateData, saveData, error } = useQuote();

  if (!data) return <div>Chargement...</div>;

  return (
    <>
      {error && <div className="alert alert-danger">{error}</div>}
      <QuoteEditor
        data={data}
        onChange={updateData}
        onSave={saveData}
      />
    </>
  );
}
```

## 💾 Exemples de sauvegarde

### 6. Sauvegarde IndexedDB

```tsx
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface QuoteDB extends DBSchema {
  quotes: {
    key: string;
    value: QuoteData & { lastModified: number };
  };
}

class QuoteStorage {
  private db: IDBPDatabase<QuoteDB> | null = null;

  async init() {
    this.db = await openDB<QuoteDB>('QuoteDB', 1, {
      upgrade(db) {
        db.createObjectStore('quotes');
      },
    });
  }

  async save(data: QuoteData): Promise<void> {
    if (!this.db) await this.init();
    
    await this.db!.put('quotes', {
      ...data,
      lastModified: Date.now()
    }, data.quote.number);
  }

  async load(quoteNumber: string): Promise<QuoteData | null> {
    if (!this.db) await this.init();
    
    const result = await this.db!.get('quotes', quoteNumber);
    if (result) {
      const { lastModified, ...quoteData } = result;
      return quoteData;
    }
    return null;
  }

  async list(): Promise<Array<{ number: string; lastModified: number }>> {
    if (!this.db) await this.init();
    
    const keys = await this.db!.getAllKeys('quotes');
    const results = [];
    
    for (const key of keys) {
      const data = await this.db!.get('quotes', key);
      if (data) {
        results.push({
          number: data.quote.number,
          lastModified: data.lastModified
        });
      }
    }
    
    return results.sort((a, b) => b.lastModified - a.lastModified);
  }
}

// Utilisation
function IndexedDBExample() {
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const storage = useRef(new QuoteStorage());

  useEffect(() => {
    const loadLatest = async () => {
      const quotes = await storage.current.list();
      if (quotes.length > 0) {
        const latest = await storage.current.load(quotes[0].number);
        if (latest) setQuoteData(latest);
      }
    };
    
    loadLatest();
  }, []);

  const handleSave = async (data: QuoteData) => {
    await storage.current.save(data);
    console.log('✅ Sauvegardé en local');
  };

  if (!quoteData) return <div>Chargement...</div>;

  return (
    <QuoteEditor
      data={quoteData}
      onChange={setQuoteData}
      onSave={handleSave}
    />
  );
}
```

### 7. Auto-sauvegarde avec optimistic updates

```tsx
function OptimisticExample() {
  const [localData, setLocalData] = useState(quoteDataMock);
  const [serverData, setServerData] = useState(quoteDataMock);
  const [isSynced, setIsSynced] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleChange = (newData: QuoteData) => {
    setLocalData(newData);
    setIsSynced(false);
    setSaveError(null);
  };

  const handleSave = async (data: QuoteData): Promise<void> => {
    try {
      // Optimistic update
      setServerData(data);
      setIsSynced(true);
      
      // Vraie sauvegarde
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Erreur serveur');
      }
      
      console.log('✅ Synchronisé avec le serveur');
    } catch (error) {
      // Rollback en cas d'erreur
      setLocalData(serverData);
      setIsSynced(false);
      setSaveError('Erreur de synchronisation');
      throw error;
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <span className={`badge ${isSynced ? 'bg-success' : 'bg-warning'}`}>
            {isSynced ? '✅ Synchronisé' : '⚠️ Non synchronisé'}
          </span>
          {saveError && (
            <span className="badge bg-danger ms-2">{saveError}</span>
          )}
        </div>
        
        {!isSynced && (
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleSave(localData)}
          >
            Synchroniser maintenant
          </button>
        )}
      </div>
      
      <QuoteEditor
        data={localData}
        onChange={handleChange}
        onSave={handleSave}
        autoSave={true}
      />
    </>
  );
}
```

## 🔧 Personnalisations avancées

### 8. Mode multi-langues

```tsx
interface Translations {
  [key: string]: {
    [field: string]: string;
  };
}

const translations: Translations = {
  fr: {
    'quote.title': 'Devis',
    'quote.number': 'Numéro',
    'quote.date': 'Date',
    'recipient.title': 'DESTINATAIRE',
    'total.ht': 'Total HT',
    'total.ttc': 'Total TTC'
  },
  en: {
    'quote.title': 'Quote',
    'quote.number': 'Number',
    'quote.date': 'Date',
    'recipient.title': 'RECIPIENT',
    'total.ht': 'Total excl. VAT',
    'total.ttc': 'Total incl. VAT'
  }
};

const TranslationContext = createContext<{
  language: string;
  t: (key: string) => string;
  setLanguage: (lang: string) => void;
}>({
  language: 'fr',
  t: (key) => key,
  setLanguage: () => {}
});

function MultiLanguageExample() {
  const [language, setLanguage] = useState('fr');
  const [quoteData, setQuoteData] = useState(quoteDataMock);

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  // Adapter les données selon la langue
  const adaptedData = useMemo(() => {
    return {
      ...quoteData,
      // Adapter les titres de colonnes selon la langue
      sections: quoteData.sections.map(section => ({
        ...section,
        columns: section.columns ? {
          ...section.columns,
          description: { ...section.columns.description, title: t('column.description') },
          priceHT: { ...section.columns.priceHT, title: t('column.priceHT') },
          priceTTC: { ...section.columns.priceTTC, title: t('column.priceTTC') }
        } : undefined
      }))
    };
  }, [quoteData, language]);

  return (
    <TranslationContext.Provider value={{ language, t, setLanguage }}>
      <div className="mb-3">
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="form-select w-auto"
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
      </div>
      
      <QuoteEditor
        data={adaptedData}
        onChange={setQuoteData}
      />
    </TranslationContext.Provider>
  );
}
```

### 9. Mode collaboratif (WebSockets)

```tsx
function CollaborativeExample() {
  const [quoteData, setQuoteData] = useState(quoteDataMock);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const quoteId = 'quote-123';

  useEffect(() => {
    // Connexion WebSocket
    ws.current = new WebSocket(`ws://localhost:8080/quotes/${quoteId}`);
    
    ws.current.onopen = () => {
      setIsConnected(true);
      console.log('✅ Connecté au mode collaboratif');
    };
    
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'quote_updated':
          // Mise à jour reçue d'un autre utilisateur
          setQuoteData(message.data);
          break;
          
        case 'users_list':
          setConnectedUsers(message.users);
          break;
          
        case 'user_cursor':
          // Afficher le curseur d'un autre utilisateur
          showUserCursor(message.userId, message.fieldPath);
          break;
      }
    };
    
    ws.current.onclose = () => {
      setIsConnected(false);
      console.log('❌ Déconnecté du mode collaboratif');
    };
    
    return () => {
      ws.current?.close();
    };
  }, [quoteId]);

  const handleChange = (newData: QuoteData) => {
    // Mise à jour locale immédiate
    setQuoteData(newData);
    
    // Diffuser aux autres utilisateurs
    if (ws.current && isConnected) {
      ws.current.send(JSON.stringify({
        type: 'update_quote',
        data: newData,
        timestamp: Date.now()
      }));
    }
  };

  const handleSave = async (data: QuoteData) => {
    // Sauvegarder sur le serveur
    await fetch(`/api/quotes/${quoteId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    // Notifier la sauvegarde
    if (ws.current && isConnected) {
      ws.current.send(JSON.stringify({
        type: 'quote_saved',
        timestamp: Date.now()
      }));
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <span className={`badge ${isConnected ? 'bg-success' : 'bg-secondary'}`}>
            {isConnected ? '🟢 Collaboratif actif' : '🔴 Mode hors ligne'}
          </span>
          {connectedUsers.length > 0 && (
            <span className="ms-2">
              👥 {connectedUsers.length} utilisateur(s) connecté(s)
            </span>
          )}
        </div>
      </div>
      
      <QuoteEditor
        data={quoteData}
        onChange={handleChange}
        onSave={handleSave}
        autoSave={isConnected} // Auto-save seulement si connecté
      />
    </>
  );
}
```

## 📱 Exemples responsive

### 10. Interface adaptative mobile

```tsx
function ResponsiveExample() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [quoteData, setQuoteData] = useState(quoteDataMock);
  const [showPreview, setShowPreview] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setShowPreview(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="mobile-quote-editor">
        <div className="mobile-tabs">
          <button 
            className={`btn ${!showPreview ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setShowPreview(false)}
          >
            ✏️ Édition
          </button>
          <button 
            className={`btn ${showPreview ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setShowPreview(true)}
          >
            👁️ Aperçu
          </button>
        </div>
        
        {showPreview ? (
          <QuoteEditor
            data={quoteData}
            onChange={() => {}} // Pas de modification en aperçu
            readonly={true}
          />
        ) : (
          <QuoteEditor
            data={quoteData}
            onChange={setQuoteData}
            autoSave={true}
          />
        )}
      </div>
    );
  }

  // Desktop - vue normale
  return (
    <QuoteEditor
      data={quoteData}
      onChange={setQuoteData}
      autoSave={true}
    />
  );
}
```

Ces exemples montrent la flexibilité du composant QuoteEditor et comment l'intégrer dans différents contextes d'application.
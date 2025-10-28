# 🔧 Exemples d'intégration QuoteEditor

## ✅ Version TypeScript stricte (recommandée)

```tsx
import React, { useState, useRef, forwardRef } from 'react';
import { QuoteEditor } from '~/Components/QuoteEditor';
import type { QuoteData, QuoteEditorHandle } from '~/Components/QuoteEditor/entities/QuoteData';

interface DevisPdfViewerProps {
  voyageUuid: string;
  readonly?: boolean;
  onSaveComplete?: (data: QuoteData) => void;
}

function DevisPdfViewerBase(props: DevisPdfViewerProps, ref: React.Ref<QuoteEditorHandle>) {
  const { voyageUuid, readonly = false, onSaveComplete } = props;
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const editorRef = useRef<QuoteEditorHandle>(null);

  // Expose les méthodes de l'éditeur
  React.useImperativeHandle(ref, () => ({
    exportToPDF: () => editorRef.current?.exportToPDF() || Promise.resolve(),
    saveData: () => editorRef.current?.saveData() || Promise.resolve(),
    undo: () => editorRef.current?.undo(),
    redo: () => editorRef.current?.redo(),
    getData: () => editorRef.current?.getData() || quoteData!,
    canUndo: editorRef.current?.canUndo || false,
    canRedo: editorRef.current?.canRedo || false,
  }));

  // Charger les données au montage
  React.useEffect(() => {
    const loadQuoteData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/quotes/${voyageUuid}`);
        const data = await response.json();
        setQuoteData(data);
      } catch (error) {
        console.error('Error loading quote:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuoteData();
  }, [voyageUuid]);

  const handleSave = async (data: QuoteData) => {
    try {
      await fetch(`/api/quotes/${voyageUuid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      onSaveComplete?.(data);
      console.log('Quote saved successfully');
    } catch (error) {
      console.error('Save error:', error);
      throw error;
    }
  };

  const handleChange = (data: QuoteData) => {
    setQuoteData(data);
  };

  if (isLoading) {
    return <div className="p-4 text-center">Chargement du devis...</div>;
  }

  if (!quoteData) {
    return <div className="p-4 text-center text-danger">Erreur de chargement</div>;
  }

  return (
    <QuoteEditor
      ref={editorRef}
      data={quoteData}
      onChange={handleChange}
      onSave={handleSave}
      autoSave={!readonly}
      readonly={readonly}
      showToolbar={true}
      showAddSection={!readonly}
      showAddBlock={!readonly}
    />
  );
}

export const DevisPdfViewer = forwardRef(DevisPdfViewerBase);

// ✅ Version ULTRA-simple si problèmes persistent
export function DevisPdfViewerBasic({ voyageUuid, readonly = false }: any) {
  const [quoteData, setQuoteData] = useState(null);
  
  const handleSave = async (data: any) => {
    console.log('Saving quote:', data);
  };

  return (
    // @ts-ignore
    <QuoteEditor 
      data={quoteData}
      onChange={setQuoteData}
      onSave={handleSave}
      autoSave={!readonly}
      readonly={readonly}
    />
  );
}
```

## 🎯 Version encore plus simple (sans TypeScript strict)

```tsx
import React, { useState, useRef, forwardRef } from 'react';
import { QuoteEditor } from '~/Components/QuoteEditor';

function DevisPdfViewerSimple(props: any, ref: any) {
  const [quoteData, setQuoteData] = useState(null);
  const editorRef = useRef(null);

  React.useImperativeHandle(ref, () => editorRef.current);

  const handleSave = async (data: any) => {
    // Votre logique
    console.log('Saving:', data);
  };

  return (
    <QuoteEditor 
      ref={editorRef}
      data={quoteData}
      onChange={setQuoteData}
      onSave={handleSave}
      autoSave={true}
      readonly={false}
    />
  );
}

export const DevisPdfViewer = forwardRef(DevisPdfViewerSimple);
```

## 🔄 Désactiver TypeScript strict temporairement

Si les erreurs persistent, ajoutez ces commentaires :

```tsx
// @ts-ignore
import { QuoteEditor } from '~/Components/QuoteEditor';

// Ou pour une ligne spécifique :
<QuoteEditor
  // @ts-ignore
  ref={editorRef}
  data={quoteData}
  onChange={setQuoteData}
/>
```

## 🎨 Prop spreading pour éviter les conflits

```tsx
const quoteProps = {
  data: quoteData,
  onChange: setQuoteData,
  onSave: handleSave,
  autoSave: !readonly,
  readonly
} as any;

return <QuoteEditor ref={editorRef} {...quoteProps} />;
```

## 🎛️ Utilisation des props avancées

### Configuration complète avec toutes les props

```tsx
import React, { useState } from 'react';
import { QuoteEditor } from '~/Components/QuoteEditor';
import type { QuoteData } from '~/Components/QuoteEditor/entities/QuoteData';

function AdvancedQuoteEditor() {
  const [quoteData, setQuoteData] = useState<QuoteData>(initialData);
  const [userRole, setUserRole] = useState<'admin' | 'editor' | 'viewer'>('editor');

  const handleSave = async (data: QuoteData) => {
    await fetch('/api/quotes', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  // Configuration selon le rôle utilisateur
  const editorConfig = {
    readonly: userRole === 'viewer',
    showAddSection: userRole === 'admin',
    showAddBlock: userRole === 'admin',
    showReset: userRole === 'admin',
    showTemplateSelector: userRole !== 'viewer',
    toolbarActions: userRole === 'admin'
      ? ['all']
      : userRole === 'editor'
      ? ['save', 'undo', 'redo', 'pdf']
      : ['pdf'],
    allowWidthControl: userRole !== 'viewer',
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-3">
        <label>Rôle utilisateur:</label>
        <select
          value={userRole}
          onChange={(e) => setUserRole(e.target.value as any)}
          className="form-select w-auto"
        >
          <option value="admin">Administrateur</option>
          <option value="editor">Éditeur</option>
          <option value="viewer">Lecteur</option>
        </select>
      </div>

      <QuoteEditor
        data={quoteData}
        onChange={setQuoteData}
        onSave={handleSave}
        autoSave={true}
        className="shadow-lg rounded"
        showToolbar={true}
        {...editorConfig}
      />
    </div>
  );
}
```

### Utilisation avec ref pour contrôle externe

```tsx
import React, { useRef, useState } from 'react';
import { QuoteEditor } from '~/Components/QuoteEditor';
import type { QuoteData, QuoteEditorHandle } from '~/Components/QuoteEditor/entities/QuoteData';

function ExternalControlQuoteEditor() {
  const editorRef = useRef<QuoteEditorHandle>(null);
  const [quoteData, setQuoteData] = useState<QuoteData>(initialData);

  const handleExternalPDFExport = async () => {
    if (editorRef.current) {
      try {
        await editorRef.current.exportToPDF();
        console.log('PDF exporté avec succès');
      } catch (error) {
        console.error('Erreur export PDF:', error);
      }
    }
  };

  const handleExternalUndo = () => {
    if (editorRef.current?.canUndo) {
      editorRef.current.undo();
    }
  };

  const handleExternalRedo = () => {
    if (editorRef.current?.canRedo) {
      editorRef.current.redo();
    }
  };

  const handleGetCurrentData = () => {
    if (editorRef.current) {
      const currentData = editorRef.current.getData();
      console.log('Données actuelles:', currentData);
    }
  };

  return (
    <div>
      {/* Barre d'outils externe personnalisée */}
      <div className="btn-toolbar mb-3" role="toolbar">
        <div className="btn-group me-2">
          <button
            className="btn btn-outline-primary"
            onClick={handleExternalUndo}
            disabled={!editorRef.current?.canUndo}
          >
            ↶ Annuler
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={handleExternalRedo}
            disabled={!editorRef.current?.canRedo}
          >
            ↷ Rétablir
          </button>
        </div>

        <div className="btn-group me-2">
          <button
            className="btn btn-primary"
            onClick={handleExternalPDFExport}
          >
            📄 Exporter PDF
          </button>
        </div>

        <div className="btn-group">
          <button
            className="btn btn-info"
            onClick={handleGetCurrentData}
          >
            🔍 Voir données
          </button>
        </div>
      </div>

      {/* Éditeur sans toolbar interne */}
      <QuoteEditor
        ref={editorRef}
        data={quoteData}
        onChange={setQuoteData}
        showToolbar={false} // Masquer la toolbar interne
        autoSave={true}
      />
    </div>
  );
}
```

### Toolbar personnalisée minimaliste

```tsx
function MinimalQuoteEditor() {
  const [quoteData, setQuoteData] = useState<QuoteData>(initialData);

  return (
    <QuoteEditor
      data={quoteData}
      onChange={setQuoteData}
      showToolbar={true}
      toolbarActions={['save', 'pdf']} // Seulement sauvegarde et PDF
      showAddSection={false}
      showAddBlock={false}
      showReset={false}
      autoSave={true}
    />
  );
}
```

### Mode embedded (sans toolbar, pour iframe)

```tsx
function EmbeddedQuoteViewer({ quoteId }: { quoteId: string }) {
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);

  useEffect(() => {
    fetch(`/api/quotes/${quoteId}`)
      .then(res => res.json())
      .then(setQuoteData);
  }, [quoteId]);

  if (!quoteData) return <div>Chargement...</div>;

  return (
    <QuoteEditor
      data={quoteData}
      onChange={setQuoteData}
      showToolbar={false} // Pas de toolbar
      readonly={true}     // Lecture seule
      autoSave={false}    // Pas de sauvegarde
      className="embedded-quote"
    />
  );
}
```
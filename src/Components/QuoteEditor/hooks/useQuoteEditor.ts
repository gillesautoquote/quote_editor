import { useState, useCallback, useRef, useEffect } from 'react';
import { normalizeQuoteData, validateQuoteData } from '../utils/dataValidator';
import type { QuoteData, EditingState, SaveState } from '../entities/QuoteData';

interface HistoryState {
  data: QuoteData;
  timestamp: number;
}

export const useQuoteEditor = (
  initialData: QuoteData,
  onChange: (data: QuoteData) => void | any,
  onSave?: ((data: QuoteData) => Promise<void>) | any,
  autoSave: boolean = true
) => {
  console.log('[useQuoteEditor] Received initialData:', {
    sections: initialData?.sections?.length,
    optionBlocks: initialData?.optionBlocks?.length,
    totals: initialData?.totals
  });

  // ✅ Normaliser les données initiales
  const normalizedInitialData = normalizeQuoteData(initialData);

  console.log('[useQuoteEditor] After normalization:', {
    sections: normalizedInitialData?.sections?.length,
    optionBlocks: normalizedInitialData?.optionBlocks?.length,
    totals: normalizedInitialData?.totals
  });

  if (!validateQuoteData(normalizedInitialData)) {
    console.error('Données QuoteData invalides:', initialData);
  }

  const [data, setData] = useState<QuoteData>(normalizedInitialData);
  const [editingState, setEditingState] = useState<EditingState>({
    isEditing: false,
    fieldPath: '',
    value: ''
  });
  const [saveState, setSaveState] = useState<SaveState>({
    isSaving: false,
    lastSaved: null,
    hasUnsavedChanges: false
  });

  // History for undo/redo
  const historyRef = useRef<HistoryState[]>([{ data: normalizedInitialData, timestamp: Date.now() }]);
  const historyIndexRef = useRef<number>(0);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  // Auto-save timer
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();

  const updateHistoryStates = useCallback(() => {
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  }, []);

  const addToHistory = useCallback((newData: QuoteData) => {
    const newHistoryItem: HistoryState = {
      data: newData,
      timestamp: Date.now()
    };

    // Remove any future history if we're not at the end
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    }

    historyRef.current.push(newHistoryItem);
    historyIndexRef.current = historyRef.current.length - 1;

    // Limit history size to 50 items
    if (historyRef.current.length > 50) {
      historyRef.current = historyRef.current.slice(-50);
      historyIndexRef.current = historyRef.current.length - 1;
    }

    updateHistoryStates();
  }, [updateHistoryStates]);

  const updateData = useCallback((newData: QuoteData, addHistory: boolean = true) => {
    // ✅ Valider les nouvelles données
    if (!validateQuoteData(newData)) {
      console.error('Tentative de mise à jour avec des données invalides:', newData);
      return;
    }

    setData(newData);
    onChange(newData);
    
    if (addHistory) {
      addToHistory(newData);
    }

    setSaveState(prev => ({ ...prev, hasUnsavedChanges: true }));

    if (autoSave && onSave) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      autoSaveTimerRef.current = setTimeout(() => {
        saveData();
      }, 1000);
    }
  }, [onChange, addToHistory, autoSave, onSave]);

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

  const saveData = useCallback(async () => {
    if (!onSave) return;

    setSaveState(prev => ({ ...prev, isSaving: true }));
    
    try {
      await onSave(data);
      setSaveState(prev => ({
        ...prev,
        isSaving: false,
        lastSaved: new Date(),
        hasUnsavedChanges: false
      }));
    } catch (error) {
      setSaveState(prev => ({ ...prev, isSaving: false }));
      console.error('Save failed:', error);
    }
  }, [onSave, data]);

  const startEditing = useCallback((fieldPath: string, currentValue: string) => {
    setEditingState({
      isEditing: true,
      fieldPath,
      value: currentValue
    });
  }, []);

  const stopEditing = useCallback(() => {
    setEditingState({
      isEditing: false,
      fieldPath: '',
      value: ''
    });
  }, []);

  const updateEditingValue = useCallback((value: string) => {
    setEditingState(prev => ({ ...prev, value }));
  }, []);

  // Keyboard shortcuts
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

  // Cleanup
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  return {
    data,
    updateData,
    editingState,
    startEditing,
    stopEditing,
    updateEditingValue,
    saveState,
    saveData,
    canUndo,
    canRedo,
    undo,
    redo
  };
};
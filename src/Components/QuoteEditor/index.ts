// Import CSS unifié avec isolation complète
import './styles/quote-editor-scoped.css';
import './styles/quote-editor-utilities.css';

// Exports principaux du composant QuoteEditor
export { QuoteEditor } from './QuoteEditor';
export type {
  QuoteEditorProps,
  QuoteEditorHandle,
  ComponentEvent,
} from './QuoteEditor.types';
export type {
  QuoteData,
  Company,
  Recipient,
  Quote,
  QuoteSection,
  QuoteLine,
  OptionBlock,
  OptionRow,
  NoteItem,
  SignatureFrame,
  SignatureLineItem,
  ClientSignature,
  Footer,
  SelectDefinition,
  ColumnDefinition,
  EditingState,
  SaveState
} from './entities/QuoteData';

// Exports des hooks
export { usePDFExport } from './hooks/usePDFExport';
export { useQuoteEditor } from './hooks/useQuoteEditor';
export { useListManager } from './hooks/useListManager';
export { useDragAndDrop } from './hooks/useDragAndDrop';
export { useFieldPath } from './hooks/useFieldPath';
export { useColorTheme } from './hooks/useColorTheme';

// Exports des utilitaires
export { normalizeQuoteData, validateQuoteData } from './utils/dataValidator';
export { globalEventEmitter, EVENTS } from './utils/eventEmitter';
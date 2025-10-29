export interface Company {
  logoUrl: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  mainColor: string;
}

export interface Recipient {
  fullName: string;
  title: string;
  organization: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  clientReference: string;
}

export interface Quote {
  number: string;
  version: string;
  issueDate: string;
  executionCity: string;
  tagline: string;
  validUntil: string;
  reference: string;
}

export interface QuoteLine {
  date: string;
  description: string;
  durationHours: number;
  pax: number;
  unitPrice: number;
  priceHT: number;
  vatRate: number | string;
  vatAmount: number;
  quantity: number;
  priceTTC: number;
  calculable?: boolean;
}

export interface ColumnDefinition {
  title: string;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  style?: 'normal' | 'primary' | 'success' | 'danger' | 'warning' | 'calculated';
  type?: 'text' | 'number' | 'date' | 'currency';
  editable?: boolean;
  hidden?: boolean;
}

export interface QuoteSection {
  title: string;
  missionsLines?: QuoteLine[];
  simplesLinesSelect?: QuoteLine[];
  columns?: {
    date: ColumnDefinition;
    description: ColumnDefinition;
    durationHours: ColumnDefinition;
    pax: ColumnDefinition;
    unitPrice: ColumnDefinition;
    priceHT: ColumnDefinition;
    vatRate: ColumnDefinition;
    quantity: ColumnDefinition;
    priceTTC: ColumnDefinition;
  };
  lines: QuoteLine[];
  subTotal: {
    ht: number;
    tva: number;
    ttc: number;
  };
}

export interface OptionRow {
  id: string;
  label: string;
  type?: string;
  style?: 'normal' | 'bold' | 'italic' | 'underline';
}

export interface SelectDefinition {
  title: string;
  values: string[];
  allowedBlocks: string[];
}

export interface NoteItem {
  text: string;
  style: 'normal' | 'bold' | 'italic' | 'underline';
}

export interface TripProgramStep {
  id: string;
  date: string;
  time: string;
  city: string;
  address: string;
  label: string;
}

export interface TripProgramFilters {
  depart: boolean;
  arrivee: boolean;
  mise_en_place: boolean;
  retour: boolean;
  excludeDepot: boolean;
}

export interface OptionBlock {
  id: string;
  title: string;
  color?: string;
  columns?: number;
  showTitle?: boolean;
  allowWidthControl?: boolean;
  type: 'list' | 'notes' | 'programme-voyage';
  rows?: OptionRow[];
  notes?: NoteItem[];
  tripSteps?: TripProgramStep[];
  tripFilters?: TripProgramFilters;
}

export interface SignatureLineItem {
  text: string;
  style: 'normal' | 'bold' | 'italic' | 'underline';
}

export interface SignatureFrame {
  beforeLines: SignatureLineItem[];
  afterLines: SignatureLineItem[];
}

export interface NotaBeneItem {
  text: string;
  style: 'normal' | 'bold' | 'italic' | 'underline';
}

export interface ClientSignature {
  tagline: string;
  title: string;
  fullName: string;
}

export interface Footer {
  copyright: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  rcs: string;
  siret: string;
  tva: string;
  website: string;
  iban: string;
  bic: string;
}

export interface VATBreakdown {
  rate: number;
  amount: number;
}

export interface QuoteData {
  company: Company;
  recipient: Recipient;
  quote: Quote;
  sections: QuoteSection[];
  totals: {
    ht: number;
    tva: number;
    ttc: number;
    vatBreakdown?: VATBreakdown[];
  };
  optionBlocks: OptionBlock[];
  signatureFrame: SignatureFrame;
  clientSignature: ClientSignature;
  footer: Footer;
  selectDefinitions: Record<string, SelectDefinition>;
}

export type ComponentEvent =
  | { type: 'ready' }
  | { type: 'error'; code: string; message: string }
  | { type: 'change'; path: string; value: unknown; data: QuoteData }
  | { type: 'save'; data: QuoteData }
  | { type: 'export_pdf'; data: QuoteData }
  | { type: 'undo'; data: QuoteData }
  | { type: 'redo'; data: QuoteData }
  | { type: 'action'; name: string; payload?: unknown };

export interface QuoteEditorProps {
  data?: QuoteData;
  mock?: boolean;
  locale?: 'fr' | 'en';
  theme?: 'light' | 'dark';
  readonly?: boolean;
  printMode?: boolean;
  flatMode?: boolean;
  previewMode?: boolean;
  className?: string;
  onEvent?: (evt: ComponentEvent) => void;
  showToolbar?: boolean;
  showAddSection?: boolean;
  showAddBlock?: boolean;
  showReset?: boolean;
  showTemplateSelector?: boolean;
  allowWidthControl?: boolean;
}

export interface QuoteEditorHandle {
  exportToPDF: () => Promise<void>;
  saveData: () => Promise<void>;
  undo: () => void;
  redo: () => void;
  getData: () => QuoteData;
  canUndo: boolean;
  canRedo: boolean;
}

export interface EditingState {
  isEditing: boolean;
  fieldPath: string;
  value: string;
}

export interface SaveState {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}

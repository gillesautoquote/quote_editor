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
  title: string; // Civilité : Monsieur, Madame, etc.
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
  vatRate: number | string; // Peut être un nombre ou "MIX"
  vatAmount: number; // Montant de TVA calculé
  quantity: number;
  priceTTC: number;
  calculable?: boolean; // true par défaut, false pour les lignes pré-définies
  fromProps?: boolean; // true si la ligne provient des props (missionsLines ou simplesLinesSelect)
}

export interface ColumnDefinition {
  title: string;
  width?: string | number; // "80px" ou "10%" ou nombre en px
  align?: 'left' | 'center' | 'right';
  style?: 'normal' | 'primary' | 'success' | 'danger' | 'warning' | 'calculated';
  type?: 'text' | 'number' | 'date' | 'currency';
  editable?: boolean;
  hidden?: boolean; // Pour masquer des colonnes si besoin
}

export interface QuoteSection {
  title: string;
  missionsLines?: QuoteLine[]; // Lignes mission pré-définies
  simplesLinesSelect?: QuoteLine[]; // Lignes simples prédéfinies pour sélection
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
  tripName?: string;
}

export interface TripProgramFilters {
  depart: boolean;
  arrivee: boolean;
  mise_en_place: boolean;
  depotRoundTrips: boolean;
}

export interface DocumentSectionLabel {
  id: string;
  label: string;
}

export interface OptionBlock {
  id: string;
  title: string;
  color?: string;
  columns?: number; // Nombre de colonnes (1, 2, 3, 4, etc.)
  showTitle?: boolean; // Afficher le titre ou non
  allowWidthControl?: boolean; // Permettre le contrôle de la largeur
  type: 'list' | 'notes' | 'programme-voyage';
  rows?: OptionRow[];
  notes?: NoteItem[];
  tripSteps?: TripProgramStep[];
  tripFilters?: TripProgramFilters;
  defaultFilters?: TripProgramFilters; // Filtres par défaut pour le programme de voyage
}

export interface SignatureLineItem {
  text: string;
  style: 'normal' | 'bold' | 'italic' | 'underline';
}

export interface SignatureFrame {
  beforeLines: SignatureLineItem[];
  afterLines: SignatureLineItem[];
  siret?: string;
  intraCommunityVat?: string;
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

export interface CarbonImpact {
  co2Amount: number;
  unit: string;
  equivalentKm: number;
  vehicleType: string;
  description?: string;
}

export interface Footer {
  copyright: string;
  confidentialNotice: string;
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

export interface TripAddress {
  adresse: string;
  codePostal: string;
  ville: string;
  pays: string;
  latitude?: number;
  longitude?: number;
}

export interface TaxInfo {
  nom: string;
  incluse: boolean;
  pourcentage: number;
}

export interface TollDetail {
  nom: string;
  cout: number;
  etat: string;
  taxe?: TaxInfo;
  type?: string;
  route?: string;
  position?: string;
  heureArrivee?: string;
  distanceArrivee?: number;
}

export interface TollSummary {
  vignettes: string[];
  typeVehicule: string;
  detailsPeages: TollDetail[];
  coutTotalPeages: number;
  coutTotalCarburant: number;
  coutTotalVignettes: number;
}

export type TripStepType = 'etape' | 'coupure' | 'repos';

export interface BaseTripStep {
  type: TripStepType;
  label: string;
  estPrisEnComptePourCalculs: boolean;
  estDebutService: boolean;
  estFinService: boolean;
  uuid: string;
}

export interface TripStepSingle extends BaseTripStep {
  type: 'etape';
  heure: string;
}

export interface TripStepRange extends BaseTripStep {
  type: 'coupure' | 'repos';
  heureDebut: string;
  heureFin: string;
  dureeEnSecondes: number;
}

export type TripStep = TripStepSingle | TripStepRange;

export interface StepGroup {
  type: 'etapesGroupees';
  adresse: TripAddress;
  etapes: TripStep[];
}

export interface TravelPhase {
  type: 'phaseDeVoyage';
  distanceKm: number;
  durationMin: number;
  resumePeages: TollSummary;
  estPrisEnComptePourCalculs: boolean;
  estDebutService: boolean;
  estFinService: boolean;
}

export type DayItem = StepGroup | TravelPhase;

export interface DaySchedule {
  tripName?: string;
  date: string;
  items: DayItem[];
}

export interface BusService {
  id: string;
  label: string;
  icon: 'wifi' | 'plug' | 'ac' | 'wc' | 'dvd' | 'microphone' | 'fridge' | 'pmr' | 'drinks' | 'bed' | 'trailer' | 'wheelchair';
  available: boolean;
}

export interface BusServices {
  title: string;
  services: BusService[];
}

export interface PageTitles {
  introduction?: string;
  programme?: string;
  services?: string;
  cotation?: string;
  conditions?: string;
  signature?: string;
}

export interface DocumentLabels {
  introductionSections: DocumentSectionLabel[];
  pageTitles: PageTitles;
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
    vatBreakdown?: { rate: number; amount: number }[];
  };
  validityNotice: string;
  carbonImpact?: CarbonImpact;
  busServices?: BusServices;
  optionBlocks: OptionBlock[];
  signatureFrame: SignatureFrame;
  clientSignature: ClientSignature;
  termsNotice: string;
  footer: Footer;
  selectDefinitions: Record<string, SelectDefinition>;
  itinerary?: DaySchedule[];
  labels?: DocumentLabels;
  visibleTabIds?: string[];
  defaultProgrammeFilters?: TripProgramFilters;
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
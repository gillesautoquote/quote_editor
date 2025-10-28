# Types TypeScript - QuoteEditor

## 🎯 Types principaux

### QuoteData (Root Type)

```tsx
interface QuoteData {
  company: Company;                    // Informations entreprise émettrice
  recipient: Recipient;                // Destinataire du devis
  quote: Quote;                       // Métadonnées du devis
  sections: QuoteSection[];           // Tableaux de prestations
  totals: Totals;                     // Totaux calculés automatiquement
  optionBlocks: OptionBlock[];        // Blocs personnalisables
  signatureFrame: SignatureFrame;     // Encart de signature
  clientSignature: ClientSignature;   // Signature finale du devis
  footer: Footer;                     // Informations de pied de page
  selectDefinitions: Record<string, SelectDefinition>; // Définitions des sélecteurs
}
```

## 🏢 Types Entreprise

### Company

```tsx
interface Company {
  logoUrl: string;         // URL du logo (peut être relative ou absolue)
  name: string;           // Nom de l'entreprise
  address: string;        // Adresse postale
  postalCode: string;     // Code postal
  city: string;          // Ville
  country: string;       // Pays
  phone: string;         // Téléphone
  email: string;         // Email de contact
  website: string;       // Site web
  mainColor: string;     // Couleur principale (hex: #RRGGBB)
}
```

**Exemple :**
```tsx
const company: Company = {
  logoUrl: '/assets/logo.png',
  name: 'Mon Entreprise SARL',
  address: '123 Rue des Exemples',
  postalCode: '75001',
  city: 'Paris',
  country: 'France',
  phone: '+33 1 23 45 67 89',
  email: 'contact@monentreprise.fr',
  website: 'https://www.monentreprise.fr',
  mainColor: '#0066cc'
};
```

## 👤 Types Client/Destinataire

### Recipient

```tsx
interface Recipient {
  fullName: string;         // Nom complet du contact
  title: string;           // Civilité (Monsieur, Madame, etc.)
  organization: string;    // Nom de l'organisation/entreprise
  address: string;        // Adresse postale
  postalCode: string;     // Code postal
  city: string;          // Ville
  country: string;       // Pays
  email: string;         // Email du contact
  phone: string;         // Téléphone du contact
  clientReference: string; // Référence client interne
}
```

## 📋 Types Devis

### Quote

```tsx
interface Quote {
  number: string;          // Numéro de devis (ex: "DEV-2024-001")
  version: string;         // Version (ex: "1.0", "2.1")
  issueDate: string;      // Date d'émission (ISO: "2024-01-15")
  executionCity: string;  // Ville d'exécution (pour la date)
  tagline: string;        // Phrase d'accroche/introduction
  validUntil: string;     // Date de validité (ISO: "2024-02-15")
  reference: string;      // Référence du projet/commande
}
```

## 📊 Types Tableaux/Sections

### QuoteSection

```tsx
interface QuoteSection {
  title: string;                    // Titre de la section
  missionsLines?: QuoteLine[];      // Lignes missions prédéfinies
  simplesLinesSelect?: QuoteLine[]; // Lignes simples pour sélection
  columns?: ColumnDefinitions;      // Définition des colonnes (optionnel)
  lines: QuoteLine[];              // Lignes de prestation actuelles
  subTotal: Totals;               // Sous-total de cette section
}
```

### QuoteLine

```tsx
interface QuoteLine {
  date: string;              // Date de prestation (ISO)
  description: string;       // Description de la prestation
  durationHours: number;     // Durée en heures
  pax: number;              // Nombre de personnes
  unitPrice: number;        // Prix unitaire HT
  priceHT: number;          // Prix total HT (calculé: quantity × unitPrice)
  vatRate: number | string; // Taux TVA (20) ou texte ("MIX", "Exo")
  vatAmount: number;        // Montant TVA (calculé)
  quantity: number;         // Quantité
  priceTTC: number;         // Prix TTC (calculé: priceHT + vatAmount)
  calculable?: boolean;     // true = calculs auto, false = valeurs fixes
}
```

### ColumnDefinition

```tsx
interface ColumnDefinition {
  title: string;                           // Titre de la colonne
  width?: string | number;                 // Largeur ("80px", "10%", 120)
  align?: 'left' | 'center' | 'right';    // Alignement du contenu
  style?: 'normal' | 'primary' | 'success' | 'danger' | 'warning' | 'calculated';
  type?: 'text' | 'number' | 'date' | 'currency'; // Type de données
  editable?: boolean;                      // Champ modifiable ou calculé
  hidden?: boolean;                        // Masquer la colonne
}
```

### Totals

```tsx
interface Totals {
  ht: number;    // Total Hors Taxes
  tva: number;   // Total TVA
  ttc: number;   // Total Toutes Taxes Comprises
}
```

## 🧩 Types Blocs d'Options

### OptionBlock

```tsx
interface OptionBlock {
  id: string;                    // Identifiant unique
  title: string;                // Titre du bloc
  color?: string;               // Couleur personnalisée (hex)
  columns?: number;             // Largeur en colonnes Bootstrap (1-6)
  showTitle?: boolean;          // Afficher le titre (défaut: true)
  allowWidthControl?: boolean;  // Permettre redimensionnement (défaut: true)
  type: 'list' | 'notes';      // Type de contenu
  rows?: OptionRow[];          // Lignes avec sélecteurs (si type='list')
  notes?: NoteItem[];          // Notes simples (si type='notes')
}
```

### OptionRow

```tsx
interface OptionRow {
  id: string;                                        // Identifiant unique
  label: string;                                    // Texte affiché
  type?: string;                                   // Type de sélecteur (référence SelectDefinition)
  style?: 'normal' | 'bold' | 'italic' | 'underline'; // Style de texte
}
```

### NoteItem

```tsx
interface NoteItem {
  text: string;                                     // Contenu de la note
  style: 'normal' | 'bold' | 'italic' | 'underline'; // Style de texte
}
```

### SelectDefinition

```tsx
interface SelectDefinition {
  title: string;        // Nom du sélecteur (ex: "Véhicules")
  values: string[];     // Options disponibles
  allowedBlocks: string[]; // IDs des blocs où ce sélecteur est disponible
}
```

**Exemple complet :**
```tsx
const selectDefinitions: Record<string, SelectDefinition> = {
  vehicles: {
    title: 'Véhicules',
    values: [
      'Autocar 49 places',
      'Autocar 55 places', 
      'Minibus 20 places',
      'VAN 8 places'
    ],
    allowedBlocks: ['included_services', 'excluded_services']
  },
  options: {
    title: 'Options',
    values: [
      'Wifi à bord',
      'Climatisation',
      'Prises électriques'
    ],
    allowedBlocks: ['included_services']
  }
};
```

## ✍️ Types Signature

### SignatureFrame

```tsx
interface SignatureFrame {
  beforeLines: SignatureLineItem[];  // Lignes avant l'encart de signature
  afterLines: SignatureLineItem[];   // Lignes après l'encart de signature
}
```

### SignatureLineItem

```tsx
interface SignatureLineItem {
  text: string;                                     // Contenu de la ligne
  style: 'normal' | 'bold' | 'italic' | 'underline'; // Style de texte
}
```

### ClientSignature

```tsx
interface ClientSignature {
  tagline: string;    // Texte de conclusion (paragraphe complet)
  title: string;      // Fonction du signataire (ex: "Le Service Commercial")
  fullName: string;   // Nom complet du signataire
}
```

## 📄 Types Footer

### Footer

```tsx
interface Footer {
  copyright: string;    // Copyright (ex: "© 2024 Mon Entreprise")
  address: string;      // Adresse (identique à Company mais peut différer)
  postalCode: string;   // Code postal
  city: string;         // Ville
  country: string;      // Pays
  phone: string;        // Téléphone
  rcs: string;         // RCS (ex: "RCS Paris 123 456 789")
  siret: string;       // SIRET (ex: "123 456 789 00012")
  tva: string;         // TVA intracommunautaire (ex: "FR12 345678901")
  website: string;     // Site web
  iban: string;        // IBAN pour virements
  bic: string;         // BIC/SWIFT
}
```

## ⚙️ Types Composant

### QuoteEditorProps

```tsx
interface QuoteEditorProps {
  // Props essentielles
  data: QuoteData;                              // Données complètes (requis)
  onChange: (data: QuoteData) => void;          // Callback modifications (requis)
  onSave?: (data: QuoteData) => Promise<void>;  // Callback sauvegarde (optionnel)
  autoSave?: boolean;                          // Auto-sauvegarde (défaut: true)
  readonly?: boolean;                          // Mode lecture seule (défaut: false)

  // Props de configuration avancée
  className?: string;                          // Classes CSS personnalisées
  showToolbar?: boolean;                       // Afficher la toolbar (défaut: true)
  toolbarActions?: string[];                   // Actions à afficher (défaut: ['all'])
  showAddSection?: boolean;                    // Bouton "+ Tableau" (défaut: false)
  showAddBlock?: boolean;                      // Bouton "+ Liste" (défaut: false)
  showReset?: boolean;                         // Bouton "Réinitialiser" (défaut: false)
  showTemplateSelector?: boolean;              // Sélecteur de templates (défaut: false)
  allowWidthControl?: boolean;                 // Contrôles largeur blocs (défaut: true)
  ref?: React.Ref<QuoteEditorHandle>;         // Référence pour méthodes impératives
}

interface QuoteEditorHandle {
  exportToPDF: () => Promise<void>;            // Exporter en PDF
  saveData: () => Promise<void>;               // Sauvegarder manuellement
  undo: () => void;                           // Annuler la dernière action
  redo: () => void;                           // Rétablir l'action annulée
  getData: () => QuoteData;                   // Récupérer les données actuelles
  canUndo: boolean;                           // Possibilité d'annuler
  canRedo: boolean;                           // Possibilité de rétablir
}
```

### EditingState

```tsx
interface EditingState {
  isEditing: boolean;    // En mode édition
  fieldPath: string;     // Chemin du champ en cours (ex: "company.name")
  value: string;         // Valeur temporaire en cours de saisie
}
```

### SaveState

```tsx
interface SaveState {
  isSaving: boolean;           // Sauvegarde en cours
  lastSaved: Date | null;      // Dernière sauvegarde réussie
  hasUnsavedChanges: boolean;  // Modifications non sauvées
}
```

## 🎨 Types Styling

### EditableFieldProps

```tsx
interface EditableFieldProps {
  value: string;                                    // Valeur actuelle
  onSave: (value: string) => void;                  // Callback de sauvegarde
  placeholder?: string;                             // Texte placeholder
  multiline?: boolean;                             // Permettre plusieurs lignes
  className?: string;                              // Classes CSS additionnelles
  disabled?: boolean;                              // Désactivé (lecture seule)
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'; // Élément HTML
  fullWidth?: boolean;                             // Prendre toute la largeur
}
```

## 🔧 Types Utilitaires

### DragDropItem

```tsx
interface DragDropItem {
  index: number;    // Index de l'élément
  type: string;     // Type d'élément ('row', 'note', 'block', etc.)
  data?: any;       // Données additionnelles
}
```

### ColorVariables

```tsx
interface ColorVariables {
  '--dynamic-primary-color': string;      // Couleur principale
  '--dynamic-primary-contrast': string;   // Couleur de contraste
  '--dynamic-primary-light': string;      // Version claire
  '--dynamic-primary-lighter': string;    // Version très claire
  '--dynamic-primary-dark': string;       // Version foncée
  '--dynamic-primary-rgb': string;        // Valeurs RGB séparées
}
```

## 📋 Type Guards et Validation

### Type Guards

```tsx
// Vérifier si un bloc est de type 'list'
const isListBlock = (block: OptionBlock): block is OptionBlock & { type: 'list' } => {
  return block.type === 'list';
};

// Vérifier si une ligne est calculable
const isCalculableLine = (line: QuoteLine): boolean => {
  return line.calculable !== false;
};

// Vérifier si le taux de TVA est numérique
const hasNumericVAT = (line: QuoteLine): line is QuoteLine & { vatRate: number } => {
  return typeof line.vatRate === 'number';
};
```

### Validation avec Zod (optionnel)

```tsx
import { z } from 'zod';

const QuoteDataSchema = z.object({
  company: z.object({
    name: z.string().min(1, 'Nom requis'),
    mainColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur invalide'),
    email: z.string().email('Email invalide')
  }),
  quote: z.object({
    number: z.string().min(1, 'Numéro requis'),
    validUntil: z.string().refine(
      date => new Date(date) > new Date(),
      'Date de validité dépassée'
    )
  }),
  sections: z.array(z.object({
    lines: z.array(z.object({
      priceHT: z.number().min(0, 'Prix négatif interdit'),
      quantity: z.number().int().min(1, 'Quantité minimale: 1')
    }))
  }))
});

type ValidatedQuoteData = z.infer<typeof QuoteDataSchema>;
```

## 🎯 Exemples d'utilisation

### Création d'un devis minimal

```tsx
const minimalQuote: QuoteData = {
  company: {
    logoUrl: '',
    name: 'Mon Entreprise',
    address: '123 Rue Example',
    postalCode: '75001',
    city: 'Paris',
    country: 'France',
    phone: '01 23 45 67 89',
    email: 'contact@exemple.fr',
    website: 'https://exemple.fr',
    mainColor: '#0066cc'
  },
  recipient: {
    fullName: 'Jean Dupont',
    title: 'Monsieur',
    organization: 'Client Corp',
    address: '456 Avenue Client',
    postalCode: '69000',
    city: 'Lyon',
    country: 'France',
    email: 'jean.dupont@client.fr',
    phone: '04 56 78 90 12',
    clientReference: 'REF-2024-001'
  },
  quote: {
    number: 'DEV-2024-001',
    version: '1.0',
    issueDate: '2024-01-15',
    executionCity: 'Paris',
    tagline: 'Nous avons le plaisir de vous proposer...',
    validUntil: '2024-02-15',
    reference: 'PROJET-ABC'
  },
  sections: [{
    title: 'Prestations',
    lines: [{
      date: '2024-02-01',
      description: 'Prestation exemple',
      durationHours: 8,
      pax: 10,
      unitPrice: 100,
      priceHT: 100,
      vatRate: 20,
      vatAmount: 20,
      quantity: 1,
      priceTTC: 120
    }],
    subTotal: { ht: 100, tva: 20, ttc: 120 }
  }],
  totals: { ht: 100, tva: 20, ttc: 120 },
  optionBlocks: [],
  signatureFrame: { beforeLines: [], afterLines: [] },
  clientSignature: {
    tagline: 'Nous vous remercions de votre confiance.',
    title: 'Le Directeur Commercial',
    fullName: 'Pierre Martin'
  },
  footer: {
    copyright: '© 2024 Mon Entreprise',
    address: '123 Rue Example',
    postalCode: '75001',
    city: 'Paris',
    country: 'France',
    phone: '01 23 45 67 89',
    rcs: 'RCS Paris 123 456 789',
    siret: '123 456 789 00012',
    tva: 'FR12345678901',
    website: 'https://exemple.fr',
    iban: 'FR76 1234 5678 9012 3456 7890 123',
    bic: 'BPFRPPXXX'
  },
  selectDefinitions: {}
};
```
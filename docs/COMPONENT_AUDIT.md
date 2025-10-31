# Audit des Composants - Migration Print-Friendly

**Date**: 2025-10-29
**Objectif**: Inventaire complet des composants et éléments interactifs à adapter

---

## 📊 Vue d'ensemble

### Statistiques
- **Total composants React**: 50+ fichiers TSX
- **Composants PDF (@react-pdf)**: 12 fichiers
- **Éléments interactifs identifiés**: ~300 occurrences
- **Styles PDF à migrer**: 9 fichiers de styles

---

## 🧩 Composants React à adapter

### 1. QuoteEditor (Racine)
**Fichier**: `src/Components/QuoteEditor/QuoteEditor.tsx`

**État actuel**:
- Gère deux modes: Legacy et Standalone
- Utilise `usePDFExport` avec @react-pdf/renderer
- Toolbar visible en permanence
- Pas de prop `printMode`

**Modifications nécessaires**:
- [ ] Ajouter prop `printMode: boolean`
- [ ] Propager `printMode` à QuotePage et QuoteTabs
- [ ] Remplacer `usePDFExport` par `usePDFExportPlaywright`
- [ ] Masquer toolbar en mode print
- [ ] Ajouter classes `print:tw-*` appropriées

**Éléments interactifs**:
- Toolbar avec boutons (export, save, undo, redo)
- Système d'onglets
- Contrôles de largeur

**Impact**: 🔴 CRITIQUE - Composant racine

---

### 2. QuotePage
**Fichier**: `src/Components/QuoteEditor/components/QuotePage/QuotePage.tsx`

**État actuel**:
- Page principale avec tous les sous-composants
- Largeur responsive avec max-w-[1000px]
- Contient déjà quelques classes `print:tw-*`
- Format A4 pour impression

**Modifications nécessaires**:
- [ ] Ajouter prop `printMode: boolean`
- [ ] Propager aux sous-composants (Header, Recipient, Intro, Sections, Totals, Footer)
- [ ] Adapter largeur pour mode print: `print:tw-w-[21cm]`
- [ ] Supprimer ombres et bordures en print: `print:tw-shadow-none print:tw-border-none`
- [ ] Ajouter attributs `data-print-page` pour Paged.js

**Éléments interactifs**:
- Boutons de suppression de sections
- Boutons de suppression de blocs
- Tous les EditableField

**Classes print existantes**:
```tsx
className="... print:tw-shadow-none print:tw-m-0 print:tw-rounded-none
           print:tw-border-none print:tw-w-[21cm]"
```

**Impact**: 🔴 CRITIQUE - Page principale

---

### 3. QuotePageHeader
**Fichier**: `src/Components/QuoteEditor/components/QuotePage/components/QuotePageHeader.tsx`

**État actuel**:
- Affiche logo, nom société, infos devis
- Utilise EditableField pour édition inline
- Grid layout responsive

**Modifications nécessaires**:
- [ ] Recevoir prop `printMode`
- [ ] Passer `printMode` aux EditableField
- [ ] Optimiser logo pour print (taille fixe)
- [ ] Adapter le layout pour éviter coupure de page

**Éléments interactifs**:
- EditableField sur tous les champs texte

**Impact**: 🟡 MOYEN

---

### 4. QuotePageRecipient
**Fichier**: `src/Components/QuoteEditor/components/QuotePage/components/QuotePageRecipient.tsx`

**État actuel**:
- Affiche destinataire du devis
- EditableField sur chaque ligne

**Modifications nécessaires**:
- [ ] Recevoir prop `printMode`
- [ ] Passer `printMode` aux EditableField
- [ ] Classe `page-break-inside-avoid` pour garder bloc entier

**Éléments interactifs**:
- EditableField multiples

**Impact**: 🟡 MOYEN

---

### 5. QuotePageIntro
**Fichier**: `src/Components/QuoteEditor/components/QuotePage/components/QuotePageIntro.tsx`

**État actuel**:
- Texte d'introduction du devis
- EditableMarkdownField

**Modifications nécessaires**:
- [ ] Recevoir prop `printMode`
- [ ] Passer `printMode` à EditableMarkdownField

**Éléments interactifs**:
- EditableMarkdownField

**Impact**: 🟡 MOYEN

---

### 6. QuotePageTotals
**Fichier**: `src/Components/QuoteEditor/components/QuotePage/components/QuotePageTotals.tsx`

**État actuel**:
- Tableau des totaux HT/TVA/TTC
- Pas d'édition inline (calculs automatiques)
- Layout fixe

**Modifications nécessaires**:
- [ ] Aucune modification majeure (déjà statique)
- [ ] Vérifier rendu print
- [ ] Ajouter `page-break-inside-avoid`

**Éléments interactifs**:
- Aucun

**Impact**: 🟢 FAIBLE

---

### 7. QuotePageFooter
**Fichier**: `src/Components/QuoteEditor/components/QuotePage/components/QuotePageFooter.tsx`

**État actuel**:
- Footer avec copyright, website, mentions légales
- EditableField sur plusieurs champs

**Modifications nécessaires**:
- [ ] Recevoir prop `printMode`
- [ ] Passer `printMode` aux EditableField
- [ ] Optimiser pour print (position fixe en bas de page si possible)

**Éléments interactifs**:
- EditableField multiples

**Impact**: 🟡 MOYEN

---

### 8. QuoteSection
**Fichier**: `src/Components/QuoteEditor/components/QuoteSection/QuoteSection.tsx`

**État actuel**:
- Tableau de lignes de cotation
- Drag & drop des lignes
- Boutons add/delete
- SectionActions (contrôles)
- TableRow avec EditableField

**Modifications nécessaires**:
- [ ] Recevoir prop `printMode`
- [ ] Masquer SectionActions en print: `<EditOnly>`
- [ ] Masquer drag handles en print
- [ ] Passer `printMode` aux TableRow
- [ ] Optimiser tableau pour éviter coupures (Paged.js)
- [ ] Ajouter `page-break-inside-avoid` sur lignes importantes

**Éléments interactifs**:
- Drag handles sur chaque ligne
- Bouton "Ajouter ligne"
- Bouton "Supprimer section"
- SectionActions (dupliquer, réorganiser)
- EditableField dans chaque cellule

**Impact**: 🔴 CRITIQUE - Composant complexe avec beaucoup d'interactions

---

### 9. TableRow
**Fichier**: `src/Components/QuoteEditor/components/QuoteSection/components/TableRow.tsx`

**État actuel**:
- Ligne de tableau avec colonnes configurables
- EditableField pour chaque cellule
- Drag handle
- Bouton delete

**Modifications nécessaires**:
- [ ] Recevoir prop `printMode`
- [ ] Masquer drag handle: `<EditOnly>`
- [ ] Masquer bouton delete: `<EditOnly>`
- [ ] Passer `printMode` aux EditableField
- [ ] Supprimer hover effects en print

**Éléments interactifs**:
- Drag handle (icône grip)
- Bouton delete (trash icon)
- EditableField dans chaque cellule

**Impact**: 🔴 CRITIQUE - Utilisé pour chaque ligne

---

### 10. SubtotalRow
**Fichier**: `src/Components/QuoteEditor/components/QuoteSection/components/SubtotalRow.tsx`

**État actuel**:
- Ligne de sous-total (calcul automatique)
- Pas d'édition

**Modifications nécessaires**:
- [ ] Aucune modification majeure
- [ ] Vérifier styles print

**Éléments interactifs**:
- Aucun

**Impact**: 🟢 FAIBLE

---

### 11. SectionActions
**Fichier**: `src/Components/QuoteEditor/components/QuoteSection/components/SectionActions.tsx`

**État actuel**:
- Boutons de contrôle de section
- Dupliquer, supprimer, réorganiser

**Modifications nécessaires**:
- [ ] Envelopper dans `<EditOnly>` pour masquer en print

**Éléments interactifs**:
- Tous les boutons

**Impact**: 🟡 MOYEN - Simple à masquer

---

### 12. OptionBlock
**Fichier**: `src/Components/QuoteEditor/components/OptionBlock/OptionBlock.tsx`

**État actuel**:
- Blocs d'options (inclus/exclus/notes)
- Support multi-colonnes (1-4)
- Drag & drop des items
- ColumnControls
- StyleSelector
- 3 types: list, notes, programme-voyage

**Modifications nécessaires**:
- [ ] Recevoir prop `printMode`
- [ ] Masquer ColumnControls: `<EditOnly>`
- [ ] Masquer StyleSelector: `<EditOnly>`
- [ ] Désactiver drag & drop en print
- [ ] Passer `printMode` aux sous-composants (OptionRow, NoteRow, TripProgramBlock)
- [ ] Adapter layout multi-colonnes pour print (CSS columns au lieu de grid)

**Éléments interactifs**:
- ColumnControls (changer nombre de colonnes)
- StyleSelector (changer couleur)
- Drag handles sur chaque item
- Boutons add/delete

**Impact**: 🔴 CRITIQUE - Composant complexe

---

### 13. OptionRow
**Fichier**: `src/Components/QuoteEditor/components/OptionBlock/components/OptionRow.tsx`

**État actuel**:
- Ligne d'option avec texte éditable
- Drag handle
- Bouton delete

**Modifications nécessaires**:
- [ ] Recevoir prop `printMode`
- [ ] Masquer drag handle: `<EditOnly>`
- [ ] Masquer bouton delete: `<EditOnly>`
- [ ] Passer `printMode` à EditableField

**Éléments interactifs**:
- Drag handle
- Bouton delete
- EditableField

**Impact**: 🟡 MOYEN

---

### 14. NoteRow
**Fichier**: `src/Components/QuoteEditor/components/OptionBlock/components/NoteRow.tsx`

**État actuel**:
- Paragraphe de note avec texte éditable
- Drag handle
- Bouton delete

**Modifications nécessaires**:
- [ ] Recevoir prop `printMode`
- [ ] Masquer drag handle: `<EditOnly>`
- [ ] Masquer bouton delete: `<EditOnly>`
- [ ] Passer `printMode` à EditableField

**Éléments interactifs**:
- Drag handle
- Bouton delete
- EditableMarkdownField

**Impact**: 🟡 MOYEN

---

### 15. TripProgramBlock
**Fichier**: `src/Components/QuoteEditor/components/OptionBlock/components/TripProgramBlock.tsx`

**État actuel**:
- Programme de voyage jour par jour
- Drag & drop des jours
- EditableField multiples

**Modifications nécessaires**:
- [ ] Recevoir prop `printMode`
- [ ] Masquer drag handles: `<EditOnly>`
- [ ] Masquer boutons: `<EditOnly>`
- [ ] Passer `printMode` aux EditableField
- [ ] Optimiser pour éviter coupures de page

**Éléments interactifs**:
- Drag handles
- Boutons add/delete jour
- EditableField multiples

**Impact**: 🔴 CRITIQUE - Structure complexe

---

### 16. ColumnControls
**Fichier**: `src/Components/QuoteEditor/components/OptionBlock/ColumnControls.tsx`

**État actuel**:
- Contrôles pour changer nombre de colonnes
- Boutons 1, 2, 3, 4 colonnes

**Modifications nécessaires**:
- [ ] Envelopper dans `<EditOnly>` pour masquer en print

**Éléments interactifs**:
- Tous les boutons

**Impact**: 🟢 FAIBLE - Simple à masquer

---

### 17. StyleSelector
**Fichier**: `src/Components/QuoteEditor/components/OptionBlock/StyleSelector.tsx`

**État actuel**:
- Sélecteur de couleur pour les blocs
- Color picker

**Modifications nécessaires**:
- [ ] Envelopper dans `<EditOnly>` pour masquer en print

**Éléments interactifs**:
- Color picker

**Impact**: 🟢 FAIBLE - Simple à masquer

---

### 18. OptionSelector
**Fichier**: `src/Components/QuoteEditor/components/OptionBlock/OptionSelector.tsx`

**État actuel**:
- Dropdown pour sélectionner type d'option

**Modifications nécessaires**:
- [ ] Envelopper dans `<EditOnly>` pour masquer en print

**Éléments interactifs**:
- Dropdown select

**Impact**: 🟢 FAIBLE - Simple à masquer

---

### 19. EditableField
**Fichier**: `src/Components/QuoteEditor/components/EditableField/EditableField.tsx`

**État actuel**:
- Champ texte éditable inline
- Double-clic pour éditer
- Input ou textarea selon mode
- Utilisé PARTOUT dans l'app

**Modifications nécessaires**:
- [ ] ⚠️ Ajouter prop `printMode: boolean`
- [ ] En mode print: rendre texte statique uniquement
- [ ] Supprimer border, padding, background en print
- [ ] Désactiver tous les event handlers en print
- [ ] Ajouter classes `print:tw-border-none print:tw-p-0 print:tw-bg-transparent`

**Code actuel (simplifié)**:
```typescript
export const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onSave,
  disabled = false,
  // ...
}) => {
  const [isEditing, setIsEditing] = useState(false);
  // ... logique d'édition

  return isEditing ? (
    <input ref={inputRef} value={editValue} ... />
  ) : (
    <Component onDoubleClick={handleDoubleClick}>
      {value}
    </Component>
  );
};
```

**Code cible**:
```typescript
export const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onSave,
  printMode = false, // ← NOUVEAU
  disabled = false,
  // ...
}) => {
  // En mode print, rendu statique uniquement
  if (printMode) {
    return (
      <Component className={clsx(className, 'print:tw-border-none print:tw-p-0')}>
        {value || placeholder}
      </Component>
    );
  }

  // Mode édition (code actuel inchangé)
  const [isEditing, setIsEditing] = useState(false);
  // ...
};
```

**Éléments interactifs**:
- Input/textarea
- Boutons save/cancel
- Event handlers (doubleClick, keyDown, blur)

**Impact**: 🔴 CRITIQUE - Composant utilisé partout (>100 fois)

---

### 20. EditableMarkdownField
**Fichier**: `src/Components/QuoteEditor/components/EditableField/EditableMarkdownField.tsx`

**État actuel**:
- Similaire à EditableField mais pour markdown
- Preview markdown

**Modifications nécessaires**:
- [ ] Ajouter prop `printMode: boolean`
- [ ] En mode print: rendre markdown statique (HTML)
- [ ] Supprimer contrôles d'édition

**Impact**: 🟡 MOYEN

---

### 21. SignatureSection
**Fichier**: `src/Components/QuoteEditor/components/SignatureSection/SignatureSection.tsx`

**État actuel**:
- Section signature client
- Upload signature
- EditableField

**Modifications nécessaires**:
- [ ] Recevoir prop `printMode`
- [ ] Masquer bouton upload en print
- [ ] Afficher signature statique
- [ ] Passer `printMode` aux EditableField

**Éléments interactifs**:
- Bouton upload
- EditableField

**Impact**: 🟡 MOYEN

---

### 22. CarbonImpact
**Fichier**: `src/Components/QuoteEditor/components/CarbonImpact/CarbonImpact.tsx`

**État actuel**:
- Affichage impact carbone
- EditableField

**Modifications nécessaires**:
- [ ] Recevoir prop `printMode`
- [ ] Passer `printMode` aux EditableField

**Éléments interactifs**:
- EditableField

**Impact**: 🟢 FAIBLE

---

### 23. InstructionsFrame
**Fichier**: `src/Components/QuoteEditor/components/InstructionsFrame/InstructionsFrame.tsx`

**État actuel**:
- Cadre d'instructions légales
- EditableField

**Modifications nécessaires**:
- [ ] Recevoir prop `printMode`
- [ ] Passer `printMode` à EditableField

**Éléments interactifs**:
- EditableField

**Impact**: 🟢 FAIBLE

---

### 24. QuoteEditorToolbar
**Fichier**: `src/Components/QuoteEditor/components/shared/QuoteEditorToolbar.tsx`

**État actuel**:
- Toolbar avec boutons (save, export, undo, redo)
- Visible en permanence

**Modifications nécessaires**:
- [ ] Envelopper dans `<EditOnly>` pour masquer en print
- [ ] Ou ajouter classe `print:tw-hidden` à la racine

**Éléments interactifs**:
- Tous les boutons

**Impact**: 🟢 FAIBLE - Simple à masquer

---

### 25. AddButton
**Fichier**: `src/Components/QuoteEditor/components/shared/AddButton.tsx`

**État actuel**:
- Bouton générique pour ajouter items

**Modifications nécessaires**:
- [ ] Ajouter classe `print:tw-hidden` à la racine

**Éléments interactifs**:
- Bouton

**Impact**: 🟢 FAIBLE - Simple à masquer

---

### 26. DragDropListItem
**Fichier**: `src/Components/QuoteEditor/components/shared/DragDropListItem.tsx`

**État actuel**:
- Wrapper générique pour drag & drop
- Drag handle
- Utilisé partout

**Modifications nécessaires**:
- [ ] Recevoir prop `printMode`
- [ ] Masquer drag handle en print: `<EditOnly>`
- [ ] Désactiver drag handlers en print

**Éléments interactifs**:
- Drag handle
- Event handlers drag & drop

**Impact**: 🔴 CRITIQUE - Utilisé partout

---

### 27. BlocksContainer
**Fichier**: `src/Components/QuoteEditor/components/shared/BlocksContainer.tsx`

**État actuel**:
- Conteneur pour option blocks
- Drag & drop réorganisation
- Boutons contrôles

**Modifications nécessaires**:
- [ ] Recevoir prop `printMode`
- [ ] Masquer boutons contrôles: `<EditOnly>`
- [ ] Désactiver drag & drop en print
- [ ] Passer `printMode` aux OptionBlock

**Éléments interactifs**:
- Boutons add/delete
- Drag & drop

**Impact**: 🟡 MOYEN

---

### 28. QuoteTabs
**Fichier**: `src/Components/QuoteEditor/components/QuoteTabs/QuoteTabs.tsx`

**État actuel**:
- Système d'onglets
- Drag & drop des onglets
- Boutons add/delete onglets

**Modifications nécessaires**:
- [ ] Recevoir prop `printMode`
- [ ] Masquer tabs en print (afficher tout le contenu linéairement)
- [ ] Ou adapter pour print avec page breaks entre onglets
- [ ] Passer `printMode` aux QuoteTabContent

**Éléments interactifs**:
- Tabs cliquables
- Drag handles sur tabs
- Boutons add/delete

**Impact**: 🔴 CRITIQUE - Structure principale alternative

**Note**: En mode print, on pourrait soit:
1. Masquer les tabs et afficher tout le contenu linéairement
2. Transformer en titres de sections avec page breaks

---

### 29. QuoteTabContent
**Fichier**: `src/Components/QuoteEditor/components/QuoteTabs/QuoteTabContent.tsx`

**État actuel**:
- Contenu d'un onglet
- Délègue aux composants (QuotePage, OptionBlock, etc.)

**Modifications nécessaires**:
- [ ] Recevoir prop `printMode`
- [ ] Propager aux sous-composants
- [ ] Ajouter page breaks entre tabs si nécessaire

**Éléments interactifs**:
- Délégués aux sous-composants

**Impact**: 🟡 MOYEN

---

## 🎨 Composants PDF à supprimer

Ces composants seront supprimés car remplacés par les composants React en mode print:

### À supprimer après migration

1. **PDFHeader** (`pdf/components/PDFHeader.tsx`)
   - Remplacé par: QuotePageHeader en mode print

2. **PDFRecipient** (`pdf/components/PDFRecipient.tsx`)
   - Remplacé par: QuotePageRecipient en mode print

3. **PDFIntro** (`pdf/components/PDFIntro.tsx`)
   - Remplacé par: QuotePageIntro en mode print

4. **PDFSections** (`pdf/components/PDFSections.tsx`)
   - Remplacé par: QuoteSection en mode print

5. **PDFTotals** (`pdf/components/PDFTotals.tsx`)
   - Remplacé par: QuotePageTotals en mode print

6. **PDFOptionBlocks** (`pdf/components/PDFOptionBlocks.tsx`)
   - Remplacé par: OptionBlock en mode print

7. **PDFClientSignature** (`pdf/components/PDFClientSignature.tsx`)
   - Remplacé par: SignatureSection en mode print

8. **PDFFooter** (`pdf/components/PDFFooter.tsx`)
   - Remplacé par: QuotePageFooter en mode print

9. **PDFCarbonImpact** (`pdf/components/PDFCarbonImpact.tsx`)
   - Remplacé par: CarbonImpact en mode print

10. **PDFBusServices** (`pdf/components/PDFBusServices.tsx`)
    - Remplacé par: BusServicesBlock en mode print

11. **PDFOrderForm** (`pdf/components/PDFOrderForm.tsx`)
    - Géré par: SignatureSection en mode print

12. **QuotePDFDocument** (`pdf/QuotePDFDocument.tsx`)
    - Remplacé par: Script Playwright de génération

---

## 📐 Styles PDF à migrer

### Fichiers de styles à convertir en Tailwind/CSS

1. **pageStyles.ts** → `@page` rules dans print.css
   - Marges de page
   - Format A4
   - Background

2. **headerStyles.ts** → Classes Tailwind dans QuotePageHeader
   - Layout header
   - Logo sizing
   - Typography

3. **footerStyles.ts** → Classes Tailwind dans QuotePageFooter
   - Layout footer
   - Typography
   - Positionnement

4. **tableStyles.ts** → Classes Tailwind dans QuoteSection
   - Table layout
   - Cell styling
   - Borders

5. **optionBlocksStyles.ts** → Classes Tailwind dans OptionBlock
   - Block layout
   - Multi-columns
   - Typography

6. **recipientStyles.ts** → Classes Tailwind dans QuotePageRecipient
   - Layout destinataire
   - Typography

7. **introStyles.ts** → Classes Tailwind dans QuotePageIntro
   - Layout intro
   - Typography

8. **totalsStyles.ts** → Classes Tailwind dans QuotePageTotals
   - Table totaux
   - Typography
   - Emphasis

9. **clientSignatureStyles.ts** → Classes Tailwind dans SignatureSection
   - Layout signature
   - Image sizing

---

## 🎯 Priorités de migration

### Phase 1 - Composants critiques (1ère priorité)
1. **EditableField** - Utilisé partout, impact majeur
2. **DragDropListItem** - Utilisé partout
3. **QuotePage** - Page principale
4. **QuoteSection** - Tableaux complexes
5. **OptionBlock** - Blocs multi-colonnes

### Phase 2 - Composants moyens (2ème priorité)
6. **TableRow** - Lignes de tableau
7. **OptionRow / NoteRow** - Items de blocs
8. **QuoteTabs** - Structure alternative
9. **BlocksContainer** - Conteneur blocs
10. **TripProgramBlock** - Programme voyage

### Phase 3 - Composants simples (3ème priorité)
11. **QuotePageHeader/Footer/Recipient/Intro/Totals** - Sections simples
12. **SignatureSection** - Upload signature
13. **CarbonImpact** - Impact carbone
14. **QuoteEditorToolbar** - Toolbar (simple à masquer)
15. **AddButton / ColumnControls / StyleSelector** - Boutons (simples à masquer)

---

## 📊 Estimation du travail

### Par composant

| Composant | Complexité | Temps estimé | Priorité |
|-----------|-----------|--------------|----------|
| EditableField | 🔴 Haute | 3h | P1 |
| DragDropListItem | 🔴 Haute | 2h | P1 |
| QuotePage | 🔴 Haute | 2h | P1 |
| QuoteSection | 🔴 Haute | 4h | P1 |
| OptionBlock | 🔴 Haute | 3h | P1 |
| TableRow | 🟡 Moyenne | 2h | P2 |
| OptionRow/NoteRow | 🟡 Moyenne | 1h | P2 |
| QuoteTabs | 🟡 Moyenne | 2h | P2 |
| TripProgramBlock | 🟡 Moyenne | 2h | P2 |
| BlocksContainer | 🟡 Moyenne | 1h | P2 |
| Autres composants | 🟢 Faible | 5h | P3 |
| **Total** | | **27h** | |

### Par phase

| Phase | Tâches | Temps estimé |
|-------|--------|--------------|
| Phase 1: Analyse | Audit + Documentation | 8h |
| Phase 2: CSS Config | print.css + Tailwind | 6h |
| Phase 3: Composants | Refactoring composants | 27h |
| Phase 4: Paged.js | Intégration + Config | 8h |
| Phase 5: Playwright | Script génération PDF | 10h |
| Phase 6: Tests | Tests + Debug | 12h |
| Phase 7: Nettoyage | Suppression ancien code | 4h |
| **Total** | | **75h (~2 semaines)** |

---

## 🚀 Prochaines actions

1. ✅ Audit terminé
2. ⏭️ Créer print.css avec @media print rules
3. ⏭️ Créer composants PrintOnly/EditOnly
4. ⏭️ Refactorer EditableField (impact majeur)
5. ⏭️ Refactorer DragDropListItem
6. ⏭️ Propager printMode dans toute l'arborescence

---

**Dernière mise à jour**: 2025-10-29

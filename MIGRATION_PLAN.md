# Plan de Migration vers Print-Friendly PDF (Playwright + Paged.js)

**Date de création**: 2025-10-29
**Statut**: En cours
**Objectif**: Remplacer la double implémentation (React + @react-pdf/renderer) par un système unifié print-friendly

---

## 📋 Table des matières

1. [Contexte et problématique](#contexte-et-problématique)
2. [Architecture cible](#architecture-cible)
3. [Étapes de migration](#étapes-de-migration)
4. [Checklist d'avancement](#checklist-davancement)
5. [Points d'attention](#points-dattention)
6. [Tests et validation](#tests-et-validation)

---

## 🎯 Contexte et problématique

### Problèmes identifiés

**Double implémentation séparée**
- Interface éditable : composants React avec Tailwind (QuotePage.tsx, QuoteSection.tsx, etc.)
- PDF : composants @react-pdf/renderer complètement différents dans `/pdf/`
- Les deux n'utilisent pas le même code → maintenance difficile, risque de divergence

**Tailwind non utilisable directement**
- Les composants PDF utilisent des styles inline JavaScript (`pdf/styles/`)
- Le Tailwind de l'interface web ne s'applique pas aux composants PDF
- Duplication des styles entre web et PDF

**Structure inadaptée**
- Présence de contrôles éditables (boutons, drag & drop, inputs)
- Pas de classes print-specific
- Pas de media queries `@media print`
- ~300 occurrences d'éléments interactifs dans les composants

### Solution proposée

**Un seul système unifié** avec Playwright + Paged.js :
- Une seule version du QuoteEditor
- Affichable/éditable à l'écran (avec Tailwind)
- Print-friendly (avec `@media print` pour masquer les contrôles)
- Compatible Paged.js (avec classes CSS Paged Media comme `@page`, `page-break-*`)
- Génération PDF haute qualité via Playwright

---

## 🏗️ Architecture cible

### Stack technique

```
┌─────────────────────────────────────────────────┐
│          QuoteEditor Component                   │
│                                                  │
│  Mode: edit | print (via prop)                  │
└──────────────────┬──────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
   ┌────▼─────┐         ┌────▼─────┐
   │   Edit   │         │  Print   │
   │   Mode   │         │   Mode   │
   └──────────┘         └──────────┘
        │                     │
   Interactive UI       Static Content
   + Tailwind          + @media print
   + Controls          + Paged.js classes
        │                     │
        └──────────┬──────────┘
                   │
            ┌──────▼──────┐
            │  Playwright │
            │  + Paged.js │
            └──────┬──────┘
                   │
              ┌────▼────┐
              │   PDF   │
              └─────────┘
```

### Composants refactorisés

Chaque composant aura :
1. **Props `printMode: boolean`** pour basculer entre edit et print
2. **Classes Tailwind avec variantes print:** `print:tw-hidden`, `print:tw-visible`
3. **Rendu conditionnel** pour masquer les contrôles interactifs
4. **Attributs data-print** pour aider Paged.js à paginer

---

## 📝 Étapes de migration

### Phase 1: Analyse et Préparation (2-3 jours)

#### 1.1 Audit des composants existants
- [ ] Lister tous les composants React interactifs
- [ ] Identifier tous les gestionnaires d'événements (onClick, onDrag, etc.)
- [ ] Cartographier les composants `/pdf/` et leurs équivalents React
- [ ] Documenter les différences de style entre web et PDF

**Fichiers à auditer:**
```
src/Components/QuoteEditor/
├── components/
│   ├── QuotePage/          ✓ Principal
│   ├── QuoteSection/       ✓ Tableaux interactifs
│   ├── OptionBlock/        ✓ Multi-colonnes + drag
│   ├── EditableField/      ✓ Édition inline
│   ├── SignatureSection/   ✓ Upload signature
│   └── shared/            ✓ Boutons, drag handles
```

#### 1.2 Cartographie des styles
- [ ] Extraire tous les styles de `/pdf/styles/` vers une matrice
- [ ] Identifier les équivalents Tailwind possibles
- [ ] Lister les styles CSS custom nécessaires
- [ ] Créer un mapping complet style PDF → Tailwind

**Fichiers styles PDF à migrer:**
```
pdf/styles/
├── pageStyles.ts           → @page rules
├── headerStyles.ts         → header print styles
├── footerStyles.ts         → footer print styles
├── tableStyles.ts          → table print styles
├── optionBlocksStyles.ts   → blocks print styles
└── ...
```

#### 1.3 Documentation des points de rupture
- [ ] Identifier où Paged.js doit couper les pages
- [ ] Documenter les éléments qui ne doivent pas être coupés
- [ ] Planifier la gestion des en-têtes/pieds répétés
- [ ] Définir les marges et formats de page

---

### Phase 2: Configuration CSS et Tailwind (1-2 jours)

#### 2.1 Créer print.css
- [ ] Créer `src/styles/print.css`
- [ ] Ajouter les media queries `@media print`
- [ ] Définir les règles `@page` pour Paged.js
- [ ] Configurer les marges, format A4, orientation

**Exemple de structure:**
```css
/* print.css */
@media print {
  /* Masquer tous les contrôles interactifs */
  .print-hide { display: none !important; }

  /* Format de page */
  @page {
    size: A4 portrait;
    margin: 2cm 1.5cm;
  }

  /* En-tête répété */
  @page :first {
    margin-top: 1cm;
  }

  /* Éviter coupures */
  .no-break { page-break-inside: avoid; }

  /* Forcer nouvelle page */
  .page-break { page-break-before: always; }
}
```

#### 2.2 Étendre la configuration Tailwind
- [ ] Ajouter variantes `print:` dans tailwind.config.js
- [ ] Créer classes custom pour Paged.js
- [ ] Ajouter utilities pour page-break
- [ ] Configurer les dimensions de page

**Modifications tailwind.config.js:**
```javascript
module.exports = {
  theme: {
    extend: {
      // Classes print
      screens: {
        'print': {'raw': 'print'},
      },
      // Page dimensions
      width: {
        'a4': '21cm',
      },
      height: {
        'a4': '29.7cm',
      },
    }
  },
  plugins: [
    // Plugin custom pour print utilities
    function({ addUtilities }) {
      addUtilities({
        '.page-break-before': { 'page-break-before': 'always' },
        '.page-break-after': { 'page-break-after': 'always' },
        '.page-break-inside-avoid': { 'page-break-inside': 'avoid' },
        '.no-widows': { 'widows': '3' },
        '.no-orphans': { 'orphans': '3' },
      })
    }
  ]
}
```

#### 2.3 Import et configuration globale
- [ ] Importer print.css dans main.tsx ou index.css
- [ ] Vérifier que les styles s'appliquent correctement
- [ ] Tester avec browser DevTools (mode print preview)

---

### Phase 3: Refactorisation des composants (4-5 jours)

#### 3.1 Créer les composants de base print-friendly

**A. EditableField avec mode print**
- [ ] Ajouter prop `printMode: boolean`
- [ ] Rendre le texte statique en mode print
- [ ] Supprimer tous les event handlers en mode print
- [ ] Ajouter classes `print:tw-border-none print:tw-p-0`

**Fichier:** `src/Components/QuoteEditor/components/EditableField/EditableField.tsx`

**Modifications:**
```typescript
interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
  printMode?: boolean;  // ← Nouveau
  // ... autres props
}

export const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onSave,
  printMode = false,  // ← Nouveau
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

  // Mode édition normal
  return (
    // ... code actuel
  );
};
```

**B. Wrapper PrintOnly / EditOnly**
- [ ] Créer composant `<PrintOnly>`
- [ ] Créer composant `<EditOnly>`
- [ ] Utiliser pour conditionner le rendu

**Fichiers:** `src/Components/QuoteEditor/components/shared/PrintWrappers.tsx`

```typescript
export const PrintOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="tw-hidden print:tw-block">{children}</div>
);

export const EditOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="tw-block print:tw-hidden">{children}</div>
);
```

#### 3.2 Refactoriser les composants principaux

**A. QuotePage**
- [ ] Ajouter prop `printMode: boolean`
- [ ] Propager `printMode` à tous les sous-composants
- [ ] Envelopper les contrôles dans `<EditOnly>`
- [ ] Adapter les classes Tailwind avec variantes print
- [ ] Ajouter attributs `data-print-section`

**Fichier:** `src/Components/QuoteEditor/components/QuotePage/QuotePage.tsx`

**B. QuoteSection**
- [ ] Recevoir `printMode` en prop
- [ ] Masquer les drag handles en print
- [ ] Masquer les boutons add/delete en print
- [ ] Optimiser le rendu des tableaux pour éviter coupures
- [ ] Ajouter `page-break-inside-avoid` sur les lignes critiques

**Fichier:** `src/Components/QuoteEditor/components/QuoteSection/QuoteSection.tsx`

**C. OptionBlock**
- [ ] Recevoir `printMode` en prop
- [ ] Masquer les contrôles de colonnes en print
- [ ] Désactiver le drag & drop en print
- [ ] Adapter le rendu multi-colonnes pour print (CSS columns)

**Fichier:** `src/Components/QuoteEditor/components/OptionBlock/OptionBlock.tsx`

**D. SignatureSection**
- [ ] Adapter pour print (pas d'upload)
- [ ] Afficher signature statique en mode print
- [ ] Masquer les contrôles

**Fichier:** `src/Components/QuoteEditor/components/SignatureSection/SignatureSection.tsx`

**E. Shared components**
- [ ] AddButton → ajouter `print:tw-hidden`
- [ ] DragDropListItem → désactiver drag en print
- [ ] QuoteEditorToolbar → masquer en print

#### 3.3 Migrer les styles PDF vers Tailwind
- [ ] Convertir `headerStyles.ts` en classes Tailwind
- [ ] Convertir `footerStyles.ts` en classes Tailwind
- [ ] Convertir `tableStyles.ts` en classes Tailwind
- [ ] Convertir `optionBlocksStyles.ts` en classes Tailwind
- [ ] Créer classes custom si nécessaire dans print.css

---

### Phase 4: Intégration Paged.js (2-3 jours)

#### 4.1 Installation
- [ ] `npm install pagedjs`
- [ ] `npm install playwright`
- [ ] `npm install -D @types/pagedjs` (si disponible)

#### 4.2 Configuration Paged.js
- [ ] Créer `src/utils/pagedConfig.ts`
- [ ] Définir les options Paged.js (format, marges)
- [ ] Configurer les named pages si nécessaire
- [ ] Configurer les running headers/footers

**Fichier:** `src/utils/pagedConfig.ts`

```typescript
export const pagedConfig = {
  size: 'A4',
  orientation: 'portrait',
  margin: {
    top: '2cm',
    bottom: '2cm',
    left: '1.5cm',
    right: '1.5cm',
  },
  // Options avancées
  widows: 3,
  orphans: 3,
  // Running headers
  runningHeaders: true,
};
```

#### 4.3 Intégration dans QuoteEditor
- [ ] Charger Paged.js conditionnellement en mode print
- [ ] Ajouter un bouton "Preview PDF" qui charge en mode print
- [ ] Créer un composant `<PagedPreview>` pour tester

---

### Phase 5: Génération PDF avec Playwright (2-3 jours)

#### 5.1 Script de génération PDF
- [ ] Créer `scripts/generatePDF.ts` ou `server/pdf-generator.ts`
- [ ] Configurer Playwright pour lancer un browser headless
- [ ] Charger la page avec `printMode=true`
- [ ] Attendre le rendu complet de Paged.js
- [ ] Générer le PDF avec `page.pdf()`

**Fichier:** `scripts/generatePDF.ts`

```typescript
import { chromium } from 'playwright';

export async function generatePDF(htmlContent: string, outputPath: string) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Charger le contenu HTML
  await page.setContent(htmlContent, { waitUntil: 'networkidle' });

  // Attendre que Paged.js ait fini de paginer
  await page.waitForSelector('[data-page-number]', { timeout: 10000 });

  // Générer le PDF
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '2cm',
      bottom: '2cm',
      left: '1.5cm',
      right: '1.5cm',
    },
  });

  await browser.close();
}
```

#### 5.2 API endpoint ou hook
- [ ] Créer une fonction `exportPDFPlaywright` dans hooks
- [ ] Remplacer `usePDFExport` actuel
- [ ] Gérer les erreurs et timeouts
- [ ] Ajouter un système de loading

**Fichier:** `src/Components/QuoteEditor/hooks/usePDFExportPlaywright.ts`

```typescript
export const usePDFExportPlaywright = () => {
  const exportToPDF = async (data: QuoteData) => {
    try {
      // 1. Générer le HTML avec printMode=true
      const htmlContent = renderToString(
        <QuoteEditor data={data} printMode={true} />
      );

      // 2. Envoyer au serveur pour génération PDF
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: htmlContent, filename: `devis-${data.quote.number}.pdf` }),
      });

      // 3. Télécharger le PDF
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `devis-${data.quote.number}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      throw error;
    }
  };

  return { exportToPDF };
};
```

#### 5.3 Backend API (si nécessaire)
- [ ] Créer route POST `/api/generate-pdf`
- [ ] Recevoir le HTML et les options
- [ ] Appeler Playwright pour générer le PDF
- [ ] Retourner le blob PDF

**Fichier:** `server/routes/pdf.ts` (ou Supabase Edge Function)

---

### Phase 6: Nettoyage et optimisation (1-2 jours)

#### 6.1 Supprimer l'ancien système
- [ ] ⚠️ Créer une branche de backup avant suppression
- [ ] Supprimer le dossier `/pdf/` complet
- [ ] Supprimer `usePDFExport.tsx` (ancien)
- [ ] Supprimer la dépendance `@react-pdf/renderer` du package.json
- [ ] Nettoyer les imports inutilisés

#### 6.2 Mise à jour de QuoteEditor.tsx
- [ ] Remplacer l'import de `usePDFExport` par `usePDFExportPlaywright`
- [ ] Supprimer la prop `usePDFV2` (plus nécessaire)
- [ ] Simplifier la logique d'export PDF
- [ ] Tester les deux modes (edit et print)

#### 6.3 Tests complets
- [ ] Tester avec des devis courts (1 page)
- [ ] Tester avec des devis longs (multi-pages)
- [ ] Tester avec toutes les combinaisons de blocs
- [ ] Tester la pagination des tableaux
- [ ] Tester les images et logos
- [ ] Tester sur différents navigateurs
- [ ] Vérifier les performances

---

## ✅ Checklist d'avancement

### Phase 1: Analyse et Préparation
- [ ] Audit des composants interactifs terminé
- [ ] Cartographie PDF → React complétée
- [ ] Mapping des styles créé
- [ ] Documentation des points de rupture

### Phase 2: Configuration CSS
- [ ] Fichier print.css créé et configuré
- [ ] Tailwind étendu avec variantes print
- [ ] Classes Paged.js ajoutées
- [ ] Tests DevTools print preview OK

### Phase 3: Refactorisation composants
- [ ] EditableField refactorisé
- [ ] PrintOnly/EditOnly créés
- [ ] QuotePage adapté avec printMode
- [ ] QuoteSection adapté
- [ ] OptionBlock adapté
- [ ] SignatureSection adapté
- [ ] Shared components mis à jour
- [ ] Styles PDF migrés vers Tailwind

### Phase 4: Intégration Paged.js
- [ ] Paged.js installé
- [ ] Configuration créée
- [ ] Preview PDF fonctionnel
- [ ] Pagination testée

### Phase 5: Génération PDF Playwright
- [ ] Playwright installé
- [ ] Script de génération créé
- [ ] Hook usePDFExportPlaywright créé
- [ ] API backend configurée (si nécessaire)
- [ ] Tests de génération OK

### Phase 6: Nettoyage
- [ ] Dossier /pdf/ supprimé
- [ ] @react-pdf/renderer désinstallé
- [ ] Documentation mise à jour
- [ ] Tests E2E validés

### Phase 7: Production
- [ ] Build en production OK
- [ ] Performance validée
- [ ] Déploiement effectué
- [ ] Monitoring en place

---

## ⚠️ Points d'attention

### Performance
- **Génération plus lente**: Playwright lance un browser headless, ce qui prend 2-5 secondes
- **Solution**: Ajouter un indicateur de chargement clair
- **Optimisation**: Possibilité de mettre en cache le HTML généré

### Infrastructure
- **Serveur Node.js requis**: Playwright ne fonctionne pas côté client uniquement
- **Solutions**:
  - Déployer une API Express simple
  - Utiliser Supabase Edge Functions avec Deno
  - Utiliser un service serverless (Vercel, Netlify Functions)

### Compatibilité CSS
- **Limitations Paged.js**: Certains styles CSS complexes (flexbox imbriqués, grid avancés) peuvent mal se comporter
- **Solution**: Tester systématiquement et utiliser des layouts simples pour le print
- **Fallback**: Utiliser des tables HTML pour layouts critiques

### Polices
- **Chargement des fonts**: Les polices personnalisées doivent être chargées avant génération PDF
- **Solution**:
  - Utiliser `@font-face` avec chemins absolus
  - Attendre le chargement avec `document.fonts.ready`
  - Embed les fonts en base64 si nécessaire

### Images
- **Images externes**: Les URLs d'images doivent être accessibles depuis le serveur Playwright
- **Solution**:
  - Convertir en base64 avant génération
  - Utiliser des URLs absolues
  - Précharger toutes les images

### Breakpoints responsive
- **Conflit possible**: Les breakpoints responsive peuvent interférer avec le print
- **Solution**: Utiliser `@media print` avec priorité élevée pour override

---

## 🧪 Tests et validation

### Tests unitaires
- [ ] Composants avec `printMode=true` rendent correctement
- [ ] Composants avec `printMode=false` restent interactifs
- [ ] Classes print sont appliquées correctement

### Tests d'intégration
- [ ] QuoteEditor en mode print charge sans erreurs
- [ ] Paged.js pagine correctement
- [ ] Aucun contrôle interactif n'apparaît en mode print

### Tests E2E avec Playwright
- [ ] Génération PDF réussit pour devis simple
- [ ] Génération PDF réussit pour devis complexe multi-pages
- [ ] Images et logos apparaissent correctement
- [ ] Pagination est correcte (pas de coupures bizarres)
- [ ] Fichier PDF est bien téléchargé

### Tests de régression
- [ ] Mode édition fonctionne toujours normalement
- [ ] Drag & drop fonctionne
- [ ] Edition inline fonctionne
- [ ] Calculs automatiques fonctionnent
- [ ] Historique undo/redo fonctionne

### Tests de performance
- [ ] Temps de génération PDF < 10 secondes
- [ ] Pas de memory leaks dans Playwright
- [ ] Taille du PDF raisonnable (< 5 MB)

### Tests cross-browser
- [ ] Chrome: mode print OK
- [ ] Firefox: mode print OK
- [ ] Safari: mode print OK
- [ ] Edge: mode print OK

---

## 📊 Métriques de succès

### Avant migration
- 2 implémentations séparées (React + @react-pdf)
- ~97 fichiers dont 12 dédiés au PDF
- Maintenance complexe (2 endroits à modifier)
- Styles dupliqués (Tailwind + JS inline)

### Après migration
- 1 seule implémentation unifiée
- ~85 fichiers (suppression de /pdf/)
- Maintenance simplifiée (1 seul endroit)
- Styles unifiés (Tailwind partout)
- Qualité PDF identique ou supérieure
- Génération: 2-5 secondes (acceptable)

---

## 📚 Ressources et documentation

### Documentation technique
- [Paged.js Documentation](https://pagedjs.org/documentation/)
- [Playwright PDF API](https://playwright.dev/docs/api/class-page#page-pdf)
- [CSS Paged Media](https://www.w3.org/TR/css-page-3/)
- [Tailwind Print Variant](https://tailwindcss.com/docs/hover-focus-and-other-states#print-styles)

### Exemples de code
- [Paged.js Examples](https://gitlab.coko.foundation/pagedjs/examples)
- [Playwright PDF Examples](https://github.com/microsoft/playwright/tree/main/examples)

### Outils de debug
- Chrome DevTools: Rendering → Emulate CSS media print
- Firefox: File → Print Preview
- Playwright Inspector: `PWDEBUG=1 node script.js`

---

## 🚀 Prochaines étapes

1. **Valider ce plan** avec l'équipe
2. **Créer une branche dédiée**: `feature/print-friendly-migration`
3. **Commencer par la Phase 1** (Analyse)
4. **Itérer et tester** après chaque phase
5. **Documenter les découvertes** et ajuster le plan si nécessaire

---

**Dernière mise à jour**: 2025-10-29
**Responsable**: À définir
**Estimation totale**: 12-16 jours de développement

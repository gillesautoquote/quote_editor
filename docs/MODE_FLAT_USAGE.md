# Guide d'utilisation du Mode Flat et Print

## 🎯 Vue d'ensemble

Le QuoteEditor dispose maintenant de **deux nouveaux modes** pour optimiser la génération de PDF:

1. **Mode Flat** (`flatMode`) - Affichage linéaire de tout le contenu
2. **Mode Print** (`printMode`) - Optimisations pour l'impression

## 📄 Mode Flat

### Qu'est-ce que c'est?

Le mode flat désactive les onglets et affiche **tout le contenu de manière séquentielle** sur une seule page défilante.

### Ordre de rendu

Quand le mode flat est activé, le contenu s'affiche dans cet ordre précis:

1. **En-tête** (Header) - Logo, infos entreprise, numéro devis
2. **Introduction** - Destinataire et message d'introduction
3. **Programme de voyage** - Toutes les étapes chronologiquement
4. **Services autocar** - Liste des services inclus
5. **Impact carbone** (si présent)
6. **Cotation** - Toutes les sections de tarification
7. **Totaux** - Tableau récapitulatif HT/TVA/TTC
8. **Conditions** - Toutes les conditions générales
9. **Signature** - Zone de signature client
10. **Pied de page** (Footer) - Mentions légales

### Comment l'activer?

#### Dans l'interface de démonstration

Cliquez sur le bouton **"📄 Mode Flat OFF"** dans la barre d'outils en haut. Le bouton devient violet quand activé.

#### En code React

```tsx
<QuoteEditor
  data={quoteData}
  flatMode={true}
  readonly={true}
/>
```

#### Via URL (pour tests)

```
http://localhost:5173?flatMode=true
```

### Pourquoi l'utiliser?

✅ **Pour la génération PDF** - Paged.js peut calculer automatiquement les sauts de page
✅ **Pour l'export** - Tout le contenu est visible d'un coup
✅ **Pour l'impression** - Le navigateur peut paginer correctement
✅ **Pour les screenshots** - Capture complète du devis

## 🖨️ Mode Print

### Qu'est-ce que c'est?

Le mode print applique des **optimisations spécifiques** pour l'impression et la génération de PDF.

### Optimisations appliquées

1. **Masquage des contrôles**
   - Tous les boutons (édition, ajout, suppression)
   - Poignées de drag & drop
   - Toolbar
   - Sélecteurs et contrôles interactifs

2. **Réduction des espacements**
   - Paddings réduits de 50%
   - Margins optimisés
   - Hauteurs de lignes ajustées

3. **Protection contre les coupures**
   - Étapes du programme: `page-break-inside: avoid`
   - Tableau totaux: `page-break-inside: avoid`
   - Signature: `page-break-inside: avoid`
   - Footer: `page-break-inside: avoid`

4. **Optimisation des textes**
   - Tailles de police réduites (75% de la taille normale)
   - Line-height ajusté pour densité

5. **Préservation des couleurs**
   - `print-color-adjust: exact`
   - Arrière-plans et bordures préservés

### Comment l'activer?

#### Dans l'interface de démonstration

Cliquez sur le bouton **"🖨️ Print OFF"** dans la barre d'outils en haut. Le bouton devient orange quand activé.

#### En code React

```tsx
<QuoteEditor
  data={quoteData}
  printMode={true}
  readonly={true}
/>
```

#### Via URL (pour tests)

```
http://localhost:5173?printMode=true
```

### Pourquoi l'utiliser?

✅ **Pour prévisualiser le PDF** - Voir exactement ce qui sera imprimé
✅ **Pour optimiser l'espace** - Contenu plus dense et compact
✅ **Pour tester la pagination** - Vérifier qu'aucun élément n'est coupé
✅ **Pour l'impression navigateur** - Ctrl+P donne un meilleur résultat

## 🔥 Mode Combiné (Recommandé pour PDF)

### La meilleure configuration

Pour générer un PDF optimal, **activez les deux modes ensemble**:

```tsx
<QuoteEditor
  data={quoteData}
  flatMode={true}
  printMode={true}
  readonly={true}
  showToolbar={false}
/>
```

### Résultat

- ✅ Contenu linéaire (pas d'onglets)
- ✅ Tout visible sur une seule vue défilante
- ✅ Optimisations print actives
- ✅ Aucun contrôle interactif visible
- ✅ Prêt pour Paged.js + Playwright

### Dans l'interface

1. Activez **"📄 Mode Flat ON"** (bouton violet)
2. Activez **"🖨️ Print ON"** (bouton orange)
3. Le devis s'affiche maintenant exactement comme il apparaîtra dans le PDF

## 🎨 Preview en direct

### Comment prévisualiser le PDF?

1. **Lancez l'application** : `npm run dev`
2. **Ouvrez le navigateur** : http://localhost:5173
3. **Activez Mode Flat** : Cliquez sur le bouton "📄 Mode Flat OFF"
4. **Activez Mode Print** : Cliquez sur le bouton "🖨️ Print OFF"
5. **Défilez** pour voir tout le contenu linéairement

### Ce que vous verrez

- Tous les onglets ont disparu
- Le contenu s'affiche dans l'ordre séquentiel
- Les boutons et contrôles sont masqués
- Les espacements sont réduits
- Les couleurs sont préservées
- Le layout est optimisé pour A4

### Tester l'impression navigateur

1. Activez Mode Flat + Mode Print
2. Appuyez sur **Ctrl+P** (Windows) ou **Cmd+P** (Mac)
3. Aperçu avant impression du navigateur
4. Les sauts de page sont calculés automatiquement
5. Aucun élément important n'est coupé

## 🤖 Génération PDF avec Playwright

### Script complet

```javascript
import { chromium } from 'playwright';

async function generateQuotePDF(quoteData, outputPath) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // 1. Naviguer vers l'app
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // 2. Injecter les données
  await page.evaluate((data) => {
    window.__QUOTE_DATA__ = data;
  }, quoteData);

  // 3. Activer flatMode et printMode
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('setDisplayMode', {
      detail: { flatMode: true, printMode: true }
    }));
  });

  // 4. Attendre le rendu
  await page.waitForSelector('[data-component="quote-flat-view"]', {
    state: 'visible',
    timeout: 10000
  });

  // 5. Injecter Paged.js
  await page.addScriptTag({
    url: 'https://unpkg.com/pagedjs@0.4.3/dist/paged.polyfill.js'
  });

  // 6. Attendre pagination
  await page.evaluate(() => {
    return new Promise((resolve) => {
      if (window.PagedPolyfill) {
        window.PagedPolyfill.ready.then(resolve);
      } else {
        resolve();
      }
    });
  });

  // 7. Attendre rendu complet
  await page.waitForTimeout(1500);

  // 8. Générer PDF
  const pdf = await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();

  console.log(`✅ PDF généré: ${outputPath}`);
  return pdf;
}

// Utilisation
const quoteData = { /* vos données */ };
generateQuotePDF(quoteData, './devis-12345.pdf');
```

### Points importants

1. **Toujours activer flatMode + printMode ensemble**
2. **Attendre `[data-component="quote-flat-view"]`** pour être sûr que le rendu est terminé
3. **Injecter Paged.js** pour la pagination automatique
4. **Attendre `PagedPolyfill.ready`** avant de générer le PDF
5. **Délai de 1-2 secondes** pour le rendu des fonts et images

## 🔍 Débogage

### Le contenu est coupé

❌ **Problème**: Des éléments sont coupés entre les pages

✅ **Solution**:
- Vérifiez que `printMode={true}` est activé
- Vérifiez que Paged.js est bien chargé
- Inspectez les attributs `data-print-group`
- Vérifiez les classes `page-break-inside-avoid`

### Les couleurs ne s'affichent pas

❌ **Problème**: Les arrière-plans colorés sont blancs dans le PDF

✅ **Solution**:
- Utilisez `printBackground: true` dans `page.pdf()`
- Vérifiez que les éléments ont la classe `print-color-adjust`
- Vérifiez `print-color-adjust: exact` dans le CSS

### Les boutons sont visibles

❌ **Problème**: Les boutons d'édition apparaissent dans le PDF

✅ **Solution**:
- Activez `printMode={true}`
- Vérifiez que les boutons ont `className="print:tw-hidden"`
- Ou vérifiez `{!printMode && <button>}`

### Le layout est cassé

❌ **Problème**: La mise en page ne ressemble pas à l'aperçu

✅ **Solution**:
- Activez `flatMode={true}`
- Vérifiez qu'il n'y a pas de `position: fixed` ou `absolute`
- Vérifiez que `preferCSSPageSize: true` dans `page.pdf()`

## 📚 Références

- **Documentation complète**: `docs/PAGED_JS_INTEGRATION.md`
- **Attributs data-***: `docs/DATA_ATTRIBUTES.md`
- **Styles print**: `src/styles/print.css`
- **Hook usePaged**: `src/Components/QuoteEditor/hooks/usePaged.ts`
- **Composant QuoteFlatView**: `src/Components/QuoteEditor/components/QuotePage/QuoteFlatView.tsx`

## 💡 Cas d'usage

### 1. Développement et tests

```tsx
// Mode normal avec onglets
<QuoteEditor data={data} />

// Test du mode flat
<QuoteEditor data={data} flatMode={true} />

// Test du rendu PDF
<QuoteEditor data={data} flatMode={true} printMode={true} readonly={true} />
```

### 2. Production - Export PDF

```tsx
// Configuration optimale pour PDF
<QuoteEditor
  data={quoteData}
  flatMode={true}
  printMode={true}
  readonly={true}
  showToolbar={false}
/>
```

### 3. Impression navigateur

```tsx
// Pour Ctrl+P / Cmd+P
<QuoteEditor
  data={quoteData}
  printMode={true}  // flatMode optionnel
/>
```

### 4. Screenshots

```tsx
// Pour capturer tout le devis
<QuoteEditor
  data={quoteData}
  flatMode={true}
  printMode={true}
  readonly={true}
/>
```

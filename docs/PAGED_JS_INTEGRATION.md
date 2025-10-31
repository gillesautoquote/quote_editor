# Guide d'intégration Paged.js avec Playwright

Ce document explique comment générer des PDF professionnels à partir du composant QuoteEditor en utilisant Playwright et Paged.js pour une pagination automatique optimale.

## Architecture de rendu

### Mode normal (avec onglets)
```
QuoteEditor (useTabs=true)
  └─ QuoteTabs
      ├─ Tab: Introduction
      ├─ Tab: Programme
      ├─ Tab: Services
      ├─ Tab: Cotation
      ├─ Tab: Conditions
      └─ Tab: Signature
```

### Mode flat (pour PDF)
```
QuoteEditor (flatMode=true ou printMode=true)
  └─ QuoteFlatView
      ├─ QuotePageHeader
      ├─ Introduction
      ├─ Programme de voyage
      ├─ Services autocar
      ├─ Cotation (sections)
      ├─ Totaux
      ├─ Conditions
      ├─ Signature
      └─ QuotePageFooter
```

## Workflow Playwright + Paged.js

### Script complet de génération

```javascript
import { chromium } from 'playwright';

async function generateQuotePDF(quoteData, outputPath) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // 1. Naviguer vers l'application
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

  // 2. Injecter les données
  await page.evaluate((data) => {
    window.__QUOTE_DATA__ = data;
  }, quoteData);

  // 3. Activer mode print et flat
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('setPrintMode', {
      detail: { printMode: true, flatMode: true }
    }));
  });

  // 4. Attendre rendu complet
  await page.waitForSelector('[data-component="quote-flat-view"]');

  // 5. Injecter Paged.js
  await page.addScriptTag({
    url: 'https://unpkg.com/pagedjs@0.4.3/dist/paged.polyfill.js'
  });

  // 6. Attendre pagination
  await page.evaluate(() => window.PagedPolyfill.ready);
  await page.waitForTimeout(1000);

  // 7. Générer PDF
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();
  return pdf;
}
```

## Sélecteurs CSS importants

### Par data-component

```css
[data-component="quote-flat-view"] { }
[data-component="quote-header"] { page-break-after: avoid; }
[data-component="quote-footer"] { page-break-inside: avoid; }
[data-component="quote-section"] { page-break-inside: avoid; }
[data-component="option-block"] { }
[data-component="trip-program"] { }
[data-component="totals-table"] { page-break-inside: avoid; }
[data-component="signature-section"] { page-break-inside: avoid; }
```

### Par data-print-group

```css
[data-print-group="trip-day"] { page-break-inside: avoid; }
[data-print-group="trip-step"] { page-break-inside: avoid; }
[data-print-group="conditions-group"] { }
```

## Configuration @page

```css
@page {
  size: A4 portrait;
  margin-top: 2cm;
  margin-bottom: 2cm;
  margin-left: 1.5cm;
  margin-right: 1.5cm;
}

@page :first {
  margin-top: 1cm;
}

@page {
  @bottom-right {
    content: "Page " counter(page) " / " counter(pages);
    font-size: 9pt;
  }
}
```

## Troubleshooting

### Header coupé
- Ajouter `page-break-after: avoid`
- Limiter hauteur logo à 2cm
- Forcer `position: relative`

### Footer manquant
- Utiliser `position: running()` pour footer répété
- Ou `margin-top: auto` dans flux normal

### Tableau totaux mal formaté
- Ajouter `print-color-adjust: exact`
- Forcer `display: table`
- Utiliser `border-collapse: collapse`

### Étapes programme coupées
- Ajouter `page-break-inside: avoid` sur chaque étape
- Utiliser `data-print-group="trip-step"`

### Conditions trop espacées
- Passer en mode 1 colonne: `print:tw-columns-1`
- Réduire padding: `print:tw-p-1`
- Réduire font: `print:tw-text-xs`

## Checklist validation

- [ ] Header visible avec logo correct
- [ ] Programme complet sans étapes coupées
- [ ] Services et impact carbone affichés
- [ ] Cotation complète
- [ ] Totaux bien formatés avec couleurs
- [ ] Conditions compactes et lisibles
- [ ] Signature présente
- [ ] Footer sur toutes les pages
- [ ] Pas de boutons/contrôles visibles
- [ ] Caractères spéciaux corrects
- [ ] Images/logos visibles

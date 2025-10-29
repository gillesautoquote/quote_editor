# Attributs data-* pour ciblage CSS

Ce document liste tous les attributs data-* utilisés dans QuoteEditor pour faciliter le ciblage CSS et la génération PDF.

## Composants principaux

### QuoteFlatView
```html
<div data-component="quote-flat-view" data-print-mode="true|false">
```

### QuotePageHeader
```html
<div
  data-component="quote-header"
  data-company-id="..."
  data-quote-number="..."
>
```

### QuotePageFooter
```html
<div data-component="quote-footer">
```

### QuoteSection
```html
<div
  data-component="quote-section"
  data-section-index="0"
  data-section-title="..."
>
```

### OptionBlock
```html
<div
  data-component="option-block"
  data-block-id="..."
  data-block-type="list|note|programme-voyage"
  data-columns="1|2|3|4"
>
```

### OptionRow
```html
<li
  data-component="option-row"
  data-row-index="0"
  data-row-style="normal|bold|italic|heading"
>
```

### NoteRow
```html
<li
  data-component="note-row"
  data-note-index="0"
  data-note-style="normal|bold|italic"
>
```

### TripProgramBlock
```html
<div data-component="trip-program">
  <div data-print-group="trip-day" data-date="2024-01-15">
    <div data-print-group="trip-step" data-step-id="...">
```

### QuotePageTotals
```html
<div data-component="totals-table">
```

### SignatureSection
```html
<div data-component="signature-section">
```

### CarbonImpact
```html
<div data-component="carbon-impact">
```

## Groupes de pagination

### trip-day
Groupe un jour complet du programme de voyage. Ne doit jamais être coupé.

### trip-step
Groupe une étape individuelle. Ne doit jamais être coupée.

### conditions-group
Groupe les listes de conditions par blocs de 5-7 éléments.

## Utilisation CSS

```css
/* Cibler tous les headers */
[data-component="quote-header"] {
  page-break-after: avoid;
}

/* Cibler les étapes du programme */
[data-print-group="trip-step"] {
  page-break-inside: avoid;
}

/* Cibler les blocs par type */
[data-block-type="programme-voyage"] {
  /* styles spécifiques */
}
```

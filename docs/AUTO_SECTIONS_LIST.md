# Liste automatique des sections du document

## Description

Le système génère automatiquement une liste à puces des sections présentes dans le PDF, affichée juste après le `tagline` personnalisable.

## Fonctionnement

### Détection automatique des sections

La fonction `generatePDFSectionsList()` analyse les données du devis et détecte automatiquement la présence de :

1. **Programme détaillé** : Détecté si un `optionBlock` de type `programme-voyage` existe avec des `tripSteps`
2. **Cotation précise** : Détecté si des `sections` avec lignes de prix existent
3. **Conditions générales de vente** : Détecté si des `optionBlocks` de type `list` avec id `included_fees` ou `excluded_fees` existent

### Format de sortie

Le système génère un texte au format markdown :

```
Ce document comprend :
- Le **programme détaillé** de votre voyage
- La **cotation précise** du trajet demandé
- Nos **conditions générales de vente**
```

### Affichage

- **Dans l'éditeur** : Le texte est rendu via `markdownToHtml()` et affiché en lecture seule après le tagline
- **Dans le PDF** : Le texte est converti en texte brut via `markdownToPlainText()` et intégré dans le même paragraphe que le tagline

## Modification du tagline

L'utilisateur peut modifier le texte d'introduction principal (`quote.tagline`) normalement. La liste des sections s'ajoute automatiquement après ce texte et ne peut pas être modifiée directement.

## Fichiers concernés

- `src/Components/QuoteEditor/utils/pdfSectionsGenerator.ts` : Logique de génération
- `src/Components/QuoteEditor/pdf/components/PDFIntro.tsx` : Affichage dans le PDF
- `src/Components/QuoteEditor/components/QuotePage/components/QuotePageIntro.tsx` : Affichage dans l'éditeur

## Exemple

**Tagline personnalisé :**
```
Nous avons le plaisir de vous adresser notre devis détaillé pour votre projet de transport.
```

**Rendu final :**
```
Nous avons le plaisir de vous adresser notre devis détaillé pour votre projet de transport.

Ce document comprend :
- Le **programme détaillé** de votre voyage
- La **cotation précise** du trajet demandé
- Nos **conditions générales de vente**
```

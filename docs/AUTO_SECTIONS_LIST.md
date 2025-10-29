# Liste automatique des sections du document

## Description

Le système génère automatiquement une liste à puces des sections présentes dans le PDF, affichée juste après le `tagline` personnalisable.

## Fonctionnement

### Détection automatique des sections

La fonction `generatePDFSectionsList()` analyse les données du devis et détecte automatiquement la présence de :

1. **Programme détaillé** : Détecté si un `optionBlock` de type `programme-voyage` existe avec des `tripSteps`
2. **Cotation précise** : Détecté si des `sections` avec lignes de prix existent
3. **Conditions générales de vente** : Détecté si des `optionBlocks` de type `list` avec id `included_fees` ou `excluded_fees` existent
4. **Services disponibles** : Détecté si `busServices` existe avec au moins un service disponible (`available: true`)
5. **Impact carbone** : Détecté si `carbonImpact` existe avec un `co2Amount`
6. **Bon de commande** : Détecté si `signatureFrame` existe

### Format de sortie

Le système génère un texte au format markdown :

```
Ce document comprend :
- Le **programme détaillé** de votre voyage
- La **cotation précise** du trajet demandé
- Nos **conditions générales de vente**
- Les **services disponibles** à bord
- L'**impact carbone** de votre trajet
- Un **bon de commande** à retourner signé
```

### Affichage

- **Dans l'éditeur** : Le texte est rendu via `markdownToHtml()` et affiché en lecture seule après le tagline
- **Dans le PDF** : Le texte est converti en texte brut via `markdownToPlainText()` et intégré dans le même paragraphe que le tagline

## Modification du tagline

L'utilisateur peut modifier le texte d'introduction principal (`quote.tagline`) normalement. La liste des sections s'ajoute automatiquement après ce texte et ne peut pas être modifiée directement.

## Synchronisation avec les onglets visibles

La liste des sections est **dynamique** et s'adapte aux onglets visibles :

- **Mode Tabs** : Lorsque l'utilisateur masque/affiche des onglets via l'interface, la liste se met à jour automatiquement dans l'onglet Introduction
- **Mode Flat/Print** :
  - La liste dans l'introduction utilise les `visibleTabIds` stockés dans `QuoteData`
  - Les sections physiques (programme, services, cotation, conditions, signature) sont également filtrées selon `visibleTabIds`
  - Seules les sections correspondant aux onglets visibles sont affichées
- **Export PDF** : Le PDF respecte également les `visibleTabIds` pour générer la liste appropriée

Les `visibleTabIds` sont stockés dans l'objet `QuoteData` et mis à jour automatiquement par `QuoteTabs` lorsque l'utilisateur ajoute/supprime/réorganise les onglets.

### Filtrage des sections en mode Flat/Print

En plus de la liste textuelle, les sections physiques du document sont également filtrées :

- `isTabVisible('programme')` → Affiche/masque le bloc Programme de voyage
- `isTabVisible('services')` → Affiche/masque les Services bus et Impact carbone
- `isTabVisible('cotation')` → Affiche/masque la Cotation détaillée et les Totaux
- `isTabVisible('conditions')` → Affiche/masque les Conditions générales
- `isTabVisible('signature')` → Affiche/masque le Bon de commande

## Fichiers concernés

- `src/Components/QuoteEditor/utils/pdfSectionsGenerator.ts` : Logique de génération de la liste
- `src/Components/QuoteEditor/pdf/components/PDFIntro.tsx` : Affichage de la liste dans le PDF
- `src/Components/QuoteEditor/components/QuotePage/components/QuotePageIntro.tsx` : Affichage de la liste dans l'éditeur
- `src/Components/QuoteEditor/components/QuotePage/QuoteFlatView.tsx` : Filtrage des sections physiques en mode Flat/Print
- `src/Components/QuoteEditor/components/QuoteTabs/QuoteTabs.tsx` : Gestion et persistence des `visibleTabIds`
- `src/Components/QuoteEditor/QuoteEditor.types.ts` : Définition du champ `visibleTabIds` dans `QuoteData`

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
- Les **services disponibles** à bord
- L'**impact carbone** de votre trajet
- Un **bon de commande** à retourner signé
```

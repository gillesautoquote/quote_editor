# Diagnostic d’intégration des données du mock

Ce document recense, pour chaque donnée présente dans `src/Components/QuoteEditor/mocks/data.mock.json`, la logique qui la consomme, l’effet attendu dans l’UI/PDF, et les éventuels écarts (gaps) ou points d’amélioration. Il couvre l’éditeur (onglets) et le mode flat/print.

## Légende
- Fichier(s) consommateur(s) indiqué(s) entre backticks.
- “Effet” = ce que la donnée pilote concrètement dans l’interface / PDF.
- “Gaps” = ce qui n’est pas encore câblé ou se comporte différemment de l’intention.

---

## 1) company
- Champs: `logoUrl`, `name`, `address`, `postalCode`, `city`, `country`, `phone`, `email`, `website`, `mainColor`
- Consommateurs principaux:
  - `QuoteEditor` et `useColorTheme` → injection des variables CSS (`--color-primary*`), classes Tailwind `tw-*-primary`.
  - En-tête/pied: `QuotePageHeader.tsx`, `QuotePageFooter.tsx`, équivalents PDF (`PDFHeader.tsx`, `PDFFooter.tsx`).
- Effet:
  - `mainColor` pilote le thème (boutons, badges, titres, etc.); `logoUrl`/coordonnées s’affichent en header/footer.
- Gaps:
  - Aucun gap fonctionnel connu. Si des éléments restent verts/rouges: vérifier que le composant utilise bien les classes `tw-*-primary` ou reçoit `companyColor` (corrigé récemment).

## 2) recipient
- Champs: identité et coordonnées destinataire.
- Consommateurs: `QuotePageHeader.tsx` (bloc destinataire), PDF intro.
- Effet: affichage des infos du destinataire.
- Gaps: RAS.

## 3) quote
- Champs: `number`, `version`, `issueDate`, `executionCity`, `tagline`, `validUntil`, `reference`
- Consommateurs: intro (`QuotePageIntro.tsx`), footer PDF/éditeur pour certains champs.
- Effet: en-têtes/intro, texte de présentation, validité.
- Gaps: RAS.

## 4) visibleTabIds (ordre/visibilité des “pages”)
- Champs: `visibleTabIds: string[]`
- Consommateurs:
  - Mode onglets: `QuoteTabs.tsx` (initialVisibleTabs).
  - Mode flat/print: `QuoteFlatView.tsx` (filtrage et ordre d’affichage via `getOrderedTabIds()`).
- Effet attendu:
  - Contrôle de la visibilité des pages (introduction, programme, services, cotation, conditions, signature).
- Gaps importants:
  - En mode onglets (`QuoteTabs.tsx`), l’ordre n’est PAS pris depuis `visibleTabIds`. Le code filtre la liste statique `TABS` via un `includes`, donc l’ordre reste celui de `TABS`. Conclusion: le mock peut masquer/afficher des pages, mais ne peut pas changer leur ordre dans la vue à onglets.
  - En mode flat/print, l’ordre utilise bien `visibleTabIds` si présent.
  - S’il existe un champ “pages” dans un autre JSON: non pris en compte. L’unique source de vérité côté code est `visibleTabIds`.

## 5) itinerary (programme de voyage)
- Champs: tableau `itinerary` de `DaySchedule` (+ `tripName` optionnel au niveau du jour).
- Consommateurs:
  - `convertItineraryToTripSteps` et `createProgrammeVoyageBlock` via `itineraryConverters.ts`.
  - Injection automatique d’un block `type: 'programme-voyage'` si absent: `QuoteFlatView.tsx` et `QuotePage.tsx`.
  - Rendu: `TripProgramBlock.tsx` (éditeur/flat/print), PDF: `PDFOptionBlocks.tsx` (section programme).
- Effet:
  - Le mock “itinerary” est transformé en `tripSteps` pour le block `programme-voyage`. `tripName` (au niveau jour) s’affiche en sous-titre de mission.
- Gaps:
  - Si un block `programme-voyage` existe déjà dans `optionBlocks`, on n’en réinjecte pas un autre; vérifier que la forme des `tripSteps` correspond (sinon, le block existant ne s’affichera pas correctement).
  - Les filtres par défaut (`depart`, `arrivee`, etc.) sont pris côté composant; ils peuvent ne pas refléter un réglage venant du mock si non renseigné.

## 6) sections (cotation détaillée)
- Champs: `sections[]`, `missionsLines`, `simplesLinesSelect`, `columns`, etc.
- Consommateurs: `QuoteSection` et sous-composants (table des lignes), `calculationUtils.ts` pour les totaux.
- Effet:
  - Rendu de la cotation, calculs totaux (HT/TVA/TTC) et ventilation TVA. Mise à jour des totaux à chaque modification/ suppression de section.
- Gaps: RAS majeur. Vérifier que les lignes “prédéfinies” du mock (`simplesLinesSelect`) sont bien proposées selon la `selectDefinitions` (cf. §7).

## 7) selectDefinitions (types de lignes/notes à insérer)
- Champs: `selectDefinitions: Record<string, { title, values, ... }>`
- Consommateurs: `OptionBlockHeader.tsx` (menu d’ajout), `blockHandlers.ts`.
- Effet: alimente les menus “+ Véhicules / + Services / + Frais supplémentaires / + Tarifs / + Ligne” et la création de lignes typées.
- Gaps: RAS si les clés du mock correspondent aux clés consommées (les titres servent à l’UI, mais ce sont les clés qui font foi).

## 8) optionBlocks (conditions générales + programme-voyage)
- Champs: `optionBlocks[]` avec `type: 'list' | 'notes' | 'programme-voyage'`, `rows`, `notes`, `color`, `columns`, etc.
- Consommateurs: `BlocksContainer.tsx`, `OptionBlock.tsx`, `OptionRow.tsx`, `NoteRow.tsx`, `OptionBlockHeader.tsx`.
- Effet:
  - Rendu des “Ces tarifs comprennent / ne comprennent pas / Nota Bene” et, le cas échéant, du “Programme de voyage”.
  - La couleur par défaut est normalisée sur `company.mainColor` si l’ancienne palette (vert/rouge legacy) est détectée.
- Gaps:
  - Si le mock définit explicitement une `color` legacy, elle sera remplacée par `company.mainColor` (comportement volontaire pour la cohérence thème).
  - L’ajout/suppression de blocs et leur largeur par défaut sont pris en charge depuis l’éditeur; pour forcer via mock, renseigner `columns`, `showTitle`, etc.

## 9) totals
- Champs: `totals: { ht, tva, ttc, vatBreakdown? }`
- Consommateurs: `QuotePageTotals.tsx` (éditeur) et `PDFTotals.tsx` (PDF).
- Effet:
  - Affichage des totaux; recalcul automatique côté éditeur lors des modifications de sections (`calculateGlobalTotals`).
- Gaps:
  - Les totaux fournis par le mock peuvent être écrasés par le recalcul après édition. En lecture seule (ou sans modification), ils s’affichent tels quels.

## 10) busServices
- Champs: `busServices.title`, `busServices.services[]`
- Consommateurs: section “Services” en éditeur/flat/print, et PDF.
- Effet: affichage des badges/pictos services disponibles.
- Gaps: RAS.

## 11) carbonImpact
- Champs: `carbonImpact.co2Amount`, `carbonImpact.unit`, etc.
- Consommateurs: composant `CarbonImpact.tsx`, PDF services.
- Effet: encart d’impact carbone (styles désormais basés sur la couleur primaire).
- Gaps: RAS.

## 12) signatureFrame
- Champs: `beforeLines[]`, `afterLines[]`, `siret`, `intraCommunityVat`, etc.
- Consommateurs: `InstructionsFrame.tsx` (éditeur), `PDFOptionBlocks.tsx` et `PDFOrderForm.tsx` (PDF).
- Effet: encart signature + informations légales.
- Gaps: RAS.

## 13) Introduction – récapitulatif synthétique
- Sources: `quote`, `totals`, `carbonImpact`, `itinerary[0].tripName` ou nom fourni ailleurs.
- Consommateurs: `QuotePageIntro.tsx` (section “Récapitulatif de la proposition”).
- Effet: phrase non éditable avec voyage, montants HT/TTC, impact carbone, validité.
- Gaps: si `tripName` n’est pas présent, prévoir un fallback (actuellement géré).

---

## Points de friction observés
1) Ordre des pages en mode onglets
- Cause: `QuoteTabs.tsx` filtre `TABS` avec `includes`, ce qui conserve l’ordre statique de `TABS` et ignore l’ordre de `visibleTabIds`.
- Impact: le mock ne peut pas réordonner les onglets, seulement les masquer/afficher.
- Proposition: remplacer la construction initiale par un mapping basé sur `visibleTabIds` quand fourni, par exemple:
  - `const initialVisibleTabs = data.visibleTabIds?.length ? data.visibleTabIds.map(id => TABS.find(t => t.id === id)!).filter(Boolean) : TABS;`

2) Programme (itinerary) déjà “mappé” en optionBlock
- Cause: si un block `programme-voyage` est déjà présent mais dans un format non conforme (ex: `tripSteps` manquants), rien ne s’affiche.
- Proposition: valider/convertir systématiquement le block existant ou toujours régénérer `tripSteps` depuis `itinerary` si l’on souhaite que le mock prime.

3) Couleurs legacy dans les options/conditions
- Cause: anciennes couleurs codées en dur dans certains blocs du mock.
- État: normalisées côté composant pour utiliser `company.mainColor` (comportement voulu).

---

## Résumé “champ → effet” (condensé)
- **company.mainColor** → thème global (UI + PDF).
- **visibleTabIds** → visibilité des pages; ordre respecté en flat/print, ignoré en mode onglets (gap).
- **itinerary** → alimente `programme-voyage.tripSteps` (éditeur, flat, PDF).
- **sections** → cotation + totaux; recalcul auto après édition.
- **optionBlocks** → conditions générales (+ éventuellement programme-voyage s’il existe).
- **selectDefinitions** → menus d’ajout de lignes typées dans les blocs.
- **busServices / carbonImpact** → section Services (UI + PDF).
- **signatureFrame** → encart signature (UI + PDF).

---

## Actions recommandées
1) Prendre en compte l’ordre de `visibleTabIds` en mode onglets (`QuoteTabs.tsx`).  
2) Vérifier/convertir la forme d’un block `programme-voyage` existant à partir de `itinerary` pour éviter toute divergence.  
3) Continuer de retirer toute couleur legacy dans le mock; la couleur de marque est appliquée automatiquement.



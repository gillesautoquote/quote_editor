# Corrections des Problèmes de Filtrage

## Problèmes Identifiés et Résolus

### 1. Duplication d'étapes avec le filtre "Allers/Retours dépôt"

**Problème** : Cliquer plusieurs fois sur le filtre "Allers/Retours dépôt" ajoutait des étapes en double.

**Cause** : L'ancienne logique de fusion des étapes regroupait toutes les étapes au même endroit, créant des doublons lors du re-filtrage.

**Solution** : La nouvelle logique fusionne UNIQUEMENT les paires consécutives `mise_en_place` + `embarquement` au même endroit. Les autres étapes sont préservées dans leur ordre exact sans fusion.

```typescript
// Ancienne logique (problématique)
// Regroupait TOUTES les étapes par localisation
const locationMap = new Map<string, { firstIndex: number; steps: TripProgramStep[] }>();

// Nouvelle logique (correcte)
// Fusionne UNIQUEMENT mise_en_place + embarquement consécutifs
if (
  nextStep &&
  currentStep.labelType === 'mise_en_place' &&
  nextStep.labelType === 'embarquement' &&
  currentStep.city === nextStep.city
) {
  // Fusionner ces deux étapes seulement
}
```

### 2. Arrivées non affichées dans la mission "Voyage Paris → Lille test Gilles2"

**Problème** : L'étape "Destination CLIENT" à 20:42 n'apparaissait pas avec le filtre "Arrivées" activé.

**Cause** : Cette étape était mal typée comme `depose` alors qu'il s'agit d'une étape intermédiaire (les clients descendent temporairement, puis remontent après une pause).

**Solution** : Correction du `labelType` de `depose` vers `service_passager` pour refléter la nature intermédiaire de cette étape.

```json
{
  "label": "Destination CLIENT",
  "labelType": "service_passager",  // Avant: "depose"
  "heure": "20:42"
}
```

### 3. Ordre des étapes ne suivant pas le JSON

**Problème** : L'ordre d'affichage des étapes ne correspondait pas à l'ordre du JSON source.

**Cause** : L'ancienne logique de fusion réorganisait les étapes par localisation, puis par heure, perturbant l'ordre naturel.

**Solution** : La nouvelle logique préserve l'ordre exact des étapes filtrées. Les étapes sont traitées séquentiellement, et seules les paires consécutives `mise_en_place` + `embarquement` sont fusionnées, sans réorganisation.

## Typologie Correcte des Labels

### Règles de Typage

| Situation | LabelType Correct | Exemple |
|-----------|------------------|---------|
| Le véhicule part du dépôt | `retour_depot` | "Départ du dépôt" |
| Le véhicule va au lieu de prise en charge | `mise_en_place` | "Mise en place du véhicule" |
| Les passagers montent | `embarquement` | "Départ CLIENT" |
| Arrêt intermédiaire (passagers descendent/remontent) | `service_passager` | "Destination CLIENT" (suivie d'autres étapes) |
| Destination finale (passagers descendent) | `depose` | "Destination CLIENT" (dernière étape de service) |
| Le véhicule retourne au dépôt | `retour_depot` | "Retour au dépôt", "Arrivée au dépôt" |

### Exemple Concret : Mission avec Pause

```
19:19 - Départ du dépôt (retour_depot)
19:50 - Mise en place du véhicule (mise_en_place)
20:00 - Départ CLIENT (embarquement)
20:42 - Destination CLIENT (service_passager) ← Arrêt intermédiaire
20:52-22:50 - Attente | Coupure conducteur
22:50 - Mise en place du véhicule (mise_en_place)
23:00 - Départ CLIENT (embarquement)
23:43 - Destination CLIENT (depose) ← Destination finale
23:53 - Retour au dépôt (retour_depot)
```

## Logique de Fusion

### Ce qui EST fusionné

```
✓ Mise en place + Embarquement au même endroit et consécutifs
  → Affichage : "Mise en place / Départ" avec plage horaire

Exemple:
19:50 - Mise en place du véhicule (mise_en_place)
20:00 - Départ CLIENT (embarquement)
→ Devient: "19:50 - 20:00 | Mise en place / Départ"
```

### Ce qui N'EST PAS fusionné

```
✗ Dépose + Mise en place au même endroit
  → Les deux étapes restent séparées

✗ Étapes du même type au même endroit
  → Les étapes restent séparées

✗ Étapes à des endroits différents
  → Toujours séparées
```

## Tests de Validation

Pour vérifier que les corrections fonctionnent :

1. **Test Allers/Retours dépôt**
   - Activer/désactiver le filtre plusieurs fois
   - Vérifier qu'il n'y a pas de duplication d'étapes

2. **Test Arrivées Mission 2**
   - Activer uniquement "Arrivées"
   - Vérifier que "Destination CLIENT" à 23:43 s'affiche
   - Activer "Départs + Arrivées + Mise en place"
   - Vérifier que toutes les étapes pertinentes s'affichent

3. **Test Ordre**
   - Activer tous les filtres
   - Vérifier que l'ordre correspond au JSON source
   - Les heures doivent être dans l'ordre chronologique

## Améliorations Futures

1. **Validation des données** : Ajouter des checks pour détecter les incohérences de typage
2. **Mode debug** : Afficher le `labelType` en mode développement
3. **Documentation** : Ajouter des tooltips expliquant chaque type de label

# Logique de Filtrage Complète et Dynamique

## Problème Corrigé

L'étape suivante s'affichait **toujours**, peu importe les filtres actifs :

```json
{
  "type": "etape",
  "label": "Destination CLIENT",
  "labelType": "service_passager",
  "heure": "20:42",
  "uuid": "961d5939-c3dd-4128-bf17-7050065f2221"
}
```

### Cause du Problème

Dans la logique de filtrage, quand un `labelType` était défini mais qu'aucun filtre ne correspondait, le code ne retournait **rien** (undefined), ce qui était interprété comme `true` par le `.filter()` de JavaScript.

```typescript
// ❌ CODE PROBLÉMATIQUE
if (step.labelType) {
  const matchingFilter = STEP_FILTERS.find(...);

  if (matchingFilter) {
    return filters[matchingFilter.id];
  }
  // Pas de return ici = undefined = true par défaut !
}
```

### Solution

Ajout d'un `return false` explicite quand un `labelType` est défini mais qu'aucun filtre ne correspond :

```typescript
// ✅ CODE CORRIGÉ
if (step.labelType) {
  const matchingFilter = STEP_FILTERS.find(filter =>
    filter.labelTypes.includes(step.labelType!)
  );

  if (matchingFilter) {
    return filters[matchingFilter.id];
  }

  // Si labelType est défini mais qu'aucun filtre ne correspond, masquer l'étape
  return false;
}
```

## Logique de Filtrage Complète

### Flux de Décision

```
Pour chaque étape :
  ├─ A-t-elle un labelType défini ?
  │  ├─ OUI
  │  │  ├─ Existe-t-il un filtre correspondant ?
  │  │  │  ├─ OUI → Vérifier si ce filtre est ACTIF
  │  │  │  └─ NON → MASQUER l'étape (return false)
  │  └─ NON
  │     └─ Utiliser le mode fallback (mots-clés)
  │        ├─ Contient "dépôt/depot" ?
  │        │  └─ OUI → Visible si filtre "depotRoundTrips" actif
  │        └─ NON → Vérifier les keywords des autres filtres
```

### Code Complet de Filtrage

```typescript
const filteredSteps = useMemo(() => {
  return steps.filter(step => {
    // PRIORITÉ 1 : Si labelType est défini (mode dynamique)
    if (step.labelType) {
      const matchingFilter = STEP_FILTERS.find(filter =>
        filter.labelTypes.includes(step.labelType!)
      );

      if (matchingFilter) {
        // Retourner l'état du filtre (true/false)
        return filters[matchingFilter.id];
      }

      // Aucun filtre ne correspond = masquer l'étape
      return false;
    }

    // PRIORITÉ 2 : Mode fallback (rétrocompatibilité)
    const labelLower = step.label.toLowerCase();
    const isDepotStep = labelLower.includes('dépôt') || labelLower.includes('depot');

    if (isDepotStep) {
      return filters.depotRoundTrips;
    }

    // Vérifier si l'étape correspond à un filtre actif via ses keywords
    return STEP_FILTERS.some(filter => {
      if (filter.id === 'depotRoundTrips') return false;
      if (!filters[filter.id]) return false;
      return filter.keywords.some(keyword => labelLower.includes(keyword));
    });
  });
}, [steps, filters]);
```

## Configuration des Filtres

### Mapping labelType → Filtre

```typescript
const STEP_FILTERS = [
  {
    id: 'depart',
    label: 'Départs',
    labelTypes: ['embarquement'],
    keywords: ['départ', 'depart']
  },
  {
    id: 'arrivee',
    label: 'Arrivées',
    labelTypes: ['depose'],
    keywords: ['arrivée', 'arrivee', 'destination']
  },
  {
    id: 'mise_en_place',
    label: 'Mise en place',
    labelTypes: ['mise_en_place', 'service_passager'],
    keywords: ['mise en place']
  },
  {
    id: 'depotRoundTrips',
    label: 'Allers/Retours dépôt',
    labelTypes: ['retour_depot'],
    keywords: ['départ', 'depart', 'arrivée', 'arrivee', 'retour'],
    isDepotFilter: true
  }
];
```

## Exemples de Comportement

### Exemple 1 : Étape avec labelType = "service_passager"

```json
{
  "label": "Destination CLIENT",
  "labelType": "service_passager",
  "heure": "20:42"
}
```

**Filtres actifs** : `mise_en_place` → ✅ VISIBLE (car `service_passager` est dans les labelTypes)

**Filtres actifs** : `arrivee` → ❌ MASQUÉE (car `service_passager` n'est PAS dans les labelTypes)

**Filtres actifs** : AUCUN → ❌ MASQUÉE

### Exemple 2 : Étape avec labelType = "depose"

```json
{
  "label": "Destination CLIENT",
  "labelType": "depose",
  "heure": "23:43"
}
```

**Filtres actifs** : `arrivee` → ✅ VISIBLE (car `depose` est dans les labelTypes)

**Filtres actifs** : `mise_en_place` → ❌ MASQUÉE (car `depose` n'est PAS dans les labelTypes)

**Filtres actifs** : AUCUN → ❌ MASQUÉE

### Exemple 3 : Étape SANS labelType (fallback)

```json
{
  "label": "Destination inconnue",
  "heure": "14:00"
}
```

**Filtres actifs** : `arrivee` → ✅ VISIBLE (car le label contient "destination")

**Filtres actifs** : `depart` → ❌ MASQUÉE (pas de keyword correspondant)

**Filtres actifs** : AUCUN → ❌ MASQUÉE

## Tests de Validation

### ✅ Test 1 : Étape "20:42 Destination CLIENT"
```
1. Désactiver TOUS les filtres
   → L'étape doit être MASQUÉE

2. Activer uniquement "Mise en place"
   → L'étape doit être VISIBLE

3. Activer uniquement "Arrivées"
   → L'étape doit être MASQUÉE

4. Activer uniquement "Départs"
   → L'étape doit être MASQUÉE
```

### ✅ Test 2 : Combinaisons de Filtres
```
1. Activer "Départs" + "Arrivées"
   → Seules les étapes embarquement et depose sont visibles

2. Activer "Mise en place" + "Allers/Retours dépôt"
   → Étapes mise_en_place, service_passager et retour_depot visibles

3. Activer TOUS les filtres
   → Toutes les étapes visibles
```

### ✅ Test 3 : Stabilité
```
1. Cliquer plusieurs fois sur chaque filtre
   → Aucune duplication d'étapes
   → Le nombre d'étapes reste cohérent
```

## Avantages de Cette Approche

1. **Dynamique à 100%** : Tout est basé sur les données JSON (aucun codage en dur)
2. **Type-Safe** : Utilisation de `labelType` au lieu de parsing de labels
3. **Prévisible** : Comportement explicite pour tous les cas (même les cas limites)
4. **Rétrocompatible** : Le mode fallback fonctionne pour les anciennes données sans `labelType`
5. **Maintenable** : Un seul endroit pour définir les règles de filtrage (`STEP_FILTERS`)

## Résumé

La correction garantit que **toute étape avec un `labelType` défini est soit filtrée correctement, soit masquée**. Il n'y a plus de cas où une étape apparaît "par défaut" sans contrôle des filtres.

L'étape "20:42 Destination CLIENT" avec `labelType: "service_passager"` est maintenant correctement contrôlée par le filtre "Mise en place" et uniquement celui-ci.

# Corrections Finales des Filtres

## Problèmes Corrigés

### 1. Clés React Dupliquées (Keys Duplicate Warning)

**Problème** :
```
Warning: Encountered two children with the same key, `173480c2-652d-438c-b4e5-faefc4806597`
Warning: Encountered two children with the same key, `1b95638b-9e02-4719-9f1d-3af1e32926b1`
Warning: Encountered two children with the same key, `bba50f91-03dc-4a60-a4ee-d34de4c05869`
```

**Cause** : Dans le JSON backend, certaines étapes partagent le même UUID car elles représentent la même action logique (ex: "Retour au dépôt" ligne 708 et "Arrivée au dépôt" ligne 740 ont le même UUID `173480c2-652d-438c-b4e5-faefc4806597`).

**Solution** : Génération d'IDs uniques en combinant UUID + index séquentiel :

```typescript
let stepIndex = 0;
// ...
const uniqueId = step.uuid ? `${step.uuid}-${stepIndex}` : `step-${stepIndex}`;
stepIndex++;
```

Cela garantit que chaque étape a un ID unique pour React, tout en préservant la traçabilité vers l'UUID original.

### 2. Étape "20:42 Destination CLIENT" et Filtre "Arrivées"

**Comportement Attendu** : L'étape "20:42 Destination CLIENT" (mission 2) ne doit PAS s'afficher avec le filtre "Arrivées" car c'est un arrêt intermédiaire, pas une dépose finale.

**Explication** :
- Cette étape est suivie d'une pause (coupure conducteur)
- Puis d'une remise en place et nouveau départ
- La vraie dépose finale est à 23:43

**Type Correct** : `service_passager` (pas `depose`)

Cette étape s'affiche avec le filtre "Mise en place" car `service_passager` est associé à ce filtre.

### 3. Logique de Filtrage Simplifiée

**Avant** : Fusion complexe de toutes les étapes au même endroit

**Après** : Fusion UNIQUEMENT des paires consécutives `mise_en_place` + `embarquement`

```typescript
// Vérifier si on a une mise_en_place suivie d'un embarquement au même endroit
if (
  nextStep &&
  currentStep.labelType === 'mise_en_place' &&
  nextStep.labelType === 'embarquement' &&
  currentStep.city === nextStep.city &&
  currentStep.address === nextStep.address
) {
  // Fusionner en "Mise en place / Départ"
  merged.push({
    ...currentStep,
    time: `${currentStep.time} - ${nextStep.time}`,
    label: `Mise en place / Départ`,
    labelType: 'embarquement'
  });
  i += 2;
} else {
  // Garder l'étape telle quelle
  merged.push(currentStep);
  i++;
}
```

## Mapping Complet des Filtres

| Filtre UI | Types de Labels Inclus | Exemple d'Étapes |
|-----------|------------------------|------------------|
| **Départs** | `embarquement` | "Départ CLIENT" |
| **Arrivées** | `depose` | "Destination CLIENT" (finale seulement) |
| **Mise en place** | `mise_en_place`, `service_passager` | "Mise en place du véhicule", "Destination CLIENT" (intermédiaire) |
| **Allers/Retours dépôt** | `retour_depot` | "Départ du dépôt", "Retour au dépôt", "Arrivée au dépôt" |

## Exemples de Scénarios

### Scénario 1 : Mission Simple (Voyage 1)

```
13:10 - Départ du dépôt (retour_depot)
13:19 - Mise en place (mise_en_place)
13:29 - Départ CLIENT (embarquement)
→ Fusionnés en "13:19 - 13:29 | Mise en place / Départ"

14:17 - Destination CLIENT (depose)
14:27 - Retour au dépôt (retour_depot)
15:01 - Arrivée au dépôt (retour_depot)
```

**Avec tous filtres activés** : Toutes les étapes visibles (fusion de mise en place + embarquement)

### Scénario 2 : Mission avec Pause (Voyage 2)

```
19:19 - Départ du dépôt (retour_depot)
19:50 - Mise en place (mise_en_place)
20:00 - Départ CLIENT (embarquement)
→ Fusionnés en "19:50 - 20:00 | Mise en place / Départ"

20:42 - Destination CLIENT (service_passager) ← Arrêt intermédiaire
[Pause de 20:52 à 22:50]

22:50 - Mise en place (mise_en_place)
23:00 - Départ CLIENT (embarquement)
→ Fusionnés en "22:50 - 23:00 | Mise en place / Départ"

23:43 - Destination CLIENT (depose) ← Dépose finale
23:53 - Retour au dépôt (retour_depot)
00:21 - Arrivée au dépôt (retour_depot)
```

**Avec filtre "Arrivées" uniquement** : Seule l'étape à 23:43 s'affiche (depose finale)

**Avec filtre "Mise en place" uniquement** : Étapes 19:50-20:00, 20:42, 22:50-23:00 s'affichent

## Tests de Validation

### ✅ Test 1 : Clés Uniques
- Activer tous les filtres
- Vérifier dans la console : AUCUN warning "duplicate keys"

### ✅ Test 2 : Filtre Arrivées Mission 2
- Désactiver tous les filtres sauf "Arrivées"
- Vérifier : seule l'étape 23:43 est visible pour la mission 2
- L'étape 20:42 ne doit PAS apparaître

### ✅ Test 3 : Ordre Préservé
- Activer tous les filtres
- Vérifier : l'ordre correspond au JSON (chronologique)
- Les heures sont dans l'ordre : 19:19 → 20:00 → 20:42 → 23:00 → 23:43 → 23:53 → 00:21

### ✅ Test 4 : Stabilité des Filtres
- Cliquer multiple fois sur "Allers/Retours dépôt"
- Vérifier : AUCUNE duplication d'étapes
- Le nombre d'étapes reste constant

## Résumé Technique

1. **IDs Uniques** : UUID + index séquentiel → plus de clés dupliquées
2. **Fusion Limitée** : Seulement `mise_en_place` + `embarquement` consécutifs
3. **Types Stables** : Utilisation de `labelType` au lieu de mots-clés dans les labels
4. **Ordre Préservé** : Traitement séquentiel sans réorganisation
5. **Typage Correct** : Distinction claire entre `service_passager` (intermédiaire) et `depose` (finale)

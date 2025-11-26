# Types de Labels pour l'Itinéraire

## Vue d'ensemble

Le système de filtrage de l'itinéraire utilise maintenant des types de labels (`labelType`) au lieu de se baser uniquement sur le texte des labels. Cela permet un filtrage stable et prévisible même si les labels changent.

## Types de Labels Disponibles

Les types de labels correspondent aux différentes phases d'un voyage :

| Type | Description | Exemple de Label |
|------|-------------|-----------------|
| `mise_en_place` | Déplacement du dépôt vers le lieu de prise en charge | "Mise en place du véhicule" |
| `embarquement` | Prise en charge des passagers | "Départ CLIENT" |
| `service_passager` | Déplacement des passagers d'un lieu A vers un lieu B | "Destination CLIENT" (en cours de trajet) |
| `depose` | Dépose des passagers à destination | "Destination CLIENT" (arrivée finale) |
| `retour_depot` | Retour du véhicule au dépôt | "Retour au dépôt", "Arrivée au dépôt" |

## Structure des Données

### Dans l'Itinéraire (Backend)

```json
{
  "type": "etape",
  "label": "Mise en place du véhicule",
  "labelType": "mise_en_place",
  "heure": "13:19",
  "estPrisEnComptePourCalculs": true,
  "estDebutService": false,
  "estFinService": false,
  "uuid": "fefb183b-e591-4e86-baeb-f420f28b4463"
}
```

### Dans TripProgramStep (Frontend)

```typescript
export interface TripProgramStep {
  id: string;
  date: string;
  time: string;
  city: string;
  address: string;
  label: string;
  labelType?: TripLabelType;  // Nouveau champ
  tripName?: string;
}
```

## Mapping des Filtres

Les filtres utilisés dans l'interface correspondent aux types de labels :

| Filtre | Types de Labels Associés | Description |
|--------|-------------------------|-------------|
| `depart` | `embarquement` | Affiche les points de départ client |
| `arrivee` | `depose` | Affiche les points d'arrivée client |
| `mise_en_place` | `mise_en_place`, `service_passager` | Affiche les mises en place et services intermédiaires |
| `depotRoundTrips` | `retour_depot` | Affiche les déplacements depuis/vers le dépôt |

## Fonctionnement du Filtrage

Le système de filtrage fonctionne en deux modes :

### Mode Préféré : Basé sur labelType

Si `labelType` est défini, le filtre utilise cette valeur pour déterminer si l'étape doit être affichée :

```typescript
const matchingFilter = STEP_FILTERS.find(filter =>
  filter.labelTypes.includes(step.labelType!)
);

if (matchingFilter) {
  return filters[matchingFilter.id];
}
```

### Mode Fallback : Basé sur les mots-clés

Si `labelType` n'est pas défini (rétrocompatibilité), le système utilise les mots-clés du label :

```typescript
const labelLower = step.label.toLowerCase();
return filter.keywords.some(keyword => labelLower.includes(keyword));
```

## Avantages du Système

1. **Stabilité** : Les filtres fonctionnent même si les labels changent
2. **Prévisibilité** : Le comportement est déterministe basé sur les types
3. **Clarté** : La sémantique est explicite dans les données
4. **Maintenabilité** : Plus facile à maintenir et déboguer
5. **Rétrocompatibilité** : Fonctionne avec les anciennes données sans labelType

## Migration

Pour migrer des données existantes :

1. Ajouter le champ `labelType` à chaque étape de l'itinéraire
2. Déterminer le type approprié basé sur la fonction de l'étape
3. Optionnel : Le système continuera de fonctionner sans `labelType` (fallback sur mots-clés)

## Exemple Complet

```json
{
  "items": [
    {
      "type": "etapesGroupees",
      "adresse": {
        "adresse": "10 Rue de la Césière",
        "ville": "Annecy"
      },
      "etapes": [
        {
          "type": "etape",
          "label": "Départ du dépôt",
          "labelType": "retour_depot",
          "heure": "13:10"
        }
      ]
    },
    {
      "type": "etapesGroupees",
      "adresse": {
        "adresse": "Pl. de la Gare",
        "ville": "Annecy"
      },
      "etapes": [
        {
          "type": "etape",
          "label": "Mise en place du véhicule",
          "labelType": "mise_en_place",
          "heure": "13:19"
        },
        {
          "type": "etape",
          "label": "Départ CLIENT",
          "labelType": "embarquement",
          "heure": "13:29"
        }
      ]
    }
  ]
}
```

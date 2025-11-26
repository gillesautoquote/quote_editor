# Mapping LabelType → Filtre

## Vue d'ensemble

Ce document récapitule la correspondance entre les `labelType` des étapes de programme de voyage et les filtres qui les contrôlent.

## Filtres Disponibles

### 1. Filtre "Départs" (`depart`)
**LabelTypes associés :**
- `embarquement`

**Comportement :**
- Affiche les étapes où les passagers **montent** dans le véhicule
- Exemple : "Embarquement Paris Gare de Lyon"

---

### 2. Filtre "Arrivées" (`arrivee`)
**LabelTypes associés :**
- `depose`

**Comportement :**
- Affiche les étapes où les passagers **descendent** du véhicule (destination finale)
- Exemple : "Destination Annecy"

---

### 3. Filtre "Mise en place" (`mise_en_place`)
**LabelTypes associés :**
- `mise_en_place`

**Comportement :**
- Affiche les trajets **à vide** (sans passagers) pour positionner le véhicule
- Exemple : "Mise en place / Départ Annecy"

---

### 4. Filtre "Allers/Retours dépôt" (`depotRoundTrips`)
**LabelTypes associés :**
- `retour_depot`

**Comportement :**
- Affiche les trajets de retour au dépôt
- Exemple : "Retour Dépôt Annecy"

---

## LabelType NON Filtrable

### `service_passager`
**Filtres associés :** AUCUN

**Comportement :**
- **Toujours visible**, peu importe l'état des filtres
- Représente des arrêts intermédiaires pendant le service (pause conducteur, escale, etc.)
- Exemple : "20:42 Destination CLIENT"

**Justification :**
- Ces étapes sont essentielles pour la compréhension du voyage
- Elles ne correspondent ni à un embarquement, ni à une dépose, ni à une mise en place
- Elles doivent rester visibles pour assurer la cohérence chronologique du programme

---

## Table de Correspondance Complète

| LabelType          | Filtre                  | État par défaut | Comportement                                    |
|--------------------|-------------------------|-----------------|------------------------------------------------|
| `embarquement`     | `depart`                | ✅ Actif        | Filtrable - Embarquement de passagers          |
| `depose`           | `arrivee`               | ✅ Actif        | Filtrable - Dépose de passagers                |
| `mise_en_place`    | `mise_en_place`         | ✅ Actif        | Filtrable - Trajet à vide                      |
| `retour_depot`     | `depotRoundTrips`       | ❌ Inactif      | Filtrable - Retour au dépôt                    |
| `service_passager` | ⚠️ **AUCUN**            | N/A             | **TOUJOURS VISIBLE** - Arrêts intermédiaires   |

---

## Exemples de Données JSON

### Exemple 1 : Embarquement (filtrable)
```json
{
  "type": "etape",
  "label": "Annecy",
  "labelType": "embarquement",
  "heure": "13:19",
  "estPrisEnComptePourCalculs": true,
  "estDebutService": false,
  "estFinService": false
}
```
✅ Visible si filtre **"Départs"** activé
❌ Masquée si filtre **"Départs"** désactivé

---

### Exemple 2 : Dépose (filtrable)
```json
{
  "type": "etape",
  "label": "Annecy",
  "labelType": "depose",
  "heure": "23:43",
  "estPrisEnComptePourCalculs": true,
  "estDebutService": false,
  "estFinService": false
}
```
✅ Visible si filtre **"Arrivées"** activé
❌ Masquée si filtre **"Arrivées"** désactivé

---

### Exemple 3 : Mise en place (filtrable)
```json
{
  "type": "etape",
  "label": "Mise en place / Départ",
  "labelType": "mise_en_place",
  "heure": "13:19",
  "estPrisEnComptePourCalculs": true,
  "estDebutService": true,
  "estFinService": false
}
```
✅ Visible si filtre **"Mise en place"** activé
❌ Masquée si filtre **"Mise en place"** désactivé

---

### Exemple 4 : Service passager (NON filtrable)
```json
{
  "type": "etape",
  "label": "Destination CLIENT",
  "labelType": "service_passager",
  "heure": "20:42",
  "estPrisEnComptePourCalculs": true,
  "estDebutService": false,
  "estFinService": false
}
```
✅ **TOUJOURS VISIBLE** peu importe les filtres
⚠️ Ce type d'étape ne peut PAS être masqué

---

## Code de Référence

### Configuration des filtres
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
    labelTypes: ['mise_en_place'],
    keywords: ['mise en place']
  },
  {
    id: 'depotRoundTrips',
    label: 'Allers/Retours dépôt',
    labelTypes: ['retour_depot'],
    keywords: ['départ', 'depart', 'arrivée', 'arrivee', 'retour'],
    isDepotFilter: true
  },
];
```

### Logique de filtrage
```typescript
const filteredSteps = useMemo(() => {
  return steps.filter(step => {
    if (step.labelType) {
      // EXCEPTION : Les service_passager sont TOUJOURS visibles
      if (step.labelType === 'service_passager') {
        return true;
      }

      // Trouver le filtre correspondant
      const matchingFilter = STEP_FILTERS.find(filter =>
        filter.labelTypes.includes(step.labelType!)
      );

      if (matchingFilter) {
        return filters[matchingFilter.id];
      }

      // Pas de filtre = masquer
      return false;
    }

    // Mode fallback pour anciennes données...
  });
}, [steps, filters]);
```

---

## Tests de Validation

### ✅ Test 1 : Filtrage des embarquements
```
1. Désactiver filtre "Départs"
   → Toutes les étapes avec labelType="embarquement" doivent disparaître

2. Activer uniquement filtre "Départs"
   → Seules les étapes avec labelType="embarquement" + service_passager sont visibles
```

### ✅ Test 2 : Filtrage des arrivées
```
1. Désactiver filtre "Arrivées"
   → Toutes les étapes avec labelType="depose" doivent disparaître

2. Activer uniquement filtre "Arrivées"
   → Seules les étapes avec labelType="depose" + service_passager sont visibles
```

### ✅ Test 3 : Service passager toujours visible
```
1. Désactiver TOUS les filtres
   → Les étapes avec labelType="service_passager" restent visibles

2. Activer/désactiver n'importe quel filtre
   → Les étapes avec labelType="service_passager" ne bougent JAMAIS
```

---

## Résumé

- **4 filtres** contrôlent **4 labelTypes** filtrables
- **1 labelType** (`service_passager`) est **NON filtrable** et toujours visible
- Les filtres sont **indépendants** : activer/désactiver un filtre n'affecte que son labelType
- Aucun codage en dur : tout est basé sur le `labelType` des données JSON

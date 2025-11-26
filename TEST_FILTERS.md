# Guide de Test - Filtres du Programme de Voyage

## Tests à Effectuer

### ✅ Test 1 : Pas d'Accumulation du Filtre Dépôt

**Étapes** :
1. Ouvrir la console du navigateur (F12)
2. Activer le filtre "Allers/Retours dépôt (X)"
3. Observer les étapes affichées (noter le nombre)
4. Désactiver le filtre "Allers/Retours dépôt"
5. Réactiver le filtre "Allers/Retours dépôt"
6. **Répéter 5 fois** les étapes 4-5

**Résultat Attendu** :
- Le nombre d'étapes dépôt reste constant
- Aucune duplication visible
- Les logs montrent : `[TripProgramBlock] Depot step "..." -> visible: true/false`

**Résultat à Rejeter** :
- Étapes dépôt qui se multiplient
- Nombre d'étapes qui augmente à chaque activation

---

### ✅ Test 2 : Filtres Dynamiques avec Compteurs

**Étapes** :
1. Observer les boutons de filtres
2. Vérifier le format : `Nom du filtre (X)` où X est le nombre

**Résultat Attendu** :
- Chaque filtre affiche son compteur
- Exemple : `Départs (6)`, `Arrivées (8)`, `Mise en place (4)`, `Allers/Retours dépôt (6)`

**Résultat à Rejeter** :
- Filtres sans compteur
- Compteurs à 0 alors qu'il y a des étapes

---

### ✅ Test 3 : Ordre Chronologique (Étape 00:21)

**Étapes** :
1. Activer **tous les filtres** (Départs + Arrivées + Mise en place + Allers/Retours dépôt)
2. Naviguer jusqu'au groupe "jeudi 22 janvier 2026" (ou "Voyage Paris → Lille test Gilles2")
3. Faire défiler jusqu'à la **dernière étape** de ce jour
4. Vérifier l'heure de cette dernière étape

**Résultat Attendu** :
- La dernière étape du jeudi 22 est "Arrivée au dépôt" à **00:21**
- Elle apparaît **après** les étapes de 23:00 et 23:43 et 23:53

**Résultat à Rejeter** :
- L'étape 00:21 apparaît au début
- L'étape 00:21 n'est pas dans le groupe du jeudi 22

---

### ✅ Test 4 : Filtre "Arrivées" Seul

**Étapes** :
1. Désactiver tous les filtres
2. Activer uniquement le filtre "Arrivées"
3. Observer les étapes affichées

**Résultat Attendu** :
- Uniquement des étapes contenant "Arrivée", "Arrivee" ou "Destination"
- **AUCUNE** étape dépôt (comme "Arrivée au dépôt")
- Exemples visibles : "Destination CLIENT"

**Résultat à Rejeter** :
- Présence d'étapes dépôt
- Présence d'étapes "Départ"
- Présence d'étapes "Mise en place"

---

### ✅ Test 5 : Filtre "Départs" Seul

**Étapes** :
1. Désactiver tous les filtres
2. Activer uniquement le filtre "Départs"
3. Observer les étapes affichées

**Résultat Attendu** :
- Uniquement des étapes contenant "Départ" ou "Depart"
- **AUCUNE** étape dépôt (comme "Départ du dépôt")
- Exemples visibles : "Départ CLIENT"

**Résultat à Rejeter** :
- Présence d'étapes dépôt
- Présence d'étapes "Arrivée"
- Présence d'étapes "Mise en place"

---

### ✅ Test 6 : Filtre "Allers/Retours Dépôt" Seul

**Étapes** :
1. Désactiver tous les filtres
2. Activer uniquement le filtre "Allers/Retours dépôt"
3. Observer les étapes affichées

**Résultat Attendu** :
- **UNIQUEMENT** des étapes contenant "dépôt" ou "depot"
- Exemples : "Départ du dépôt", "Arrivée au dépôt", "Retour au dépôt"
- **AUCUNE** étape non-dépôt

**Résultat à Rejeter** :
- Présence d'étapes "Départ CLIENT"
- Présence d'étapes "Destination CLIENT"
- Présence d'étapes "Mise en place"

---

### ✅ Test 7 : Combinaison de Filtres

**Étapes** :
1. Activer "Départs" + "Mise en place" (sans "Arrivées" ni "Allers/Retours dépôt")
2. Observer les étapes affichées

**Résultat Attendu** :
- Étapes "Départ" + étapes "Mise en place"
- **AUCUNE** étape "Arrivée"
- **AUCUNE** étape dépôt

---

### ✅ Test 8 : Aucun Filtre Actif

**Étapes** :
1. Désactiver **tous** les filtres
2. Observer l'affichage

**Résultat Attendu** :
- Message affiché : "Aucune étape ne correspond aux filtres sélectionnés"
- Aucune étape visible

---

### ✅ Test 9 : Logs de Débogage

**Étapes** :
1. Ouvrir la console du navigateur (F12)
2. Activer/désactiver différents filtres
3. Observer les logs

**Logs Attendus** :
```
[TripProgramBlock] Filtering steps, total: XX
[TripProgramBlock] Active filters: { depart: true, arrivee: false, ... }
[TripProgramBlock] Depot step "Départ du dépôt" at 13:10 -> visible: false
[TripProgramBlock] Non-depot step "Départ CLIENT" at 13:29 -> visible: true
[TripProgramBlock] Filtered steps count: XX
[TripProgramBlock] Toggling filter: depotRoundTrips
```

**Résultat à Rejeter** :
- Aucun log dans la console
- Erreurs JavaScript dans la console

---

## Checklist Rapide

- [ ] Test 1 : Pas d'accumulation
- [ ] Test 2 : Compteurs affichés
- [ ] Test 3 : Étape 00:21 en dernier
- [ ] Test 4 : Filtre Arrivées
- [ ] Test 5 : Filtre Départs
- [ ] Test 6 : Filtre Dépôt
- [ ] Test 7 : Combinaison
- [ ] Test 8 : Aucun filtre
- [ ] Test 9 : Logs visibles

---

## En Cas de Problème

1. **Ouvrir la console** (F12)
2. **Regarder les logs** `[TripProgramBlock]`
3. **Vérifier** :
   - Le nombre total d'étapes : `Filtering steps, total: X`
   - Les filtres actifs : `Active filters: { ... }`
   - La visibilité de chaque étape : `... -> visible: true/false`
4. **Prendre une capture d'écran** de la console
5. **Noter** :
   - Quel test échoue
   - Quel est le comportement observé vs attendu

---

**Important** : Rechargez la page complètement (Ctrl+Shift+R ou Cmd+Shift+R) avant de commencer les tests pour être sûr d'avoir la dernière version.

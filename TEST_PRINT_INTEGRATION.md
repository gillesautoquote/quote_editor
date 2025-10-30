# Test d'Intégration Print.html + Backend

## Configuration Actuelle

### Frontend
- **URL**: `https://aq-tailwind-quoteedi-nyhc.bolt.host/`
- **Print Page**: `https://aq-tailwind-quoteedi-nyhc.bolt.host/print.html`

### Backend
- **URL**: `https://quote-pdf-generator-867679263659.europe-west1.run.app`
- **API Endpoint**: `GET /api/pdf/data?token=xxx`

## Tests à Effectuer

### 1. Test de Connectivité Backend

Vérifier que le backend répond correctement :

```bash
curl -I https://quote-pdf-generator-867679263659.europe-west1.run.app/health
```

### 2. Test de l'Endpoint API

Créer un token de test et vérifier la récupération des données :

```bash
# Demander au backend de créer un token de test
curl -X POST https://quote-pdf-generator-867679263659.europe-west1.run.app/api/pdf/generate \
  -H "Content-Type: application/json" \
  -d '{"quoteData": {...}}'

# Le backend retournera un token
# Ensuite tester la récupération
curl https://quote-pdf-generator-867679263659.europe-west1.run.app/api/pdf/data?token=TOKEN_ICI
```

### 3. Test de la Page Print dans le Navigateur

1. Déployer le build sur Bolt
2. Obtenir un token valide du backend
3. Ouvrir dans le navigateur :
   ```
   https://aq-tailwind-quoteedi-nyhc.bolt.host/print.html?token=TOKEN_ICI
   ```
4. Ouvrir la console développeur (F12)
5. Vérifier :
   - ✅ Pas d'erreurs CORS
   - ✅ Données chargées avec succès
   - ✅ Message "PDF ready for capture" dans la console
   - ✅ `window.__PDF_READY__ === true`

### 4. Test de Génération PDF Complet

Appeler l'endpoint de génération PDF du backend :

```bash
curl -X POST https://quote-pdf-generator-867679263659.europe-west1.run.app/api/pdf/generate \
  -H "Content-Type: application/json" \
  -d @test-quote.json \
  -o output.pdf
```

Le backend devrait :
1. Créer un token avec les données
2. Lancer Playwright vers `https://aq-tailwind-quoteedi-nyhc.bolt.host/print.html?token=xxx`
3. Attendre `window.__PDF_READY__`
4. Capturer le PDF
5. Retourner le fichier PDF

## Scénarios de Test

### Scénario 1 : Token Valide

**Action**: Accéder à `/print.html?token=VALID_TOKEN`

**Résultat Attendu**:
- ✅ Données chargées
- ✅ Quote affichée
- ✅ Paged.js pagine le contenu
- ✅ `window.__PDF_READY__ = true`

### Scénario 2 : Token Manquant

**Action**: Accéder à `/print.html` (sans token)

**Résultat Attendu**:
- ❌ Erreur affichée : "Token manquant dans l'URL"
- ❌ `window.__PDF_READY__` non défini

### Scénario 3 : Token Invalide

**Action**: Accéder à `/print.html?token=INVALID`

**Résultat Attendu**:
- ❌ Erreur 400/404 du backend
- ❌ Message d'erreur affiché
- ❌ `window.__PDF_READY__` non défini

### Scénario 4 : Token Expiré

**Action**: Réutiliser un token déjà consommé

**Résultat Attendu**:
- ❌ Erreur 410 du backend
- ❌ Message "Token expiré ou déjà utilisé"
- ❌ `window.__PDF_READY__` non défini

## Vérifications CORS

Le backend doit autoriser l'origine frontend dans ses en-têtes CORS :

```
Access-Control-Allow-Origin: https://aq-tailwind-quoteedi-nyhc.bolt.host
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Debugging

### Si la page print est blanche

1. Vérifier la console pour les erreurs JavaScript
2. Vérifier que les CSS sont chargés (onglet Network)
3. Vérifier que le token est présent dans l'URL

### Si les données ne se chargent pas

1. Vérifier l'URL du backend dans `.env`
2. Vérifier les erreurs CORS dans la console
3. Tester l'endpoint API directement avec curl
4. Vérifier les logs du backend

### Si Paged.js ne pagine pas

1. Vérifier que `pagedjs` est installé : `npm list pagedjs`
2. Vérifier la console pour les erreurs Paged.js
3. Vérifier que `print.css` est chargé
4. Vérifier les règles CSS `@page`

### Si __PDF_READY__ n'est jamais défini

1. Vérifier que toutes les images sont chargées
2. Vérifier que les fonts sont chargées
3. Vérifier que Paged.js a terminé la pagination
4. Ajouter des logs dans `src/print.tsx` pour débugger

## Checklist de Déploiement

Avant de déployer en production :

- [ ] `.env` configuré avec l'URL du backend
- [ ] Build exécuté avec succès
- [ ] `dist/print.html` existe
- [ ] Backend URL présente dans le bundle print
- [ ] Backend CORS configuré correctement
- [ ] Backend endpoint `/api/pdf/data` fonctionnel
- [ ] Token système testé et validé
- [ ] Génération PDF testée end-to-end
- [ ] Temps de chargement acceptable (< 10s)
- [ ] Qualité PDF vérifiée

## Métriques de Performance

### Temps de Chargement Attendus

- Fetch des données : < 500ms
- Chargement des fonts : < 1s
- Chargement des images : < 2s
- Pagination Paged.js : < 3s
- **Total** : < 7s

### Si Timeout Backend

Augmenter le timeout Playwright dans le backend :

```javascript
await page.goto(url, {
  waitUntil: 'networkidle2',
  timeout: 30000 // 30 secondes
});
```

## Prochaines Étapes

1. **Déployer le frontend** sur Bolt
2. **Tester l'endpoint** `/print.html?token=test`
3. **Vérifier CORS** entre frontend et backend
4. **Tester la génération PDF** complète
5. **Ajuster les timeouts** si nécessaire
6. **Monitorer les performances** en production

## Support

En cas de problème, vérifier :

1. **Console navigateur** : erreurs JavaScript, CORS, réseau
2. **Logs backend** : erreurs API, Playwright, tokens
3. **Network tab** : requêtes HTTP, temps de réponse
4. **Onglet Elements** : structure DOM, CSS appliqué

## Notes Importantes

- Les tokens sont **à usage unique**
- Le backend doit **invalider** les tokens après utilisation
- Les images doivent être **accessibles publiquement** ou en data URI
- Les fonts doivent être **chargées avant** Paged.js
- Le signal `__PDF_READY__` doit être défini **après** pagination complète

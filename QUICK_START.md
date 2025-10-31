# 🚀 Quick Start - Print.html Déploiement

## En Bref

L'implémentation de `/print.html` pour la génération PDF via Playwright est **PRÊTE**.

---

## ⚡ Déploiement en 3 Étapes

### 1. Déployer sur Bolt
Le build est déjà prêt dans `/dist`. Il suffit de déployer.

### 2. Vérifier l'URL Print
Ouvrir dans un navigateur :
```
https://aq-tailwind-quoteedi-nyhc.bolt.host/print.html?token=TEST
```

### 3. Tester avec le Backend
Le backend Playwright doit naviguer vers :
```
https://aq-tailwind-quoteedi-nyhc.bolt.host/print.html?token=xxx
```

---

## 🔗 URLs Importantes

| Service | URL |
|---------|-----|
| **Frontend** | `https://aq-tailwind-quoteedi-nyhc.bolt.host/` |
| **Print Page** | `https://aq-tailwind-quoteedi-nyhc.bolt.host/print.html` |
| **Backend** | `https://quote-pdf-generator-867679263659.europe-west1.run.app` |
| **API Data** | `https://quote-pdf-generator-867679263659.europe-west1.run.app/api/pdf/data?token=xxx` |

---

## ✅ Ce qui Fonctionne

- ✅ Build multi-entrée avec bundles séparés
- ✅ Composant `PrintableQuote` qui fetch les données
- ✅ Gestion des erreurs token (400/404/410)
- ✅ Attente des ressources (fonts + images)
- ✅ Pagination automatique avec Paged.js
- ✅ Signal `window.__PDF_READY__ = true`
- ✅ Header/footer via running elements
- ✅ Styles print optimisés

---

## 🎯 Configuration Backend Requise

Le backend doit :

1. **CORS** : Autoriser `https://aq-tailwind-quoteedi-nyhc.bolt.host`
2. **Endpoint** : Exposer `/api/pdf/data?token=xxx`
3. **Playwright** : Naviguer vers la print page
4. **Attente** : Poller `window.__PDF_READY__` avant capture
5. **Timeout** : Minimum 30 secondes

---

## 🧪 Test Rapide

### Test 1 : Page Print Accessible
```bash
curl -I https://aq-tailwind-quoteedi-nyhc.bolt.host/print.html
# Attendu : 200 OK
```

### Test 2 : Backend API
```bash
curl https://quote-pdf-generator-867679263659.europe-west1.run.app/api/pdf/data?token=TEST
# Attendu : JSON avec données ou erreur appropriée
```

### Test 3 : Console Navigateur
Ouvrir `/print.html?token=VALID_TOKEN` et vérifier :
- ✅ Aucune erreur CORS
- ✅ Données chargées
- ✅ Message "PDF ready for capture"
- ✅ `window.__PDF_READY__ === true`

---

## 📝 Notes Importantes

- Les tokens sont **à usage unique**
- Timeout recommandé : **30 secondes**
- Temps de chargement normal : **< 10 secondes**
- Format PDF : **A4 portrait**
- Marges : **3.5cm (top), 2.5cm (bottom), 2cm (left/right)**

---

## 🆘 En Cas de Problème

| Problème | Solution |
|----------|----------|
| **Page blanche** | Vérifier console navigateur |
| **Erreur CORS** | Vérifier config CORS backend |
| **Token invalide** | Vérifier génération token backend |
| **Timeout** | Augmenter timeout Playwright |
| **Images manquantes** | Vérifier accessibilité CORS |

---

## 📚 Documentation Complète

Pour plus de détails, consulter :
- **DEPLOYMENT_READY.md** : Checklist complète
- **PRINT_HTML_IMPLEMENTATION.md** : Architecture détaillée
- **TEST_PRINT_INTEGRATION.md** : Guide de tests

---

**🎉 Prêt pour Production !**

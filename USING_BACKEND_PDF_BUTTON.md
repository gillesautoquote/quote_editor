# Utilisation du Bouton PDF Backend

## ✅ Ce qui a été ajouté

Un menu déroulant sur le bouton PDF dans la toolbar vous permet maintenant de choisir entre deux options:

### 1. PDF Client-Side
- **Rapide** - Génération instantanée dans le navigateur
- Utilise `@react-pdf/renderer`
- Pas de dépendance au serveur
- Parfait pour un aperçu rapide

### 2. PDF Server-Side ⭐ NOUVEAU
- **Qualité optimale** - Génération professionnelle par le serveur
- Utilise Playwright + Paged.js sur le backend
- Mise en page précise avec marges et pagination correctes
- Meilleure gestion des fonts et images
- Headers/footers répétés sur chaque page

---

## 🎯 Comment l'utiliser

### Étape 1: Cliquer sur le bouton PDF

Dans la toolbar en haut de l'éditeur de devis, vous verrez un bouton "PDF" avec une petite flèche vers le bas.

### Étape 2: Choisir l'option

Deux options s'affichent:
- **PDF Client-Side** : pour un test rapide
- **PDF Server-Side** : pour la version finale de qualité

### Étape 3: Attendre la génération

Pour le PDF Server-Side:
1. Le bouton peut prendre 5-10 secondes (c'est normal!)
2. Le navigateur télécharge automatiquement le PDF
3. Vérifier votre dossier "Téléchargements"

---

## 🔧 Configuration Backend Requise

Pour que le PDF Server-Side fonctionne, le backend doit:

### 1. Exposer l'endpoint `/api/pdf/generate`

```javascript
app.post('/api/pdf/generate', async (req, res) => {
  const { quoteData } = req.body;

  // 1. Créer un token one-time
  const token = generateToken(quoteData);

  // 2. Lancer Playwright
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 3. Naviguer vers la page print
  await page.goto(
    `https://aq-tailwind-quoteedi-nyhc.bolt.host/print.html?token=${token}`,
    { waitUntil: 'networkidle2', timeout: 30000 }
  );

  // 4. Attendre que Paged.js ait terminé
  await page.waitForFunction(() => window.__PDF_READY__ === true, {
    timeout: 30000
  });

  // 5. Générer le PDF
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true
  });

  await browser.close();

  // 6. Retourner le PDF
  res.contentType('application/pdf');
  res.send(pdf);
});
```

### 2. Configurer CORS

```javascript
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://aq-tailwind-quoteedi-nyhc.bolt.host');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});
```

### 3. Endpoint pour récupérer les données

```javascript
app.get('/api/pdf/data', (req, res) => {
  const { token } = req.query;

  // Vérifier et récupérer les données associées au token
  const quoteData = getDataFromToken(token);

  if (!quoteData) {
    return res.status(410).json({ error: 'Token expiré ou invalide' });
  }

  // Invalider le token après utilisation
  invalidateToken(token);

  res.json(quoteData);
});
```

---

## ⚠️ Troubleshooting

### Erreur: "Backend URL non configuré"

**Solution**: Vérifier que `VITE_BACKEND_URL` est défini dans le fichier `.env`

```bash
VITE_BACKEND_URL=https://quote-pdf-generator-867679263659.europe-west1.run.app
```

### Erreur CORS

**Symptôme**: Dans la console: "Access to fetch...has been blocked by CORS policy"

**Solution**: Configurer les headers CORS sur le backend (voir ci-dessus)

### Timeout / Pas de réponse

**Symptôme**: Le bouton reste en "chargement" indéfiniment

**Solutions**:
1. Vérifier que le backend est accessible
2. Augmenter le timeout Playwright (minimum 30s)
3. Vérifier les logs backend

### Le PDF est vide

**Symptôme**: Le PDF se télécharge mais est vide

**Solutions**:
1. Vérifier que `/print.html?token=xxx` fonctionne dans le navigateur
2. Vérifier que `window.__PDF_READY__` est défini
3. Vérifier les logs Playwright

---

## 📊 Différences entre les deux méthodes

| Caractéristique | Client-Side | Server-Side |
|----------------|-------------|-------------|
| **Vitesse** | Instantané | 5-10 secondes |
| **Qualité** | Bonne | Excellente |
| **Pagination** | Automatique | Paged.js optimisé |
| **Headers/Footers** | Limités | Répétés sur chaque page |
| **Images** | Limitées | Toutes supportées |
| **Fonts** | Variables | Professionnelles |
| **Dépendance** | Aucune | Backend requis |

---

## 🎨 Personnalisation

### Changer le nom du fichier

Le fichier téléchargé est nommé: `devis-{numero}-{version}.pdf`

Pour changer, modifier dans `useBackendPDFExport.ts`:

```typescript
const fileName = `devis-${data.quote.number}-${data.quote.version}.pdf`;
```

### Ajouter des métadonnées PDF

Côté backend, ajouter dans `page.pdf()`:

```javascript
const pdf = await page.pdf({
  format: 'A4',
  printBackground: true,
  displayHeaderFooter: false,
  margin: { top: 0, right: 0, bottom: 0, left: 0 }
});
```

---

## 🚀 Optimisations Futures

### 1. Cache des PDFs

Mettre en cache les PDFs générés pour éviter de régénérer le même devis:

```javascript
const cacheKey = `pdf_${quoteData.quote.number}_${quoteData.quote.version}`;
const cached = await cache.get(cacheKey);

if (cached) {
  return res.send(cached);
}

// Générer et mettre en cache...
```

### 2. File d'attente

Pour gérer plusieurs demandes simultanées:

```javascript
const queue = new Queue('pdf-generation', {
  concurrency: 2 // Max 2 PDF en parallèle
});
```

### 3. Webhooks

Générer le PDF de manière asynchrone et notifier via webhook:

```javascript
// Retourner immédiatement un job ID
res.json({ jobId: uuid() });

// Générer en arrière-plan
queue.add({ jobId, quoteData });

// Notifier via webhook quand prêt
await webhook.send({ jobId, pdfUrl });
```

---

## 📝 Logs Utiles

### Frontend (Console)

```
[QuoteEditor] Exporting PDF via backend...
[Backend PDF] Starting export...
[Backend PDF] Export réussi!
[QuoteEditor] Backend PDF export successful
```

### Backend (Serveur)

```
POST /api/pdf/generate - Token généré: abc123
Playwright: Navigating to print.html?token=abc123
Playwright: Waiting for __PDF_READY__...
Playwright: __PDF_READY__ = true
PDF generated successfully (2.3MB)
```

---

**Besoin d'aide?** Consulter:
- `DEPLOYMENT_READY.md` - Checklist complète
- `TEST_PRINT_INTEGRATION.md` - Tests détaillés
- `PRINT_HTML_IMPLEMENTATION.md` - Architecture technique

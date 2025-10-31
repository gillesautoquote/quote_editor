# Architecture Cible : Génération PDF avec Séparation Frontend/Backend

## 🎯 Vue d'ensemble

Cette architecture vise à **éliminer la duplication de code** entre le projet frontend (`quote_editor`) et le backend PDF (`Quote_pdf_generator`), en faisant en sorte que **tout le code de rendu reste dans le frontend**.

---

## 🏗️ Architecture globale

```
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND (quote_editor)                                        │
│  Repository: quote_editor                                       │
│  Hébergement: Vercel / Netlify / CDN                            │
│  URL: https://quote-editor.votresite.com                        │
│                                                                  │
│  ├─ /                    → Interface normale (avec tabs)        │
│  │   ├─ QuoteEditor.tsx  (mode normal)                          │
│  │   └─ Bouton "📄 Télécharger PDF"                             │
│  │                                                               │
│  └─ /print.html          → Mode print (flat, sans tabs)         │
│      ├─ QuoteEditor.tsx  (useTabs=false, printMode=true)        │
│      ├─ Paged.js         (pagination automatique)               │
│      ├─ print.css        (règles @page, print styles)           │
│      └─ Récupère les données via token                          │
└─────────────────────────────────────────────────────────────────┘
                              ↕ API REST
┌─────────────────────────────────────────────────────────────────┐
│  BACKEND (Quote_pdf_generator)                                  │
│  Repository: Quote_pdf_generator                                │
│  Hébergement: Google Cloud Run                                  │
│  URL: https://pdf-api.votresite.com                             │
│                                                                  │
│  ├─ POST /api/pdf/quote     → Génère le PDF                     │
│  ├─ GET  /api/pdf/data      → Récupère données via token        │
│  ├─ Playwright              → Ouvre le frontend en headless     │
│  └─ Token Store (Map RAM)   → Stockage temporaire (5 min)       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flow complet : De l'interface au PDF

### Étape 1 : L'utilisateur demande un PDF

```tsx
// Frontend: quote_editor/src/Components/QuoteEditor/QuoteEditor.tsx

const handleDownloadPDF = async () => {
  setLoading(true);
  
  try {
    // Appelle l'API backend avec toutes les données du devis
    const response = await fetch('https://pdf-api.votresite.com/api/pdf/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quoteData), // 35 KB de JSON
    });

    if (!response.ok) throw new Error('Erreur génération PDF');

    // Télécharge le PDF
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devis-${quoteData.quote.number}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Erreur:', error);
    alert('Impossible de générer le PDF');
  } finally {
    setLoading(false);
  }
};

// Bouton dans l'interface
<button onClick={handleDownloadPDF} disabled={loading}>
  {loading ? '⏳ Génération en cours...' : '📄 Télécharger PDF'}
</button>
```

---

### Étape 2 : Le backend génère un token et lance Playwright

```typescript
// Backend: Quote_pdf_generator/server/index.ts

import Fastify from 'fastify';
import { chromium } from 'playwright';
import crypto from 'crypto';

const app = Fastify({ logger: true });

// Token store en RAM (pas de DB nécessaire)
const tokenStore = new Map<string, any>();

// Nettoyage automatique des tokens expirés
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of tokenStore.entries()) {
    if (now - data.timestamp > 300000) { // 5 min
      tokenStore.delete(token);
    }
  }
}, 60000); // Chaque minute

// API 1 : Génération du PDF
app.post('/api/pdf/quote', async (request, reply) => {
  try {
    const quoteData = request.body;

    // Génère un token unique
    const token = crypto.randomBytes(16).toString('hex');
    
    // Stocke les données temporairement avec timestamp
    tokenStore.set(token, {
      data: quoteData,
      timestamp: Date.now(),
    });

    // Lance Playwright
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    const page = await browser.newPage();

    // 🎯 CLEF : Ouvre le FRONTEND hébergé ailleurs (pas de duplication de code !)
    const frontendURL = process.env.FRONTEND_URL || 'https://quote-editor.votresite.com';
    
    await page.goto(`${frontendURL}/print.html?token=${token}`, {
      waitUntil: 'networkidle',
      timeout: 60000,
    });

    // Attend que Paged.js ait terminé la pagination
    await page.waitForFunction('window.__PDF_READY__ === true', {
      timeout: 30000,
    });

    // Génère le PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
    });

    await browser.close();

    // Nettoie le token immédiatement
    tokenStore.delete(token);

    app.log.info(`PDF généré pour devis ${quoteData.quote.number}`);

    // Renvoie le PDF au frontend
    return reply
      .type('application/pdf')
      .header('Content-Disposition', `attachment; filename="devis-${quoteData.quote.number}.pdf"`)
      .send(pdfBuffer);

  } catch (error) {
    app.log.error('Erreur génération PDF:', error);
    return reply.status(500).send({ error: 'Erreur lors de la génération du PDF' });
  }
});

// API 2 : Récupération des données (appelée par /print.html)
app.get('/api/pdf/data', async (request, reply) => {
  const { token } = request.query as { token: string };

  if (!token) {
    return reply.status(400).send({ error: 'Token manquant' });
  }

  const entry = tokenStore.get(token);

  if (!entry) {
    return reply.status(404).send({ error: 'Token invalide ou expiré' });
  }

  app.log.info(`Données récupérées pour token ${token}`);

  return reply.send(entry.data);
});

// Health check pour Cloud Run
app.get('/health', async (request, reply) => {
  return reply.send({ status: 'ok', tokens: tokenStore.size });
});

app.listen({ 
  port: parseInt(process.env.PORT || '8080'),
  host: '0.0.0.0'
});
```

---

### Étape 3 : Le frontend /print.html récupère les données et s'affiche

```tsx
// Frontend: quote_editor/src/print.tsx

import { useEffect, useState } from 'react';
import { QuoteEditor } from './Components/QuoteEditor';
import type { QuoteData } from './Components/QuoteEditor/entities/QuoteData';

export const PrintableQuote = () => {
  const [data, setData] = useState<QuoteData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDataAndPrepare = async () => {
      try {
        // 1. Récupère le token depuis l'URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (!token) {
          throw new Error('Token manquant dans l\'URL');
        }

        // 2. Appelle le backend pour récupérer les données
        const backendURL = import.meta.env.VITE_BACKEND_URL || 'https://pdf-api.votresite.com';
        const response = await fetch(`${backendURL}/api/pdf/data?token=${token}`);

        if (!response.ok) {
          throw new Error('Token invalide ou expiré');
        }

        const quoteData = await response.json();
        setData(quoteData);

        // 3. Attend que les fonts soient chargées
        await document.fonts.ready;

        // 4. Petit délai pour que React finisse le rendu
        await new Promise(resolve => setTimeout(resolve, 500));

        // 5. Lance Paged.js pour la pagination
        const Paged = await import('pagedjs');
        const previewer = new Paged.Previewer();
        await previewer.preview();

        // 6. Signal à Playwright que tout est prêt
        (window as any).__PDF_READY__ = true;
        console.log('✅ PDF ready for capture');

      } catch (err) {
        console.error('Erreur chargement:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      }
    };

    loadDataAndPrepare();
  }, []);

  if (error) {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        <h1>Erreur</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Chargement des données...</h1>
      </div>
    );
  }

  return (
    <>
      {/* Header répété sur chaque page (géré par Paged.js) */}
      <div className="pagedjs-header print-header">
        <QuotePageHeader 
          company={data.company}
          quote={data.quote}
          onFieldUpdate={() => {}}
          readonly={true}
        />
      </div>

      {/* Footer répété sur chaque page (géré par Paged.js) */}
      <div className="pagedjs-footer print-footer">
        <QuotePageFooter company={data.company} />
      </div>

      {/* Contenu principal - QuoteEditor en mode flat */}
      <QuoteEditor 
        data={data}
        useTabs={false}           // ✅ Mode linéaire (pas de tabs)
        printMode={true}          // ✅ Masque les contrôles interactifs
        showHeader={false}        // ✅ Pas de header interne (géré par Paged.js)
        showFooter={false}        // ✅ Pas de footer interne (géré par Paged.js)
        onChange={() => {}}       // Readonly
      />
    </>
  );
};
```

---

## 📦 Déploiements séparés

### Frontend (quote_editor)

**Hébergement recommandé** : Vercel / Netlify (CDN, gratuit, rapide)

```bash
# Configuration Vercel
cd quote_editor
npm run build

# vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}

# Déploiement
vercel --prod
# → https://quote-editor.votresite.com
```

**Variables d'environnement** :
```env
VITE_BACKEND_URL=https://pdf-api.votresite.com
```

---

### Backend (Quote_pdf_generator)

**Hébergement recommandé** : Google Cloud Run (auto-scaling, Playwright supporté)

```dockerfile
# Dockerfile
FROM mcr.microsoft.com/playwright:v1.56.1-jammy

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy server code
COPY server ./server
COPY tsconfig*.json ./

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "dist/server/index.js"]
```

```bash
# Déploiement Cloud Run
gcloud run deploy pdf-generator \
  --source . \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 2Gi \
  --timeout 60s \
  --set-env-vars FRONTEND_URL=https://quote-editor.votresite.com

# → https://pdf-api.votresite.com
```

**Variables d'environnement** :
```env
FRONTEND_URL=https://quote-editor.votresite.com
PORT=8080
NODE_ENV=production
```

---

## ✅ Avantages de cette architecture

### 1. **Zéro duplication de code**
- Le code QuoteEditor, print.css, Paged.js restent **uniquement** dans le repo frontend
- Le backend n'a que 100 lignes de code (Fastify + Playwright)
- Une seule source de vérité pour le rendu print

### 2. **Indépendance des déploiements**
- Le frontend peut être mis à jour sans redéployer le backend
- Le backend peut être mis à jour sans toucher au frontend
- Chaque équipe peut travailler indépendamment

### 3. **Facilité de debug**
- Tu peux ouvrir `/print.html?token=xxx` directement dans ton navigateur
- Tu vois **exactement** ce que Playwright va générer
- Les outils de dev Chrome/Firefox fonctionnent normalement

### 4. **Performance et scalabilité**
- Frontend sur CDN → ultra-rapide, cache global
- Backend sur Cloud Run → auto-scaling selon la charge
- Token store en RAM → pas de latence DB

### 5. **Coût optimisé**
- Frontend : gratuit sur Vercel/Netlify (CDN inclus)
- Backend : pay-per-use sur Cloud Run (seulement quand on génère un PDF)
- Pas de DB à gérer/payer

### 6. **Sécurité**
- Les tokens expirent automatiquement après 5 min
- Pas de données sensibles stockées longtemps
- CORS configuré pour autoriser uniquement le frontend

---

## 🎯 Ce que le frontend doit fournir

Le développeur du `quote_editor` doit implémenter :

### Props nécessaires pour le mode print

```tsx
interface QuoteEditorProps {
  data: QuoteData;
  
  // Mode d'affichage
  useTabs?: boolean;          // false = mode linéaire (tous les onglets visibles)
  printMode?: boolean;        // true = masque les contrôles interactifs
  
  // Contrôle header/footer
  showHeader?: boolean;       // false = pas de header interne
  showFooter?: boolean;       // false = pas de footer interne
  
  // Callbacks (readonly en mode print)
  onChange?: (data: QuoteData) => void;
}
```

### Classes CSS print-friendly

```tsx
// Utiliser les variants Tailwind print:
<button className="tw-btn print:tw-hidden">Modifier</button>
<div className="tw-border print:tw-border-none">...</div>
```

### Attributs data-* pour ciblage CSS

```tsx
<div data-type="programme-voyage">...</div>
<div data-type="notes">...</div>
<div data-component="quote-section">...</div>
```

### Fichier print.css avec règles @page

```css
/* quote_editor/src/print.css */
@page {
  size: A4;
  margin: 48mm 20mm 30mm 20mm;
}

.pagedjs-header {
  position: running(pageHeader);
}

.pagedjs-footer {
  position: running(pageFooter);
}

/* Éviter coupures dans les étapes de voyage */
[data-type="programme-voyage"] .trip-step {
  page-break-inside: avoid;
  break-inside: avoid;
}
```

---

## 🚫 Ce que le frontend NE doit PAS faire

- ❌ Gérer la génération du PDF (c'est le backend qui fait ça)
- ❌ Implémenter la logique de token (c'est le backend qui gère)
- ❌ Dupliquer les règles de pagination (Paged.js s'en occupe)
- ❌ Se préoccuper de Playwright (transparent pour le frontend)

---

## 📋 Checklist de migration

### Phase 1 : Préparation frontend
- [ ] Ajouter les props `useTabs`, `printMode`, `showHeader`, `showFooter` au QuoteEditor
- [ ] Créer `/print.html` et `print.tsx`
- [ ] Ajouter Paged.js dans les dépendances
- [ ] Créer `print.css` avec les règles @page
- [ ] Ajouter le bouton "Télécharger PDF" dans l'interface normale
- [ ] Tester `/print.html` en local avec des données mock

### Phase 2 : Backend minimal
- [ ] Créer le repo `Quote_pdf_generator` (si pas déjà fait)
- [ ] Implémenter `POST /api/pdf/quote` avec token store
- [ ] Implémenter `GET /api/pdf/data`
- [ ] Tester en local avec Docker + Playwright
- [ ] Configurer CORS pour autoriser le frontend

### Phase 3 : Déploiements
- [ ] Déployer le frontend sur Vercel/Netlify
- [ ] Configurer la variable `VITE_BACKEND_URL`
- [ ] Déployer le backend sur Google Cloud Run
- [ ] Configurer la variable `FRONTEND_URL`
- [ ] Tester le flow complet en production

### Phase 4 : Nettoyage
- [ ] Supprimer le code dupliqué du backend (si existant)
- [ ] Supprimer les anciens endpoints PDF (si existants)
- [ ] Mettre à jour la documentation

---

## 🔐 Sécurité et bonnes pratiques

### Gestion des tokens
```typescript
// Bonnes pratiques token store
const tokenStore = new Map<string, {
  data: any;
  timestamp: number;
  ip?: string;        // Optionnel : IP du demandeur
  used: boolean;      // Empêcher la réutilisation
}>();

// Limiter les tentatives
const rateLimiter = new Map<string, number>();
```

### CORS strict
```typescript
// Backend: Autoriser uniquement le frontend
app.register(require('@fastify/cors'), {
  origin: ['https://quote-editor.votresite.com'],
  methods: ['GET', 'POST'],
  credentials: true,
});
```

### Timeouts robustes
```typescript
// Playwright avec timeouts généreux
await page.goto(url, { 
  waitUntil: 'networkidle', 
  timeout: 60000  // 1 min max
});

await page.waitForFunction('window.__PDF_READY__', { 
  timeout: 30000  // 30s max pour Paged.js
});
```

---

## 📊 Monitoring et logs

### Métriques à surveiller
- Nombre de PDFs générés / jour
- Temps moyen de génération
- Taux d'erreur
- Nombre de tokens actifs
- Utilisation mémoire (token store)

### Logs structurés
```typescript
app.log.info({
  action: 'pdf_generated',
  quoteNumber: quoteData.quote.number,
  duration: Date.now() - startTime,
  pdfSize: pdfBuffer.length,
});
```

---

## 🎓 Points clés à retenir

1. **Le frontend est la source de vérité** pour le rendu print
2. **Le backend ne fait QUE de l'orchestration** (Playwright + token store)
3. **Pas de DB nécessaire** (token store en RAM suffit)
4. **Architecture découplée** (frontend et backend indépendants)
5. **Facile à debugger** (ouvre `/print.html` dans un vrai navigateur)
6. **Scalable** (frontend sur CDN, backend auto-scale sur Cloud Run)

---

## 📞 Contact et maintenance

**Responsabilités** :
- **Équipe Frontend** : QuoteEditor, print.css, Paged.js, /print.html
- **Équipe Backend** : API Fastify, Playwright, token store, déploiement Cloud Run

**En cas de problème de rendu PDF** :
1. D'abord tester `/print.html` en local dans Chrome
2. Si OK en local → problème backend (Playwright config)
3. Si KO en local → problème frontend (CSS, Paged.js, React)

---

*Document créé le : 2025-10-29*  
*Dernière mise à jour : 2025-10-29*


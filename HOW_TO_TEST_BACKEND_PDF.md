# Comment Tester l'Export PDF Backend

## Méthode Rapide : Console Navigateur

La manière la plus simple de tester l'export PDF backend est d'utiliser la console du navigateur.

### Étapes

1. **Ouvrir l'Application**
   ```
   https://aq-tailwind-quoteedi-nyhc.bolt.host/
   ```

2. **Ouvrir la Console** (F12 ou Cmd+Opt+I sur Mac)

3. **Coller le Code Suivant** dans la console:

```javascript
// Fonction pour exporter via le backend
async function exportPDFBackend() {
  console.log('[Backend PDF] Starting export...');

  // Récupérer les données du devis depuis l'éditeur
  const editorElement = document.querySelector('[data-component="quote-editor"]');
  if (!editorElement) {
    console.error('[Backend PDF] Quote editor not found');
    return;
  }

  // Option 1: Si vous avez accès au composant React
  // Récupérer les données via le global event emitter
  const QuoteEditor = window.QuoteEditor; // Si exposé

  // Option 2: Utiliser les données mock pour le test
  const mockData = await fetch('/src/Components/QuoteEditor/mocks/data.mock.json')
    .then(r => r.json());

  const backendUrl = 'https://quote-pdf-generator-867679263659.europe-west1.run.app';

  try {
    const response = await fetch(`${backendUrl}/api/pdf/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quoteData: mockData }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Backend PDF] Error:', response.status, errorText);
      throw new Error(`Erreur ${response.status}: ${errorText}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `devis-${Date.now()}.pdf`;
    link.click();
    URL.revokeObjectURL(url);

    console.log('[Backend PDF] Export réussi!');
  } catch (error) {
    console.error('[Backend PDF] Export failed:', error);
  }
}

// Lancer l'export
exportPDFBackend();
```

4. **Appuyer sur Entrée**

Le PDF devrait se télécharger automatiquement!

---

## Alternative : Créer un Bouton Temporaire

Si vous préférez avoir un bouton dans l'interface:

### Étape 1: Ouvrir la Console

### Étape 2: Coller ce Code

```javascript
// Créer un bouton flottant
const button = document.createElement('button');
button.textContent = 'PDF Backend';
button.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 10000;
  padding: 12px 24px;
  background: #4F46E5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: all 0.2s;
`;

button.onmouseover = () => {
  button.style.background = '#4338CA';
  button.style.transform = 'scale(1.05)';
};

button.onmouseout = () => {
  button.style.background = '#4F46E5';
  button.style.transform = 'scale(1)';
};

button.onclick = async () => {
  button.textContent = 'Génération...';
  button.disabled = true;

  try {
    const mockData = await fetch('/src/Components/QuoteEditor/mocks/data.mock.json')
      .then(r => r.json());

    const backendUrl = 'https://quote-pdf-generator-867679263659.europe-west1.run.app';

    const response = await fetch(`${backendUrl}/api/pdf/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quoteData: mockData }),
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `devis-${Date.now()}.pdf`;
    link.click();
    URL.revokeObjectURL(url);

    button.textContent = '✓ PDF Téléchargé';
    setTimeout(() => {
      button.textContent = 'PDF Backend';
      button.disabled = false;
    }, 2000);
  } catch (error) {
    console.error('[Backend PDF] Error:', error);
    button.textContent = '✗ Erreur';
    button.style.background = '#EF4444';
    setTimeout(() => {
      button.textContent = 'PDF Backend';
      button.style.background = '#4F46E5';
      button.disabled = false;
    }, 3000);
  }
};

document.body.appendChild(button);
console.log('[Backend PDF] Bouton ajouté en bas à droite de la page');
```

Un bouton "PDF Backend" apparaîtra en bas à droite de la page!

---

## Vérifier que Ça Fonctionne

### Logs dans la Console

Vous devriez voir:
```
[Backend PDF] Starting export...
[Backend PDF] Export réussi!
```

### Si Erreur CORS

Si vous voyez une erreur CORS, c'est que le backend n'autorise pas encore le frontend.

**Solution Backend**: Ajouter dans les headers de réponse:
```javascript
res.setHeader('Access-Control-Allow-Origin', 'https://aq-tailwind-quoteedi-nyhc.bolt.host');
```

### Si Erreur 404

L'endpoint `/api/pdf/generate` n'existe pas encore sur le backend.

### Si Timeout

Le backend met trop de temps à répondre. Augmenter le timeout côté backend.

---

## Prochaine Étape : Intégration Permanente

Une fois que le test fonctionne, on peut:

1. **Ajouter un vrai bouton** dans le toolbar
2. **Créer un hook** `useBackendPDFExport` (déjà créé!)
3. **Modifier QuoteEditor.tsx** pour intégrer le backend export

Pour cela, il faudra:
- Importer le hook `useBackendPDFExport`
- Ajouter la prop `onExportPDFBackend` au toolbar
- Créer un handler `handleExportPDFBackend`

---

## Test Complet de l'Intégration

### Test 1: API Direct

```bash
curl -X POST https://quote-pdf-generator-867679263659.europe-west1.run.app/api/pdf/generate \
  -H "Content-Type: application/json" \
  -d '{"quoteData": {"quote": {"number": "TEST-001"}}}' \
  -o test.pdf
```

### Test 2: Print Page

```
https://aq-tailwind-quoteedi-nyhc.bolt.host/print.html?token=test
```

Devrait afficher:
- Soit les données du devis
- Soit "Token invalide"

---

## Notes Importantes

- Le backend utilise Playwright pour accéder à `/print.html?token=xxx`
- Le token est à usage unique (expire après utilisation)
- Le délai de génération est de ~5-10 secondes
- La qualité du PDF backend est supérieure au PDF client-side

---

## Debugging

### Activer les Logs Détaillés

```javascript
localStorage.setItem('DEBUG_PDF', 'true');
```

### Voir les Requêtes Réseau

Onglet "Network" dans les DevTools -> Filtrer "pdf"

### Tester avec Postman

1. Créer une requête POST
2. URL: `https://quote-pdf-generator-867679263659.europe-west1.run.app/api/pdf/generate`
3. Body: JSON avec `quoteData`
4. Envoyer

---

**Besoin d'aide?** Vérifier les fichiers:
- `DEPLOYMENT_READY.md` - Checklist complète
- `TEST_PRINT_INTEGRATION.md` - Tests détaillés
- `PRINT_HTML_IMPLEMENTATION.md` - Architecture

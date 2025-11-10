# QuickStart : QuoteEditor Réactif

## 🎯 En Bref

Le **QuoteEditor** réagit maintenant **instantanément** aux modifications de ses props `data`, parfait pour une architecture à 2 colonnes.

## 🚀 Utilisation Basique

```tsx
import React, { useState } from 'react';
import { QuoteEditor } from './Components/QuoteEditor';

function MyApp() {
  const [quoteData, setQuoteData] = useState<QuoteData>(initialData);

  // Modifier depuis votre formulaire
  const updateClient = () => {
    setQuoteData(prev => ({
      ...prev,
      recipient: { ...prev.recipient, fullName: "Nouveau nom" }
    }));
    // ✅ QuoteEditor se met à jour automatiquement et IMMÉDIATEMENT
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Colonne Gauche : Votre Formulaire */}
      <div className="col-span-4">
        <input onChange={(e) => {
          setQuoteData(prev => ({
            ...prev,
            recipient: { ...prev.recipient, fullName: e.target.value }
          }));
        }} />
        <button onClick={updateClient}>Mettre à jour</button>
      </div>

      {/* Colonne Droite : QuoteEditor */}
      <div className="col-span-8">
        <QuoteEditor
          data={quoteData}
          onChange={(newData) => {
            // Appelé uniquement pour les modifs INTERNES
            console.log('User edited something');
          }}
        />
      </div>
    </div>
  );
}
```

## ✅ Ce Qui Fonctionne Automatiquement

- 🔄 **Synchronisation instantanée** entre vos formulaires et le QuoteEditor
- ⏮️ **Undo/Redo global** (Ctrl+Z/Y) qui inclut VOS modifications externes
- 🎯 **Pas de conflit** - l'édition et les updates externes ne se chevauchent jamais
- ⚡ **Performance optimale** - pas de re-renders inutiles

## 📝 Règles Simples

### ✅ À FAIRE

```tsx
// 1. Modifier quoteData directement
setQuoteData({ ...quoteData, recipient: { ...quoteData.recipient, fullName: "X" } });

// 2. Écouter onChange pour les modifs internes
onChange={(newData) => console.log('Internal change')}
```

### ❌ À ÉVITER

```tsx
// ❌ Ne pas mettre à jour quoteData dans onChange
onChange={(newData) => setQuoteData(newData)} // Crée une boucle!

// ✅ À la place, laissez le composant gérer l'état interne
onChange={(newData) => console.log('Just log it')}
```

## 🧪 Tester la Réactivité

Lancez l'app de démo :

```bash
npm run dev
```

Puis testez les boutons dans la sidebar gauche :
- 🔄 Modifier tagline + total
- 👤 Modifier nom client
- ➕ Ajouter une section

Observez les changements **instantanés** dans le QuoteEditor (colonne droite).

## 📚 Documentation Complète

- **[Guide de Réactivité](/docs/REACTIVITY_GUIDE.md)** - Documentation technique complète
- **[Exemple d'Intégration](/docs/INTEGRATION_EXAMPLE.md)** - Code complet 2 colonnes
- **[README QuoteEditor](/src/Components/QuoteEditor/README.md)** - API et props

## 💡 Astuce : Debugging

Ouvrez la console pour voir les logs :

```
[useQuoteEditor] External data change detected
[useQuoteEditor] External data applied to internal state
```

Ces logs confirment que vos modifications externes sont bien détectées et appliquées.

## 🎉 C'est Tout !

Le QuoteEditor gère automatiquement toute la complexité de la synchronisation. Concentrez-vous sur votre logique métier, le composant fait le reste.

---

**Questions ?** Consultez la documentation complète ou testez l'app de démo.

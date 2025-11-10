# Guide de Réactivité du QuoteEditor

## Vue d'ensemble

Le composant `QuoteEditor` est maintenant **entièrement réactif** et conçu pour être utilisé dans une architecture à deux colonnes :
- **Colonne gauche** : Formulaire de modification qui met à jour les données
- **Colonne droite** : `<QuoteEditor />` qui reflète instantanément les changements

## Caractéristiques

### ✅ Réactivité Complète

Le composant réagit **instantanément** à tous les changements de la prop `data` :

```tsx
const [quoteData, setQuoteData] = useState<QuoteData>(initialData);

// Modifier les données depuis le formulaire parent
const handleUpdateFromForm = () => {
  const updatedData = {
    ...quoteData,
    quote: {
      ...quoteData.quote,
      tagline: "Nouveau tagline"
    }
  };
  setQuoteData(updatedData); // ✅ Le QuoteEditor se met à jour immédiatement
};

<QuoteEditor data={quoteData} onChange={handleChange} />
```

### 🔄 Historique Undo/Redo Intelligent

Les changements externes sont **automatiquement ajoutés à l'historique** :
- Les modifications depuis le formulaire parent s'ajoutent à la pile undo/redo
- L'utilisateur peut annuler (Ctrl+Z) ou rétablir (Ctrl+Y) les changements externes
- Chaque changement (interne ou externe) est traçable dans l'historique

### 🎯 Détection Intelligente des Changements

Le système utilise une comparaison profonde pour détecter les vrais changements :
- Évite les re-renders inutiles si les données n'ont pas vraiment changé
- Compare la structure complète des données
- Fonctionne avec des objets imbriqués complexes

### 🔒 Pas de Conflit Possible

Comme spécifié, **il n'y a jamais de conflit** :
- Soit l'utilisateur édite un champ (dans le QuoteEditor)
- Soit le formulaire externe modifie les données
- Ces deux actions ne peuvent pas se produire simultanément

## Architecture Technique

### 1. Hook `useQuoteEditor`

Le hook gère la synchronisation automatique :

```typescript
// Détection des changements externes via useEffect
useEffect(() => {
  if (hasQuoteDataChanged(lastExternalDataRef.current, initialData)) {
    console.log('[useQuoteEditor] External data change detected');

    const normalizedData = normalizeQuoteData(initialData);

    // Marqueur pour éviter d'appeler onChange lors d'un changement externe
    isApplyingExternalChangeRef.current = true;
    lastExternalDataRef.current = normalizedData;

    setData(normalizedData);
    addToHistory(normalizedData, 'external'); // ✅ Ajouté à l'historique

    isApplyingExternalChangeRef.current = false;
  }
}, [initialData, addToHistory]);
```

### 2. Tracking de la Source

Chaque entrée dans l'historique identifie sa source :

```typescript
interface HistoryState {
  data: QuoteData;
  timestamp: number;
  source?: 'user' | 'external'; // ✅ Traçabilité
}
```

### 3. Comparaison Profonde

Utilitaire `deepCompare.ts` pour détecter les vrais changements :

```typescript
export const hasQuoteDataChanged = (
  prev: QuoteData | null,
  next: QuoteData | null
): boolean => {
  if (prev === next) return false;
  if (!prev || !next) return true;
  return !deepEqual(prev, next);
};
```

## Utilisation dans un Projet Réel

### Exemple Complet

```tsx
import React, { useState } from 'react';
import { QuoteEditor } from './Components/QuoteEditor';
import type { QuoteData } from './Components/QuoteEditor/QuoteEditor.types';

const MyApp = () => {
  const [quoteData, setQuoteData] = useState<QuoteData>(initialData);

  // Callback appelé uniquement pour les modifications INTERNES (depuis QuoteEditor)
  const handleQuoteChange = (newData: QuoteData) => {
    console.log('Internal change from QuoteEditor');
    // Optionnel : vous pouvez synchroniser avec votre backend ici
  };

  // Actions du formulaire externe (colonne gauche)
  const handleUpdateClientName = () => {
    setQuoteData(prev => ({
      ...prev,
      recipient: {
        ...prev.recipient,
        fullName: "Nouveau nom"
      }
    }));
  };

  const handleAddSection = () => {
    setQuoteData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Colonne Gauche : Formulaire */}
      <div className="col-span-3">
        <button onClick={handleUpdateClientName}>
          Modifier le client
        </button>
        <button onClick={handleAddSection}>
          Ajouter une section
        </button>
      </div>

      {/* Colonne Droite : QuoteEditor */}
      <div className="col-span-9">
        <QuoteEditor
          data={quoteData}
          onChange={handleQuoteChange}
          readonly={false}
        />
      </div>
    </div>
  );
};
```

## Bonnes Pratiques

### ✅ À FAIRE

1. **Modifier la prop `data` directement** depuis le parent pour les changements externes
2. **Utiliser `onChange`** pour écouter les modifications internes du QuoteEditor
3. **Ne pas réassigner** `data` dans `onChange` si vous voulez éviter des boucles
4. **Laisser le composant gérer** l'historique undo/redo automatiquement

### ❌ À ÉVITER

1. **Ne pas modifier `data` ET écouter `onChange` en même temps** pour la même action
2. **Ne pas créer de boucles infinies** en mettant à jour `data` dans `onChange`
3. **Ne pas ignorer la validation** - toujours utiliser des données valides
4. **Ne pas assumer** que onChange est appelé pour les changements externes

## Démonstration

Le fichier `src/App.tsx` contient une démonstration complète avec :
- Bouton "🔄 Modifier tagline + total" : Met à jour plusieurs champs
- Bouton "👤 Modifier nom client" : Change le destinataire
- Bouton "➕ Ajouter une section" : Ajoute du contenu
- Compteur de mises à jour externes

Lancez `npm run dev` et testez ces boutons pour voir la réactivité en action !

## Debugging

### Logs de Débogage

Le composant inclut des logs détaillés :

```
[useQuoteEditor] External data change detected
[useQuoteEditor] External data applied to internal state
[QuoteEditor] External data update detected in parent props
```

### Vérifier la Réactivité

1. Ouvrez la console du navigateur
2. Cliquez sur un bouton du formulaire externe
3. Observez les logs confirmant la détection et l'application des changements
4. Vérifiez que le QuoteEditor se met à jour visuellement
5. Testez Ctrl+Z pour annuler le changement externe

## Performance

- **Pas de re-render inutile** : Utilise `deepEqual` pour éviter les mises à jour si les données n'ont pas changé
- **Historique optimisé** : Limite automatique à 50 entrées
- **Détection rapide** : Comparaison par référence avant comparaison profonde

## Compatibilité

- ✅ Mode standalone
- ✅ Mode legacy
- ✅ Avec ou sans auto-save
- ✅ Mode readonly
- ✅ Mode flat/print
- ✅ Tous les navigateurs modernes

## Support

Pour toute question ou problème lié à la réactivité :
1. Vérifiez que vous utilisez des données validées (`validateQuoteData`)
2. Consultez les logs de la console
3. Testez avec l'exemple fourni dans `App.tsx`

# INSTRUCTIONS INITIALES - QuoteEditor Standalone Component

## Contexte et Contraintes Non-Négociables

Ce document définit les règles et conventions strictes qui ont guidé la conception et l'implémentation du composant QuoteEditor.

### Principes Fondamentaux

1. **Autonomie Totale**: Le composant ne doit avoir AUCUNE dépendance au projet parent
2. **TypeScript Strict**: Mode strict activé, aucun `any` non justifié
3. **Tailwind First**: 95% des styles via Tailwind avec préfixe `tw-` obligatoire
4. **SCSS Modules**: 5% des styles pour variables locales et cas spécifiques
5. **Zero Bootstrap**: Aucune dépendance à Bootstrap ou autres frameworks CSS
6. **Accessibilité AA**: WCAG AA compliant avec navigation clavier complète

## Structure du Composant

```
QuoteEditor/
├── index.ts                          # Barrel export (API publique uniquement)
├── QuoteEditor.tsx                   # Composant principal
├── QuoteEditor.types.ts              # API publique (Props, Events, Data schema)
├── QuoteEditor.module.scss           # Styles locaux
├── README.md                         # Guide d'intégration
├── INSTRUCTIONS_INITIALES.md         # Ce fichier
├── hooks/                            # 1 feature = 1 hook
│   ├── useQuoteEditor.ts
│   ├── usePDFExport.tsx
│   ├── useColorTheme.ts
│   ├── useDragAndDrop.ts
│   ├── useFieldPath.ts
│   └── useListManager.ts
├── components/                       # Sous-composants atomiques
│   ├── QuotePage/
│   ├── QuoteSection/
│   ├── OptionBlock/
│   ├── EditableField/
│   ├── SignatureSection/
│   ├── InstructionsFrame/
│   └── shared/
├── i18n/                            # Traductions FR/EN
│   └── translations.ts
├── mocks/
│   ├── data.mock.json               # Données de démonstration (JSON pur)
│   └── quoteDataMock.ts             # Export TypeScript du mock
├── pdf/                             # Composants PDF (@react-pdf/renderer)
│   ├── QuotePDFDocument.tsx
│   ├── components/
│   ├── styles/
│   └── utils/
├── utils/                           # Utilitaires purs
│   ├── blockUtils.ts
│   ├── calculationUtils.ts
│   ├── colorUtils.ts
│   ├── dataValidator.ts
│   ├── dateFormatters.ts
│   ├── eventEmitter.ts
│   └── textUtils.ts
└── entities/                        # Types legacy (à migrer vers QuoteEditor.types.ts)
    └── QuoteData.ts
```

## Design System Local

### Palette de Couleurs

```typescript
--primary: #4863ec                    // Indigo primary
--primary-hover: #3851d9
--navy-900: #16254d
--navy-800: #192850
--surface-0: #fbfbfc
--surface-100: #e9eaeb
--surface-indigo-50: #e8ebf9
--surface-indigo-100: #d4d9f8
--surface-indigo-150: #c3cbf7
--muted-gray: #d5d7db
--warning: #ecb424
--error: #e4545f
--success: #41a170
```

### Border Radius

```scss
--tw-radius-sm: 6px
--tw-radius-md: 10px
--tw-radius-lg: 16px
--tw-radius-2xl: 20px
```

### Ombres

```scss
--tw-shadow-sm: 0 1px 2px rgb(0 0 0 / 0.05)
--tw-shadow-md: 0 4px 10px rgb(16 24 40 / 0.08)
```

### Transitions

```scss
tw-transition tw-duration-200 tw-ease-out
```

## API Publique

### Props Interface

```typescript
interface QuoteEditorProps {
  // Données entrantes (mode API)
  data?: QuoteData;

  // Mode mock intégré
  mock?: boolean;

  // Localisation
  locale?: 'fr' | 'en';

  // Thème
  theme?: 'light' | 'dark';

  // Modes d'affichage
  readonly?: boolean;
  className?: string;

  // Callbacks d'événements
  onEvent?: (evt: ComponentEvent) => void;

  // Configuration UI
  showToolbar?: boolean;
  showAddSection?: boolean;
  showAddBlock?: boolean;
  showReset?: boolean;
  showTemplateSelector?: boolean;
  allowWidthControl?: boolean;
}
```

### Events (Discriminated Union)

```typescript
type ComponentEvent =
  | { type: 'ready' }
  | { type: 'error'; code: string; message: string }
  | { type: 'change'; path: string; value: unknown; data: QuoteData }
  | { type: 'save'; data: QuoteData }
  | { type: 'export_pdf'; data: QuoteData }
  | { type: 'undo'; data: QuoteData }
  | { type: 'redo'; data: QuoteData }
  | { type: 'action'; name: string; payload?: unknown };
```

## Conventions de Nommage

### Fichiers et Composants

- **Composants**: PascalCase (`QuoteEditor.tsx`, `EditableField.tsx`)
- **Hooks**: camelCase avec préfixe `use` (`useQuoteEditor.ts`)
- **Utils**: camelCase (`calculationUtils.ts`)
- **Types**: PascalCase (`QuoteData`, `ComponentEvent`)
- **SCSS Modules**: Même nom que le composant (`QuoteEditor.module.scss`)

### Props et Variables

- **Props**: camelCase (`onChange`, `onEvent`, `showToolbar`)
- **Callbacks**: Préfixe `on` (`onEvent`, `onChange`, `onSave`)
- **Booléens**: Préfixe `is`, `has`, `show`, `allow` (`isEditing`, `hasUnsavedChanges`)
- **CSS Classes**: kebab-case pour SCSS, tw-prefixed pour Tailwind

## Règles Tailwind

### Obligatoire

1. **Toujours** utiliser le préfixe `tw-`
2. **Toujours** préférer Tailwind aux styles custom
3. Utiliser `clsx` pour composer les classes conditionnelles

### Exemples

```tsx
// ✅ CORRECT
<div className={clsx(
  styles.wrapper,
  'tw-flex tw-items-center tw-gap-3',
  'tw-rounded-2xl tw-bg-white tw-p-4 tw-shadow-md',
  'dark:tw-bg-slate-900'
)}>

// ❌ INCORRECT
<div className="flex items-center gap-3">  // Manque tw-
<div className={styles.flexContainer}>     // Utiliser Tailwind
```

### Variantes Dark Mode

```tsx
'tw-bg-white dark:tw-bg-slate-900'
'tw-text-gray-900 dark:tw-text-gray-100'
'tw-border-gray-200 dark:tw-border-gray-700'
```

## SCSS Modules

### Usage

- **Variables CSS locales** uniquement (pas de globales)
- **Animations** complexes non supportées par Tailwind
- **Cas spécifiques** (scrollbar custom, overrides ciblés)

### Exemple

```scss
.wrapper {
  // Variables locales
  --local-spacing: 1rem;
  --local-transition: all 0.2s ease-out;

  // Styles non couverts par Tailwind
  &::-webkit-scrollbar {
    width: 8px;
  }

  // Animations complexes
  @keyframes slideIn {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }
}
```

## Accessibilité

### Exigences Obligatoires

1. **Ordre tabulaire** prévisible et logique
2. **Attributs ARIA** sur tous les contrôles interactifs
3. **Focus visible** avec `tw-ring-2 tw-ring-offset-2 tw-ring-primary`
4. **Navigation clavier** complète (Enter, Space, Escape, Arrow keys)
5. **aria-live** pour annonces d'erreurs
6. **Labels traduisibles** via i18n

### Exemples

```tsx
// Bouton accessible
<button
  type="button"
  aria-label={t('toolbar.save')}
  aria-disabled={readonly}
  className="tw-rounded-md tw-px-4 tw-py-2 focus:tw-ring-2 focus:tw-ring-primary"
  onClick={handleSave}
>
  {t('toolbar.save')}
</button>

// Champ éditable
<input
  role="textbox"
  aria-label={t('aria.editableField', { field: 'description' })}
  aria-required="true"
  value={value}
  onChange={handleChange}
/>

// Région live pour erreurs
<div role="alert" aria-live="assertive">
  {error && <span>{error.message}</span>}
</div>
```

## Hooks

### Principes

1. **Une responsabilité par hook**
2. **API minimale** (valeurs + actions)
3. **100% typé** (pas de `any`)
4. **Deps exhaustives** dans useEffect
5. **Cleanup systématique**

### Exemple

```typescript
export function useFieldPath<T>(
  basePath: string,
  data: T
): {
  getValue: (path: string) => unknown;
  setValue: (path: string, value: unknown) => T;
} {
  const getValue = useCallback((path: string): unknown => {
    // Implementation
  }, [data]);

  const setValue = useCallback((path: string, value: unknown): T => {
    // Implementation
  }, [data]);

  return { getValue, setValue };
}
```

## Mode Mock

### Priorité de Résolution

1. `data` fournie ⇒ utilisée après validation
2. `mock === true` ⇒ `mocks/data.mock.json`
3. Sinon ⇒ Émettre `{ type: 'error', code: 'NO_DATA' }`

### Validation Runtime

```typescript
if (mock && !data) {
  // Charger data.mock.json
  const mockData = await import('./mocks/data.mock.json');
  setData(mockData.default);
}

if (data) {
  const validation = validateQuoteData(data);
  if (!validation.valid) {
    onEvent?.({
      type: 'error',
      code: 'INVALID_DATA',
      message: validation.errors.join(', ')
    });
  }
}
```

## Gestion d'Erreurs

### Principes

1. **Toujours** émettre un événement `error` au lieu de throw
2. **Codes d'erreur** explicites (`NO_DATA`, `INVALID_DATA`, `SAVE_ERROR`)
3. **Messages** traduisibles via i18n
4. **ErrorBoundary** local optionnel

### Exemple

```typescript
try {
  await saveData();
  onEvent?.({ type: 'save', data: currentData });
} catch (error) {
  onEvent?.({
    type: 'error',
    code: 'SAVE_ERROR',
    message: t('errors.saveError')
  });
}
```

## Politique d'Exports

### index.ts

N'exporter QUE l'API publique :

```typescript
// ✅ CORRECT - API publique
export { QuoteEditor } from './QuoteEditor';
export type {
  QuoteEditorProps,
  QuoteEditorHandle,
  QuoteData,
  ComponentEvent,
  // ...
} from './QuoteEditor.types';

// ❌ INCORRECT - Détails d'implémentation
export { default as EditableField } from './components/EditableField';
export { useQuoteEditor } from './hooks/useQuoteEditor';
```

## Tests et Validation

### Checklist Avant Release

- [ ] TypeScript strict sans `any` non justifié
- [ ] Aucune dépendance au parent (providers, styles)
- [ ] Tailwind préfixé `tw-` partout
- [ ] SCSS modules locaux uniquement
- [ ] `data` + `mock` + validation runtime
- [ ] Callbacks `onEvent` pour tous les événements
- [ ] Accessibilité AA (focus, roles, ARIA, clavier)
- [ ] i18n FR/EN complet
- [ ] Light/Dark theme fonctionnel
- [ ] README et INSTRUCTIONS_INITIALES à jour

## Maintenance et Évolutions

### Ajout d'un Nouveau Sous-Composant

1. Créer le dossier `components/MonComposant/`
2. Créer `MonComposant.tsx` + `MonComposant.module.scss`
3. Utiliser Tailwind `tw-` pour 95% des styles
4. Ajouter ARIA et i18n
5. Créer `index.ts` pour export local
6. **NE PAS** exporter dans le `index.ts` racine

### Ajout d'un Hook

1. Créer `hooks/useMonHook.ts`
2. Une seule responsabilité
3. API minimale (valeurs + actions)
4. 100% TypeScript strict
5. Export uniquement si utile en dehors du composant

### Modification du Design System

1. Mettre à jour `tailwind.config.js`
2. Mettre à jour les variables CSS dans `QuoteEditor.module.scss`
3. Tester en mode light ET dark
4. Vérifier les contrastes d'accessibilité

## Support et Contribution

Pour toute question ou contribution:

1. Lire cette documentation complète
2. Vérifier la conformité aux contraintes
3. Tester en mode mock
4. Valider l'accessibilité
5. Documenter les changements

---

**Version**: 1.0.0
**Dernière mise à jour**: 2025-01-21
**Auteur**: Équipe QuoteEditor

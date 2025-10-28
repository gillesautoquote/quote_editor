Important : pas de Sass Embeded
Standalone React + TypeScript Component** (Ultra‑atomique, Tailwind `tw-`)

> **But** : produire un **composant React totalement autonome** (_stand‑alone_), **TypeScript ultra‑strict**, **zéro dépendance au projet parent**, **atomisé** en sous‑composants & hooks, **stylé majoritairement en Tailwind** (avec **préfixe `tw-` obligatoire**) et **prêt à brancher** par simple import.  
> **Mode API** : toutes les **données entrantes** sont passées via la **prop `data`** (objet JSON typé), les **évènements** via **callbacks**, et un **mode mock intégré** peut simuler les données sans back‑end.

---

## 0) Contexte technique & contraintes **non‑négociables**

- **React** (FC + Hooks), **TypeScript strict** (`"strict": true`).  
- **Tailwind CSS** **obligatoire** pour 95% des styles. **Chaque utilitaire Tailwind doit être préfixé `tw-`** (ex. `tw-flex tw-items-center`).  
  - Supposer que l’hôte a `tailwind.config.js` avec `prefix: 'tw-'`.  
- **SCSS Modules** : **chaque composant et sous‑composant** possède **son** `tsx` **et** son **`module.scss`** (pour les 5% de styles non couverts par Tailwind, variables locales, overrides ciblés).  
- **Aucune écriture globale** (ni CSS global, ni providers globaux) : **tout vit dans le dossier du composant**.  
- **Accessibilité** (ARIA, tab order, rôles explicites), **i18n FR/EN**, **light/dark**.  
- **Zéro Bootstrap / MUI / frameworks CSS**.  
- **Dépendances minimales** :  
  - `react`, `react-dom`    
  - `lucide-react` (icônes) — optionnel

> ⚠️ **Rien** ne doit nécessiter de configuration dans le projet parent : si un provider est requis, **embarquer** une instance locale **interne** au composant et expose des **props** pour contrôler le tout.

---

## 1) Structure de sortie (arborescence **exigée**)

```bash
src/components/<ComponentName>/
├── index.ts                          # Barrel export
├── <ComponentName>.tsx               # Entrée principale
├── <ComponentName>.module.scss       # Styles locaux (compléments à Tailwind)
├── <ComponentName>.types.ts          # API publique (Props, Events, Data schema)
├── hooks/
│   ├── use<Feature>.ts               # 1 feature = 1 hook, 100% typé
├── subcomponents/
│   ├── <Atom>/
│   │   ├── <Atom>.tsx
│   │   ├── <Atom>.module.scss
│   │   └── index.ts
│   ├── <Molecule>/
│   │   ├── <Molecule>.tsx
│   │   ├── <Molecule>.module.scss
│   │   └── index.ts
│   └── ...
├── mocks/
│   └── data.mock.json                # Données de démonstration
├── README.md                         # Guide d’intégration & API
└── INSTRUCTIONS_INITIALES.md         # Règles & conventions (ce fichier)
```

> **Règle d’atomicité** : *une responsabilité par fichier*. Chaque **sous‑composant** a son duo **TSX + module.scss**.

---

## 2) **Design System** local (dérivé de la maquette fournie)

Palette extraite de l’interface (tons dominants) :  
- **Primary / Indigo**: `#4863ec`
- **Navy 900**: `#16254d`
- **Navy 800**: `#192850`
- **Surface 0**: `#fbfbfc`
- **Surface 100**: `#e9eaeb`
- **Surface Indigo 50**: `#e8ebf9`
- **Surface Indigo 100**: `#d4d9f8`
- **Surface Indigo 150**: `#c3cbf7`
- **Muted Gray 200**: `#d5d7db`
- **Warning / Gold**: `#ecb424`
- **Error / Coral**: `#e4545f`
- **Success / Green**: `#41a170`

Autres jetons recommandés :
- **Radius** : `--tw-radius-sm: 6px; --tw-radius-md: 10px; --tw-radius-lg: 16px; --tw-radius-2xl: 20px;`
- **Ombres** : `--tw-shadow-sm: 0 1px 2px rgb(0 0 0 / .05);` · `--tw-shadow-md: 0 4px 10px rgb(16 24 40 / .08);`
- **Transitions** : `tw-transition tw-duration-200 tw-ease-out` (sur hover/focus/press)
- **Typographie** : Inter / system-ui, tailles réactives `tw-text-sm|base|lg|xl`

> Implémentation : déclarer ces **CSS variables dans le wrapper racine** du composant (via `module.scss`) pour ne jamais polluer le global.

---

## 3) API publique du composant (Props & Events)

### 3.1 `Props` (exemple type)
```ts
export interface <ComponentName>Props<TData = unknown> {  // TData = forme JSON attendue
  /** Données initiales en JSON typé (mode API). */
  data?: TData;
  /** Active le mode mock si aucune data fournie (par défaut: false). */
  mock?: boolean;
  /** Classe supplémentaire sur le wrapper (facultatif). */
  className?: string;
  /** Callbacks d’évènements (discriminated union). */
  onEvent?: (evt: ComponentEvent) => void;
}
```

### 3.2 `Events` (discriminated union)
```ts
export type ComponentEvent =
  | { type: 'ready' }
  | { type: 'error'; code: string; message: string }
  | { type: 'action'; name: string; payload?: unknown }
  | { type: 'change'; path: string; value: unknown };
```

### 3.3 Validation runtime 
- À l’entrée du composant : si `mock===true && !data`, charger `mocks/data.mock.json`. Sinon, valider `data` et émettre `onEvent({ type: 'error', ... })` en cas d’échec.

---

## 6) Styles : **Tailwind first**, SCSS modules en appoint

- **Toujours** préférer les utilitaires Tailwind **préfixés `tw-`**.  
- Le `module.scss` :  
  - déclare les **CSS variables locales** (tokens),  
  - gère les **cas non couverts** (animations spécifiques, scrollbar locale),  
  - **n’expose** aucune classe globale.  
- Il est possible mais non obligatoire d'utiliser `clsx` pour composer `className`. Si c'est le cas l'ajouter dans les libs.
- Example :
```tsx
<div className={clsx(
  styles.wrapper,
  'tw-flex tw-items-center tw-justify-between tw-gap-3 tw-rounded-2xl tw-bg-white tw-p-4 tw-shadow-md dark:tw-bg-[#0f172a]'
)}>
  ...
</div>
```

---

## 7) Accessibilité & interactions

- Ordre tabulaire **prévisible** ; `role` et attributs **ARIA** explicites.  
- États focus visibles (`tw-ring-2 tw-ring-offset-2 tw-ring-[#4863ec]`).  
- Navigation clavier sur contrôles (Enter/Space/Escape).  
- Annoncer erreurs via `aria-live="assertive"`.  
- Boutons : `type="button"`, labels **traduisibles** (`aria-label` via i18n).

---

## 8) Hooks & logique (**ultra‑atomique**)

- Un **hook = une responsabilité** (`useFetchLike`, `useSelection`, `usePagination`…).  
- Hooks **purs** (pas d’effets de style), 100% typés.  
- **Zéro `any` non justifié** ; `useMemo` & `useCallback` pour dérivés/coûteux.  
- **Effets** : dépendances **exhaustives**, cleanup systématique.  
- Les hooks **n’exportent** que des **API minimales** (valeurs & actions).

---

## 9) Données & **mode mock**

- Priorité de résolution :  
  1) `data` fournie ⇒ utilisée après validation,  
  2) sinon si `mock === true` ⇒ `mocks/data.mock.json`,  
  3) sinon ⇒ `onEvent({ type: 'error', code: 'NO_DATA' })` + UI vide (état neutre).

- Les **transformations** (tri, mapping) sont réalisées dans des **helpers** dédiés (`utils/`).  
- Toute **erreur** émet un `onEvent({ type: 'error', ... })`.

---

## 10) Sous‑composants : **atoms / molecules / organisms**

- **Atom** : bouton, pill, badge, tag, avatar… (tsx + module.scss)  
- **Molecule** : carte, item de liste, ligne de tableau…  
- **Organism** : panneau, liste paginée, toolbar…  
- Chaque niveau **n’importe** uniquement le niveau inférieur.

---

## 11) Gestion d’états & erreurs

- État interne minimal (UI only). **Pas** de state global, **pas** de libs de store.  
- `ErrorBoundary` local (si pertinent) exposé via `export { <ComponentName>ErrorBoundary }`.  
- Renvoyer `onEvent({ type: 'ready' })` au `useEffect` initial (après i18n init + validation).

---

## 13) **Checklist** de livraison

- [ ] TypeScript **strict** sans `any` non justifié.  
- [ ] **Aucune dépendance au parent** (providers & styles embarqués).  
- [ ] Tailwind **préfixé `tw-`** partout ; SCSS module local OK.   
- [ ] `data` + `mock` + validation runtime (si zod).  
- [ ] Callbacks `onEvent` (ready/error/action/change).  
- [ ] Accessibilité AA (focus, roles, aria, clavier).  
- [ ] README & INSTRUCTIONS_INITIALES complets.  

---

## 14) **README.md** — contenu minimal attendu

- **But & aperçu** (gif/screenshot).  
- **API** (`Props`, `Events`, schéma `data`).  
- **Exemples d’intégration** (TSX, thème, i18n, mock).  
- **Décisions techniques** (tailwind `tw-`, choix tokens, accessibilité).  
- **Limitations** & **changelog**.

---

## 15) **INSTRUCTIONS_INITIALES.md** — à générer **dans le dossier**

Contient **la synthèse** de ce prompt (copier/coller autorisé) + :  
- **Conventions de nommage** (PascalCase fichiers, camelCase props, `onXxx` pour callbacks).  
- **Règles Tailwind** (toujours `tw-` ; utilitaires > SCSS ; variantes `dark:`).  
- **Politique d’exports** (`index.ts` re‑exporte seulement l’API publique).  
- **Revue de code** (lint, format, ...).

---

## 16) Exemples de snippets (à adapter au composant)

### 16.1 Utilisation côté hôte
```tsx
import { <ComponentName> } from './components/<ComponentName>';

function App() {
  const handleEvent = (evt: ComponentEvent) => {
    if (evt.type === 'action') console.log('Action:', evt.name, evt.payload);
  };

  return (
    <<ComponentName>
      data={{/* JSON typé ici */}}
      mock={false}
      locale="fr"
      theme="light"
      onEvent={handleEvent}
    />>
  );
}
```

### 16.2 Wrapper visuel (extrait de TSX)
```tsx
<section
  data-theme={theme}
  className={clsx(
    styles.wrapper,
    'tw-rounded-2xl tw-bg-white tw-shadow-md tw-border tw-border-[#e9eaeb] dark:tw-bg-[#0b1226] dark:tw-border-[#223567]'
  )}
  aria-label={t('component.title')}
>
  {/* sous-composants ici */}
</section>
```

---

## 17) Rappels de style (inspirés de l’UI fournie)

- Cartes **arrondies** (radius 16‑20px), **ombres douces**, séparateurs gris `#e9eaeb`.  
- **Primaire** bleu indigo `#4863ec` (hover légèrement plus sombre).  
- **Badges** : or `#ecb424` (avertissement), vert `#41a170` (validé), corail `#e4545f` (erreur).  
- **Pills** et boutons avec `tw-font-medium`, **transitions** douces, **focus ring** indigo.  
- Fonds neutres **très clairs** `#fbfbfc`, contenus sur **surfaces blanches**.

---

## 18) Livrables

- Le répertoire complet du composant (arborescence §1).  
- `README.md` + `INSTRUCTIONS_INITIALES.md`.  
- `mocks/data.mock.json` réaliste.  
- Tests clés.

> **Qualité attendue : très haut niveau** — commentaires concis et utiles, code idiomatique, props & events **soigneusement typés**, attention à l’accessibilité et à la cohérence visuelle.
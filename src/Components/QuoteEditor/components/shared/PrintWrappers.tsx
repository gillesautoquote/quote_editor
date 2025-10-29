import React from 'react';

/**
 * PrintOnly Component
 *
 * Ce composant affiche son contenu UNIQUEMENT en mode impression/PDF.
 * Utilise la classe Tailwind print:tw-block pour l'affichage conditionnel.
 *
 * @example
 * <PrintOnly>
 *   <p>Ce texte n'apparaîtra que dans le PDF</p>
 * </PrintOnly>
 */
export const PrintOnly: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={`tw-hidden print:tw-block ${className}`}>
    {children}
  </div>
);

/**
 * EditOnly Component
 *
 * Ce composant affiche son contenu UNIQUEMENT en mode édition (pas en impression).
 * Utilise la classe Tailwind print:tw-hidden pour masquer à l'impression.
 *
 * Utilisez ce wrapper pour tous les éléments interactifs :
 * - Boutons
 * - Drag handles
 * - Contrôles d'édition
 * - Toolbar
 * - Formulaires
 *
 * @example
 * <EditOnly>
 *   <button onClick={handleClick}>Éditer</button>
 * </EditOnly>
 */
export const EditOnly: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={`tw-block print:tw-hidden ${className}`}>
    {children}
  </div>
);

/**
 * PrintInline Component
 *
 * Similaire à PrintOnly mais avec display: inline pour ne pas créer de bloc.
 * Utile pour le contenu inline comme les spans.
 *
 * @example
 * <PrintInline>
 *   <span>Texte inline uniquement en PDF</span>
 * </PrintInline>
 */
export const PrintInline: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <span className={`tw-hidden print:tw-inline ${className}`}>
    {children}
  </span>
);

/**
 * EditInline Component
 *
 * Similaire à EditOnly mais avec display: inline.
 *
 * @example
 * <EditInline>
 *   <button className="tw-text-sm">Éditer</button>
 * </EditInline>
 */
export const EditInline: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <span className={`tw-inline print:tw-hidden ${className}`}>
    {children}
  </span>
);

/**
 * ConditionalRender Component
 *
 * Composant plus flexible qui accepte un prop printMode boolean
 * pour contrôler l'affichage programmatiquement.
 *
 * @param printMode - Si true, affiche printContent, sinon editContent
 * @param editContent - Contenu à afficher en mode édition
 * @param printContent - Contenu à afficher en mode impression
 *
 * @example
 * <ConditionalRender
 *   printMode={isPrint}
 *   editContent={<input type="text" />}
 *   printContent={<span>{value}</span>}
 * />
 */
interface ConditionalRenderProps {
  printMode: boolean;
  editContent: React.ReactNode;
  printContent: React.ReactNode;
  className?: string;
}

export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  printMode,
  editContent,
  printContent,
  className = ''
}) => {
  if (printMode) {
    return <div className={className}>{printContent}</div>;
  }
  return <div className={className}>{editContent}</div>;
};

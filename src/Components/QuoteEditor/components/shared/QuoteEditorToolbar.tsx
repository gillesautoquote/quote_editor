import React, { useState, useEffect } from 'react';
import {
  Save,
  Undo2,
  Redo2,
  FileText,
  Download,
  Plus,
  ChevronDown,
  RotateCcw,
  MoreHorizontal
} from 'lucide-react';

interface ToolbarAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  tooltip?: string;
}

interface ToolbarGroup {
  id: string;
  actions: ToolbarAction[];
  type?: 'buttons' | 'dropdown';
  dropdownLabel?: string;
}

interface QuoteEditorToolbarProps {
  title: string;
  readonly?: boolean;
  showAddSection?: boolean;
  showAddBlock?: boolean;
  showReset?: boolean;
  showTemplateSelector?: boolean;
  saveState?: {
    isSaving: boolean;
    hasUnsavedChanges: boolean;
    lastSaved: Date | null;
  };
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave?: () => void;
  onExportPDF: () => void;
  onExportPDFBackend?: () => void;
  onAddSection: () => void;
  onAddBlock: () => void;
  onReset: () => void;
  blockTemplates?: Array<{
    id: string;
    name: string;
    template: any;
  }>;
  onSelectTemplate?: (templateId: string) => void;
  className?: string;
}

export const QuoteEditorToolbar: React.FC<QuoteEditorToolbarProps> = ({
  title,
  readonly = false,
  showAddSection = false,
  showAddBlock = false,
  showReset = false,
  showTemplateSelector = false,
  saveState,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onSave,
  onExportPDF,
  onExportPDFBackend,
  onAddSection,
  onAddBlock,
  onReset,
  blockTemplates = [],
  onSelectTemplate,
  className = ''
}) => {
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showPDFMenu, setShowPDFMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowTemplateDropdown(false);
      setShowMoreMenu(false);
      setShowPDFMenu(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getSaveIndicatorClass = (): string => {
    if (saveState?.isSaving) return 'tw-bg-yellow-50 tw-text-yellow-800 tw-border-yellow-200';
    if (saveState?.hasUnsavedChanges) return 'tw-bg-red-50 tw-text-red-800 tw-border-red-200';
    return 'tw-bg-blue-50 tw-text-blue-800 tw-border-blue-200';
  };

  const getSaveIndicatorText = (): string => {
    if (saveState?.isSaving) return 'Sauvegarde...';
    if (saveState?.hasUnsavedChanges) return 'Modifications non sauvées';
    if (saveState?.lastSaved) {
      return `Sauvegardé à ${saveState.lastSaved.toLocaleTimeString()}`;
    }
    return 'Sauvegardé';
  };

  const primaryActions: ToolbarAction[] = [];

  const editActions: ToolbarAction[] = readonly ? [] : [
    {
      id: 'undo',
      label: '',
      icon: <Undo2 size={16} />,
      onClick: onUndo,
      disabled: !canUndo,
      tooltip: 'Annuler (Ctrl+Z)'
    },
    {
      id: 'redo',
      label: '',
      icon: <Redo2 size={16} />,
      onClick: onRedo,
      disabled: !canRedo,
      tooltip: 'Rétablir (Ctrl+Y)'
    }
  ];

  if (showAddSection) {
    editActions.push({
      id: 'add-section',
      label: 'Tableau',
      icon: <Plus size={16} />,
      onClick: onAddSection,
      variant: 'outline' as const,
      tooltip: 'Ajouter un tableau'
    });
  }

  if (showAddBlock) {
    editActions.push({
      id: 'add-block',
      label: 'Liste',
      icon: <Plus size={16} />,
      onClick: onAddBlock,
      variant: 'outline' as const,
      tooltip: 'Ajouter un bloc'
    });
  }

  const moreActions: ToolbarAction[] = readonly ? [] : [];

  if (showReset) {
    moreActions.push({
      id: 'reset',
      label: 'Réinitialiser',
      icon: <RotateCcw size={16} />,
      onClick: onReset,
      variant: 'danger' as const,
      tooltip: 'Remettre à l\'état initial'
    });
  }

  if (onSave) {
    moreActions.unshift({
      id: 'save',
      label: 'Sauvegarder',
      icon: <Save size={16} />,
      onClick: onSave,
      disabled: saveState?.isSaving,
      variant: 'primary' as const,
      tooltip: 'Sauvegarder (Ctrl+S)'
    });
  }

  const renderAction = (action: ToolbarAction) => {
    let buttonClasses = 'tw-inline-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-text-sm tw-font-medium tw-rounded tw-transition-colors';

    if (action.disabled) {
      buttonClasses += ' tw-opacity-50 tw-cursor-not-allowed';
    }

    if (action.variant === 'primary') {
      buttonClasses += ' tw-bg-indigo-600 tw-text-white hover:tw-bg-indigo-700';
    } else if (action.variant === 'danger') {
      buttonClasses += ' tw-bg-white tw-text-red-600 tw-border tw-border-red-300 hover:tw-bg-red-50';
    } else if (action.variant === 'outline') {
      buttonClasses += ' tw-bg-white tw-text-gray-700 tw-border tw-border-gray-300 hover:tw-bg-gray-50';
    } else {
      buttonClasses += ' tw-bg-white tw-text-gray-700 tw-border tw-border-gray-300 hover:tw-bg-gray-50';
    }

    return (
      <button
        key={action.id}
        type="button"
        onClick={action.onClick}
        disabled={action.disabled}
        className={buttonClasses}
        title={action.tooltip}
      >
        {action.icon}
        {action.label && <span>{action.label}</span>}
      </button>
    );
  };

  return (
    <div className={`tw-sticky tw-top-0 tw-bg-white/95 tw-backdrop-blur-sm tw-border-b tw-border-gray-200 tw-p-3 tw-shadow-md tw-z-10 tw-mb-2 ${className}`}>
      <div className="tw-flex tw-flex-col sm:tw-flex-row tw-justify-between tw-items-start sm:tw-items-center tw-gap-3">
        <div className="tw-flex tw-items-center tw-gap-2">
          <FileText size={20} className="tw-text-gray-700" />
          <span className="tw-font-semibold tw-text-gray-900">{title}</span>
          {readonly && <span className="tw-px-2 tw-py-0.5 tw-bg-green-100 tw-text-green-800 tw-text-xs tw-font-medium tw-rounded">Lecture</span>}
        </div>

        <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2">
          {!readonly && saveState && (
            <div className={`tw-px-2.5 tw-py-1 tw-rounded tw-text-xs tw-font-medium tw-border ${getSaveIndicatorClass()}`}>
              <span>{getSaveIndicatorText()}</span>
            </div>
          )}

          {editActions.length > 0 && (
            <div className="tw-flex tw-gap-1">
              {editActions.map(renderAction)}
            </div>
          )}

          {!readonly && showTemplateSelector && blockTemplates.length > 0 && onSelectTemplate && (
            <div className="tw-relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTemplateDropdown(!showTemplateDropdown);
                }}
                className="tw-inline-flex tw-items-center tw-gap-1 tw-px-3 tw-py-1.5 tw-text-sm tw-font-medium tw-text-gray-700 tw-bg-white tw-border tw-border-gray-300 tw-rounded hover:tw-bg-gray-50 tw-transition-colors"
                title="Templates prédéfinis"
              >
                <ChevronDown size={14} />
              </button>
              {showTemplateDropdown && (
                <div
                  className="tw-absolute tw-top-full tw-right-0 tw-mt-1 tw-w-52 tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-lg tw-z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {blockTemplates.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      className="tw-w-full tw-flex tw-items-center tw-gap-2 tw-px-3 tw-py-2 tw-text-sm tw-text-gray-700 hover:tw-bg-gray-50 tw-transition-colors first:tw-rounded-t-lg last:tw-rounded-b-lg"
                      onClick={() => {
                        onSelectTemplate(template.id);
                        setShowTemplateDropdown(false);
                      }}
                    >
                      <div
                        className="tw-w-3 tw-h-3 tw-rounded-sm"
                        style={{ backgroundColor: template.template?.color || '#4863ec' }}
                      />
                      {template.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="tw-flex tw-gap-1">
            {onExportPDFBackend ? (
              <div className="tw-relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPDFMenu(!showPDFMenu);
                  }}
                  className="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-text-sm tw-font-medium tw-bg-white tw-text-gray-700 tw-border tw-border-gray-300 tw-rounded hover:tw-bg-gray-50 tw-transition-colors"
                  title="Exporter en PDF"
                >
                  <Download size={16} />
                  <span>PDF</span>
                  <ChevronDown size={12} />
                </button>
                {showPDFMenu && (
                  <div
                    className="tw-absolute tw-top-full tw-right-0 tw-mt-1 tw-w-64 tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-lg tw-z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="tw-w-full tw-flex tw-flex-col tw-px-3 tw-py-2.5 tw-text-sm tw-text-gray-700 hover:tw-bg-gray-50 tw-transition-colors tw-rounded-t-lg tw-text-left tw-border-b tw-border-gray-100"
                      onClick={() => {
                        onExportPDF();
                        setShowPDFMenu(false);
                      }}
                    >
                      <span className="tw-font-medium tw-text-gray-900">PDF Client-Side</span>
                      <span className="tw-text-xs tw-text-gray-500 tw-mt-0.5">Rapide, généré dans le navigateur</span>
                    </button>
                    <button
                      type="button"
                      className="tw-w-full tw-flex tw-flex-col tw-px-3 tw-py-2.5 tw-text-sm tw-text-gray-700 hover:tw-bg-gray-50 tw-transition-colors tw-rounded-b-lg tw-text-left"
                      onClick={() => {
                        onExportPDFBackend();
                        setShowPDFMenu(false);
                      }}
                    >
                      <span className="tw-font-medium tw-text-gray-900">PDF Server-Side</span>
                      <span className="tw-text-xs tw-text-gray-500 tw-mt-0.5">Qualité optimale, généré par le serveur</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onExportPDF}
                className="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-text-sm tw-font-medium tw-bg-white tw-text-gray-700 tw-border tw-border-gray-300 tw-rounded hover:tw-bg-gray-50 tw-transition-colors"
                title="Exporter en PDF"
              >
                <Download size={16} />
                <span>PDF</span>
              </button>
            )}
          </div>

          {moreActions.length > 0 && (
            <div className="tw-relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMoreMenu(!showMoreMenu);
                }}
                className="tw-inline-flex tw-items-center tw-px-2.5 tw-py-1.5 tw-text-sm tw-font-medium tw-text-gray-700 tw-bg-white tw-border tw-border-gray-300 tw-rounded hover:tw-bg-gray-50 tw-transition-colors"
                title="Plus d'actions"
              >
                <MoreHorizontal size={14} />
              </button>
              {showMoreMenu && (
                <div
                  className="tw-absolute tw-top-full tw-right-0 tw-mt-1 tw-w-44 tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-lg tw-z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {moreActions.map((action) => (
                    <button
                      key={action.id}
                      type="button"
                      className={`tw-w-full tw-flex tw-items-center tw-gap-2 tw-px-3 tw-py-2 tw-text-sm hover:tw-bg-gray-50 tw-transition-colors first:tw-rounded-t-lg last:tw-rounded-b-lg ${
                        action.variant === 'danger' ? 'tw-text-red-600' : 'tw-text-gray-700'
                      }`}
                      onClick={() => {
                        action.onClick();
                        setShowMoreMenu(false);
                      }}
                      disabled={action.disabled}
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

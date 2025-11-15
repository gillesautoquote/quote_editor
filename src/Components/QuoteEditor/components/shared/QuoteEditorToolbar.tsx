import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  Undo2,
  Redo2,
  Plus,
  RotateCcw,
  GripVertical,
  X
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

export interface QuoteTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
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
  // Tab props
  tabs?: {
    visible: QuoteTab[];
    hidden: QuoteTab[];
    active: string;
    mainColor: string;
    enableTabManagement: boolean;
    onTabChange: (tabId: string) => void;
    onTabAdd: (tab: QuoteTab) => void;
    onTabRemove: (tabId: string) => void;
    onTabReorder: (newOrder: QuoteTab[]) => void;
  };
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
  className = '',
  tabs
}) => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [showAddTabMenu, setShowAddTabMenu] = useState(false);
  const [draggedTab, setDraggedTab] = useState<string | null>(null);
  const [dragOverTab, setDragOverTab] = useState<string | null>(null);
  const tabMenuRef = useRef<HTMLDivElement>(null);
  const tabButtonRef = useRef<HTMLButtonElement>(null);
  const [tabMenuPosition, setTabMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tabMenuRef.current && !tabMenuRef.current.contains(event.target as Node) &&
          tabButtonRef.current && !tabButtonRef.current.contains(event.target as Node)) {
        setShowAddTabMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showAddTabMenu && tabButtonRef.current) {
      const rect = tabButtonRef.current.getBoundingClientRect();
      setTabMenuPosition({
        top: rect.bottom + 4,
        left: rect.left
      });
    }
  }, [showAddTabMenu]);

  // Update indicator position when active tab changes
  useEffect(() => {
    if (tabs?.active) {
      const activeButton = tabRefs.current.get(tabs.active);
      if (activeButton) {
        // Find the container with tw-relative class
        let container = activeButton.parentElement;
        while (container && !container.classList.contains('tw-relative')) {
          container = container.parentElement;
        }

        if (container) {
          const containerRect = container.getBoundingClientRect();
          const buttonRect = activeButton.getBoundingClientRect();
          setIndicatorStyle({
            left: buttonRect.left - containerRect.left,
            width: buttonRect.width
          });
        }
      }
    }
  }, [tabs?.active, tabs?.visible]);

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

  const handleTabDragStart = (e: React.DragEvent, tabId: string) => {
    if (!tabs?.enableTabManagement) return;
    setDraggedTab(tabId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTabDragOver = (e: React.DragEvent, tabId: string) => {
    e.preventDefault();
    if (!tabs?.enableTabManagement || !draggedTab || draggedTab === tabId) return;
    setDragOverTab(tabId);
  };

  const handleTabDragLeave = () => {
    setDragOverTab(null);
  };

  const handleTabDrop = (e: React.DragEvent, targetTabId: string) => {
    e.preventDefault();
    if (!tabs?.enableTabManagement || !draggedTab || draggedTab === targetTabId || !tabs?.visible) return;

    const draggedIndex = tabs.visible.findIndex(tab => tab.id === draggedTab);
    const targetIndex = tabs.visible.findIndex(tab => tab.id === targetTabId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newTabs = [...tabs.visible];
    const [removed] = newTabs.splice(draggedIndex, 1);
    newTabs.splice(targetIndex, 0, removed);

    tabs.onTabReorder(newTabs);
    setDraggedTab(null);
    setDragOverTab(null);
  };

  const handleTabDragEnd = () => {
    setDraggedTab(null);
    setDragOverTab(null);
  };

  const handleRemoveTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!tabs?.visible || tabs.visible.length <= 1) return;
    tabs.onTabRemove(tabId);
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
    <div className={`tw-sticky tw-top-0 tw-bg-white tw-border-b tw-border-gray-300 tw-z-10 tw-mb-2 ${className}`}>
      <div className="tw-flex tw-justify-between tw-items-center tw-px-3 tw-py-3 tw-gap-4">
        {/* Left: Badge and Tabs */}
        <div className="tw-flex tw-items-center tw-gap-3 tw-flex-1 tw-min-w-0">
          {readonly && <span className="tw-px-2 tw-py-0.5 tw-bg-green-100 tw-text-green-800 tw-text-xs tw-font-medium tw-rounded tw-flex-shrink-0">Lecture</span>}

          {/* Tabs */}
          {tabs && tabs.visible.length > 0 && (
            <div className="tw-flex tw-gap-1 tw-overflow-x-auto tw-scrollbar-thin tw-flex-1 tw-relative">
              {tabs.visible.map((tab) => (
                <div
                  key={tab.id}
                  className="tw-flex tw-items-stretch tw-relative tw-group/tab"
                  onDragOver={(e) => handleTabDragOver(e, tab.id)}
                  onDragLeave={handleTabDragLeave}
                  onDrop={(e) => handleTabDrop(e, tab.id)}
                  style={{
                    borderLeft: dragOverTab === tab.id ? `3px solid ${tabs.mainColor}` : 'none'
                  }}
                >
                  {tabs.enableTabManagement && (
                    <div
                      draggable
                      onDragStart={(e) => handleTabDragStart(e, tab.id)}
                      onDragEnd={handleTabDragEnd}
                      className="tw-flex tw-items-center tw-px-0.5 tw-cursor-move tw-transition-all tw-duration-200 tw-rounded-l-md"
                      style={{
                        opacity: draggedTab === tab.id ? 0.5 : 0.5,
                        backgroundColor: tabs.active === tab.id ? 'white' : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = tabs.active === tab.id ? 'white' : '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = tabs.active === tab.id ? 'white' : 'transparent';
                      }}
                      title="Glisser pour réorganiser"
                    >
                      <GripVertical
                        size={11}
                        style={{ color: tabs.mainColor, opacity: 0.4 }}
                        className="group-hover/tab:tw-opacity-80 tw-transition-opacity"
                      />
                    </div>
                  )}
                  <button
                    ref={(el) => {
                      if (el) tabRefs.current.set(tab.id, el);
                    }}
                    type="button"
                    onClick={() => tabs.onTabChange(tab.id)}
                    onMouseEnter={(e) => {
                      tabs.enableTabManagement && setHoveredTab(tab.id);
                      if (tabs.active !== tab.id) {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      setHoveredTab(null);
                      if (tabs.active !== tab.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                    className="tw-flex tw-items-center tw-gap-1.5 tw-px-2 tw-py-1.5 tw-text-xs tw-font-medium tw-whitespace-nowrap tw-border-b-2 tw-border-transparent tw-min-w-fit tw-relative tw-group tw-rounded-t-md"
                    style={{
                      color: tabs.active === tab.id ? tabs.mainColor : '#6b7280',
                      backgroundColor: tabs.active === tab.id ? 'white' : 'transparent',
                      opacity: draggedTab === tab.id ? 0.5 : 1,
                      cursor: 'pointer',
                      transform: tabs.active === tab.id ? 'translateY(0)' : 'none',
                      transition: 'color 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease'
                    }}
                    title={tab.description}
                  >
                    <span className="tw-transition-transform tw-duration-200 group-hover:tw-scale-110">
                      {tab.icon}
                    </span>
                    <span className="tw-transition-all tw-duration-200">{tab.label}</span>
                    {tabs.enableTabManagement && hoveredTab === tab.id && tabs.visible.length > 1 && (
                      <span
                        onClick={(e) => handleRemoveTab(tab.id, e)}
                        className="tw-ml-0.5 tw-p-0.5 tw-rounded-full hover:tw-bg-red-50 tw-transition-all tw-duration-200 tw-cursor-pointer hover:tw-scale-110"
                        title="Supprimer l'onglet"
                      >
                        <X size={11} className="tw-text-red-500 hover:tw-text-red-700" />
                      </span>
                    )}
                  </button>
                </div>
              ))}
              {/* Animated indicator */}
              {indicatorStyle.width > 0 && (
                <div
                  className="tw-absolute tw-bottom-0 tw-h-0.5 tw-transition-all tw-duration-300 tw-ease-out tw-rounded-full"
                  style={{
                    backgroundColor: tabs.mainColor,
                    left: `${indicatorStyle.left}px`,
                    width: `${indicatorStyle.width}px`,
                    transform: 'translateZ(0)', // Hardware acceleration
                    height: '2px'
                  }}
                />
              )}
              {tabs.enableTabManagement && tabs.hidden.length > 0 && (
                <button
                  ref={tabButtonRef}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAddTabMenu(!showAddTabMenu);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  className="tw-flex tw-items-center tw-justify-center tw-px-2 tw-py-1.5 tw-text-xs tw-font-medium tw-whitespace-nowrap tw-transition-all tw-duration-200 tw-rounded-t-md tw-ml-1"
                  style={{ color: tabs.mainColor }}
                  title="Ajouter un onglet"
                >
                  <Plus size={13} className="tw-transition-transform tw-duration-200 hover:tw-rotate-90" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right: Action Buttons */}
        {!readonly && (
          <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2 tw-flex-shrink-0">
            {editActions.length > 0 && (
              <div className="tw-flex tw-gap-1">
                {editActions.map(renderAction)}
              </div>
            )}

            {/* Reset Button */}
            {showReset && (
              <button
                type="button"
                onClick={onReset}
                className="tw-inline-flex tw-items-center tw-px-2.5 tw-py-1.5 tw-text-sm tw-font-medium tw-text-gray-700 tw-bg-white tw-border tw-border-gray-300 tw-rounded hover:tw-bg-gray-50 tw-transition-colors"
                title="Réinitialiser le devis"
              >
                <RotateCcw size={16} />
              </button>
            )}

            {/* Save Button */}
            {onSave && (
              <button
                type="button"
                onClick={onSave}
                className="tw-inline-flex tw-items-center tw-px-2.5 tw-py-1.5 tw-text-sm tw-font-medium tw-text-white tw-bg-blue-600 tw-border tw-border-blue-600 tw-rounded hover:tw-bg-blue-700 tw-transition-colors"
                title="Sauvegarder les modifications"
              >
                <Save size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Tab Menu */}
      {showAddTabMenu && tabMenuPosition && tabs && (
        <div
          ref={tabMenuRef}
          className="tw-fixed tw-bg-white tw-rounded-lg tw-shadow-xl tw-z-[99999] tw-min-w-[200px] tw-overflow-hidden tw-border tw-border-gray-200"
          style={{
            top: `${tabMenuPosition.top}px`,
            left: `${tabMenuPosition.left}px`
          }}
        >
          {tabs.hidden.map((tab, index) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                tabs.onTabAdd(tab);
                setShowAddTabMenu(false);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
              className="tw-w-full tw-flex tw-items-center tw-gap-2.5 tw-px-3 tw-py-2.5 tw-text-sm tw-text-left tw-transition-all tw-duration-200 tw-group"
              style={{
                borderBottom: index < tabs.hidden.length - 1 ? '1px solid #e5e7eb' : 'none',
                backgroundColor: 'white'
              }}
            >
              <span
                className="tw-transition-transform tw-duration-200 group-hover:tw-scale-110"
                style={{ color: tabs.mainColor }}
              >
                {tab.icon}
              </span>
              <span className="tw-font-medium tw-text-gray-700 group-hover:tw-text-gray-900">{tab.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

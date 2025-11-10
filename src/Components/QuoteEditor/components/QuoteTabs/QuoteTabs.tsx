import React, { useState, useEffect, useRef } from 'react';
import { FileText, Calculator, List, FileSignature, Mail, X, Plus, GripVertical, BusFront } from 'lucide-react';
import type { QuoteData } from '../../entities/QuoteData';

export interface QuoteTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface QuoteTabsProps {
  data: QuoteData;
  onUpdateData: (newData: QuoteData) => void;
  readonly?: boolean;
  allowWidthControl?: boolean;
  children: (activeTab: string, visibleTabIds: string[]) => React.ReactNode;
  enableTabManagement?: boolean;
}

const TABS: QuoteTab[] = [
  {
    id: 'introduction',
    label: 'Introduction',
    icon: <Mail size={14} />,
    description: 'Destinataire et introduction du devis'
  },
  {
    id: 'programme',
    label: 'Programme',
    icon: <FileText size={14} />,
    description: 'Programme de voyage'
  },
  {
    id: 'services',
    label: 'Services',
    icon: <BusFront size={14} />,
    description: 'Services à l\'intérieur et impact carbone'
  },
  {
    id: 'cotation',
    label: 'Cotation',
    icon: <Calculator size={14} />,
    description: 'Détail des prix et totaux'
  },
  {
    id: 'conditions',
    label: 'Conditions',
    icon: <List size={14} />,
    description: 'Ce qui est compris / non compris'
  },
  {
    id: 'signature',
    label: 'Bon de commande',
    icon: <FileSignature size={14} />,
    description: 'Signature et validation'
  }
];

export const QuoteTabs: React.FC<QuoteTabsProps> = ({
  data,
  onUpdateData,
  readonly = false,
  allowWidthControl = true,
  children,
  enableTabManagement = false
}) => {
  const [activeTab, setActiveTab] = useState('introduction');

  const initialVisibleTabs = React.useMemo(() => {
    if (data.visibleTabIds && data.visibleTabIds.length > 0) {
      // Respecter l'ordre exact fourni par visibleTabIds
      const byId = new Map(TABS.map(t => [t.id, t]));
      return data.visibleTabIds
        .map(id => byId.get(id))
        .filter((t): t is QuoteTab => Boolean(t));
    }
    return TABS;
  }, [data.visibleTabIds]);

  const [visibleTabs, setVisibleTabs] = useState<QuoteTab[]>(initialVisibleTabs);

  // Synchroniser l'état local si visibleTabIds change depuis l'extérieur
  useEffect(() => {
    setVisibleTabs(initialVisibleTabs);
  }, [initialVisibleTabs]);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [draggedTab, setDraggedTab] = useState<string | null>(null);
  const [dragOverTab, setDragOverTab] = useState<string | null>(null);

  const hiddenTabs = TABS.filter(tab => !visibleTabs.find(vt => vt.id === tab.id));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setShowAddMenu(false);
      }
    };

    if (showAddMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddMenu]);

  useEffect(() => {
    if (showAddMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4,
        left: rect.left
      });
    }
  }, [showAddMenu]);

  const handleAddTab = (tab: QuoteTab) => {
    const newVisibleTabs = [...visibleTabs, tab];
    setVisibleTabs(newVisibleTabs);
    setActiveTab(tab.id);
    setShowAddMenu(false);
    onUpdateData({
      ...data,
      visibleTabIds: newVisibleTabs.map(t => t.id)
    });
  };

  const handleRemoveTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (visibleTabs.length <= 1) return;

    const newTabs = visibleTabs.filter(tab => tab.id !== tabId);
    setVisibleTabs(newTabs);

    if (activeTab === tabId) {
      setActiveTab(newTabs[0].id);
    }

    onUpdateData({
      ...data,
      visibleTabIds: newTabs.map(t => t.id)
    });
  };

  const handleDragStart = (e: React.DragEvent, tabId: string) => {
    if (!enableTabManagement) return;
    setDraggedTab(tabId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, tabId: string) => {
    e.preventDefault();
    if (!enableTabManagement || !draggedTab || draggedTab === tabId) return;
    setDragOverTab(tabId);
  };

  const handleDragLeave = () => {
    setDragOverTab(null);
  };

  const handleDrop = (e: React.DragEvent, targetTabId: string) => {
    e.preventDefault();
    if (!enableTabManagement || !draggedTab || draggedTab === targetTabId) return;

    const draggedIndex = visibleTabs.findIndex(tab => tab.id === draggedTab);
    const targetIndex = visibleTabs.findIndex(tab => tab.id === targetTabId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newTabs = [...visibleTabs];
    const [removed] = newTabs.splice(draggedIndex, 1);
    newTabs.splice(targetIndex, 0, removed);

    setVisibleTabs(newTabs);
    setDraggedTab(null);
    setDragOverTab(null);

    onUpdateData({
      ...data,
      visibleTabIds: newTabs.map(t => t.id)
    });
  };

  const handleDragEnd = () => {
    setDraggedTab(null);
    setDragOverTab(null);
  };

  const lightenColor = (color: string, amount: number) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const newR = Math.min(255, Math.floor(r + (255 - r) * amount));
    const newG = Math.min(255, Math.floor(g + (255 - g) * amount));
    const newB = Math.min(255, Math.floor(b + (255 - b) * amount));

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };

  const mainColor = data.company.mainColor;
  const lightBg = lightenColor(mainColor, 0.95);
  const hoverBg = lightenColor(mainColor, 0.90);

  return (
    <div className="tw-w-full tw-flex tw-flex-col tw-relative">
      <div
        className="tw-border-b tw-border-gray-200 tw-sticky tw-top-0 tw-z-10"
        style={{ backgroundColor: lightBg }}
      >
        <div className="tw-w-full tw-max-w-[min(1000px,calc(100vw-2rem))] tw-mx-auto tw-px-3 tw-relative">
          <div className="tw-flex tw-gap-0.5 tw-overflow-x-auto tw-scrollbar-thin tw-py-1">
            {visibleTabs.map((tab) => (
              <div
                key={tab.id}
                className="tw-flex tw-items-stretch tw-relative tw-group/tab"
                onDragOver={(e) => handleDragOver(e, tab.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, tab.id)}
                style={{
                  borderLeft: dragOverTab === tab.id ? `3px solid ${data.company.mainColor}` : 'none'
                }}
              >
                {enableTabManagement && (
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, tab.id)}
                    onDragEnd={handleDragEnd}
                    className="tw-flex tw-items-center tw-px-1 tw-cursor-move tw-transition-all tw-duration-200 tw-rounded-l-md"
                    style={{
                      opacity: draggedTab === tab.id ? 0.5 : 0.5,
                      backgroundColor: activeTab === tab.id ? 'white' : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = activeTab === tab.id ? 'white' : hoverBg;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = activeTab === tab.id ? 'white' : 'transparent';
                    }}
                    title="Glisser pour réorganiser"
                  >
                    <GripVertical
                      size={12}
                      style={{ color: mainColor, opacity: 0.4 }}
                      className="group-hover/tab:tw-opacity-80 tw-transition-opacity"
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  onMouseEnter={(e) => {
                    enableTabManagement && setHoveredTab(tab.id);
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.backgroundColor = hoverBg;
                    }
                  }}
                  onMouseLeave={(e) => {
                    setHoveredTab(null);
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  className="tw-flex tw-items-center tw-gap-2 tw-px-3 tw-py-2 tw-text-sm tw-font-medium tw-whitespace-nowrap tw-border-b-2 tw-transition-all tw-duration-200 tw-min-w-fit tw-relative tw-group tw-rounded-t-md"
                  style={{
                    color: activeTab === tab.id ? mainColor : '#6b7280',
                    borderBottomColor: activeTab === tab.id ? mainColor : 'transparent',
                    backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
                    opacity: draggedTab === tab.id ? 0.5 : 1,
                    cursor: 'pointer',
                    transform: activeTab === tab.id ? 'translateY(0)' : 'none'
                  }}
                  title={tab.description}
                >
                  <span className="tw-transition-transform tw-duration-200 group-hover:tw-scale-110">
                    {tab.icon}
                  </span>
                  <span className="tw-transition-all tw-duration-200">{tab.label}</span>
                  {enableTabManagement && hoveredTab === tab.id && visibleTabs.length > 1 && (
                    <span
                      onClick={(e) => handleRemoveTab(tab.id, e)}
                      className="tw-ml-0.5 tw-p-0.5 tw-rounded-full hover:tw-bg-red-50 tw-transition-all tw-duration-200 tw-cursor-pointer hover:tw-scale-110"
                      title="Supprimer l'onglet"
                    >
                      <X size={12} className="tw-text-red-500 hover:tw-text-red-700" />
                    </span>
                  )}
                </button>
              </div>
            ))}
            {enableTabManagement && hiddenTabs.length > 0 && (
              <button
                ref={buttonRef}
                type="button"
                onClick={() => setShowAddMenu(!showAddMenu)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = hoverBg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                className="tw-flex tw-items-center tw-justify-center tw-px-3 tw-py-2 tw-text-sm tw-font-medium tw-whitespace-nowrap tw-transition-all tw-duration-200 tw-rounded-t-md tw-ml-1"
                style={{ color: mainColor }}
                title="Ajouter un onglet"
              >
                <Plus size={14} className="tw-transition-transform tw-duration-200 hover:tw-rotate-90" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="tw-flex-1 tw-py-4">
        {children(activeTab, visibleTabs.map(tab => tab.id))}
      </div>

      {showAddMenu && menuPosition && (
        <div
          ref={menuRef}
          className="tw-fixed tw-bg-white tw-rounded-lg tw-shadow-xl tw-z-[99999] tw-min-w-[200px] tw-overflow-hidden tw-border tw-border-gray-200"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`
          }}
        >
          {hiddenTabs.map((tab, index) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleAddTab(tab)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = hoverBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
              className="tw-w-full tw-flex tw-items-center tw-gap-2.5 tw-px-3 tw-py-2.5 tw-text-sm tw-text-left tw-transition-all tw-duration-200 tw-group"
              style={{
                borderBottom: index < hiddenTabs.length - 1 ? `1px solid ${lightenColor(mainColor, 0.9)}` : 'none',
                backgroundColor: 'white'
              }}
            >
              <span
                className="tw-transition-transform tw-duration-200 group-hover:tw-scale-110"
                style={{ color: mainColor }}
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

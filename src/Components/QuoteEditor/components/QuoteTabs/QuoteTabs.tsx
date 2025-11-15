import React, { useState, useEffect } from 'react';
import { FileText, Calculator, List, FileSignature, Mail, BusFront } from 'lucide-react';
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
  renderTabs?: (tabsData: {
    visible: QuoteTab[];
    hidden: QuoteTab[];
    active: string;
    mainColor: string;
    enableTabManagement: boolean;
    onTabChange: (tabId: string) => void;
    onTabAdd: (tab: QuoteTab) => void;
    onTabRemove: (tabId: string) => void;
    onTabReorder: (newOrder: QuoteTab[]) => void;
  }) => React.ReactNode;
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
  enableTabManagement = false,
  renderTabs
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

  const hiddenTabs = TABS.filter(tab => !visibleTabs.find(vt => vt.id === tab.id));

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


  const mainColor = data.company.mainColor;

  // Expose tab data for external rendering (e.g., in toolbar)
  React.useEffect(() => {
    if (renderTabs) {
      renderTabs({
        visible: visibleTabs,
        hidden: hiddenTabs,
        active: activeTab,
        mainColor,
        enableTabManagement,
        onTabChange: setActiveTab,
        onTabAdd: handleAddTab,
        onTabRemove: (tabId: string) => {
          const newTabs = visibleTabs.filter(tab => tab.id !== tabId);
          setVisibleTabs(newTabs);
          if (activeTab === tabId) {
            setActiveTab(newTabs[0].id);
          }
          onUpdateData({
            ...data,
            visibleTabIds: newTabs.map(t => t.id)
          });
        },
        onTabReorder: (newTabs: QuoteTab[]) => {
          setVisibleTabs(newTabs);
          onUpdateData({
            ...data,
            visibleTabIds: newTabs.map(t => t.id)
          });
        }
      });
    }
  }, [visibleTabs, hiddenTabs, activeTab, mainColor, enableTabManagement, renderTabs]);

  return (
    <div className="tw-w-full tw-flex tw-flex-col tw-relative">
      <div className="tw-flex-1 tw-py-4">
        {children(activeTab, visibleTabs.map(tab => tab.id))}
      </div>
    </div>
  );
};

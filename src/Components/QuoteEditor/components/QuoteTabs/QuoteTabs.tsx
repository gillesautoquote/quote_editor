import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

  const hiddenTabs = useMemo(() =>
    TABS.filter(tab => !visibleTabs.find(vt => vt.id === tab.id)),
    [visibleTabs]
  );

  const handleAddTab = useCallback((tab: QuoteTab) => {
    setVisibleTabs(prev => {
      const newVisibleTabs = [...prev, tab];
      onUpdateData({
        ...data,
        visibleTabIds: newVisibleTabs.map(t => t.id)
      });
      return newVisibleTabs;
    });
    setActiveTab(tab.id);
  }, [data, onUpdateData]);

  const handleTabRemove = useCallback((tabId: string) => {
    setVisibleTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      onUpdateData({
        ...data,
        visibleTabIds: newTabs.map(t => t.id)
      });
      return newTabs;
    });
    setActiveTab(prev => {
      if (prev === tabId) {
        const newTabs = visibleTabs.filter(tab => tab.id !== tabId);
        return newTabs.length > 0 ? newTabs[0].id : 'introduction';
      }
      return prev;
    });
  }, [data, onUpdateData, visibleTabs]);

  const handleTabReorder = useCallback((newTabs: QuoteTab[]) => {
    setVisibleTabs(newTabs);
    onUpdateData({
      ...data,
      visibleTabIds: newTabs.map(t => t.id)
    });
  }, [data, onUpdateData]);

  const mainColor = data.company.mainColor;

  // Only call renderTabs on mount or when these specific values change
  useEffect(() => {
    if (!renderTabs) return;

    renderTabs({
      visible: visibleTabs,
      hidden: hiddenTabs,
      active: activeTab,
      mainColor,
      enableTabManagement,
      onTabChange: setActiveTab,
      onTabAdd: handleAddTab,
      onTabRemove: handleTabRemove,
      onTabReorder: handleTabReorder
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="tw-w-full tw-flex tw-flex-col tw-relative">
      <div className="tw-flex-1 tw-py-4">
        {children(activeTab, visibleTabs.map(tab => tab.id))}
      </div>
    </div>
  );
};

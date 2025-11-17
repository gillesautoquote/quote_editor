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

  const dataRef = React.useRef(data);
  const visibleTabsRef = React.useRef(visibleTabs);
  const activeTabRef = React.useRef(activeTab);

  dataRef.current = data;
  visibleTabsRef.current = visibleTabs;
  activeTabRef.current = activeTab;

  const handleAddTab = useCallback((tab: QuoteTab) => {
    const newVisibleTabs = [...visibleTabsRef.current, tab];
    setVisibleTabs(newVisibleTabs);
    onUpdateData({
      ...dataRef.current,
      visibleTabIds: newVisibleTabs.map(t => t.id)
    });
    setActiveTab(tab.id);
  }, [onUpdateData]);

  const handleTabRemove = useCallback((tabId: string) => {
    const newTabs = visibleTabsRef.current.filter(tab => tab.id !== tabId);
    setVisibleTabs(newTabs);
    onUpdateData({
      ...dataRef.current,
      visibleTabIds: newTabs.map(t => t.id)
    });

    if (activeTabRef.current === tabId) {
      setActiveTab(newTabs.length > 0 ? newTabs[0].id : 'introduction');
    }
  }, [onUpdateData]);

  const handleTabReorder = useCallback((newTabs: QuoteTab[]) => {
    setVisibleTabs(newTabs);
    onUpdateData({
      ...dataRef.current,
      visibleTabIds: newTabs.map(t => t.id)
    });
  }, [onUpdateData]);

  const mainColor = data.company.mainColor;

  // Utiliser useRef pour éviter que renderTabs ne déclenche des re-renders
  const renderTabsRef = React.useRef(renderTabs);
  renderTabsRef.current = renderTabs;

  // Update toolbar tabs data whenever tabs or active tab changes
  useEffect(() => {
    if (!renderTabsRef.current) return;

    renderTabsRef.current({
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
  }, [visibleTabs, hiddenTabs, activeTab, mainColor, enableTabManagement, handleAddTab, handleTabRemove, handleTabReorder]);

  return (
    <div className="tw-w-full tw-flex tw-flex-col tw-relative">
      <div className="tw-flex-1 tw-py-4">
        {children(activeTab, visibleTabs.map(tab => tab.id))}
      </div>
    </div>
  );
};

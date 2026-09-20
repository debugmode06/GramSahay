import React from 'react';
import { useApp } from '../contexts/AppContext';
import {
  LayoutDashboard,
  Coins,
  Cpu,
  Store,
  FileCheck,
  Bot,
  User
} from 'lucide-react';
import { TabType } from '../types';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, t } = useApp();

  const mobileNavItems: {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'schemes', label: t('nav.financing'), icon: Coins },
    { id: 'gramtwin', label: 'GramTwin™', icon: Cpu },
    { id: 'market', label: t('nav.market'), icon: Store },
    { id: 'assistant', label: t('nav.assistant'), icon: Bot },
    { id: 'dossier', label: t('nav.appReadiness'), icon: FileCheck },
    { id: 'profile', label: t('profile.title'), icon: User },
  ];

  return (
    <nav 
      id="mobile-bottom-navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-md px-1 py-1 flex justify-around items-center"
      aria-label="Mobile Bottom Navigation"
    >
      {mobileNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            id={`mobile-nav-${item.id}`}
            key={item.id}
            type="button"
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-1 py-1 rounded-xl cursor-pointer transition-colors ${
              isActive ? 'text-blue-600 font-bold bg-blue-50/70' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
            <span className="text-[10px] mt-0.5 max-w-[54px] truncate text-center font-medium">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

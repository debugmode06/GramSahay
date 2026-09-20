import React from 'react';
import { useApp } from '../contexts/AppContext';
import {
  LayoutDashboard,
  Coins,
  Cpu,
  Store,
  FileCheck,
  Bot,
  CalendarCheck,
  User,
  ShieldAlert,
  Sparkles,
  X,
  ClipboardCheck,
  Layers,
  Activity
} from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile = false, onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    userRole,
    schemes,
    competitors,
    pilotMilestones,
    language,
    t
  } = useApp();

  const completedMilestones = pilotMilestones.filter(m => m.completed).length;
  const pilotPercent = Math.round((completedMilestones / (pilotMilestones.length || 1)) * 100);

  const navItems: {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: t('nav.dashboard'),
      icon: LayoutDashboard
    },
    {
      id: 'gramtwin',
      label: t('nav.gramtwin'),
      icon: Cpu,
      badge: 'Live',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'stresslab',
      label: 'Loan Stress Lab™',
      icon: ShieldAlert,
      badge: 'Downside',
      badgeColor: 'bg-rose-100 text-rose-800'
    },
    {
      id: 'evolver',
      label: 'Business Evolver',
      icon: Sparkles,
      badge: 'New',
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'market',
      label: t('nav.market'),
      icon: Store,
      badge: competitors.length,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'pilot',
      label: t('nav.pilot'),
      icon: CalendarCheck,
      badge: `${pilotPercent}%`,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'schemes',
      label: t('nav.financing'),
      icon: Coins,
      badge: schemes.length,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'readiness',
      label: '10-Point Readiness',
      icon: ClipboardCheck,
      badge: 'Audit',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'dossier',
      label: t('nav.appReadiness'),
      icon: FileCheck
    },
    {
      id: 'assistant',
      label: t('nav.assistant'),
      icon: Bot,
      badge: 'AI',
      badgeColor: 'bg-indigo-100 text-indigo-800'
    },
    {
      id: 'profile',
      label: t('profile.title'),
      icon: User
    },
    ...(userRole === 'admin'
      ? [
          {
            id: 'admin' as TabType,
            label: t('nav.admin'),
            icon: ShieldAlert,
            badge: 'Admin',
            badgeColor: 'bg-rose-100 text-rose-800'
          }
        ]
      : [])
  ];

  const handleSelectTab = (tabId: TabType) => {
    setActiveTab(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 text-slate-700 select-none">
      {/* Sidebar Brand Header */}
      <div className="p-5 border-b border-slate-200 flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => handleSelectTab('dashboard')}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-xl shadow-xs group-hover:bg-blue-700 transition-colors">
            <span>₹</span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-slate-900 text-lg tracking-tight">GramSahay</span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 leading-tight">
              {language === 'ta' ? 'ஊரக தொழில் வழிகாட்டி' : language === 'hi' ? 'ग्रामीण उद्यम गाइड' : 'Rural Decision Intelligence'}
            </p>
          </div>
        </div>

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {language === 'ta' ? 'வழிகாட்டி பிரிவுகள்' : language === 'hi' ? 'मार्गदर्शन मेनू' : 'Main Menu'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              id={`sidebar-item-${item.id}`}
              key={item.id}
              type="button"
              onClick={() => handleSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold border border-blue-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:block w-64 lg:w-72 shrink-0 h-screen sticky top-0 z-30 shadow-xs">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (When Open) */}
      {isOpenMobile && (
        <div 
          id="mobile-sidebar-backdrop"
          className="md:hidden fixed inset-0 z-50 flex"
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity" 
            onClick={onCloseMobile}
          />
          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs h-full z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

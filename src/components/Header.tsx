import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import {
  Globe,
  BookOpen,
  Eye,
  Menu,
  RotateCcw,
  Check,
  ChevronRight,
  MapPin,
  Sparkles
} from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const {
    language,
    setLanguage,
    simpleLanguage,
    setSimpleLanguage,
    highContrast,
    setHighContrast,
    activeTab,
    profile,
    loadDemoData,
    t
  } = useApp();

  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' }
  ];

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return t('nav.dashboard');
      case 'schemes':
        return t('nav.financing');
      case 'gramtwin':
        return 'GramTwin™ Simulator';
      case 'market':
        return t('nav.market');
      case 'pilot':
        return t('nav.pilot');
      case 'dossier':
        return t('nav.appReadiness');
      case 'assistant':
        return t('nav.assistant');
      case 'profile':
        return t('profile.title');
      case 'admin':
        return t('nav.admin');
      default:
        return 'GramSahay';
    }
  };

  return (
    <header className="w-full sticky top-0 z-20 bg-white border-b border-slate-200 shadow-2xs">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Hamburger + Breadcrumb */}
          <div className="flex items-center space-x-3">
            {/* Mobile Hamburger Toggle */}
            <button
              id="header-mobile-sidebar-toggle"
              type="button"
              onClick={onToggleMobileSidebar}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer border border-slate-200"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Navigation */}
            <div>
              <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
                <span className="font-semibold text-slate-700">GramSahay</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-blue-600 font-bold">{getTabTitle()}</span>
              </div>
              <div className="flex items-center space-x-2 mt-0.5">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  {getTabTitle()}
                </h1>
                {profile.village && (
                  <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{profile.village}{profile.district ? `, ${profile.district}` : ''}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Quick Controls Group */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Simple Language Quick Toggle */}
            <button
              id="header-simple-lang-toggle"
              type="button"
              onClick={() => setSimpleLanguage(!simpleLanguage)}
              title={t('common.simpleLanguageDesc')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                simpleLanguage
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden lg:inline">{t('common.simpleLanguage')}</span>
              <span className="lg:hidden">Simple</span>
              {simpleLanguage && <Check className="w-3 h-3 text-emerald-600" />}
            </button>

            {/* High Contrast Toggle */}
            <button
              id="header-high-contrast-toggle"
              type="button"
              onClick={() => setHighContrast(!highContrast)}
              title="High Contrast Mode for Sunlight Readability"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                highContrast
                  ? 'bg-amber-100 text-amber-900 border-amber-300 ring-1 ring-amber-400'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden xl:inline">High Contrast</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                id="header-language-select-button"
                type="button"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold border border-slate-200 cursor-pointer shadow-2xs"
                aria-haspopup="true"
                aria-expanded={showLangMenu}
              >
                <Globe className="w-4 h-4 text-blue-600" />
                <span>
                  {languages.find(l => l.code === language)?.native || 'English'}
                </span>
              </button>

              {showLangMenu && (
                <div 
                  id="header-language-dropdown"
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {t('common.language')}
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 text-xs sm:text-sm flex items-center justify-between cursor-pointer hover:bg-blue-50 transition-colors ${
                        language === l.code ? 'text-blue-700 font-bold bg-blue-50/60' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">{l.native}</span>
                        <span className="text-[10px] text-slate-400">{l.label}</span>
                      </div>
                      {language === l.code && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Demo Reset */}
            <button
              id="header-load-demo-button"
              type="button"
              onClick={loadDemoData}
              title={t('common.loadDemo')}
              className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Demo</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

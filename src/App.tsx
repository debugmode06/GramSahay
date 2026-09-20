import React, { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { FirstLoginLanguageModal } from './components/FirstLoginLanguageModal';
import { DashboardView } from './components/DashboardView';
import { ProfileWizardView } from './components/ProfileWizardView';
import { SchemesView } from './components/SchemesView';
import { GramTwinView } from './components/GramTwinView';
import { MarketSurveyView } from './components/MarketSurveyView';
import { PilotPlannerView } from './components/PilotPlannerView';
import { LoanDossierView } from './components/LoanDossierView';
import { AdvisorChatView } from './components/AdvisorChatView';
import { StressLabView } from './components/StressLabView';
import { BusinessEvolverView } from './components/BusinessEvolverView';
import { ApplicationReadinessView } from './components/ApplicationReadinessView';
import { WifiOff } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, language, highContrast, isOnline, t } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const getLanguageFontClass = () => {
    if (language === 'ta') return 'font-tamil';
    if (language === 'hi') return 'font-devanagari';
    return 'font-sans';
  };

  return (
    <div className={`min-h-screen flex bg-slate-50 text-slate-900 ${getLanguageFontClass()} ${highContrast ? 'contrast-125' : ''}`}>
      {/* Sidebar (Desktop Sticky + Mobile Drawer) */}
      <Sidebar 
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Viewport (Full Width) */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
        {/* Offline Alert Strip */}
        {!isOnline && (
          <div className="bg-amber-600 text-white px-4 py-2 text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2">
            <WifiOff className="w-4 h-4" />
            <span>{t('common.offlineNotice')}</span>
          </div>
        )}

        {/* Global Header */}
        <Header onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)} />

        {/* First Login Language Setup Modal */}
        <FirstLoginLanguageModal />

        {/* Full-width Main Screen Area */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 max-w-none">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'profile' && <ProfileWizardView />}
          {activeTab === 'schemes' && <SchemesView />}
          {activeTab === 'gramtwin' && <GramTwinView />}
          {activeTab === 'stresslab' && <StressLabView />}
          {activeTab === 'evolver' && <BusinessEvolverView />}
          {activeTab === 'market' && <MarketSurveyView />}
          {activeTab === 'pilot' && <PilotPlannerView />}
          {activeTab === 'readiness' && <ApplicationReadinessView />}
          {activeTab === 'dossier' && <LoanDossierView />}
          {activeTab === 'assistant' && <AdvisorChatView />}
        </main>

        {/* Mobile Quick Bottom Navigation */}
        <Navigation />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, EntrepreneurProfile, BusinessIdea, CompetitorShop, PilotMilestone, Scheme, AuditLogItem, SavedScenario, PostLoanRecord } from '../types';
import enLocale from '../locales/en.json';
import taLocale from '../locales/ta.json';
import hiLocale from '../locales/hi.json';
import { INITIAL_SCHEMES } from '../data/schemesData';
import { DEMO_PROFILE, DEMO_BUSINESS_IDEA, DEMO_COMPETITORS, DEMO_PILOT_MILESTONES, DEMO_AUDIT_LOGS } from '../data/demoData';
import { INITIAL_POST_LOAN_RECORDS } from '../data/innovationsData';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  hasChosenLanguage: boolean;
  setHasChosenLanguage: (chosen: boolean) => void;
  simpleLanguage: boolean;
  setSimpleLanguage: (enabled: boolean) => void;
  guidedMode: boolean;
  setGuidedMode: (enabled: boolean) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  isOnline: boolean;
  userRole: 'entrepreneur' | 'admin';
  setUserRole: (role: 'entrepreneur' | 'admin') => void;
  
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Data
  profile: EntrepreneurProfile;
  updateProfile: (updated: Partial<EntrepreneurProfile>) => void;
  businessIdea: BusinessIdea;
  updateBusinessIdea: (updated: Partial<BusinessIdea>) => void;
  competitors: CompetitorShop[];
  addCompetitor: (comp: Omit<CompetitorShop, 'id' | 'recordedAt'>) => void;
  removeCompetitor: (id: string) => void;
  pilotMilestones: PilotMilestone[];
  togglePilotMilestone: (id: string, notes?: string) => void;
  schemes: Scheme[];
  updateScheme: (scheme: Scheme) => void;
  addScheme: (scheme: Omit<Scheme, 'id'>) => void;
  auditLogs: AuditLogItem[];
  addAuditLog: (action: string, entity: string, entityId: string, details: string) => void;

  // Innovation #2: Saved Scenarios
  savedScenarios: SavedScenario[];
  saveScenario: (scenario: Omit<SavedScenario, 'id' | 'createdAt'>) => void;
  deleteScenario: (id: string) => void;

  // Innovation #19: Post-loan records
  postLoanRecords: PostLoanRecord[];
  addPostLoanRecord: (record: Omit<PostLoanRecord, 'id' | 'recordedAt'>) => void;

  // Innovation #36: Judge Demo Mode
  isJudgeDemoOpen: boolean;
  setIsJudgeDemoOpen: (open: boolean) => void;
  startJudgeDemo: () => void;
  
  // Translation helper
  t: (path: string) => string;
  getTerm: (termKey: string) => { name: string; desc: string };
  
  // Demo reset
  loadDemoData: () => void;
  resetAllData: () => void;

  // Voice speech helper
  isListening: boolean;
  voiceAvailable: boolean;
  startVoiceInput: (onResult: (text: string) => void) => void;
  stopVoiceInput: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCALES: Record<Language, any> = {
  en: enLocale,
  ta: taLocale,
  hi: hiLocale
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language state
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('gramsahay_lang');
    return (saved === 'ta' || saved === 'hi' || saved === 'en') ? saved : 'en';
  });

  const [hasChosenLanguage, setHasChosenLanguageState] = useState<boolean>(() => {
    return localStorage.getItem('gramsahay_has_chosen_lang') === 'true';
  });

  const [simpleLanguage, setSimpleLanguageState] = useState<boolean>(() => {
    return localStorage.getItem('gramsahay_simple_lang') === 'true';
  });

  const [guidedMode, setGuidedModeState] = useState<boolean>(() => {
    return localStorage.getItem('gramsahay_guided_mode') === 'true';
  });

  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    return localStorage.getItem('gramsahay_high_contrast') === 'true';
  });

  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const setHighContrast = (enabled: boolean) => {
    setHighContrastState(enabled);
    localStorage.setItem('gramsahay_high_contrast', String(enabled));
  };

  const [userRole, setUserRole] = useState<'entrepreneur' | 'admin'>('entrepreneur');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // 2. Data states with local storage persistence
  const [profile, setProfile] = useState<EntrepreneurProfile>(() => {
    const saved = localStorage.getItem('gramsahay_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEMO_PROFILE;
  });

  const [businessIdea, setBusinessIdea] = useState<BusinessIdea>(() => {
    const saved = localStorage.getItem('gramsahay_business');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEMO_BUSINESS_IDEA;
  });

  const [competitors, setCompetitors] = useState<CompetitorShop[]>(() => {
    const saved = localStorage.getItem('gramsahay_competitors');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEMO_COMPETITORS;
  });

  const [pilotMilestones, setPilotMilestones] = useState<PilotMilestone[]>(() => {
    const saved = localStorage.getItem('gramsahay_pilot');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEMO_PILOT_MILESTONES;
  });

  const [schemes, setSchemes] = useState<Scheme[]>(() => {
    const saved = localStorage.getItem('gramsahay_schemes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_SCHEMES;
  });

  // Innovation #2: Saved Scenarios
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>(() => {
    const saved = localStorage.getItem('gramsahay_scenarios');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'sc_base',
        name: 'Base Plan (40 Customers/Day)',
        customersPerDay: 40,
        avgBill: 150,
        operatingDays: 26,
        marginPercent: 40,
        fixedCosts: 14000,
        monthlyRevenue: 156000,
        monthlyCosts: 107600,
        monthlyEMI: 8700,
        monthlySurplus: 39700,
        breakEven: 22,
        createdAt: '2026-09-01'
      },
      {
        id: 'sc_conservative',
        name: 'Conservative (30 Customers/Day)',
        customersPerDay: 30,
        avgBill: 140,
        operatingDays: 26,
        marginPercent: 38,
        fixedCosts: 14000,
        monthlyRevenue: 109200,
        monthlyCosts: 81700,
        monthlyEMI: 8700,
        monthlySurplus: 18800,
        breakEven: 24,
        createdAt: '2026-09-02'
      },
      {
        id: 'sc_optimistic',
        name: 'Optimistic (55 Customers/Day)',
        customersPerDay: 55,
        avgBill: 165,
        operatingDays: 26,
        marginPercent: 42,
        fixedCosts: 16000,
        monthlyRevenue: 235950,
        monthlyCosts: 152850,
        monthlyEMI: 8700,
        monthlySurplus: 74400,
        breakEven: 21,
        createdAt: '2026-09-03'
      }
    ];
  });

  // Innovation #19: Post-loan health records
  const [postLoanRecords, setPostLoanRecords] = useState<PostLoanRecord[]>(() => {
    const saved = localStorage.getItem('gramsahay_post_loan');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_POST_LOAN_RECORDS;
  });

  // Innovation #36: Judge Demo
  const [isJudgeDemoOpen, setIsJudgeDemoOpen] = useState<boolean>(false);

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(DEMO_AUDIT_LOGS);

  // Voice speech state
  const [isListening, setIsListening] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(false);

  useEffect(() => {
    const hasSpeech = typeof window !== 'undefined' && 
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    setVoiceAvailable(!!hasSpeech);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('gramsahay_lang', lang);
  };

  const setHasChosenLanguage = (chosen: boolean) => {
    setHasChosenLanguageState(chosen);
    localStorage.setItem('gramsahay_has_chosen_lang', chosen ? 'true' : 'false');
  };

  const setSimpleLanguage = (enabled: boolean) => {
    setSimpleLanguageState(enabled);
    localStorage.setItem('gramsahay_simple_lang', enabled ? 'true' : 'false');
  };

  const setGuidedMode = (enabled: boolean) => {
    setGuidedModeState(enabled);
    localStorage.setItem('gramsahay_guided_mode', enabled ? 'true' : 'false');
  };

  const updateProfile = (updated: Partial<EntrepreneurProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updated, updatedAt: new Date().toISOString() };
      localStorage.setItem('gramsahay_profile', JSON.stringify(next));
      return next;
    });
  };

  const updateBusinessIdea = (updated: Partial<BusinessIdea>) => {
    setBusinessIdea(prev => {
      const next = { ...prev, ...updated, updatedAt: new Date().toISOString() };
      localStorage.setItem('gramsahay_business', JSON.stringify(next));
      return next;
    });
  };

  const addCompetitor = (comp: Omit<CompetitorShop, 'id' | 'recordedAt'>) => {
    const newComp: CompetitorShop = {
      ...comp,
      id: 'comp_' + Date.now(),
      recordedAt: new Date().toISOString().split('T')[0]
    };
    setCompetitors(prev => {
      const next = [newComp, ...prev];
      localStorage.setItem('gramsahay_competitors', JSON.stringify(next));
      return next;
    });
  };

  const removeCompetitor = (id: string) => {
    setCompetitors(prev => {
      const next = prev.filter(c => c.id !== id);
      localStorage.setItem('gramsahay_competitors', JSON.stringify(next));
      return next;
    });
  };

  const togglePilotMilestone = (id: string, notes?: string) => {
    setPilotMilestones(prev => {
      const next = prev.map(m => {
        if (m.id === id) {
          return {
            ...m,
            completed: !m.completed,
            userObservations: notes !== undefined ? notes : m.userObservations
          };
        }
        return m;
      });
      localStorage.setItem('gramsahay_pilot', JSON.stringify(next));
      return next;
    });
  };

  const updateScheme = (updatedScheme: Scheme) => {
    setSchemes(prev => {
      const next = prev.map(s => s.id === updatedScheme.id ? updatedScheme : s);
      localStorage.setItem('gramsahay_schemes', JSON.stringify(next));
      return next;
    });
    addAuditLog('UPDATE_SCHEME', 'Scheme', updatedScheme.id, `Updated details for ${updatedScheme.code}`);
  };

  const addScheme = (newSchemeData: Omit<Scheme, 'id'>) => {
    const newScheme: Scheme = {
      ...newSchemeData,
      id: 'scheme_' + Date.now()
    };
    setSchemes(prev => {
      const next = [newScheme, ...prev];
      localStorage.setItem('gramsahay_schemes', JSON.stringify(next));
      return next;
    });
    addAuditLog('CREATE_SCHEME', 'Scheme', newScheme.id, `Created new scheme: ${newScheme.code}`);
  };

  const addAuditLog = (action: string, entity: string, entityId: string, details: string) => {
    const newLog: AuditLogItem = {
      id: 'log_' + Date.now(),
      action,
      entity,
      entityId,
      actor: userRole === 'admin' ? 'Admin_Desk' : 'Entrepreneur_User',
      timestamp: new Date().toISOString(),
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Translation lookup with fallback
  const t = useCallback((path: string): string => {
    const keys = path.split('.');
    
    // Check in current language bundle
    let current: any = LOCALES[language];
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        current = undefined;
        break;
      }
    }
    if (typeof current === 'string') return current;

    // Fallback to English
    let fallback: any = LOCALES.en;
    for (const key of keys) {
      if (fallback && typeof fallback === 'object' && key in fallback) {
        fallback = fallback[key];
      } else {
        fallback = undefined;
        break;
      }
    }
    if (typeof fallback === 'string') return fallback;

    return path; // return key safely rather than undefined
  }, [language]);

  // Contextual Terminology explanation helper
  const getTerm = useCallback((termKey: string) => {
    const name = t(`terminology.${termKey}.name`);
    const simple = t(`terminology.${termKey}.simple`);
    const detail = t(`terminology.${termKey}.detail`);
    return {
      name,
      desc: simpleLanguage ? simple : detail
    };
  }, [t, simpleLanguage]);

  // Reset to demo data
  const loadDemoData = () => {
    setProfile(DEMO_PROFILE);
    setBusinessIdea(DEMO_BUSINESS_IDEA);
    setCompetitors(DEMO_COMPETITORS);
    setPilotMilestones(DEMO_PILOT_MILESTONES);
    setSchemes(INITIAL_SCHEMES);
    localStorage.setItem('gramsahay_profile', JSON.stringify(DEMO_PROFILE));
    localStorage.setItem('gramsahay_business', JSON.stringify(DEMO_BUSINESS_IDEA));
    localStorage.setItem('gramsahay_competitors', JSON.stringify(DEMO_COMPETITORS));
    localStorage.setItem('gramsahay_pilot', JSON.stringify(DEMO_PILOT_MILESTONES));
    localStorage.setItem('gramsahay_schemes', JSON.stringify(INITIAL_SCHEMES));
  };

  // Reset all
  const resetAllData = () => {
    const blankProfile: EntrepreneurProfile = {
      id: 'ent_' + Date.now(),
      name: '',
      age: 25,
      village: '',
      block: '',
      district: '',
      state: '',
      locationType: 'rural',
      status: 'firstTime',
      businessType: '',
      category: 'Grocery',
      skills: '',
      ownCapital: 50000,
      projectCost: 200000,
      requiredLoan: 150000,
      completedSteps: 0,
      updatedAt: new Date().toISOString()
    };
    setProfile(blankProfile);
    localStorage.setItem('gramsahay_profile', JSON.stringify(blankProfile));
    setCompetitors([]);
    localStorage.setItem('gramsahay_competitors', JSON.stringify([]));
  };

  // Web Speech recognition helper
  const startVoiceInput = (onResult: (text: string) => void) => {
    if (!voiceAvailable) return;
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      // Select speech recognition language matching user's selected language
      if (language === 'ta') {
        recognition.lang = 'ta-IN';
      } else if (language === 'hi') {
        recognition.lang = 'hi-IN';
      } else {
        recognition.lang = 'en-IN';
      }

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onResult(transcript);
        }
      };
      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  const stopVoiceInput = () => {
    setIsListening(false);
  };

  const saveScenario = (scenarioData: Omit<SavedScenario, 'id' | 'createdAt'>) => {
    const newSc: SavedScenario = {
      ...scenarioData,
      id: 'sc_' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSavedScenarios(prev => {
      const next = [newSc, ...prev];
      localStorage.setItem('gramsahay_scenarios', JSON.stringify(next));
      return next;
    });
    addAuditLog('SAVE_SCENARIO', 'Scenario', newSc.id, `Saved simulation scenario: ${newSc.name}`);
  };

  const deleteScenario = (id: string) => {
    setSavedScenarios(prev => {
      const next = prev.filter(s => s.id !== id);
      localStorage.setItem('gramsahay_scenarios', JSON.stringify(next));
      return next;
    });
  };

  const addPostLoanRecord = (rec: Omit<PostLoanRecord, 'id' | 'recordedAt'>) => {
    const newRec: PostLoanRecord = {
      ...rec,
      id: 'pl_' + Date.now(),
      recordedAt: new Date().toISOString().split('T')[0]
    };
    setPostLoanRecords(prev => {
      const next = [...prev, newRec];
      localStorage.setItem('gramsahay_post_loan', JSON.stringify(next));
      return next;
    });
  };

  const startJudgeDemo = () => {
    setIsJudgeDemoOpen(true);
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      hasChosenLanguage,
      setHasChosenLanguage,
      simpleLanguage,
      setSimpleLanguage,
      guidedMode,
      setGuidedMode,
      highContrast,
      setHighContrast,
      isOnline,
      userRole,
      setUserRole,
      activeTab,
      setActiveTab,
      profile,
      updateProfile,
      businessIdea,
      updateBusinessIdea,
      competitors,
      addCompetitor,
      removeCompetitor,
      pilotMilestones,
      togglePilotMilestone,
      schemes,
      updateScheme,
      addScheme,
      auditLogs,
      addAuditLog,
      savedScenarios,
      saveScenario,
      deleteScenario,
      postLoanRecords,
      addPostLoanRecord,
      isJudgeDemoOpen,
      setIsJudgeDemoOpen,
      startJudgeDemo,
      t,
      getTerm,
      loadDemoData,
      resetAllData,
      isListening,
      voiceAvailable,
      startVoiceInput,
      stopVoiceInput
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

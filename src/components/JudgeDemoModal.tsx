import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  CheckCircle2, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Play, 
  Award, 
  Activity, 
  Eye, 
  ShieldAlert, 
  HelpCircle, 
  FileCheck, 
  Globe 
} from 'lucide-react';

interface DemoStep {
  title: string;
  badge: string;
  description: string;
  keyDifferentiator: string;
  targetTab: string;
  icon: React.ReactNode;
}

export const JudgeDemoModal: React.FC = () => {
  const { isJudgeDemoOpen, setIsJudgeDemoOpen, setActiveTab, setLanguage, language } = useApp();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  if (!isJudgeDemoOpen) return null;

  const steps: DemoStep[] = [
    {
      title: '1. Rural-First Profile & Context',
      badge: 'Inclusive Onboarding',
      description: 'Collects realistic rural constraints: own equity, village location, informal prior experience, and risk appetite without asking for complex financial balance sheets.',
      keyDifferentiator: 'Bypasses standard corporate SaaS jargon with voice input and audio-friendly terminology in Tamil, Hindi, and English.',
      targetTab: 'profile',
      icon: <Award className="w-5 h-5 text-blue-600" />
    },
    {
      title: '2. Grounded Market Survey (Observation Radar)',
      badge: 'On-Ground Evidence',
      description: 'Records neighboring competitor shops, customer footfall timings, credit practices, and missing village services directly from physical observations.',
      keyDifferentiator: 'Builds an Opportunity Radar showing zero-competition services (e.g., home delivery, morning breakfast counter).',
      targetTab: 'market',
      icon: <Eye className="w-5 h-5 text-amber-600" />
    },
    {
      title: '3. GramTwin™ Real-Time Business Simulation',
      badge: 'Live Mathematical Model',
      description: 'Interactive unit economics engine with live sliders for customer count, average ticket, days, and margin. Computes revenue, operating costs, loan EMI, and monthly surplus.',
      keyDifferentiator: 'Save and compare multiple scenarios side-by-side (Base vs Conservative vs Optimistic) with live break-even calculations.',
      targetTab: 'gramtwin',
      icon: <Activity className="w-5 h-5 text-emerald-600" />
    },
    {
      title: '4. Loan Stress Lab™ (Downside Shocks)',
      badge: 'Prudence & Resilience',
      description: 'Tests what happens during agricultural lean seasons, severe road repairs, or price inflation. Shows post-EMI surplus under 10% to 40% drops.',
      keyDifferentiator: 'Helps rural families identify repayment pressure points before taking on unmanageable debt.',
      targetTab: 'stresslab',
      icon: <ShieldAlert className="w-5 h-5 text-rose-600" />
    },
    {
      title: '5. "Why Not Borrow?" & Business Evolver',
      badge: 'Responsible Decision Support',
      description: 'System explicitly highlights unvalidated assumptions and offers modified business variations (e.g. adding delivery or value-add processing) before taking debt.',
      keyDifferentiator: 'Decision intelligence, not a blind loan sales engine. Identifies what must be proven first.',
      targetTab: 'evolver',
      icon: <HelpCircle className="w-5 h-5 text-purple-600" />
    },
    {
      title: '6. 30-Day Lean Validation Pilot',
      badge: 'Risk Mitigation',
      description: 'Guided 30-day pre-loan trial to test customer willingness to pay using pop-up stalls or WhatsApp orders with zero loan debt.',
      keyDifferentiator: 'Go / No-Go checkpoint before committing to heavy machinery loans or commercial leases.',
      targetTab: 'pilot',
      icon: <Sparkles className="w-5 h-5 text-amber-600" />
    },
    {
      title: '7. Government Scheme Matcher & Rules Engine',
      badge: 'PMEGP, Mudra, Stand-Up',
      description: 'Transparent rule-based matching with eligibility criteria, maximum subsidy calculation, and audit trail of every rule checked.',
      keyDifferentiator: 'Admin dashboard allows scheme officers to update subsidy limits in real time with logged compliance records.',
      targetTab: 'schemes',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />
    },
    {
      title: '8. Bank-Ready Loan Dossier & Evidence Badges',
      badge: 'Complete Institutional Dossier',
      description: 'Generates an institutional 18-point decision report for bank managers with explicit Evidence Source tags (Verified, User-Observed, Estimated).',
      keyDifferentiator: 'Includes Cash Flow Forecast, Sensitivity Drivers, Downside Stress Table, and Print-to-PDF formatting.',
      targetTab: 'dossier',
      icon: <FileCheck className="w-5 h-5 text-blue-600" />
    }
  ];

  const currentStep = steps[currentStepIndex];

  const handleGoToStep = (index: number) => {
    setCurrentStepIndex(index);
    setActiveTab(steps[index].targetTab);
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      handleGoToStep(currentStepIndex + 1);
    } else {
      setIsJudgeDemoOpen(false);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      handleGoToStep(currentStepIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Top Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Play className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Evaluation & Judge Tour</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900 text-blue-200 border border-blue-700">
                  Step {currentStepIndex + 1} of {steps.length}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">GramSahay™ Innovation Showcase</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsJudgeDemoOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 flex-1 bg-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                {currentStep.icon}
              </div>
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                  {currentStep.badge}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {currentStep.title}
                </h3>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
            <p className="font-medium text-slate-800">
              {currentStep.description}
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-900 block flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Core Innovation & Differentiation:</span>
              </span>
              <p className="text-xs text-slate-600">
                {currentStep.keyDifferentiator}
              </p>
            </div>
          </div>

          {/* Quick jump step dots */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-400 block mb-2 uppercase tracking-wider">
              Jump to Architecture Pillar:
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {steps.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleGoToStep(idx)}
                  className={`h-9 rounded-xl font-bold text-xs transition-all border cursor-pointer flex items-center justify-center ${
                    idx === currentStepIndex
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-200'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Bottom Controls */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center space-x-1.5 ${
              currentStepIndex === 0
                ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab(currentStep.targetTab);
                setIsJudgeDemoOpen(false);
              }}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 transition-colors cursor-pointer"
            >
              Explore This Screen
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="min-h-[42px] px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-xs"
            >
              <span>{currentStepIndex === steps.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

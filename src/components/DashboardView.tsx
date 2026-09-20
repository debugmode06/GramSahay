import React from 'react';
import { useApp } from '../contexts/AppContext';
import { formatIndianCurrency, calculateEMI } from '../utils/financialEngine';
import {
  TrendingUp,
  Coins,
  Cpu,
  Store,
  FileCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Building,
  Users
} from 'lucide-react';
import { TermTooltip } from './TermTooltip';

export const DashboardView: React.FC = () => {
  const {
    profile,
    businessIdea,
    competitors,
    pilotMilestones,
    schemes,
    setActiveTab,
    t
  } = useApp();

  const emi = calculateEMI(profile.requiredLoan, 9.5, 5);
  const estimatedSurplus = Math.max(0, businessIdea.estimatedMonthlyRevenue - businessIdea.estimatedMonthlyOperatingCosts - emi);
  const completedPilotCount = pilotMilestones.filter(m => m.completed).length;

  return (
    <div className="space-y-6 pb-20">
      {/* Top Welcome Card (Complete Light Theme) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 text-slate-900 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2 border border-blue-200">
              <Compass className="w-3.5 h-3.5" />
              <span>{profile.locationType === 'rural' ? 'Rural Village Enterprise' : 'Semi-Urban Unit'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {t('dashboard.welcomeBack')} {profile.name || 'Entrepreneur'}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              {profile.village ? `${profile.village}, ${profile.district || ''}` : t('dashboard.greetingSubtitle')}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              id="dashboard-explore-schemes-button"
              type="button"
              onClick={() => setActiveTab('schemes')}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs flex items-center space-x-2 cursor-pointer transition-colors"
            >
              <Coins className="w-4 h-4 text-white" />
              <span>{t('dashboard.exploreSchemes')}</span>
            </button>
            <button
              id="dashboard-test-business-button"
              type="button"
              onClick={() => setActiveTab('gramtwin')}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-sm border border-slate-200 flex items-center space-x-2 cursor-pointer transition-colors"
            >
              <Cpu className="w-4 h-4 text-blue-600" />
              <span>GramTwin™ Simulator</span>
            </button>
          </div>
        </div>

        {/* Innovation Spotlight Row */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Core Decision Intelligence Innovations
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('stresslab')}
              className="p-3.5 rounded-xl bg-rose-50/70 hover:bg-rose-50 border border-rose-200 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between font-bold text-xs text-rose-900">
                <span className="flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Loan Stress Lab™</span>
                </span>
                <span className="text-[10px] text-rose-600 group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
              <p className="text-[11px] text-rose-800 mt-1 leading-normal font-medium">
                Downside shocks, monsoon drop, and "Why Not Borrow" reasons.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('evolver')}
              className="p-3.5 rounded-xl bg-purple-50/70 hover:bg-purple-50 border border-purple-200 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between font-bold text-xs text-purple-900">
                <span className="flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Business Evolver</span>
                </span>
                <span className="text-[10px] text-purple-600 group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
              <p className="text-[11px] text-purple-800 mt-1 leading-normal font-medium">
                Skill-to-enterprise matching and uncrowded variations.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('readiness')}
              className="p-3.5 rounded-xl bg-emerald-50/70 hover:bg-emerald-50 border border-emerald-200 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between font-bold text-xs text-emerald-900">
                <span className="flex items-center space-x-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>10-Point Readiness Audit</span>
                </span>
                <span className="text-[10px] text-emerald-600 group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
              <p className="text-[11px] text-emerald-800 mt-1 leading-normal font-medium">
                Pre-bank submission check and Start-Small phase ladders.
              </p>
            </button>
          </div>
        </div>

        {/* Recommended Next Action Callout */}
        <div className="mt-5 p-4 rounded-xl bg-amber-50/90 border border-amber-200 flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold text-amber-900 uppercase tracking-wide mr-2">
              {t('dashboard.recommendedNextAction')}:
            </span>
            <span className="text-slate-800 font-medium">
              Talk to 20 local families to test milk and curd demand before applying for bank sanction.
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Cards Grid (Point 8 in Master Prompt) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Government Schemes */}
        <div 
          id="action-card-schemes"
          onClick={() => setActiveTab('schemes')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <Coins className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-900 text-base">{t('dashboard.actionLoan')}</h2>
            <p className="text-xs text-slate-500 mt-1">{t('dashboard.actionLoanSub')}</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
            <span>{schemes.length} Schemes Verified</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* 2. GramTwin Simulation */}
        <div 
          id="action-card-gramtwin"
          onClick={() => setActiveTab('gramtwin')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-900 text-base">{t('dashboard.actionTest')}</h2>
            <p className="text-xs text-slate-500 mt-1">{t('dashboard.actionTestSub')}</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700">
            <span>Test Loan & Profit</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* 3. Market Survey */}
        <div 
          id="action-card-market"
          onClick={() => setActiveTab('market')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <Store className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-900 text-base">{t('dashboard.actionMarket')}</h2>
            <p className="text-xs text-slate-500 mt-1">{t('dashboard.actionMarketSub')}</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700">
            <span>{competitors.length} Shops Logged</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* 4. Loan Readiness Dossier */}
        <div 
          id="action-card-dossier"
          onClick={() => setActiveTab('dossier')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
              <FileCheck className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-900 text-base">{t('dossier.title')}</h2>
            <p className="text-xs text-slate-500 mt-1">Ready for Bank & DIC Officer Review</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-700">
            <span>Download & Print</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Decision Center Summary Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">{t('dashboard.summaryTitle')}</h2>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Edit Profile →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Enterprise Profile */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t('dashboard.businessCard')}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
                {profile.category || 'Rural Micro'}
              </span>
            </div>
            <div className="font-bold text-slate-900 text-base">
              {profile.businessType || 'New Proposed Enterprise'}
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <div><span className="text-slate-400">Village:</span> {profile.village || 'Not set'}</div>
              <div><span className="text-slate-400">Status:</span> {profile.status === 'firstTime' ? 'First-time Entrepreneur' : 'Existing Expansion'}</div>
              <div><span className="text-slate-400">Experience:</span> {profile.skills ? profile.skills.substring(0, 60) + '...' : 'Self-taught'}</div>
            </div>
          </div>

          {/* Card 2: Financing Sizing */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t('dashboard.financeCard')}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold">
                Estimated
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-slate-500 block">
                  Project Cost <TermTooltip termKey="projectCost" />
                </span>
                <span className="text-base font-bold text-slate-900">
                  {formatIndianCurrency(profile.projectCost)}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">
                  Own Capital <TermTooltip termKey="ownContribution" />
                </span>
                <span className="text-base font-bold text-emerald-700">
                  {formatIndianCurrency(profile.ownCapital)}
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Loan Needed <TermTooltip termKey="loanAmount" />:
              </span>
              <span className="font-bold text-blue-700">
                {formatIndianCurrency(profile.requiredLoan)}
              </span>
            </div>
          </div>

          {/* Card 3: GramTwin Live Estimate */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t('dashboard.gramtwinCard')}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-xs font-semibold">
                Simulated
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-slate-500 block">
                  Est. Monthly EMI <TermTooltip termKey="emi" />
                </span>
                <span className="text-base font-bold text-amber-700">
                  {formatIndianCurrency(emi)}/mo
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">
                  Est. Surplus <TermTooltip termKey="breakEven" />
                </span>
                <span className="text-base font-bold text-emerald-700">
                  {formatIndianCurrency(estimatedSurplus)}/mo
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Break-even Footfall:</span>
              <span className="font-bold text-slate-800">
                ~28 customers / day
              </span>
            </div>
          </div>

          {/* Card 4: Local Market Survey Gaps */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t('dashboard.marketCard')}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-xs font-semibold">
                {competitors.length} Surveyed
              </span>
            </div>
            <div className="text-xs text-slate-700 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Opportunity: Early morning milk & fresh curd gap</span>
              </div>
              <div className="flex items-center space-x-1.5 text-blue-700">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>No competitor offers home delivery to hamlets</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('market')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Inspect Opportunity Radar →
              </button>
            </div>
          </div>

          {/* Card 5: 30-Day Pilot Validation */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t('dashboard.pilotCard')}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
                {completedPilotCount} of {pilotMilestones.length} Done
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedPilotCount / pilotMilestones.length) * 100}%` }}
              />
            </div>
            <div className="text-xs text-slate-600">
              Week 1 & 2 completed. 28 local families surveyed with positive purchase response.
            </div>
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('pilot')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                Track Week 3 Trial Sales →
              </button>
            </div>
          </div>

          {/* Card 6: Readiness Dossier */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t('dashboard.readinessCard')}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold">
                85% Prepared
              </span>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <div>✓ Entrepreneur background verified</div>
              <div>✓ Capital & Margin structure ready</div>
              <div>✓ GramTwin stress-test passed</div>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('dossier')}
                className="text-xs font-semibold text-purple-600 hover:text-purple-800 cursor-pointer"
              >
                Open Official Dossier →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

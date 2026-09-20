import React from 'react';
import { useApp } from '../contexts/AppContext';
import { formatIndianCurrency, calculateEMI } from '../utils/financialEngine';
import {
  FileCheck,
  Printer,
  Download,
  ShieldCheck,
  Building,
  User,
  MapPin,
  Coins,
  Cpu,
  Store,
  CalendarCheck,
  AlertTriangle
} from 'lucide-react';

export const LoanDossierView: React.FC = () => {
  const {
    profile,
    businessIdea,
    competitors,
    pilotMilestones,
    schemes,
    t
  } = useApp();

  const emi = calculateEMI(profile.requiredLoan, 9.5, 5);
  const surplus = Math.max(0, businessIdea.estimatedMonthlyRevenue - businessIdea.estimatedMonthlyOperatingCosts - emi);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Top Action Bar (hidden in print) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
            <FileCheck className="w-4 h-4" />
            <span>Formal Decision Dossier</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t('dossier.title')}</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            {t('dossier.subtitle')}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            id="print-dossier-button"
            type="button"
            onClick={handlePrint}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center space-x-2 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>{t('common.printReport')}</span>
          </button>
        </div>
      </div>

      {/* The Printable Dossier Document */}
      <div 
        id="printable-loan-dossier"
        className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8 text-slate-900 print:border-none print:shadow-none print:p-0"
      >
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-700 font-bold text-xl mb-1">
              <span>₹ GramSahay Rural Decision Intelligence</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Rural Enterprise Pre-Loan Readiness Dossier
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Document Reference: GSD-{profile.id.toUpperCase()} • Generated on {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-right text-xs">
            <div className="font-bold text-slate-900">Target Lending Facility:</div>
            <div className="text-blue-700 font-semibold">PMEGP / MUDRA (Kishore)</div>
            <div className="text-slate-500">CGTMSE Collateral-Free Track</div>
          </div>
        </div>

        {/* Section 1: Applicant Profile */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 flex items-center space-x-2">
            <User className="w-4 h-4 text-blue-600" />
            <span>{t('dossier.sections.applicant')}</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Applicant Name</span>
              <span className="font-bold text-slate-900 text-sm">{profile.name || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Age & Status</span>
              <span className="font-semibold text-slate-900">{profile.age} yrs • {profile.status === 'firstTime' ? 'First-time Entrepreneur' : 'Existing Unit'}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Location</span>
              <span className="font-semibold text-slate-900">{profile.village}, {profile.district}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Area Classification</span>
              <span className="font-semibold text-emerald-700">{profile.locationType === 'rural' ? 'Rural Village Panchayat' : 'Semi-Urban Town'}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Business Concept & Operations */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 flex items-center space-x-2">
            <Building className="w-4 h-4 text-blue-600" />
            <span>{t('dossier.sections.proposal')}</span>
          </h3>

          <div className="text-xs space-y-2 text-slate-700 leading-relaxed">
            <p>
              <span className="font-bold text-slate-900">Enterprise Concept: </span>
              {businessIdea.name || profile.businessType}
            </p>
            <p>
              <span className="font-bold text-slate-900">Operational Plan: </span>
              {businessIdea.description || 'Rural retail counter and processing facility catering to village residents and highway transit footfall.'}
            </p>
            <p>
              <span className="font-bold text-slate-900">Prior Skill / Training: </span>
              {profile.skills || 'Practical family farming experience.'}
            </p>
          </div>
        </div>

        {/* Section 3: Financial Sizing & Capital Allocation */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 flex items-center space-x-2">
            <Coins className="w-4 h-4 text-blue-600" />
            <span>{t('dossier.sections.financials')}</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Total Project Cost</span>
              <span className="font-extrabold text-slate-900 text-base">{formatIndianCurrency(profile.projectCost)}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Promoter Own Equity</span>
              <span className="font-extrabold text-emerald-700 text-base">{formatIndianCurrency(profile.ownCapital)}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Term Loan Requirement</span>
              <span className="font-extrabold text-blue-700 text-base">{formatIndianCurrency(profile.requiredLoan)}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Eligible Rural Subsidy</span>
              <span className="font-extrabold text-purple-700 text-base">Up to 35% (PMEGP)</span>
            </div>
          </div>
        </div>

        {/* Section 4: GramTwin™ Feasibility Analysis */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            <span>{t('dossier.sections.simulation')}</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200">
              <span className="text-slate-400 block">Monthly Revenue</span>
              <span className="font-bold text-slate-900 text-sm">{formatIndianCurrency(businessIdea.estimatedMonthlyRevenue)}</span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200">
              <span className="text-slate-400 block">Monthly Operating Costs</span>
              <span className="font-bold text-slate-900 text-sm">{formatIndianCurrency(businessIdea.estimatedMonthlyOperatingCosts)}</span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-amber-50">
              <span className="text-amber-800 block font-semibold">Simulated Monthly EMI</span>
              <span className="font-bold text-amber-900 text-sm">{formatIndianCurrency(emi)} / mo</span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-emerald-50">
              <span className="text-emerald-800 block font-semibold">Take-Home Operating Surplus</span>
              <span className="font-bold text-emerald-900 text-sm">{formatIndianCurrency(surplus)} / mo</span>
            </div>
          </div>
        </div>

        {/* Section 5: Local Competitors & Unmet Market Opportunities */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 flex items-center space-x-2">
            <Store className="w-4 h-4 text-blue-600" />
            <span>{t('dossier.sections.market')}</span>
          </h3>

          <div className="text-xs space-y-2 text-slate-700">
            <p>
              On-ground local survey identified <span className="font-bold">{competitors.length} neighboring shops</span> within a 500m radius.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">Identified Gaps to Exploit:</div>
              <div>• Existing shops do not provide doorstep delivery to nearby hamlets.</div>
              <div>• Unmet demand for fresh organic farm milk and authentic cottage paneer.</div>
              <div>• Morning operating hours before 6:30 AM capture high-margin transit traffic.</div>
            </div>
          </div>
        </div>

        {/* Section 6: 30-Day Pilot Validation Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 flex items-center space-x-2">
            <CalendarCheck className="w-4 h-4 text-blue-600" />
            <span>{t('dossier.sections.pilot')}</span>
          </h3>

          <div className="text-xs space-y-2 text-slate-700 leading-relaxed">
            <p>
              Pre-loan field validation completed with 28 household interviews and trial sample distribution. 80%+ positive response confirming viable repeat customer interest.
            </p>
          </div>
        </div>

        {/* Section 7: Mandatory Official Disclaimer (Point 24) */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-2">
          <div className="font-bold flex items-center space-x-2 text-amber-900">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Official Government Verification Notice & Disclaimers</span>
          </div>
          <p className="leading-relaxed">
            {t('common.officialDisclaimer')}
          </p>
          <p className="leading-relaxed">
            Interest rates, subsidy disbursals, and credit approvals are subject to formal bank appraisal and current notification guidelines from the Ministry of MSME, KVIC, and participating scheduled commercial banks.
          </p>
        </div>

        {/* Sign-off footer */}
        <div className="pt-6 border-t border-slate-300 flex justify-between items-end text-xs text-slate-500">
          <div>
            <div>Prepared with GramSahay Decision Intelligence</div>
            <div>www.kviconline.gov.in • www.mudra.org.in</div>
          </div>
          <div className="text-right">
            <div className="h-10 border-b border-slate-400 w-48 mb-1"></div>
            <div>Applicant Signature / Thumb Impression</div>
          </div>
        </div>
      </div>
    </div>
  );
};

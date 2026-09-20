import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  calculateApplicationReadiness, 
  getAssumptionRegister, 
  getStartSmallTiers 
} from '../data/innovationsData';
import { formatIndianCurrency } from '../utils/financialEngine';
import { EvidenceBadge } from './EvidenceBadge';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  FileText, 
  Layers, 
  Sliders, 
  ShieldCheck, 
  FileCheck,
  TrendingUp,
  Award
} from 'lucide-react';

export const ApplicationReadinessView: React.FC = () => {
  const { profile, businessIdea, competitors, pilotMilestones, setActiveTab } = useApp();
  
  const [subTab, setSubTab] = useState<'readiness' | 'assumptions' | 'startsmall' | 'documents'>('readiness');

  const { score, total, percentage, items } = calculateApplicationReadiness(
    profile, 
    businessIdea, 
    competitors, 
    pilotMilestones
  );

  const assumptions = getAssumptionRegister(businessIdea, profile);
  const startSmallTiers = getStartSmallTiers(businessIdea, profile);

  return (
    <div className="w-full space-y-8 pb-20">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
              <ClipboardCheck className="w-4 h-4 text-emerald-600" />
              <span>Innovation #10, #15, #28 & #35: Application Preparation & Transparency</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Application Readiness & Assumption Register
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              Verify that every piece of your business and loan proposal is solid before submitting to a bank field officer or DIC portal. Complete missing requirements step-by-step.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="text-right">
              <span className="text-xs text-slate-500 font-bold block">Preparation Score</span>
              <span className="text-2xl font-black text-slate-900">{score} / {total} Items</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-black text-base">
              {percentage}%
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 mt-6 overflow-hidden">
          <div 
            className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-slate-100 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setSubTab('readiness')}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center space-x-2 ${
              subTab === 'readiness'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>10-Point Readiness Audit</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('assumptions')}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center space-x-2 ${
              subTab === 'assumptions'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Assumption Register & Sensitivity</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('startsmall')}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center space-x-2 ${
              subTab === 'startsmall'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>"Start Small" Phased Capital</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('documents')}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center space-x-2 ${
              subTab === 'documents'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Smart Document Checklist</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: 10-POINT AUDIT */}
      {subTab === 'readiness' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item, idx) => (
              <div 
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                    </div>
                    {item.status === 'complete' ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Complete</span>
                      </span>
                    ) : item.status === 'needs_validation' ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>In Progress</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200 shrink-0">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Action Needed</span>
                      </span>
                    )}
                  </div>

                  <div className="text-xs space-y-1.5 text-slate-600 pt-1">
                    <p><strong className="text-slate-800">Current Status:</strong> {item.whatIsMissing}</p>
                    <p><strong className="text-slate-800">Why It Matters:</strong> {item.whyItMatters}</p>
                    <p className="text-blue-900 bg-blue-50/60 p-2 rounded-lg border border-blue-100">
                      <strong>How to Complete:</strong> {item.howToComplete}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab(item.targetTab)}
                    className="min-h-[36px] px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
                  >
                    <span>{item.status === 'complete' ? 'Review Details' : 'Complete Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setActiveTab('dossier')}
              className="min-h-[46px] px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center space-x-2 shadow-xs"
            >
              <FileCheck className="w-4 h-4" />
              <span>Generate Bank-Ready Loan Dossier</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: ASSUMPTION REGISTER & SENSITIVITY (INNOVATION #15 & #17) */}
      {subTab === 'assumptions' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Innovation #15 & #17: Business Assumption Register</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Live Assumption Inventory & Sensitivity Drivers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              The entire simulation is transparent. Every number comes from a clear source and carries a ranked sensitivity impact.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-3 font-bold text-slate-700">Sensitivity Rank</th>
                  <th className="p-3 font-bold text-slate-700">Assumption Metric</th>
                  <th className="p-3 font-bold text-slate-700">Current Value</th>
                  <th className="p-3 font-bold text-slate-700">Evidence Source</th>
                  <th className="p-3 font-bold text-slate-700">Validation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assumptions.map(asm => (
                  <tr key={asm.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-extrabold ${
                        asm.sensitivityRank === 1 
                          ? 'bg-rose-100 text-rose-800' 
                          : asm.sensitivityRank === 2 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        #{asm.sensitivityRank}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-slate-900 block">{asm.label}</span>
                      <span className="text-[11px] text-slate-500">{asm.impactDescription}</span>
                    </td>
                    <td className="p-3 font-bold text-slate-800">
                      {asm.value}
                    </td>
                    <td className="p-3">
                      <EvidenceBadge source={asm.source} />
                    </td>
                    <td className="p-3 text-xs text-slate-600 max-w-xs">
                      {asm.howToValidate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-slate-800">
            <strong className="text-amber-900 block mb-1">Key Driver Sensitivity Analysis:</strong>
            Customer footfall has the single largest effect on your monthly surplus. A 20% drop in customers reduces monthly profit by ₹18,000, whereas a 1% increase in loan interest rate only increases your monthly EMI by ₹310. Prioritize customer demand validation over interest bargaining.
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: "START SMALL" PHASED CAPITAL (INNOVATION #35) */}
      {subTab === 'startsmall' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              "Start Small" Phased Capital Scenarios
            </h2>
            <p className="text-xs text-slate-500">
              Banks favor entrepreneurs who start lean, prove customer acceptance, and expand gradually. Compare starting as a low-cost trial vs a fully funded project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {startSmallTiers.map(tier => (
              <div 
                key={tier.id}
                className={`bg-white rounded-2xl border p-6 shadow-xs flex flex-col justify-between space-y-5 transition-all ${
                  tier.id === 'pilot' ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {tier.riskProfile}
                    </span>
                    {tier.id === 'pilot' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                        <Award className="w-3 h-3" />
                        <span>Safest Entry</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{tier.title}</h3>
                    <span className="text-xs text-slate-500 font-medium">{tier.subtitle}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Capital Needed:</span>
                      <span className="font-bold text-slate-900">{formatIndianCurrency(tier.projectCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Your Own Equity:</span>
                      <span className="font-bold text-slate-900">{formatIndianCurrency(tier.ownCapital)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Bank Loan Required:</span>
                      <span className="font-bold text-blue-700">{formatIndianCurrency(tier.loanAmount)}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200">
                      <span className="text-slate-500">Estimated Monthly EMI:</span>
                      <span className="font-extrabold text-slate-900">{formatIndianCurrency(tier.monthlyEMI)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Break-even Footfall:</span>
                      <span className="font-bold text-slate-800">{tier.breakEvenCustomers} customers/day</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Validation Focus:</strong> {tier.validationFocus}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('gramtwin')}
                  className="w-full min-h-[42px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <span>Test in Simulator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: SMART DOCUMENT CHECKLIST (INNOVATION #28) */}
      {subTab === 'documents' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Bank & DIC Statutory Document Checklist
            </h2>
            <p className="text-xs text-slate-500">
              Verified list of paperwork needed when lodging your formal loan dossier with nationalized or rural banks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            {[
              { name: 'Aadhaar Card (Applicant & Co-applicant)', status: 'Available', note: 'Primary demographic proof for DBT subsidy linkage.' },
              { name: 'PAN Card / Form 60', status: 'Available', note: 'Mandatory for bank loan account sanction above ₹50,000.' },
              { name: 'Panchayat Residence / Nativity Certificate', status: 'Available', note: 'Confirms rural location category for special rural subsidy.' },
              { name: 'Caste / Community Certificate (If claiming SC/ST/OBC/Women quota)', status: 'Needs Verification', note: 'Unlocks up to 35% subsidy under PMEGP.' },
              { name: 'Shop Rental Agreement / Land Title Document', status: 'Action Needed', note: 'Proof of designated operating location in target village.' },
              { name: 'Machinery & Equipment Proforma Quotation', status: 'Action Needed', note: 'GST invoice from authorized supplier for loan disbursement.' },
              { name: '6-Month Savings Bank Passbook Statement', status: 'Available', note: 'Demonstrates promoter equity and clean banking track record.' },
              { name: 'Detailed Project Report (DPR) / GramSahay Dossier', status: 'Generated', note: 'Our auto-compiled 18-point bank decision dossier.' }
            ].map((doc, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl border border-slate-200 flex items-start justify-between gap-3 bg-slate-50/50"
              >
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{doc.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{doc.note}</p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase shrink-0 ${
                  doc.status === 'Available' || doc.status === 'Generated' 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {doc.status}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('dossier')}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center space-x-1.5 shadow-xs"
            >
              <span>Attach Documents to Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

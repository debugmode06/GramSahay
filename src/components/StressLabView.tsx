import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { calculateStressScenarios, generateWhyNotBorrow } from '../data/innovationsData';
import { formatIndianCurrency } from '../utils/financialEngine';
import { EvidenceBadge } from './EvidenceBadge';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  TrendingDown, 
  HelpCircle, 
  ArrowRight, 
  Sliders, 
  PiggyBank, 
  ShieldCheck, 
  Zap,
  Info
} from 'lucide-react';

export const StressLabView: React.FC = () => {
  const { businessIdea, profile, competitors, setActiveTab, t } = useApp();
  
  // Interactive custom stress adjuster
  const [customDemandDrop, setCustomDemandDrop] = useState<number>(20);
  const [customCostSurge, setCustomCostSurge] = useState<number>(10);
  const [savingsBuffer, setSavingsBuffer] = useState<number>(50000);

  const scenarios = calculateStressScenarios(businessIdea, profile);
  const whyNotBorrowItems = generateWhyNotBorrow(businessIdea, profile, competitors);

  const loanAmount = profile.requiredLoan || Math.max(0, profile.projectCost - profile.ownCapital);
  const baseOperatingDays = businessIdea.operatingDays || 26;
  const basePrice = businessIdea.avgBill || 150;
  const baseMargin = 1 - (businessIdea.variableCostRatio || 0.6);
  const baseEmi = scenarios[0]?.monthlyEMI || 8700;

  // Custom interactive scenario calculation
  const stressedCustomers = Math.max(1, Math.round((businessIdea.dailyCustomers || 40) * (1 - customDemandDrop / 100)));
  const customRevenue = Math.round(stressedCustomers * basePrice * baseOperatingDays);
  const baseVarCost = customRevenue * (1 - baseMargin);
  const customOperatingCosts = Math.round((baseVarCost * (1 + customCostSurge / 100)) + ((businessIdea.fixedCosts || 14000) * (1 + customCostSurge / 100)));
  const customSurplus = Math.round(customRevenue - customOperatingCosts);
  const customPostEmi = Math.round(customSurplus - baseEmi);
  const customMonthsBuffer = baseEmi > 0 ? (savingsBuffer / baseEmi).toFixed(1) : '∞';

  const getPressureBadge = (pressure: string) => {
    switch (pressure) {
      case 'Manageable':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Manageable</span>
          </span>
        );
      case 'Tight':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Tight Financial Buffer</span>
          </span>
        );
      case 'Higher pressure':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
            <span>Higher Repayment Pressure</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Requires Validation</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-8 pb-20">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-rose-700 uppercase tracking-wider mb-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Innovation #3 & #4: Downside Stress Testing & Prudence Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Loan Stress Lab™
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              Test what happens when village market conditions become difficult. We do not claim to predict the future; we help you identify financial pressure points before signing loan documents with a bank.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <EvidenceBadge source="ESTIMATED" label="Mathematical Simulation" />
            <button
              type="button"
              onClick={() => setActiveTab('gramtwin')}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Back to GramTwin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Pulse KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Standard Monthly EMI
          </span>
          <div className="text-2xl font-black text-slate-900">
            {formatIndianCurrency(baseEmi)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            On ₹{loanAmount.toLocaleString('en-IN')} loan (5 years @ 10.5%)
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Base Case Post-EMI Surplus
          </span>
          <div className="text-2xl font-black text-emerald-700">
            {formatIndianCurrency(scenarios[0]?.postEmiSurplus || 0)}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            Comfortable in standard conditions
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            At 20% Demand Slowdown
          </span>
          <div className={`text-2xl font-black ${(scenarios[2]?.postEmiSurplus || 0) >= 0 ? 'text-amber-700' : 'text-rose-700'}`}>
            {formatIndianCurrency(scenarios[2]?.postEmiSurplus || 0)}
          </div>
          <span className="text-[11px] text-slate-600 mt-1 block">
            Surplus drops by ₹{( (scenarios[0]?.postEmiSurplus || 0) - (scenarios[2]?.postEmiSurplus || 0) ).toLocaleString('en-IN')}/mo
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Max Demand Drop Tolerated
          </span>
          <div className="text-2xl font-black text-blue-700">
            ~28%
          </div>
          <span className="text-[11px] text-slate-600 mt-1 block">
            Break-even cushion before post-EMI deficit
          </span>
        </div>
      </div>

      {/* Main 2-Column: Pre-Computed Scenarios & Custom Interactive Stresser */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Standard Stress Test Matrix (7 Cols) */}
        <div className="xl:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <TrendingDown className="w-5 h-5 text-rose-600" />
                <span>Automated Downside Matrix</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluates standard rural shocks (lean crop harvest, road repairs, price inflation).
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              9 Tested Shocks
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-3 font-bold text-slate-700">Scenario Shock</th>
                  <th className="p-3 font-bold text-slate-700 text-right">Revenue</th>
                  <th className="p-3 font-bold text-slate-700 text-right">Post-EMI Surplus</th>
                  <th className="p-3 font-bold text-slate-700 text-center">Pressure Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scenarios.map(sc => (
                  <tr key={sc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <span className="font-bold text-slate-900 block">{sc.name}</span>
                      <span className="text-[11px] text-slate-500">{sc.diagnosis}</span>
                    </td>
                    <td className="p-3 text-right font-medium text-slate-800">
                      {formatIndianCurrency(sc.monthlyRevenue)}
                    </td>
                    <td className={`p-3 text-right font-extrabold ${sc.postEmiSurplus >= 0 ? 'text-slate-900' : 'text-rose-700'}`}>
                      {formatIndianCurrency(sc.postEmiSurplus)}
                    </td>
                    <td className="p-3 text-center">
                      {getPressureBadge(sc.pressure)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              <strong>Rule of Responsible Borrowing:</strong> An indicator of <em>Higher Repayment Pressure</em> does not mean your enterprise cannot succeed; it signals that you should confirm customer demand through a small-scale pilot or retain a higher cash buffer before committing to maximum debt.
            </span>
          </div>
        </div>

        {/* Right Column: Custom Shock Simulator & Safety Buffer (5 Cols) */}
        <div className="xl:col-span-5 space-y-6">
          {/* Interactive Custom Shock */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>Interactive Shock Sandbox</span>
              </h2>
              <span className="text-xs text-slate-400">Dynamic</span>
            </div>

            {/* Demand Drop Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800">
                <span>Simulated Customer Drop:</span>
                <span className="text-rose-700 font-extrabold">-{customDemandDrop}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={customDemandDrop}
                onChange={(e) => setCustomDemandDrop(Number(e.target.value))}
                className="w-full accent-rose-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0% (Full footfall)</span>
                <span>-25%</span>
                <span>-50% (Severe slump)</span>
              </div>
            </div>

            {/* Operating Cost Inflation Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800">
                <span>Operating Expense Surge:</span>
                <span className="text-amber-700 font-extrabold">+{customCostSurge}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="5"
                value={customCostSurge}
                onChange={(e) => setCustomCostSurge(Number(e.target.value))}
                className="w-full accent-amber-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0% (Current costs)</span>
                <span>+20%</span>
                <span>+40% (Extreme inflation)</span>
              </div>
            </div>

            {/* Live Result Output */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Simulated Daily Customers:</span>
                <span className="font-bold text-slate-900">{stressedCustomers} customers/day</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Estimated Monthly Revenue:</span>
                <span className="font-bold text-slate-900">{formatIndianCurrency(customRevenue)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Total Operating Expenses:</span>
                <span className="font-bold text-slate-900">{formatIndianCurrency(customOperatingCosts)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Bank Loan EMI:</span>
                <span className="font-bold text-slate-900">{formatIndianCurrency(baseEmi)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900">Net Monthly Buffer:</span>
                <span className={`font-black text-base ${customPostEmi >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {formatIndianCurrency(customPostEmi)}
                </span>
              </div>
            </div>
          </div>

          {/* Innovation #33: Emergency Cash Safety Buffer Calculator */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <PiggyBank className="w-4 h-4 text-emerald-600" />
                <span>Emergency Cash Safety Buffer</span>
              </h2>
              <EvidenceBadge source="USER_PROVIDED" />
            </div>
            <p className="text-xs text-slate-500">
              Cash held back in your savings bank account to pay loan installments if customers face a dry spell.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Cash Kept in Reserve (Not Spent on Project):
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-slate-500 font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={savingsBuffer}
                  onChange={(e) => setSavingsBuffer(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-blue-500"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
              <span className="font-bold text-emerald-900 block flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Provides {customMonthsBuffer} Months of Pure EMI Coverage</span>
              </span>
              <p className="text-emerald-800 text-[11px]">
                If business income drops to ₹0, this reserve protects your family from loan default for {customMonthsBuffer} months.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Innovation #4: "Why Not Borrow?" Responsible Decision Engine */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Innovation #4: Responsible Decision Support</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              "Why Not Borrow Yet?" — Assumption Validation Register
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Before committing capital, verify these critical rural business assumptions. Decision support, not financial refusal.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 self-start sm:self-auto">
            {whyNotBorrowItems.length} Checklist Points
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {whyNotBorrowItems.map(item => (
            <div 
              key={item.id}
              className={`p-5 rounded-2xl border transition-all space-y-3 ${
                item.severity === 'high' 
                  ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300' 
                  : item.severity === 'medium' 
                    ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                    : 'bg-blue-50/40 border-blue-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-slate-900 text-sm leading-snug">
                  {item.concern}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase shrink-0 ${
                  item.severity === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {item.severity} priority
                </span>
              </div>

              <div className="text-xs space-y-1.5 text-slate-700">
                <p>
                  <strong className="text-slate-900">Why It Matters:</strong> {item.whyItMatters}
                </p>
                <p>
                  <strong className="text-slate-900">What to Validate First:</strong> {item.whatToValidate}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium italic">
                  Suggested Step: {item.suggestedAction}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Ready to test these assumptions with real villagers? Launch a 30-day pre-loan validation trial.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab('pilot')}
            className="min-h-[44px] px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 self-start sm:self-auto shadow-xs"
          >
            <span>Open 30-Day Pilot Validation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

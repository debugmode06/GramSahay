import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { runGramTwinSimulation, runWhatIfScenario, formatIndianCurrency } from '../utils/financialEngine';
import {
  Cpu,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  DollarSign,
  Users,
  Calendar,
  Sparkles,
  Info,
  ShieldAlert,
  BookmarkPlus,
  Trash2,
  ArrowRight,
  Layers
} from 'lucide-react';
import { TermTooltip } from './TermTooltip';
import { EvidenceBadge } from './EvidenceBadge';

export const GramTwinView: React.FC = () => {
  const { 
    profile, 
    businessIdea, 
    updateBusinessIdea, 
    savedScenarios, 
    saveScenario, 
    deleteScenario, 
    setActiveTab, 
    t 
  } = useApp();

  // Interactive slider state
  const [dailyCustomers, setDailyCustomers] = useState<number>(businessIdea.dailyCustomers || 50);
  const [avgBill, setAvgBill] = useState<number>(businessIdea.avgBill || 140);
  const [operatingDays, setOperatingDays] = useState<number>(businessIdea.operatingDays || 28);
  const [variableMargin, setVariableMargin] = useState<number>(Math.round((businessIdea.variableCostRatio || 0.55) * 100));
  const [fixedCosts, setFixedCosts] = useState<number>(businessIdea.fixedCosts || 12000);
  const [loanAmount, setLoanAmount] = useState<number>(profile.requiredLoan || 400000);
  const [interestRate, setInterestRate] = useState<number>(9.5);
  const [tenureYears, setTenureYears] = useState<number>(5);

  // Scenario saving form
  const [scenarioNameInput, setScenarioNameInput] = useState<string>('');
  const [showSaveBox, setShowSaveBox] = useState<boolean>(false);

  // What-If scenario toggle
  const [scenarioMode, setScenarioMode] = useState<'base' | 'conservative' | 'stress' | 'custom'>('base');
  const [customDemandMultiplier, setCustomDemandMultiplier] = useState<number>(1.0);
  const [customCostMultiplier, setCustomCostMultiplier] = useState<number>(1.0);

  // Calculate base GramTwin simulation
  const baseSim = runGramTwinSimulation({
    dailyCustomers,
    avgBill,
    operatingDays,
    variableMarginPercent: variableMargin,
    fixedCosts,
    loanAmount,
    interestRate,
    tenureYears
  });

  // Calculate active scenario
  let activeScenario;
  if (scenarioMode === 'conservative') {
    activeScenario = runWhatIfScenario(baseSim, 'Conservative Case (-20% Demand)', 0.8, 1.0);
  } else if (scenarioMode === 'stress') {
    activeScenario = runWhatIfScenario(baseSim, 'Severe Stress Case (-35% Demand, +15% Cost)', 0.65, 1.15);
  } else if (scenarioMode === 'custom') {
    activeScenario = runWhatIfScenario(baseSim, 'Custom What-If Scenario', customDemandMultiplier, customCostMultiplier);
  } else {
    activeScenario = runWhatIfScenario(baseSim, 'Base Case (Planned)', 1.0, 1.0);
  }

  const handleSaveCurrentScenario = (e: React.FormEvent) => {
    e.preventDefault();
    const name = scenarioNameInput.trim() || `Plan (${dailyCustomers} cust @ ₹${avgBill})`;
    saveScenario({
      name,
      customersPerDay: dailyCustomers,
      avgBill,
      operatingDays,
      marginPercent: 100 - variableMargin,
      fixedCosts,
      monthlyRevenue: baseSim.monthlyRevenue,
      monthlyCosts: baseSim.monthlyOperatingCosts,
      monthlyEMI: baseSim.monthlyEMI,
      monthlySurplus: baseSim.monthlySurplus,
      breakEven: baseSim.breakEvenCustomersPerDay
    });
    setScenarioNameInput('');
    setShowSaveBox(false);
  };

  const handleLoadSavedScenario = (sc: typeof savedScenarios[0]) => {
    setDailyCustomers(sc.customersPerDay);
    setAvgBill(sc.avgBill);
    setOperatingDays(sc.operatingDays);
    setFixedCosts(sc.fixedCosts);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Flagship Header (Complete Light Theme) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 text-slate-900 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span>GramTwin™ Digital Simulation Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {t('gramtwin.title')}
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              {t('gramtwin.subtitle')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <EvidenceBadge source="ESTIMATED" label="Live Dynamic Model" />
            <button
              type="button"
              onClick={() => setActiveTab('stresslab')}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Loan Stress Lab™</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('evolver')}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Business Evolver</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Simulation Controls</span>
            </h2>
            <span className="text-xs text-slate-500">
              Instant reactive update
            </span>
          </div>

          {/* 1. Daily Customers Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800">
              <label htmlFor="input-daily-customers" className="flex items-center space-x-1 cursor-pointer">
                <span>{t('gramtwin.customersPerDay')}</span>
                <TermTooltip termKey="breakEven" />
              </label>
              <div className="flex items-center space-x-1">
                <input
                  id="input-daily-customers"
                  type="number"
                  min="5"
                  max="300"
                  value={dailyCustomers}
                  onChange={(e) => setDailyCustomers(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-16 px-2 py-1 text-right text-sm font-bold border border-slate-300 rounded-lg text-blue-700"
                />
                <span className="text-xs text-slate-500">/day</span>
              </div>
            </div>
            <input
              type="range"
              min="5"
              max="200"
              step="1"
              value={dailyCustomers}
              onChange={(e) => setDailyCustomers(parseInt(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* 2. Average Bill Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800">
              <label htmlFor="input-avg-bill" className="flex items-center space-x-1 cursor-pointer">
                <span>{t('gramtwin.avgPurchase')}</span>
                <TermTooltip termKey="revenue" />
              </label>
              <div className="flex items-center space-x-1">
                <span className="text-slate-400">₹</span>
                <input
                  id="input-avg-bill"
                  type="number"
                  min="10"
                  max="2000"
                  value={avgBill}
                  onChange={(e) => setAvgBill(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-20 px-2 py-1 text-right text-sm font-bold border border-slate-300 rounded-lg text-blue-700"
                />
              </div>
            </div>
            <input
              type="range"
              min="20"
              max="1000"
              step="5"
              value={avgBill}
              onChange={(e) => setAvgBill(parseInt(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* 3. Monthly Operating Days Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800">
              <label htmlFor="input-operating-days" className="cursor-pointer">{t('gramtwin.operatingDays')}</label>
              <span className="text-sm font-bold text-blue-700">{operatingDays} days/month</span>
            </div>
            <input
              id="input-operating-days"
              type="range"
              min="15"
              max="30"
              step="1"
              value={operatingDays}
              onChange={(e) => setOperatingDays(parseInt(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* 4. Direct Cost per Sale (%) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800">
              <label htmlFor="input-variable-margin" className="cursor-pointer">{t('gramtwin.variableMargin')}</label>
              <span className="text-sm font-bold text-slate-900">{variableMargin}%</span>
            </div>
            <input
              id="input-variable-margin"
              type="range"
              min="20"
              max="85"
              step="1"
              value={variableMargin}
              onChange={(e) => setVariableMargin(parseInt(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block">
              Percentage of sales spent directly on purchasing raw goods (e.g. raw milk, cloth, grocery stock).
            </span>
          </div>

          {/* 5. Monthly Fixed Expenses */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800">
              <label htmlFor="input-fixed-costs" className="flex items-center space-x-1 cursor-pointer">
                <span>{t('gramtwin.fixedCosts')}</span>
                <TermTooltip termKey="operatingCost" />
              </label>
              <span className="text-sm font-bold text-slate-900">{formatIndianCurrency(fixedCosts)}</span>
            </div>
            <input
              id="input-fixed-costs"
              type="range"
              min="2000"
              max="40000"
              step="500"
              value={fixedCosts}
              onChange={(e) => setFixedCosts(parseInt(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* 6. Bank Loan & Interest */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Financing & Repayment Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Loan Needed <TermTooltip termKey="loanAmount" />
                </label>
                <input
                  type="number"
                  step="25000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Interest Rate (%) <TermTooltip termKey="interest" />
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Tenure <TermTooltip termKey="tenure" />
                </label>
                <select
                  value={tenureYears}
                  onChange={(e) => setTenureYears(parseInt(e.target.value) || 5)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold text-slate-900"
                >
                  <option value={1}>1 Year (12 mo)</option>
                  <option value={2}>2 Years (24 mo)</option>
                  <option value={3}>3 Years (36 mo)</option>
                  <option value={5}>5 Years (60 mo)</option>
                  <option value={7}>7 Years (84 mo)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Calculated Results & What-If Stress Analysis (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Result Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>{t('gramtwin.simResults')}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                Live Model
              </span>
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-600">{t('gramtwin.revenue')}:</span>
                <span className="font-bold text-slate-900">{formatIndianCurrency(baseSim.monthlyRevenue)}</span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-600">{t('gramtwin.expenses')}:</span>
                <span className="font-semibold text-slate-700">{formatIndianCurrency(baseSim.monthlyOperatingCosts)}</span>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm p-2 rounded-lg bg-amber-50 text-amber-900 font-bold">
                <span className="flex items-center">
                  {t('gramtwin.emi')} <TermTooltip termKey="emi" />
                </span>
                <span>{formatIndianCurrency(baseSim.monthlyEMI)} / mo</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    {t('gramtwin.surplus')}
                  </span>
                  <span className="text-xs text-slate-400">Cash in hand after paying bank EMI</span>
                </div>
                <span className={`text-xl sm:text-2xl font-extrabold ${baseSim.monthlySurplus > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {formatIndianCurrency(baseSim.monthlySurplus)}
                </span>
              </div>
            </div>

            {/* Break-Even Safety Callout */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-1.5">
              <div className="font-bold flex items-center space-x-1.5 text-blue-800">
                <ShieldAlert className="w-4 h-4" />
                <span>{t('gramtwin.breakEvenTitle')}</span>
              </div>
              <p className="text-blue-900 leading-relaxed">
                {t('gramtwin.breakEvenDesc')}
              </p>
              <div className="flex items-baseline space-x-2 pt-1">
                <span className="text-2xl font-extrabold text-blue-700">
                  {baseSim.breakEvenCustomersPerDay}
                </span>
                <span className="font-bold text-blue-900">{t('gramtwin.customersLabel')}</span>
                <span className="text-[11px] text-blue-600 font-medium">
                  (You expect {dailyCustomers}/day, giving +{baseSim.safetyMarginPercent}% safety margin)
                </span>
              </div>
            </div>
          </div>

          {/* What-If Stress Scenarios Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>{t('whatIf.title')}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('whatIf.subtitle')}
              </p>
            </div>

            {/* Scenario Selector Pills */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setScenarioMode('base')}
                className={`p-2.5 rounded-xl border text-left font-semibold cursor-pointer ${
                  scenarioMode === 'base' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Base Case
              </button>

              <button
                type="button"
                onClick={() => setScenarioMode('conservative')}
                className={`p-2.5 rounded-xl border text-left font-semibold cursor-pointer ${
                  scenarioMode === 'conservative' ? 'bg-amber-600 text-white border-amber-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                -20% Slowdown
              </button>

              <button
                type="button"
                onClick={() => setScenarioMode('stress')}
                className={`p-2.5 rounded-xl border text-left font-semibold cursor-pointer ${
                  scenarioMode === 'stress' ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Severe Shock (-35%)
              </button>

              <button
                type="button"
                onClick={() => setScenarioMode('custom')}
                className={`p-2.5 rounded-xl border text-left font-semibold cursor-pointer ${
                  scenarioMode === 'custom' ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Custom What-If
              </button>
            </div>

            {/* Custom slider controls if selected */}
            {scenarioMode === 'custom' && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>{t('whatIf.demandSlider')}</span>
                    <span>{Math.round(customDemandMultiplier * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="1.5"
                    step="0.05"
                    value={customDemandMultiplier}
                    onChange={(e) => setCustomDemandMultiplier(parseFloat(e.target.value))}
                    className="w-full accent-purple-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Active Scenario Comparison Box */}
            <div className="p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{activeScenario.name}</span>
                <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                  activeScenario.pressure === 'manageable'
                    ? 'bg-emerald-100 text-emerald-800'
                    : activeScenario.pressure === 'tight'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {activeScenario.pressure === 'manageable' ? t('whatIf.manageable') : activeScenario.pressure === 'tight' ? t('whatIf.tight') : t('whatIf.highPressure')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>Customers: <span className="font-bold text-slate-900">{activeScenario.customersPerDay}/day</span></div>
                <div>Monthly EMI: <span className="font-bold text-slate-900">{formatIndianCurrency(activeScenario.monthlyEMI)}</span></div>
                <div>Revenue: <span className="font-bold text-slate-900">{formatIndianCurrency(activeScenario.monthlyRevenue)}</span></div>
                <div>Take-Home: <span className={`font-bold ${activeScenario.monthlySurplus >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {formatIndianCurrency(activeScenario.monthlySurplus)}
                </span></div>
              </div>

              {activeScenario.pressure === 'highPressure' && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-medium leading-relaxed">
                  ⚠️ In this scenario, revenue drops close to break-even. Do not borrow full amount until you validate customer orders through the 30-day pilot.
                </div>
              )}
            </div>

            {/* Innovation #2: Save Snapshot Button */}
            {!showSaveBox ? (
              <button
                type="button"
                onClick={() => setShowSaveBox(true)}
                className="w-full min-h-[42px] px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <BookmarkPlus className="w-4 h-4" />
                <span>Save This Simulation as Snapshot</span>
              </button>
            ) : (
              <form onSubmit={handleSaveCurrentScenario} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-800 block">Scenario Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Plan B - 45 Customers with Tea Counter"
                  value={scenarioNameInput}
                  onChange={(e) => setScenarioNameInput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 bg-white"
                />
                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowSaveBox(false)}
                    className="px-3 py-1 text-xs text-slate-500 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                  >
                    Save Snapshot
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Innovation #2: Multi-Scenario Comparison Matrix */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Innovation #2: Saved Scenarios & Side-by-Side Analysis</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Saved Simulation Comparisons
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare your base assumptions against conservative and optimistic projections side-by-side.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 self-start sm:self-auto">
            {savedScenarios.length} Saved Profiles
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-3 font-bold text-slate-700">Scenario Name</th>
                <th className="p-3 font-bold text-slate-700 text-center">Daily Footfall</th>
                <th className="p-3 font-bold text-slate-700 text-right">Avg Ticket</th>
                <th className="p-3 font-bold text-slate-700 text-right">Monthly Revenue</th>
                <th className="p-3 font-bold text-slate-700 text-right">Bank EMI</th>
                <th className="p-3 font-bold text-slate-700 text-right">Post-EMI Surplus</th>
                <th className="p-3 font-bold text-slate-700 text-center">Break-Even</th>
                <th className="p-3 font-bold text-slate-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {savedScenarios.map((sc) => (
                <tr key={sc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-900">
                    {sc.name}
                    <span className="text-[10px] text-slate-400 font-normal block">Created {sc.createdAt}</span>
                  </td>
                  <td className="p-3 text-center font-semibold text-slate-800">
                    {sc.customersPerDay} / day
                  </td>
                  <td className="p-3 text-right font-medium text-slate-700">
                    ₹{sc.avgBill}
                  </td>
                  <td className="p-3 text-right font-bold text-slate-900">
                    {formatIndianCurrency(sc.monthlyRevenue)}
                  </td>
                  <td className="p-3 text-right font-medium text-slate-700">
                    {formatIndianCurrency(sc.monthlyEMI)}
                  </td>
                  <td className={`p-3 text-right font-extrabold ${sc.monthlySurplus >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {formatIndianCurrency(sc.monthlySurplus)}
                  </td>
                  <td className="p-3 text-center font-bold text-slate-800">
                    {sc.breakEven} cust/day
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => handleLoadSavedScenario(sc)}
                        title="Load into Simulation Sliders"
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Load
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteScenario(sc.id)}
                        title="Delete Scenario"
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

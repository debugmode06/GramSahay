import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { generateBusinessVariations, SKILL_TO_BUSINESS_MAPPINGS } from '../data/innovationsData';
import { formatIndianCurrency } from '../utils/financialEngine';
import { EvidenceBadge } from './EvidenceBadge';
import { 
  Sparkles, 
  Lightbulb, 
  Wrench, 
  ArrowRight, 
  SlidersHorizontal, 
  Check, 
  Store, 
  Truck, 
  Repeat, 
  PackageCheck,
  Milk,
  Utensils,
  Scissors,
  Sprout,
  Computer,
  Layers
} from 'lucide-react';

export const BusinessEvolverView: React.FC = () => {
  const { businessIdea, profile, competitors, updateBusinessIdea, setActiveTab } = useApp();
  
  const [activeTabSub, setActiveTabSub] = useState<'evolve' | 'skills' | 'compare'>('evolve');
  const [selectedSkill, setSelectedSkill] = useState<string>('dairy');
  
  // Side-by-side selection
  const variations = generateBusinessVariations(businessIdea, competitors);
  const [modelAIndex, setModelAIndex] = useState<number>(0);
  const [modelBIndex, setModelBIndex] = useState<number>(1);

  const modelA = variations[modelAIndex] || variations[0];
  const modelB = variations[modelBIndex] || variations[1];

  const getVariationIcon = (id: string) => {
    switch (id) {
      case 'model-delivery': return <Truck className="w-5 h-5 text-blue-600" />;
      case 'model-subscription': return <Repeat className="w-5 h-5 text-amber-600" />;
      case 'model-value-add': return <PackageCheck className="w-5 h-5 text-emerald-600" />;
      default: return <Store className="w-5 h-5 text-slate-600" />;
    }
  };

  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case 'Milk': return <Milk className="w-5 h-5 text-blue-600" />;
      case 'Utensils': return <Utensils className="w-5 h-5 text-amber-600" />;
      case 'Scissors': return <Scissors className="w-5 h-5 text-purple-600" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-rose-600" />;
      case 'Sprout': return <Sprout className="w-5 h-5 text-emerald-600" />;
      default: return <Computer className="w-5 h-5 text-cyan-600" />;
    }
  };

  const handleApplyVariationToGramTwin = (variation: typeof modelA) => {
    const newCustomers = Math.round((businessIdea.dailyCustomers || 40) * variation.customerMultiplier);
    const newBill = Math.round((businessIdea.avgBill || 150) * variation.avgBillMultiplier);
    const newFixed = Math.round((businessIdea.fixedCosts || 14000) + variation.fixedCostDelta);
    
    updateBusinessIdea({
      name: variation.title,
      dailyCustomers: newCustomers,
      avgBill: newBill,
      fixedCosts: newFixed
    });

    setActiveTab('gramtwin');
  };

  return (
    <div className="w-full space-y-8 pb-20">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Innovation #7, #8, & #18: Business Evolution & Skill Mapping</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Business Idea Evolver & Skill Engine
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
              Do not simply stick to standard retail. Adapt your proposed business around local unmet market gaps or discover high-margin rural enterprise models mapped directly to what you are good at.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <EvidenceBadge source="USER_OBSERVATION" label="Market Gap Informed" />
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-slate-100 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTabSub('evolve')}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center space-x-2 ${
              activeTabSub === 'evolve'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Idea Evolver (Market Variations)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSub('compare')}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center space-x-2 ${
              activeTabSub === 'compare'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Side-by-Side Model Comparator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSub('skills')}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center space-x-2 ${
              activeTabSub === 'skills'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Skill-to-Business Engine</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: IDEA EVOLVER (MARKET VARIATIONS) */}
      {activeTabSub === 'evolve' && (
        <div className="space-y-6">
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 text-slate-800 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-bold text-amber-900 block mb-1">
                Field Observation Context: {competitors.length} Neighboring Shops Recorded
              </span>
              <p className="text-slate-600 text-xs">
                We observed that most existing village stores only offer walk-in counter sales with fixed 9 AM - 8 PM hours. The following variations turn these observed gaps into your business advantage.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('market')}
              className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold text-xs hover:bg-amber-100 transition-colors shrink-0 cursor-pointer"
            >
              View Opportunity Radar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {variations.map((v) => (
              <div 
                key={v.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                      {getVariationIcon(v.id)}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {v.competitorsOffering === 0 ? 'Zero Competition' : `${v.competitorsOffering} Shops Do This`}
                    </span>
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900 text-base leading-snug">{v.title}</h2>
                    <span className="text-xs text-slate-500 font-medium">{v.subtitle}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {v.description}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Customer Multiplier:</span>
                      <span className="font-bold text-slate-800">{v.customerMultiplier}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Avg Bill Impact:</span>
                      <span className="font-bold text-slate-800">{v.avgBillMultiplier}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Additional Capex:</span>
                      <span className="font-bold text-slate-800">+₹{v.capexAddition.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-blue-900 bg-blue-50/70 p-2.5 rounded-xl border border-blue-100">
                    <strong>Validation Needed:</strong> {v.validationRequirement}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleApplyVariationToGramTwin(v)}
                  className="w-full min-h-[42px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <span>Simulate in GramTwin™</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: SIDE-BY-SIDE MODEL COMPARATOR (INNOVATION #18 & #32) */}
      {activeTabSub === 'compare' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Side-by-Side Business Model Comparison
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Compare two models without bias. We show factual differences, not artificial scores.
              </p>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <div>
                <label className="text-slate-500 font-semibold mr-1.5">Model A:</label>
                <select
                  value={modelAIndex}
                  onChange={(e) => setModelAIndex(Number(e.target.value))}
                  className="px-2.5 py-1 rounded-lg border border-slate-300 font-bold text-slate-800 text-xs bg-white"
                >
                  {variations.map((v, i) => (
                    <option key={v.id} value={i}>{v.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-500 font-semibold mr-1.5">Model B:</label>
                <select
                  value={modelBIndex}
                  onChange={(e) => setModelBIndex(Number(e.target.value))}
                  className="px-2.5 py-1 rounded-lg border border-slate-300 font-bold text-slate-800 text-xs bg-white"
                >
                  {variations.map((v, i) => (
                    <option key={v.id} value={i}>{v.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-3 font-bold text-slate-700 w-1/3">Evaluation Metric</th>
                  <th className="p-3 font-bold text-blue-700 w-1/3">{modelA.title}</th>
                  <th className="p-3 font-bold text-amber-700 w-1/3">{modelB.title}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-semibold text-slate-600">Core Differentiation</td>
                  <td className="p-3 text-slate-800">{modelA.differentiationFeature}</td>
                  <td className="p-3 text-slate-800">{modelB.differentiationFeature}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-600">Estimated Daily Footfall</td>
                  <td className="p-3 font-bold text-slate-900">
                    {Math.round((businessIdea.dailyCustomers || 40) * modelA.customerMultiplier)} customers/day
                  </td>
                  <td className="p-3 font-bold text-slate-900">
                    {Math.round((businessIdea.dailyCustomers || 40) * modelB.customerMultiplier)} customers/day
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-600">Average Transaction Ticket</td>
                  <td className="p-3 font-bold text-slate-900">
                    ₹{Math.round((businessIdea.avgBill || 150) * modelA.avgBillMultiplier)}
                  </td>
                  <td className="p-3 font-bold text-slate-900">
                    ₹{Math.round((businessIdea.avgBill || 150) * modelB.avgBillMultiplier)}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-600">Additional Equipment Setup</td>
                  <td className="p-3 text-slate-900">
                    {modelA.capexAddition > 0 ? `+₹${modelA.capexAddition.toLocaleString('en-IN')}` : 'Base Budget'}
                  </td>
                  <td className="p-3 text-slate-900">
                    {modelB.capexAddition > 0 ? `+₹${modelB.capexAddition.toLocaleString('en-IN')}` : 'Base Budget'}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-600">Estimated Monthly Turnover</td>
                  <td className="p-3 font-extrabold text-blue-700">
                    {formatIndianCurrency(Math.round((businessIdea.dailyCustomers || 40) * modelA.customerMultiplier * (businessIdea.avgBill || 150) * modelA.avgBillMultiplier * 26))}
                  </td>
                  <td className="p-3 font-extrabold text-amber-700">
                    {formatIndianCurrency(Math.round((businessIdea.dailyCustomers || 40) * modelB.customerMultiplier * (businessIdea.avgBill || 150) * modelB.avgBillMultiplier * 26))}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-600">Local Validation Requirement</td>
                  <td className="p-3 text-slate-600 text-xs">{modelA.validationRequirement}</td>
                  <td className="p-3 text-slate-600 text-xs">{modelB.validationRequirement}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => handleApplyVariationToGramTwin(modelA)}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs border border-blue-200 cursor-pointer"
            >
              Simulate {modelA.title}
            </button>
            <button
              type="button"
              onClick={() => handleApplyVariationToGramTwin(modelB)}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 font-bold text-xs border border-amber-200 cursor-pointer"
            >
              Simulate {modelB.title}
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: SKILL-TO-BUSINESS ENGINE (INNOVATION #8) */}
      {activeTabSub === 'skills' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                "What Are You Good At?" — Select Your Practical Skill
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose your background to see tested rural enterprise models with investment brackets and observed village gaps.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {SKILL_TO_BUSINESS_MAPPINGS.map((sm) => (
                <button
                  key={sm.skillId}
                  type="button"
                  onClick={() => setSelectedSkill(sm.skillId)}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition-all cursor-pointer ${
                    selectedSkill === sm.skillId
                      ? 'bg-blue-50 border-blue-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                    {getSkillIcon(sm.iconName)}
                  </div>
                  <span className={`text-xs font-bold line-clamp-2 ${
                    selectedSkill === sm.skillId ? 'text-blue-900' : 'text-slate-800'
                  }`}>
                    {sm.skillName}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Rendered Skill Business Models */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SKILL_TO_BUSINESS_MAPPINGS.find(s => s.skillId === selectedSkill)?.models.map(m => (
              <div 
                key={m.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Margin: {m.expectedMargin}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      Competition: {m.observedCompetition}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{m.name}</h3>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Project Cost Range:</span>
                      <span className="font-bold text-slate-900">
                        {formatIndianCurrency(m.projectCostMin)} - {formatIndianCurrency(m.projectCostMax)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Expected Customer Scale:</span>
                      <span className="font-bold text-slate-900">{m.dailyCustomersRange}</span>
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <span className="font-bold text-slate-900 block">Observed Local Gap:</span>
                    <p className="text-slate-600 leading-relaxed">{m.observedGaps}</p>
                  </div>

                  <div className="text-xs space-y-1 pt-2 border-t border-slate-100">
                    <span className="font-bold text-blue-900 block">Next Validation Step:</span>
                    <p className="text-slate-600 leading-relaxed">{m.validationStep}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    updateBusinessIdea({
                      name: m.name,
                      category: selectedSkill,
                      dailyCustomers: 35,
                      avgBill: 160
                    });
                    setActiveTab('gramtwin');
                  }}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center space-x-2 shadow-xs"
                >
                  <span>Select & Simulate in GramTwin</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

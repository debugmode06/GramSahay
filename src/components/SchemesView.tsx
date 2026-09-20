import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { evaluateSchemeEligibility } from '../utils/eligibilityEngine';
import { formatIndianCurrency } from '../utils/financialEngine';
import { Scheme, SchemeEligibilityResult } from '../types';
import {
  Coins,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  Filter,
  Layers,
  ArrowRight,
  Info,
  X
} from 'lucide-react';
import { TermTooltip } from './TermTooltip';

export const SchemesView: React.FC = () => {
  const { schemes, profile, language, t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [redirectScheme, setRedirectScheme] = useState<Scheme | null>(null);

  // Evaluate schemes deterministically
  const evaluatedSchemes = schemes.map(scheme => {
    const result = evaluateSchemeEligibility(profile, scheme);
    return { scheme, result };
  });

  const categories = ['all', 'Dairy', 'Grocery', 'Food Processing', 'Tailoring', 'Manufacturing', 'Services'];

  const filteredSchemes = evaluatedSchemes.filter(({ scheme }) => {
    if (selectedCategory === 'all') return true;
    return scheme.eligibleCategories.some(c => c.toLowerCase() === selectedCategory.toLowerCase());
  });

  const toggleCompare = (schemeId: string) => {
    if (compareList.includes(schemeId)) {
      setCompareList(compareList.filter(id => id !== schemeId));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare up to 3 schemes at a time.');
        return;
      }
      setCompareList([...compareList, schemeId]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ELIGIBLE':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            {t('schemes.eligible')}
          </span>
        );
      case 'POTENTIALLY_ELIGIBLE':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Info className="w-3.5 h-3.5 mr-1 text-blue-600" />
            {t('schemes.potentialMatch')}
          </span>
        );
      case 'NOT_ELIGIBLE':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />
            {t('schemes.notEligible')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
            {t('schemes.needsVerification')}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Title & Official Guidelines Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Government Verified Data</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t('schemes.title')}</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {t('schemes.subtitle')}
          </p>
        </div>

        {compareList.length > 0 && (
          <button
            type="button"
            onClick={() => setShowCompareModal(true)}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center space-x-2 cursor-pointer transition-colors shrink-0"
          >
            <Layers className="w-4 h-4" />
            <span>Compare ({compareList.length}) Schemes</span>
          </button>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5 mr-1" />
          Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat === 'all' ? t('schemes.filterAll') : cat}
          </button>
        ))}
      </div>

      {/* Schemes Card List */}
      <div className="space-y-5">
        {filteredSchemes.map(({ scheme, result }) => {
          const isComparing = compareList.includes(scheme.id);
          const localizedName = scheme.nativeName?.[language] || scheme.name;

          return (
            <div
              id={`scheme-card-${scheme.id}`}
              key={scheme.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm overflow-hidden p-6 transition-all"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-xs font-bold">
                      {scheme.code}
                    </span>
                    {getStatusBadge(result.status)}
                    <span className="text-xs text-slate-400 font-medium">
                      Verified {scheme.lastVerifiedDate}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    {localizedName}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
                    {scheme.purpose}
                  </p>
                </div>

                {/* Compare Checkbox */}
                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-600 cursor-pointer self-start shrink-0">
                  <input
                    type="checkbox"
                    checked={isComparing}
                    onChange={() => toggleCompare(scheme.id)}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                  <span>Compare</span>
                </label>
              </div>

              {/* Financial Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">
                    {t('schemes.maxLoan')} <TermTooltip termKey="loanAmount" />
                  </span>
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {formatIndianCurrency(scheme.maxLoanLimit)}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block font-medium">
                    {t('schemes.interestRate')} <TermTooltip termKey="interest" />
                  </span>
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {scheme.interestRateMin}% - {scheme.interestRateMax}%
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block font-medium">
                    {t('schemes.subsidy')} <TermTooltip termKey="subsidy" />
                  </span>
                  <span className="text-sm sm:text-base font-bold text-emerald-700">
                    {scheme.subsidyPercent > 0 ? `${scheme.subsidyPercent}% Subsidy` : 'Zero Capital Subsidy'}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block font-medium">
                    {t('schemes.collateral')} <TermTooltip termKey="collateral" />
                  </span>
                  <span className="text-sm sm:text-base font-bold text-blue-700">
                    {scheme.collateralRequired ? 'Collateral Required' : 'Zero Collateral'}
                  </span>
                </div>
              </div>

              {/* Why it fits & Conditions to verify */}
              <div className="py-4 space-y-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    {t('schemes.whyFit')}
                  </h3>
                  <div className="space-y-1">
                    {result.matchedConditions.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {result.failedConditions.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
                      Conditions not yet met:
                    </h3>
                    <div className="space-y-1">
                      {result.failedConditions.map((item, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-xs text-rose-700">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {scheme.caveats.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
                    <span className="font-bold">Important Caveat:</span> {scheme.caveats.join(' • ')}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500 font-medium">
                  Source: {scheme.sourceAuthority}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setRedirectScheme(scheme)}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 cursor-pointer transition-colors shadow-2xs"
                  >
                    <span>{t('schemes.continueOfficial')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* External Redirect Modal (Mandatory Point 24 of Master Prompt) */}
      {redirectScheme && (
        <div 
          id="external-portal-redirect-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-blue-700 font-bold text-sm">
                <ShieldCheck className="w-5 h-5" />
                <span>Official Government Portal Notice</span>
              </div>
              <button 
                type="button" 
                onClick={() => setRedirectScheme(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
              Proceed to {redirectScheme.code} Official Application
            </h2>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs sm:text-sm text-blue-900 mb-4 leading-relaxed">
              {t('schemes.externalNotice')}
            </div>

            <div className="space-y-2 text-xs text-slate-600 mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Destination: <span className="font-semibold text-slate-900">{redirectScheme.officialWebsite}</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Authority: <span className="font-semibold text-slate-900">{redirectScheme.sourceAuthority}</span></span>
              </div>
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Make sure to bring your GramSahay Dossier PDF for required DPR inputs.</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setRedirectScheme(null)}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <a
                href={redirectScheme.officialApplicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setRedirectScheme(null)}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center space-x-2 cursor-pointer shadow-sm"
              >
                <span>Open Government Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompareModal && (
        <div 
          id="scheme-compare-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-in fade-in"
        >
          <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold text-slate-900">{t('schemes.compareSelected')}</h2>
              <button 
                type="button" 
                onClick={() => setShowCompareModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="p-3 font-bold text-slate-700">Scheme Feature</th>
                    {compareList.map(id => {
                      const sc = schemes.find(s => s.id === id);
                      return (
                        <th key={id} className="p-3 font-bold text-blue-700 min-w-[200px]">
                          {sc?.code}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3 font-semibold text-slate-600">Full Name</td>
                    {compareList.map(id => (
                      <td key={id} className="p-3 text-slate-900 font-medium">
                        {schemes.find(s => s.id === id)?.name}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-600">Max Loan Limit</td>
                    {compareList.map(id => (
                      <td key={id} className="p-3 font-bold text-slate-900">
                        {formatIndianCurrency(schemes.find(s => s.id === id)?.maxLoanLimit)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-600">Subsidy / Assistance</td>
                    {compareList.map(id => (
                      <td key={id} className="p-3 font-bold text-emerald-700">
                        {schemes.find(s => s.id === id)?.subsidyPercent}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-600">Own Contribution Needed</td>
                    {compareList.map(id => (
                      <td key={id} className="p-3 text-slate-900">
                        {schemes.find(s => s.id === id)?.ownContributionPercent}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-600">Interest Rate Range</td>
                    {compareList.map(id => {
                      const sc = schemes.find(s => s.id === id);
                      return (
                        <td key={id} className="p-3 text-slate-900">
                          {sc?.interestRateMin}% - {sc?.interestRateMax}%
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-600">Collateral Requirement</td>
                    {compareList.map(id => (
                      <td key={id} className="p-3 text-blue-700 font-medium">
                        {schemes.find(s => s.id === id)?.collateralDescription}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCompareModal(false)}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm cursor-pointer shadow-xs transition-colors"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

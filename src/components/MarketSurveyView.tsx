import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { CompetitorShop } from '../types';
import {
  Store,
  Plus,
  Compass,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Truck,
  QrCode,
  Trash2,
  HelpCircle
} from 'lucide-react';

export const MarketSurveyView: React.FC = () => {
  const { competitors, addCompetitor, removeCompetitor, t } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [distance, setDistance] = useState('');
  const [approxDailyCustomers, setApproxDailyCustomers] = useState(50);
  const [priceLevel, setPriceLevel] = useState<'Budget' | 'Moderate' | 'Premium'>('Moderate');
  const [openingHours, setOpeningHours] = useState('7:00 AM - 8:30 PM');
  const [hasHomeDelivery, setHasHomeDelivery] = useState(false);
  const [hasDigitalPay, setHasDigitalPay] = useState(true);
  const [observedGaps, setObservedGaps] = useState('');
  const [confidence, setConfidence] = useState<'verified' | 'observed' | 'estimated' | 'unknown'>('observed');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCompetitor({
      name,
      businessType: businessType || 'General Retail',
      distance: distance || 'Within 500m',
      approxDailyCustomers,
      priceLevel,
      openingHours,
      hasHomeDelivery,
      hasDigitalPay,
      observedGaps: observedGaps || 'None recorded',
      confidence
    });

    setName('');
    setBusinessType('');
    setDistance('');
    setObservedGaps('');
    setShowAddModal(false);
  };

  const getConfidenceBadge = (conf: string) => {
    switch (conf) {
      case 'verified':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">✓ Verified Direct Inquiry</span>;
      case 'observed':
        return <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px] font-bold">👀 User Observation</span>;
      case 'estimated':
        return <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold">~ Rough Estimate</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold">? Unknown</span>;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <Store className="w-4 h-4" />
            <span>Field Intelligence</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t('market.title')}</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {t('market.subtitle')}
          </p>
        </div>

        <button
          id="add-nearby-shop-button"
          type="button"
          onClick={() => setShowAddModal(true)}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center space-x-2 cursor-pointer transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t('market.addShop')}</span>
        </button>
      </div>

      {/* Opportunity Radar Summary Banner (Complete Light Theme) */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 text-slate-900 shadow-xs">
        <div className="flex items-center space-x-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
          <Compass className="w-4 h-4 text-amber-600" />
          <span>{t('market.radarTitle')}</span>
        </div>
        <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
          Unmet Customer Needs in Your Village
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mt-1 mb-4">
          {t('market.radarSubtitle')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-white border border-amber-200/80 text-xs space-y-1 shadow-2xs">
            <span className="font-bold text-amber-900 block">1. Doorstep Delivery</span>
            <span className="text-slate-700">{t('market.gapDelivery')}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-amber-200/80 text-xs space-y-1 shadow-2xs">
            <span className="font-bold text-amber-900 block">2. Fresh Processed Products</span>
            <span className="text-slate-700">{t('market.gapQuality')}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-amber-200/80 text-xs space-y-1 shadow-2xs">
            <span className="font-bold text-amber-900 block">3. Early Morning Bus Commuters</span>
            <span className="text-slate-700">{t('market.gapHours')}</span>
          </div>
        </div>
      </div>

      {/* Observed Shops Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {competitors.map((shop) => (
          <div
            key={shop.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">{shop.name}</h3>
                  <span className="text-xs text-slate-500 font-medium">{shop.businessType}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeCompetitor(shop.id)}
                  className="text-slate-300 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-3">{getConfidenceBadge(shop.confidence)}</div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div><span className="text-slate-400">Distance:</span> {shop.distance}</div>
                <div><span className="text-slate-400">Hours:</span> {shop.openingHours}</div>
                <div><span className="text-slate-400">Footfall:</span> ~{shop.approxDailyCustomers} customers/day</div>
                <div><span className="text-slate-400">Pricing:</span> {shop.priceLevel}</div>
              </div>

              <div className="flex items-center space-x-3 mt-3 pt-2 border-t border-slate-100 text-xs">
                <span className={`inline-flex items-center space-x-1 ${shop.hasHomeDelivery ? 'text-emerald-700 font-semibold' : 'text-slate-400 line-through'}`}>
                  <Truck className="w-3.5 h-3.5" />
                  <span>Delivery</span>
                </span>
                <span className={`inline-flex items-center space-x-1 ${shop.hasDigitalPay ? 'text-blue-700 font-semibold' : 'text-slate-400'}`}>
                  <QrCode className="w-3.5 h-3.5" />
                  <span>UPI Pay</span>
                </span>
              </div>
            </div>

            {/* Observed Gaps highlight */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <span className="font-bold text-amber-950 block mb-0.5">Observed Gap / Limitation:</span>
              <span>{shop.observedGaps}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Shop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900 mb-1">{t('market.addShop')}</h2>
            <p className="text-xs text-slate-500 mb-4">Record your on-ground field observations about neighboring shops.</p>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('market.shopName')} *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('market.shopNamePlaceholder')}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('market.businessType')}</label>
                  <input
                    type="text"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    placeholder="e.g. Grocery"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('market.distance')}</label>
                  <input
                    type="text"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    placeholder="e.g. 200 meters"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Est. Daily Customers</label>
                  <input
                    type="number"
                    value={approxDailyCustomers}
                    onChange={(e) => setApproxDailyCustomers(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price Level</label>
                  <select
                    value={priceLevel}
                    onChange={(e: any) => setPriceLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm"
                  >
                    <option value="Budget">Budget</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observed Gaps / Customer Complaints</label>
                <textarea
                  rows={2}
                  value={observedGaps}
                  onChange={(e) => setObservedGaps(e.target.value)}
                  placeholder="e.g. Shuts early, doesn't sell packaged curd, long queues"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('market.confidenceLevel')}</label>
                <select
                  value={confidence}
                  onChange={(e: any) => setConfidence(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm font-semibold"
                >
                  <option value="verified">{t('market.confVerified')}</option>
                  <option value="observed">{t('market.confObservation')}</option>
                  <option value="estimated">{t('market.confEstimate')}</option>
                  <option value="unknown">{t('market.confUnknown')}</option>
                </select>
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasHomeDelivery}
                    onChange={(e) => setHasHomeDelivery(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Provides Home Delivery</span>
                </label>
                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasDigitalPay}
                    onChange={(e) => setHasDigitalPay(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Accepts UPI / QR</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
                >
                  {t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

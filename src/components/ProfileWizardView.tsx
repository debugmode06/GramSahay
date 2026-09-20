import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { formatIndianCurrency } from '../utils/financialEngine';
import {
  User,
  MapPin,
  Briefcase,
  Wrench,
  Coins,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Mic,
  Volume2
} from 'lucide-react';
import { TermTooltip } from './TermTooltip';

export const ProfileWizardView: React.FC = () => {
  const {
    profile,
    updateProfile,
    setActiveTab,
    startVoiceInput,
    isListening,
    voiceAvailable,
    t,
    guidedMode
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;

  const handleFieldChange = (field: string, value: any) => {
    updateProfile({ [field]: value });
  };

  const setRupeePreset = (field: 'ownCapital' | 'projectCost' | 'requiredLoan', amount: number) => {
    updateProfile({ [field]: amount });
  };

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Wizard Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t('profile.title')}</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {t('common.step')} {step} {t('common.of')} {totalSteps}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
            {guidedMode ? 'Guided Step-by-Step' : 'Standard View'}
          </span>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Pills for Desktop */}
        <div className="hidden sm:grid grid-cols-6 gap-2 mt-4 text-[11px] font-medium text-slate-500">
          <button onClick={() => setStep(1)} className={`text-left ${step === 1 ? 'text-blue-600 font-bold' : ''}`}>1. Basics</button>
          <button onClick={() => setStep(2)} className={`text-left ${step === 2 ? 'text-blue-600 font-bold' : ''}`}>2. Location</button>
          <button onClick={() => setStep(3)} className={`text-left ${step === 3 ? 'text-blue-600 font-bold' : ''}`}>3. Experience</button>
          <button onClick={() => setStep(4)} className={`text-left ${step === 4 ? 'text-blue-600 font-bold' : ''}`}>4. Skills</button>
          <button onClick={() => setStep(5)} className={`text-left ${step === 5 ? 'text-blue-600 font-bold' : ''}`}>5. Finance</button>
          <button onClick={() => setStep(6)} className={`text-left ${step === 6 ? 'text-blue-600 font-bold' : ''}`}>6. Subsidy</button>
        </div>
      </div>

      {/* Step Form Content */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{t('profile.step1')}</h2>
                <p className="text-xs text-slate-500">Tell us your name and age to identify your business profile.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t('profile.name')} *
              </label>
              <div className="relative">
                <input
                  id="profile-name-input"
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder={t('profile.namePlaceholder')}
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-slate-900 text-base"
                />
                {voiceAvailable && (
                  <button
                    type="button"
                    onClick={() => startVoiceInput((txt) => handleFieldChange('name', txt))}
                    className="absolute right-2 top-2 p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 cursor-pointer"
                    title={t('common.voiceSpeak')}
                  >
                    <Mic className={`w-5 h-5 ${isListening ? 'text-red-500 animate-pulse' : ''}`} />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t('profile.age')} *
              </label>
              <input
                id="profile-age-input"
                type="number"
                min="18"
                max="85"
                value={profile.age || ''}
                onChange={(e) => handleFieldChange('age', parseInt(e.target.value) || 0)}
                className="w-full sm:w-48 min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-slate-900 text-base"
              />
              <span className="text-xs text-slate-500 mt-1 block">
                Must be at least 18 years of age to sign bank credit documents.
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: Location & Village */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{t('profile.step2')}</h2>
                <p className="text-xs text-slate-500">Government schemes offer higher subsidies (up to 35%) in rural panchayats.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {t('profile.locationType')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleFieldChange('locationType', 'rural')}
                  className={`p-4 rounded-xl text-left border-2 cursor-pointer transition-all ${
                    profile.locationType === 'rural'
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900">{t('profile.rural')}</div>
                  <div className="text-xs text-slate-500 mt-1">Village Panchayat / Gram Panchayat jurisdiction.</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleFieldChange('locationType', 'semiUrban')}
                  className={`p-4 rounded-xl text-left border-2 cursor-pointer transition-all ${
                    profile.locationType === 'semiUrban'
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900">{t('profile.semiUrban')}</div>
                  <div className="text-xs text-slate-500 mt-1">Town Panchayat / Municipality area.</div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t('profile.village')} *
                </label>
                <input
                  type="text"
                  value={profile.village}
                  onChange={(e) => handleFieldChange('village', e.target.value)}
                  placeholder={t('profile.villagePlaceholder')}
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t('profile.block')}
                </label>
                <input
                  type="text"
                  value={profile.block}
                  onChange={(e) => handleFieldChange('block', e.target.value)}
                  placeholder={t('profile.blockPlaceholder')}
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t('profile.district')} *
                </label>
                <input
                  type="text"
                  value={profile.district}
                  onChange={(e) => handleFieldChange('district', e.target.value)}
                  placeholder={t('profile.districtPlaceholder')}
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {t('profile.state')} *
                </label>
                <input
                  type="text"
                  value={profile.state}
                  onChange={(e) => handleFieldChange('state', e.target.value)}
                  placeholder={t('profile.statePlaceholder')}
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Entrepreneur Status */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{t('profile.step3')}</h2>
                <p className="text-xs text-slate-500">Different schemes cater to greenfield new units vs existing shop expansions.</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleFieldChange('status', 'firstTime')}
                className={`w-full p-4 rounded-xl text-left border-2 cursor-pointer transition-all flex items-center justify-between ${
                  profile.status === 'firstTime'
                    ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-600/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="font-bold text-slate-900 text-base">{t('profile.firstTime')}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    You have never owned a registered enterprise. Eligible for PMEGP new enterprise subsidy.
                  </div>
                </div>
                {profile.status === 'firstTime' && <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => handleFieldChange('status', 'existing')}
                className={`w-full p-4 rounded-xl text-left border-2 cursor-pointer transition-all flex items-center justify-between ${
                  profile.status === 'existing'
                    ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-600/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="font-bold text-slate-900 text-base">{t('profile.existing')}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    You currently run a micro-shop or farm activity and wish to expand or modernize machinery.
                  </div>
                </div>
                {profile.status === 'existing' && <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Business Idea & Skills */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{t('profile.step4')}</h2>
                <p className="text-xs text-slate-500">Select what type of enterprise you are launching.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t('profile.category')} *
              </label>
              <select
                value={profile.category}
                onChange={(e) => handleFieldChange('category', e.target.value)}
                className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium"
              >
                <option value="Dairy">🥛 Dairy & Milk Processing</option>
                <option value="Grocery">🛒 Village Kirana & Provisions</option>
                <option value="Food Processing">🍽 Food Processing / Bakery / Snacks</option>
                <option value="Tailoring">✂ Tailoring & Readymade Garments</option>
                <option value="Agriculture">🌾 Agri-processing / Seeds & Fertilizer</option>
                <option value="Mobile Repair">📱 Mobile Repair & Electronics Service</option>
                <option value="Manufacturing">🏭 Micro-Manufacturing / Fabrication</option>
                <option value="Services">🔧 Technical Services & Others</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t('profile.businessType')} *
              </label>
              <input
                type="text"
                value={profile.businessType}
                onChange={(e) => handleFieldChange('businessType', e.target.value)}
                placeholder={t('profile.businessTypePlaceholder')}
                className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t('profile.skills')}
              </label>
              <textarea
                rows={3}
                value={profile.skills}
                onChange={(e) => handleFieldChange('skills', e.target.value)}
                placeholder={t('profile.skillsPlaceholder')}
                className="w-full p-3 rounded-xl border border-slate-300 text-slate-900 text-sm"
              />
              <span className="text-xs text-slate-400 mt-1 block">
                Banks look favorably on candidates who have prior family experience or RSETI / ITI certificates.
              </span>
            </div>
          </div>
        )}

        {/* STEP 5: Finance & Investment */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{t('profile.step5')}</h2>
                <p className="text-xs text-slate-500">Estimate how much money you have saved and how much loan you require.</p>
              </div>
            </div>

            {/* Field 1: Total Project Cost */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t('profile.projectCost')} <TermTooltip termKey="projectCost" />
                </label>
                <span className="text-sm font-bold text-slate-900">
                  {formatIndianCurrency(profile.projectCost)}
                </span>
              </div>
              <input
                type="number"
                step="10000"
                value={profile.projectCost || ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  handleFieldChange('projectCost', val);
                  handleFieldChange('requiredLoan', Math.max(0, val - profile.ownCapital));
                }}
                className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-lg font-bold"
              />
              {/* Quick Preset Chips */}
              <div className="flex flex-wrap gap-2 mt-2">
                {[100000, 200000, 500000, 1000000, 2500000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      handleFieldChange('projectCost', amt);
                      handleFieldChange('requiredLoan', Math.max(0, amt - profile.ownCapital));
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border cursor-pointer ${
                      profile.projectCost === amt ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {formatIndianCurrency(amt)}
                  </button>
                ))}
              </div>
            </div>

            {/* Field 2: Own Capital */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t('profile.ownCapital')} <TermTooltip termKey="ownContribution" />
                </label>
                <span className="text-sm font-bold text-emerald-700">
                  {formatIndianCurrency(profile.ownCapital)}
                </span>
              </div>
              <input
                type="number"
                step="10000"
                value={profile.ownCapital || ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  handleFieldChange('ownCapital', val);
                  handleFieldChange('requiredLoan', Math.max(0, profile.projectCost - val));
                }}
                className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-lg font-bold"
              />
              {/* Quick Preset Chips */}
              <div className="flex flex-wrap gap-2 mt-2">
                {[25000, 50000, 100000, 200000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      handleFieldChange('ownCapital', amt);
                      handleFieldChange('requiredLoan', Math.max(0, profile.projectCost - amt));
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border cursor-pointer ${
                      profile.ownCapital === amt ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {formatIndianCurrency(amt)}
                  </button>
                ))}
              </div>
            </div>

            {/* Field 3: Required Loan */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  {t('profile.requiredLoan')} <TermTooltip termKey="loanAmount" />
                </span>
                <span className="text-lg font-extrabold text-blue-700">
                  {formatIndianCurrency(profile.requiredLoan)}
                </span>
              </div>
              <p className="text-xs text-blue-700 mt-1">
                Calculated as Project Cost minus Own Contribution.
              </p>
            </div>
          </div>
        )}

        {/* STEP 6: Social Category & Affirmative Subsidy */}
        {step === 6 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{t('profile.step6')}</h2>
                <p className="text-xs text-slate-500">Government schemes provide enhanced subsidies for affirmative categories.</p>
              </div>
            </div>

            {/* Crucial Disclaimer banner explaining why this is asked */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
              <span className="font-bold">Why we ask this:</span> Central schemes like PMEGP give up to <span className="font-bold">35% subsidy</span> for women, SC/ST, OBC, and rural special categories compared to 25% for general. GramSahay only uses this to compute your accurate subsidy entitlement.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'general', label: t('profile.general'), desc: 'Standard 25% rural subsidy' },
                { id: 'obc', label: t('profile.obc'), desc: 'Eligible for 35% special category subsidy' },
                { id: 'scSt', label: t('profile.scSt'), desc: 'Eligible for 35% subsidy + 5% own contribution' },
                { id: 'women', label: t('profile.women'), desc: 'Eligible for 35% subsidy + Stand-Up India' },
                { id: 'minority', label: t('profile.minority'), desc: 'Eligible for 35% special category subsidy' },
                { id: 'exServicemen', label: t('profile.exServicemen'), desc: 'Special category concessions apply' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleFieldChange('specialCategory', item.id)}
                  className={`p-4 rounded-xl text-left border-2 cursor-pointer transition-all ${
                    profile.specialCategory === item.id
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900 text-sm">{item.label}</div>
                  <div className="text-xs text-slate-500 mt-1">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Wizard Controls Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
          <button
            id="wizard-back-button"
            type="button"
            disabled={step === 1}
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            className={`min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-300 font-semibold text-sm flex items-center space-x-2 ${
              step === 1 ? 'opacity-40 cursor-not-allowed text-slate-400' : 'text-slate-700 hover:bg-slate-100 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('common.back')}</span>
          </button>

          {step < totalSteps ? (
            <button
              id="wizard-next-button"
              type="button"
              onClick={() => setStep(prev => Math.min(totalSteps, prev + 1))}
              className="min-h-[44px] px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center space-x-2 cursor-pointer shadow-sm"
            >
              <span>{t('common.next')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="wizard-finish-button"
              type="button"
              onClick={() => setActiveTab('schemes')}
              className="min-h-[44px] px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center space-x-2 cursor-pointer shadow-sm"
            >
              <span>{t('common.save')} & Explore Schemes</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

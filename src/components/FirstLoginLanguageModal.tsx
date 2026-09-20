import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Language } from '../types';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const FirstLoginLanguageModal: React.FC = () => {
  const { language, setLanguage, hasChosenLanguage, setHasChosenLanguage, t } = useApp();
  const [selected, setSelected] = useState<Language>(language);

  if (hasChosenLanguage) return null;

  const options: { code: Language; name: string; native: string; subtitle: string }[] = [
    {
      code: 'ta',
      name: 'Tamil',
      native: 'தமிழ்',
      subtitle: 'கிராமப்புற வணிகம் மற்றும் அரசு கடன் வழிகாட்டி'
    },
    {
      code: 'hi',
      name: 'Hindi',
      native: 'हिन्दी',
      subtitle: 'ग्रामीण व्यवसाय एवं सरकारी ऋण योजनाएं'
    },
    {
      code: 'en',
      name: 'English',
      native: 'English',
      subtitle: 'Rural Business Decision Intelligence Platform'
    }
  ];

  const handleConfirm = () => {
    setLanguage(selected);
    setHasChosenLanguage(true);
  };

  return (
    <div 
      id="first-login-language-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lang-modal-title"
    >
      <div 
        id="first-login-language-modal-card"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 sm:p-8"
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            ₹
          </div>
          <h2 id="lang-modal-title" className="text-xl sm:text-2xl font-bold text-slate-900">
            Welcome to GramSahay
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Choose your preferred language / உங்கள் மொழியைத் தேர்ந்தெடுக்கவும் / अपनी भाषा चुनें
          </p>
        </div>

        {/* 3 Large Language Option Cards */}
        <div className="space-y-3 mb-8">
          {options.map((opt) => {
            const isSelected = selected === opt.code;
            return (
              <button
                id={`lang-choice-${opt.code}`}
                key={opt.code}
                type="button"
                onClick={() => setSelected(opt.code)}
                className={`w-full p-4 rounded-xl text-left border-2 transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-2 ring-blue-600/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="text-lg sm:text-xl font-bold text-slate-900 flex items-center space-x-2">
                    <span>{opt.native}</span>
                    <span className="text-xs font-medium text-slate-400">({opt.name})</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {opt.subtitle}
                  </div>
                </div>

                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                  isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                }`}>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Confirm */}
        <button
          id="confirm-language-selection-button"
          type="button"
          onClick={handleConfirm}
          className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-base shadow-sm flex items-center justify-center space-x-2 cursor-pointer transition-colors"
        >
          <span>
            {selected === 'ta' ? 'தொடங்கவும்' : selected === 'hi' ? 'शुरू करें' : 'Confirm & Continue'}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-center text-xs text-slate-400 mt-3">
          You can change this anytime from the top bar.
        </p>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { AssistantMessage } from '../types';
import {
  Bot,
  Send,
  Mic,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Volume2,
  ArrowRight
} from 'lucide-react';

export const AdvisorChatView: React.FC = () => {
  const {
    language,
    profile,
    businessIdea,
    schemes,
    startVoiceInput,
    stopVoiceInput,
    isListening,
    voiceAvailable,
    t
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'm_welcome',
      sender: 'assistant',
      text: t('assistant.subtitle'),
      structuredResponse: {
        answer: language === 'ta' 
          ? `வணக்கம் ${profile.name || 'நண்பரே'}, உங்கள் கிராமப்புற தொழில் திட்டம், அரசு கடன் திட்டங்கள் மற்றும் தவணை கணக்கீடு குறித்து என்னிடம் எந்த மொழியிலும் கேட்கலாம்.`
          : language === 'hi'
          ? `नमस्ते ${profile.name || 'साथी'}, आप अपने ग्रामीण व्यवसाय, सरकारी योजनाओं और मासिक किस्त के बारे में मुझसे हिंदी, तमिल या अंग्रेजी में पूछ सकते हैं।`
          : `Welcome ${profile.name || 'Entrepreneur'}. I am your GramSahay Decision Intelligence Advisor. Ask me anything about credit eligibility, scheme subsidies, competitor gaps, or simulation metrics.`,
        evidence: [
          `Profile: ${profile.village || 'Melur'}, ${profile.businessType || 'Rural Enterprise'}`,
          `Requested Financing: ₹${(profile.requiredLoan || 400000).toLocaleString('en-IN')}`
        ],
        assumptions: [
          'Initial revenue estimates based on 45-50 customers/day'
        ],
        verification: [
          'Verify with official bank branch before signing loan papers'
        ],
        nextStep: 'Test your monthly profit and repayment capacity with the GramTwin™ simulator.'
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const presetQuestions = [
    {
      label: '💰 ₹1L Dairy Start',
      query: language === 'ta' 
        ? 'ரூ.1 லட்சம் சொந்த முதலீட்டில் பால் கடை தொடங்க முடியுமா? என்ன அரசு திட்டங்கள் பொருந்தும்?'
        : language === 'hi'
        ? 'क्या ₹1 लाख अपनी बचत से डेयरी का व्यवसाय शुरू किया जा सकता है? कौन सी योजनाएं हैं?'
        : 'Can I start a dairy business with ₹1 Lakh own capital? Which schemes fit best?'
    },
    {
      label: '🏛️ PMEGP Subsidy',
      query: language === 'ta'
        ? 'கிராமப்புறத்தில் PMEGP திட்டத்தில் 35% மானியம் பெற என்ன நிபந்தனைகள் உள்ளன?'
        : language === 'hi'
        ? 'ग्रामीण क्षेत्र में PMEGP योजना में 35% सब्सिडी पाने की क्या शर्तें हैं?'
        : 'What are the exact criteria to get a 35% subsidy under PMEGP in rural areas?'
    },
    {
      label: '📉 30% Demand Drop',
      query: language === 'ta'
        ? 'கடைக்கு வரும் வாடிக்கையாளர்கள் 30% குறைந்தால் தவணை கட்ட முடியுமா?'
        : language === 'hi'
        ? 'यदि ग्राहक 30% घट जाएं तो क्या बैंक किस्त चुकाई जा सकेगी?'
        : 'If customer footfall drops by 30%, can my business still cover the monthly EMI?'
    }
  ];

  const handleSend = async (queryToSend?: string) => {
    const text = queryToSend || inputQuery;
    if (!text.trim() || isLoading) return;

    const userMsg: AssistantMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          language,
          profile,
          business: businessIdea,
          simulation: {
            monthlyEMI: 8396,
            monthlyRevenue: businessIdea.estimatedMonthlyRevenue,
            monthlyOperatingCosts: businessIdea.estimatedMonthlyOperatingCosts,
            monthlySurplus: 67804
          },
          schemes: schemes.map(s => ({
            name: s.name,
            code: s.code,
            subsidyPercent: s.subsidyPercent,
            maxLoanLimit: s.maxLoanLimit
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      const assistantMsg: AssistantMessage = {
        id: 'bot_' + Date.now(),
        sender: 'assistant',
        text: data.answer || 'Thank you for your question.',
        structuredResponse: {
          answer: data.answer || '',
          evidence: data.evidence || [],
          assumptions: data.assumptions || [],
          verification: data.verification || [],
          nextStep: data.nextStep || 'Check official guidelines on the portal.'
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Advisor request failed:', err);
      // Friendly localized offline fallback
      const assistantMsg: AssistantMessage = {
        id: 'bot_' + Date.now(),
        sender: 'assistant',
        text: 'Working in offline guidance mode.',
        structuredResponse: {
          answer: language === 'ta'
            ? `உங்கள் திட்ட செலவு ₹${(profile.projectCost || 500000).toLocaleString('en-IN')} மற்றும் கடன் ₹${(profile.requiredLoan || 400000).toLocaleString('en-IN')} அளவிற்கு PMEGP அல்லது PM முத்ரா (கிஷோர்) திட்டங்கள் சாத்தியமானவை. உங்கள் மாதாந்திர தவணை தோராயமாக ₹8,400 ஆக இருக்கும்.`
            : language === 'hi'
            ? `आपकी परियोजना लागत ₹${(profile.projectCost || 500000).toLocaleString('en-IN')} के लिए PMEGP या मुद्रा किशोर योजना उपयुक्त है। मासिक किस्त लगभग ₹8,400 होगी।`
            : `For your project cost of ₹${(profile.projectCost || 500000).toLocaleString('en-IN')}, PMEGP (with up to 35% rural subsidy) or PM MUDRA Kishore offer collateral-free credit avenues. Projected monthly EMI is approximately ₹8,400.`,
          evidence: [
            `Profile Capital: ₹${(profile.ownCapital || 100000).toLocaleString('en-IN')}`,
            `Loan Needed: ₹${(profile.requiredLoan || 400000).toLocaleString('en-IN')}`
          ],
          assumptions: [
            'Normal retail footfall in village center',
            '5-year loan tenure at 9.5% annual interest'
          ],
          verification: [
            'Confirm current interest rates with your local bank branch',
            'Verify PMEGP portal guidelines at kviconline.gov.in'
          ],
          nextStep: 'Complete the 30-Day Pre-Loan Pilot to validate actual customer orders.'
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4 pb-20">
      {/* Advisor Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{t('assistant.title')}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Available in English, தமிழ் (Tamil), and हिन्दी (Hindi).
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          ● Ready to Help
        </span>
      </div>

      {/* Preset Suggestion Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center">
          <Sparkles className="w-3 h-3 mr-1 text-amber-500" />
          Quick Questions:
        </span>
        {presetQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q.query)}
            className="min-h-[36px] px-3 py-1 rounded-xl bg-white border border-slate-200 hover:border-blue-500 text-xs font-medium text-slate-700 hover:text-blue-700 whitespace-nowrap cursor-pointer transition-colors shadow-2xs"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {msg.sender === 'user' ? (
              <div className="max-w-2xl bg-blue-600 text-white p-4 rounded-2xl rounded-tr-xs shadow-xs text-sm">
                <p>{msg.text}</p>
                <span className="text-[10px] text-blue-200 block text-right mt-1">{msg.timestamp}</span>
              </div>
            ) : (
              <div className="max-w-4xl w-full bg-white rounded-2xl rounded-tl-xs border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4 text-slate-900 text-xs sm:text-sm">
                {/* Structured Answer Card */}
                <div>
                  <h2 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>{t('assistant.answerHeader')}</span>
                  </h2>
                  <p className="text-slate-800 leading-relaxed font-medium text-sm sm:text-base">
                    {msg.structuredResponse?.answer || msg.text}
                  </p>
                </div>

                {/* Grounded Evidence */}
                {msg.structuredResponse?.evidence && msg.structuredResponse.evidence.length > 0 && (
                  <div className="pt-3 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {t('assistant.evidenceHeader')}
                    </h3>
                    <div className="space-y-1">
                      {msg.structuredResponse.evidence.map((ev, i) => (
                        <div key={i} className="flex items-start space-x-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{ev}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Assumptions */}
                {msg.structuredResponse?.assumptions && msg.structuredResponse.assumptions.length > 0 && (
                  <div className="pt-3 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {t('assistant.assumptionsHeader')}
                    </h3>
                    <div className="space-y-1">
                      {msg.structuredResponse.assumptions.map((as, i) => (
                        <div key={i} className="flex items-start space-x-2 text-xs text-slate-600">
                          <span className="text-slate-400">•</span>
                          <span>{as}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Official Verification Items */}
                {msg.structuredResponse?.verification && msg.structuredResponse.verification.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <span className="font-bold flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                      <span>{t('assistant.verificationHeader')}:</span>
                    </span>
                    {msg.structuredResponse.verification.map((v, i) => (
                      <div key={i}>• {v}</div>
                    ))}
                  </div>
                )}

                {/* Recommended Next Step */}
                {msg.structuredResponse?.nextStep && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-blue-700 font-bold">
                    <span className="flex items-center space-x-1.5">
                      <ArrowRight className="w-4 h-4 text-blue-600" />
                      <span>Next Step: {msg.structuredResponse.nextStep}</span>
                    </span>
                  </div>
                )}

                <span className="text-[10px] text-slate-400 block pt-1 border-t border-slate-100">
                  {msg.timestamp}
                </span>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 p-4 bg-white rounded-2xl border border-slate-200 w-fit animate-pulse">
            <Bot className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-medium text-slate-500">
              GramSahay Advisor is analyzing your question...
            </span>
          </div>
        )}
      </div>

      {/* Input Bar with Speech Recognition Button */}
      <div className="sticky bottom-16 sm:bottom-4 bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-300 shadow-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          {voiceAvailable && (
            <button
              id="chat-voice-button"
              type="button"
              onClick={() => {
                if (isListening) {
                  stopVoiceInput();
                } else {
                  startVoiceInput((transcript) => {
                    setInputQuery(transcript);
                    handleSend(transcript);
                  });
                }
              }}
              className={`min-w-[44px] min-h-[44px] p-2.5 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title={t('common.voiceSpeak')}
            >
              <Mic className="w-5 h-5" />
            </button>
          )}

          <input
            id="chat-query-input"
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={t('assistant.placeholder')}
            className="flex-1 min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-slate-900 text-xs sm:text-sm"
          />

          <button
            id="chat-send-button"
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="min-w-[44px] min-h-[44px] px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <span>{t('assistant.send')}</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
        {isListening && (
          <div className="text-center text-xs text-red-600 font-semibold mt-1 animate-pulse">
            {t('common.voiceListening')}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { HelpCircle, X } from 'lucide-react';

interface TermTooltipProps {
  termKey: string;
  className?: string;
}

export const TermTooltip: React.FC<TermTooltipProps> = ({ termKey, className = '' }) => {
  const { getTerm, simpleLanguage } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const { name, desc } = getTerm(termKey);

  return (
    <span className={`inline-flex items-center align-middle ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center text-slate-400 hover:text-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-full p-0.5 ml-1 cursor-pointer transition-colors"
        title={`Explain ${name}`}
        aria-label={`Explain ${name}`}
      >
        <HelpCircle className="w-3.5 h-3.5 text-blue-500/80" />
      </button>

      {isOpen && (
        <span 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs sm:absolute sm:inset-auto sm:z-30 sm:bg-transparent sm:backdrop-blur-none"
          onClick={() => setIsOpen(false)}
        >
          <span 
            className="block max-w-xs w-full bg-white text-slate-800 p-3.5 rounded-xl shadow-xl text-left text-xs border border-slate-200 animate-in fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="flex items-center justify-between pb-1.5 border-b border-slate-100 mb-2">
              <span className="font-bold text-blue-700">{name}</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
            <span className="text-slate-600 leading-relaxed block">
              {desc}
            </span>
            <span className="mt-2 block text-[10px] text-slate-400 font-medium">
              {simpleLanguage ? '✓ Conversational Simple Mode' : 'Standard Definition'}
            </span>
          </span>
        </span>
      )}
    </span>
  );
};

import React from 'react';
import { EvidenceSource } from '../types';
import { ShieldCheck, UserCheck, Eye, Calculator, Bot, AlertTriangle, HelpCircle } from 'lucide-react';

interface EvidenceBadgeProps {
  source: EvidenceSource;
  label?: string;
  className?: string;
}

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({ source, label, className = '' }) => {
  switch (source) {
    case 'VERIFIED':
      return (
        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 ${className}`}>
          <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
          <span>{label || 'Verified Rule Match'}</span>
        </span>
      );
    case 'USER_PROVIDED':
      return (
        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 ${className}`}>
          <UserCheck className="w-3 h-3 text-blue-600 shrink-0" />
          <span>{label || 'User Provided'}</span>
        </span>
      );
    case 'USER_OBSERVATION':
      return (
        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 ${className}`}>
          <Eye className="w-3 h-3 text-amber-600 shrink-0" />
          <span>{label || 'Field Observation'}</span>
        </span>
      );
    case 'ESTIMATED':
      return (
        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300 ${className}`}>
          <Calculator className="w-3 h-3 text-slate-500 shrink-0" />
          <span>{label || 'Estimated Model'}</span>
        </span>
      );
    case 'AI_INFERENCE':
      return (
        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 ${className}`}>
          <Bot className="w-3 h-3 text-purple-600 shrink-0" />
          <span>{label || 'AI Synthesis'}</span>
        </span>
      );
    case 'REQUIRES_VERIFICATION':
      return (
        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200 ${className}`}>
          <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
          <span>{label || 'Requires Validation'}</span>
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200 ${className}`}>
          <HelpCircle className="w-3 h-3 text-slate-400 shrink-0" />
          <span>{label || 'Unverified'}</span>
        </span>
      );
  }
};

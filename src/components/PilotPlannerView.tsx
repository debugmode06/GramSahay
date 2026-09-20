import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Edit3,
  Users,
  Repeat
} from 'lucide-react';

export const PilotPlannerView: React.FC = () => {
  const { pilotMilestones, togglePilotMilestone, t } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');

  const completedCount = pilotMilestones.filter(m => m.completed).length;
  const progressPercent = Math.round((completedCount / pilotMilestones.length) * 100);

  const startEditNotes = (id: string, currentNotes: string) => {
    setEditingId(id);
    setTempNotes(currentNotes);
  };

  const saveNotes = (id: string) => {
    togglePilotMilestone(id, tempNotes);
    setEditingId(null);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <CalendarCheck className="w-4 h-4" />
            <span>Pre-Loan Validation</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t('pilot.title')}</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {t('pilot.subtitle')}
          </p>
        </div>

        {/* Progress Badge */}
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center space-x-4 shrink-0">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
              Validation Confidence
            </span>
            <span className="text-xl font-extrabold text-emerald-700">
              {progressPercent}% Feasible
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center font-bold text-emerald-800 text-sm">
            {completedCount}/{pilotMilestones.length}
          </div>
        </div>
      </div>

      {/* 4 Weekly Step Cards */}
      <div className="space-y-4">
        {pilotMilestones.map((milestone) => (
          <div
            key={milestone.id}
            className={`p-6 rounded-2xl border transition-all ${
              milestone.completed
                ? 'bg-white border-emerald-300 shadow-xs ring-1 ring-emerald-500/20'
                : 'bg-white border-slate-200 shadow-2xs'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    milestone.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    Week {milestone.week}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Target: {milestone.achievedCount} / {milestone.targetCount} contacts
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {t(milestone.titleKey)}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t(milestone.descriptionKey)}
                </p>
              </div>

              {/* Toggle Completion Button */}
              <button
                type="button"
                onClick={() => togglePilotMilestone(milestone.id)}
                className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 cursor-pointer transition-colors shrink-0 ${
                  milestone.completed
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{milestone.completed ? 'Completed' : t('pilot.markCompleted')}</span>
              </button>
            </div>

            {/* Observation Notes */}
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
              {editingId === milestone.id ? (
                <div className="space-y-2">
                  <label className="font-bold text-slate-700">Update Field Notes:</label>
                  <textarea
                    rows={2}
                    value={tempNotes}
                    onChange={(e) => setTempNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs"
                  />
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => saveNotes(milestone.id)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs"
                    >
                      Save Notes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-700 block mb-0.5">Entrepreneur Field Observations:</span>
                    <span className="text-slate-600 italic leading-relaxed">
                      "{milestone.userObservations || 'No observation notes recorded yet.'}"
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => startEditNotes(milestone.id, milestone.userObservations)}
                    className="text-blue-600 hover:text-blue-800 p-1 cursor-pointer"
                    title="Edit Field Notes"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

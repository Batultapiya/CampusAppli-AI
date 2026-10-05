import React, { useState } from 'react';
import { APPLICATION_TYPES } from '../utils/constants';
import { ApplicationTypeId } from '../types';
import { User, Users, GraduationCap, Building, ArrowRight, CheckCircle2 } from 'lucide-react';

interface StepTypeProps {
  selectedType: ApplicationTypeId;
  onSelect: (type: ApplicationTypeId) => void;
  onNext: () => void;
}

export const StepType: React.FC<StepTypeProps> = ({ selectedType, onSelect, onNext }) => {
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'faculty'>('all');

  const filtered = APPLICATION_TYPES.filter((item) => {
    if (filterRole === 'student') return item.senderRole === 'student';
    if (filterRole === 'faculty') return item.senderRole !== 'student';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Step Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Select Application Type
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Choose who is submitting the application and who will receive it.
            </p>
          </div>

          {/* Role Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setFilterRole('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterRole === 'all'
                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Types (6)
            </button>
            <button
              type="button"
              onClick={() => setFilterRole('student')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterRole === 'student'
                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Student Sender
            </button>
            <button
              type="button"
              onClick={() => setFilterRole('faculty')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterRole === 'faculty'
                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Faculty / GFM Sender
            </button>
          </div>
        </div>
      </div>

      {/* Grid of 6 Application Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const isSelected = selectedType === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/40 shadow-sm ring-1 ring-indigo-600/30'
                  : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.senderRole === 'student' ? (
                      <GraduationCap className="w-5 h-5" />
                    ) : item.senderRole === 'faculty' ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <Users className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {item.label}
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      {item.senderTitle} → {item.receiverTitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 fill-indigo-100" />
                  )}
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>

              {/* Addressing format preview */}
              <div className="mt-3.5 pt-3 border-t border-slate-100/90 text-[11px] font-mono text-slate-600 bg-slate-50/80 p-2 rounded-lg">
                <span className="text-slate-400 block text-[10px] uppercase font-sans font-semibold">
                  Official Addressing Format:
                </span>
                <span className="text-slate-700 font-semibold">To,</span>
                <br />
                <span className="text-indigo-800">{item.receiverTitle}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="mt-8 flex items-center justify-between pt-5 border-t border-slate-200">
        <p className="text-xs text-slate-500">
          Selected: <strong className="text-slate-800 font-semibold">{APPLICATION_TYPES.find(t => t.id === selectedType)?.label}</strong>
        </p>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] text-sm"
        >
          <span>Continue to Purpose</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

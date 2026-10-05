import React, { useState } from 'react';
import { REASON_CATEGORIES, getSmartSubject } from '../utils/constants';
import { CategoryId } from '../types';
import {
  CalendarDays,
  FileCheck,
  GraduationCap,
  Briefcase,
  Trophy,
  Layers,
  Search,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  PenTool,
} from 'lucide-react';

interface StepPurposeProps {
  selectedCategory: CategoryId;
  selectedReason: string;
  customReason: string;
  onSelectCategory: (category: CategoryId) => void;
  onSelectReason: (reason: string) => void;
  onChangeCustomReason: (val: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const StepPurpose: React.FC<StepPurposeProps> = ({
  selectedCategory,
  selectedReason,
  customReason,
  onSelectCategory,
  onSelectReason,
  onChangeCustomReason,
  onNext,
  onPrev,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const getCategoryIcon = (id: CategoryId) => {
    switch (id) {
      case 'leave_attendance':
        return <CalendarDays className="w-4 h-4" />;
      case 'certificates_docs':
        return <FileCheck className="w-4 h-4" />;
      case 'academic':
        return <GraduationCap className="w-4 h-4" />;
      case 'internship_career':
        return <Briefcase className="w-4 h-4" />;
      case 'events_activities':
        return <Trophy className="w-4 h-4" />;
      case 'other':
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  // If user is searching across all reasons
  const allReasonsFlattened = REASON_CATEGORIES.flatMap((c) =>
    c.reasons.map((r) => ({ reason: r, categoryId: c.id, categoryLabel: c.label }))
  );

  const filteredReasons = searchQuery.trim()
    ? allReasonsFlattened.filter((item) =>
        item.reason.toLowerCase().includes(searchQuery.toLowerCase().trim())
      )
    : REASON_CATEGORIES.find((c) => c.id === selectedCategory)?.reasons.map((r) => ({
        reason: r,
        categoryId: selectedCategory,
        categoryLabel: REASON_CATEGORIES.find((c) => c.id === selectedCategory)?.label || '',
      })) || [];

  const handleReasonClick = (reason: string, catId: CategoryId) => {
    setErrorMsg('');
    onSelectCategory(catId);
    onSelectReason(reason);
  };

  const handleContinue = () => {
    if (!selectedReason) {
      setErrorMsg('Please select a purpose/reason for the application.');
      return;
    }
    if (selectedReason === 'Other' && !customReason.trim()) {
      setErrorMsg('Please enter your specific reason in the text box below.');
      return;
    }
    setErrorMsg('');
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Select Application Purpose
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Pick the category and reason. The generator adapts the formal language accordingly.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-5">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search reasons (e.g. sick leave, bonafide, internship, workshop, fee)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Pills (Visible when not actively searching) */}
      {!searchQuery && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
          {REASON_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onSelectCategory(cat.id);
                  setErrorMsg('');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {cat.reasons.length}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Reason Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredReasons.map((item) => {
          const isSelected = selectedReason === item.reason;
          return (
            <div
              key={item.reason}
              onClick={() => handleReasonClick(item.reason, item.categoryId)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600/30'
                  : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-semibold text-slate-900 leading-snug">
                  {item.reason}
                </span>
                {isSelected ? (
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0" />
                )}
              </div>

              {searchQuery && (
                <span className="mt-2 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  {item.categoryLabel}
                </span>
              )}

              {/* Sample auto-subject preview */}
              <div className="mt-2 text-[11px] text-slate-500 line-clamp-1 italic">
                {getSmartSubject(item.reason)}
              </div>
            </div>
          );
        })}
      </div>

      {filteredReasons.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-sm text-slate-600">No matching reasons found for "{searchQuery}".</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              onSelectCategory('other');
              onSelectReason('Other');
            }}
            className="mt-3 text-xs font-semibold text-indigo-600 hover:underline inline-flex items-center gap-1"
          >
            <PenTool className="w-3.5 h-3.5" />
            Switch to Custom "Other" Reason
          </button>
        </div>
      )}

      {/* If "Other" is chosen: Show custom text box as required in section 4 */}
      {selectedReason === 'Other' && (
        <div className="mt-5 p-4 rounded-xl bg-amber-50/60 border border-amber-200 animate-in fade-in duration-200">
          <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5">
            Specify Your Custom Reason / Purpose *
          </label>
          <input
            type="text"
            value={customReason}
            onChange={(e) => {
              onChangeCustomReason(e.target.value);
              setErrorMsg('');
            }}
            placeholder="e.g. Permission for attending blood donation camp, Gymkhana sports equipment requisition..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-amber-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
            autoFocus
          />
          <p className="mt-1 text-[11px] text-amber-800">
            AI will format your specific purpose into a proper official academic request.
          </p>
        </div>
      )}

      {/* Error message */}
      {errorMsg && (
        <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-800">
          {errorMsg}
        </div>
      )}

      {/* Navigation Footer */}
      <div className="mt-8 flex items-center justify-between pt-5 border-t border-slate-200">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Type</span>
        </button>

        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] text-sm"
        >
          <span>Continue to Details</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

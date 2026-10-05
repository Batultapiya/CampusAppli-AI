import React from 'react';
import { ApplicationFormData } from '../types';
import { APPLICATION_TYPES } from '../utils/constants';
import { formatFormalDate } from '../utils/templateEngine';
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Building,
  User,
  FileText,
  Sliders,
  Loader2,
} from 'lucide-react';

interface StepSummaryProps {
  formData: ApplicationFormData;
  baseTemplate: string;
  isGenerating: boolean;
  onGenerate: () => void;
  onPrev: () => void;
  onChangeTone: (tone: 'formal' | 'polite' | 'urgent') => void;
}

export const StepSummary: React.FC<StepSummaryProps> = ({
  formData,
  baseTemplate,
  isGenerating,
  onGenerate,
  onPrev,
  onChangeTone,
}) => {
  const typeObj = APPLICATION_TYPES.find((t) => t.id === formData.applicationType);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
          <span>Ready to Generate</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Review & Build Application
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
          We will combine your details, the official college template, and AI personalization to create a ready-to-submit letter.
        </p>
      </div>

      {/* Summary Review Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
          <span>Application Summary</span>
          <span className="text-indigo-600 font-semibold">{typeObj?.label}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {/* Sender */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 block font-medium">Applicant / Sender</span>
            <span className="font-semibold text-slate-900">{formData.senderName}</span>
            <div className="text-xs text-slate-600 mt-0.5">
              Roll No / ID: <span className="font-mono">{formData.senderId}</span>
              {formData.division ? ` • Div ${formData.division}` : ''}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">{formData.department}</div>
          </div>

          {/* Receiver & College */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 block font-medium">Addressed To</span>
            <span className="font-semibold text-slate-900">{typeObj?.receiverTitle}</span>
            {formData.receiverName && (
              <div className="text-xs text-indigo-700 font-medium">{formData.receiverName}</div>
            )}
            <div className="text-xs text-slate-500 mt-0.5">{formData.collegeName}</div>
          </div>

          {/* Reason & Subject */}
          <div className="sm:col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Purpose & Reason</span>
              <span className="text-xs font-semibold text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded">
                {formData.reason}
              </span>
            </div>
            <div className="font-semibold text-slate-900 mt-1">
              {formData.subject || 'Application Request'}
            </div>
            {formData.startDate && (
              <div className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Dates: {formatFormalDate(formData.startDate)}
                  {formData.endDate ? ` to ${formatFormalDate(formData.endDate)}` : ''}
                  {formData.numberOfDays ? ` (${formData.numberOfDays} days)` : ''}
                </span>
              </div>
            )}
            {formData.additionalDetails && (
              <div className="text-xs text-slate-500 mt-1.5 bg-white p-2 rounded border border-slate-200/60 italic line-clamp-2">
                "{formData.additionalDetails}"
              </div>
            )}
          </div>
        </div>

        {/* Tone Selector */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-700">Writing Tone:</span>
          </div>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'formal', label: 'Standard Formal' },
              { id: 'polite', label: 'Polite & Courteous' },
              { id: 'urgent', label: 'Urgent / Priority' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onChangeTone(t.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  formData.tone === t.id
                    ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Prominent Action Button */}
      <div className="text-center space-y-3">
        <button
          type="button"
          disabled={isGenerating}
          onClick={onGenerate}
          className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-700 hover:to-violet-800 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base sm:text-lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating Official Application...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Application</span>
            </>
          )}
        </button>

        <p className="text-xs text-slate-500">
          The application will be formatted into an official printable A4 document ready to edit, copy, print, or download.
        </p>
      </div>

      {/* Navigation Footer */}
      <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between">
        <button
          type="button"
          disabled={isGenerating}
          onClick={onPrev}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Details</span>
        </button>
      </div>
    </div>
  );
};

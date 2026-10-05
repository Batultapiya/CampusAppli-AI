import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
  completedSteps: number[];
}

const STEPS = [
  { step: 1, title: 'Type', subtitle: 'Sender & Receiver' },
  { step: 2, title: 'Purpose', subtitle: 'Reason & Category' },
  { step: 3, title: 'Your Details', subtitle: 'Student / Faculty Info' },
  { step: 4, title: 'App Details', subtitle: 'Dates & Subject' },
  { step: 5, title: 'Generate', subtitle: 'Review & Build' },
];

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  onStepClick,
  completedSteps,
}) => {
  return (
    <div className="w-full bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Desktop view */}
        <div className="hidden sm:flex items-center justify-between">
          {STEPS.map((item, index) => {
            const isCompleted = completedSteps.includes(item.step);
            const isCurrent = currentStep === item.step;
            const isClickable = isCompleted || item.step < currentStep;

            return (
              <React.Fragment key={item.step}>
                <button
                  type="button"
                  disabled={!isClickable && !isCurrent}
                  onClick={() => isClickable && onStepClick(item.step)}
                  className={`flex items-center gap-2.5 text-left transition-all ${
                    isClickable ? 'cursor-pointer' : isCurrent ? 'cursor-default' : 'cursor-not-allowed opacity-50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-sm ring-4 ring-indigo-100'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isCompleted && !isCurrent ? <Check className="w-4 h-4 stroke-[3]" /> : item.step}
                  </div>
                  <div>
                    <div
                      className={`text-xs font-semibold ${
                        isCurrent
                          ? 'text-indigo-600'
                          : isCompleted
                          ? 'text-slate-800'
                          : 'text-slate-500'
                      }`}
                    >
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 hidden md:block">
                      {item.subtitle}
                    </div>
                  </div>
                </button>

                {index < STEPS.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Mobile View */}
        <div className="sm:hidden flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
              {currentStep}
            </span>
            <div>
              <span className="text-xs font-bold text-slate-900">
                {STEPS[currentStep - 1]?.title}
              </span>
              <span className="text-[11px] text-slate-500 ml-1.5">
                (Step {currentStep} of {STEPS.length})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {STEPS.map((s) => (
              <span
                key={s.step}
                className={`h-1.5 rounded-full transition-all ${
                  s.step === currentStep
                    ? 'w-6 bg-indigo-600'
                    : s.step < currentStep
                    ? 'w-2 bg-emerald-500'
                    : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

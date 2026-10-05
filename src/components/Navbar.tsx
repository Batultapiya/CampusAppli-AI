import React from 'react';
import { GraduationCap, History, Building2, Sparkles, PlusCircle } from 'lucide-react';

interface NavbarProps {
  onOpenHistory: () => void;
  onOpenProfile: () => void;
  onStartNew: () => void;
  historyCount: number;
  hasSavedProfile: boolean;
  isAiActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenHistory,
  onOpenProfile,
  onStartNew,
  historyCount,
  hasSavedProfile,
  isAiActive,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={onStartNew}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 tracking-tight text-base sm:text-lg">
                College Application Generator
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                AI + Smart Templates
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Formal letters & applications for students and faculty
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onStartNew}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            New Application
          </button>

          <button
            onClick={onOpenProfile}
            className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            title="Manage saved student/college profile for autofill"
          >
            <Building2 className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">College Profile</span>
            {hasSavedProfile && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Profile saved" />
            )}
          </button>

          <button
            onClick={onOpenHistory}
            className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            title="View saved application history"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-semibold rounded-full bg-indigo-100 text-indigo-800">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

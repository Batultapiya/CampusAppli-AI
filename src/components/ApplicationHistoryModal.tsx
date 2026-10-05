import React, { useState } from 'react';
import { SavedApplicationRecord } from '../types';
import { APPLICATION_TYPES } from '../utils/constants';
import { formatFormalDate } from '../utils/templateEngine';
import { exportApplicationToPDF } from '../utils/pdfGenerator';
import {
  X,
  History,
  Copy,
  Download,
  Trash2,
  ExternalLink,
  Search,
  Check,
  Calendar,
  Sparkles,
  FileCheck2,
} from 'lucide-react';

interface ApplicationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: SavedApplicationRecord[];
  onOpenApplication: (record: SavedApplicationRecord) => void;
  onDeleteApplication: (id: string) => void;
  onClearHistory: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ApplicationHistoryModal: React.FC<ApplicationHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onOpenApplication,
  onDeleteApplication,
  onClearHistory,
  onShowToast,
}) => {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = history.filter((item) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      item.subject?.toLowerCase().includes(q) ||
      item.reason?.toLowerCase().includes(q) ||
      item.senderName?.toLowerCase().includes(q) ||
      item.department?.toLowerCase().includes(q) ||
      item.collegeName?.toLowerCase().includes(q)
    );
  });

  const handleCopy = async (record: SavedApplicationRecord) => {
    try {
      await navigator.clipboard.writeText(record.content);
      setCopiedId(record.id);
      onShowToast('Application copied successfully.', 'success');
      setTimeout(() => setCopiedId(null), 2500);
    } catch (e) {
      onShowToast('Failed to copy to clipboard', 'error');
    }
  };

  const handleDownload = (record: SavedApplicationRecord) => {
    exportApplicationToPDF(record.content, {
      fileName: record.subject || 'Saved_College_Application',
      collegeName: record.collegeName,
      subject: record.subject,
      includeCollegeHeader: true,
    });
    onShowToast('PDF downloaded successfully.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Application History</h3>
              <p className="text-xs text-slate-500">
                Previously generated applications saved on this browser
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by subject, reason, or name..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {history.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all saved history?')) {
                  onClearHistory();
                  onShowToast('Application history cleared.', 'info');
                }
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline px-2 py-1"
            >
              Clear All History
            </button>
          )}
        </div>

        {/* List of Applications */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">No applications saved yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Generated applications are automatically saved here for quick re-use.
              </p>
            </div>
          ) : (
            filtered.map((item) => {
              const typeObj = APPLICATION_TYPES.find((t) => t.id === item.applicationType);
              const formattedDate = formatFormalDate(item.createdAt);

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                        {typeObj?.label || item.applicationType}
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {item.reason}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formattedDate}
                      </span>
                      {item.usedAI && (
                        <span className="text-[10px] text-purple-600 flex items-center gap-0.5 font-medium">
                          <Sparkles className="w-3 h-3" /> AI
                        </span>
                      )}
                    </div>

                    <h4 className="font-semibold text-slate-900 text-sm truncate">
                      {item.subject || 'Application Letter'}
                    </h4>

                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {item.senderName} • {item.department} • {item.collegeName}
                    </p>
                  </div>

                  {/* Actions for this history record */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      onClick={() => onOpenApplication(item)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center gap-1"
                      title="Open in Document View / Editor"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open</span>
                    </button>

                    <button
                      onClick={() => handleCopy(item)}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                      title="Copy application text"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleDownload(item)}
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                      title="Download as PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm('Delete this saved application?')) {
                          onDeleteApplication(item.id);
                          onShowToast('Application deleted from history.', 'info');
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>{filtered.length} application(s) saved</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import {
  Copy,
  Download,
  Printer,
  RotateCcw,
  Edit3,
  Check,
  PlusCircle,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Undo2,
  Redo2,
  Type,
  FileCheck2,
} from 'lucide-react';
import { exportApplicationToPDF } from '../utils/pdfGenerator';
import { ApplicationFormData } from '../types';

interface ApplicationPreviewProps {
  content: string;
  originalGeneratedContent: string;
  formData: ApplicationFormData;
  usedAI: boolean;
  onContentChange: (newContent: string) => void;
  onRegenerate: () => void;
  onStartNew: () => void;
  onCopySuccess: () => void;
  isRegenerating: boolean;
}

export const ApplicationPreview: React.FC<ApplicationPreviewProps> = ({
  content,
  originalGeneratedContent,
  formData,
  usedAI,
  onContentChange,
  onRegenerate,
  onStartNew,
  onCopySuccess,
  isRegenerating,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [lineSpacing, setLineSpacing] = useState<'tight' | 'normal' | 'relaxed'>('normal');

  // History for undo/redo
  const [history, setHistory] = useState<string[]>([content]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextChange = (newVal: string) => {
    onContentChange(newVal);
    // Push to undo stack if different
    if (newVal !== history[historyIndex]) {
      const updated = history.slice(0, historyIndex + 1);
      updated.push(newVal);
      setHistory(updated);
      setHistoryIndex(updated.length - 1);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      onContentChange(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      onContentChange(next);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      onCopySuccess();
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleDownloadPDF = () => {
    exportApplicationToPDF(content, {
      fileName: formData.subject || 'College_Application',
      collegeName: formData.collegeName,
      subject: formData.subject,
      includeCollegeHeader: true,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetToGenerated = () => {
    if (window.confirm('Reset all your edits back to the originally generated text?')) {
      handleTextChange(originalGeneratedContent);
    }
  };

  // Font size classes
  const fontSizeClasses = {
    small: 'text-[13px] leading-relaxed',
    medium: 'text-[15px] leading-relaxed',
    large: 'text-[17px] leading-loose',
  };

  // Line spacing classes
  const lineSpacingClasses = {
    tight: 'leading-snug',
    normal: 'leading-relaxed',
    relaxed: 'leading-loose',
  };

  // Text alignment classes
  const textAlignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Top Banner / Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Application Preview
            </h2>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                usedAI
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {usedAI ? (
                <>
                  <Sparkles className="w-3 h-3 text-purple-500" />
                  AI Personalized
                </>
              ) : (
                <>
                  <FileCheck2 className="w-3 h-3 text-emerald-500" />
                  Verified Formal Template
                </>
              )}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review your formatted college letter below. You can edit, copy, print, or download as official PDF.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onStartNew}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <PlusCircle className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Start New</span>
          </button>

          <button
            type="button"
            disabled={isRegenerating}
            onClick={onRegenerate}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-50"
          >
            <RotateCcw className={`w-4 h-4 text-slate-500 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-2xs ${
              isEditing
                ? 'bg-indigo-600 text-white shadow-indigo-600/20'
                : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'Done Editing' : 'Edit Letter'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-600" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-600/20"
          >
            <Download className="w-4 h-4" />
            <span>Download as PDF</span>
          </button>
        </div>
      </div>

      {/* Editor Toolbar (When Edit mode is active) */}
      {isEditing && (
        <div className="mb-4 p-3 bg-white rounded-xl border border-indigo-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center gap-2">
            {/* Font Family */}
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
              <button
                type="button"
                onClick={() => setFontFamily('serif')}
                className={`px-2 py-1 rounded font-serif ${
                  fontFamily === 'serif' ? 'bg-white shadow-2xs font-semibold text-indigo-700' : 'text-slate-600'
                }`}
              >
                Garamond (Formal)
              </button>
              <button
                type="button"
                onClick={() => setFontFamily('sans')}
                className={`px-2 py-1 rounded font-sans ${
                  fontFamily === 'sans' ? 'bg-white shadow-2xs font-semibold text-indigo-700' : 'text-slate-600'
                }`}
              >
                Modern Sans
              </button>
            </div>

            {/* Font Size */}
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
              <button
                type="button"
                onClick={() => setFontSize('small')}
                className={`px-2 py-1 rounded ${fontSize === 'small' ? 'bg-white shadow-2xs font-bold text-indigo-700' : 'text-slate-600'}`}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize('medium')}
                className={`px-2 py-1 rounded ${fontSize === 'medium' ? 'bg-white shadow-2xs font-bold text-indigo-700' : 'text-slate-600'}`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded ${fontSize === 'large' ? 'bg-white shadow-2xs font-bold text-indigo-700' : 'text-slate-600'}`}
              >
                A+
              </button>
            </div>

            {/* Alignment */}
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setTextAlign('left')}
                className={`p-1 rounded ${textAlign === 'left' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-500'}`}
                title="Align Left"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setTextAlign('center')}
                className={`p-1 rounded ${textAlign === 'center' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-500'}`}
                title="Align Center"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setTextAlign('right')}
                className={`p-1 rounded ${textAlign === 'right' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-500'}`}
                title="Align Right"
              >
                <AlignRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setTextAlign('justify')}
                className={`p-1 rounded ${textAlign === 'justify' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-500'}`}
                title="Justify"
              >
                <AlignJustify className="w-4 h-4" />
              </button>
            </div>

            {/* Line Spacing */}
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
              <button
                type="button"
                onClick={() => setLineSpacing('tight')}
                className={`px-2 py-1 rounded ${lineSpacing === 'tight' ? 'bg-white shadow-2xs font-semibold text-indigo-700' : 'text-slate-600'}`}
              >
                1.15
              </button>
              <button
                type="button"
                onClick={() => setLineSpacing('normal')}
                className={`px-2 py-1 rounded ${lineSpacing === 'normal' ? 'bg-white shadow-2xs font-semibold text-indigo-700' : 'text-slate-600'}`}
              >
                1.5
              </button>
              <button
                type="button"
                onClick={() => setLineSpacing('relaxed')}
                className={`px-2 py-1 rounded ${lineSpacing === 'relaxed' ? 'bg-white shadow-2xs font-semibold text-indigo-700' : 'text-slate-600'}`}
              >
                2.0
              </button>
            </div>

            {/* Undo / Redo */}
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              <button
                type="button"
                disabled={historyIndex === 0}
                onClick={handleUndo}
                className="p-1 rounded text-slate-500 hover:text-slate-800 disabled:opacity-30"
                title="Undo"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={historyIndex >= history.length - 1}
                onClick={handleRedo}
                className="p-1 rounded text-slate-500 hover:text-slate-800 disabled:opacity-30"
                title="Redo"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Reset button */}
          <button
            type="button"
            onClick={handleResetToGenerated}
            className="text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors ml-auto"
          >
            Reset to Original Draft
          </button>
        </div>
      )}

      {/* Realistic A4 Document Container */}
      <div className="flex justify-center bg-slate-200/60 p-4 sm:p-8 rounded-2xl border border-slate-200 overflow-x-auto">
        <div
          id="printable-application-document"
          className={`w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 document-page-shadow rounded-sm p-8 sm:p-14 md:p-16 transition-all ${
            fontFamily === 'serif' ? 'font-document-serif' : 'font-document-sans'
          } ${fontSizeClasses[fontSize]} ${lineSpacingClasses[lineSpacing]} ${textAlignClasses[textAlign]}`}
          style={{ boxSizing: 'border-box' }}
        >
          {/* Subtle College Letterhead Header if provided */}
          {formData.collegeName && (
            <div className="text-center mb-8 pb-4 border-b border-slate-300/80">
              <h1 className="text-lg sm:text-xl font-bold tracking-wider uppercase text-slate-900 font-serif">
                {formData.collegeName}
              </h1>
              <p className="text-[11px] uppercase tracking-widest text-slate-500 mt-1 font-sans">
                Official College Application / Academic Correspondence
              </p>
            </div>
          )}

          {/* Document Content View / Editor */}
          {isEditing ? (
            <div className="w-full">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => handleTextChange(e.target.value)}
                rows={22}
                className="w-full p-4 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50/20 text-slate-900 font-inherit resize-y leading-relaxed"
                placeholder="Type or edit your college application..."
              />
              <p className="text-[11px] text-slate-400 mt-2 font-sans text-right">
                Editing directly updates the document preview, copy buffer, and PDF export.
              </p>
            </div>
          ) : (
            <div className="whitespace-pre-line text-slate-900">
              {content}
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Quick Bar for Mobile */}
      <div className="mt-6 flex sm:hidden items-center justify-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-800 bg-white border border-slate-200 shadow-xs flex items-center justify-center gap-1.5"
        >
          <Copy className="w-4 h-4" />
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadPDF}
          className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 shadow-xs flex items-center justify-center gap-1.5"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  );
};

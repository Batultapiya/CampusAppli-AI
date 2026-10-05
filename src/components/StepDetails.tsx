import React, { useState, useEffect } from 'react';
import { ApplicationFormData, SavedCollegeProfile } from '../types';
import {
  COMMON_DEPARTMENTS,
  ACADEMIC_YEARS,
  getSmartSubject,
  APPLICATION_TYPES,
} from '../utils/constants';
import {
  User,
  Building2,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  BookmarkCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface StepDetailsProps {
  formData: ApplicationFormData;
  onChange: (field: keyof ApplicationFormData, value: any) => void;
  onSaveProfile: (profile: SavedCollegeProfile) => void;
  savedProfile: SavedCollegeProfile | null;
  onNext: () => void;
  onPrev: () => void;
}

export const StepDetails: React.FC<StepDetailsProps> = ({
  formData,
  onChange,
  onSaveProfile,
  savedProfile,
  onNext,
  onPrev,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveProfileCheckbox, setSaveProfileCheckbox] = useState(false);

  const isFacultyOrGFM =
    formData.applicationType === 'faculty_principal' ||
    formData.applicationType === 'gfm_principal';

  const isLeaveOrEventReason =
    formData.category === 'leave_attendance' ||
    formData.category === 'internship_career' ||
    formData.category === 'events_activities' ||
    formData.reason.toLowerCase().includes('leave') ||
    formData.reason.toLowerCase().includes('permission') ||
    formData.reason.toLowerCase().includes('workshop') ||
    formData.reason.toLowerCase().includes('hackathon');

  // Automatic calculation of days between start and end date
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive of both days
        if (diffDays > 0) {
          onChange('numberOfDays', diffDays);
        } else {
          onChange('numberOfDays', 0);
        }
      }
    } else if (formData.startDate && !formData.endDate) {
      onChange('numberOfDays', 1);
    }
  }, [formData.startDate, formData.endDate]);

  // Keep auto-subject synced when in 'auto' mode
  useEffect(() => {
    if (formData.subjectMode === 'auto') {
      const generated = getSmartSubject(formData.reason, formData.customReason);
      onChange('subject', generated);
    }
  }, [formData.reason, formData.customReason, formData.subjectMode]);

  const handleApplySavedProfile = () => {
    if (!savedProfile) return;
    onChange('collegeName', savedProfile.collegeName);
    onChange('department', savedProfile.department);
    onChange('senderName', savedProfile.senderName);
    onChange('senderId', savedProfile.senderId);
    if (savedProfile.division) onChange('division', savedProfile.division);
    if (savedProfile.year) onChange('year', savedProfile.year);
    if (savedProfile.contactNumber) onChange('contactNumber', savedProfile.contactNumber);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.senderName?.trim()) {
      newErrors.senderName = 'Full Name is required.';
    }

    if (!formData.senderId?.trim()) {
      newErrors.senderId = isFacultyOrGFM
        ? 'Employee ID is required.'
        : 'Roll Number is required.';
    }

    if (!formData.department?.trim()) {
      newErrors.department = 'Department is required.';
    }

    if (!formData.collegeName?.trim()) {
      newErrors.collegeName = 'College / University Name is required.';
    }

    if (formData.subjectMode === 'manual' && !formData.subject?.trim()) {
      newErrors.subject = 'Subject line is required.';
    } else if (formData.subject && formData.subject.length > 120) {
      newErrors.subject = 'Subject line is too long (keep under 120 characters).';
    }

    // Date validations for leave/attendance reasons
    if (formData.category === 'leave_attendance') {
      if (!formData.startDate) {
        newErrors.startDate = 'Start date is required for leave applications.';
      }
      if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        if (end < start) {
          newErrors.endDate = 'End date cannot be earlier than start date.';
        }
      }
    }

    if (formData.additionalDetails && formData.additionalDetails.length > 800) {
      newErrors.additionalDetails = 'Additional details should be under 800 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceed = () => {
    if (!validate()) {
      return;
    }

    // Save profile if checked
    if (saveProfileCheckbox) {
      onSaveProfile({
        collegeName: formData.collegeName,
        department: formData.department,
        senderName: formData.senderName,
        senderId: formData.senderId,
        division: formData.division,
        year: formData.year,
        contactNumber: formData.contactNumber,
      });
    }

    onNext();
  };

  const currentTypeInfo = APPLICATION_TYPES.find((t) => t.id === formData.applicationType);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Application Details
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Fill in your sender profile and specific application details.
          </p>
        </div>

        {/* Saved Profile Quick Action */}
        {savedProfile && (
          <button
            type="button"
            onClick={handleApplySavedProfile}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            Auto-fill from Saved Profile
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Section 1: College & Department */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              1. Institution & Department
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College / University Name *
              </label>
              <input
                type="text"
                value={formData.collegeName}
                onChange={(e) => onChange('collegeName', e.target.value)}
                placeholder="e.g. Pune Institute of Computer Technology"
                className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${
                  errors.collegeName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
              {errors.collegeName && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.collegeName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department Name *
              </label>
              <input
                type="text"
                list="department-suggestions"
                value={formData.department}
                onChange={(e) => onChange('department', e.target.value)}
                placeholder="e.g. Computer Engineering"
                className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${
                  errors.department ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
              <datalist id="department-suggestions">
                {COMMON_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} />
                ))}
              </datalist>
              {errors.department && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.department}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Sender Details */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <User className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              2. Sender Information ({isFacultyOrGFM ? 'Faculty / GFM' : 'Student'})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.senderName}
                onChange={(e) => onChange('senderName', e.target.value)}
                placeholder="e.g. Batul Tapiya"
                className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${
                  errors.senderName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
              {errors.senderName && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.senderName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isFacultyOrGFM ? 'Employee ID *' : 'Roll Number / PRN *'}
              </label>
              <input
                type="text"
                value={formData.senderId}
                onChange={(e) => onChange('senderId', e.target.value)}
                placeholder={isFacultyOrGFM ? 'e.g. EMP-9021' : 'e.g. 404 or 2024-COMP-012'}
                className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${
                  errors.senderId ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
              {errors.senderId && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.senderId}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Division / Section {isFacultyOrGFM ? '(Optional)' : ''}
              </label>
              <input
                type="text"
                value={formData.division}
                onChange={(e) => onChange('division', e.target.value)}
                placeholder="e.g. 04 or Div A"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Year / Status
              </label>
              <select
                value={formData.year}
                onChange={(e) => onChange('year', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {ACADEMIC_YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Number (Optional)
              </label>
              <input
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => onChange('contactNumber', e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specific Receiver Name (Optional)
              </label>
              <input
                type="text"
                value={formData.receiverName || ''}
                onChange={(e) => onChange('receiverName', e.target.value)}
                placeholder={`Optional: e.g. Dr. A. Sharma`}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>

          {/* Save to local profile checkbox */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
            <input
              type="checkbox"
              id="saveProfileCheckbox"
              checked={saveProfileCheckbox}
              onChange={(e) => setSaveProfileCheckbox(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
            />
            <label
              htmlFor="saveProfileCheckbox"
              className="text-xs text-slate-600 cursor-pointer select-none"
            >
              Remember this college & sender profile on this device for 1-click autofill in future applications
            </label>
          </div>
        </div>

        {/* Section 3: Smart Subject & Dates */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              3. Application Subject & Schedule
            </h3>
          </div>

          {/* Smart Subject Generation Toggle (Section 6) */}
          <div className="mb-4">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <label className="text-xs font-semibold text-slate-700">
                Application Subject Line *
              </label>

              {/* Mode Toggle */}
              <div className="inline-flex p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => onChange('subjectMode', 'auto')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    formData.subjectMode === 'auto'
                      ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3 h-3 inline mr-1 text-indigo-500" />
                  Option B: Auto Generate Subject
                </button>
                <button
                  type="button"
                  onClick={() => onChange('subjectMode', 'manual')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    formData.subjectMode === 'manual'
                      ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Option A: Enter Manually
                </button>
              </div>
            </div>

            <input
              type="text"
              value={formData.subject}
              onChange={(e) => {
                onChange('subject', e.target.value);
                if (formData.subjectMode === 'auto') {
                  onChange('subjectMode', 'manual');
                }
              }}
              placeholder="e.g. Request for Sick Leave"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${
                errors.subject ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              }`}
            />
            {formData.subjectMode === 'auto' && (
              <p className="mt-1 text-[11px] text-indigo-600 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Automatically optimized for formal college submission based on "{formData.reason}".
              </p>
            )}
            {errors.subject && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.subject}</p>
            )}
          </div>

          {/* Dates Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Application Date
              </label>
              <input
                type="date"
                value={formData.date || new Date().toISOString().split('T')[0]}
                onChange={(e) => onChange('date', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Start Date {isLeaveOrEventReason ? '*' : '(If applicable)'}
              </label>
              <input
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => onChange('startDate', e.target.value)}
                className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${
                  errors.startDate ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
              {errors.startDate && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.startDate}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  End Date {isLeaveOrEventReason ? '(Optional)' : ''}
                </label>
                {formData.numberOfDays ? (
                  <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                    {formData.numberOfDays} day{formData.numberOfDays > 1 ? 's' : ''}
                  </span>
                ) : null}
              </div>
              <input
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => onChange('endDate', e.target.value)}
                className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${
                  errors.endDate ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
              {errors.endDate && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Additional details / description (Section 5) */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Additional Details / Description / Remarks (Optional)
              </label>
              <span className="text-[11px] text-slate-400">
                {(formData.additionalDetails || '').length}/800
              </span>
            </div>
            <textarea
              rows={3}
              value={formData.additionalDetails}
              onChange={(e) => onChange('additionalDetails', e.target.value)}
              placeholder="e.g. Doctor prescribed viral fever treatment, attached medical certificate, or name of host company/event..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              The AI incorporates these facts seamlessly into formal academic sentences so you never have to draft letter bodies manually.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="mt-8 flex items-center justify-between pt-5 border-t border-slate-200">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Purpose</span>
        </button>

        <button
          type="button"
          onClick={handleProceed}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] text-sm"
        >
          <span>Review & Generate</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

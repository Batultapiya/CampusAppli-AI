import React, { useState, useEffect } from 'react';
import { SavedCollegeProfile } from '../types';
import { COMMON_DEPARTMENTS, ACADEMIC_YEARS } from '../utils/constants';
import { X, Building2, Save, Trash2, CheckCircle2 } from 'lucide-react';

interface CollegeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedProfile: SavedCollegeProfile | null;
  onSave: (profile: SavedCollegeProfile) => void;
  onClear: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const CollegeProfileModal: React.FC<CollegeProfileModalProps> = ({
  isOpen,
  onClose,
  savedProfile,
  onSave,
  onClear,
  onShowToast,
}) => {
  const [collegeName, setCollegeName] = useState('');
  const [department, setDepartment] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderId, setSenderId] = useState('');
  const [division, setDivision] = useState('');
  const [year, setYear] = useState(ACADEMIC_YEARS[0]);
  const [contactNumber, setContactNumber] = useState('');

  useEffect(() => {
    if (savedProfile) {
      setCollegeName(savedProfile.collegeName || '');
      setDepartment(savedProfile.department || '');
      setSenderName(savedProfile.senderName || '');
      setSenderId(savedProfile.senderId || '');
      setDivision(savedProfile.division || '');
      setYear(savedProfile.year || ACADEMIC_YEARS[0]);
      setContactNumber(savedProfile.contactNumber || '');
    }
  }, [savedProfile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeName.trim() || !department.trim()) {
      onShowToast('Please provide at least the College and Department name.', 'error');
      return;
    }

    onSave({
      collegeName: collegeName.trim(),
      department: department.trim(),
      senderName: senderName.trim(),
      senderId: senderId.trim(),
      division: division.trim(),
      year: year,
      contactNumber: contactNumber.trim(),
    });

    onShowToast('College & Student Profile saved to device.', 'success');
    onClose();
  };

  const handleClear = () => {
    if (window.confirm('Clear saved profile from this device?')) {
      onClear();
      setCollegeName('');
      setDepartment('');
      setSenderName('');
      setSenderId('');
      setDivision('');
      setContactNumber('');
      onShowToast('Saved profile cleared.', 'info');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">College & Student Profile</h3>
              <p className="text-xs text-slate-500">
                Save default credentials to auto-fill future applications
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College / University Name *
              </label>
              <input
                type="text"
                required
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="e.g. Pune Institute of Computer Technology"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Department *
              </label>
              <input
                type="text"
                required
                list="modal-dept-list"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Engineering"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <datalist id="modal-dept-list">
                {COMMON_DEPARTMENTS.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Name
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Batul Tapiya"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Roll No / Employee ID
              </label>
              <input
                type="text"
                value={senderId}
                onChange={(e) => setSenderId(e.target.value)}
                placeholder="e.g. 404 or FAC-102"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Division / Class
              </label>
              <input
                type="text"
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                placeholder="e.g. 04 or Div B"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {ACADEMIC_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone (Optional)
              </label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            {savedProfile ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Profile
              </button>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                Save Profile
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

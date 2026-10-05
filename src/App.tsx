import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StepProgress } from './components/StepProgress';
import { StepType } from './components/StepType';
import { StepPurpose } from './components/StepPurpose';
import { StepDetails } from './components/StepDetails';
import { StepSummary } from './components/StepSummary';
import { ApplicationPreview } from './components/ApplicationPreview';
import { ApplicationHistoryModal } from './components/ApplicationHistoryModal';
import { CollegeProfileModal } from './components/CollegeProfileModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { ApplicationFormData, SavedApplicationRecord, SavedCollegeProfile } from './types';
import { generateBaseTemplate, formatFormalDate } from './utils/templateEngine';
import { getSmartSubject } from './utils/constants';
import {
  getApplicationHistory,
  saveApplicationToHistory,
  deleteApplicationFromHistory,
  clearAllApplicationHistory,
  getSavedCollegeProfile,
  saveCollegeProfile,
  clearCollegeProfile,
} from './utils/storage';

export default function App() {
  // Navigation & View State
  const [view, setView] = useState<'home' | 'form' | 'preview'>('home');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Modals & Notifications
  const [historyOpen, setHistoryOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [history, setHistory] = useState<SavedApplicationRecord[]>([]);
  const [savedProfile, setSavedProfile] = useState<SavedCollegeProfile | null>(null);

  // Form State
  const [formData, setFormData] = useState<ApplicationFormData>({
    applicationType: 'student_principal',
    category: 'leave_attendance',
    reason: 'Sick Leave',
    customReason: '',
    senderName: '',
    senderId: '',
    department: 'Computer Engineering',
    division: '01',
    year: 'Third Year (TY / 3rd Year)',
    contactNumber: '',
    collegeName: '',
    receiverName: '',
    receiverDesignation: '',
    subjectMode: 'auto',
    subject: 'Request for Sick Leave',
    date: new Date().toISOString().split('T')[0],
    startDate: '',
    endDate: '',
    numberOfDays: 1,
    additionalDetails: '',
    tone: 'formal',
  });

  // Generated Content State
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [originalGeneratedContent, setOriginalGeneratedContent] = useState<string>('');
  const [usedAI, setUsedAI] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Initial Load: Storage
  useEffect(() => {
    const loadedHistory = getApplicationHistory();
    setHistory(loadedHistory);

    const loadedProfile = getSavedCollegeProfile();
    setSavedProfile(loadedProfile);

    if (loadedProfile) {
      setFormData((prev) => ({
        ...prev,
        collegeName: loadedProfile.collegeName || prev.collegeName,
        department: loadedProfile.department || prev.department,
        senderName: loadedProfile.senderName || prev.senderName,
        senderId: loadedProfile.senderId || prev.senderId,
        division: loadedProfile.division || prev.division,
        year: loadedProfile.year || prev.year,
        contactNumber: loadedProfile.contactNumber || prev.contactNumber,
      }));
    }
  }, []);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Form update helper
  const handleFieldChange = (field: keyof ApplicationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Step transitions
  const goToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStepComplete = (fromStep: number, toStep: number) => {
    if (!completedSteps.includes(fromStep)) {
      setCompletedSteps((prev) => [...prev, fromStep]);
    }
    goToStep(toStep);
  };

  // 1-Click Sample Pre-sets from Hero
  const handleLoadSample = (sample: Partial<ApplicationFormData>) => {
    setFormData((prev) => {
      const merged = { ...prev, ...sample };
      if (!merged.subject) {
        merged.subject = getSmartSubject(merged.reason, merged.customReason);
      }
      return merged;
    });
    setCompletedSteps([1, 2, 3, 4]);
    setView('form');
    setCurrentStep(5); // Jump straight to review & generate
    addToast(`Loaded preset: ${sample.reason || 'Application'}`, 'info');
  };

  // Profile management
  const handleSaveProfile = (profile: SavedCollegeProfile) => {
    saveCollegeProfile(profile);
    setSavedProfile(profile);
    addToast('College and student profile saved successfully.', 'success');
  };

  const handleClearProfile = () => {
    clearCollegeProfile();
    setSavedProfile(null);
  };

  // Generate Application API
  const handleGenerateApplication = async () => {
    setIsGenerating(true);
    const baseTemplate = generateBaseTemplate(formData);

    try {
      const response = await fetch('/api/generate-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          baseTemplate,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const result = await response.json();

      const finalContent = result.applicationText || baseTemplate;
      setGeneratedContent(finalContent);
      setOriginalGeneratedContent(finalContent);
      setUsedAI(Boolean(result.usedAI));

      // Save to application history
      const savedRecord = saveApplicationToHistory({
        applicationType: formData.applicationType,
        senderName: formData.senderName,
        senderId: formData.senderId,
        department: formData.department,
        collegeName: formData.collegeName,
        reason: formData.reason,
        subject: formData.subject,
        content: finalContent,
        usedAI: Boolean(result.usedAI),
      });

      setHistory(getApplicationHistory());
      setView('preview');

      if (result.usedAI) {
        addToast('Application personalized and generated with AI.', 'success');
      } else {
        addToast('Application generated with formal college template.', 'success');
      }
    } catch (err: any) {
      console.warn('API generation failed, falling back to verified template:', err);
      // Graceful local fallback satisfying Section 22
      setGeneratedContent(baseTemplate);
      setOriginalGeneratedContent(baseTemplate);
      setUsedAI(false);

      saveApplicationToHistory({
        applicationType: formData.applicationType,
        senderName: formData.senderName,
        senderId: formData.senderId,
        department: formData.department,
        collegeName: formData.collegeName,
        reason: formData.reason,
        subject: formData.subject,
        content: baseTemplate,
        usedAI: false,
      });

      setHistory(getApplicationHistory());
      setView('preview');
      addToast(
        'Generated using verified formal college template (offline fallback).',
        'info'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Open from history
  const handleOpenFromHistory = (record: SavedApplicationRecord) => {
    setGeneratedContent(record.content);
    setOriginalGeneratedContent(record.content);
    setUsedAI(record.usedAI);
    handleFieldChange('applicationType', record.applicationType);
    handleFieldChange('reason', record.reason);
    handleFieldChange('subject', record.subject);
    handleFieldChange('senderName', record.senderName);
    handleFieldChange('senderId', record.senderId);
    handleFieldChange('department', record.department);
    handleFieldChange('collegeName', record.collegeName);

    setHistoryOpen(false);
    setView('preview');
    addToast('Opened saved application.', 'info');
  };

  const handleDeleteHistory = (id: string) => {
    const updated = deleteApplicationFromHistory(id);
    setHistory(updated);
  };

  const handleClearHistory = () => {
    clearAllApplicationHistory();
    setHistory([]);
  };

  const handleStartNew = () => {
    setView('form');
    setCurrentStep(1);
    setCompletedSteps([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navigation */}
      <Navbar
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenProfile={() => setProfileOpen(true)}
        onStartNew={() => {
          setView('form');
          setCurrentStep(1);
        }}
        historyCount={history.length}
        hasSavedProfile={Boolean(savedProfile)}
        isAiActive={true}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: HOME PAGE */}
        {view === 'home' && (
          <HeroSection
            onStart={() => {
              setView('form');
              setCurrentStep(1);
            }}
            onSelectSample={handleLoadSample}
          />
        )}

        {/* VIEW 2: FORM WIZARD */}
        {view === 'form' && (
          <div className="pb-16">
            <StepProgress
              currentStep={currentStep}
              totalSteps={5}
              onStepClick={(step) => goToStep(step)}
              completedSteps={completedSteps}
            />

            {currentStep === 1 && (
              <StepType
                selectedType={formData.applicationType}
                onSelect={(type) => {
                  handleFieldChange('applicationType', type);
                  handleStepComplete(1, 2);
                }}
                onNext={() => handleStepComplete(1, 2)}
              />
            )}

            {currentStep === 2 && (
              <StepPurpose
                selectedCategory={formData.category}
                selectedReason={formData.reason}
                customReason={formData.customReason}
                onSelectCategory={(cat) => handleFieldChange('category', cat)}
                onSelectReason={(reason) => {
                  handleFieldChange('reason', reason);
                  if (formData.subjectMode === 'auto') {
                    handleFieldChange('subject', getSmartSubject(reason, formData.customReason));
                  }
                }}
                onChangeCustomReason={(val) => {
                  handleFieldChange('customReason', val);
                  if (formData.subjectMode === 'auto') {
                    handleFieldChange('subject', getSmartSubject(formData.reason, val));
                  }
                }}
                onNext={() => handleStepComplete(2, 3)}
                onPrev={() => goToStep(1)}
              />
            )}

            {currentStep === 3 && (
              <StepDetails
                formData={formData}
                onChange={handleFieldChange}
                onSaveProfile={handleSaveProfile}
                savedProfile={savedProfile}
                onNext={() => handleStepComplete(3, 4)}
                onPrev={() => goToStep(2)}
              />
            )}

            {currentStep === 4 && (
              <StepDetails
                formData={formData}
                onChange={handleFieldChange}
                onSaveProfile={handleSaveProfile}
                savedProfile={savedProfile}
                onNext={() => handleStepComplete(4, 5)}
                onPrev={() => goToStep(3)}
              />
            )}

            {currentStep === 5 && (
              <StepSummary
                formData={formData}
                baseTemplate={generateBaseTemplate(formData)}
                isGenerating={isGenerating}
                onGenerate={handleGenerateApplication}
                onPrev={() => goToStep(3)}
                onChangeTone={(t) => handleFieldChange('tone', t)}
              />
            )}
          </div>
        )}

        {/* VIEW 3: PREVIEW & EDITOR */}
        {view === 'preview' && (
          <ApplicationPreview
            content={generatedContent}
            originalGeneratedContent={originalGeneratedContent}
            formData={formData}
            usedAI={usedAI}
            onContentChange={setGeneratedContent}
            onRegenerate={handleGenerateApplication}
            onStartNew={handleStartNew}
            onCopySuccess={() => addToast('Application copied successfully.', 'success')}
            isRegenerating={isGenerating}
          />
        )}
      </main>

      {/* History Modal */}
      <ApplicationHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onOpenApplication={handleOpenFromHistory}
        onDeleteApplication={handleDeleteHistory}
        onClearHistory={handleClearHistory}
        onShowToast={addToast}
      />

      {/* Profile Modal */}
      <CollegeProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        savedProfile={savedProfile}
        onSave={handleSaveProfile}
        onClear={handleClearProfile}
        onShowToast={addToast}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Subtle Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            <strong>College Application Generator</strong> • Formal academic applications & correspondence for students and faculty.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Offline-Ready Templates</span>
            <span>•</span>
            <span>Gemini AI Personalization</span>
            <span>•</span>
            <span>PDF Export</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

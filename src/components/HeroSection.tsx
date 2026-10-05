import React from 'react';
import { Zap, Sparkles, FileDown, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { ApplicationFormData } from '../types';

interface HeroSectionProps {
  onStart: () => void;
  onSelectSample: (sampleData: Partial<ApplicationFormData>) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStart, onSelectSample }) => {
  const samplePresets: Array<{
    title: string;
    typeLabel: string;
    data: Partial<ApplicationFormData>;
  }> = [
    {
      title: 'Sick Leave (Student → Principal)',
      typeLabel: 'Student → Principal',
      data: {
        applicationType: 'student_principal',
        category: 'leave_attendance',
        reason: 'Sick Leave',
        senderName: 'Batul Tapiya',
        senderId: '404',
        division: '04',
        department: 'Computer Engineering',
        year: 'Third Year (TY / 3rd Year)',
        collegeName: 'Pune Institute of Computer Technology',
        startDate: '2026-10-06',
        endDate: '2026-10-08',
        numberOfDays: 3,
        subjectMode: 'auto',
        subject: 'Request for Sick Leave',
        additionalDetails: 'Diagnosed with viral fever and severe migraine; physician advised 3 days complete bed rest.',
      },
    },
    {
      title: 'Internship Permission / NOC',
      typeLabel: 'Student → HOD',
      data: {
        applicationType: 'student_hod',
        category: 'internship_career',
        reason: 'Internship Permission',
        senderName: 'Aarav Sharma',
        senderId: 'CO-2024-89',
        division: 'A',
        department: 'Information Technology',
        year: 'Final Year (B.Tech / B.E. 4th Year)',
        collegeName: 'National Institute of Technology',
        startDate: '2026-11-01',
        endDate: '2027-04-30',
        numberOfDays: 180,
        subjectMode: 'auto',
        subject: 'Request for Permission to Undertake Internship (NOC)',
        additionalDetails: 'Selected for 6-month Software Engineering Internship at Microsoft IDC, Hyderabad. Working hours are hybrid and coursework will be completed via departmental LMS.',
      },
    },
    {
      title: 'Bonafide Certificate',
      typeLabel: 'Student → Principal',
      data: {
        applicationType: 'student_principal',
        category: 'certificates_docs',
        reason: 'Bonafide Certificate',
        senderName: 'Rohan Deshmukh',
        senderId: '221045',
        division: 'B',
        department: 'Mechanical Engineering',
        year: 'Second Year (SY / 2nd Year)',
        collegeName: 'Government College of Engineering',
        subjectMode: 'auto',
        subject: 'Application for Issuance of Bonafide Certificate',
        additionalDetails: 'Required for state government scholarship application and national education loan subsidy processing.',
      },
    },
    {
      title: 'Attendance Shortage Rectification',
      typeLabel: 'Student → GFM',
      data: {
        applicationType: 'student_gfm',
        category: 'leave_attendance',
        reason: 'Attendance Issue',
        senderName: 'Ananya Verma',
        senderId: '42',
        division: '02',
        department: 'Computer Engineering',
        year: 'Third Year (TY / 3rd Year)',
        collegeName: 'St. Xavier Institute of Technology',
        subjectMode: 'auto',
        subject: 'Application for Attendance Rectification and Consideration',
        additionalDetails: 'Represented college at the National Robotics Hackathon; requested to regularize On-Duty (OD) attendance for practical slots.',
      },
    },
    {
      title: 'Workshop Attendance Permission',
      typeLabel: 'Student → HOD',
      data: {
        applicationType: 'student_hod',
        category: 'events_activities',
        reason: 'Workshop',
        senderName: 'Priya Nair',
        senderId: 'CS-312',
        division: 'C',
        department: 'Computer Science & Engineering (AI / ML)',
        year: 'Third Year (TY / 3rd Year)',
        collegeName: 'Vellore Institute of Technology',
        startDate: '2026-10-15',
        endDate: '2026-10-17',
        numberOfDays: 3,
        subjectMode: 'auto',
        subject: 'Request for Permission to Attend Hands-on Workshop',
        additionalDetails: 'Attending IEEE 3-day Advanced Deep Learning Workshop on Generative AI at IIT Bombay.',
      },
    },
    {
      title: 'Faculty Duty Leave / OD',
      typeLabel: 'Faculty → Principal',
      data: {
        applicationType: 'faculty_principal',
        category: 'leave_attendance',
        reason: 'Personal Leave',
        senderName: 'Dr. Rajesh Kulkarni',
        senderId: 'FAC-8092',
        department: 'Electronics & Telecommunication',
        year: 'Faculty / Staff Member',
        collegeName: 'College of Engineering & Technology',
        startDate: '2026-10-20',
        endDate: '2026-10-22',
        numberOfDays: 3,
        subjectMode: 'auto',
        subject: 'Application for Casual / Duty Leave',
        additionalDetails: 'Invited as Keynote Session Chair at IEEE International Conference. Lecture adjustments have been arranged with Prof. S. Mehta.',
      },
    },
  ];

  return (
    <div className="py-10 sm:py-16 text-center max-w-5xl mx-auto px-4">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs sm:text-sm font-medium text-indigo-700 mb-6 shadow-xs">
        <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
        <span>Official Academic Letters in Seconds</span>
      </div>

      {/* Hero Headline */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
        College Application Generator
      </h1>

      {/* Subtitle */}
      <p className="mt-4 sm:mt-5 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal">
        Generate formal college applications in seconds.
      </p>

      {/* CTA Button */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onStart}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] text-base"
        >
          <span>Create Application</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* 3 Core Feature Cards */}
      <div className="mt-14 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {/* Quick */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Quick</h3>
          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
            Generate an application in seconds.
          </p>
        </div>

        {/* Smart */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Smart</h3>
          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
            AI personalizes the application according to your details.
          </p>
        </div>

        {/* Ready to Submit */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <FileDown className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Ready to Submit</h3>
          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
            Copy, edit, print or download your application as PDF.
          </p>
        </div>
      </div>

      {/* Quick Test Presets */}
      <div className="mt-14 pt-8 border-t border-slate-200/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>Try Common College Scenarios (1-Click Load)</span>
          </div>
          <span className="text-xs text-slate-400">Loads realistic test data</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {samplePresets.map((preset, index) => (
            <button
              key={index}
              onClick={() => onSelectSample(preset.data)}
              className="group p-3.5 rounded-xl bg-white hover:bg-indigo-50/50 border border-slate-200/70 hover:border-indigo-300 text-left transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-semibold text-slate-800 group-hover:text-indigo-900">
                  {preset.title}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 group-hover:bg-indigo-100 text-slate-600 group-hover:text-indigo-800 font-medium">
                  {preset.typeLabel}
                </span>
              </div>
              <span className="mt-2 text-xs text-indigo-600 group-hover:text-indigo-700 font-medium inline-flex items-center gap-1">
                Auto-fill & Review <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export type ApplicationTypeId =
  | 'student_principal'
  | 'student_hod'
  | 'student_gfm'
  | 'student_gfm_hod'
  | 'faculty_principal'
  | 'gfm_principal';

export interface ApplicationTypeOption {
  id: ApplicationTypeId;
  label: string;
  senderRole: 'student' | 'faculty' | 'gfm';
  receiverRole: 'principal' | 'hod' | 'gfm' | 'gfm_hod';
  senderTitle: string;
  receiverTitle: string;
  description: string;
  badge: string;
}

export type CategoryId =
  | 'leave_attendance'
  | 'certificates_docs'
  | 'academic'
  | 'internship_career'
  | 'events_activities'
  | 'other';

export interface ReasonCategory {
  id: CategoryId;
  label: string;
  description: string;
  iconName: string;
  reasons: string[];
}

export interface ApplicationFormData {
  // Step 1: Type
  applicationType: ApplicationTypeId;

  // Step 2: Reason
  category: CategoryId;
  reason: string;
  customReason: string;

  // Step 3: Sender & College
  senderName: string;
  senderId: string; // Roll number or Employee ID
  department: string;
  division: string;
  year: string;
  contactNumber: string;
  collegeName: string;
  receiverName?: string;
  receiverDesignation?: string;

  // Step 4: Details & Dates
  subjectMode: 'auto' | 'manual';
  subject: string;
  date: string; // Formatted date string or ISO
  startDate?: string;
  endDate?: string;
  numberOfDays?: number;
  additionalDetails: string;
  tone: 'formal' | 'polite' | 'urgent';
}

export interface SavedApplicationRecord {
  id: string;
  createdAt: string;
  applicationType: ApplicationTypeId;
  senderName: string;
  senderId: string;
  department: string;
  collegeName: string;
  reason: string;
  subject: string;
  content: string;
  usedAI: boolean;
}

export interface SavedCollegeProfile {
  collegeName: string;
  department: string;
  senderName: string;
  senderId: string;
  division: string;
  year: string;
  contactNumber: string;
}

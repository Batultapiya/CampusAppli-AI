import { ApplicationFormData } from '../types';

export function formatFormalDate(dateString?: string): string {
  if (!dateString) {
    const today = new Date();
    return today.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  const dateObj = new Date(dateString);
  if (isNaN(dateObj.getTime())) {
    return dateString;
  }
  return dateObj.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function buildReceiverBlock(data: ApplicationFormData): string {
  const college = data.collegeName?.trim() || '[College Name]';
  const dept = data.department?.trim() || '[Department Name]';
  const customReceiver = data.receiverName ? `${data.receiverName}\n` : '';

  switch (data.applicationType) {
    case 'student_principal':
      return `To,\n${customReceiver}The Principal,\n${college}`;
    case 'student_hod':
      return `To,\n${customReceiver}The Head of Department,\nDepartment of ${dept},\n${college}`;
    case 'student_gfm':
      return `To,\n${customReceiver}The Guardian Faculty Member (GFM),\nDepartment of ${dept},\n${college}`;
    case 'student_gfm_hod':
      return `To,\n${customReceiver}The Guardian Faculty Member & Head of Department,\nDepartment of ${dept},\n${college}`;
    case 'faculty_principal':
      return `To,\n${customReceiver}The Principal,\n${college}\n(Through Proper Channel / Head of Department)`;
    case 'gfm_principal':
      return `To,\n${customReceiver}The Principal,\n${college}\n(Through Head of Department, ${dept})`;
    default:
      return `To,\n${customReceiver}The Competent Authority,\n${college}`;
  }
}

export function buildSenderSignature(data: ApplicationFormData): string {
  const isFacultyOrGFM = data.applicationType === 'faculty_principal' || data.applicationType === 'gfm_principal';
  const closingSalutation = isFacultyOrGFM ? 'Yours faithfully,' : 'Yours obediently / sincerely,';

  const lines = [
    closingSalutation,
    data.senderName || '[Full Name]',
    isFacultyOrGFM
      ? `Employee ID: ${data.senderId || '[Employee ID]'}`
      : `Roll No.: ${data.senderId || '[Roll No.]'}`,
  ];

  if (data.division && !isFacultyOrGFM) {
    lines.push(`Division: ${data.division}`);
  }
  if (data.year && !isFacultyOrGFM) {
    lines.push(`Academic Year: ${data.year}`);
  }
  if (data.department) {
    lines.push(`Department: ${data.department}`);
  }
  if (data.collegeName) {
    lines.push(`College: ${data.collegeName}`);
  }
  if (data.contactNumber) {
    lines.push(`Contact: ${data.contactNumber}`);
  }

  return lines.join('\n');
}

export function generateBaseTemplate(data: ApplicationFormData): string {
  const dateFormatted = formatFormalDate(data.date);
  const receiverBlock = buildReceiverBlock(data);
  const subject = data.subject || 'Application Request';
  const isFaculty = data.applicationType === 'faculty_principal';
  const isGFM = data.applicationType === 'gfm_principal';

  const startDate = data.startDate ? formatFormalDate(data.startDate) : '';
  const endDate = data.endDate ? formatFormalDate(data.endDate) : '';
  const dateRange =
    startDate && endDate
      ? startDate === endDate
        ? `on ${startDate}`
        : `from ${startDate} to ${endDate} (${data.numberOfDays || 1} day${data.numberOfDays && data.numberOfDays > 1 ? 's' : ''})`
      : startDate
      ? `from ${startDate}`
      : '';

  // Introduction intro
  let intro = '';
  if (isFaculty) {
    intro = `I am writing this application to formally bring to your kind attention that I am serving as a faculty member in the Department of ${data.department || '[Department]'}.`;
  } else if (isGFM) {
    intro = `I am writing this application in my capacity as the Guardian Faculty Member (GFM) for Division ${data.division || '[Division]'}, Department of ${data.department || '[Department]'}.`;
  } else {
    intro = `I am ${data.senderName || '[Name]'}, a bona fide student of ${data.year || 'current academic year'}, Department of ${data.department || '[Department]'}, Division ${data.division || '[Division]'}, bearing Roll Number ${data.senderId || '[Roll No]'}.`;
  }

  // Reason body
  let mainBody = '';
  const reason = data.reason;
  const extra = data.additionalDetails?.trim();

  switch (reason) {
    case 'Sick Leave':
      mainBody = `I am writing to state that I have been diagnosed with an acute illness and have been advised medical rest by the consulting physician. Consequently, I am unable to attend classes and practical sessions ${dateRange ? dateRange : 'for the mentioned duration'}.

${extra ? `Medical Details: ${extra}\n\n` : ''}I assure you that I will be diligent in catching up on all the lectures, notes, and academic assignments missed during my absence. I have attached the relevant medical certificate / doctor's prescription for your reference.`;
      break;

    case 'Medical Leave':
      mainBody = `I respectfully submit that I have been unwell and undergoing medical treatment under the supervision of a certified doctor. Due to medical advice, I was advised complete rest and unable to be physically present in college ${dateRange ? dateRange : ''}.

${extra ? `Additional Information: ${extra}\n\n` : ''}I request you to kindly sanction my medical leave and grant attendance consideration for this period. All supporting medical documents and hospital fitness certificates are enclosed herewith.`;
      break;

    case 'Personal Leave':
    case 'Family Emergency':
      mainBody = `I am writing to formally request leave of absence from college ${dateRange ? dateRange : 'for urgent reasons'}. An unforeseen personal circumstance / family emergency has arisen at my hometown that necessitates my immediate presence and assistance.

${extra ? `Circumstance Details: ${extra}\n\n` : ''}I will ensure that all academic responsibilities, submissions, and practical requirements are fulfilled promptly upon my resumption. I kindly request you to sanction this leave.`;
      break;

    case 'Attendance Issue':
    case 'Attendance Condensation/Shortage Request':
      mainBody = `I am submitting this application regarding a discrepancy / shortage in my attendance record for the current semester. Due to unavoidable circumstances and prior sanctioned engagements, my overall attendance percentage has been impacted.

${extra ? `Reason for attendance gap: ${extra}\n\n` : ''}I have always been sincere in my studies and have consistently submitted assignments and appeared for internal assessments on time. I humbly request you to kindly condone the attendance deficit and grant me permission to appear in the upcoming term-end examinations.`;
      break;

    case 'Bonafide Certificate':
      mainBody = `I respectfully request you to kindly issue an official Bonafide Certificate confirming my active enrollment in the ${data.year || 'current academic year'} in the Department of ${data.department || '[Department]'}.

${extra ? `Purpose: The certificate is required for ${extra}.` : 'This certificate is required for official procedural purposes, educational loan processing, and scholarship application requirements.'}

I have attached a copy of my current student identity card and latest fee receipt for verification.`;
      break;

    case 'Character Certificate':
      mainBody = `I respectfully request you to kindly issue a Character and Conduct Certificate on the college letterhead.

${extra ? `Purpose: ${extra}\n\n` : ''}I have maintained a clean disciplinary record and adhered to all college codes of conduct throughout my academic tenure. I would be immensely grateful if the certificate could be processed at your earliest convenience.`;
      break;

    case 'Fee Certificate':
      mainBody = `I am writing to request an official Fee Structure / Fee Paid Certificate for the academic year.

${extra ? `Details: ${extra}\n\n` : ''}This certificate is urgently required for submission to the scholarship portal / financial institution for education loan verification. I have enclosed my student ID and transaction receipt for your reference.`;
      break;

    case 'Identity Card Related Request':
      mainBody = `I am writing to request the issuance of a duplicate College Identity Card. Unfortunately, my original ID card was misplaced / damaged and cannot be recovered despite diligent efforts.

${extra ? `Remarks: ${extra}\n\n` : ''}I have attached my admission slip and passport-sized photographs, and I am willing to pay any requisite processing fee. Kindly issue me a duplicate card at the earliest.`;
      break;

    case 'Transcript/Academic Record Request':
    case 'Document Verification':
      mainBody = `I respectfully request the verification of my academic credentials and the issuance of official academic transcripts.

${extra ? `Purpose: ${extra}\n\n` : ''}These verified records are required for official higher education applications and credential evaluation. I have enclosed self-attested photocopies of all semester grade mark sheets.`;
      break;

    case 'Internship Permission':
    case 'Internship Leave':
      mainBody = `I am pleased to inform you that I have been selected for an internship opportunity ${extra ? `at ${extra}` : 'with a reputed organization'} relevant to my field of study.

The internship duration is scheduled ${dateRange ? dateRange : 'for the upcoming period'}. Undertaking this internship will provide invaluable industry exposure and practical experience that complements our curriculum.

I assure you that I will fulfill all academic milestones, complete pending lab work, and maintain communication with my mentors. I kindly request you to grant me a No Objection Certificate (NOC) and permission to pursue this internship.`;
      break;

    case 'Workshop':
    case 'Seminar':
    case 'Conference':
      mainBody = `I wish to request your kind permission to attend an academic/technical ${reason.toLowerCase()} ${dateRange ? dateRange : ''}.

${extra ? `Event Details: ${extra}\n\n` : ''}Participating in this session will enrich my domain knowledge, expose me to emerging technologies, and assist with my project research. I request you to kindly grant me permission and consider my attendance as On-Duty (OD) for the respective dates.`;
      break;

    case 'Hackathon':
    case 'Participation in Competition':
    case 'Participation in College Event':
    case 'Technical Event':
    case 'Sports Event':
    case 'Cultural Event':
      mainBody = `I am writing to request permission to represent our institution and participate in ${reason} ${dateRange ? dateRange : ''}.

${extra ? `Competition / Team Details: ${extra}\n\n` : ''}Our team has qualified and prepared extensively for this event. Participating in this prestigious event brings laurel to our college. I kindly request you to grant us permission and sanction On-Duty (OD) attendance for the mentioned days.`;
      break;

    case 'Assignment Extension':
      mainBody = `I am writing to humbly request a brief extension for the submission of our academic assignment / lab report.

${extra ? `Reason for extension: ${extra}\n\n` : ''}Due to unforeseen circumstances, I require additional time to complete the work thoroughly and up to academic standards. I request you to kindly extend the deadline by a few days.`;
      break;

    case 'Exam Related Request':
    case 'Re-examination Request':
      mainBody = `I am writing regarding the upcoming examination / internal assessment.

${extra ? `Circumstances: ${extra}\n\n` : ''}Due to legitimate documented constraints, I request your kind consideration and permission regarding my exam schedule / re-examination eligibility.`;
      break;

    default:
      // Custom / Other
      mainBody = `I am writing to formally place a request before you regarding ${data.customReason || data.reason || 'an official college matter'}.

${extra ? `${extra}\n\n` : 'I have outlined the complete context and background for your kind consideration.'}${dateRange ? `The relevant timeframe for this request is ${dateRange}.\n\n` : ''}I respectfully request your favorable consideration and approval on this matter.`;
      break;
  }

  // Concluding polite request
  const conclusion = `I would be most grateful for your kind understanding, consideration, and prompt approval of this application.\n\nThank you.`;

  const senderSig = buildSenderSignature(data);

  return `Date: ${dateFormatted}

${receiverBlock}

Subject: ${subject}

Respected Sir/Madam,

${intro}

${mainBody}

${conclusion}

${senderSig}`;
}

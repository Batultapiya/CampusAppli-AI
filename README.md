# College Application Generator

A modern, responsive web application for college students and faculty to generate formal, properly formatted, submission-ready academic applications in seconds.

## Features

- **Hybrid Template + AI Engine**: Generates official applications with pre-verified academic templates and personalizes them with Google Gemini AI (`gemini-3.8-flash`).
- **6 Formal Application Flows**:
  - GFM → Principal
  - Student → GFM
  - Student → HOD
  - Student → Principal
  - Student → GFM/HOD
  - Faculty → Principal
- **Comprehensive Reason Library**:
  - **Leave / Attendance**: Sick Leave, Medical Leave, Personal Leave, Family Emergency, Late Arrival, Early Departure, Attendance Issue, Attendance Condensation/Shortage Request.
  - **Certificates / Documents**: Bonafide Certificate, Character Certificate, Fee Certificate, ID Card Request, Document Verification, Transcripts.
  - **Academic**: Exam Requests, Assignment Extension, Practical Attendance, Re-examination, Internal Marks, Subject/Dept Change, Academic Permission.
  - **Internship / Career**: Internship Permission (NOC), Internship Leave, Industrial Visit, Training Program, Placement Attendance.
  - **Events / Activities**: Hackathons, Competitions, Sports, Cultural, Technical Events, Workshops, Seminars, Conferences.
  - **Other**: Hostel, Library, Fees, Scholarships, or Custom Reason.
- **Smart Subject Generation**: Automatically generates short, formal subject lines based on the selected reason, or allows custom manual entry.
- **Realistic A4 Document Preview**: True-to-life paper preview with margins, formal typography (Serif / Sans toggle), line spacing, and alignment.
- **Interactive Rich Text Editor**: Edit bold, italic, alignments, font size, and spacing without regenerating from scratch.
- **One-Click Actions**:
  - **Copy Application**: Copies clean text to clipboard with instant confirmation toast.
  - **Download as PDF**: Generates a clean A4 PDF file using jsPDF with no UI clutter.
  - **Print**: Official print stylesheet configured for standard printers.
  - **Regenerate**: Re-runs AI personalization or adjusts tone (Standard Formal, Polite & Courteous, Urgent / Priority).
- **Application History**: Stored locally in the browser (no account or login required); open, edit, copy, download, or delete past applications.
- **College Profile Autofill**: Save college name, department, roll number / employee ID, and division to localStorage for 1-click autofill in future applications.

---

## Local Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation
1. Clone the repository and navigate into the folder:
   ```bash
   cd college-application-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   ```
   *(Note: The application includes a verified offline template engine fallback if the API key is not configured or if network limits are reached).*

4. Start the application:
   ```bash
   npm run dev
   ```
   The dev server will run on `http://localhost:3000`.

5. Build for production:
   ```bash
   npm run build
   ```
   To run in production:
   ```bash
   npm run start
   ```

---

## Security Practices
- API keys are handled strictly on the backend (`server.ts`) via server-side environment variables and are **never** exposed to the client.
- Sensitive user data stays locally on the device (localStorage) unless explicitly submitted to generate the letter.
- Input validation sanitizes strings and limits payloads.

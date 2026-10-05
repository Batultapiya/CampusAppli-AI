import { jsPDF } from 'jspdf';

interface PDFOptions {
  fileName?: string;
  collegeName?: string;
  subject?: string;
  includeCollegeHeader?: boolean;
}

export function exportApplicationToPDF(text: string, options: PDFOptions = {}): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20; // 20mm margin
  const maxLineWidth = pageWidth - margin * 2;

  let yPosition = 25;

  // Optional subtle header line
  if (options.collegeName && options.includeCollegeHeader) {
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    doc.text(options.collegeName.toUpperCase(), pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 6;

    doc.setFont('times', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(90, 90, 90);
    doc.text('OFFICIAL ACADEMIC CORRESPONDENCE / APPLICATION', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 4;

    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.4);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;
  }

  // Set standard typography
  doc.setTextColor(20, 20, 20);
  doc.setFont('times', 'normal');
  doc.setFontSize(11);

  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];

    // Check if new page needed
    if (yPosition > pageHeight - margin - 10) {
      doc.addPage();
      yPosition = margin;
    }

    if (!rawLine.trim()) {
      // Empty line / paragraph gap
      yPosition += 4.5;
      continue;
    }

    const trimmed = rawLine.trim();

    // Check if this line is Subject
    if (trimmed.startsWith('Subject:') || trimmed.startsWith('SUBJECT:')) {
      doc.setFont('times', 'bold');
      const subjectWrapped = doc.splitTextToSize(rawLine, maxLineWidth);
      doc.text(subjectWrapped, margin, yPosition);
      yPosition += subjectWrapped.length * 5.5 + 2;
      doc.setFont('times', 'normal');
      continue;
    }

    // Check if Date line
    if (trimmed.startsWith('Date:')) {
      doc.setFont('times', 'normal');
      doc.text(rawLine, margin, yPosition);
      yPosition += 6;
      continue;
    }

    // Standard text line
    doc.setFont('times', 'normal');
    const wrapped = doc.splitTextToSize(rawLine, maxLineWidth);
    doc.text(wrapped, margin, yPosition);
    yPosition += wrapped.length * 5.2;
  }

  // Footer page numbers if multi-page
  const totalPages = doc.getNumberOfPages();
  if (totalPages > 1) {
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFont('times', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(130, 130, 130);
      doc.text(`Page ${p} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }
  }

  const cleanFileName = (options.subject || 'College_Application')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 40);

  doc.save(`${cleanFileName || 'College_Application'}.pdf`);
}

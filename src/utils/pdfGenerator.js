import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatINR, toPaise, fromPaise } from './moneyUtils';

/**
 * Generates an authentic PDF Bank Statement / Passbook document.
 * @param {Object} params 
 * @param {Object} params.user - User account metadata
 * @param {Array} params.transactions - List of filtered transactions
 * @param {string} params.dateRangeLabel - Human readable range label (e.g. "All Transactions", "August 2026")
 * @param {string} params.startDate - ISO or formatted start date
 * @param {string} params.endDate - ISO or formatted end date
 */
export const generatePassbookPDF = ({
  user,
  transactions = [],
  dateRangeLabel = 'All Transactions',
  startDate = '',
  endDate = ''
}) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Compute Totals in integer paise
  let totalCreditsPaise = 0;
  let totalDebitsPaise = 0;

  transactions.forEach(t => {
    const paise = toPaise(t.amount);
    if (t.type === 'credit' || t.type === 'refund') {
      totalCreditsPaise += paise;
    } else {
      totalDebitsPaise += paise;
    }
  });

  const closingBalancePaise = toPaise(user.availableBalance);
  const openingBalancePaise = closingBalancePaise - totalCreditsPaise + totalDebitsPaise;

  const generatedDateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Color Palette Constants
  const terracottaColor = [200, 90, 50]; // #C85A32
  const charcoalColor = [28, 25, 23];    // #1C1917
  const mutedColor = [120, 113, 108];   // #78716C
  const ruleColor = [231, 229, 228];    // #E7E5E4

  // 1. BRAND HEADER
  doc.setFillColor(...terracottaColor);
  doc.rect(margin, 12, 8, 8, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('V', margin + 2.5, 17.5);

  doc.setTextColor(...charcoalColor);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('VAULT', margin + 11, 18);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedColor);
  doc.text('DIGITAL BANKING • PERSONAL PASSBOOK STATEMENT', margin + 11, 22);

  // Statement Header Right Aligned
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...terracottaColor);
  doc.text('ACCOUNT STATEMENT', pageWidth - margin, 18, { align: 'right' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedColor);
  doc.text(`Generated: ${generatedDateStr}`, pageWidth - margin, 22, { align: 'right' });

  // Hairline Rule
  doc.setDrawColor(...ruleColor);
  doc.setLineWidth(0.4);
  doc.line(margin, 26, pageWidth - margin, 26);

  // 2. ACCOUNT & HOLDER DETAILS GRID
  let startY = 32;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...charcoalColor);
  doc.text('ACCOUNT DETAILS', margin, startY);
  doc.text('STATEMENT PERIOD', pageWidth / 2 + 10, startY);

  startY += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...mutedColor);

  // Left Column
  doc.text(`Account Holder: `, margin, startY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...charcoalColor);
  doc.text(user.name, margin + 24, startY);

  startY += 4;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedColor);
  doc.text(`Account Number: `, margin, startY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...charcoalColor);
  doc.text(user.fullAccountNo || user.accountNo, margin + 24, startY);

  startY += 4;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedColor);
  doc.text(`IFSC Code: `, margin, startY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...charcoalColor);
  doc.text(user.ifscCode, margin + 24, startY);

  // Right Column
  let rightY = 36;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedColor);
  doc.text(`Range: `, pageWidth / 2 + 10, rightY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...charcoalColor);
  doc.text(dateRangeLabel, pageWidth / 2 + 30, rightY);

  rightY += 4;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedColor);
  doc.text(`Account Type: `, pageWidth / 2 + 10, rightY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...charcoalColor);
  doc.text('VAULT Primary Savings', pageWidth / 2 + 30, rightY);

  rightY += 4;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mutedColor);
  doc.text(`UPI Handle: `, pageWidth / 2 + 10, rightY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...charcoalColor);
  doc.text(user.upiId, pageWidth / 2 + 30, rightY);

  // 3. STATEMENT FINANCIAL SUMMARY BOX
  const boxY = 50;
  const boxWidth = (pageWidth - margin * 2);
  doc.setFillColor(250, 248, 245); // Warm paper surface
  doc.rect(margin, boxY, boxWidth, 14, 'F');
  doc.setDrawColor(...ruleColor);
  doc.rect(margin, boxY, boxWidth, 14, 'S');

  const colWidth = boxWidth / 4;
  
  const summaries = [
    { label: 'OPENING BAL', val: formatINR(fromPaise(openingBalancePaise)) },
    { label: 'TOTAL CREDITS', val: formatINR(fromPaise(totalCreditsPaise)) },
    { label: 'TOTAL DEBITS', val: formatINR(fromPaise(totalDebitsPaise)) },
    { label: 'CLOSING BAL', val: formatINR(fromPaise(closingBalancePaise)) }
  ];

  summaries.forEach((s, idx) => {
    const xPos = margin + idx * colWidth + 4;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...mutedColor);
    doc.text(s.label, xPos, boxY + 4.5);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(idx === 1 ? 21 : idx === 2 ? 185 : idx === 3 ? 200 : 28, idx === 1 ? 128 : idx === 2 ? 28 : idx === 3 ? 90 : 25, idx === 1 ? 61 : idx === 2 ? 28 : idx === 3 ? 50 : 23);
    doc.text(s.val, xPos, boxY + 10.5);

    if (idx < 3) {
      doc.setDrawColor(...ruleColor);
      doc.line(margin + (idx + 1) * colWidth, boxY, margin + (idx + 1) * colWidth, boxY + 14);
    }
  });

  // 4. TRANSACTION TABLE
  const tableData = transactions.map(t => {
    const isCredit = t.type === 'credit' || t.type === 'refund';
    const creditStr = isCredit ? `+₹${t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—';
    const debitStr = !isCredit ? `-₹${t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—';

    return [
      t.date || 'N/A',
      t.merchant || 'Transaction',
      t.category || 'General',
      t.upiRef || t.id || 'N/A',
      debitStr,
      creditStr,
      `₹${t.runningBalance ? t.runningBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}`
    ];
  });

  doc.autoTable({
    startY: 68,
    head: [['DATE', 'DESCRIPTION', 'CATEGORY', 'REFERENCE ID', 'DEBIT (₹)', 'CREDIT (₹)', 'BALANCE (₹)']],
    body: tableData,
    theme: 'plain',
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 2.5,
      textColor: charcoalColor,
      lineColor: ruleColor,
      lineWidth: 0.2
    },
    headStyles: {
      fillColor: [245, 242, 235],
      textColor: charcoalColor,
      fontStyle: 'bold',
      fontSize: 7.5
    },
    columnStyles: {
      0: { cellWidth: 24 },
      1: { cellWidth: 42 },
      2: { cellWidth: 26 },
      3: { cellWidth: 32 },
      4: { cellWidth: 20, halign: 'right' },
      5: { cellWidth: 20, halign: 'right' },
      6: { cellWidth: 22, halign: 'right', fontStyle: 'bold' }
    },
    margin: { left: margin, right: margin, bottom: 20 },
    didDrawPage: function (data) {
      // Footer on every page
      const totalPages = doc.internal.getNumberOfPages();
      const currentPage = data.pageNumber;

      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...mutedColor);
      doc.text(
        `Generated by VAULT Digital Banking • Confidential Passbook Statement`,
        margin,
        pageHeight - 8
      );

      doc.text(
        `Page ${currentPage} of ${totalPages}`,
        pageWidth - margin,
        pageHeight - 8,
        { align: 'right' }
      );
    }
  });

  // Sanitize Filename
  const monthName = new Date().toLocaleString('en-US', { month: 'long' });
  const yearName = new Date().getFullYear();
  const safeFilename = `VAULT_Passbook_${monthName}_${yearName}.pdf`;

  // Download PDF
  doc.save(safeFilename);
};

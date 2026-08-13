import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { calculateStatementData } from './statementModel';
import { formatINR } from './moneyUtils';

/**
 * Generates an authentic multi-page PDF Bank Statement / Passbook document.
 * @param {Object} params 
 * @returns {boolean} Success status
 */
export const generatePassbookPDF = (params) => {
  try {
    const data = calculateStatementData(params);

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;

    // Color Palette
    const terracottaColor = [200, 90, 50]; // #C85A32
    const charcoalColor = [28, 25, 23];    // #1C1917
    const mutedColor = [120, 113, 108];   // #78716C
    const ruleColor = [231, 229, 228];    // #E7E5E4

    // Helper for formatting PDF safe currency strings (using Rs. for standard Helvetica font compatibility)
    const formatPdfMoney = (val, isSigned = false, sign = '') => {
      const num = Math.abs(val || 0);
      const str = num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return isSigned ? `${sign}Rs. ${str}` : `Rs. ${str}`;
    };

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
    doc.text('DIGITAL BANKING • OFFICIAL PASSBOOK STATEMENT', margin + 11, 22);

    // Header Right
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...terracottaColor);
    doc.text('ACCOUNT STATEMENT', pageWidth - margin, 18, { align: 'right' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...mutedColor);
    doc.text(`Generated: ${data.generatedDateStr}`, pageWidth - margin, 22, { align: 'right' });

    // Divider Line
    doc.setDrawColor(...ruleColor);
    doc.setLineWidth(0.4);
    doc.line(margin, 26, pageWidth - margin, 26);

    // 2. ACCOUNT & PERIOD METADATA
    let startY = 32;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...charcoalColor);
    doc.text('ACCOUNT DETAILS', margin, startY);
    doc.text('STATEMENT PERIOD', pageWidth / 2 + 10, startY);

    startY += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    // Left Column
    doc.setTextColor(...mutedColor);
    doc.text(`Account Holder: `, margin, startY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...charcoalColor);
    doc.text(data.accountHolder, margin + 24, startY);

    startY += 4;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...mutedColor);
    doc.text(`Account Number: `, margin, startY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...charcoalColor);
    doc.text(data.accountNo, margin + 24, startY);

    startY += 4;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...mutedColor);
    doc.text(`IFSC Code: `, margin, startY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...charcoalColor);
    doc.text(data.ifscCode, margin + 24, startY);

    // Right Column
    let rightY = 36;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...mutedColor);
    doc.text(`Period: `, pageWidth / 2 + 10, rightY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...charcoalColor);
    doc.text(data.periodLabel, pageWidth / 2 + 25, rightY);

    rightY += 4;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...mutedColor);
    doc.text(`Account Type: `, pageWidth / 2 + 10, rightY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...charcoalColor);
    doc.text('VAULT Primary Savings', pageWidth / 2 + 25, rightY);

    rightY += 4;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...mutedColor);
    doc.text(`UPI Handle: `, pageWidth / 2 + 10, rightY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...charcoalColor);
    doc.text(data.upiId, pageWidth / 2 + 25, rightY);

    // 3. STATEMENT SUMMARY BOX
    const boxY = 50;
    const boxWidth = (pageWidth - margin * 2);
    doc.setFillColor(250, 248, 245);
    doc.rect(margin, boxY, boxWidth, 14, 'F');
    doc.setDrawColor(...ruleColor);
    doc.rect(margin, boxY, boxWidth, 14, 'S');

    const colWidth = boxWidth / 4;
    const summaries = [
      { label: 'OPENING BAL', val: formatPdfMoney(data.openingBalance) },
      { label: 'TOTAL CREDITS', val: formatPdfMoney(data.totalCredits) },
      { label: 'TOTAL DEBITS', val: formatPdfMoney(data.totalDebits) },
      { label: 'CLOSING BAL', val: formatPdfMoney(data.closingBalance) }
    ];

    summaries.forEach((s, idx) => {
      const xPos = margin + idx * colWidth + 4;
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...mutedColor);
      doc.text(s.label, xPos, boxY + 4.5);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(
        idx === 1 ? 21 : idx === 2 ? 185 : 28, 
        idx === 1 ? 128 : idx === 2 ? 28 : 25, 
        idx === 1 ? 61 : idx === 2 ? 28 : 23
      );
      doc.text(s.val, xPos, boxY + 10.5);

      if (idx < 3) {
        doc.setDrawColor(...ruleColor);
        doc.line(margin + (idx + 1) * colWidth, boxY, margin + (idx + 1) * colWidth, boxY + 14);
      }
    });

    // 4. TRANSACTION TABLE
    const tableRows = data.transactions.map(t => {
      const isCredit = t.type === 'credit' || t.type === 'refund';
      const debitText = !isCredit ? formatPdfMoney(t.amount, true, '-') : '—';
      const creditText = isCredit ? formatPdfMoney(t.amount, true, '+') : '—';
      const balanceText = formatPdfMoney(t.runningBalance || 0);

      return [
        t.date || 'N/A',
        t.merchant || 'Transaction',
        t.category || 'General',
        t.upiRef || t.id || 'N/A',
        debitText,
        creditText,
        balanceText
      ];
    });

    autoTable(doc, {
      startY: 68,
      head: [['DATE', 'DESCRIPTION', 'CATEGORY', 'REFERENCE ID', 'DEBIT', 'CREDIT', 'BALANCE']],
      body: tableRows.length > 0 ? tableRows : [['No transactions recorded for selected statement period', '', '', '', '', '', '']],
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
        1: { cellWidth: 40 },
        2: { cellWidth: 26 },
        3: { cellWidth: 32 },
        4: { cellWidth: 20, halign: 'right' },
        5: { cellWidth: 20, halign: 'right' },
        6: { cellWidth: 22, halign: 'right', fontStyle: 'bold' }
      },
      margin: { left: margin, right: margin, bottom: 20 },
      didDrawPage: function (dataInfo) {
        // Footer on every page
        const totalPages = doc.internal.getNumberOfPages();
        const currentPage = dataInfo.pageNumber;

        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...mutedColor);
        doc.text(
          `Generated by VAULT Digital Banking • Official Statement`,
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

    // Filename
    const filename = `VAULT_Statement_${data.filenameDateSuffix}.pdf`;
    doc.save(filename);
    return true;
  } catch (err) {
    console.error("PDF Generation Exception:", err);
    return false;
  }
};

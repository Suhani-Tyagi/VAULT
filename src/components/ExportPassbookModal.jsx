import React, { useState } from 'react';
import { FileText, X, Download, Printer, Loader2, AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import { generatePassbookPDF } from '../utils/pdfGenerator';
import { calculateStatementData } from '../utils/statementModel';
import { PrintablePassbook } from './PrintablePassbook';
import { useVault } from '../context/VaultContext';

export const ExportPassbookModal = ({ isOpen, onClose }) => {
  const { user, transactions, showToast } = useVault();
  
  const [rangeOption, setRangeOption] = useState('all'); // 'all', 'thisMonth', 'lastMonth', 'custom'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const validateInputs = () => {
    setValidationError('');
    if (rangeOption === 'custom') {
      if (!startDate || !endDate) {
        setValidationError('Please select both Start Date and End Date for custom range.');
        return false;
      }
      if (new Date(startDate) > new Date(endDate)) {
        setValidationError('Start date cannot be later than end date.');
        return false;
      }
    }
    return true;
  };

  const handleGeneratePDF = async () => {
    if (!validateInputs()) return;

    setIsGenerating(true);

    try {
      // Allow UI to update loading state
      await new Promise(r => setTimeout(r, 100));

      const success = generatePassbookPDF({
        user,
        transactions,
        rangeOption,
        startDate,
        endDate
      });

      setIsGenerating(false);

      if (success) {
        showToast("Passbook PDF generated and downloaded");
        onClose();
      } else {
        showToast("Unable to generate the passbook. Please try again.", "error");
      }
    } catch (err) {
      setIsGenerating(false);
      showToast("Unable to generate the passbook. Please try again.", "error");
    }
  };

  const currentStatementData = calculateStatementData({
    user,
    transactions,
    rangeOption,
    startDate,
    endDate
  });

  const handlePrint = async () => {
    if (!validateInputs()) return;

    setIsPrinting(true);

    try {
      await new Promise(r => setTimeout(r, 150));
      window.print();
      setIsPrinting(false);
    } catch (err) {
      setIsPrinting(false);
      showToast("Unable to open the print window. Please try again.", "error");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-sans select-none print:hidden">
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="export-modal-title"
          className="w-full max-w-md bg-vault-surface border border-vault-rule rounded-2xl p-6 shadow-xl text-vault-ink dark:text-vault-text space-y-5 focus:outline-none"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-vault-rule pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-vault-paper border border-vault-rule text-vault-reserveBlue flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 id="export-modal-title" className="text-sm font-bold text-vault-ink dark:text-vault-text font-sans">
                  Export Passbook / Statement
                </h3>
                <p className="text-[11px] text-vault-muted dark:text-vault-mutedDark font-mono">
                  Generate official PDF transaction ledger
                </p>
              </div>
            </div>

            <button 
              type="button"
              onClick={onClose}
              disabled={isGenerating || isPrinting}
              aria-label="Close export modal"
              className="text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink p-1.5 rounded-lg hover:bg-vault-surfaceHighlight transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Validation Error Alert */}
          {validationError && (
            <div className="p-3 bg-vault-roseLight border border-vault-rose/30 rounded-lg flex items-center gap-2 text-xs text-vault-rose font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Form Controls */}
          <div className="space-y-4 font-mono text-xs">
            {/* Account Details */}
            <div>
              <label className="font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider block mb-1">
                ACCOUNT
              </label>
              <div className="p-2.5 bg-vault-paper border border-vault-rule rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-bold text-vault-ink dark:text-vault-text font-sans">{user.name}</p>
                  <p className="text-[11px] text-vault-muted dark:text-vault-mutedDark">VAULT Primary • A/C {user.accountNo}</p>
                </div>
                <span className="text-[10px] text-vault-emerald font-bold bg-vault-emeraldLight px-2 py-0.5 rounded border border-vault-emerald/20">
                  Active
                </span>
              </div>
            </div>

            {/* Date Range Selection */}
            <div className="space-y-2">
              <label className="font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider block">
                STATEMENT PERIOD
              </label>

              <div className="space-y-1.5 font-sans">
                {[
                  { id: 'all', label: 'All Transactions', desc: 'Full historical passbook ledger' },
                  { id: 'thisMonth', label: 'This Month (August 2026)', desc: 'Current calendar month transactions' },
                  { id: 'lastMonth', label: 'Last Month (July 2026)', desc: 'Previous month statement' },
                  { id: 'custom', label: 'Custom Range', desc: 'Specify custom start & end date' }
                ].map(opt => (
                  <label 
                    key={opt.id}
                    className={`p-2.5 rounded-lg border flex items-center gap-3 cursor-pointer transition-colors ${
                      rangeOption === opt.id 
                        ? 'bg-vault-paper border-vault-reserveBlue text-vault-ink dark:text-vault-text font-bold' 
                        : 'bg-vault-paper/40 border-vault-rule text-vault-muted dark:text-vault-mutedDark'
                    }`}
                  >
                    <input 
                      type="radio"
                      name="rangeOption"
                      value={opt.id}
                      checked={rangeOption === opt.id}
                      onChange={() => { setRangeOption(opt.id); setValidationError(''); }}
                      className="accent-vault-reserveBlue"
                    />
                    <div>
                      <p className="text-xs font-bold">{opt.label}</p>
                      <p className="text-[10px] font-mono text-vault-muted dark:text-vault-mutedDark">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Date Pickers */}
            {rangeOption === 'custom' && (
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                <div>
                  <label htmlFor="start-date" className="text-[10px] text-vault-muted font-bold block mb-1">START DATE</label>
                  <input 
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => { setStartDate(e.target.value); setValidationError(''); }}
                    className="w-full bg-vault-paper border border-vault-rule rounded-lg px-2.5 py-1.5 text-xs text-vault-ink dark:text-vault-text"
                  />
                </div>

                <div>
                  <label htmlFor="end-date" className="text-[10px] text-vault-muted font-bold block mb-1">END DATE</label>
                  <input 
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => { setEndDate(e.target.value); setValidationError(''); }}
                    className="w-full bg-vault-paper border border-vault-rule rounded-lg px-2.5 py-1.5 text-xs text-vault-ink dark:text-vault-text"
                  />
                </div>
              </div>
            )}

            {/* Statement Summary Preview */}
            <div className="p-2.5 bg-vault-paper border border-vault-rule rounded-lg text-xs space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-vault-muted">Filtered Entries:</span>
                <span className="font-bold">{currentStatementData.transactions.length} transactions</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-vault-muted">Closing Balance:</span>
                <span className="font-bold text-vault-emerald">₹{currentStatementData.closingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5 pt-2 font-mono text-xs">
            <button
              type="button"
              disabled={isGenerating || isPrinting}
              onClick={handlePrint}
              aria-label="Print passbook view"
              className="px-3 py-2 bg-vault-paper border border-vault-rule text-vault-ink dark:text-vault-text hover:bg-vault-surfaceHighlight rounded-lg font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {isPrinting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Printer className="w-3.5 h-3.5" />}
              <span>{isPrinting ? "Preparing..." : "Print"}</span>
            </button>

            <button
              type="button"
              disabled={isGenerating || isPrinting}
              onClick={onClose}
              className="flex-1 py-2 bg-vault-paper border border-vault-rule text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink rounded-lg font-bold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isGenerating || isPrinting}
              onClick={handleGeneratePDF}
              className="flex-1 py-2 bg-vault-reserveBlue hover:bg-vault-reserveBlueHover text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>{isGenerating ? "Generating..." : "Generate PDF"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hidden Print Container */}
      <PrintablePassbook statementData={currentStatementData} />
    </>
  );
};

ExportPassbookModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

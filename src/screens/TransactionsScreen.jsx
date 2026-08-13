import React, { useState, useMemo } from 'react';
import { Search, Download, FileText } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { TransactionRow } from '../components/TransactionRow';
import { ExportPassbookModal } from '../components/ExportPassbookModal';

export const TransactionsScreen = () => {
  const { transactions, setSelectedTransaction, showToast } = useVault();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showExportModal, setShowExportModal] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch = 
        tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.upiRef && tx.upiRef.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      if (selectedFilter === 'debit') return matchesSearch && tx.type === 'debit';
      if (selectedFilter === 'credit') return matchesSearch && tx.type === 'credit';
      if (selectedFilter === 'refund') return matchesSearch && tx.type === 'refund';
      return matchesSearch;
    });
  }, [transactions, searchQuery, selectedFilter]);

  // Group transactions by date string
  const groupedTransactions = useMemo(() => {
    const groups = {};
    filteredTransactions.forEach(tx => {
      const dateKey = tx.date || 'Statement Period';
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(tx);
    });
    return groups;
  }, [filteredTransactions]);

  return (
    <div className="space-y-4 font-sans max-w-5xl mx-auto">
      {/* Header title & Export button */}
      <div className="flex justify-between items-start pb-3 border-b border-vault-rule">
        <div>
          <h2 className="text-lg font-bold text-vault-ink dark:text-vault-text tracking-tight font-sans">
            Activity & Transactions
          </h2>
          <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5 font-mono">
            Bank statement ledger & passbook history
          </p>
        </div>

        <button
          type="button"
          aria-label="Export activity as CSV statement"
          onClick={() => setShowExportModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-vault-paper border border-vault-rule hover:border-vault-reserveBlue text-vault-ink dark:text-vault-text rounded-lg text-xs font-mono font-bold transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-vault-reserveBlue" />
          <span>Export Passbook</span>
        </button>
      </div>

      {/* Search Input & Category Filter Tabs */}
      <div className="bg-vault-surface border border-vault-rule rounded-xl p-3 space-y-2.5">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3 text-vault-muted pointer-events-none" />
          <input 
            type="text"
            placeholder="Search merchant, category, or note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search transactions"
            className="w-full bg-vault-paper border border-vault-rule rounded-lg pl-9 pr-3 py-2 text-xs text-vault-ink dark:text-vault-text placeholder-vault-muted focus:outline-none focus:border-vault-reserveBlue font-mono"
          />
        </div>

        <div className="flex gap-1.5 text-xs font-mono font-medium overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All' },
            { id: 'debit', label: 'Spent' },
            { id: 'credit', label: 'Received' },
            { id: 'refund', label: 'Refund' }
          ].map((filter) => (
            <button
              key={filter.id}
              type="button"
              aria-label={filter.label}
              onClick={() => setSelectedFilter(filter.id)}
              className={`flex-1 min-w-[65px] py-1.5 rounded-lg transition-colors text-center ${
                selectedFilter === filter.id 
                  ? 'bg-vault-reserveBlue text-white font-bold' 
                  : 'bg-vault-paper border border-vault-rule text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink dark:hover:text-vault-text'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped Statement Ledger Container */}
      <div className="space-y-4">
        {Object.keys(groupedTransactions).length > 0 ? (
          Object.entries(groupedTransactions).map(([dateLabel, txGroup]) => (
            <div key={dateLabel} className="space-y-1">
              <div className="px-1 py-1 flex items-center justify-between text-[11px] font-mono text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider font-bold">
                <span>{dateLabel}</span>
                <span>{txGroup.length} {txGroup.length === 1 ? 'entry' : 'entries'}</span>
              </div>
              <div className="bg-vault-surface border border-vault-rule rounded-xl overflow-hidden">
                {txGroup.map((tx) => (
                  <TransactionRow 
                    key={tx.id}
                    tx={tx}
                    onClick={() => setSelectedTransaction(tx)}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-vault-surface border border-vault-rule rounded-xl py-12 px-4 text-center text-vault-muted dark:text-vault-mutedDark space-y-1 font-mono">
            <p className="text-xs font-bold text-vault-ink dark:text-vault-text font-sans">No transactions found</p>
            <p className="text-xs">Adjust your search terms or filters.</p>
          </div>
        )}
      </div>

      {/* Export Passbook Modal */}
      <ExportPassbookModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
};


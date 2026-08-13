import React, { useState, useMemo } from 'react';
import { Search, Download } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { TransactionRow } from '../components/TransactionRow';

export const TransactionsScreen = () => {
  const { transactions, setSelectedTransaction, showToast } = useVault();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch = 
        tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      if (selectedFilter === 'debit') return matchesSearch && tx.type === 'debit';
      if (selectedFilter === 'credit') return matchesSearch && tx.type === 'credit';
      if (selectedFilter === 'refund') return matchesSearch && tx.type === 'refund';
      return matchesSearch;
    });
  }, [transactions, searchQuery, selectedFilter]);

  const handleExportCsv = () => {
    if (filteredTransactions.length === 0) {
      showToast("No transactions available to export", "error");
      return;
    }

    const headers = ["ID", "Merchant", "Amount (INR)", "Type", "Category", "Date", "UPI Ref"];
    const rows = filteredTransactions.map(t => [
      t.id,
      `"${t.merchant}"`,
      t.amount,
      t.type,
      `"${t.category}"`,
      `"${t.date}"`,
      t.upiRef
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Vault_Passbook_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Passbook CSV downloaded");
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Header title & Export button */}
      <div className="flex justify-between items-start pb-3 border-b border-vault-rule">
        <div>
          <h2 className="text-lg font-bold text-vault-ink dark:text-vault-text tracking-tight font-sans">
            Activity & Transactions
          </h2>
          <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5 font-mono">
            Transaction history and account activity
          </p>
        </div>

        <button
          type="button"
          aria-label="Export activity as CSV statement"
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-vault-surface border border-vault-rule hover:border-vault-reserveBlue text-vault-ink dark:text-vault-text rounded-lg text-xs font-mono font-bold transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-vault-reserveBlue" />
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

      {/* Transaction List */}
      <div className="bg-vault-surface border border-vault-rule rounded-xl overflow-hidden">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => (
            <TransactionRow 
              key={tx.id}
              tx={tx}
              onClick={() => setSelectedTransaction(tx)}
            />
          ))
        ) : (
          <div className="py-12 px-4 text-center text-vault-muted dark:text-vault-mutedDark space-y-1 font-mono">
            <p className="text-xs font-bold text-vault-ink dark:text-vault-text font-sans">No transactions found</p>
            <p className="text-xs">Adjust your search terms or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};


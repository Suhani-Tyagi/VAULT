import React, { useState, useMemo } from 'react';
import { Search, Download, Filter, ArrowUpRight, ArrowDownLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
    link.setAttribute("download", `Vault_Statement_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Statement CSV downloaded");
  };

  return (
    <div className="space-y-4">
      {/* Header title & CSV Download button */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-vault-charcoal dark:text-vault-text tracking-tight">Activity & Transactions</h2>
          <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5">
            Full ledger of past transfers and receipts
          </p>
        </div>

        <button
          type="button"
          aria-label="Export activity as CSV statement"
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-3 py-2 bg-vault-surfaceHighlight border border-vault-border hover:border-vault-bronze text-vault-charcoal dark:text-vault-text rounded-xl text-xs font-bold transition-all shadow-xs focus:ring-2 focus:ring-vault-bronze"
        >
          <Download className="w-4 h-4 text-vault-bronze" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Search Input & Category Filter Tabs */}
      <div className="bg-vault-surface border border-vault-border rounded-2xl p-3 space-y-2.5 shadow-xs">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3 text-vault-muted dark:text-vault-mutedDark pointer-events-none" />
          <input 
            type="text"
            placeholder="Search merchant, category, or note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search transactions"
            className="w-full bg-vault-paper border border-vault-border rounded-xl pl-9 pr-3 py-2 text-xs text-vault-charcoal dark:text-vault-text placeholder-vault-muted focus:outline-none focus:border-vault-bronze"
          />
        </div>

        <div className="flex gap-1.5 text-xs font-semibold overflow-x-auto no-scrollbar">
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
              className={`flex-1 min-w-[70px] py-1.5 rounded-xl transition-all ${
                selectedFilter === filter.id 
                  ? 'bg-vault-bronze text-white font-bold shadow-xs' 
                  : 'bg-vault-paper border border-vault-border text-vault-muted dark:text-vault-mutedDark hover:text-vault-charcoal dark:hover:text-vault-text'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-vault-surface border border-vault-border rounded-2xl divide-y divide-vault-border overflow-hidden shadow-xs">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => (
            <TransactionRow 
              key={tx.id}
              tx={tx}
              onClick={() => setSelectedTransaction(tx)}
            />
          ))
        ) : (
          <div className="py-12 px-4 text-center text-vault-muted dark:text-vault-mutedDark space-y-2">
            <p className="text-sm font-bold text-vault-charcoal dark:text-vault-text">No transactions found</p>
            <p className="text-xs">Try adjusting your search query or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

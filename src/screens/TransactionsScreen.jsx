import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, X, Copy, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { useDevice } from '../context/DeviceContext';
import { TransactionRow } from '../components/TransactionRow';

const ITEMS_PER_PAGE = 8;

export const TransactionsScreen = () => {
  const { transactions, setSelectedTransaction, showToast } = useVault();
  const { deviceType } = useDevice();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [contextMenu, setContextMenu] = useState(null);

  const categories = [
    'All',
    'Food & Dining',
    'Groceries',
    'Shopping',
    'Utilities',
    'Subscriptions',
    'Refund',
    'Transfers'
  ];

  const filteredTxs = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = 
        tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.note && tx.note.toLowerCase().includes(searchTerm.toLowerCase())) ||
        tx.upiRef.includes(searchTerm);

      const matchesCategory = selectedCategory === 'All' || 
        (selectedCategory === 'Refund' ? tx.type === 'refund' : tx.category === selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [transactions, searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredTxs.length / ITEMS_PER_PAGE) || 1;
  const validPage = Math.min(currentPage, totalPages);

  const paginatedTxs = useMemo(() => {
    const start = (validPage - 1) * ITEMS_PER_PAGE;
    return filteredTxs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTxs, validPage]);

  const groupedTxs = useMemo(() => {
    const groups = {};
    paginatedTxs.forEach(tx => {
      const dateKey = tx.date.split(',')[0];
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(tx);
    });
    return groups;
  }, [paginatedTxs]);

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    if (filteredTxs.length === 0) return;

    const headers = ["ID", "Merchant", "Category", "Amount (INR)", "Type", "Date", "Running Balance", "Method", "UPI Reference", "Note"];
    const rows = filteredTxs.map(t => [
      t.id,
      `"${t.merchant.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      t.amount,
      t.type,
      `"${t.date}"`,
      t.runningBalance,
      `"${t.method}"`,
      `"${t.upiRef}"`,
      `"${(t.note || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Vault_Statement_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filteredTxs.length} transactions to CSV`);
  };

  const handleContextMenu = (e, tx) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      tx
    });
  };

  const handleCopyRefFromContext = (upiRef) => {
    navigator.clipboard.writeText(upiRef);
    showToast("UPI Reference ID copied to clipboard");
    setContextMenu(null);
  };

  return (
    <div className="space-y-4" onClick={() => contextMenu && setContextMenu(null)}>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-vault-charcoal dark:text-vault-text tracking-tight">Activity & Transactions</h2>
          <p className="text-xs text-vault-muted mt-0.5">
            Real-time ledger with pagination & running balances
          </p>
        </div>

        {deviceType === 'desktop' && (
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-vault-surface border border-vault-border hover:bg-vault-surfaceHighlight text-vault-charcoal dark:text-vault-text rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Download className="w-4 h-4 text-vault-terracotta" />
            <span>Export Statement (CSV)</span>
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-vault-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Search merchant, category, or note..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full bg-vault-surface border border-vault-border rounded-xl pl-10 pr-9 py-2.5 text-xs text-vault-charcoal dark:text-vault-text placeholder-vault-muted focus:outline-none focus:border-vault-terracotta transition-colors shadow-xs"
        />
        {searchTerm && (
          <button 
            type="button"
            aria-label="Clear search query"
            onClick={() => handleSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-vault-muted hover:text-vault-charcoal"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 pt-0.5">
        {categories.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-vault-terracotta text-white shadow-sm' 
                  : 'bg-vault-surface text-vault-muted hover:text-vault-charcoal dark:hover:text-vault-text border border-vault-border'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {Object.keys(groupedTxs).length > 0 ? (
        <div className="space-y-4">
          {Object.entries(groupedTxs).map(([dateGroup, items]) => (
            <div key={dateGroup} className="space-y-1.5">
              <div className="flex justify-between items-center px-1 text-[11px] font-bold text-vault-muted uppercase tracking-wider">
                <span>{dateGroup}</span>
                <span className="text-vault-subtle font-mono">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
              </div>

              <div className="bg-vault-surface border border-vault-border rounded-2xl divide-y divide-vault-border overflow-hidden shadow-xs">
                {items.map(tx => (
                  <TransactionRow 
                    key={tx.id}
                    tx={tx}
                    onClick={() => setSelectedTransaction(tx)}
                    onContextMenu={(e) => handleContextMenu(e, tx)}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-2 px-1 text-xs">
              <span className="text-vault-muted font-medium">
                Page <strong className="text-vault-charcoal dark:text-vault-text">{validPage}</strong> of <strong className="text-vault-charcoal dark:text-vault-text">{totalPages}</strong> ({filteredTxs.length} total)
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={validPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-2 bg-vault-surface border border-vault-border rounded-xl text-vault-charcoal dark:text-vault-text disabled:opacity-40 hover:bg-vault-surfaceHighlight focus:ring-2 focus:ring-vault-terracotta"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next page"
                  disabled={validPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-2 bg-vault-surface border border-vault-border rounded-xl text-vault-charcoal dark:text-vault-text disabled:opacity-40 hover:bg-vault-surfaceHighlight focus:ring-2 focus:ring-vault-terracotta"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-12 px-4 text-center bg-vault-surface border border-vault-border rounded-2xl space-y-2">
          <div className="w-12 h-12 bg-vault-paper rounded-full flex items-center justify-center mx-auto text-vault-muted border border-vault-border">
            <Filter className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-vault-charcoal dark:text-vault-text">No transactions found</h4>
          <p className="text-xs text-vault-muted max-w-xs mx-auto">
            "No transactions match your current search or category filter."
          </p>
          <button 
            type="button"
            onClick={() => { handleSearchChange(''); handleCategoryChange('All'); }}
            className="mt-2 text-xs text-vault-terracotta hover:underline font-bold"
          >
            Clear all filters
          </button>
        </div>
      )}

      {contextMenu && (
        <div 
          className="fixed z-50 bg-vault-surface border border-vault-border rounded-xl shadow-xl py-1 w-48 text-xs font-bold text-vault-charcoal dark:text-vault-text animate-in fade-in"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            type="button"
            onClick={() => handleCopyRefFromContext(contextMenu.tx.upiRef)}
            className="w-full text-left px-3 py-2 hover:bg-vault-terracottaLight hover:text-vault-terracotta flex items-center gap-2"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Reference ID</span>
          </button>
          <button
            type="button"
            onClick={() => { setSelectedTransaction(contextMenu.tx); setContextMenu(null); }}
            className="w-full text-left px-3 py-2 hover:bg-vault-terracottaLight hover:text-vault-terracotta flex items-center gap-2 border-t border-vault-border"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, X, Copy, Eye, Check } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { useDevice } from '../context/DeviceContext';
import { CategoryIcon } from '../components/CategoryIcon';

export const TransactionsScreen = () => {
  const { transactions, setSelectedTransaction, showToast } = useVault();
  const { deviceType } = useDevice();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Custom right-click context menu state
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

  const groupedTxs = useMemo(() => {
    const groups = {};
    filteredTxs.forEach(tx => {
      const dateKey = tx.date.split(',')[0];
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(tx);
    });
    return groups;
  }, [filteredTxs]);

  // Client-Side CSV Export (Point 5 Requirement for Desktop)
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

  // Right-Click Context Menu Handler (Point 2 Requirement for Desktop)
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
      {/* Header title + CSV Export button on Desktop */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-vault-charcoal dark:text-vault-text tracking-tight">Activity & Transactions</h2>
          <p className="text-xs text-vault-muted mt-0.5">
            Real-time ledger with full running balances
          </p>
        </div>

        {/* Desktop-only CSV Export button */}
        {deviceType === 'desktop' && (
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-vault-surface border border-vault-border hover:bg-vault-surfaceHighlight text-vault-charcoal dark:text-vault-text rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Download className="w-4 h-4 text-vault-terracotta" />
            <span>Export Statement (CSV)</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-vault-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Search merchant, category, or note..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-vault-surface border border-vault-border rounded-xl pl-10 pr-9 py-2.5 text-xs text-vault-charcoal dark:text-vault-text placeholder-vault-muted focus:outline-none focus:border-vault-terracotta transition-colors shadow-xs"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-vault-muted hover:text-vault-charcoal"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Category Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 pt-0.5">
        {categories.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
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

      {/* Grouped Transactions List */}
      {Object.keys(groupedTxs).length > 0 ? (
        <div className="space-y-4">
          {Object.entries(groupedTxs).map(([dateGroup, items]) => (
            <div key={dateGroup} className="space-y-1.5">
              <div className="flex justify-between items-center px-1 text-[11px] font-bold text-vault-muted uppercase tracking-wider">
                <span>{dateGroup}</span>
                <span className="text-vault-subtle font-mono">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
              </div>

              <div className="bg-vault-surface border border-vault-border rounded-2xl divide-y divide-vault-border overflow-hidden shadow-xs">
                {items.map(tx => {
                  const isCredit = tx.type === 'credit';
                  const isRefund = tx.type === 'refund';

                  return (
                    <div 
                      key={tx.id}
                      onClick={() => setSelectedTransaction(tx)}
                      onContextMenu={(e) => handleContextMenu(e, tx)}
                      className="p-3.5 flex items-center justify-between hover:bg-vault-surfaceHighlight/70 active:scale-[0.99] transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <CategoryIcon 
                          iconName={tx.icon} 
                          category={tx.category} 
                          type={tx.type} 
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-vault-charcoal dark:text-vault-text truncate flex items-center gap-1.5">
                            <span className="truncate">{tx.merchant}</span>
                            {isRefund && (
                              <span className="text-[9px] bg-vault-terracottaLight text-vault-terracotta px-1.5 py-0.2 rounded border border-vault-terracotta/30 shrink-0 font-bold">
                                Refund
                              </span>
                            )}
                          </h4>
                          <p className="text-[11px] text-vault-muted truncate mt-0.5">
                            {tx.date} • {tx.method}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className={`text-xs font-display font-bold tabular-nums ${
                          isRefund ? 'text-vault-terracotta' : isCredit ? 'text-vault-sage' : 'text-vault-charcoal dark:text-vault-text'
                        }`}>
                          {isRefund ? '+₹' : isCredit ? '+₹' : '-₹'}
                          {tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-[10px] text-vault-subtle tabular-nums mt-0.5">
                          Bal: ₹{tx.runningBalance.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 px-4 text-center bg-vault-surface border border-vault-border rounded-2xl space-y-2">
          <div className="w-12 h-12 bg-vault-paper rounded-full flex items-center justify-center mx-auto text-vault-muted border border-vault-border">
            <Filter className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-vault-charcoal dark:text-vault-text">No transactions found</h4>
          <p className="text-xs text-vault-muted max-w-xs mx-auto">
            "No transactions yet. Once you spend or receive money in this category, you'll see it here."
          </p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
            className="mt-2 text-xs text-vault-terracotta hover:underline font-bold"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Right-Click Context Menu Popup */}
      {contextMenu && (
        <div 
          className="fixed z-50 bg-vault-surface border border-vault-border rounded-xl shadow-xl py-1 w-48 text-xs font-bold text-vault-charcoal dark:text-vault-text animate-in fade-in"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            onClick={() => handleCopyRefFromContext(contextMenu.tx.upiRef)}
            className="w-full text-left px-3 py-2 hover:bg-vault-terracottaLight hover:text-vault-terracotta flex items-center gap-2"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Reference ID</span>
          </button>
          <button
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

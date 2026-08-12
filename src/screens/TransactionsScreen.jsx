import React, { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { CategoryIcon } from '../components/CategoryIcon';

export const TransactionsScreen = () => {
  const { transactions, setSelectedTransaction } = useVault();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  return (
    <div className="space-y-4">
      {/* Header title */}
      <div>
        <h2 className="text-xl font-bold text-vault-charcoal tracking-tight">Activity & Transactions</h2>
        <p className="text-xs text-vault-muted mt-0.5">
          Real-time ledger with full running balances
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-vault-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Search merchant, category, or note..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-vault-surface border border-vault-border rounded-xl pl-10 pr-9 py-2.5 text-xs text-vault-charcoal placeholder-vault-muted focus:outline-none focus:border-vault-terracotta transition-colors shadow-xs"
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
                  : 'bg-vault-surface text-vault-muted hover:text-vault-charcoal border border-vault-border'
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
                      className="p-3.5 flex items-center justify-between hover:bg-vault-surfaceHighlight/70 active:scale-[0.99] transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <CategoryIcon 
                          iconName={tx.icon} 
                          category={tx.category} 
                          type={tx.type} 
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-vault-charcoal truncate flex items-center gap-1.5">
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
                          isRefund ? 'text-vault-terracotta' : isCredit ? 'text-vault-sage' : 'text-vault-charcoal'
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
          <h4 className="text-sm font-bold text-vault-charcoal">No transactions found</h4>
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
    </div>
  );
};

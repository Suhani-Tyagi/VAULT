import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Home, ArrowLeftRight, Send, Users, Target, PieChart, User, ArrowRight, X } from 'lucide-react';
import { useVault } from '../context/VaultContext';

export const CommandPalette = ({ isOpen, onClose }) => {
  const { setActiveTab, contacts, transactions, setSelectedTransaction } = useVault();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const screens = [
    { id: 'home', label: 'Home Overview', icon: Home, category: 'Screens' },
    { id: 'transactions', label: 'Activity & Passbook', icon: ArrowLeftRight, category: 'Screens' },
    { id: 'send', label: 'Pay & Transfer', icon: Send, category: 'Screens' },
    { id: 'split', label: 'Split a Bill', icon: Users, category: 'Screens' },
    { id: 'goals', label: 'Savings Goals', icon: Target, category: 'Screens' },
    { id: 'insights', label: 'Spending Insights', icon: PieChart, category: 'Screens' },
    { id: 'profile', label: 'Profile & Security Settings', icon: User, category: 'Screens' },
  ];


  const filteredScreens = screens.filter(s => s.label.toLowerCase().includes(query.toLowerCase()));
  const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.upiId.toLowerCase().includes(query.toLowerCase()));
  const filteredTxs = transactions.filter(t => t.merchant.toLowerCase().includes(query.toLowerCase()) || t.category.toLowerCase().includes(query.toLowerCase()));

  const handleSelectScreen = (screenId) => {
    setActiveTab(screenId);
    onClose();
  };

  const handleSelectTx = (tx) => {
    setSelectedTransaction(tx);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 p-4 font-sans">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="w-full max-w-lg bg-vault-surface border border-vault-rule rounded-xl shadow-xl overflow-hidden z-50 text-vault-ink dark:text-vault-text flex flex-col max-h-[80vh]"
        >
          {/* Search Header */}
          <div className="p-3 border-b border-vault-rule flex items-center gap-3">
            <Search className="w-4 h-4 text-vault-reserveBlue shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search screens, contacts, or past transfers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Command palette search input"
              className="w-full bg-transparent text-xs font-mono text-vault-ink dark:text-vault-text placeholder-vault-muted focus:outline-none"
            />
            <button 
              onClick={onClose}
              aria-label="Close Command Palette"
              className="p-1 text-vault-muted hover:text-vault-ink rounded hover:bg-vault-surfaceHighlight"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="overflow-y-auto p-2 space-y-2 divide-y divide-vault-rule font-mono text-xs">
            {/* Screens Section */}
            {filteredScreens.length > 0 && (
              <div className="pt-1.5 first:pt-0">
                <p className="text-[10px] font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider px-3 mb-1 font-mono">
                  Navigation
                </p>
                {filteredScreens.map(s => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleSelectScreen(s.id)}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-vault-surfaceHighlight text-xs transition-colors text-left group"
                    >
                      <div className="flex items-center gap-2.5 font-sans font-bold">
                        <Icon className="w-4 h-4 text-vault-reserveBlue" />
                        <span>{s.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-vault-muted group-hover:text-vault-reserveBlue transition-colors" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Contacts Section */}
            {filteredContacts.length > 0 && (
              <div className="pt-2">
                <p className="text-[10px] font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider px-3 mb-1 font-mono">
                  Contacts & UPI Handles
                </p>
                {filteredContacts.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectScreen('send')}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-vault-surfaceHighlight text-xs transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={c.avatar} alt={c.name} className="w-6 h-6 rounded-full object-cover shrink-0 border border-vault-rule" />
                      <div>
                        <p className="font-bold text-vault-ink dark:text-vault-text font-sans">{c.name}</p>
                        <p className="text-[10px] text-vault-muted font-mono">{c.upiId}</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-vault-paper border border-vault-rule text-vault-reserveBlue px-2 py-0.5 rounded font-bold font-mono">
                      Pay
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Transactions Section */}
            {filteredTxs.length > 0 && (
              <div className="pt-2">
                <p className="text-[10px] font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider px-3 mb-1 font-mono">
                  Past Activity
                </p>
                {filteredTxs.slice(0, 4).map(t => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTx(t)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-vault-surfaceHighlight text-xs transition-colors text-left font-mono"
                  >
                    <div>
                      <p className="font-bold text-vault-ink dark:text-vault-text font-sans">{t.merchant}</p>
                      <p className="text-[10px] text-vault-muted font-mono">{t.date} • {t.category}</p>
                    </div>
                    <span className="font-mono font-bold tabular-nums text-vault-ink dark:text-vault-text">
                      ₹{t.amount.toLocaleString('en-IN')}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer hint */}
          <div className="p-2 border-t border-vault-rule bg-vault-paper text-[10px] font-mono text-vault-muted dark:text-vault-mutedDark flex justify-between items-center">
            <span>Use ↑↓ to navigate, Enter to select</span>
            <kbd className="px-1.5 py-0.5 bg-vault-surface border border-vault-rule rounded font-mono font-bold">ESC</kbd>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


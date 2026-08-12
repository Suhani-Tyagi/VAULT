import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Home, ArrowLeftRight, Send, Users, Target, PieChart, User, ArrowRight, CornerDownLeft, X } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { useDevice } from '../context/DeviceContext';

export const CommandPalette = ({ isOpen, onClose }) => {
  const { setActiveTab, contacts, transactions, setSelectedTransaction } = useVault();
  const { modKey } = useDevice();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const screens = [
    { id: 'home', label: 'Go to Home Dashboard', icon: Home },
    { id: 'transactions', label: 'Go to Activity & Transactions', icon: ArrowLeftRight },
    { id: 'send', label: 'Go to Send Money', icon: Send },
    { id: 'split', label: 'Go to Split a Bill', icon: Users },
    { id: 'goals', label: 'Go to Savings Goals', icon: Target },
    { id: 'insights', label: 'Go to Spending Insights', icon: PieChart },
    { id: 'profile', label: 'Go to Profile & Settings', icon: User },
  ];

  const matchingScreens = screens.filter(s => 
    s.label.toLowerCase().includes(query.toLowerCase())
  );

  const matchingContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.upiId.toLowerCase().includes(query.toLowerCase())
  );

  const matchingTransactions = transactions.filter(t => 
    t.merchant.toLowerCase().includes(query.toLowerCase()) ||
    t.category.toLowerCase().includes(query.toLowerCase()) ||
    (t.note && t.note.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 5);

  const handleSelectScreen = (screenId) => {
    setActiveTab(screenId);
    onClose();
  };

  const handleSelectContact = (contact) => {
    setActiveTab('send');
    onClose();
  };

  const handleSelectTx = (tx) => {
    setSelectedTransaction(tx);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-xs">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />

        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-xl bg-vault-surface border border-vault-border rounded-2xl shadow-2xl overflow-hidden z-10 text-vault-charcoal dark:text-vault-text"
        >
          {/* Search input header */}
          <div className="flex items-center px-4 py-3.5 border-b border-vault-border">
            <Search className="w-5 h-5 text-vault-muted dark:text-vault-mutedDark mr-3 shrink-0" />
            <input 
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search screens, contacts, or transactions... (${modKey}K)`}
              className="w-full bg-transparent text-sm font-medium text-vault-charcoal dark:text-vault-text placeholder-vault-muted focus:outline-none"
            />
            <button 
              onClick={onClose}
              className="p-1 text-vault-muted dark:text-vault-mutedDark hover:text-vault-charcoal dark:hover:text-vault-text rounded-lg hover:bg-vault-surfaceHighlight"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results list */}
          <div className="max-h-96 overflow-y-auto p-2 space-y-4">
            {/* Screens */}
            {matchingScreens.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-vault-muted dark:text-vault-mutedDark px-3 py-1">
                  Navigation
                </p>
                <div className="space-y-0.5">
                  {matchingScreens.map(s => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.id}
                        onClick={() => handleSelectScreen(s.id)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-vault-charcoal dark:text-vault-text hover:bg-vault-terracottaLight hover:text-vault-terracotta transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-vault-muted dark:text-vault-mutedDark group-hover:text-vault-terracotta" />
                          <span>{s.label}</span>
                        </div>
                        <CornerDownLeft className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Contacts */}
            {matchingContacts.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-vault-muted dark:text-vault-mutedDark px-3 py-1">
                  Pay Contact
                </p>
                <div className="space-y-0.5">
                  {matchingContacts.map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleSelectContact(c)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-vault-charcoal dark:text-vault-text hover:bg-vault-terracottaLight hover:text-vault-terracotta transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={c.avatar} alt={c.name} className="w-5 h-5 rounded-full object-cover" />
                        <span>Send money to {c.name}</span>
                      </div>
                      <span className="text-[10px] text-vault-muted dark:text-vault-mutedDark font-mono">{c.upiId}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Transactions */}
            {matchingTransactions.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-vault-muted dark:text-vault-mutedDark px-3 py-1">
                  Recent Transactions
                </p>
                <div className="space-y-0.5">
                  {matchingTransactions.map(t => (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTx(t)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-vault-charcoal dark:text-vault-text hover:bg-vault-terracottaLight hover:text-vault-terracotta transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="truncate">{t.merchant} ({t.category})</span>
                      </div>
                      <span className="font-display font-bold tabular-nums shrink-0">₹{t.amount}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {matchingScreens.length === 0 && matchingContacts.length === 0 && matchingTransactions.length === 0 && (
              <div className="py-8 text-center text-xs text-vault-muted dark:text-vault-mutedDark">
                No matching results found for "{query}"
              </div>
            )}
          </div>

          {/* Footer keyboard shortcuts hint */}
          <div className="px-4 py-2 bg-vault-paper border-t border-vault-border flex items-center justify-between text-[11px] text-vault-muted dark:text-vault-mutedDark">
            <span>Use search to jump anywhere in Vault</span>
            <span className="font-mono text-vault-charcoal dark:text-vault-text font-bold">{modKey}K to toggle</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

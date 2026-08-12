import React from 'react';
import { Home, ArrowLeftRight, Send, Target, PieChart, User, ShieldCheck, CheckCircle2, AlertCircle, X, Copy, Check, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVault } from '../../context/VaultContext';
import { CategoryIcon } from '../CategoryIcon';

export const TabletShell = ({ children }) => {
  const { user, activeTab, setActiveTab, selectedTransaction, setSelectedTransaction, toast, showToast } = useVault();
  const [copied, setCopied] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'transactions', label: 'Activity', icon: ArrowLeftRight },
    { id: 'send', label: 'Pay & Split', icon: Send },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'insights', label: 'Insights', icon: PieChart },
    { id: 'profile', label: 'Settings', icon: User },
  ];

  const handleCopyRef = (refId) => {
    navigator.clipboard.writeText(refId);
    setCopied(true);
    showToast("UPI Reference ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] dark:bg-[#0C0E12] text-vault-ink dark:text-vault-text flex">
      {/* Left Navigation Rail */}
      <aside className="w-20 sm:w-24 bg-vault-surface border-r border-vault-rule flex flex-col items-center py-6 shrink-0 select-none font-mono">
        <div className="w-10 h-10 rounded-xl bg-vault-reserveBlue text-white flex items-center justify-center font-serif font-bold text-lg mb-8 shadow-xs">
          V
        </div>

        <nav className="flex-1 flex flex-col gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'send' && activeTab === 'split');

            return (
              <button
                key={item.id}
                type="button"
                aria-label={`Navigate to ${item.label}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-vault-reserveBlue text-white shadow-xs font-bold scale-105' 
                    : 'text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink dark:hover:text-vault-text hover:bg-vault-surfaceHighlight'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-mono">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User profile avatar footer button */}
        <button 
          type="button"
          aria-label="Profile Settings"
          onClick={() => setActiveTab('profile')}
          className="relative rounded-full p-0.5 ring-2 ring-vault-reserveBlue/40 hover:ring-vault-reserveBlue transition-all"
        >
          <img src={user.profilePic} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Tablet Header Bar */}
        <header className="h-16 px-6 bg-vault-surface border-b border-vault-rule flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-lg font-bold text-vault-ink dark:text-vault-text">
              Vault Tablet Passbook
            </h1>
            <span className="text-[10px] font-mono font-bold tracking-widest text-vault-reserveBlue bg-vault-reserveBlueLight px-2.5 py-0.5 rounded border border-vault-reserveBlue/20">
              UPI TABLET MODE
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono">
            <div className="text-right">
              <p className="text-xs font-bold text-vault-ink dark:text-vault-text font-sans">{user.name}</p>
              <p className="text-[11px] text-vault-muted dark:text-vault-mutedDark">{user.upiId}</p>
            </div>
          </div>
        </header>

        {/* Scrollable Viewport Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Right Side Panel Transaction Detail Drawer */}
      <AnimatePresence>
        {selectedTransaction && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className="w-80 bg-vault-surface border-l border-vault-rule p-6 shadow-2xl overflow-y-auto shrink-0 z-40 relative flex flex-col text-vault-ink dark:text-vault-text"
          >
            <button 
              onClick={() => setSelectedTransaction(null)}
              aria-label="Close details"
              className="absolute top-5 right-5 p-2 text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink dark:hover:text-vault-text rounded-full hover:bg-vault-surfaceHighlight"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mt-6 mb-6">
              <CategoryIcon 
                iconName={selectedTransaction.icon} 
                category={selectedTransaction.category} 
                type={selectedTransaction.type}
                className="w-7 h-7"
                bgSize="w-16 h-16 mb-3"
              />

              <h3 className="font-serif text-lg font-bold text-vault-ink dark:text-vault-text">
                {selectedTransaction.merchant}
              </h3>
              <p className="text-xs text-vault-muted dark:text-vault-mutedDark font-mono mt-0.5">{selectedTransaction.date}</p>

              <div className="mt-4 text-2xl font-mono font-bold tabular-nums">
                <span className={selectedTransaction.type === 'refund' ? "text-vault-reserveBlue" : selectedTransaction.type === 'credit' ? "text-vault-emerald font-extrabold" : "text-vault-ink dark:text-vault-text"}>
                  {selectedTransaction.type === 'debit' ? '-₹' : '+₹'}
                  {selectedTransaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="bg-vault-paper border border-vault-rule rounded-xl p-4 space-y-3 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-vault-rule">
                <span className="text-vault-muted dark:text-vault-mutedDark">Running Balance</span>
                <span className="font-bold tabular-nums text-vault-ink dark:text-vault-text">₹{selectedTransaction.runningBalance.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-vault-rule">
                <span className="text-vault-muted dark:text-vault-mutedDark">Payment Method</span>
                <span className="font-bold text-vault-ink dark:text-vault-text">{selectedTransaction.method}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-vault-muted dark:text-vault-mutedDark">UPI Ref ID</span>
                <button onClick={() => handleCopyRef(selectedTransaction.upiRef)} className="font-bold text-vault-reserveBlue hover:underline">
                  {selectedTransaction.upiRef}
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-vault-surface border border-vault-reserveBlue/40 text-vault-ink dark:text-vault-text px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 font-mono">
          <CheckCircle2 className="w-5 h-5 text-vault-emerald" />
          <p className="text-xs font-semibold">{toast.message}</p>
        </div>
      )}
    </div>
  );
};

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
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0D1117] text-vault-charcoal dark:text-vault-text flex">
      {/* Left Navigation Rail */}
      <aside className="w-20 sm:w-24 bg-vault-surface border-r border-vault-border flex flex-col items-center py-6 shrink-0 select-none">
        <div className="w-10 h-10 rounded-2xl bg-vault-bronze text-white flex items-center justify-center font-display font-bold text-lg mb-8 shadow-md shadow-vault-bronze/30">
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
                className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
                  isActive 
                    ? 'bg-vault-bronze text-white shadow-md shadow-vault-bronze/20 scale-105' 
                    : 'text-vault-muted dark:text-vault-mutedDark hover:text-vault-charcoal dark:hover:text-vault-text hover:bg-vault-surfaceHighlight'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-bold">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User profile avatar footer button */}
        <button 
          type="button"
          aria-label="Profile Settings"
          onClick={() => setActiveTab('profile')}
          className="relative rounded-full p-0.5 ring-2 ring-vault-bronze/40 hover:ring-vault-bronze transition-all"
        >
          <img src={user.profilePic} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Tablet Header Bar */}
        <header className="h-16 px-6 bg-vault-surface border-b border-vault-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-vault-charcoal dark:text-vault-text">
              Vault Tablet Workspace
            </h1>
            <span className="text-[10px] font-bold font-mono tracking-widest text-vault-bronze bg-vault-bronzeLight px-2.5 py-1 rounded-full border border-vault-bronze/20">
              UPI TABLET MODE
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-vault-charcoal dark:text-vault-text">{user.name}</p>
              <p className="text-[11px] text-vault-muted dark:text-vault-mutedDark font-mono">{user.upiId}</p>
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
            className="w-80 bg-vault-surface border-l border-vault-border p-6 shadow-2xl overflow-y-auto shrink-0 z-40 relative flex flex-col text-vault-charcoal dark:text-vault-text"
          >
            <button 
              onClick={() => setSelectedTransaction(null)}
              aria-label="Close details"
              className="absolute top-5 right-5 p-2 text-vault-muted dark:text-vault-mutedDark hover:text-vault-charcoal dark:hover:text-vault-text rounded-full hover:bg-vault-surfaceHighlight"
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

              <h3 className="text-lg font-bold text-vault-charcoal dark:text-vault-text">
                {selectedTransaction.merchant}
              </h3>
              <p className="text-xs text-vault-muted dark:text-vault-mutedDark font-mono mt-0.5">{selectedTransaction.date}</p>

              <div className="mt-4 text-2xl font-display font-extrabold tabular-nums">
                <span className={selectedTransaction.type === 'refund' ? "text-vault-bronze" : selectedTransaction.type === 'credit' ? "text-vault-teal font-extrabold" : "text-vault-charcoal dark:text-vault-text"}>
                  {selectedTransaction.type === 'debit' ? '-₹' : '+₹'}
                  {selectedTransaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="bg-vault-paper border border-vault-border rounded-2xl p-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-vault-border">
                <span className="text-vault-muted dark:text-vault-mutedDark">Running Balance</span>
                <span className="font-bold font-display tabular-nums text-vault-charcoal dark:text-vault-text">₹{selectedTransaction.runningBalance.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-vault-border">
                <span className="text-vault-muted dark:text-vault-mutedDark">Payment Method</span>
                <span className="font-semibold text-vault-charcoal dark:text-vault-text">{selectedTransaction.method}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-vault-muted dark:text-vault-mutedDark">UPI Ref ID</span>
                <button onClick={() => handleCopyRef(selectedTransaction.upiRef)} className="font-mono text-vault-bronze hover:underline">
                  {selectedTransaction.upiRef}
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-vault-surface border border-vault-bronze/40 text-vault-charcoal dark:text-vault-text px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-vault-teal" />
          <p className="text-xs font-semibold">{toast.message}</p>
        </div>
      )}
    </div>
  );
};

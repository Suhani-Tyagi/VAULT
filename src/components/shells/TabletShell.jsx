import React from 'react';
import { Home, ArrowLeftRight, Send, Target, PieChart, User, CheckCircle2, X } from 'lucide-react';
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
    <div className="min-h-screen bg-vault-paper dark:bg-[#141210] text-vault-ink dark:text-vault-text flex font-sans">

      {/* Left Navigation Rail */}
      <aside className="w-20 bg-vault-surface border-r border-vault-rule flex flex-col items-center py-5 shrink-0 select-none font-mono">
        <div className="w-8 h-8 rounded-md bg-vault-reserveBlue text-white flex items-center justify-center font-bold text-xs mb-6">
          V
        </div>

        <nav className="flex-1 flex flex-col gap-2 w-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'send' && activeTab === 'split');

            return (
              <button
                key={item.id}
                type="button"
                aria-label={`Navigate to ${item.label}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center py-2.5 px-2 rounded-lg transition-colors text-center ${
                  isActive 
                    ? 'bg-vault-surfaceHighlight text-vault-reserveBlue font-bold border-l-2 border-vault-reserveBlue' 
                    : 'text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink dark:hover:text-vault-text hover:bg-vault-surfaceHighlight/50'
                }`}
              >
                <Icon className="w-4 h-4 mb-1" />
                <span className="text-[10px] font-mono leading-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User profile avatar button */}
        <button 
          type="button"
          aria-label="Profile Settings"
          onClick={() => setActiveTab('profile')}
          className="rounded-full p-0.5 border border-vault-rule hover:border-vault-reserveBlue transition-colors"
        >
          <img src={user.profilePic} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Tablet Header Bar */}
        <header className="h-14 px-6 bg-vault-surface border-b border-vault-rule flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-vault-ink dark:text-vault-text">
              VAULT
            </h1>
            <span className="text-[10px] font-mono text-vault-muted dark:text-vault-mutedDark border-l border-vault-rule pl-2">
              Tablet View
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="text-right">
              <p className="font-bold text-vault-ink dark:text-vault-text font-sans">{user.name}</p>
              <p className="text-[10px] text-vault-muted dark:text-vault-mutedDark">{user.upiId}</p>
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
            transition={{ duration: 0.2 }}
            className="w-80 bg-vault-surface border-l border-vault-rule p-5 shadow-lg overflow-y-auto shrink-0 z-40 relative flex flex-col text-vault-ink dark:text-vault-text"
          >
            <button 
              onClick={() => setSelectedTransaction(null)}
              aria-label="Close details"
              className="absolute top-4 right-4 p-1.5 text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink dark:hover:text-vault-text rounded-md hover:bg-vault-surfaceHighlight"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center mt-4 mb-5">
              <CategoryIcon 
                iconName={selectedTransaction.icon} 
                category={selectedTransaction.category} 
                type={selectedTransaction.type}
                className="w-6 h-6"
                bgSize="w-12 h-12 mb-2"
              />

              <h3 className="text-sm font-bold text-vault-ink dark:text-vault-text">
                {selectedTransaction.merchant}
              </h3>
              <p className="text-xs text-vault-muted dark:text-vault-mutedDark font-mono mt-0.5">{selectedTransaction.date}</p>

              <div className="mt-3 text-xl font-mono font-bold tabular-nums">
                <span className={selectedTransaction.type === 'refund' ? "text-vault-reserveBlue" : selectedTransaction.type === 'credit' ? "text-vault-emerald font-extrabold" : "text-vault-ink dark:text-vault-text"}>
                  {selectedTransaction.type === 'debit' ? '-₹' : '+₹'}
                  {selectedTransaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="bg-vault-paper border border-vault-rule rounded-lg p-3 space-y-2.5 text-xs font-mono">
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
        <div className="fixed bottom-6 right-6 z-50 bg-vault-surface border border-vault-rule text-vault-ink dark:text-vault-text px-3.5 py-2.5 rounded-lg shadow-md flex items-center gap-2.5 font-mono text-xs">
          <CheckCircle2 className="w-4 h-4 text-vault-emerald" />
          <p className="font-medium">{toast.message}</p>
        </div>
      )}
    </div>
  );
};


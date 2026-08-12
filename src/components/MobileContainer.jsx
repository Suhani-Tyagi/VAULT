import React, { useState, useEffect } from 'react';
import { Wifi, Battery, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { TransactionDrawer } from './TransactionDrawer';

export const MobileContainer = ({ children }) => {
  const { user, activeTab, setActiveTab, selectedTransaction, setSelectedTransaction, toast } = useVault();
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0D1117] text-vault-charcoal dark:text-vault-text flex justify-center items-center sm:py-6 sm:px-4">
      {/* Mobile Frame Container */}
      <div className="w-full sm:max-w-[420px] min-h-screen sm:min-h-[860px] sm:h-[860px] bg-vault-paper sm:rounded-[40px] sm:border-[8px] sm:border-slate-800 shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Status Bar */}
        <header className="sticky top-0 z-30 bg-vault-paper/90 backdrop-blur-md px-5 pt-3 pb-2 flex items-center justify-between border-b border-vault-border select-none">
          <span className="text-xs font-display font-bold text-vault-charcoal dark:text-vault-text tracking-wide">
            {time || '9:41'}
          </span>

          <div className="flex items-center gap-2.5 text-vault-muted dark:text-vault-mutedDark">
            <span className="text-[10px] font-bold tracking-widest text-vault-bronze bg-vault-bronzeLight px-2 py-0.5 rounded-full border border-vault-bronze/20 font-mono">
              VAULT • UPI
            </span>
            <Wifi className="w-3.5 h-3.5 text-vault-charcoal dark:text-vault-text" />
            <Battery className="w-4 h-4 text-vault-charcoal dark:text-vault-text" />
          </div>
        </header>

        {/* Top Header */}
        <div className="px-5 py-3 flex items-center justify-between bg-vault-paper border-b border-vault-border">
          <div className="flex items-center gap-3">
            <button 
              type="button"
              aria-label="Go to profile settings"
              onClick={() => setActiveTab('profile')}
              className="relative rounded-full p-0.5 ring-2 ring-vault-bronze/50 hover:ring-vault-bronze transition-all focus:ring-2 focus:ring-vault-bronze"
            >
              <img 
                src={user.profilePic} 
                alt={`${user.name}'s profile avatar`}
                width={36}
                height={36}
                loading="lazy"
                className="w-9 h-9 rounded-full object-cover shrink-0"
              />
            </button>
            <div>
              <p className="text-xs text-vault-muted dark:text-vault-mutedDark font-medium leading-none">Welcome back</p>
              <h2 className="text-sm font-bold text-vault-charcoal dark:text-vault-text leading-tight mt-0.5">{user.name.split(' ')[0]}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              type="button"
              aria-label="View profile & security settings"
              onClick={() => setActiveTab('profile')}
              className={`p-2 rounded-xl transition-all focus:ring-2 focus:ring-vault-bronze ${
                activeTab === 'profile' 
                  ? 'bg-vault-bronzeLight text-vault-bronze border border-vault-bronze/30' 
                  : 'bg-vault-surface text-vault-muted dark:text-vault-mutedDark hover:text-vault-charcoal dark:hover:text-vault-text border border-vault-border'
              }`}
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Main Screen Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-24 px-4 pt-4">
          {children}
        </main>

        {/* Global Toast Notification with Screen Reader Live Region */}
        <div aria-live="polite" className="pointer-events-none">
          {toast && (
            <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[380px] bg-vault-surface border border-vault-bronze/40 text-vault-charcoal dark:text-vault-text px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 pointer-events-auto">
              {toast.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-vault-rose shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-vault-teal shrink-0" />
              )}
              <p className="text-xs font-semibold leading-tight">{toast.message}</p>
            </div>
          )}
        </div>

        {/* Expandable Transaction Detail Drawer */}
        <TransactionDrawer 
          transaction={selectedTransaction} 
          onClose={() => setSelectedTransaction(null)} 
        />
      </div>
    </div>
  );
};

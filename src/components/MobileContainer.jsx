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
    <div className="min-h-screen bg-[#F3F4F6] dark:bg-[#0C0E12] text-vault-ink dark:text-vault-text flex justify-center items-center sm:py-6 sm:px-4">
      {/* Mobile Frame Container */}
      <div className="w-full sm:max-w-[420px] min-h-screen sm:min-h-[860px] sm:h-[860px] bg-vault-paper sm:rounded-[36px] sm:border-[8px] sm:border-slate-800 shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Status Bar */}
        <header className="sticky top-0 z-30 bg-vault-paper/90 backdrop-blur-md px-5 pt-3 pb-2 flex items-center justify-between border-b border-vault-rule select-none font-mono">
          <span className="text-xs font-bold text-vault-ink dark:text-vault-text tracking-wide">
            {time || '9:41'}
          </span>

          <div className="flex items-center gap-2.5 text-vault-muted dark:text-vault-mutedDark">
            <span className="text-[10px] font-bold tracking-widest text-vault-reserveBlue bg-vault-reserveBlueLight px-2 py-0.5 rounded border border-vault-reserveBlue/20">
              VAULT • UPI
            </span>
            <Wifi className="w-3.5 h-3.5 text-vault-ink dark:text-vault-text" />
            <Battery className="w-4 h-4 text-vault-ink dark:text-vault-text" />
          </div>
        </header>

        {/* Top Header */}
        <div className="px-5 py-3 flex items-center justify-between bg-vault-paper border-b border-vault-rule">
          <div className="flex items-center gap-3">
            <button 
              type="button"
              aria-label="Go to profile settings"
              onClick={() => setActiveTab('profile')}
              className="relative rounded-full p-0.5 ring-2 ring-vault-reserveBlue/50 hover:ring-vault-reserveBlue transition-all focus:ring-2 focus:ring-vault-reserveBlue"
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
              <p className="text-xs text-vault-muted dark:text-vault-mutedDark font-medium leading-none font-mono">Welcome back</p>
              <h2 className="text-sm font-bold text-vault-ink dark:text-vault-text leading-tight mt-0.5 font-serif">{user.name.split(' ')[0]}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <button 
              type="button"
              aria-label="View profile & security settings"
              onClick={() => setActiveTab('profile')}
              className={`p-2 rounded-lg transition-all focus:ring-2 focus:ring-vault-reserveBlue ${
                activeTab === 'profile' 
                  ? 'bg-vault-reserveBlueLight text-vault-reserveBlue border border-vault-reserveBlue/30' 
                  : 'bg-vault-surface text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink border border-vault-rule'
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
            <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[380px] bg-vault-surface border border-vault-reserveBlue/40 text-vault-ink dark:text-vault-text px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 pointer-events-auto font-mono">
              {toast.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-vault-rose shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-vault-emerald shrink-0" />
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

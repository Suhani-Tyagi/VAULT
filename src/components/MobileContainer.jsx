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
    <div className="min-h-screen bg-vault-paper dark:bg-[#0C0E12] text-vault-ink dark:text-vault-text flex justify-center items-center sm:py-6 sm:px-4 font-sans">
      {/* Mobile Frame Container */}
      <div className="w-full sm:max-w-[420px] min-h-screen sm:min-h-[860px] sm:h-[860px] bg-vault-paper sm:rounded-2xl sm:border sm:border-vault-rule shadow-lg flex flex-col relative overflow-hidden">
        
        {/* Status Bar */}
        <header className="sticky top-0 z-30 bg-vault-paper px-4 pt-2.5 pb-2 flex items-center justify-between border-b border-vault-rule select-none font-mono text-xs">
          <span className="font-bold text-vault-ink dark:text-vault-text">
            {time || '9:41'}
          </span>

          <div className="flex items-center gap-2 text-vault-muted dark:text-vault-mutedDark">
            <span className="text-[10px] font-bold text-vault-muted dark:text-vault-mutedDark uppercase">
              VAULT
            </span>
            <Wifi className="w-3.5 h-3.5 text-vault-ink dark:text-vault-text" />
            <Battery className="w-4 h-4 text-vault-ink dark:text-vault-text" />
          </div>
        </header>

        {/* Top Header */}
        <div className="px-4 py-2.5 flex items-center justify-between bg-vault-surface border-b border-vault-rule">
          <div className="flex items-center gap-2.5">
            <button 
              type="button"
              aria-label="Go to profile settings"
              onClick={() => setActiveTab('profile')}
              className="rounded-full border border-vault-rule hover:border-vault-reserveBlue transition-colors"
            >
              <img 
                src={user.profilePic} 
                alt={`${user.name}'s profile avatar`}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
            </button>
            <div>
              <p className="text-[10px] text-vault-muted dark:text-vault-mutedDark font-mono">Account</p>
              <h2 className="text-xs font-bold text-vault-ink dark:text-vault-text leading-tight">{user.name.split(' ')[0]}</h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            <button 
              type="button"
              aria-label="View profile & security settings"
              onClick={() => setActiveTab('profile')}
              className={`p-1.5 rounded-md transition-colors ${
                activeTab === 'profile' 
                  ? 'bg-vault-surfaceHighlight text-vault-reserveBlue border border-vault-reserveBlue/30' 
                  : 'bg-vault-paper text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink border border-vault-rule'
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

        {/* Global Toast Notification */}
        <div aria-live="polite" className="pointer-events-none">
          {toast && (
            <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[360px] bg-vault-surface border border-vault-rule text-vault-ink dark:text-vault-text px-3.5 py-2.5 rounded-lg shadow-md flex items-center gap-2.5 pointer-events-auto font-mono text-xs">
              {toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-vault-rose shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-vault-emerald shrink-0" />
              )}
              <p className="font-medium leading-tight">{toast.message}</p>
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


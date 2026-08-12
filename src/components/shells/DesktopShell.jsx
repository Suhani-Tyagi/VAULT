import React, { useState } from 'react';
import { Home, ArrowLeftRight, Send, Target, PieChart, User, Search, ShieldCheck, CheckCircle2, AlertCircle, Command } from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { useDevice } from '../../context/DeviceContext';
import { CommandPalette } from '../CommandPalette';
import { TransactionDrawer } from '../TransactionDrawer';

export const DesktopShell = ({ children }) => {
  const { user, activeTab, setActiveTab, selectedTransaction, setSelectedTransaction, toast } = useVault();
  const { modKey } = useDevice();
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'transactions', label: 'Activity & Ledger', icon: ArrowLeftRight },
    { id: 'send', label: 'Send & Pay', icon: Send },
    { id: 'split', label: 'Split a Bill', icon: UsersIcon },
    { id: 'goals', label: 'Savings Goals', icon: Target },
    { id: 'insights', label: 'Insights & Analytics', icon: PieChart },
    { id: 'profile', label: 'Profile & Security', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F0EAE1] dark:bg-[#060911] text-vault-charcoal dark:text-vault-text flex">
      {/* Desktop Left Sidebar Navigation */}
      <aside className="w-64 bg-vault-surface border-r border-vault-border flex flex-col py-6 px-4 shrink-0 select-none shadow-xs">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-vault-terracotta text-white flex items-center justify-center font-display font-bold text-xl shadow-md shadow-vault-terracotta/30">
            V
          </div>
          <div>
            <h1 className="text-base font-bold text-vault-charcoal dark:text-vault-text leading-none">Vault Bank</h1>
            <p className="text-[11px] text-vault-muted mt-1 font-medium">Calm & Clear Money</p>
          </div>
        </div>

        {/* Search / Command Palette Quick Launcher */}
        <button 
          onClick={() => setShowCommandPalette(true)}
          className="w-full flex items-center justify-between px-3 py-2.5 mb-6 bg-vault-paper border border-vault-border rounded-xl text-xs text-vault-muted hover:text-vault-charcoal hover:border-vault-borderDark transition-all shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-vault-muted" />
            <span>Search or jump...</span>
          </div>
          <kbd className="px-1.5 py-0.5 bg-vault-surfaceHighlight border border-vault-border rounded text-[10px] font-mono font-bold text-vault-charcoal">
            {modKey}K
          </kbd>
        </button>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'send' && activeTab === 'split');

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive 
                    ? 'bg-vault-terracotta text-white shadow-md shadow-vault-terracotta/20 font-bold' 
                    : 'text-vault-muted hover:text-vault-charcoal hover:bg-vault-surfaceHighlight'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Card Footer */}
        <div 
          onClick={() => setActiveTab('profile')}
          className="mt-auto p-3 bg-vault-paper border border-vault-border rounded-2xl flex items-center gap-3 cursor-pointer hover:border-vault-terracotta/40 transition-all"
        >
          <img src={user.profilePic} alt={user.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-vault-terracotta/30" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-vault-charcoal dark:text-vault-text truncate">{user.name}</p>
            <p className="text-[10px] text-vault-muted font-mono truncate">{user.upiId}</p>
          </div>
        </div>
      </aside>

      {/* Desktop Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="h-16 px-8 bg-vault-surface border-b border-vault-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-vault-muted">Desktop Viewport</span>
            <span className="text-[10px] font-bold tracking-widest text-vault-terracotta bg-vault-terracottaLight px-2.5 py-1 rounded-full border border-vault-terracotta/20">
              RBI REGULATED SANDBOX
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCommandPalette(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-vault-paper border border-vault-border rounded-xl text-xs font-semibold text-vault-muted hover:text-vault-charcoal transition-colors"
            >
              <Command className="w-3.5 h-3.5" />
              <span>Command Palette ({modKey}K)</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-vault-muted border-l border-vault-border pl-4">
              <ShieldCheck className="w-4 h-4 text-vault-terracotta" />
              <span className="font-semibold text-vault-charcoal dark:text-vault-text">256-bit Encrypted</span>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Viewport */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Command Palette Modal */}
      <CommandPalette 
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />

      {/* Expandable Transaction Drawer */}
      <TransactionDrawer 
        transaction={selectedTransaction} 
        onClose={() => setSelectedTransaction(null)} 
      />

      {/* Global Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-vault-surface border border-vault-terracotta/40 text-vault-charcoal px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-vault-terracotta" />
          <p className="text-xs font-bold">{toast.message}</p>
        </div>
      )}
    </div>
  );
};

function UsersIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

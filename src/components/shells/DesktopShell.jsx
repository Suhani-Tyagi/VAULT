import React, { useState, useEffect } from 'react';
import { 
  Home, 
  ArrowUpRight, 
  Users, 
  Target, 
  BarChart3, 
  User, 
  ShieldCheck, 
  Search, 
  Plus, 
  Send, 
  Bell, 
  Download, 
  Moon, 
  Sun,
  Lock,
  LogIn,
  LogOut
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { CommandPalette } from '../CommandPalette';
import { TransactionDrawer } from '../TransactionDrawer';
import { LogoutModal } from '../LogoutModal';

export const DesktopShell = ({ children }) => {
  const { user, activeTab, setActiveTab, selectedTransaction, setSelectedTransaction, isLoggedOut, logOut, logIn } = useVault();
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { id: 'home', label: 'Overview', icon: Home },
    { id: 'transactions', label: 'Activity', icon: ArrowUpRight },
    { id: 'send', label: 'Send Money', icon: Send },
    { id: 'split', label: 'Split Bill', icon: Users },
    { id: 'goals', label: 'Savings Goals', icon: Target },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'profile', label: 'Profile & Security', icon: User },
  ];

  if (isLoggedOut) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] dark:bg-[#0C0E12] text-vault-ink dark:text-vault-text flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-vault-surface border border-vault-rule rounded-2xl p-8 shadow-2xl text-center space-y-5 animate-in fade-in">
          <div className="w-16 h-16 rounded-2xl bg-vault-reserveBlueLight border border-vault-reserveBlue/30 text-vault-reserveBlue flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-vault-ink dark:text-vault-text">Vault Desktop Locked</h2>
            <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-1 leading-relaxed">
              "Managing money should feel calm and clear, never intimidating."
            </p>
          </div>

          <div className="bg-vault-paper border border-vault-rule rounded-xl p-4 text-left space-y-3 text-xs font-mono">
            <div className="flex items-center gap-3">
              <img 
                src={user.profilePic} 
                alt={`${user.name}'s profile avatar`}
                width={48}
                height={48}
                loading="lazy"
                className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-vault-reserveBlue/40"
              />
              <div>
                <p className="font-bold text-vault-ink dark:text-vault-text font-sans">{user.name}</p>
                <p className="text-xs text-vault-muted dark:text-vault-mutedDark">{user.email}</p>
              </div>
            </div>

            <div className="p-2.5 bg-vault-surface border border-vault-rule rounded-lg text-vault-muted dark:text-vault-mutedDark text-xs">
              Vault Sandbox Environment • RBI Regulated Digital Banking
            </div>
          </div>

          <button
            type="button"
            onClick={logIn}
            className="w-full py-3.5 bg-vault-reserveBlue hover:bg-vault-reserveBlueHover text-white font-mono font-bold text-xs rounded-lg shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Log Back In as {user.name}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] dark:bg-[#0C0E12] text-vault-ink dark:text-vault-text flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-vault-surface border-r border-vault-rule p-5 flex flex-col justify-between shrink-0 select-none">
        <div className="space-y-6">
          {/* Logo Header */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-lg bg-vault-reserveBlue text-white flex items-center justify-center font-serif font-bold text-lg shadow-xs">
              V
            </div>
            <div>
              <h1 className="font-serif text-base font-bold text-vault-ink dark:text-vault-text tracking-tight leading-none">
                VAULT
              </h1>
              <p className="text-[10px] text-vault-muted dark:text-vault-mutedDark font-mono font-medium tracking-wider uppercase mt-1">
                UPI Passbook Ledger
              </p>
            </div>
          </div>

          {/* Quick Action Button */}
          <button
            type="button"
            aria-label="Send money quick action"
            onClick={() => setActiveTab('send')}
            className="w-full py-2.5 px-4 bg-vault-reserveBlue hover:bg-vault-reserveBlueHover text-white rounded-lg font-mono font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Quick Send Money</span>
          </button>

          {/* Nav List */}
          <nav className="space-y-1 font-mono">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Navigate to ${item.label}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-vault-reserveBlueLight text-vault-reserveBlue border border-vault-reserveBlue/30' 
                      : 'text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink dark:hover:text-vault-text hover:bg-vault-surfaceHighlight'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-vault-reserveBlue' : 'text-vault-muted dark:text-vault-mutedDark'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card at Bottom */}
        <div className="pt-4 border-t border-vault-rule space-y-3">
          <div 
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-vault-surfaceHighlight cursor-pointer transition-all"
          >
            <img 
              src={user.profilePic} 
              alt={`${user.name}'s avatar`}
              width={36}
              height={36}
              loading="lazy"
              className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-vault-reserveBlue/40"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-vault-ink dark:text-vault-text truncate">{user.name}</p>
              <p className="text-[10px] text-vault-muted dark:text-vault-mutedDark font-mono truncate">Salary Account</p>
            </div>

            <button
              type="button"
              aria-label="Log out of Vault"
              onClick={(e) => { e.stopPropagation(); setShowLogoutModal(true); }}
              className="p-1.5 text-vault-muted dark:text-vault-mutedDark hover:text-vault-rose rounded-lg hover:bg-vault-roseLight transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Desktop Bar */}
        <header className="h-16 border-b border-vault-rule bg-vault-surface/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
          <button
            type="button"
            onClick={() => setIsCmdPaletteOpen(true)}
            className="flex items-center gap-3 px-3.5 py-2 bg-vault-paper border border-vault-rule rounded-lg text-xs font-mono text-vault-muted dark:text-vault-mutedDark hover:border-vault-reserveBlue transition-colors w-72"
          >
            <Search className="w-4 h-4 text-vault-muted dark:text-vault-mutedDark" />
            <span className="flex-1 text-left">Search passbook entries...</span>
            <kbd className="px-1.5 py-0.5 bg-vault-surface border border-vault-rule rounded text-[10px] font-mono font-bold text-vault-ink dark:text-vault-text">
              ⌘K
            </kbd>
          </button>

          <div className="flex items-center gap-4 text-xs font-mono font-medium text-vault-muted dark:text-vault-mutedDark">
            <span className="flex items-center gap-1.5 bg-vault-reserveBlueLight text-vault-reserveBlue px-3 py-1 rounded border border-vault-reserveBlue/30 font-bold">
              <ShieldCheck className="w-4 h-4" /> RBI Sandbox Verified
            </span>
          </div>
        </header>

        {/* Screen Content */}
        <main className="flex-1 p-8 overflow-y-auto max-w-5xl">
          {children}
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette 
        isOpen={isCmdPaletteOpen} 
        onClose={() => setIsCmdPaletteOpen(false)} 
      />

      {/* Transaction Detail Drawer */}
      <TransactionDrawer 
        transaction={selectedTransaction} 
        onClose={() => setSelectedTransaction(null)} 
      />

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => { setShowLogoutModal(false); logOut(); }}
      />
    </div>
  );
};

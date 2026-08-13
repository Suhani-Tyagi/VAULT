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
      <div className="min-h-screen bg-vault-paper dark:bg-[#0C0E12] text-vault-ink dark:text-vault-text flex items-center justify-center p-6 font-sans">
        <div className="max-w-sm w-full bg-vault-surface border border-vault-rule rounded-xl p-6 shadow-sm space-y-5">
          <div className="w-12 h-12 rounded-lg bg-vault-reserveBlueLight text-vault-reserveBlue flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-vault-ink dark:text-vault-text">Session Locked</h2>
            <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-1 leading-relaxed">
              Your banking session is locked for security. Authenticate to resume access.
            </p>
          </div>

          <div className="border-t border-b border-vault-rule py-3 space-y-2 text-xs font-mono">
            <div className="flex items-center gap-3">
              <img 
                src={user.profilePic} 
                alt={`${user.name}'s profile avatar`}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover shrink-0 border border-vault-rule"
              />
              <div className="min-w-0">
                <p className="font-bold text-vault-ink dark:text-vault-text font-sans truncate">{user.name}</p>
                <p className="text-[11px] text-vault-muted dark:text-vault-mutedDark truncate">{user.email}</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={logIn}
            className="w-full py-2.5 bg-vault-reserveBlue hover:bg-vault-reserveBlueHover text-white font-mono font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Log Back In as {user.name.split(' ')[0]}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vault-paper dark:bg-[#0C0E12] text-vault-ink dark:text-vault-text flex font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-60 bg-vault-surface border-r border-vault-rule p-4 flex flex-col justify-between shrink-0 select-none">
        <div className="space-y-6">
          {/* Logo Header */}
          <div className="flex items-center gap-2.5 px-2 pt-1">
            <div className="w-7 h-7 rounded-md bg-vault-reserveBlue text-white flex items-center justify-center font-bold text-xs">
              V
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-vault-ink dark:text-vault-text leading-none">
                VAULT
              </h1>
              <p className="text-[10px] text-vault-muted dark:text-vault-mutedDark font-mono mt-0.5">
                Digital Banking
              </p>
            </div>
          </div>

          {/* Quick Action Button */}
          <button
            type="button"
            aria-label="Send money quick action"
            onClick={() => setActiveTab('send')}
            className="w-full py-2 px-3 bg-vault-reserveBlue hover:bg-vault-reserveBlueHover text-white rounded-lg font-mono font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Send Money</span>
          </button>

          {/* Nav List */}
          <nav className="space-y-0.5 font-mono text-xs">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Navigate to ${item.label}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    isActive 
                      ? 'bg-vault-surfaceHighlight text-vault-reserveBlue font-bold border-l-2 border-vault-reserveBlue' 
                      : 'text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink dark:hover:text-vault-text hover:bg-vault-surfaceHighlight/60'
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
        <div className="pt-3 border-t border-vault-rule">
          <div 
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-vault-surfaceHighlight cursor-pointer transition-colors"
          >
            <img 
              src={user.profilePic} 
              alt={`${user.name}'s avatar`}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover shrink-0 border border-vault-rule"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-vault-ink dark:text-vault-text truncate">{user.name}</p>
              <p className="text-[10px] text-vault-muted dark:text-vault-mutedDark font-mono truncate">{user.upiId}</p>
            </div>

            <button
              type="button"
              aria-label="Log out of Vault"
              onClick={(e) => { e.stopPropagation(); setShowLogoutModal(true); }}
              className="p-1 text-vault-muted dark:text-vault-mutedDark hover:text-vault-rose rounded transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Desktop Bar */}
        <header className="h-14 border-b border-vault-rule bg-vault-surface px-6 flex items-center justify-between sticky top-0 z-20">
          <button
            type="button"
            onClick={() => setIsCmdPaletteOpen(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 bg-vault-paper border border-vault-rule rounded-lg text-xs font-mono text-vault-muted dark:text-vault-mutedDark hover:border-vault-muted transition-colors w-64"
          >
            <Search className="w-3.5 h-3.5 text-vault-muted" />
            <span className="flex-1 text-left">Search transactions...</span>
            <kbd className="px-1.5 py-0.5 bg-vault-surface border border-vault-rule rounded text-[10px] font-mono font-bold text-vault-ink dark:text-vault-text">
              ⌘K
            </kbd>
          </button>

          <div className="flex items-center gap-3 text-xs font-mono text-vault-muted dark:text-vault-mutedDark">
            <span className="flex items-center gap-1.5 text-vault-muted dark:text-vault-mutedDark">
              <ShieldCheck className="w-4 h-4 text-vault-emerald" />
              <span>Encrypted UPI Session</span>
            </span>
          </div>
        </header>

        {/* Screen Content Viewport - Max Width 1100px */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-5xl mx-auto w-full">
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


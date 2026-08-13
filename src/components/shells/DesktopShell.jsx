import React, { useState, useEffect } from 'react';
import { 
  Home, 
  ArrowLeftRight, 
  Users, 
  Target, 
  PieChart, 
  User, 
  ShieldCheck, 
  Search, 
  Plus, 
  Send, 
  Lock,
  LogIn,
  LogOut,
  Moon,
  Sun,
  Settings
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { CommandPalette } from '../CommandPalette';
import { TransactionDrawer } from '../TransactionDrawer';
import { LogoutModal } from '../LogoutModal';

export const DesktopShell = ({ children }) => {
  const { user, activeTab, setActiveTab, selectedTransaction, setSelectedTransaction, isLoggedOut, logOut, logIn, showToast } = useVault();
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const savedTheme = localStorage.getItem("vault-theme");
    if (savedTheme) return savedTheme === 'dark';
    return document.documentElement.classList.contains('dark');
  });

  const handleThemeToggle = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem("vault-theme", "dark");
      showToast("Dark theme enabled");
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem("vault-theme", "light");
      showToast("Light theme enabled");
    }
  };

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

  const mainNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'send', label: 'Send', icon: Send },
    { id: 'split', label: 'Split', icon: Users },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'insights', label: 'Insights', icon: PieChart },
  ];

  if (isLoggedOut) {
    return (
      <div className="min-h-screen bg-vault-paper dark:bg-[#141210] text-vault-ink dark:text-vault-text flex items-center justify-center p-6 font-sans">
        <div className="max-w-sm w-full bg-vault-surface border border-vault-rule rounded-xl p-6 space-y-5">
          <div className="w-10 h-10 rounded-lg bg-vault-paper border border-vault-rule text-vault-reserveBlue flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>

          <div>
            <h2 className="text-base font-bold text-vault-ink dark:text-vault-text font-sans">Session Locked</h2>
            <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-1 font-mono leading-relaxed">
              Your banking session is locked. Authenticate to resume access.
            </p>
          </div>

          <div className="border-t border-b border-vault-rule py-3 space-y-2 text-xs font-mono">
            <div className="flex items-center gap-3">
              <img 
                src={user.profilePic} 
                alt={`${user.name}'s profile avatar`}
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover shrink-0 border border-vault-rule"
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
            <span>Unlock Session ({user.name.split(' ')[0]})</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vault-paper dark:bg-[#141210] text-vault-ink dark:text-vault-text flex font-sans">
      {/* Sidebar Navigation Rail */}
      <aside className="w-56 bg-vault-surface border-r border-vault-rule p-4 flex flex-col justify-between shrink-0 select-none">
        <div className="space-y-6">
          {/* Logo Header */}
          <div className="px-2 pt-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-vault-reserveBlue text-white flex items-center justify-center font-bold text-xs font-serif">
                V
              </div>
              <h1 className="text-base font-bold tracking-tight text-vault-ink dark:text-vault-text font-sans">
                VAULT
              </h1>
            </div>
            <p className="text-[10px] text-vault-muted dark:text-vault-mutedDark font-mono mt-0.5 uppercase tracking-wider">
              Personal Banking
            </p>
          </div>

          {/* Main Navigation List */}
          <nav className="space-y-1 font-sans text-xs font-medium">
            {mainNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Navigate to ${item.label}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left relative ${
                    isActive 
                      ? 'bg-vault-surfaceHighlight text-vault-reserveBlue font-bold' 
                      : 'text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink dark:hover:text-vault-text hover:bg-vault-surfaceHighlight/50'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-vault-reserveBlue rounded-r" />
                  )}
                  <Icon className={`w-4 h-4 ${isActive ? 'text-vault-reserveBlue' : 'text-vault-muted dark:text-vault-mutedDark'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Navigation Section: Profile, Settings, Theme */}
        <div className="space-y-3 pt-3 border-t border-vault-rule font-sans text-xs">
          <div className="space-y-1 font-medium">
            <button
              type="button"
              aria-label="Navigate to Profile"
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left relative ${
                activeTab === 'profile' 
                  ? 'bg-vault-surfaceHighlight text-vault-reserveBlue font-bold' 
                  : 'text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink dark:hover:text-vault-text hover:bg-vault-surfaceHighlight/50'
              }`}
            >
              {activeTab === 'profile' && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-vault-reserveBlue rounded-r" />
              )}
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>

            <button
              type="button"
              aria-label="Toggle Theme Mode"
              onClick={handleThemeToggle}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink dark:hover:text-vault-text hover:bg-vault-surfaceHighlight/50 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                {isDarkMode ? <Moon className="w-4 h-4 text-vault-reserveBlue" /> : <Sun className="w-4 h-4 text-amber-500" />}
                <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
              </div>
            </button>
          </div>

          {/* User Account Bar */}
          <div className="flex items-center gap-2.5 p-2 bg-vault-paper border border-vault-rule rounded-lg">
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
              onClick={() => setShowLogoutModal(true)}
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
            <Search className="w-3.5 h-3.5 text-vault-reserveBlue" />
            <span className="flex-1 text-left">Search VAULT...</span>
            <kbd className="px-1.5 py-0.5 bg-vault-surface border border-vault-rule rounded text-[10px] font-mono font-bold text-vault-ink dark:text-vault-text">
              ⌘K
            </kbd>
          </button>

          <div className="flex items-center gap-3 text-xs font-mono text-vault-muted dark:text-vault-mutedDark">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-vault-emerald" />
              <span>Personal Banking</span>
            </span>
          </div>
        </header>

        {/* Screen Content Viewport - Max Width 1150px Container */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-6xl mx-auto w-full">
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



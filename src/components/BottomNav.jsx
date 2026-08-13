import React from 'react';
import { Home, ArrowLeftRight, Send, Target, User } from 'lucide-react';
import { useVault } from '../context/VaultContext';

export const BottomNav = () => {
  const { activeTab, setActiveTab } = useVault();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'send', label: 'Send', icon: Send, isPrimary: true },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 sm:absolute z-30 bg-vault-surface border-t border-vault-rule px-2 py-1.5 select-none font-sans">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'send' && activeTab === 'split');

          if (item.isPrimary) {
            return (
              <button
                key={item.id}
                type="button"
                aria-label={`Navigate to ${item.label}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center -mt-3 w-11 h-11 rounded-full bg-vault-reserveBlue text-white shadow-md transition-transform active:scale-95 ${
                  isActive ? 'ring-2 ring-vault-reserveBlue ring-offset-2 ring-offset-vault-surface' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              aria-label={`Navigate to ${item.label}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-2.5 rounded-md transition-colors ${
                isActive 
                  ? 'text-vault-reserveBlue font-bold' 
                  : 'text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink dark:hover:text-vault-text'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] font-mono tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};



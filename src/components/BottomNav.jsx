import React from 'react';
import { Home, ArrowLeftRight, Send, Target, PieChart } from 'lucide-react';
import { useVault } from '../context/VaultContext';

export const BottomNav = () => {
  const { activeTab, setActiveTab } = useVault();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'transactions', label: 'Activity', icon: ArrowLeftRight },
    { id: 'send', label: 'Pay & Split', icon: Send, isPrimary: true },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'insights', label: 'Insights', icon: PieChart },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-vault-surface/95 backdrop-blur-md border-t border-vault-border px-3 py-2 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id || (item.id === 'send' && activeTab === 'split');

        if (item.isPrimary) {
          return (
            <button
              key={item.id}
              type="button"
              aria-label="Pay & Split"
              onClick={() => setActiveTab('send')}
              className="flex flex-col items-center -mt-5"
            >
              <div className="w-12 h-12 rounded-full bg-vault-terracotta text-white flex items-center justify-center shadow-lg shadow-vault-terracotta/30 hover:scale-105 active:scale-95 transition-all">
                <Send className="w-5 h-5 translate-x-[1px]" />
              </div>
              <span className={`text-[10px] font-bold mt-1 ${isActive ? 'text-vault-terracotta' : 'text-vault-muted dark:text-vault-mutedDark'}`}>
                {item.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            aria-label={`Navigate to ${item.label}`}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
              isActive ? 'text-vault-terracotta' : 'text-vault-muted dark:text-vault-mutedDark hover:text-vault-charcoal dark:hover:text-vault-text'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
            <span className={`text-[10px] mt-1 ${isActive ? 'font-bold text-vault-terracotta' : 'font-medium'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

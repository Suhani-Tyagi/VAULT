import React from 'react';
import { Home, ArrowLeftRight, Send, Target, PieChart } from 'lucide-react';
import { useVault } from '../context/VaultContext';

export const BottomNav = () => {
  const { activeTab, setActiveTab } = useVault();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'transactions', label: 'Activity', icon: ArrowLeftRight },
    { id: 'send', label: 'Pay & Split', icon: Send },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'insights', label: 'Insights', icon: PieChart },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 sm:absolute z-30 bg-vault-surface border-t border-vault-rule px-2 py-1.5 select-none font-mono">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'send' && activeTab === 'split');

          return (
            <button
              key={item.id}
              type="button"
              aria-label={`Navigate to ${item.label}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1.5 px-2.5 rounded-md transition-colors ${
                isActive 
                  ? 'text-vault-reserveBlue font-bold bg-vault-surfaceHighlight' 
                  : 'text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink dark:hover:text-vault-text'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};


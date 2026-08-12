import React from 'react';
import { MobileContainer } from '../MobileContainer';
import { BottomNav } from '../BottomNav';
import { useVault } from '../../context/VaultContext';
import { ShieldCheck, LogIn, Lock } from 'lucide-react';

export const MobileShell = ({ children }) => {
  const { isLoggedOut, logIn, user } = useVault();

  if (isLoggedOut) {
    return (
      <MobileContainer>
        <div className="py-12 px-4 text-center space-y-5 animate-in fade-in">
          <div className="w-16 h-16 rounded-3xl bg-vault-terracottaLight border border-vault-terracotta/30 text-vault-terracotta flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-vault-charcoal dark:text-vault-text">Vault Session Locked</h2>
            <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-1 leading-relaxed">
              "Managing money should feel calm and clear, never intimidating."
            </p>
          </div>

          <div className="bg-vault-surface border border-vault-border rounded-2xl p-4 text-left space-y-3 text-xs">
            <div className="flex items-center gap-3">
              <img 
                src={user.profilePic} 
                alt={`${user.name}'s profile avatar`}
                width={40}
                height={40}
                loading="lazy"
                className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-vault-terracotta/40"
              />
              <div>
                <p className="font-bold text-vault-charcoal dark:text-vault-text">{user.name}</p>
                <p className="text-xs text-vault-muted dark:text-vault-mutedDark">{user.email}</p>
              </div>
            </div>

            <div className="p-2.5 bg-vault-paper border border-vault-border rounded-xl text-vault-muted dark:text-vault-mutedDark text-[11px]">
              RBI Regulated Banking Sandbox Session
            </div>
          </div>

          <button
            type="button"
            onClick={logIn}
            className="w-full py-3.5 bg-vault-terracotta hover:bg-vault-terracottaHover text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Log Back In as {user.name.split(' ')[0]}</span>
          </button>
        </div>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer>
      {children}
      <BottomNav />
    </MobileContainer>
  );
};

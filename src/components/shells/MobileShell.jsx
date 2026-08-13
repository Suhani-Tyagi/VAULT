import React from 'react';
import { MobileContainer } from '../MobileContainer';
import { BottomNav } from '../BottomNav';
import { useVault } from '../../context/VaultContext';
import { LogIn, Lock } from 'lucide-react';

export const MobileShell = ({ children }) => {
  const { isLoggedOut, logIn, user } = useVault();

  if (isLoggedOut) {
    return (
      <MobileContainer>
        <div className="py-10 px-4 space-y-5 font-sans">
          <div className="w-12 h-12 rounded-lg bg-vault-reserveBlueLight text-vault-reserveBlue flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div className="text-center">
            <h2 className="text-base font-bold text-vault-ink dark:text-vault-text">Session Locked</h2>
            <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-1 leading-relaxed">
              Your banking session is locked. Authenticate to proceed.
            </p>
          </div>

          <div className="bg-vault-surface border border-vault-rule rounded-lg p-3 text-left space-y-2 text-xs font-mono">
            <div className="flex items-center gap-3">
              <img 
                src={user.profilePic} 
                alt={`${user.name}'s profile avatar`}
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover shrink-0 border border-vault-rule"
              />
              <div className="min-w-0">
                <p className="font-bold font-sans text-vault-ink dark:text-vault-text truncate">{user.name}</p>
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


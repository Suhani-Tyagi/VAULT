import React, { useState } from 'react';
import { User, Shield, CreditCard, Bell, Smartphone, Lock, Eye, EyeOff, Copy, SmartphoneNfc } from 'lucide-react';
import { useVault } from '../context/VaultContext';

export const ProfileScreen = () => {
  const { user, toggleSetting, showToast } = useVault();

  const [revealAccount, setRevealAccount] = useState(false);
  const [revealCard, setRevealCard] = useState(false);

  const copyUpi = () => {
    navigator.clipboard.writeText(user.upiId);
    showToast("UPI ID copied to clipboard");
  };

  return (
    <div className="space-y-4">
      {/* Header title */}
      <div>
        <h2 className="text-xl font-bold text-vault-charcoal tracking-tight">Profile & Security</h2>
        <p className="text-xs text-vault-muted mt-0.5">
          Account credentials, active devices, and security controls
        </p>
      </div>

      {/* Profile Header Card */}
      <div className="bg-vault-surface border border-vault-border rounded-2xl p-4 flex items-center gap-4 shadow-xs">
        <img 
          src={user.profilePic} 
          alt={user.name} 
          className="w-16 h-16 rounded-full object-cover ring-2 ring-vault-terracotta/40"
        />

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-vault-charcoal truncate">{user.name}</h3>
          <p className="text-xs text-vault-muted truncate">{user.email}</p>
          <p className="text-[11px] text-vault-subtle font-medium mt-1">{user.city}</p>
        </div>
      </div>

      {/* Account Credentials Card (With Tap-to-Reveal Masking) */}
      <div className="bg-vault-surface border border-vault-border rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-vault-muted uppercase tracking-wider">
            Vault Account Details
          </h3>

          <button 
            onClick={() => setRevealAccount(!revealAccount)}
            className="text-[11px] font-bold text-vault-terracotta hover:underline flex items-center gap-1"
          >
            {revealAccount ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{revealAccount ? "Mask" : "Reveal"}</span>
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center py-1.5 border-b border-vault-border">
            <span className="text-vault-muted">Primary UPI Handle</span>
            <button 
              onClick={copyUpi}
              className="flex items-center gap-1 font-mono font-bold text-vault-terracotta hover:underline"
            >
              <span>{user.upiId}</span>
              <Copy className="w-3 h-3" />
            </button>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-vault-border">
            <span className="text-vault-muted">Account Number</span>
            <span className="font-mono font-bold text-vault-charcoal">
              {revealAccount ? user.fullAccountNo : user.accountNo}
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-vault-border">
            <span className="text-vault-muted">IFSC Code</span>
            <span className="font-mono font-bold text-vault-charcoal">{user.ifscCode}</span>
          </div>

          <div className="flex justify-between items-center py-1.5">
            <span className="text-vault-muted">Account Type</span>
            <span className="font-bold text-vault-charcoal">Vault Salary Account</span>
          </div>
        </div>
      </div>

      {/* Linked Bank Card (With Masking) */}
      <div className="bg-vault-surface border border-vault-border rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-vault-muted uppercase tracking-wider">
            Linked Bank & Cards
          </h3>

          <button 
            onClick={() => setRevealCard(!revealCard)}
            className="text-[11px] font-bold text-vault-terracotta hover:underline flex items-center gap-1"
          >
            {revealCard ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{revealCard ? "Mask" : "Reveal"}</span>
          </button>
        </div>

        <div className="p-3 bg-vault-paper border border-vault-border rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-vault-terracottaLight border border-vault-terracotta/30 text-vault-terracotta flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-vault-charcoal">{user.linkedCard.bank}</p>
              <p className="text-[11px] text-vault-muted font-mono">
                {revealCard ? user.linkedCard.fullCardNo : user.linkedCard.cardNo} • {user.linkedCard.type}
              </p>
            </div>
          </div>
          <span className="text-[10px] text-vault-terracotta font-bold bg-vault-terracottaLight px-2 py-0.5 rounded border border-vault-terracotta/20">
            Active
          </span>
        </div>
      </div>

      {/* Security & Biometric Controls */}
      <div className="bg-vault-surface border border-vault-border rounded-2xl p-4 space-y-3 shadow-xs">
        <h3 className="text-xs font-bold text-vault-muted uppercase tracking-wider">
          Security Controls
        </h3>

        <div className="space-y-3 text-xs">
          {/* Biometric Toggle */}
          <div className="flex justify-between items-center py-1">
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-vault-terracotta" />
              <div>
                <p className="font-bold text-vault-charcoal">Biometric Touch ID / Face ID</p>
                <p className="text-[11px] text-vault-muted">Use fingerprint scan instead of 6-digit PIN</p>
              </div>
            </div>

            <button 
              onClick={() => toggleSetting('biometricsEnabled')}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                user.biometricsEnabled ? 'bg-vault-terracotta' : 'bg-vault-paper border border-vault-border'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                user.biometricsEnabled ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>

          {/* PIN threshold toggle */}
          <div className="flex justify-between items-center py-1 border-t border-vault-border pt-3">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-vault-terracotta" />
              <div>
                <p className="font-bold text-vault-charcoal">Mandatory PIN for transfers over ₹5,000</p>
                <p className="text-[11px] text-vault-muted">Enforces security check on high-value transfers</p>
              </div>
            </div>

            <button 
              onClick={() => toggleSetting('requirePinOverThreshold')}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                user.requirePinOverThreshold ? 'bg-vault-terracotta' : 'bg-vault-paper border border-vault-border'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                user.requirePinOverThreshold ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Active Device Session Section (Section 9 Touch) */}
      <div className="bg-vault-surface border border-vault-border rounded-2xl p-4 space-y-2 shadow-xs">
        <h3 className="text-xs font-bold text-vault-muted uppercase tracking-wider">
          Active Devices & Sessions
        </h3>

        <div className="flex items-center justify-between p-2.5 bg-vault-paper border border-vault-border rounded-xl text-xs">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-4 h-4 text-vault-terracotta" />
            <div>
              <p className="font-bold text-vault-charcoal">{user.activeSession.device}</p>
              <p className="text-[11px] text-vault-muted">Logged in on this device • {user.activeSession.location}</p>
            </div>
          </div>
          <span className="text-[10px] text-vault-terracotta font-bold font-mono">
            {user.activeSession.time}
          </span>
        </div>
      </div>

      {/* Footer support text */}
      <div className="p-3 text-center text-xs text-vault-subtle space-y-1">
        <p className="font-mono">Vault App v2.5.0 • Light Paper Edition</p>
        <p>RBI Regulated Digital Banking Sandbox Environment</p>
      </div>
    </div>
  );
};

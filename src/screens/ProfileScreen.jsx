import React, { useState } from 'react';
import { Shield, CreditCard, Smartphone, Lock, Eye, EyeOff, Copy, Moon, Sun, Scan, Fingerprint, Monitor, LogOut, QrCode, User, Bell } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { useDevice } from '../context/DeviceContext';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { PinPadModal } from '../components/PinPadModal';
import { BiometricModal } from '../components/BiometricModal';
import { LogoutModal } from '../components/LogoutModal';
import { ReceiveQrModal } from '../components/ReceiveQrModal';

export const ProfileScreen = () => {
  const { user, toggleSetting, showToast, logOut } = useVault();
  const { deviceType, os, isOverridden, activeOverride, setOverride, clearOverride } = useDevice();

  const [revealAccount, setRevealAccount] = useState(false);
  const [revealCard, setRevealCard] = useState(false);

  const [authActionTarget, setAuthActionTarget] = useState(null);
  const [showPinAuthModal, setShowPinAuthModal] = useState(false);
  const [showBiometricAuthModal, setShowBiometricAuthModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const savedTheme = localStorage.getItem("vault-theme");
    if (savedTheme) return savedTheme === 'dark';
    return document.documentElement.classList.contains('dark');
  });

  const handleThemeToggle = (nextTheme) => {
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

  const copyUpi = () => {
    navigator.clipboard.writeText(user.upiId);
    showToast("UPI ID copied to clipboard");
  };

  const handleInitiateReveal = (target) => {
    if (target === 'account') {
      if (revealAccount) {
        setRevealAccount(false);
        return;
      }
    } else if (target === 'card') {
      if (revealCard) {
        setRevealCard(false);
        return;
      }
    }

    setAuthActionTarget(target);
    if (user.biometricsEnabled) {
      setShowBiometricAuthModal(true);
    } else {
      setShowPinAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowPinAuthModal(false);
    setShowBiometricAuthModal(false);
    
    if (authActionTarget === 'account') {
      setRevealAccount(true);
      showToast("Account number unmasked");
    } else if (authActionTarget === 'card') {
      setRevealCard(true);
      showToast("Debit card number unmasked");
    }
    setAuthActionTarget(null);
  };

  let biometricLabel = "Biometric ID";
  let BiometricIcon = Shield;

  if (os === 'ios') {
    biometricLabel = "Face ID";
    BiometricIcon = Scan;
  } else if (os === 'android') {
    biometricLabel = "Fingerprint";
    BiometricIcon = Fingerprint;
  }

  const devicePresets = [
    { id: 'auto', label: 'Auto-detect', type: null, os: null },
    { id: 'iphone', label: 'iPhone', type: 'mobile', os: 'ios' },
    { id: 'android', label: 'Android Phone', type: 'mobile', os: 'android' },
    { id: 'ipad', label: 'iPad / Tablet', type: 'tablet', os: 'ios' },
    { id: 'windows', label: 'Windows PC', type: 'desktop', os: 'windows' },
    { id: 'mac', label: 'macOS Desktop', type: 'desktop', os: 'macos' },
    { id: 'linux', label: 'Linux PC', type: 'desktop', os: 'linux' },
  ];

  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto">
      {/* Header title */}
      <div className="flex justify-between items-start pb-3 border-b border-vault-rule">
        <div>
          <h2 className="text-lg font-bold text-vault-ink dark:text-vault-text tracking-tight font-sans">Settings & Preferences</h2>
          <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5 font-mono">
            Personal identity, account details, security controls, and application preferences
          </p>
        </div>

        <button
          type="button"
          aria-label="Log out of Vault"
          onClick={() => setShowLogoutModal(true)}
          className="px-3 py-1.5 bg-vault-paper hover:bg-vault-surfaceHighlight text-vault-rose border border-vault-rule rounded-lg text-xs font-mono font-bold transition-colors flex items-center gap-1.5 shrink-0"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Profile Header Bar */}
      <div className="p-4 bg-vault-surface border border-vault-rule rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <img 
            src={user.profilePic} 
            alt={`${user.name}'s profile avatar`}
            width={44}
            height={44}
            className="w-11 h-11 rounded-full object-cover border border-vault-rule shrink-0"
          />
          <div>
            <h3 className="text-sm font-bold text-vault-ink dark:text-vault-text font-sans">{user.name}</h3>
            <p className="text-xs text-vault-muted dark:text-vault-mutedDark font-mono">{user.email} • {user.city}</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-vault-emerald bg-vault-emeraldLight px-2.5 py-1 rounded border border-vault-emerald/20">
          KYC Verified
        </span>
      </div>

      {/* SECTION 1: PERSONAL & SECURITY */}
      <div className="space-y-2">
        <h3 className="text-xs font-mono font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider px-1">
          PERSONAL & SECURITY
        </h3>

        <div className="bg-vault-surface border border-vault-rule rounded-xl divide-y divide-vault-rule text-xs font-sans">
          {/* Biometrics */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BiometricIcon className="w-4 h-4 text-vault-reserveBlue shrink-0" />
              <div>
                <p className="font-bold text-vault-ink dark:text-vault-text">{biometricLabel} Authentication</p>
                <p className="text-xs text-vault-muted dark:text-vault-mutedDark font-mono mt-0.5">Use biometric authentication for quick transaction signing</p>
              </div>
            </div>
            <ToggleSwitch 
              id="biometric-toggle"
              label={`Toggle ${biometricLabel} verification`}
              checked={user.biometricsEnabled}
              onChange={() => toggleSetting('biometricsEnabled')}
            />
          </div>

          {/* Mandatory PIN Threshold */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-vault-reserveBlue shrink-0" />
              <div>
                <p className="font-bold text-vault-ink dark:text-vault-text">High-Value Transfer Safeguard</p>
                <p className="text-xs text-vault-muted dark:text-vault-mutedDark font-mono mt-0.5">Mandatory 6-digit PIN confirmation for transfers over ₹5,000</p>
              </div>
            </div>
            <ToggleSwitch 
              id="pin-threshold-toggle"
              label="Toggle mandatory PIN for high-value transfers"
              checked={user.requirePinOverThreshold}
              onChange={() => toggleSetting('requirePinOverThreshold')}
            />
          </div>

          {/* Active Session Row */}
          <div className="p-4 flex items-center justify-between font-mono">
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-vault-reserveBlue shrink-0" />
              <div>
                <p className="font-bold font-sans text-vault-ink dark:text-vault-text">Active Session</p>
                <p className="text-xs text-vault-muted dark:text-vault-mutedDark">{user.activeSession.device} • {user.activeSession.location}</p>
              </div>
            </div>
            <span className="text-xs text-vault-emerald font-bold">Active now</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: ACCOUNT & CARDS */}
      <div className="space-y-2">
        <h3 className="text-xs font-mono font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider px-1">
          ACCOUNT & CREDENTIALS
        </h3>

        <div className="bg-vault-surface border border-vault-rule rounded-xl divide-y divide-vault-rule text-xs font-mono">
          {/* UPI ID */}
          <div className="p-4 flex items-center justify-between">
            <span className="text-vault-muted dark:text-vault-mutedDark font-bold">UPI ID</span>
            <button 
              type="button"
              onClick={copyUpi}
              className="flex items-center gap-1.5 font-bold text-vault-reserveBlue hover:underline"
            >
              <span>{user.upiId}</span>
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Account Number */}
          <div className="p-4 flex items-center justify-between">
            <span className="text-vault-muted dark:text-vault-mutedDark font-bold">Account Number</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-vault-ink dark:text-vault-text tabular-nums">
                {revealAccount ? user.fullAccountNo : user.accountNo}
              </span>
              <button 
                type="button"
                onClick={() => handleInitiateReveal('account')}
                className="text-vault-reserveBlue hover:underline font-bold text-[11px] ml-1"
              >
                {revealAccount ? "Mask" : "Unmask (Auth)"}
              </button>
            </div>
          </div>

          {/* IFSC Code */}
          <div className="p-4 flex items-center justify-between">
            <span className="text-vault-muted dark:text-vault-mutedDark font-bold">IFSC Code</span>
            <span className="font-bold text-vault-ink dark:text-vault-text">{user.ifscCode}</span>
          </div>

          {/* Linked Card */}
          <div className="p-4 flex items-center justify-between font-sans">
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-vault-reserveBlue shrink-0" />
              <div>
                <p className="font-bold text-vault-ink dark:text-vault-text">{user.linkedCard.bank} Debit Card</p>
                <p className="text-xs text-vault-muted dark:text-vault-mutedDark font-mono mt-0.5">
                  {revealCard ? user.linkedCard.fullCardNo : user.linkedCard.cardNo}
                </p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => handleInitiateReveal('card')}
              className="text-xs font-mono font-bold text-vault-reserveBlue hover:underline"
            >
              {revealCard ? "Mask" : "Unmask (Auth)"}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: APP PREFERENCES & VIEWPORT */}
      <div className="space-y-2">
        <h3 className="text-xs font-mono font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider px-1">
          APP & ENVIRONMENT
        </h3>

        <div className="bg-vault-surface border border-vault-rule rounded-xl divide-y divide-vault-rule text-xs font-sans">
          {/* Appearance Toggle */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDarkMode ? <Moon className="w-4 h-4 text-vault-reserveBlue shrink-0" /> : <Sun className="w-4 h-4 text-amber-500 shrink-0" />}
              <div>
                <p className="font-bold text-vault-ink dark:text-vault-text">Appearance Theme</p>
                <p className="text-xs text-vault-muted dark:text-vault-mutedDark font-mono mt-0.5">Switch between warm paper light mode and obsidian dark mode</p>
              </div>
            </div>
            <ToggleSwitch 
              id="dark-theme-toggle"
              label="Toggle dark theme mode"
              checked={isDarkMode}
              onChange={handleThemeToggle}
            />
          </div>

          {/* Viewport Switcher Grid */}
          <div className="p-4 space-y-2 font-mono">
            <div className="flex justify-between items-center">
              <span className="font-bold text-vault-ink dark:text-vault-text font-sans">Developer Viewport Override</span>
              {isOverridden && (
                <span className="text-[10px] bg-vault-reserveBlue text-white px-2 py-0.5 rounded font-bold">
                  Override Active
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
              {devicePresets.map(preset => {
                const isSelected = preset.id === 'auto' 
                  ? !isOverridden 
                  : activeOverride?.deviceType === preset.type && activeOverride?.os === preset.os;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      if (preset.id === 'auto') clearOverride();
                      else setOverride({ deviceType: preset.type, os: preset.os });
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-colors border text-center ${
                      isSelected 
                        ? 'bg-vault-reserveBlue text-white border-vault-reserveBlue' 
                        : 'bg-vault-paper border-vault-rule text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* About VAULT */}
          <div className="p-4 flex items-center justify-between font-mono">
            <span className="text-vault-muted dark:text-vault-mutedDark font-bold">VAULT Build Version</span>
            <span className="font-bold text-vault-ink dark:text-vault-text">v2.4.0 (Editorial Release)</span>
          </div>
        </div>
      </div>

      {/* Re-Auth Modals */}
      <PinPadModal
        isOpen={showPinAuthModal}
        onClose={() => { setShowPinAuthModal(false); setAuthActionTarget(null); }}
        onSuccess={handleAuthSuccess}
        recipientName={authActionTarget === 'account' ? 'Unmask Account Details' : 'Unmask Debit Card Details'}
      />

      <BiometricModal
        isOpen={showBiometricAuthModal}
        onClose={() => { setShowBiometricAuthModal(false); setAuthActionTarget(null); }}
        onSuccess={handleAuthSuccess}
        recipientName={authActionTarget === 'account' ? 'Unmask Account Details' : 'Unmask Debit Card Details'}
      />

      {/* Receive QR Modal */}
      <ReceiveQrModal
        isOpen={showReceiveModal}
        onClose={() => setShowReceiveModal(false)}
      />

      {/* Logout Confirmation Modal */}
      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => { setShowLogoutModal(false); logOut(); }}
      />
    </div>
  );
};



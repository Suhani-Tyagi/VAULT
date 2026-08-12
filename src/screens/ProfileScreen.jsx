import React, { useState } from 'react';
import { User, Shield, CreditCard, Bell, Smartphone, Lock, Eye, EyeOff, Copy, Moon, Sun, Scan, Fingerprint, Monitor, LogOut, Mail, MessageSquare } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { useDevice } from '../context/DeviceContext';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { PinPadModal } from '../components/PinPadModal';
import { BiometricModal } from '../components/BiometricModal';
import { LogoutModal } from '../components/LogoutModal';

export const ProfileScreen = () => {
  const { user, toggleSetting, showToast, logOut } = useVault();
  const { deviceType, os, isOverridden, activeOverride, setOverride, clearOverride } = useDevice();

  const [revealAccount, setRevealAccount] = useState(false);
  const [revealCard, setRevealCard] = useState(false);

  const [authActionTarget, setAuthActionTarget] = useState(null);
  const [showPinAuthModal, setShowPinAuthModal] = useState(false);
  const [showBiometricAuthModal, setShowBiometricAuthModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
    <div className="space-y-4">
      {/* Header title */}
      <div>
        <h2 className="text-xl font-bold text-vault-charcoal dark:text-vault-text tracking-tight">Profile & Security</h2>
        <p className="text-xs text-vault-muted mt-0.5">
          Account credentials, active devices, and security controls
        </p>
      </div>

      {/* Profile Header Card */}
      <div className="bg-vault-surface border border-vault-border rounded-2xl p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <img 
            src={user.profilePic} 
            alt={`${user.name}'s profile avatar`}
            width={64}
            height={64}
            loading="lazy"
            className="w-16 h-16 rounded-full object-cover ring-2 ring-vault-terracotta/40 shrink-0"
          />

          <div className="min-w-0">
            <h3 className="text-base font-bold text-vault-charcoal dark:text-vault-text truncate">{user.name}</h3>
            <p className="text-xs text-vault-muted truncate">{user.email}</p>
            <p className="text-xs text-vault-subtle font-medium mt-1">{user.city}</p>
          </div>
        </div>

        {/* Log Out Button */}
        <button
          type="button"
          aria-label="Log out of Vault"
          onClick={() => setShowLogoutModal(true)}
          className="px-3 py-2 bg-vault-roseLight text-vault-rose hover:bg-vault-rose hover:text-white border border-vault-rose/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Log Out</span>
        </button>
      </div>

      {/* Developer / Demo Device Switcher */}
      <div className="bg-vault-surface border border-vault-terracotta/30 rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-vault-terracotta uppercase tracking-wider flex items-center gap-1.5">
            <Monitor className="w-4 h-4" />
            <span>Developer / Demo Settings</span>
          </h3>

          {isOverridden && (
            <span className="text-xs bg-vault-terracotta text-white px-2 py-0.5 rounded-full font-bold">
              Override Active
            </span>
          )}
        </div>

        <p className="text-xs text-vault-muted">
          Preview how Vault adapts across viewports and operating systems. Active mode: <strong className="text-vault-charcoal dark:text-vault-text capitalize">{deviceType} ({os})</strong>
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
          {devicePresets.map(preset => {
            const isSelected = preset.id === 'auto' 
              ? !isOverridden 
              : activeOverride?.deviceType === preset.type && activeOverride?.os === preset.os;

            return (
              <button
                key={preset.id}
                type="button"
                aria-label={`Override device view to ${preset.label}`}
                onClick={() => {
                  if (preset.id === 'auto') clearOverride();
                  else setOverride({ deviceType: preset.type, os: preset.os });
                }}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border text-center ${
                  isSelected 
                    ? 'bg-vault-terracotta text-white border-vault-terracotta shadow-xs' 
                    : 'bg-vault-paper border-vault-border text-vault-muted hover:text-vault-charcoal dark:hover:text-vault-text'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme & Dark Mode Controls */}
      <div className="bg-vault-surface border border-vault-border rounded-2xl p-4 space-y-3 shadow-xs">
        <h3 className="text-xs font-bold text-vault-muted uppercase tracking-wider">
          Appearance & Theme
        </h3>

        <div className="flex justify-between items-center py-1 text-xs">
          <div className="flex items-center gap-2.5">
            {isDarkMode ? <Moon className="w-4 h-4 text-vault-terracotta" /> : <Sun className="w-4 h-4 text-vault-amber" />}
            <div>
              <p className="font-bold text-vault-charcoal dark:text-vault-text">Dark Theme</p>
              <p className="text-xs text-vault-muted">Toggle high-contrast ink dark mode</p>
            </div>
          </div>

          <ToggleSwitch 
            id="dark-theme-toggle"
            label="Toggle dark theme mode"
            checked={isDarkMode}
            onChange={handleThemeToggle}
          />
        </div>
      </div>

      {/* Notification Preferences Card (Wired to pushNotifications, emailAlerts, smsAlerts) */}
      <div className="bg-vault-surface border border-vault-border rounded-2xl p-4 space-y-3 shadow-xs">
        <h3 className="text-xs font-bold text-vault-muted uppercase tracking-wider">
          Notification Alerts
        </h3>

        <div className="space-y-3 text-xs">
          {/* Push Notifications */}
          <div className="flex justify-between items-center py-1">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-vault-terracotta" />
              <div>
                <p className="font-bold text-vault-charcoal dark:text-vault-text">Push Notifications</p>
                <p className="text-xs text-vault-muted">Instant payment alerts and goal milestones</p>
              </div>
            </div>

            <ToggleSwitch 
              id="push-alerts-toggle"
              label="Toggle push notifications"
              checked={user.pushNotifications}
              onChange={() => toggleSetting('pushNotifications')}
            />
          </div>

          {/* Email Alerts */}
          <div className="flex justify-between items-center py-1 border-t border-vault-border pt-3">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-vault-terracotta" />
              <div>
                <p className="font-bold text-vault-charcoal dark:text-vault-text">Email Statements & Summaries</p>
                <p className="text-xs text-vault-muted">Monthly spend digests sent to {user.email}</p>
              </div>
            </div>

            <ToggleSwitch 
              id="email-alerts-toggle"
              label="Toggle email summaries"
              checked={user.emailAlerts}
              onChange={() => toggleSetting('emailAlerts')}
            />
          </div>

          {/* SMS Alerts */}
          <div className="flex justify-between items-center py-1 border-t border-vault-border pt-3">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-vault-terracotta" />
              <div>
                <p className="font-bold text-vault-charcoal dark:text-vault-text">SMS Transaction Alerts</p>
                <p className="text-xs text-vault-muted">Bank SMS for high-value debits and credits</p>
              </div>
            </div>

            <ToggleSwitch 
              id="sms-alerts-toggle"
              label="Toggle SMS transaction alerts"
              checked={user.smsAlerts}
              onChange={() => toggleSetting('smsAlerts')}
            />
          </div>
        </div>
      </div>

      {/* Account Credentials Card */}
      <div className="bg-vault-surface border border-vault-border rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-vault-muted uppercase tracking-wider">
            Vault Account Details
          </h3>

          <button 
            type="button"
            aria-label={revealAccount ? "Mask account number" : "Authenticate to reveal full account number"}
            onClick={() => handleInitiateReveal('account')}
            className="text-xs font-bold text-vault-terracotta hover:underline flex items-center gap-1"
          >
            {revealAccount ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{revealAccount ? "Mask" : "Reveal (Requires Auth)"}</span>
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center py-1.5 border-b border-vault-border">
            <span className="text-vault-muted">Primary UPI Handle</span>
            <button 
              type="button"
              aria-label="Copy UPI handle"
              onClick={copyUpi}
              className="flex items-center gap-1 font-mono font-bold text-vault-terracotta hover:underline"
            >
              <span>{user.upiId}</span>
              <Copy className="w-3 h-3" />
            </button>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-vault-border">
            <span className="text-vault-muted">Account Number</span>
            <span className="font-mono font-bold text-vault-charcoal dark:text-vault-text">
              {revealAccount ? user.fullAccountNo : user.accountNo}
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-vault-border">
            <span className="text-vault-muted">IFSC Code</span>
            <span className="font-mono font-bold text-vault-charcoal dark:text-vault-text">{user.ifscCode}</span>
          </div>

          <div className="flex justify-between items-center py-1.5">
            <span className="text-vault-muted">Account Type</span>
            <span className="font-bold text-vault-charcoal dark:text-vault-text">Vault Salary Account</span>
          </div>
        </div>
      </div>

      {/* Linked Bank Card */}
      <div className="bg-vault-surface border border-vault-border rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-vault-muted uppercase tracking-wider">
            Linked Bank & Cards
          </h3>

          <button 
            type="button"
            aria-label={revealCard ? "Mask debit card number" : "Authenticate to reveal full card number"}
            onClick={() => handleInitiateReveal('card')}
            className="text-xs font-bold text-vault-terracotta hover:underline flex items-center gap-1"
          >
            {revealCard ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{revealCard ? "Mask" : "Reveal (Requires Auth)"}</span>
          </button>
        </div>

        <div className="p-3 bg-vault-paper border border-vault-border rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-vault-terracottaLight border border-vault-terracotta/30 text-vault-terracotta flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-vault-charcoal dark:text-vault-text">{user.linkedCard.bank}</p>
              <p className="text-xs text-vault-muted font-mono">
                {revealCard ? user.linkedCard.fullCardNo : user.linkedCard.cardNo} • {user.linkedCard.type}
              </p>
            </div>
          </div>
          <span className="text-xs text-vault-terracotta font-bold bg-vault-terracottaLight px-2 py-0.5 rounded border border-vault-terracotta/20">
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
          <div className="flex justify-between items-center py-1">
            <div className="flex items-center gap-2.5">
              <BiometricIcon className="w-4 h-4 text-vault-terracotta" />
              <div>
                <p className="font-bold text-vault-charcoal dark:text-vault-text">{biometricLabel} Verification</p>
                <p className="text-xs text-vault-muted">Use {biometricLabel} instead of 6-digit PIN for payments</p>
              </div>
            </div>

            <ToggleSwitch 
              id="biometric-toggle"
              label={`Toggle ${biometricLabel} verification`}
              checked={user.biometricsEnabled}
              onChange={() => toggleSetting('biometricsEnabled')}
            />
          </div>

          <div className="flex justify-between items-center py-1 border-t border-vault-border pt-3">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-vault-terracotta" />
              <div>
                <p className="font-bold text-vault-charcoal dark:text-vault-text">Mandatory PIN for transfers over ₹5,000</p>
                <p className="text-xs text-vault-muted">Enforces security check on high-value transfers</p>
              </div>
            </div>

            <ToggleSwitch 
              id="pin-threshold-toggle"
              label="Toggle mandatory PIN for high-value transfers"
              checked={user.requirePinOverThreshold}
              onChange={() => toggleSetting('requirePinOverThreshold')}
            />
          </div>
        </div>
      </div>

      {/* Active Devices & Sessions */}
      <div className="bg-vault-surface border border-vault-border rounded-2xl p-4 space-y-2 shadow-xs">
        <h3 className="text-xs font-bold text-vault-muted uppercase tracking-wider">
          Active Devices & Sessions
        </h3>

        <div className="flex items-center justify-between p-2.5 bg-vault-paper border border-vault-border rounded-xl text-xs">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-4 h-4 text-vault-terracotta" />
            <div>
              <p className="font-bold text-vault-charcoal dark:text-vault-text">{user.activeSession.device}</p>
              <p className="text-xs text-vault-muted">Logged in on this device • {user.activeSession.location}</p>
            </div>
          </div>
          <span className="text-xs text-vault-terracotta font-bold font-mono">
            {user.activeSession.time}
          </span>
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

      {/* Logout Confirmation Modal */}
      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => { setShowLogoutModal(false); logOut(); }}
      />

      {/* Footer support text */}
      <div className="p-3 text-center text-xs text-vault-subtle space-y-1">
        <p className="font-mono">Vault App v2.8.0 • Full Features Edition</p>
        <p>RBI Regulated Digital Banking Sandbox Environment</p>
      </div>
    </div>
  );
};

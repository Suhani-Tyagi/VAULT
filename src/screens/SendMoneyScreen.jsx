import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Loader2, AlertTriangle, Fingerprint, Lock, QrCode, ArrowDownLeft } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { useDevice } from '../context/DeviceContext';
import { PinPadModal } from '../components/PinPadModal';
import { BiometricModal } from '../components/BiometricModal';
import { QrScannerModal } from '../components/QrScannerModal';
import { ReceiveQrModal } from '../components/ReceiveQrModal';

const MAX_SINGLE_TRANSFER = 100000;

export const SendMoneyScreen = () => {
  const { user, contacts, executeSendMoney, setActiveTab } = useVault();
  const { isTouch } = useDevice();
  
  const [selectedContact, setSelectedContact] = useState(contacts[0]); // Default Aditi Nair
  const [customUpi, setCustomUpi] = useState('');
  const [amount, setAmount] = useState('1500');
  const [note, setNote] = useState('');
  
  const [showPinModal, setShowPinModal] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [successResult, setSuccessResult] = useState(null);

  const recipient = selectedContact || {
    name: customUpi || "Custom UPI Recipient",
    upiId: customUpi || "user@upi",
    initials: "UPI",
    avatarBg: "#D97706"
  };

  const numAmount = parseFloat(amount) || 0;
  const isLargeTransfer = numAmount >= 10000;

  const handleQuickAmount = (val) => {
    setAmount(val.toString());
    setErrorState(null);
  };

  const handleQrSuccess = (scannedRecipient) => {
    setShowQrModal(false);
    setSelectedContact(null);
    setCustomUpi(scannedRecipient.upiId);
    if (scannedRecipient.amount) {
      setAmount(scannedRecipient.amount);
    }
    if (scannedRecipient.note) {
      setNote(scannedRecipient.note);
    }
  };

  const handleInitiateSend = () => {
    setErrorState(null);

    // Security & Sanitization Checks
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorState("Please enter a valid transfer amount greater than ₹0.");
      return;
    }

    if (numAmount > MAX_SINGLE_TRANSFER) {
      setErrorState(`Transfer limit exceeded — the maximum single transfer limit is ₹${MAX_SINGLE_TRANSFER.toLocaleString('en-IN')}.`);
      return;
    }

    if (numAmount > user.availableBalance) {
      setErrorState(`This transfer didn't go through — your available balance is ₹${user.availableBalance.toLocaleString('en-IN')}, which is less than the ₹${numAmount.toLocaleString('en-IN')} you tried to send.`);
      return;
    }

    if (user.biometricsEnabled) {
      setShowBiometricModal(true);
    } else {
      setShowPinModal(true);
    }
  };

  const handleSecuritySuccess = () => {
    setShowPinModal(false);
    setShowBiometricModal(false);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const res = executeSendMoney(recipient, amount, note);
      
      if (res.success) {
        setSuccessResult(res.transaction);
      } else {
        setErrorState(res.message);
      }
    }, 600);
  };

  const resetForm = () => {
    setSuccessResult(null);
    setErrorState(null);
    setAmount('1500');
    setNote('');
  };

  if (successResult) {
    return (
      <div className="space-y-5 animate-in fade-in zoom-in-95">
        <div className="bg-vault-surface border border-vault-border rounded-3xl p-6 text-center space-y-4 shadow-sm text-vault-charcoal dark:text-vault-text">
          <div className="w-16 h-16 bg-vault-bronzeLight border border-vault-bronze/40 text-vault-bronze rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-vault-charcoal dark:text-vault-text">Transfer Complete</h3>
            <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-1">
              Sent to <span className="font-bold text-vault-charcoal dark:text-vault-text">{recipient.name}</span>
            </p>
          </div>

          <div className="text-3xl sm:text-4xl font-display font-extrabold text-vault-bronze tabular-nums my-2">
            ₹{parseFloat(amount).toLocaleString('en-IN')}
          </div>

          <div className="p-3.5 bg-vault-paper border border-vault-border rounded-2xl text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-vault-muted dark:text-vault-mutedDark">Fee charged</span>
              <span className="font-bold text-vault-teal">₹0 (Free)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-vault-muted dark:text-vault-mutedDark">UPI Ref ID</span>
              <span className="font-mono text-vault-charcoal dark:text-vault-text text-[11px]">{successResult.upiRef}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-vault-muted dark:text-vault-mutedDark">Updated Available Balance</span>
              <span className="font-display font-bold text-vault-charcoal dark:text-vault-text tabular-nums">
                ₹{user.availableBalance.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <p className="text-xs text-vault-muted dark:text-vault-mutedDark leading-relaxed">
            "This transfer is free. It'll reach {recipient.name}'s account in a few seconds."
          </p>

          <div className="flex gap-3 pt-2">
            <button
              onClick={resetForm}
              className="flex-1 py-3 bg-vault-surfaceHighlight border border-vault-border text-vault-charcoal dark:text-vault-text font-semibold text-xs rounded-xl hover:bg-vault-border transition-colors"
            >
              Send Another
            </button>

            <button
              onClick={() => setActiveTab('home')}
              className="flex-1 py-3 bg-vault-bronze text-white font-semibold text-xs rounded-xl hover:bg-vault-bronzeHover transition-colors shadow-md shadow-vault-bronze/20"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header title */}
      <div>
        <h2 className="text-xl font-bold text-vault-charcoal dark:text-vault-text tracking-tight">Pay & Transfer</h2>
        <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5">
          Instant UPI transfer with 6-digit security PIN verification
        </p>
      </div>

      {/* Dual QR Options Bar */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          aria-label="Scan Merchant or Friend QR Code"
          onClick={() => setShowQrModal(true)}
          className="py-2.5 px-3 bg-vault-surfaceHighlight border border-vault-border text-vault-charcoal dark:text-vault-text font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:border-vault-bronze transition-all shadow-xs"
        >
          <QrCode className="w-4 h-4 text-vault-bronze" />
          <span>Scan QR Code</span>
        </button>

        <button
          type="button"
          aria-label="Show My QR Code to Receive Money"
          onClick={() => setShowReceiveModal(true)}
          className="py-2.5 px-3 bg-vault-bronzeLight border border-vault-bronze/30 text-vault-bronze font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-vault-bronze hover:text-white transition-all shadow-xs"
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>My Receive QR</span>
        </button>
      </div>

      {/* 1. Recipient Picker */}
      <div className="bg-vault-surface border border-vault-border rounded-2xl p-4 space-y-3 shadow-xs">
        <label className="text-xs font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider block">
          Select Recipient
        </label>

        <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
          {contacts.map(c => {
            const isSelected = selectedContact?.id === c.id;
            return (
              <button
                key={c.id}
                type="button"
                aria-label={`Select recipient ${c.name}`}
                onClick={() => { setSelectedContact(c); setCustomUpi(''); }}
                className={`flex flex-col items-center p-2 rounded-2xl shrink-0 transition-all w-20 border ${
                  isSelected 
                    ? 'bg-vault-bronzeLight border-vault-bronze text-vault-charcoal dark:text-vault-text shadow-xs' 
                    : 'bg-vault-paper border-vault-border text-vault-muted dark:text-vault-mutedDark hover:border-vault-borderDark'
                }`}
              >
                <img 
                  src={c.avatar} 
                  alt={`${c.name}'s profile avatar`}
                  width={40}
                  height={40}
                  loading="lazy"
                  className={`w-10 h-10 rounded-full object-cover mb-1.5 shrink-0 ${
                    isSelected ? 'ring-2 ring-vault-bronze' : ''
                  }`} 
                />
                <span className="text-xs font-semibold truncate w-full text-center">
                  {c.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {selectedContact && (
          <div className="p-3 bg-vault-paper border border-vault-border rounded-xl flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-vault-charcoal dark:text-vault-text">{selectedContact.name}</p>
              <p className="text-xs text-vault-muted dark:text-vault-mutedDark font-mono">{selectedContact.upiId}</p>
            </div>
            <span className="text-xs text-vault-teal font-bold bg-vault-tealLight px-2 py-0.5 rounded border border-vault-teal/20">
              Verified UPI
            </span>
          </div>
        )}
      </div>

      {/* 2. Amount Entry */}
      <div className="bg-vault-surface border border-vault-border rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex justify-between items-center text-xs">
          <label htmlFor="send-amount-input" className="font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider">
            Amount (Max ₹1,00,000)
          </label>
          <span className="text-vault-muted dark:text-vault-mutedDark">
            Available: <strong className="text-vault-charcoal dark:text-vault-text font-display tabular-nums">₹{user.availableBalance.toLocaleString('en-IN')}</strong>
          </span>
        </div>

        <div className="relative flex items-center bg-vault-paper border border-vault-border rounded-xl px-4 py-2 focus-within:border-vault-bronze transition-colors">
          <span className="text-2xl font-bold text-vault-bronze mr-1">₹</span>
          <input 
            id="send-amount-input"
            type="number"
            min="1"
            max={MAX_SINGLE_TRANSFER}
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setErrorState(null); }}
            placeholder="0"
            className="w-full bg-transparent text-2xl sm:text-3xl font-display font-extrabold text-vault-charcoal dark:text-vault-text focus:outline-none tabular-nums"
          />
        </div>

        <div className="flex gap-2">
          {[500, 1000, 2000, 5000, 12000].map(val => (
            <button
              key={val}
              type="button"
              aria-label={`Set amount to ${val} rupees`}
              onClick={() => handleQuickAmount(val)}
              className="flex-1 py-1.5 bg-vault-paper hover:bg-vault-surfaceHighlight border border-vault-border rounded-xl text-xs font-semibold text-vault-muted dark:text-vault-mutedDark hover:text-vault-charcoal dark:hover:text-vault-text transition-colors tabular-nums focus:ring-2 focus:ring-vault-bronze"
            >
              +₹{val}
            </button>
          ))}
        </div>

        <input 
          type="text"
          placeholder="Add a note (e.g. Dinner share, rent portion)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          aria-label="Add a transfer note"
          className="w-full bg-vault-paper border border-vault-border rounded-xl px-3 py-2 text-xs text-vault-charcoal dark:text-vault-text placeholder-vault-muted focus:outline-none focus:border-vault-bronze"
        />
      </div>

      {/* 3. Large Transfer Warning */}
      {isLargeTransfer && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-amber-600 dark:text-amber-400 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Large Transfer Warning</p>
            <p className="mt-0.5 leading-relaxed text-vault-charcoal dark:text-vault-text text-xs">
              "This is a large transfer. Double-check the recipient before you continue."
            </p>
          </div>
        </div>
      )}

      {/* 4. Fee Transparency */}
      <div className="p-3.5 bg-vault-surface border border-vault-teal/30 rounded-2xl space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-vault-teal">
          <ShieldCheck className="w-4 h-4" />
          <span>Explicit Fee Breakdown</span>
        </div>
        <p className="text-xs text-vault-charcoal dark:text-vault-text leading-relaxed">
          "This transfer is free. ₹0 transfer fee via UPI. It'll reach {recipient.name.split(' ')[0]}'s account in a few seconds."
        </p>
      </div>

      {/* Error state with aria-live */}
      <div aria-live="polite">
        {errorState && (
          <div className="p-4 bg-vault-roseLight border border-vault-rose/30 rounded-2xl flex items-start gap-3 text-xs text-vault-rose animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-vault-rose" />
            <div>
              <p className="font-bold">Transfer Error</p>
              <p className="mt-1 leading-relaxed text-vault-charcoal dark:text-vault-text text-xs">{errorState}</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={handleInitiateSend}
        disabled={isLoading || !amount || parseFloat(amount) <= 0}
        className="w-full py-3.5 bg-vault-bronze hover:bg-vault-bronzeHover disabled:opacity-50 active:scale-[0.99] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-vault-bronze/20 flex items-center justify-center gap-2 focus:ring-2 focus:ring-vault-bronze"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing Transfer...</span>
          </>
        ) : (
          <>
            {user.biometricsEnabled ? <Fingerprint className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>Continue to Security Verification</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Modals */}
      <PinPadModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={handleSecuritySuccess}
        amount={amount}
        recipientName={recipient.name}
      />

      <BiometricModal
        isOpen={showBiometricModal}
        onClose={() => setShowBiometricModal(false)}
        onSuccess={handleSecuritySuccess}
        amount={amount}
        recipientName={recipient.name}
      />

      <QrScannerModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        onScanSuccess={handleQrSuccess}
      />

      <ReceiveQrModal
        isOpen={showReceiveModal}
        onClose={() => setShowReceiveModal(false)}
      />
    </div>
  );
};

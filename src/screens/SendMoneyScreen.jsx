import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, Loader2, AlertTriangle, Fingerprint, Lock, QrCode, ArrowDownLeft, Wallet } from 'lucide-react';
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
    avatarBg: "#C85A32"
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

    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorState("Please enter a valid transfer amount greater than ₹0.");
      return;
    }

    if (numAmount > MAX_SINGLE_TRANSFER) {
      setErrorState(`Transfer limit exceeded — maximum single transfer limit is ₹${MAX_SINGLE_TRANSFER.toLocaleString('en-IN')}.`);
      return;
    }

    if (numAmount > user.availableBalance) {
      setErrorState(`Insufficient funds — your available balance is ₹${user.availableBalance.toLocaleString('en-IN')}, which is less than ₹${numAmount.toLocaleString('en-IN')}.`);
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
      <div className="space-y-4 font-sans">
        <div className="bg-vault-surface border border-vault-rule rounded-xl p-6 text-center space-y-4 text-vault-ink dark:text-vault-text">
          <div className="w-12 h-12 bg-vault-emeraldLight text-vault-emerald rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-vault-ink dark:text-vault-text font-sans">Transfer Complete</h3>
            <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5 font-mono">
              Settled to <span className="font-bold text-vault-ink dark:text-vault-text font-sans">{recipient.name}</span>
            </p>
          </div>

          <div className="text-3xl sm:text-4xl font-mono font-bold text-vault-reserveBlue tabular-nums my-2">
            ₹{parseFloat(amount).toLocaleString('en-IN')}
          </div>

          <div className="p-3.5 bg-vault-paper border border-vault-rule rounded-lg text-left text-xs space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-vault-muted dark:text-vault-mutedDark">Transfer Fee</span>
              <span className="font-bold text-vault-emerald">₹0.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-vault-muted dark:text-vault-mutedDark">UPI Ref ID</span>
              <span className="font-bold text-vault-ink dark:text-vault-text text-[11px]">{successResult.upiRef}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-vault-muted dark:text-vault-mutedDark">Updated Balance</span>
              <span className="font-bold tabular-nums text-vault-ink dark:text-vault-text">
                ₹{user.availableBalance.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-2 font-mono">
            <button
              onClick={resetForm}
              className="flex-1 py-2 bg-vault-paper border border-vault-rule text-vault-ink dark:text-vault-text font-bold text-xs rounded-lg hover:bg-vault-surfaceHighlight transition-colors"
            >
              Send Another
            </button>

            <button
              onClick={() => setActiveTab('home')}
              className="flex-1 py-2 bg-vault-reserveBlue text-white font-bold text-xs rounded-lg hover:bg-vault-reserveBlueHover transition-colors"
            >
              Overview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans max-w-2xl mx-auto">
      {/* Header title */}
      <div className="flex items-center justify-between pb-3 border-b border-vault-rule">
        <div>
          <h2 className="text-lg font-bold text-vault-ink dark:text-vault-text tracking-tight font-sans">Send Money</h2>
          <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5 font-mono">
            Direct bank transfer & UPI settlement
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            aria-label="Scan Merchant or Friend QR Code"
            onClick={() => setShowQrModal(true)}
            className="px-2.5 py-1.5 bg-vault-paper border border-vault-rule text-vault-ink dark:text-vault-text font-bold rounded-lg flex items-center gap-1.5 hover:border-vault-reserveBlue transition-colors"
          >
            <QrCode className="w-3.5 h-3.5 text-vault-reserveBlue" />
            <span>Scan QR</span>
          </button>
        </div>
      </div>

      {/* PROMINENT VISUAL AMOUNT ANCHOR */}
      <div className="py-4 text-center space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-vault-muted dark:text-vault-mutedDark">
          TRANSFER AMOUNT
        </span>
        <div className="flex items-center justify-center gap-1">
          <span className="font-serif text-3xl sm:text-4xl font-bold text-vault-reserveBlue">₹</span>
          <input 
            id="send-amount-input"
            type="number"
            min="1"
            max={MAX_SINGLE_TRANSFER}
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setErrorState(null); }}
            placeholder="0"
            className="w-48 bg-transparent text-4xl sm:text-5xl font-mono font-bold text-vault-ink dark:text-vault-text focus:outline-none text-center tabular-nums"
          />
        </div>
        <p className="text-xs font-mono text-vault-muted dark:text-vault-mutedDark">
          Available: <span className="font-bold text-vault-ink dark:text-vault-text tabular-nums">₹{user.availableBalance.toLocaleString('en-IN')}</span>
        </p>

        {/* Quick Amount Chips */}
        <div className="flex justify-center gap-1.5 pt-2 max-w-md mx-auto">
          {[500, 1000, 2500, 5000, 10000].map(val => (
            <button
              key={val}
              type="button"
              aria-label={`Set amount to ${val} rupees`}
              onClick={() => handleQuickAmount(val)}
              className="px-2.5 py-1 bg-vault-paper hover:bg-vault-surfaceHighlight border border-vault-rule rounded-lg text-xs font-mono font-bold text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink dark:hover:text-vault-text transition-colors tabular-nums"
            >
              +₹{val}
            </button>
          ))}
        </div>
      </div>

      {/* FORM ROWS */}
      <div className="space-y-4">
        {/* Recipient Row */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider block">
            RECIPIENT
          </label>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {contacts.map(c => {
              const isSelected = selectedContact?.id === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-label={`Select recipient ${c.name}`}
                  onClick={() => { setSelectedContact(c); setCustomUpi(''); }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg shrink-0 transition-colors border text-left ${
                    isSelected 
                      ? 'bg-vault-surfaceHighlight border-vault-reserveBlue text-vault-ink dark:text-vault-text font-bold' 
                      : 'bg-vault-paper border-vault-rule text-vault-muted dark:text-vault-mutedDark hover:border-vault-muted'
                  }`}
                >
                  <img 
                    src={c.avatar} 
                    alt={`${c.name}'s profile avatar`}
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full object-cover shrink-0 border border-vault-rule" 
                  />
                  <div className="text-xs">
                    <p className="font-bold leading-none">{c.name.split(' ')[0]}</p>
                    <p className="text-[10px] font-mono text-vault-muted dark:text-vault-mutedDark mt-0.5">{c.upiId}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Source Account Row */}
        <div className="space-y-1.5 font-mono text-xs">
          <label className="font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider block">
            PAYMENT SOURCE
          </label>
          <div className="p-3 bg-vault-surface border border-vault-rule rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Wallet className="w-4 h-4 text-vault-reserveBlue" />
              <div>
                <p className="font-bold text-vault-ink dark:text-vault-text font-sans">VAULT Reserve Account</p>
                <p className="text-[10px] text-vault-muted dark:text-vault-mutedDark">A/C •••• {user.accountNo.slice(-4)}</p>
              </div>
            </div>
            <span className="text-[10px] text-vault-emerald font-bold bg-vault-emeraldLight px-2 py-0.5 rounded border border-vault-emerald/20">
              Active
            </span>
          </div>
        </div>

        {/* Optional Note Row */}
        <div className="space-y-1.5 font-mono text-xs">
          <label className="font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider block">
            REFERENCE NOTE (OPTIONAL)
          </label>
          <input 
            type="text"
            placeholder="Add note or message for recipient..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            aria-label="Add a transfer note"
            className="w-full bg-vault-surface border border-vault-rule rounded-lg px-3 py-2 text-xs text-vault-ink dark:text-vault-text placeholder-vault-muted focus:outline-none focus:border-vault-reserveBlue font-mono"
          />
        </div>
      </div>

      {/* Large Transfer Alert */}
      {isLargeTransfer && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-2.5 text-xs text-amber-600 dark:text-amber-400 font-mono">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">High Value Transfer</p>
            <p className="mt-0.5 text-vault-ink dark:text-vault-text text-xs">Verify recipient details prior to authorization.</p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      <div aria-live="polite">
        {errorState && (
          <div className="p-3 bg-vault-roseLight border border-vault-rose/30 rounded-lg flex items-start gap-2 text-xs text-vault-rose font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-vault-rose" />
            <div>
              <p className="font-bold">Transfer Error</p>
              <p className="mt-0.5 text-vault-ink dark:text-vault-text text-xs">{errorState}</p>
            </div>
          </div>
        )}
      </div>

      {/* Primary Action Button (Substantial & Restrained) */}
      <button
        type="button"
        onClick={handleInitiateSend}
        disabled={isLoading || !amount || parseFloat(amount) <= 0}
        className="w-full py-3 bg-vault-reserveBlue hover:bg-vault-reserveBlueHover disabled:opacity-50 text-white font-mono font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Settling Transfer...</span>
          </>
        ) : (
          <>
            {user.biometricsEnabled ? <Fingerprint className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>Authorize & Transfer ₹{numAmount.toLocaleString('en-IN')}</span>
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



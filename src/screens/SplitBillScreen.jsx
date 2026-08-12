import React, { useState } from 'react';
import { Users, Check, ArrowRight, Info, ShieldCheck, Lock, Fingerprint } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { PinPadModal } from '../components/PinPadModal';
import { BiometricModal } from '../components/BiometricModal';

export const SplitBillScreen = () => {
  const { user, contacts, createSplitRequest, setActiveTab } = useVault();

  const [selectedIds, setSelectedIds] = useState(['c1', 'c2']); // Default Aditi & Rahul
  const [totalAmount, setTotalAmount] = useState('3600');
  const [description, setDescription] = useState('Weekend Dinner & Drinks');
  
  const [showPinModal, setShowPinModal] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleContact = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length === 1) return;
      setSelectedIds(prev => prev.filter(cId => cId !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const totalPeople = selectedIds.length + 1;
  const numTotal = parseFloat(totalAmount) || 0;
  const perPerson = (numTotal / totalPeople).toFixed(2);

  const handleInitiateSplit = () => {
    if (numTotal <= 0) return;
    if (user.biometricsEnabled) {
      setShowBiometricModal(true);
    } else {
      setShowPinModal(true);
    }
  };

  const handleSecuritySuccess = () => {
    setShowPinModal(false);
    setShowBiometricModal(false);
    const success = createSplitRequest(selectedIds, totalAmount, description);
    if (success) {
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-5 animate-in fade-in zoom-in-95">
        <div className="bg-vault-surface border border-vault-border rounded-3xl p-6 text-center space-y-4 shadow-sm text-vault-charcoal">
          <div className="w-16 h-16 bg-vault-terracottaLight border border-vault-terracotta/40 text-vault-terracotta rounded-full flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-vault-charcoal">Split Request Sent</h3>
            <p className="text-xs text-vault-muted mt-1">
              For "{description}"
            </p>
          </div>

          <div className="p-4 bg-vault-paper border border-vault-border rounded-2xl text-left space-y-2 text-xs">
            <div className="flex justify-between border-b border-vault-border pb-2">
              <span className="text-vault-muted">Total Bill</span>
              <span className="font-display font-bold text-vault-charcoal">₹{numTotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between border-b border-vault-border pb-2">
              <span className="text-vault-muted">Split Among</span>
              <span className="font-bold text-vault-charcoal">{totalPeople} people (You + {selectedIds.length} friends)</span>
            </div>

            <div className="flex justify-between pt-1">
              <span className="text-vault-muted font-medium">Request amount per friend</span>
              <span className="font-display font-bold text-vault-terracotta text-sm">₹{parseFloat(perPerson).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="p-3.5 bg-vault-paper border border-vault-border rounded-xl text-left text-xs text-vault-muted leading-relaxed">
            <p className="text-vault-charcoal font-bold mb-0.5">What happens next?</p>
            "A payment request notification is sent to each person. Funds are credited directly to your Vault balance as soon as they approve & pay."
          </div>

          <button
            onClick={() => { setIsSuccess(false); setActiveTab('home'); }}
            className="w-full py-3 bg-vault-terracotta text-white font-semibold text-xs rounded-xl hover:bg-vault-terracottaHover transition-colors shadow-md shadow-vault-terracotta/20"
          >
            Done & Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header title */}
      <div>
        <h2 className="text-xl font-bold text-vault-charcoal tracking-tight">Split a Bill</h2>
        <p className="text-xs text-vault-muted mt-0.5">
          Share costs transparently without awkward math
        </p>
      </div>

      {/* 1. Description & Amount */}
      <div className="bg-vault-surface border border-vault-border rounded-2xl p-4 space-y-3 shadow-xs">
        <div>
          <label className="text-xs font-bold text-vault-muted uppercase tracking-wider block mb-1">
            Bill Description
          </label>
          <input 
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Dinner at Toit, Airbnb Goa"
            className="w-full bg-vault-paper border border-vault-border rounded-xl px-3 py-2 text-xs text-vault-charcoal placeholder-vault-muted focus:outline-none focus:border-vault-terracotta"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-vault-muted uppercase tracking-wider block mb-1">
            Total Amount
          </label>
          <div className="flex items-center bg-vault-paper border border-vault-border rounded-xl px-4 py-2 focus-within:border-vault-terracotta">
            <span className="text-2xl font-bold text-vault-muted mr-1">₹</span>
            <input 
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-transparent text-2xl font-display font-bold text-vault-charcoal focus:outline-none tabular-nums"
            />
          </div>
        </div>
      </div>

      {/* 2. Select Friends */}
      <div className="bg-vault-surface border border-vault-border rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex justify-between items-center text-xs">
          <label className="font-bold text-vault-muted uppercase tracking-wider">
            Split With ({selectedIds.length} Selected)
          </label>
          <span className="text-vault-terracotta font-bold">Tap to toggle</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {contacts.map(c => {
            const isSelected = selectedIds.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleContact(c.id)}
                className={`p-2.5 rounded-2xl border flex items-center justify-between transition-all ${
                  isSelected 
                    ? 'bg-vault-terracottaLight border-vault-terracotta text-vault-charcoal' 
                    : 'bg-vault-paper border-vault-border text-vault-muted hover:border-vault-borderDark'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img 
                    src={c.avatar} 
                    alt={c.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0" 
                  />
                  <div className="text-left min-w-0">
                    <p className="text-xs font-bold truncate">{c.name}</p>
                    <p className="text-[10px] text-vault-muted truncate">{c.upiId}</p>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                  isSelected ? 'bg-vault-terracotta border-vault-terracotta text-white' : 'border-vault-border bg-vault-paper'
                }`}>
                  {isSelected && <Check className="w-3 h-3" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Live Breakdown Summary Card */}
      <div className="bg-vault-paper border border-vault-border rounded-2xl p-4 space-y-2 text-xs">
        <div className="flex justify-between items-center text-vault-muted font-medium">
          <span>Calculation</span>
          <span>Equal ({totalPeople} ways)</span>
        </div>

        <div className="flex justify-between items-center text-sm font-bold text-vault-charcoal pt-1 border-t border-vault-border">
          <span>Each person owes:</span>
          <span className="font-display text-base text-vault-terracotta tabular-nums">
            ₹{parseFloat(perPerson).toLocaleString('en-IN')}
          </span>
        </div>

        <p className="text-[11px] text-vault-muted pt-1">
          Your share is ₹{parseFloat(perPerson).toLocaleString('en-IN')}. Requests for ₹{parseFloat(perPerson).toLocaleString('en-IN')} each will be sent to {selectedIds.length} friends.
        </p>
      </div>

      {/* 4. Human Tone Explanation */}
      <div className="p-3.5 bg-vault-paper border border-vault-border rounded-2xl flex items-start gap-2.5 text-xs text-vault-muted leading-relaxed">
        <Info className="w-4 h-4 text-vault-terracotta shrink-0 mt-0.5" />
        <span>
          A request notification is sent to each person. Money is never silently deducted from anyone's account.
        </span>
      </div>

      {/* 5. Submit Button -> PIN Pad / Biometrics */}
      <button
        onClick={handleInitiateSplit}
        disabled={numTotal <= 0 || selectedIds.length === 0}
        className="w-full py-3.5 bg-vault-terracotta hover:bg-vault-terracottaHover active:scale-[0.99] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-vault-terracotta/20 flex items-center justify-center gap-2"
      >
        {user.biometricsEnabled ? <Fingerprint className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
        <span>Verify & Send Request (₹{parseFloat(perPerson).toLocaleString('en-IN')} each)</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* 6-Digit PIN Entry Modal */}
      <PinPadModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={handleSecuritySuccess}
        amount={perPerson}
        recipientName={`${selectedIds.length} friends`}
      />

      {/* Biometric Modal */}
      <BiometricModal
        isOpen={showBiometricModal}
        onClose={() => setShowBiometricModal(false)}
        onSuccess={handleSecuritySuccess}
        amount={perPerson}
        recipientName={`${selectedIds.length} friends`}
      />
    </div>
  );
};

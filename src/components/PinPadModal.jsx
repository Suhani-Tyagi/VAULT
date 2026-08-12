import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, Delete, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import PropTypes from 'prop-types';

export const PinPadModal = ({ isOpen, onClose, onSuccess, amount, recipientName }) => {
  const { verifyPin, lockState, showToast } = useVault();
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      setPin('');
      setErrorMsg('');
      setIsShaking(false);

      setTimeout(() => {
        if (modalRef.current) {
          const firstFocusable = modalRef.current.querySelector('button, [tabindex="0"]');
          if (firstFocusable) firstFocusable.focus();
        }
      }, 50);
    } else {
      if (previousFocusRef.current && previousFocusRef.current.focus) {
        previousFocusRef.current.focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigitClick = (digit) => {
    if (lockState.isLocked) return;
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMsg('');

      if (nextPin.length === 6) {
        setTimeout(() => submitPin(nextPin), 150);
      }
    }
  };

  const handleBackspace = () => {
    if (lockState.isLocked) return;
    setPin(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    if (lockState.isLocked) return;
    setPin('');
    setErrorMsg('');
  };

  const submitPin = (pinToTest) => {
    const isCorrect = verifyPin(pinToTest);

    if (isCorrect) {
      onSuccess();
    } else {
      setPin('');
      setIsShaking(true);
      setErrorMsg("That PIN doesn't match. Please try again.");
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <motion.div 
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pin-modal-title"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`relative w-full max-w-xs sm:max-w-sm bg-vault-surface border border-vault-border rounded-3xl p-6 shadow-2xl overflow-hidden z-10 text-vault-charcoal dark:text-vault-text text-center focus:outline-none ${
            isShaking ? 'animate-shake' : ''
          }`}
        >
          {/* Close button */}
          <button 
            type="button"
            onClick={onClose}
            aria-label="Close PIN modal"
            className="absolute top-4 right-4 p-1.5 text-vault-muted dark:text-vault-mutedDark hover:text-vault-charcoal dark:hover:text-vault-text rounded-full hover:bg-vault-surfaceHighlight focus:ring-2 focus:ring-vault-bronze"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="w-12 h-12 bg-vault-bronzeLight border border-vault-bronze/30 text-vault-bronze rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>

          <h3 id="pin-modal-title" className="text-base font-bold text-vault-charcoal dark:text-vault-text">
            Enter 6-Digit Vault PIN
          </h3>

          {amount && recipientName && (
            <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-1">
              Authorizing transfer of <strong className="text-vault-bronze font-display">₹{parseFloat(amount).toLocaleString('en-IN')}</strong> to <strong className="text-vault-charcoal dark:text-vault-text">{recipientName}</strong>
            </p>
          )}

          {/* Lockout Screen */}
          {lockState.isLocked ? (
            <div className="my-6 p-4 bg-vault-roseLight border border-vault-rose/30 rounded-2xl text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-vault-rose mx-auto animate-bounce" />
              <h4 className="text-sm font-bold text-vault-rose">Security Lockout Active</h4>
              <p className="text-xs text-vault-charcoal dark:text-vault-text">
                Too many failed PIN attempts. Please wait <strong className="text-vault-rose font-mono text-sm">{lockState.remainingSeconds}s</strong> before trying again.
              </p>
            </div>
          ) : (
            <>
              {/* PIN Indicator Dots */}
              <div className="flex justify-center gap-3 my-6">
                {[0, 1, 2, 3, 4, 5].map((index) => {
                  const isFilled = pin.length > index;
                  return (
                    <div 
                      key={index}
                      className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                        isFilled 
                          ? 'bg-vault-bronze scale-110 shadow-xs' 
                          : 'border-2 border-vault-border bg-vault-paper'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Error Message */}
              <div aria-live="polite" className="min-h-[24px]">
                {errorMsg && (
                  <p className="text-xs text-vault-rose font-semibold mb-2 animate-in fade-in">
                    {errorMsg}
                  </p>
                )}
              </div>

              {/* Numeric Keypad Grid */}
              <div className="grid grid-cols-3 gap-2.5 my-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    aria-label={`Digit ${digit}`}
                    onClick={() => handleDigitClick(digit.toString())}
                    className="h-12 bg-vault-paper hover:bg-vault-surfaceHighlight active:bg-vault-bronzeLight border border-vault-border rounded-2xl font-display text-lg font-bold text-vault-charcoal dark:text-vault-text transition-all focus:outline-none focus:ring-2 focus:ring-vault-bronze"
                  >
                    {digit}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Clear PIN"
                  className="h-12 bg-vault-paper hover:bg-vault-surfaceHighlight border border-vault-border rounded-2xl text-xs font-bold text-vault-muted dark:text-vault-mutedDark hover:text-vault-charcoal dark:hover:text-vault-text transition-all focus:outline-none focus:ring-2 focus:ring-vault-bronze"
                >
                  Clear
                </button>

                <button
                  type="button"
                  aria-label="Digit 0"
                  onClick={() => handleDigitClick('0')}
                  className="h-12 bg-vault-paper hover:bg-vault-surfaceHighlight active:bg-vault-bronzeLight border border-vault-border rounded-2xl font-display text-lg font-bold text-vault-charcoal dark:text-vault-text transition-all focus:outline-none focus:ring-2 focus:ring-vault-bronze"
                >
                  0
                </button>

                <button
                  type="button"
                  onClick={handleBackspace}
                  aria-label="Backspace PIN digit"
                  className="h-12 bg-vault-paper hover:bg-vault-surfaceHighlight border border-vault-border rounded-2xl flex items-center justify-center text-vault-muted dark:text-vault-mutedDark hover:text-vault-charcoal dark:hover:text-vault-text transition-all focus:outline-none focus:ring-2 focus:ring-vault-bronze"
                >
                  <Delete className="w-5 h-5" />
                </button>
              </div>
            </>
          )}

          {/* Security Subtext */}
          <p className="text-[11px] text-vault-muted dark:text-vault-mutedDark mt-4 pt-3 border-t border-vault-border flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-vault-teal shrink-0" />
            <span>Vault Sandbox Security • Default PIN is 123456</span>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

PinPadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  amount: PropTypes.string,
  recipientName: PropTypes.string
};

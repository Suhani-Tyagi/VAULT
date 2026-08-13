import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, Delete, ShieldCheck, AlertCircle } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import PropTypes from 'prop-types';

export const PinPadModal = ({ isOpen, onClose, onSuccess, amount, recipientName }) => {
  const { verifyPin, lockState } = useVault();
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <motion.div 
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pin-modal-title"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className={`relative w-full max-w-xs sm:max-w-sm bg-vault-surface border border-vault-rule rounded-xl p-5 shadow-xl text-vault-ink dark:text-vault-text text-center focus:outline-none font-sans ${
            isShaking ? 'animate-shake' : ''
          }`}
        >
          {/* Close button */}
          <button 
            type="button"
            onClick={onClose}
            aria-label="Close PIN modal"
            className="absolute top-4 right-4 p-1 text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink rounded hover:bg-vault-surfaceHighlight"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="w-10 h-10 bg-vault-paper border border-vault-rule text-vault-reserveBlue rounded-lg flex items-center justify-center mx-auto mb-2.5">
            <Lock className="w-5 h-5" />
          </div>

          <h3 id="pin-modal-title" className="text-sm font-bold text-vault-ink dark:text-vault-text font-sans">
            Enter 6-Digit Vault PIN
          </h3>

          {amount && recipientName && (
            <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-1 font-mono">
              Authorizing <strong className="text-vault-reserveBlue">₹{parseFloat(amount).toLocaleString('en-IN')}</strong> to <strong className="text-vault-ink dark:text-vault-text">{recipientName}</strong>
            </p>
          )}

          {/* Lockout Screen */}
          {lockState.isLocked ? (
            <div className="my-5 p-4 bg-vault-roseLight border border-vault-rose/20 rounded-lg text-center space-y-2 font-mono">
              <AlertCircle className="w-6 h-6 text-vault-rose mx-auto" />
              <h4 className="text-xs font-bold text-vault-rose">Security Lockout Active</h4>
              <p className="text-xs text-vault-ink dark:text-vault-text">
                Too many attempts. Retry in <strong className="text-vault-rose tabular-nums">{lockState.remainingSeconds}s</strong>.
              </p>
            </div>
          ) : (
            <>
              {/* PIN Indicator Dots */}
              <div className="flex justify-center gap-2.5 my-5">
                {[0, 1, 2, 3, 4, 5].map((index) => {
                  const isFilled = pin.length > index;
                  return (
                    <div 
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        isFilled 
                          ? 'bg-vault-reserveBlue' 
                          : 'border border-vault-rule bg-vault-paper'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Error Message */}
              <div aria-live="polite" className="min-h-[20px]">
                {errorMsg && (
                  <p className="text-xs text-vault-rose font-semibold mb-2 font-mono">
                    {errorMsg}
                  </p>
                )}
              </div>

              {/* Numeric Keypad Grid */}
              <div className="grid grid-cols-3 gap-2 my-2 font-mono">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    aria-label={`Digit ${digit}`}
                    onClick={() => handleDigitClick(digit.toString())}
                    className="h-11 bg-vault-paper hover:bg-vault-surfaceHighlight border border-vault-rule rounded-lg text-base font-bold text-vault-ink dark:text-vault-text transition-colors"
                  >
                    {digit}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Clear PIN"
                  className="h-11 bg-vault-paper hover:bg-vault-surfaceHighlight border border-vault-rule rounded-lg text-xs font-bold text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink transition-colors"
                >
                  Clear
                </button>

                <button
                  type="button"
                  aria-label="Digit 0"
                  onClick={() => handleDigitClick('0')}
                  className="h-11 bg-vault-paper hover:bg-vault-surfaceHighlight border border-vault-rule rounded-lg text-base font-bold text-vault-ink dark:text-vault-text transition-colors"
                >
                  0
                </button>

                <button
                  type="button"
                  onClick={handleBackspace}
                  aria-label="Backspace PIN digit"
                  className="h-11 bg-vault-paper hover:bg-vault-surfaceHighlight border border-vault-rule rounded-lg flex items-center justify-center text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink transition-colors"
                >
                  <Delete className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {/* Security Subtext */}
          <p className="text-[11px] font-mono text-vault-muted dark:text-vault-mutedDark mt-3 pt-2.5 border-t border-vault-rule flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-vault-emerald shrink-0" />
            <span>Vault Verification • Default PIN is 123456</span>
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


import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Delete, X, Lock, Loader2, AlertTriangle } from 'lucide-react';

export const PinPadModal = ({ isOpen, onClose, onSuccess, amount, recipientName }) => {
  const [pin, setPin] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [isShaking, setIsShaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutCountdown, setLockoutCountdown] = useState(30);

  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  const CORRECT_PIN = "123456";

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
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

  useEffect(() => {
    let timer = null;
    if (isLocked && lockoutCountdown > 0) {
      timer = setInterval(() => {
        setLockoutCountdown(prev => prev - 1);
      }, 1000);
    } else if (lockoutCountdown === 0) {
      setIsLocked(false);
      setAttemptsLeft(3);
      setLockoutCountdown(30);
      setErrorMessage(null);
      setPin('');
    }
    return () => { if (timer) clearInterval(timer); };
  }, [isLocked, lockoutCountdown]);

  if (!isOpen) return null;

  const handleKeyPress = (num) => {
    if (isLocked || isVerifying) return;
    if (pin.length < 6) {
      const nextPin = pin + num;
      setPin(nextPin);
      setErrorMessage(null);

      if (nextPin.length === 6) {
        verifyPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    if (isLocked || isVerifying) return;
    setPin(prev => prev.slice(0, -1));
    setErrorMessage(null);
  };

  const handleClear = () => {
    if (isLocked || isVerifying) return;
    setPin('');
    setErrorMessage(null);
  };

  const verifyPin = (enteredPin) => {
    setIsVerifying(true);

    setTimeout(() => {
      if (enteredPin === CORRECT_PIN) {
        setIsVerifying(false);
        onSuccess();
      } else {
        setIsVerifying(false);
        const remaining = attemptsLeft - 1;
        setAttemptsLeft(remaining);
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 400);

        if (remaining <= 0) {
          setIsLocked(true);
          setErrorMessage("Too many attempts. For your security, try again in 30 seconds");
        } else {
          setErrorMessage(`That PIN doesn't match. ${remaining} ${remaining === 1 ? 'attempt' : 'attempts'} left.`);
          setPin('');
        }
      }
    }, 750);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
        {/* Backdrop click */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />

        {/* Modal Dialog */}
        <motion.div 
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pinpad-modal-title"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="relative w-full max-w-sm bg-vault-surface border border-vault-border rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl overflow-hidden z-10 text-vault-charcoal focus:outline-none"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            aria-label="Close PIN Verification"
            className="absolute top-4 right-4 p-1.5 text-vault-muted hover:text-vault-charcoal rounded-full hover:bg-vault-surfaceHighlight focus:ring-2 focus:ring-vault-terracotta"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mt-2 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-vault-terracottaLight border border-vault-terracotta/20 text-vault-terracotta flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <h3 id="pinpad-modal-title" className="text-lg font-bold text-vault-charcoal tracking-tight">
              Enter 6-Digit Vault PIN
            </h3>
            <p className="text-xs text-vault-muted mt-0.5">
              Confirming security authorization for {recipientName || 'account action'}
            </p>
          </div>

          {/* 6 Dots Row */}
          <div className={`flex justify-center items-center gap-3 my-5 ${isShaking ? 'animate-shake' : ''}`}>
            {[0, 1, 2, 3, 4, 5].map(idx => {
              const isFilled = idx < pin.length;
              return (
                <div 
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    isFilled 
                      ? 'bg-vault-terracotta scale-110 shadow-sm shadow-vault-terracotta/40' 
                      : 'bg-vault-paper border-2 border-vault-border'
                  }`}
                />
              );
            })}
          </div>

          {/* Error Message */}
          <div aria-live="polite" className="min-h-[32px]">
            {errorMessage && (
              <div className="mb-4 p-2.5 rounded-xl bg-vault-roseLight border border-vault-rose/30 text-center text-xs font-semibold text-vault-rose flex items-center justify-center gap-1.5 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Verifying Spinner overlay */}
          {isVerifying ? (
            <div aria-live="polite" className="py-12 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-8 h-8 text-vault-terracotta animate-spin" />
              <p className="text-xs font-semibold text-vault-muted">Verifying PIN with bank server...</p>
            </div>
          ) : isLocked ? (
            <div aria-live="polite" className="py-8 text-center space-y-3 bg-vault-paper border border-vault-border rounded-2xl">
              <Lock className="w-8 h-8 text-vault-rose mx-auto" />
              <div>
                <p className="text-xs font-bold text-vault-charcoal">PIN Verification Locked</p>
                <p className="text-[11px] text-vault-muted mt-0.5">Try again after countdown expires</p>
              </div>
              <div className="text-2xl font-display font-bold text-vault-rose tabular-nums">
                00:{lockoutCountdown < 10 ? `0${lockoutCountdown}` : lockoutCountdown}
              </div>
            </div>
          ) : (
            /* Custom On-Screen Numeric Keypad */
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  type="button"
                  aria-label={`Digit ${num}`}
                  onClick={() => handleKeyPress(num.toString())}
                  className="py-3 bg-vault-paper hover:bg-vault-surfaceHighlight active:bg-vault-border border border-vault-border rounded-2xl text-lg font-display font-bold text-vault-charcoal active:scale-95 transition-all shadow-xs tabular-nums focus:ring-2 focus:ring-vault-terracotta"
                >
                  {num}
                </button>
              ))}

              <button
                type="button"
                aria-label="Clear PIN entry"
                onClick={handleClear}
                className="py-3 bg-vault-paper hover:bg-vault-surfaceHighlight active:bg-vault-border border border-vault-border rounded-2xl text-xs font-semibold text-vault-muted active:scale-95 transition-all focus:ring-2 focus:ring-vault-terracotta"
              >
                Clear
              </button>

              <button
                type="button"
                aria-label="Digit 0"
                onClick={() => handleKeyPress('0')}
                className="py-3 bg-vault-paper hover:bg-vault-surfaceHighlight active:bg-vault-border border border-vault-border rounded-2xl text-lg font-display font-bold text-vault-charcoal active:scale-95 transition-all shadow-xs tabular-nums focus:ring-2 focus:ring-vault-terracotta"
              >
                0
              </button>

              <button
                type="button"
                aria-label="Backspace"
                onClick={handleBackspace}
                className="py-3 bg-vault-paper hover:bg-vault-surfaceHighlight active:bg-vault-border border border-vault-border rounded-2xl text-vault-muted hover:text-vault-charcoal active:scale-95 transition-all flex items-center justify-center focus:ring-2 focus:ring-vault-terracotta"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

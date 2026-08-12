import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Scan, ShieldCheck, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { useDevice } from '../context/DeviceContext';
import PropTypes from 'prop-types';

export const BiometricModal = ({ isOpen, onClose, onSuccess, amount, recipientName }) => {
  const { os } = useDevice();
  const [scanState, setScanState] = useState('idle'); // 'idle' | 'scanning' | 'success' | 'error'
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  let label = "Biometric Verification";
  let IconComponent = Fingerprint;

  if (os === 'ios') {
    label = "Face ID";
    IconComponent = Scan;
  } else if (os === 'android') {
    label = "Touch ID / Fingerprint";
    IconComponent = Fingerprint;
  }

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      setScanState('idle');

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

  const handleStartScan = () => {
    setScanState('scanning');
    
    setTimeout(() => {
      setScanState('success');
      setTimeout(() => {
        onSuccess();
      }, 600);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <motion.div 
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="biometric-modal-title"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-xs sm:max-w-sm bg-vault-surface border border-vault-border rounded-3xl p-6 shadow-2xl overflow-hidden z-10 text-vault-charcoal dark:text-vault-text text-center focus:outline-none"
        >
          {/* Close button */}
          <button 
            type="button"
            onClick={onClose}
            aria-label="Close biometric verification modal"
            className="absolute top-4 right-4 p-1.5 text-vault-muted dark:text-vault-mutedDark hover:text-vault-charcoal dark:hover:text-vault-text rounded-full hover:bg-vault-surfaceHighlight focus:ring-2 focus:ring-vault-bronze"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="mt-2 mb-3">
            <h3 id="biometric-modal-title" className="text-lg font-bold text-vault-charcoal dark:text-vault-text tracking-tight">
              {label}
            </h3>
            {amount && recipientName ? (
              <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-1">
                Confirming transfer of <strong className="text-vault-bronze font-display">₹{parseFloat(amount).toLocaleString('en-IN')}</strong> to <strong className="text-vault-charcoal dark:text-vault-text">{recipientName}</strong>
              </p>
            ) : (
              <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-1">
                Use your device's biometrics to authorize action
              </p>
            )}
          </div>

          {/* Biometric Interactive Scan Circle */}
          <div className="my-6 flex justify-center">
            <button
              type="button"
              aria-label={`Trigger ${label} scan`}
              onClick={handleStartScan}
              disabled={scanState === 'scanning' || scanState === 'success'}
              className={`w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 relative border-2 focus:outline-none focus:ring-4 focus:ring-vault-bronze/40 ${
                scanState === 'success' 
                  ? 'bg-vault-tealLight border-vault-teal text-vault-teal scale-105' 
                  : scanState === 'scanning'
                    ? 'bg-vault-bronzeLight border-vault-bronze text-vault-bronze animate-pulse scale-105'
                    : 'bg-vault-paper border-vault-border hover:border-vault-bronze text-vault-bronze shadow-md active:scale-95'
              }`}
            >
              {scanState === 'success' ? (
                <CheckCircle2 className="w-12 h-12 text-vault-teal animate-in zoom-in" />
              ) : (
                <IconComponent className={`w-12 h-12 ${scanState === 'scanning' ? 'animate-bounce' : ''}`} />
              )}

              {scanState === 'scanning' && (
                <div className="absolute inset-0 rounded-full border-2 border-vault-bronze border-t-transparent animate-spin" />
              )}
            </button>
          </div>

          {/* Status Message */}
          <div aria-live="polite" className="min-h-[32px] text-xs font-semibold">
            {scanState === 'idle' && (
              <p className="text-vault-muted dark:text-vault-mutedDark">Tap icon above to scan {label}</p>
            )}
            {scanState === 'scanning' && (
              <p className="text-vault-bronze animate-pulse">Scanning biometric sensor...</p>
            )}
            {scanState === 'success' && (
              <p className="text-vault-teal font-bold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Authenticated Cleanly
              </p>
            )}
          </div>

          {/* Security Assurance Footer */}
          <div className="mt-4 pt-3 border-t border-vault-border flex items-center justify-center gap-1.5 text-[11px] text-vault-muted dark:text-vault-mutedDark">
            <ShieldCheck className="w-3.5 h-3.5 text-vault-teal shrink-0" />
            <span>Biometric Hardware Key Protected • Vault Sandbox</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

BiometricModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  amount: PropTypes.string,
  recipientName: PropTypes.string
};

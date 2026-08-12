import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Scan, ShieldCheck, X, Loader2 } from 'lucide-react';
import { useDevice } from '../context/DeviceContext';

export const BiometricModal = ({ isOpen, onClose, onSuccess, amount, recipientName }) => {
  const { os } = useDevice();
  const [isScanning, setIsScanning] = useState(false);
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

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

  if (!isOpen) return null;

  let biometricName = "Biometric ID";
  let IconComponent = ShieldCheck;

  if (os === 'ios') {
    biometricName = "Face ID";
    IconComponent = Scan;
  } else if (os === 'android') {
    biometricName = "Fingerprint";
    IconComponent = Fingerprint;
  }

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onSuccess();
    }, 850);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />

        <motion.div 
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="biometric-modal-title"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="relative w-full max-w-sm bg-vault-surface border border-vault-border rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl overflow-hidden z-10 text-vault-charcoal dark:text-vault-text text-center focus:outline-none"
        >
          <button 
            onClick={onClose}
            aria-label="Close Biometric Verification"
            className="absolute top-4 right-4 p-1.5 text-vault-muted dark:text-vault-mutedDark hover:text-vault-charcoal dark:hover:text-vault-text rounded-full hover:bg-vault-surfaceHighlight focus:ring-2 focus:ring-vault-terracotta"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mt-2 mb-4">
            <h3 id="biometric-modal-title" className="text-lg font-bold text-vault-charcoal dark:text-vault-text tracking-tight">
              {biometricName} Verification
            </h3>
            <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5">
              Confirming <strong className="text-vault-terracotta font-display">₹{parseFloat(amount || 0).toLocaleString('en-IN')}</strong> transfer to {recipientName || 'Recipient'}
            </p>
          </div>

          <div className="my-6 py-4 flex flex-col items-center">
            <button
              type="button"
              aria-label={`Scan ${biometricName} to authenticate transfer`}
              onClick={handleScan}
              disabled={isScanning}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all focus:ring-4 focus:ring-vault-terracotta/50 ${
                isScanning 
                  ? 'bg-vault-terracottaLight border-2 border-vault-terracotta scale-105' 
                  : 'bg-vault-paper border-2 border-vault-terracotta/40 hover:border-vault-terracotta hover:scale-105 active:scale-95 shadow-md'
              }`}
            >
              {isScanning ? (
                <Loader2 className="w-12 h-12 text-vault-terracotta animate-spin" />
              ) : (
                <IconComponent className="w-12 h-12 text-vault-terracotta" />
              )}
            </button>

            <p aria-live="polite" className="text-xs font-semibold text-vault-charcoal dark:text-vault-text mt-4">
              {isScanning ? `Verifying ${biometricName}...` : `Touch/Scan sensor to authorize with ${biometricName}`}
            </p>
          </div>

          <div className="p-3 bg-vault-paper border border-vault-border rounded-2xl text-xs text-vault-muted dark:text-vault-mutedDark">
            Vault {biometricName} Security Active
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

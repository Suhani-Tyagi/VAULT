import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Scan, ShieldCheck, X, CheckCircle2 } from 'lucide-react';
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <motion.div 
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="biometric-modal-title"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="relative w-full max-w-xs sm:max-w-sm bg-vault-surface border border-vault-rule rounded-xl p-5 shadow-xl text-vault-ink dark:text-vault-text text-center focus:outline-none font-sans"
        >
          {/* Close button */}
          <button 
            type="button"
            onClick={onClose}
            aria-label="Close biometric verification modal"
            className="absolute top-4 right-4 p-1 text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink rounded hover:bg-vault-surfaceHighlight"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="mt-1 mb-3">
            <h3 id="biometric-modal-title" className="text-sm font-bold text-vault-ink dark:text-vault-text font-sans">
              {label}
            </h3>
            {amount && recipientName ? (
              <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-1 font-mono">
                Confirming <strong className="text-vault-reserveBlue">₹{parseFloat(amount).toLocaleString('en-IN')}</strong> to <strong className="text-vault-ink dark:text-vault-text">{recipientName}</strong>
              </p>
            ) : (
              <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-1 font-mono">
                Authenticate with biometric sensor
              </p>
            )}
          </div>

          {/* Biometric Interactive Scan Circle */}
          <div className="my-5 flex justify-center">
            <button
              type="button"
              aria-label={`Trigger ${label} scan`}
              onClick={handleStartScan}
              disabled={scanState === 'scanning' || scanState === 'success'}
              className={`w-24 h-24 rounded-full flex flex-col items-center justify-center transition-colors relative border ${
                scanState === 'success' 
                  ? 'bg-vault-emeraldLight border-vault-emerald text-vault-emerald' 
                  : scanState === 'scanning'
                    ? 'bg-vault-surfaceHighlight border-vault-reserveBlue text-vault-reserveBlue'
                    : 'bg-vault-paper border-vault-rule hover:border-vault-reserveBlue text-vault-reserveBlue'
              }`}
            >
              {scanState === 'success' ? (
                <CheckCircle2 className="w-10 h-10 text-vault-emerald" />
              ) : (
                <IconComponent className="w-10 h-10" />
              )}
            </button>
          </div>

          {/* Status Message */}
          <div aria-live="polite" className="min-h-[28px] text-xs font-mono">
            {scanState === 'idle' && (
              <p className="text-vault-muted dark:text-vault-mutedDark">Tap icon to verify {label}</p>
            )}
            {scanState === 'scanning' && (
              <p className="text-vault-reserveBlue font-bold">Verifying biometric sensor...</p>
            )}
            {scanState === 'success' && (
              <p className="text-vault-emerald font-bold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated
              </p>
            )}
          </div>

          {/* Security Assurance Footer */}
          <div className="mt-3 pt-2.5 border-t border-vault-rule flex items-center justify-center gap-1.5 text-[11px] font-mono text-vault-muted dark:text-vault-mutedDark">
            <ShieldCheck className="w-3.5 h-3.5 text-vault-emerald shrink-0" />
            <span>Hardware Protected • Vault Security</span>
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


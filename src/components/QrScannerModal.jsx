import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, X, Camera } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import PropTypes from 'prop-types';

export const QrScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  const scannerContainerId = "html5qr-code-full-region";

  const [cameraAvailable, setCameraAvailable] = useState(false);
  const [html5QrcodeScanner, setHtml5QrcodeScanner] = useState(null);

  // Helper function to parse UPI URLs
  const parseUpiUrl = (qrText) => {
    try {
      if (qrText.startsWith('upi://pay')) {
        const url = new URL(qrText);
        const params = new URLSearchParams(url.search);
        return {
          name: params.get('pn') || 'Scanned Payee',
          upiId: params.get('pa') || 'merchant@upi',
          amount: params.get('am') || null,
          note: params.get('tn') || ''
        };
      }
    } catch {
      // Fallback if generic string
    }
    return {
      name: qrText.includes('@') ? qrText.split('@')[0] : 'Scanned Payee',
      upiId: qrText.includes('@') ? qrText : `${qrText.toLowerCase().replace(/\s+/g, '')}@upi`
    };
  };

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
    let scannerInstance = null;

    if (isOpen) {
      try {
        scannerInstance = new Html5Qrcode(scannerContainerId);
        setHtml5QrcodeScanner(scannerInstance);

        scannerInstance.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 200, height: 200 } },
          (decodedText) => {
            scannerInstance.stop().then(() => {
              const payee = parseUpiUrl(decodedText);
              onScanSuccess(payee);
            });
          },
          () => {}
        ).then(() => {
          setCameraAvailable(true);
        }).catch(() => {
          setCameraAvailable(false);
        });
      } catch {
        setCameraAvailable(false);
      }
    }

    return () => {
      if (scannerInstance && scannerInstance.isScanning) {
        scannerInstance.stop().catch(() => {});
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSimulateScan = (recipient) => {
    if (html5QrcodeScanner && html5QrcodeScanner.isScanning) {
      html5QrcodeScanner.stop().catch(() => {});
    }
    onScanSuccess(recipient);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <motion.div 
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-modal-title"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="relative w-full max-w-sm bg-vault-surface border border-vault-rule rounded-xl p-5 shadow-xl text-vault-ink dark:text-vault-text text-center focus:outline-none font-sans"
        >
          <button 
            type="button"
            onClick={onClose}
            aria-label="Close QR Scanner"
            className="absolute top-4 right-4 p-1 text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink rounded hover:bg-vault-surfaceHighlight"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="mt-1 mb-3">
            <h3 id="qr-modal-title" className="text-sm font-bold text-vault-ink dark:text-vault-text flex items-center justify-center gap-2 font-sans">
              <QrCode className="w-4 h-4 text-vault-reserveBlue" />
              <span>Scan UPI QR Code</span>
            </h3>
            <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5 font-mono">
              Align camera with QR code
            </p>
          </div>

          {/* HTML5 Camera Stream / Simulator Container */}
          <div className="relative w-full h-52 bg-vault-ink rounded-lg overflow-hidden flex items-center justify-center my-3 border border-vault-rule">
            <div id={scannerContainerId} className="w-full h-full object-cover" />

            {!cameraAvailable && (
              <div className="absolute inset-0 bg-vault-ink flex flex-col items-center justify-center text-center p-4 space-y-2 text-white/80">
                <Camera className="w-8 h-8 mx-auto text-vault-reserveBlue opacity-80" />
                <p className="text-xs font-bold text-white font-sans">Camera Preview Unavailable</p>
                <p className="text-[11px] text-white/70 font-mono">Select a test merchant below to simulate scanning</p>
              </div>
            )}
          </div>

          <div className="space-y-2 text-xs font-mono">
            <p className="text-vault-muted dark:text-vault-mutedDark font-bold text-[10px] uppercase tracking-wider">Test QR Payees</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                aria-label="Scan Kirana Store QR Code"
                onClick={() => handleSimulateScan({ name: "Society Tea Kirana", upiId: "societytea@upi" })}
                className="p-2 bg-vault-paper border border-vault-rule rounded-lg text-vault-ink dark:text-vault-text hover:border-vault-reserveBlue text-left"
              >
                <p className="truncate font-bold font-sans">Society Tea Kirana</p>
                <p className="text-[10px] text-vault-muted dark:text-vault-mutedDark font-mono">societytea@upi</p>
              </button>

              <button
                type="button"
                aria-label="Scan Cafe QR Code"
                onClick={() => handleSimulateScan({ name: "Third Wave Coffee", upiId: "thirdwave@upi" })}
                className="p-2 bg-vault-paper border border-vault-rule rounded-lg text-vault-ink dark:text-vault-text hover:border-vault-reserveBlue text-left"
              >
                <p className="truncate font-bold font-sans">Third Wave Coffee</p>
                <p className="text-[10px] text-vault-muted dark:text-vault-mutedDark font-mono">thirdwave@upi</p>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

QrScannerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onScanSuccess: PropTypes.func.isRequired
};


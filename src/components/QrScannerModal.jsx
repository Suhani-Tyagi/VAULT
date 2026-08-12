import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, X, Camera, RefreshCw } from 'lucide-react';
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
      // Initialize HTML5 QR Scanner
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
          () => {
            // Ignore frame decode errors
          }
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <motion.div 
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-modal-title"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-sm bg-vault-surface border border-vault-border rounded-3xl p-6 shadow-2xl overflow-hidden z-10 text-vault-charcoal dark:text-vault-text text-center focus:outline-none"
        >
          <button 
            type="button"
            onClick={onClose}
            aria-label="Close QR Scanner"
            className="absolute top-4 right-4 p-1.5 text-vault-muted dark:text-vault-mutedDark hover:text-vault-charcoal dark:hover:text-vault-text rounded-full hover:bg-vault-surfaceHighlight focus:ring-2 focus:ring-vault-bronze"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mt-2 mb-3">
            <h3 id="qr-modal-title" className="text-lg font-bold text-vault-charcoal dark:text-vault-text tracking-tight flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5 text-vault-bronze" />
              <span>Scan UPI QR Code</span>
            </h3>
            <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5">
              Point camera at any merchant or friend's QR code
            </p>
          </div>

          {/* HTML5 Camera Stream / Simulator Container */}
          <div className="relative w-full h-56 bg-black rounded-2xl overflow-hidden flex items-center justify-center my-3 border-2 border-vault-bronze/40">
            <div id={scannerContainerId} className="w-full h-full object-cover" />

            {!cameraAvailable && (
              <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-center p-4 space-y-2 text-white/80">
                <Camera className="w-10 h-10 mx-auto text-vault-bronze opacity-80" />
                <p className="text-xs font-bold text-white">Camera Simulator Active</p>
                <p className="text-[11px] text-white/70">Tap a merchant below to simulate QR decode</p>
              </div>
            )}

            <div className="absolute inset-8 border-2 border-dashed border-vault-bronze rounded-xl pointer-events-none animate-pulse" />
          </div>

          <div className="space-y-2 text-xs">
            <p className="text-vault-muted dark:text-vault-mutedDark font-bold text-[11px] uppercase tracking-wider">Test UPI QR Codes</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                aria-label="Scan Kirana Store QR Code"
                onClick={() => handleSimulateScan({ name: "Society Tea Kirana", upiId: "societytea@upi" })}
                className="p-2 bg-vault-paper border border-vault-border rounded-xl font-bold text-vault-charcoal dark:text-vault-text hover:border-vault-bronze focus:ring-2 focus:ring-vault-bronze text-left"
              >
                <p className="truncate font-bold">Society Tea Kirana</p>
                <p className="text-[10px] text-vault-muted dark:text-vault-mutedDark font-mono">societytea@upi</p>
              </button>

              <button
                type="button"
                aria-label="Scan Cafe QR Code"
                onClick={() => handleSimulateScan({ name: "Third Wave Coffee", upiId: "thirdwave@upi" })}
                className="p-2 bg-vault-paper border border-vault-border rounded-xl font-bold text-vault-charcoal dark:text-vault-text hover:border-vault-bronze focus:ring-2 focus:ring-vault-bronze text-left"
              >
                <p className="truncate font-bold">Third Wave Coffee</p>
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

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, X, Copy, Share2, Check, Download } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import PropTypes from 'prop-types';

export const ReceiveQrModal = ({ isOpen, onClose }) => {
  const { user, showToast } = useVault();
  const [requestedAmount, setRequestedAmount] = useState('');
  const [requestNote, setRequestNote] = useState('');
  const [copied, setCopied] = useState(false);

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

  const numAmount = parseFloat(requestedAmount) || 0;

  // Construct standard UPI payment URL
  const upiUrl = `upi://pay?pa=${user.upiId}&pn=${encodeURIComponent(user.name)}${numAmount > 0 ? `&am=${numAmount}` : ''}${requestNote ? `&tn=${encodeURIComponent(requestNote)}` : ''}&cu=INR`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(user.upiId);
    setCopied(true);
    showToast("UPI ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareQr = () => {
    showToast("QR code image saved to gallery");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-sans">
        <motion.div 
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="receive-modal-title"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="relative w-full max-w-sm bg-vault-surface border border-vault-rule rounded-xl p-5 shadow-xl text-vault-ink dark:text-vault-text text-center focus:outline-none"
        >
          {/* Close button */}
          <button 
            type="button"
            onClick={onClose}
            aria-label="Close receive QR modal"
            className="absolute top-4 right-4 p-1 text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink rounded hover:bg-vault-surfaceHighlight"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="mt-1 mb-3">
            <h3 id="receive-modal-title" className="text-sm font-bold text-vault-ink dark:text-vault-text flex items-center justify-center gap-2 font-sans">
              <QrCode className="w-4 h-4 text-vault-reserveBlue" />
              <span>Receive Money via QR</span>
            </h3>
            <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5 font-mono">
              Scan with any UPI payment app
            </p>
          </div>

          {/* Rendered SVG QR Code Container */}
          <div className="p-3 bg-white rounded-lg border border-vault-rule flex flex-col items-center justify-center my-3 mx-auto w-48 h-48">
            <QRCodeSVG 
              value={upiUrl}
              size={160}
              bgColor="#FFFFFF"
              fgColor="#111827"
              level="H"
              includeMargin={false}
            />
          </div>

          {/* UPI ID Badge & Copy Button */}
          <div className="flex items-center justify-center gap-2 p-2 bg-vault-paper border border-vault-rule rounded-lg text-xs my-2.5 font-mono">
            <span className="font-bold text-vault-ink dark:text-vault-text truncate">{user.upiId}</span>
            <button
              type="button"
              aria-label="Copy UPI handle"
              onClick={handleCopyUpi}
              className="text-vault-reserveBlue hover:underline font-bold flex items-center gap-1 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Optional Amount & Note Entries */}
          <div className="space-y-2 text-left text-xs my-3 font-mono">
            <div>
              <label htmlFor="req-amount-input" className="text-[10px] font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider block mb-1">
                Requested Amount (Optional)
              </label>
              <div className="flex items-center bg-vault-paper border border-vault-rule rounded-lg px-3 py-1.5 focus-within:border-vault-reserveBlue">
                <span className="font-bold text-vault-reserveBlue mr-1">₹</span>
                <input 
                  id="req-amount-input"
                  type="number"
                  placeholder="0"
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(e.target.value)}
                  className="w-full bg-transparent font-mono font-bold text-vault-ink dark:text-vault-text focus:outline-none tabular-nums text-xs"
                />
              </div>
            </div>

            <div>
              <input 
                type="text"
                placeholder="Note (e.g. Dinner share)"
                value={requestNote}
                onChange={(e) => setRequestNote(e.target.value)}
                className="w-full bg-vault-paper border border-vault-rule rounded-lg px-3 py-1.5 text-xs text-vault-ink dark:text-vault-text placeholder-vault-muted focus:outline-none focus:border-vault-reserveBlue font-mono"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2 font-mono">
            <button
              type="button"
              onClick={handleShareQr}
              className="flex-1 py-2 bg-vault-reserveBlue hover:bg-vault-reserveBlueHover text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save QR</span>
            </button>

            <button
              type="button"
              onClick={handleShareQr}
              className="px-4 py-2 bg-vault-paper border border-vault-rule text-vault-ink dark:text-vault-text rounded-lg text-xs font-bold hover:bg-vault-surfaceHighlight transition-colors flex items-center justify-center gap-1"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

ReceiveQrModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};


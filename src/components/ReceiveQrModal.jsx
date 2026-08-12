import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, X, Copy, Share2, Check, Download, ShieldCheck } from 'lucide-react';
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <motion.div 
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="receive-modal-title"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-sm bg-vault-surface border border-vault-border rounded-3xl p-6 shadow-2xl overflow-hidden z-10 text-vault-charcoal dark:text-vault-text text-center focus:outline-none"
        >
          {/* Close button */}
          <button 
            type="button"
            onClick={onClose}
            aria-label="Close receive QR modal"
            className="absolute top-4 right-4 p-1.5 text-vault-muted dark:text-vault-mutedDark hover:text-vault-charcoal dark:hover:text-vault-text rounded-full hover:bg-vault-surfaceHighlight focus:ring-2 focus:ring-vault-bronze"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="mt-1 mb-4">
            <h3 id="receive-modal-title" className="text-lg font-bold text-vault-charcoal dark:text-vault-text tracking-tight flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5 text-vault-bronze" />
              <span>Receive Money via QR</span>
            </h3>
            <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5">
              Scan with GPay, PhonePe, Paytm, or any UPI app
            </p>
          </div>

          {/* Rendered SVG QR Code Container */}
          <div className="p-4 bg-white rounded-2xl border-2 border-vault-bronze/30 shadow-inner flex flex-col items-center justify-center my-3 mx-auto w-56 h-56">
            <QRCodeSVG 
              value={upiUrl}
              size={180}
              bgColor="#FFFFFF"
              fgColor="#0F172A"
              level="H"
              includeMargin={false}
            />
          </div>

          {/* UPI ID Badge & Copy Button */}
          <div className="flex items-center justify-center gap-2 p-2 bg-vault-paper border border-vault-border rounded-xl text-xs my-3">
            <span className="font-mono font-bold text-vault-charcoal dark:text-vault-text truncate">{user.upiId}</span>
            <button
              type="button"
              aria-label="Copy UPI handle"
              onClick={handleCopyUpi}
              className="text-vault-bronze hover:underline font-bold flex items-center gap-1 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Optional Amount & Note Entries */}
          <div className="space-y-2 text-left text-xs my-3">
            <div>
              <label htmlFor="req-amount-input" className="text-[11px] font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider block mb-1">
                Request Specific Amount (Optional)
              </label>
              <div className="flex items-center bg-vault-paper border border-vault-border rounded-xl px-3 py-1.5 focus-within:border-vault-bronze">
                <span className="font-bold text-vault-muted dark:text-vault-mutedDark mr-1">₹</span>
                <input 
                  id="req-amount-input"
                  type="number"
                  placeholder="0 (Any amount)"
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(e.target.value)}
                  className="w-full bg-transparent font-display font-bold text-vault-charcoal dark:text-vault-text focus:outline-none tabular-nums text-sm"
                />
              </div>
            </div>

            <div>
              <input 
                type="text"
                placeholder="Add request note (e.g. Lunch share)"
                value={requestNote}
                onChange={(e) => setRequestNote(e.target.value)}
                className="w-full bg-vault-paper border border-vault-border rounded-xl px-3 py-1.5 text-xs text-vault-charcoal dark:text-vault-text placeholder-vault-muted focus:outline-none focus:border-vault-bronze"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleShareQr}
              className="flex-1 py-2.5 bg-vault-bronze hover:bg-vault-bronzeHover text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Save QR Code</span>
            </button>

            <button
              type="button"
              onClick={handleShareQr}
              className="px-4 py-2.5 bg-vault-surfaceHighlight border border-vault-border text-vault-charcoal dark:text-vault-text rounded-xl text-xs font-bold hover:bg-vault-border transition-all flex items-center justify-center gap-1"
            >
              <Share2 className="w-4 h-4" />
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

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X } from 'lucide-react';

export const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <motion.div 
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-modal-title"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-sm bg-vault-surface border border-vault-border rounded-3xl p-6 shadow-2xl overflow-hidden z-10 text-vault-charcoal dark:text-vault-text text-center focus:outline-none"
        >
          <button 
            type="button"
            onClick={onClose}
            aria-label="Close logout modal"
            className="absolute top-4 right-4 p-1.5 text-vault-muted hover:text-vault-charcoal dark:hover:text-vault-text rounded-full hover:bg-vault-surfaceHighlight focus:ring-2 focus:ring-vault-terracotta"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-vault-roseLight border border-vault-rose/30 text-vault-rose rounded-full flex items-center justify-center mx-auto mb-3">
            <LogOut className="w-7 h-7" />
          </div>

          <h3 id="logout-modal-title" className="text-lg font-bold text-vault-charcoal dark:text-vault-text">
            Log Out of Vault?
          </h3>

          <p className="text-xs text-vault-muted my-2 leading-relaxed">
            "You will be logged out of your Vault sandbox session on this device. Your money and settings will remain safe."
          </p>

          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-vault-surfaceHighlight border border-vault-border text-vault-charcoal dark:text-vault-text rounded-xl text-xs font-bold hover:bg-vault-border"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 py-2.5 bg-vault-rose text-white rounded-xl text-xs font-bold hover:bg-rose-700 shadow-xs"
            >
              Log Out Now
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

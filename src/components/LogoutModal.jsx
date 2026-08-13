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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-sans">
        <motion.div 
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-modal-title"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="relative w-full max-w-sm bg-vault-surface border border-vault-rule rounded-xl p-5 shadow-xl text-vault-ink dark:text-vault-text text-center focus:outline-none"
        >
          <button 
            type="button"
            onClick={onClose}
            aria-label="Close logout modal"
            className="absolute top-4 right-4 p-1 text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink rounded hover:bg-vault-surfaceHighlight"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-10 h-10 bg-vault-roseLight text-vault-rose rounded-full flex items-center justify-center mx-auto mb-2.5">
            <LogOut className="w-5 h-5" />
          </div>

          <h3 id="logout-modal-title" className="text-sm font-bold text-vault-ink dark:text-vault-text font-sans">
            Log Out of Vault?
          </h3>

          <p className="text-xs text-vault-muted dark:text-vault-mutedDark my-2 font-mono">
            You will need to sign in again to access your account details and transactions.
          </p>

          <div className="flex gap-2 pt-2 font-mono">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-vault-paper border border-vault-rule text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink rounded-lg text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 py-2 bg-vault-rose text-white rounded-lg text-xs font-bold hover:bg-rose-700"
            >
              Log Out
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


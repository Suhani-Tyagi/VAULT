import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import PropTypes from 'prop-types';

export const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  isDanger = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-sans select-none">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="w-full max-w-sm bg-vault-surface border border-vault-rule rounded-2xl p-6 shadow-xl text-vault-ink dark:text-vault-text space-y-4 focus:outline-none"
      >
        <div className="flex justify-between items-start">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isDanger ? 'bg-vault-roseLight text-vault-rose border border-vault-rose/20' : 'bg-vault-paper text-vault-reserveBlue border border-vault-rule'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>

          <button 
            type="button"
            onClick={onClose}
            aria-label="Close confirmation dialog"
            className="text-vault-muted hover:text-vault-ink p-1 rounded hover:bg-vault-surfaceHighlight transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 id="confirm-modal-title" className="text-base font-bold text-vault-ink dark:text-vault-text font-sans">
            {title}
          </h3>
          <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-1 leading-relaxed font-mono">
            {description}
          </p>
        </div>

        <div className="flex gap-2.5 pt-2 font-mono text-xs">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-vault-paper border border-vault-rule text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink font-bold rounded-lg transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 py-2.5 font-bold rounded-lg transition-colors text-white ${
              isDanger 
                ? 'bg-vault-rose hover:bg-red-700' 
                : 'bg-vault-reserveBlue hover:bg-vault-reserveBlueHover'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  confirmLabel: PropTypes.string,
  isDanger: PropTypes.bool
};

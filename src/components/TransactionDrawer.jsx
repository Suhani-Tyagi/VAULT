import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, ShieldCheck } from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';
import { useVault } from '../context/VaultContext';
import PropTypes from 'prop-types';

export const TransactionDrawer = ({ transaction, onClose }) => {
  const { showToast } = useVault();
  const [copied, setCopied] = React.useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (transaction) {
      setTimeout(() => {
        if (drawerRef.current) {
          const firstFocusable = drawerRef.current.querySelector('button, [tabindex="0"]');
          if (firstFocusable) firstFocusable.focus();
        }
      }, 50);
    }
  }, [transaction]);

  if (!transaction) return null;

  const isCredit = transaction.type === 'credit';
  const isRefund = transaction.type === 'refund';

  const handleCopyRef = () => {
    navigator.clipboard.writeText(transaction.upiRef);
    setCopied(true);
    showToast("UPI Reference ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
        <motion.div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="w-full max-w-sm bg-vault-surface border-l border-vault-rule p-5 shadow-xl overflow-y-auto z-50 relative flex flex-col justify-between text-vault-ink dark:text-vault-text focus:outline-none font-sans"
        >
          {/* Top Bar with Close Button */}
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-vault-rule">
              <span className="text-xs font-mono font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider">
                Transaction Details
              </span>
              <button 
                type="button"
                onClick={onClose}
                aria-label="Close transaction details"
                className="p-1 text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink rounded hover:bg-vault-surfaceHighlight"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Merchant Header Hero */}
            <div className="flex flex-col items-center text-center mt-5 mb-5">
              <CategoryIcon 
                iconName={transaction.icon} 
                category={transaction.category} 
                type={transaction.type}
                className="w-6 h-6"
                bgSize="w-14 h-14 mb-2.5"
              />

              <h3 id="drawer-title" className="text-base font-bold text-vault-ink dark:text-vault-text font-sans">
                {transaction.merchant}
              </h3>
              <p className="text-xs text-vault-muted dark:text-vault-mutedDark font-mono mt-0.5">{transaction.date}</p>

              {/* Amount Display */}
              <div className="mt-3 text-2xl font-mono font-bold tabular-nums">
                <span className={isRefund ? "text-vault-reserveBlue" : isCredit ? "text-vault-emerald" : "text-vault-ink dark:text-vault-text"}>
                  {isDebit(transaction.type) ? '-₹' : '+₹'}
                  {transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Details Ledger Card */}
            <div className="bg-vault-paper border border-vault-rule rounded-xl p-4 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-vault-rule">
                <span className="text-vault-muted dark:text-vault-mutedDark">Type</span>
                <span className="font-bold capitalize text-vault-ink dark:text-vault-text font-sans">{transaction.type}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-vault-rule">
                <span className="text-vault-muted dark:text-vault-mutedDark">Category</span>
                <span className="font-semibold text-vault-ink dark:text-vault-text font-sans">{transaction.category}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-vault-rule">
                <span className="text-vault-muted dark:text-vault-mutedDark">Running Balance</span>
                <span className="font-bold tabular-nums text-vault-ink dark:text-vault-text">
                  ₹{transaction.runningBalance.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-vault-rule">
                <span className="text-vault-muted dark:text-vault-mutedDark">Payment Method</span>
                <span className="font-semibold text-vault-ink dark:text-vault-text font-sans">{transaction.method}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-vault-muted dark:text-vault-mutedDark">UPI Ref ID</span>
                <button 
                  type="button"
                  aria-label="Copy UPI reference ID"
                  onClick={handleCopyRef}
                  className="font-mono font-bold text-vault-reserveBlue hover:underline flex items-center gap-1"
                >
                  <span>{transaction.upiRef}</span>
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {transaction.notes && (
              <div className="mt-3 p-3 bg-vault-paper border border-vault-rule rounded-lg text-xs font-mono">
                <p className="text-vault-muted dark:text-vault-mutedDark font-bold text-[10px] uppercase">Note</p>
                <p className="text-vault-ink dark:text-vault-text mt-0.5 font-sans">{transaction.notes}</p>
              </div>
            )}
          </div>

          {/* Security Footer */}
          <div className="pt-3 border-t border-vault-rule text-[11px] font-mono text-vault-muted dark:text-vault-mutedDark flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-vault-emerald shrink-0" />
            <span>Verified UPI Transaction Record</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

function isDebit(type) {
  return type === 'debit';
}

TransactionDrawer.propTypes = {
  transaction: PropTypes.object,
  onClose: PropTypes.func.isRequired
};


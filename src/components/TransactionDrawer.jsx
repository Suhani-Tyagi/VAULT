import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, ShieldCheck, ArrowDownLeft, ArrowUpRight, RotateCcw } from 'lucide-react';
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
      <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
        <motion.div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="w-full max-w-sm bg-vault-surface border-l border-vault-border p-6 shadow-2xl overflow-y-auto z-50 relative flex flex-col justify-between text-vault-charcoal dark:text-vault-text focus:outline-none"
        >
          {/* Top Bar with Close Button */}
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-vault-border">
              <span className="text-xs font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider">
                Transaction Detail Passbook
              </span>
              <button 
                type="button"
                onClick={onClose}
                aria-label="Close transaction details"
                className="p-1.5 text-vault-muted dark:text-vault-mutedDark hover:text-vault-charcoal dark:hover:text-vault-text rounded-full hover:bg-vault-surfaceHighlight focus:ring-2 focus:ring-vault-bronze"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Merchant Header Hero */}
            <div className="flex flex-col items-center text-center mt-6 mb-6">
              <CategoryIcon 
                iconName={transaction.icon} 
                category={transaction.category} 
                type={transaction.type}
                className="w-7 h-7"
                bgSize="w-16 h-16 mb-3"
              />

              <h3 id="drawer-title" className="text-lg font-bold text-vault-charcoal dark:text-vault-text">
                {transaction.merchant}
              </h3>
              <p className="text-xs text-vault-muted dark:text-vault-mutedDark font-mono mt-0.5">{transaction.date}</p>

              {/* Amount Display */}
              <div className="mt-4 text-3xl font-display font-extrabold tabular-nums">
                <span className={isRefund ? "text-vault-bronze" : isCredit ? "text-vault-teal font-extrabold" : "text-vault-charcoal dark:text-vault-text"}>
                  {isDebit(transaction.type) ? '-₹' : '+₹'}
                  {transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Details Ledger Card */}
            <div className="bg-vault-paper border border-vault-border rounded-2xl p-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-vault-border">
                <span className="text-vault-muted dark:text-vault-mutedDark">Transaction Type</span>
                <span className="font-bold capitalize text-vault-charcoal dark:text-vault-text">{transaction.type}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-vault-border">
                <span className="text-vault-muted dark:text-vault-mutedDark">Category</span>
                <span className="font-semibold text-vault-charcoal dark:text-vault-text">{transaction.category}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-vault-border">
                <span className="text-vault-muted dark:text-vault-mutedDark">Running Balance After</span>
                <span className="font-bold font-display tabular-nums text-vault-charcoal dark:text-vault-text">
                  ₹{transaction.runningBalance.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-vault-border">
                <span className="text-vault-muted dark:text-vault-mutedDark">Payment Method</span>
                <span className="font-semibold text-vault-charcoal dark:text-vault-text">{transaction.method}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-vault-muted dark:text-vault-mutedDark">UPI Ref ID</span>
                <button 
                  type="button"
                  aria-label="Copy UPI reference ID"
                  onClick={handleCopyRef}
                  className="font-mono font-bold text-vault-bronze hover:underline flex items-center gap-1"
                >
                  <span>{transaction.upiRef}</span>
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {transaction.notes && (
              <div className="mt-3 p-3 bg-vault-surfaceHighlight border border-vault-border rounded-xl text-xs">
                <p className="text-vault-muted dark:text-vault-mutedDark font-bold text-[10px] uppercase">Transfer Note</p>
                <p className="text-vault-charcoal dark:text-vault-text mt-0.5 italic">"{transaction.notes}"</p>
              </div>
            )}
          </div>

          {/* Security Footer */}
          <div className="pt-4 border-t border-vault-border text-[11px] text-vault-muted dark:text-vault-mutedDark flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-vault-teal shrink-0" />
            <span>Verified NPCI UPI Ledger Record</span>
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

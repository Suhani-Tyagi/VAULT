import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, ShieldCheck, RotateCcw } from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';
import { useVault } from '../context/VaultContext';

export const TransactionDrawer = ({ transaction, onClose }) => {
  const { showToast } = useVault();
  const [copied, setCopied] = React.useState(false);

  if (!transaction) return null;

  const handleCopyRef = () => {
    navigator.clipboard.writeText(transaction.upiRef);
    setCopied(true);
    showToast("UPI Reference ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const isCredit = transaction.type === 'credit';
  const isRefund = transaction.type === 'refund';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4">
        {/* Backdrop click */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />

        {/* Drawer container */}
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="relative w-full max-w-md bg-vault-surface border border-vault-border rounded-t-3xl sm:rounded-3xl p-6 shadow-xl overflow-hidden z-10 text-vault-charcoal dark:text-vault-text"
        >
          {/* Top handle bar */}
          <div className="w-12 h-1 bg-vault-borderDark rounded-full mx-auto mb-4 opacity-70" />

          {/* Close button */}
          <button 
            onClick={onClose}
            aria-label="Close transaction details"
            className="absolute top-5 right-5 p-2 text-vault-muted dark:text-vault-mutedDark hover:text-vault-charcoal dark:hover:text-vault-text rounded-full hover:bg-vault-surfaceHighlight transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Merchant Header */}
          <div className="flex flex-col items-center text-center mt-2 mb-6">
            <CategoryIcon 
              iconName={transaction.icon} 
              category={transaction.category} 
              type={transaction.type}
              className="w-7 h-7"
              bgSize="w-16 h-16 mb-3"
            />

            <h3 className="text-xl font-bold text-vault-charcoal dark:text-vault-text tracking-tight">
              {transaction.merchant}
            </h3>
            
            <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-1 flex items-center gap-1.5">
              <span>{transaction.category}</span>
              <span>•</span>
              <span>{transaction.date}</span>
            </p>

            {/* Amount */}
            <div className="mt-4 text-3xl font-display font-bold tabular-nums">
              <span className={isRefund ? "text-vault-terracotta" : isCredit ? "text-vault-sage" : "text-vault-charcoal dark:text-vault-text"}>
                {isRefund ? "+₹" : isCredit ? "+₹" : "-₹"}
                {transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {isRefund && (
              <span className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-vault-terracottaLight text-vault-terracotta border border-vault-terracotta/30">
                <RotateCcw className="w-3.5 h-3.5" /> Reversal Credited
              </span>
            )}
          </div>

          {/* Key Transaction Breakdown Grid */}
          <div className="bg-vault-paper border border-vault-border rounded-2xl p-4 space-y-3">
            {/* Running Balance at that point */}
            <div className="flex justify-between items-center text-xs py-1 border-b border-vault-border">
              <span className="text-vault-muted dark:text-vault-mutedDark font-medium">Running Balance After</span>
              <span className="font-display font-bold text-vault-charcoal dark:text-vault-text tabular-nums">
                ₹{transaction.runningBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Payment Method */}
            <div className="flex justify-between items-center text-xs py-1 border-b border-vault-border">
              <span className="text-vault-muted dark:text-vault-mutedDark font-medium">Payment Method</span>
              <span className="font-medium text-vault-charcoal dark:text-vault-text">{transaction.method}</span>
            </div>

            {/* UPI / Tx Reference */}
            <div className="flex justify-between items-center text-xs py-1 border-b border-vault-border">
              <span className="text-vault-muted dark:text-vault-mutedDark font-medium">Reference ID</span>
              <button 
                onClick={handleCopyRef}
                className="flex items-center gap-1 text-vault-terracotta hover:underline font-mono text-xs"
              >
                <span>{transaction.upiRef}</span>
                {copied ? <Check className="w-3.5 h-3.5 text-vault-terracotta" /> : <Copy className="w-3.5 h-3.5 opacity-70" />}
              </button>
            </div>

            {/* Note */}
            {transaction.note && (
              <div className="flex justify-between items-center text-xs py-1">
                <span className="text-vault-muted dark:text-vault-mutedDark font-medium">Note</span>
                <span className="text-vault-charcoal dark:text-vault-text text-right text-xs bg-vault-surface px-2.5 py-1 rounded-lg border border-vault-border">
                  {transaction.note}
                </span>
              </div>
            )}
          </div>

          {/* Security guarantee footer */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-vault-muted dark:text-vault-mutedDark">
            <ShieldCheck className="w-4 h-4 text-vault-terracotta shrink-0" />
            <span>Bank-grade 256-bit encrypted transaction record</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

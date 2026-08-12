import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { CategoryIcon } from './CategoryIcon';

export const TransactionRow = memo(({ tx, onClick, onContextMenu }) => {
  const isCredit = tx.type === 'credit';
  const isRefund = tx.type === 'refund';

  return (
    <div 
      onClick={onClick}
      onContextMenu={onContextMenu}
      className="p-3.5 flex items-center justify-between hover:bg-vault-surfaceHighlight/70 active:scale-[0.99] transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <CategoryIcon 
          iconName={tx.icon} 
          category={tx.category} 
          type={tx.type} 
        />
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-vault-charcoal dark:text-vault-text truncate flex items-center gap-1.5">
            <span className="truncate">{tx.merchant}</span>
            {isRefund && (
              <span className="text-[9px] bg-vault-terracottaLight text-vault-terracotta px-1.5 py-0.2 rounded border border-vault-terracotta/30 shrink-0 font-bold">
                Refund
              </span>
            )}
          </h4>
          <p className="text-[11px] text-vault-muted dark:text-vault-mutedDark truncate mt-0.5">
            {tx.date} • {tx.method}
          </p>
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className={`text-xs font-display font-bold tabular-nums ${
          isRefund ? 'text-vault-terracotta' : isCredit ? 'text-vault-sage' : 'text-vault-charcoal dark:text-vault-text'
        }`}>
          {isRefund ? '+₹' : isCredit ? '+₹' : '-₹'}
          {tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
        <p className="text-[10px] text-vault-subtle dark:text-vault-mutedDark tabular-nums mt-0.5">
          Bal: ₹{tx.runningBalance.toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
});

TransactionRow.displayName = 'TransactionRow';

TransactionRow.propTypes = {
  tx: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  onContextMenu: PropTypes.func
};

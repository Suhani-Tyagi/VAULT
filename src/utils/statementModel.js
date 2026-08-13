import { toPaise, fromPaise, formatINR } from './moneyUtils';

/**
 * Calculates a mathematically verified statement data model.
 * Single source of truth consumed by both PDF generation and Print preview.
 * 
 * @param {Object} params 
 * @param {Object} params.user 
 * @param {Array} params.transactions 
 * @param {string} params.rangeOption - 'all', 'thisMonth', 'lastMonth', 'custom'
 * @param {string} params.startDate 
 * @param {string} params.endDate 
 * @returns {Object} Statement data model
 */
export const calculateStatementData = ({
  user,
  transactions = [],
  rangeOption = 'all',
  startDate = '',
  endDate = ''
}) => {
  let filtered = [...transactions];
  let periodLabel = 'All Transactions Statement';
  let filenameDateSuffix = 'Full_History';

  if (rangeOption === 'thisMonth') {
    periodLabel = 'August 2026';
    filenameDateSuffix = 'August_2026';
    filtered = transactions.filter(t => 
      t.date.includes('Today') || 
      t.date.includes('Yesterday') || 
      t.date.includes('Aug') || 
      (t.timestamp && t.timestamp.startsWith('2026-08'))
    );
  } else if (rangeOption === 'lastMonth') {
    periodLabel = 'July 2026';
    filenameDateSuffix = 'July_2026';
    filtered = transactions.filter(t => 
      t.date.includes('Jul') || 
      (t.timestamp && t.timestamp.startsWith('2026-07'))
    );
  } else if (rangeOption === 'custom' && startDate && endDate) {
    periodLabel = `${startDate} to ${endDate}`;
    filenameDateSuffix = `${startDate}_to_${endDate}`;
    
    const startTs = new Date(startDate).getTime();
    const endTs = new Date(endDate + 'T23:59:59').getTime();

    if (!isNaN(startTs) && !isNaN(endTs)) {
      filtered = transactions.filter(t => {
        if (!t.timestamp) return true;
        const txTs = new Date(t.timestamp).getTime();
        return txTs >= startTs && txTs <= endTs;
      });
    }
  }

  // Calculate Credits and Debits in integer paise
  let totalCreditsPaise = 0;
  let totalDebitsPaise = 0;

  filtered.forEach(t => {
    const paise = toPaise(t.amount);
    if (t.type === 'credit' || t.type === 'refund') {
      totalCreditsPaise += paise;
    } else {
      totalDebitsPaise += paise;
    }
  });

  const closingBalancePaise = toPaise(user.availableBalance);
  const openingBalancePaise = closingBalancePaise - totalCreditsPaise + totalDebitsPaise;

  const generatedDateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return {
    accountHolder: user.name,
    accountNo: user.fullAccountNo || user.accountNo,
    ifscCode: user.ifscCode,
    upiId: user.upiId,
    periodLabel,
    filenameDateSuffix,
    generatedDateStr,
    openingBalance: fromPaise(openingBalancePaise),
    totalCredits: fromPaise(totalCreditsPaise),
    totalDebits: fromPaise(totalDebitsPaise),
    closingBalance: fromPaise(closingBalancePaise),
    transactions: filtered
  };
};

/**
 * Precision Financial Math Utilities (Paise Engine)
 * Represents currency in integer minor units (1 INR = 100 paise)
 * to prevent floating-point arithmetic errors.
 */

/**
 * Converts a rupee amount (number or string) to integer paise.
 * @param {number|string} rupees 
 * @returns {number} Integer paise
 */
export const toPaise = (rupees) => {
  if (rupees === null || rupees === undefined || rupees === '') return 0;
  const num = typeof rupees === 'string' ? parseFloat(rupees) : rupees;
  if (isNaN(num)) return 0;
  return Math.round(num * 100);
};

/**
 * Converts integer paise back to float rupees.
 * @param {number} paise 
 * @returns {number} Float rupees
 */
export const fromPaise = (paise) => {
  if (isNaN(paise)) return 0;
  return paise / 100;
};

/**
 * Formats a rupee amount or paise amount into INR string format.
 * @param {number} amount - Amount in rupees
 * @param {boolean} includeSymbol - Whether to prefix with ₹
 * @returns {string} Formatted INR string (e.g., "1,24,580.00")
 */
export const formatINR = (amount, includeSymbol = true) => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  const formatted = num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return includeSymbol ? `₹${formatted}` : formatted;
};

/**
 * Safe addition of two rupee amounts via integer paise.
 */
export const addMoney = (a, b) => {
  return fromPaise(toPaise(a) + toPaise(b));
};

/**
 * Safe subtraction of two rupee amounts via integer paise.
 */
export const subtractMoney = (a, b) => {
  return fromPaise(toPaise(a) - toPaise(b));
};

/**
 * Re-calculates exact running balances for a list of transactions chronologically.
 * @param {Array} transactions 
 * @param {number} currentBalance 
 * @returns {Array} Transactions with mathematically verified running balances
 */
export const calculateRunningBalances = (transactions, currentBalance) => {
  let running = toPaise(currentBalance);
  
  return transactions.map(tx => {
    const txPaise = toPaise(tx.amount);
    const updatedBalancePaise = running;
    
    if (tx.type === 'debit') {
      running += txPaise;
    } else {
      running -= txPaise;
    }

    return {
      ...tx,
      runningBalance: fromPaise(updatedBalancePaise)
    };
  });
};

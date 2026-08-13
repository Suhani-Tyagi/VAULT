import { describe, it, expect } from 'vitest';
import { toPaise, fromPaise, formatINR, addMoney, subtractMoney, calculateRunningBalances } from '../utils/moneyUtils';

describe('Precision Financial Math Engine (moneyUtils)', () => {
  it('converts rupees to integer paise accurately without floating-point error', () => {
    expect(toPaise(100.50)).toBe(10050);
    expect(toPaise("48520.50")).toBe(4852050);
    expect(toPaise(0)).toBe(0);
    expect(toPaise(0.01)).toBe(1);
  });

  it('converts paise back to rupees', () => {
    expect(fromPaise(10050)).toBe(100.50);
    expect(fromPaise(1)).toBe(0.01);
  });

  it('formats INR correctly with symbol and commas', () => {
    expect(formatINR(124580.50)).toBe('₹1,24,580.50');
    expect(formatINR(0, false)).toBe('0.00');
  });

  it('performs safe addition and subtraction', () => {
    expect(addMoney(0.1, 0.2)).toBe(0.3);
    expect(subtractMoney(100.50, 50.25)).toBe(50.25);
  });

  it('calculates running balances chronologically', () => {
    const txs = [
      { id: '1', amount: 500, type: 'debit' },
      { id: '2', amount: 1000, type: 'credit' }
    ];
    const updated = calculateRunningBalances(txs, 10000);
    expect(updated[0].runningBalance).toBe(10000);
    expect(updated[1].runningBalance).toBe(10500);
  });
});

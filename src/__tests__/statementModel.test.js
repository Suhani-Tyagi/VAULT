import { describe, it, expect } from 'vitest';
import { calculateStatementData } from '../utils/statementModel';
import { MOCK_USER, MOCK_TRANSACTIONS } from '../data/mockData';

describe('Statement Data Model & Passbook Calculation Engine', () => {
  it('calculates correct statement summary for all transactions', () => {
    const data = calculateStatementData({
      user: MOCK_USER,
      transactions: MOCK_TRANSACTIONS,
      rangeOption: 'all'
    });

    expect(data.accountHolder).toBe(MOCK_USER.name);
    expect(data.closingBalance).toBe(MOCK_USER.availableBalance);
    expect(data.transactions.length).toBe(MOCK_TRANSACTIONS.length);
    expect(data.totalCredits).toBeGreaterThan(0);
    expect(data.totalDebits).toBeGreaterThan(0);
    expect(data.openingBalance).toBe(data.closingBalance - data.totalCredits + data.totalDebits);
  });

  it('filters statement transactions by thisMonth option', () => {
    const data = calculateStatementData({
      user: MOCK_USER,
      transactions: MOCK_TRANSACTIONS,
      rangeOption: 'thisMonth'
    });

    expect(data.periodLabel).toBe('August 2026');
    expect(data.transactions.length).toBeGreaterThan(0);
  });

  it('filters statement transactions by lastMonth option', () => {
    const data = calculateStatementData({
      user: MOCK_USER,
      transactions: MOCK_TRANSACTIONS,
      rangeOption: 'lastMonth'
    });

    expect(data.periodLabel).toBe('July 2026');
    expect(data.transactions.length).toBeGreaterThan(0);
  });

  it('handles custom date ranges cleanly', () => {
    const data = calculateStatementData({
      user: MOCK_USER,
      transactions: MOCK_TRANSACTIONS,
      rangeOption: 'custom',
      startDate: '2026-08-01',
      endDate: '2026-08-12'
    });

    expect(data.periodLabel).toBe('2026-08-01 to 2026-08-12');
  });
});

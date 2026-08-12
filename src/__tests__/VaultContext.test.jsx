import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VaultProvider, useVault } from '../context/VaultContext';

const wrapper = ({ children }) => <VaultProvider>{children}</VaultProvider>;

describe('VaultContext Money-Movement Logic', () => {
  it('executes successful money transfer when available balance is sufficient', () => {
    const { result } = renderHook(() => useVault(), { wrapper });

    const initialBalance = result.current.user.availableBalance;
    const contact = result.current.contacts[0]; // Aditi Nair

    let sendResult;
    act(() => {
      sendResult = result.current.executeSendMoney(contact, '1000', 'Test payment');
    });

    expect(sendResult.success).toBe(true);
    expect(result.current.user.availableBalance).toBe(initialBalance - 1000);
    expect(result.current.transactions[0].merchant).toBe(contact.name);
    expect(result.current.transactions[0].amount).toBe(1000);
  });

  it('rejects transfer when amount exceeds available balance', () => {
    const { result } = renderHook(() => useVault(), { wrapper });

    const contact = result.current.contacts[0];
    let sendResult;

    act(() => {
      sendResult = result.current.executeSendMoney(contact, '999999', 'Over balance');
    });

    expect(sendResult.success).toBe(false);
    expect(sendResult.errorType).toBe('insufficient_balance');
  });

  it('deposits funds into a savings goal successfully', () => {
    const { result } = renderHook(() => useVault(), { wrapper });

    const initialBalance = result.current.user.availableBalance;
    const targetGoal = result.current.goals[0];
    const initialGoalAmount = targetGoal.currentAmount;

    let depositSuccess;
    act(() => {
      depositSuccess = result.current.depositToGoal(targetGoal.id, '2000');
    });

    expect(depositSuccess).toBe(true);
    expect(result.current.user.availableBalance).toBe(initialBalance - 2000);
    expect(result.current.goals[0].currentAmount).toBe(initialGoalAmount + 2000);
  });

  it('creates split bill request among contacts', () => {
    const { result } = renderHook(() => useVault(), { wrapper });

    let splitSuccess;
    act(() => {
      splitSuccess = result.current.createSplitRequest(['c1', 'c2'], '3000', 'Dinner Split');
    });

    expect(splitSuccess).toBe(true);
  });
});

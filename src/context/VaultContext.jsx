import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USER, MOCK_TRANSACTIONS, MOCK_GOALS, MOCK_CONTACTS } from '../data/mockData';

const VaultContext = createContext(null);

export const VaultProvider = ({ children }) => {
  const [user, setUser] = useState({ ...MOCK_USER, pin: '123456' });
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [goals, setGoals] = useState(MOCK_GOALS);
  const [contacts] = useState(MOCK_CONTACTS);
  const [friends] = useState(MOCK_CONTACTS);
  
  const [activeTab, setActiveTab] = useState('home');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [toast, setToast] = useState(null);

  const [isLoggedOut, setIsLoggedOut] = useState(false);

  // Security Lockout State
  const [failedPinAttempts, setFailedPinAttempts] = useState(0);
  const [lockState, setLockState] = useState({ isLocked: false, remainingSeconds: 0 });

  useEffect(() => {
    let timer;
    if (lockState.isLocked && lockState.remainingSeconds > 0) {
      timer = setInterval(() => {
        setLockState(prev => {
          if (prev.remainingSeconds <= 1) {
            return { isLocked: false, remainingSeconds: 0 };
          }
          return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockState.isLocked, lockState.remainingSeconds]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const verifyPin = (pinInput) => {
    if (lockState.isLocked) return false;

    const userPin = user.pin || '123456';
    if (pinInput === userPin) {
      setFailedPinAttempts(0);
      return true;
    } else {
      const nextAttempts = failedPinAttempts + 1;
      setFailedPinAttempts(nextAttempts);

      if (nextAttempts >= 3) {
        setLockState({ isLocked: true, remainingSeconds: 30 });
        showToast("Account temporarily locked due to 3 failed PIN attempts", "error");
      }
      return false;
    }
  };

  const toggleSetting = (settingKey) => {
    setUser(prev => ({ ...prev, [settingKey]: !prev[settingKey] }));
    showToast("Setting updated cleanly");
  };

  const executeSendMoney = (recipient, amountStr, note = '') => {
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      return { success: false, errorType: 'invalid_amount', message: "Please enter a valid amount." };
    }

    if (amount > user.availableBalance) {
      return { 
        success: false, 
        errorType: 'insufficient_balance',
        message: `This transfer didn't go through — your available balance is ₹${user.availableBalance.toLocaleString('en-IN')}, which is less than the ₹${amount.toLocaleString('en-IN')} you tried to send.` 
      };
    }

    const upiRef = `UPI${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    const newTx = {
      id: `tx-${Date.now()}`,
      merchant: recipient.name,
      amount: amount,
      type: 'debit',
      category: 'Transfers',
      date: 'Today, Just now',
      upiRef: upiRef,
      method: 'Vault Safe UPI',
      runningBalance: user.availableBalance - amount,
      icon: 'Send',
      notes: note || 'Direct UPI Transfer'
    };

    setUser(prev => ({
      ...prev,
      availableBalance: prev.availableBalance - amount,
      safeToSpend: prev.safeToSpend - amount
    }));

    setTransactions(prev => [newTx, ...prev]);
    showToast(`₹${amount.toLocaleString('en-IN')} sent to ${recipient.name}`);

    return { success: true, transaction: newTx };
  };

  const depositToGoal = (goalId, amountStr) => {
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) return false;

    if (amount > user.availableBalance) {
      showToast("Insufficient balance to transfer to goal", "error");
      return false;
    }

    setUser(prev => ({
      ...prev,
      availableBalance: prev.availableBalance - amount,
      safeToSpend: prev.safeToSpend - amount
    }));

    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return { ...g, currentAmount: g.currentAmount + amount };
      }
      return g;
    }));

    showToast(`Added ₹${amount.toLocaleString('en-IN')} to goal`);
    return true;
  };

  const createGoal = (title, targetAmountStr, category, targetDate) => {
    const targetAmount = parseFloat(targetAmountStr);
    if (!title || isNaN(targetAmount) || targetAmount <= 0) return false;

    const newGoal = {
      id: `g-${Date.now()}`,
      title,
      currentAmount: 0,
      targetAmount,
      category,
      targetDate,
      iconName: category === 'Travel' ? 'Plane' : 'Laptop',
      notes: 'Custom user goal'
    };

    setGoals(prev => [...prev, newGoal]);
    showToast(`Created new goal: ${title}`);
    return true;
  };

  const requestSplitBill = (billName, totalAmount, friendIds) => {
    showToast(`Split request sent to ${friendIds.length} friends for ${billName}`);
    return true;
  };

  const createSplitRequest = (friendIds, totalAmount, billName) => {
    return requestSplitBill(billName, totalAmount, friendIds);
  };

  const logOut = () => {
    setIsLoggedOut(true);
    showToast("Logged out of Vault session");
  };

  const logIn = () => {
    setIsLoggedOut(false);
    showToast("Welcome back to Vault");
  };

  return (
    <VaultContext.Provider value={{
      user,
      transactions,
      goals,
      contacts,
      friends,
      activeTab,
      setActiveTab,
      selectedTransaction,
      setSelectedTransaction,
      toast,
      showToast,
      verifyPin,
      lockState,
      toggleSetting,
      executeSendMoney,
      depositToGoal,
      createGoal,
      requestSplitBill,
      createSplitRequest,
      isLoggedOut,
      logOut,
      logIn
    }}>
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};

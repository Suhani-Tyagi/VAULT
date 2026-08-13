import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MOCK_USER, MOCK_TRANSACTIONS, MOCK_GOALS, MOCK_CONTACTS } from '../data/mockData';
import { toPaise, fromPaise, addMoney, subtractMoney, calculateRunningBalances } from '../utils/moneyUtils';
import { verifyPasswordHash, setSessionToken, getSessionToken, clearSessionToken } from '../utils/securityUtils';

const VaultContext = createContext(null);

const INITIAL_BUDGETS = [
  { id: 'b1', category: 'Food & Dining', limit: 10000 },
  { id: 'b2', category: 'Shopping', limit: 8000 },
  { id: 'b3', category: 'Transport', limit: 3000 },
  { id: 'b4', category: 'Groceries', limit: 5000 }
];

const INITIAL_RECURRING = [
  { id: 'r1', name: 'Netflix India Premium', amount: 649, frequency: 'Monthly', nextDate: '4th of month', category: 'Subscriptions' },
  { id: 'r2', name: 'Apartment Rent (Indiranagar)', amount: 22000, frequency: 'Monthly', nextDate: '1st of month', category: 'Rent' },
  { id: 'r3', name: 'BESCOM Electricity Bill', amount: 1435, frequency: 'Monthly', nextDate: '5th of month', category: 'Utilities' }
];

const INITIAL_NOTIFICATIONS = [
  { id: 'n1', title: 'Salary Credited', message: 'TechCorp Pvt Ltd credited ₹85,000 to your account', time: 'Yesterday', read: false, type: 'success' },
  { id: 'n2', title: 'Budget Alert', message: 'Food & Dining budget has reached 82% of monthly limit', time: '2 hours ago', read: false, type: 'warning' },
  { id: 'n3', title: 'Recurring Bill Upcoming', message: 'Netflix India Premium (₹649) is due in 3 days', time: 'Today', read: false, type: 'recurring' }
];

export const VaultProvider = ({ children }) => {
  const [user, setUser] = useState({ ...MOCK_USER, pin: '123456' });
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [goals, setGoals] = useState(MOCK_GOALS);
  const [contacts] = useState(MOCK_CONTACTS);
  const [friends] = useState(MOCK_CONTACTS);
  
  const [budgets, setBudgets] = useState(INITIAL_BUDGETS);
  const [recurringPayments, setRecurringPayments] = useState(INITIAL_RECURRING);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const [activeTab, setActiveTab] = useState('home');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [toast, setToast] = useState(null);

  // Authentication & Session Lock State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(getSessionToken());
  });
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  // Security Lockout State for PIN Keypad
  const [failedPinAttempts, setFailedPinAttempts] = useState(0);
  const [lockState, setLockState] = useState({ isLocked: false, remainingSeconds: 0 });

  // Automatic Inactivity Session Lock (10 Minutes)
  const lockVault = useCallback(() => {
    setIsLoggedOut(true);
    showToast("Vault locked due to session security policy");
  }, []);

  const unlockVault = () => {
    setIsLoggedOut(false);
    showToast("Vault unlocked");
  };

  useEffect(() => {
    if (!isAuthenticated || isLoggedOut) return;

    let idleTimer;
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        lockVault();
      }, 10 * 60 * 1000); // 10 minutes idle timeout
    };

    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    window.addEventListener('click', resetIdleTimer);
    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      window.removeEventListener('click', resetIdleTimer);
    };
  }, [isAuthenticated, isLoggedOut, lockVault]);

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

  // Password Login Handler
  const loginWithPassword = async (passwordInput) => {
    const isValid = await verifyPasswordHash(passwordInput);
    if (isValid) {
      setSessionToken("vault_active_session_token");
      setIsAuthenticated(true);
      setIsLoggedOut(false);
      showToast("Welcome back to VAULT");
      return true;
    }
    return false;
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
    showToast("Setting updated");
  };

  // Integer-Paise Financial Math Engine
  const executeSendMoney = (recipient, amountStr, note = '') => {
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      return { success: false, errorType: 'invalid_amount', message: "Please enter a valid transfer amount greater than ₹0." };
    }

    if (amount > user.availableBalance) {
      return { 
        success: false, 
        errorType: 'insufficient_balance',
        message: `This transfer didn't go through — your available balance is ₹${user.availableBalance.toLocaleString('en-IN')}, which is less than the ₹${amount.toLocaleString('en-IN')} you tried to send.` 
      };
    }

    const newBalance = subtractMoney(user.availableBalance, amount);
    const newSafeToSpend = subtractMoney(user.safeToSpend, amount);
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
      runningBalance: newBalance,
      icon: 'Send',
      notes: note || 'Direct UPI Transfer'
    };

    setUser(prev => ({
      ...prev,
      availableBalance: newBalance,
      safeToSpend: newSafeToSpend
    }));

    setTransactions(prev => [newTx, ...prev]);

    // Push notification alert
    const newNotif = {
      id: `n-${Date.now()}`,
      title: 'Transfer Sent',
      message: `₹${amount.toLocaleString('en-IN')} sent to ${recipient.name}`,
      time: 'Just now',
      read: false,
      type: 'success'
    };
    setNotifications(prev => [newNotif, ...prev]);

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

    const newBalance = subtractMoney(user.availableBalance, amount);
    const newSafeToSpend = subtractMoney(user.safeToSpend, amount);

    setUser(prev => ({
      ...prev,
      availableBalance: newBalance,
      safeToSpend: newSafeToSpend
    }));

    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return { ...g, currentAmount: addMoney(g.currentAmount, amount) };
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

  // Budgets Logic
  const addBudget = (categoryName, limitStr) => {
    const limit = parseFloat(limitStr);
    if (isNaN(limit) || limit <= 0) return;

    setBudgets(prev => [
      ...prev.filter(b => b.category !== categoryName),
      { id: `b-${Date.now()}`, category: categoryName, limit }
    ]);
    showToast(`Budget set for ${categoryName}: ₹${limit.toLocaleString('en-IN')}`);
  };

  const deleteBudget = (budgetId) => {
    setBudgets(prev => prev.filter(b => b.id !== budgetId));
    showToast("Budget limit removed");
  };

  // Recurring Payments Logic
  const addRecurringPayment = (name, amountStr, frequency, nextDate, category) => {
    const amount = parseFloat(amountStr);
    if (!name || isNaN(amount) || amount <= 0) return;

    setRecurringPayments(prev => [
      ...prev,
      { id: `r-${Date.now()}`, name, amount, frequency, nextDate, category }
    ]);
    showToast(`Added recurring payment: ${name}`);
  };

  const deleteRecurringPayment = (id) => {
    setRecurringPayments(prev => prev.filter(r => r.id !== id));
    showToast("Recurring payment removed");
  };

  // Notifications Logic
  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
    showToast("Notifications cleared");
  };

  // Clear Local Data
  const clearLocalData = () => {
    localStorage.clear();
    clearSessionToken();
    setIsAuthenticated(false);
    setIsLoggedOut(false);
    setUser({ ...MOCK_USER, pin: '123456' });
    setTransactions(MOCK_TRANSACTIONS);
    setGoals(MOCK_GOALS);
    setBudgets(INITIAL_BUDGETS);
    setRecurringPayments(INITIAL_RECURRING);
    setNotifications([]);
    showToast("All local application data cleared");
  };

  const logOut = () => {
    clearSessionToken();
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
      budgets,
      recurringPayments,
      notifications,
      activeTab,
      setActiveTab,
      selectedTransaction,
      setSelectedTransaction,
      toast,
      showToast,
      isAuthenticated,
      loginWithPassword,
      verifyPin,
      lockState,
      lockVault,
      unlockVault,
      toggleSetting,
      executeSendMoney,
      depositToGoal,
      createGoal,
      requestSplitBill,
      createSplitRequest,
      addBudget,
      deleteBudget,
      addRecurringPayment,
      deleteRecurringPayment,
      markNotificationRead,
      clearNotifications,
      clearLocalData,
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


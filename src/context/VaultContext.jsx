import React, { createContext, useContext, useState } from 'react';
import { MOCK_USER, MOCK_CONTACTS, MOCK_GOALS, MOCK_TRANSACTIONS, MOCK_INSIGHTS } from '../data/mockData';

const VaultContext = createContext(null);

export const VaultProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(MOCK_USER);
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [goals, setGoals] = useState(MOCK_GOALS);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [insights, setInsights] = useState(MOCK_INSIGHTS);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const executeSendMoney = (contact, amount, note) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return { success: false, message: "Invalid amount" };

    if (numAmount > user.availableBalance) {
      return {
        success: false,
        errorType: "insufficient_balance",
        message: `This transfer didn't go through — your available balance is ₹${user.availableBalance.toLocaleString('en-IN')}, which is less than the ₹${numAmount.toLocaleString('en-IN')} you tried to send.`
      };
    }

    const newBalance = user.availableBalance - numAmount;
    const newSafeToSpend = user.safeToSpend - numAmount;

    const newTx = {
      id: `tx-${Date.now()}`,
      merchant: contact.name,
      category: "Transfers",
      amount: numAmount,
      type: "debit",
      date: "Just now",
      timestamp: new Date().toISOString(),
      runningBalance: newBalance,
      method: "Vault Direct Pay (₹0 Fee)",
      upiRef: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      icon: "ArrowUpRight",
      note: note || `Transfer to ${contact.name}`
    };

    setUser(prev => ({
      ...prev,
      availableBalance: newBalance,
      safeToSpend: newSafeToSpend
    }));

    setTransactions(prev => [newTx, ...prev]);
    showToast(`Transferred ₹${numAmount.toLocaleString('en-IN')} to ${contact.name}`);

    return { success: true, transaction: newTx };
  };

  const createSplitRequest = (selectedContactIds, totalAmount, description) => {
    const numTotal = parseFloat(totalAmount);
    if (isNaN(numTotal) || numTotal <= 0) return false;

    const peopleCount = selectedContactIds.length + 1;
    const perPerson = (numTotal / peopleCount).toFixed(2);

    const participatingContacts = contacts.filter(c => selectedContactIds.includes(c.id));
    const names = participatingContacts.map(c => c.name).join(", ");

    showToast(`Split request sent to ${names}. ₹${perPerson} each.`);
    return true;
  };

  const depositToGoal = (goalId, depositAmount) => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return false;

    if (amount > user.availableBalance) {
      showToast(`Cannot deposit ₹${amount} — exceeds available balance ₹${user.availableBalance}`, 'error');
      return false;
    }

    setUser(prev => ({
      ...prev,
      availableBalance: prev.availableBalance - amount,
      safeToSpend: prev.safeToSpend - amount
    }));

    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          currentAmount: goal.currentAmount + amount
        };
      }
      return goal;
    }));

    const targetGoal = goals.find(g => g.id === goalId);
    showToast(`Added ₹${amount.toLocaleString('en-IN')} to "${targetGoal?.title}"`);
    return true;
  };

  const createGoal = (title, targetAmount, category, targetDate) => {
    const target = parseFloat(targetAmount);
    if (!title || isNaN(target) || target <= 0) return false;

    const newGoal = {
      id: `g-${Date.now()}`,
      title,
      targetAmount: target,
      currentAmount: 0,
      category: category || "Savings",
      iconName: category === 'Travel' ? 'Plane' : category === 'Tech' ? 'Laptop' : 'Target',
      color: "#B5563C",
      targetDate: targetDate || "2027",
      notes: "Goal created in Vault"
    };

    setGoals(prev => [...prev, newGoal]);
    showToast(`New goal "${title}" created!`);
    return true;
  };

  const toggleSetting = (key) => {
    setUser(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const logOut = () => {
    setIsLoggedOut(true);
    showToast("Logged out of Vault session");
  };

  const logIn = () => {
    setIsLoggedOut(false);
    showToast(`Welcome back, ${user.name.split(' ')[0]}!`);
  };

  return (
    <VaultContext.Provider value={{
      activeTab,
      setActiveTab,
      user,
      contacts,
      goals,
      transactions,
      insights,
      selectedTransaction,
      setSelectedTransaction,
      executeSendMoney,
      createSplitRequest,
      depositToGoal,
      createGoal,
      toggleSetting,
      isLoggedOut,
      logOut,
      logIn,
      toast,
      showToast
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

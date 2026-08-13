import React, { useState } from 'react';
import { 
  Send, 
  Users, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Eye, 
  EyeOff, 
  Copy, 
  FileText, 
  PieChart, 
  Calendar, 
  Target, 
  ChevronRight,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  QrCode
} from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { formatINR, toPaise, fromPaise } from '../utils/moneyUtils';
import { ExportPassbookModal } from '../components/ExportPassbookModal';
import { BudgetsModal } from '../components/BudgetsModal';
import { RecurringPaymentsModal } from '../components/RecurringPaymentsModal';
import { ReceiveQrModal } from '../components/ReceiveQrModal';

export const HomeScreen = () => {
  const { 
    user, 
    transactions, 
    goals, 
    budgets, 
    recurringPayments, 
    setActiveTab, 
    setSelectedTransaction, 
    showToast 
  } = useVault();

  const [hideBalance, setHideBalance] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBudgetsModal, setShowBudgetsModal] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);

  // Calculate Income & Expenses from actual transactions (August 2026)
  const currentMonthTransactions = transactions.filter(t => 
    t.date.includes('Today') || t.date.includes('Yesterday') || t.date.includes('Aug')
  );

  let incomePaise = 0;
  let expensesPaise = 0;

  currentMonthTransactions.forEach(t => {
    const paise = toPaise(t.amount);
    if (t.type === 'credit' || t.type === 'refund') {
      incomePaise += paise;
    } else {
      expensesPaise += paise;
    }
  });

  const incomeThisMonth = fromPaise(incomePaise);
  const expensesThisMonth = fromPaise(expensesPaise);

  const copyAccountDetails = () => {
    navigator.clipboard.writeText(`A/C: ${user.fullAccountNo || user.accountNo} | IFSC: ${user.ifscCode} | UPI: ${user.upiId}`);
    showToast("Account details copied to clipboard");
  };

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6 font-sans max-w-5xl mx-auto">
      {/* Top Greeting Header */}
      <div className="flex justify-between items-start pb-1">
        <div>
          <h2 className="text-xl font-bold text-vault-ink dark:text-vault-text tracking-tight font-sans">
            Good evening, {user.name.split(' ')[0]}
          </h2>
          <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5 font-mono">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setShowReceiveModal(true)}
            className="px-2.5 py-1.5 bg-vault-paper hover:bg-vault-surfaceHighlight border border-vault-rule text-vault-ink dark:text-vault-text rounded-lg font-bold transition-colors flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5 text-vault-reserveBlue" />
            <span>Show QR</span>
          </button>

          <button
            type="button"
            onClick={copyAccountDetails}
            className="px-2.5 py-1.5 bg-vault-paper hover:bg-vault-surfaceHighlight border border-vault-rule rounded-lg text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink transition-colors flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copy Account</span>
          </button>

          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="px-2.5 py-1.5 bg-vault-reserveBlue text-white hover:bg-vault-reserveBlueHover border border-vault-reserveBlue rounded-lg font-bold transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Passbook</span>
          </button>
        </div>
      </div>

      {/* Statement Balance Anchor */}
      <div className="p-6 bg-vault-surface border border-vault-rule rounded-2xl space-y-4 shadow-sm">
        <div className="flex justify-between items-center text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider font-bold">AVAILABLE BALANCE</span>
            <button 
              type="button"
              onClick={() => setHideBalance(!hideBalance)}
              aria-label={hideBalance ? "Show balance" : "Hide balance"}
              className="text-vault-muted hover:text-vault-ink p-1 rounded"
            >
              {hideBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <span className="text-[11px] text-vault-muted dark:text-vault-mutedDark">
            A/C {user.accountNo} • {user.ifscCode}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-vault-ink dark:text-vault-text tracking-tight font-mono tabular-nums">
            {hideBalance ? "₹ ••••••••" : formatINR(user.availableBalance)}
          </h1>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1 text-vault-emerald font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{formatINR(incomeThisMonth)} income</span>
            </div>
            <div className="flex items-center gap-1 text-vault-muted font-bold">
              <TrendingDown className="w-3.5 h-3.5 text-vault-rose" />
              <span>{formatINR(expensesThisMonth)} spent</span>
            </div>
          </div>
        </div>

        {/* Compact Actions Area */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('send')}
            className="py-2.5 px-3 bg-vault-paper hover:bg-vault-surfaceHighlight border border-vault-rule rounded-lg text-vault-ink dark:text-vault-text font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5 text-vault-reserveBlue" />
            <span>Send Money</span>
          </button>

          <button
            type="button"
            onClick={() => setShowReceiveModal(true)}
            className="py-2.5 px-3 bg-vault-paper hover:bg-vault-surfaceHighlight border border-vault-rule rounded-lg text-vault-ink dark:text-vault-text font-bold transition-colors flex items-center justify-center gap-2"
          >
            <QrCode className="w-3.5 h-3.5 text-vault-emerald" />
            <span>Receive / QR</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className="py-2.5 px-3 bg-vault-paper hover:bg-vault-surfaceHighlight border border-vault-rule rounded-lg text-vault-ink dark:text-vault-text font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Users className="w-3.5 h-3.5 text-vault-reserveBlue" />
            <span>Split Bill</span>
          </button>

          <button
            type="button"
            onClick={() => setShowBudgetsModal(true)}
            className="py-2.5 px-3 bg-vault-paper hover:bg-vault-surfaceHighlight border border-vault-rule rounded-lg text-vault-ink dark:text-vault-text font-bold transition-colors flex items-center justify-center gap-2"
          >
            <PieChart className="w-3.5 h-3.5 text-vault-reserveBlue" />
            <span>Budgets</span>
          </button>

          <button
            type="button"
            onClick={() => setShowRecurringModal(true)}
            className="py-2.5 px-3 bg-vault-paper hover:bg-vault-surfaceHighlight border border-vault-rule rounded-lg text-vault-ink dark:text-vault-text font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-3.5 h-3.5 text-vault-reserveBlue" />
            <span>Recurring</span>
          </button>
        </div>
      </div>

      {/* Grid Layout for Overview Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Budgets Summary */}
        <div className="p-4 bg-vault-surface border border-vault-rule rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-vault-reserveBlue" />
              <h3 className="text-xs font-bold text-vault-ink dark:text-vault-text font-sans">Category Budgets</h3>
            </div>

            <button 
              type="button"
              onClick={() => setShowBudgetsModal(true)}
              className="text-xs font-mono text-vault-reserveBlue font-bold hover:underline"
            >
              Manage
            </button>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {budgets.slice(0, 3).map(b => {
              const spent = transactions
                .filter(t => t.type === 'debit' && t.category === b.category)
                .reduce((sum, t) => sum + t.amount, 0);
              const pct = Math.min(Math.round((spent / b.limit) * 100), 100);

              return (
                <div key={b.id} className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-vault-ink dark:text-vault-text font-sans font-semibold">{b.category}</span>
                    <span className="text-vault-muted dark:text-vault-mutedDark">
                      ₹{spent.toLocaleString('en-IN')} / ₹{b.limit.toLocaleString('en-IN')} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-vault-paper rounded-full h-1.5 border border-vault-rule overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${pct >= 80 ? 'bg-amber-500' : 'bg-vault-reserveBlue'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Recurring Payments */}
        <div className="p-4 bg-vault-surface border border-vault-rule rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-vault-reserveBlue" />
              <h3 className="text-xs font-bold text-vault-ink dark:text-vault-text font-sans">Upcoming Bills</h3>
            </div>

            <button 
              type="button"
              onClick={() => setShowRecurringModal(true)}
              className="text-xs font-mono text-vault-reserveBlue font-bold hover:underline"
            >
              Manage
            </button>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {recurringPayments.map(item => (
              <div key={item.id} className="p-2 bg-vault-paper border border-vault-rule rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-bold text-vault-ink dark:text-vault-text font-sans">{item.name}</p>
                  <p className="text-[10px] text-vault-muted">Due: {item.nextDate}</p>
                </div>
                <span className="font-bold text-vault-ink dark:text-vault-text">
                  ₹{item.amount.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bank Statement Activity Ledger */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-mono font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider">
            Recent Statement Activity
          </h3>

          <button 
            type="button"
            onClick={() => setActiveTab('transactions')}
            className="text-xs font-mono font-bold text-vault-reserveBlue hover:underline flex items-center gap-1"
          >
            <span>Full Statement</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-vault-surface border border-vault-rule rounded-xl divide-y divide-vault-rule text-xs font-mono">
          {recentTransactions.map(t => {
            const isCredit = t.type === 'credit' || t.type === 'refund';

            return (
              <div 
                key={t.id}
                onClick={() => setSelectedTransaction(t)}
                className="p-3.5 hover:bg-vault-surfaceHighlight cursor-pointer transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg border border-vault-rule flex items-center justify-center shrink-0 ${
                    isCredit ? 'bg-vault-emeraldLight text-vault-emerald' : 'bg-vault-paper text-vault-ink dark:text-vault-text'
                  }`}>
                    {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4 text-vault-muted" />}
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-vault-ink dark:text-vault-text font-sans truncate">{t.merchant}</p>
                    <p className="text-[11px] text-vault-muted dark:text-vault-mutedDark truncate">
                      {t.category} • {t.date}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className={`font-bold tabular-nums ${isCredit ? 'text-vault-emerald' : 'text-vault-ink dark:text-vault-text'}`}>
                    {isCredit ? '+' : '-'}{formatINR(t.amount)}
                  </p>
                  <p className="text-[10px] text-vault-muted font-mono">
                    Bal: {formatINR(t.runningBalance)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <ExportPassbookModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)} 
      />

      <BudgetsModal 
        isOpen={showBudgetsModal} 
        onClose={() => setShowBudgetsModal(false)} 
      />

      <RecurringPaymentsModal 
        isOpen={showRecurringModal} 
        onClose={() => setShowRecurringModal(false)} 
      />

      <ReceiveQrModal
        isOpen={showReceiveModal}
        onClose={() => setShowReceiveModal(false)}
      />
    </div>
  );
};

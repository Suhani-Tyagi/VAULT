import React, { useState } from 'react';
import { Send, Users, PlusCircle, ShieldCheck, ChevronRight, QrCode, ArrowDownLeft, Eye, EyeOff, Copy, FileText } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { AnimatedAmount } from '../components/AnimatedAmount';
import { TransactionRow } from '../components/TransactionRow';
import { QrScannerModal } from '../components/QrScannerModal';
import { ReceiveQrModal } from '../components/ReceiveQrModal';

export const HomeScreen = () => {
  const { user, transactions, goals, setActiveTab, setSelectedTransaction, showToast } = useVault();
  const [showScanModal, setShowScanModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);

  const topGoal = goals[0];
  const topGoalProgress = Math.min(Math.round((topGoal.currentAmount / topGoal.targetAmount) * 100), 100);
  const recentTxs = transactions.slice(0, 5);

  const handleScanSuccess = () => {
    setShowScanModal(false);
    setActiveTab('send');
  };

  const copyAccountDetails = () => {
    navigator.clipboard.writeText(`UPI: ${user.upiId} | Account: ${user.accountNo} | IFSC: ${user.ifscCode}`);
    showToast("Account details copied to clipboard");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Greeting & Date Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-vault-rule gap-2">
        <div>
          <h2 className="text-xl font-bold text-vault-ink dark:text-vault-text tracking-tight font-sans">
            {getGreeting()}, {user.name.split(' ')[0]}
          </h2>
          <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5 font-mono">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Top QR Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Scan QR Code to pay"
            onClick={() => setShowScanModal(true)}
            className="px-3 py-1.5 bg-vault-reserveBlue text-white rounded-lg font-mono font-bold hover:bg-vault-reserveBlueHover transition-colors flex items-center gap-1.5 text-xs"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Pay QR</span>
          </button>

          <button
            type="button"
            aria-label="Receive money via QR"
            onClick={() => setShowReceiveModal(true)}
            className="px-3 py-1.5 bg-vault-paper border border-vault-rule text-vault-ink dark:text-vault-text rounded-lg font-mono font-bold hover:bg-vault-surfaceHighlight transition-colors flex items-center gap-1.5 text-xs"
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-vault-emerald" />
            <span>Receive</span>
          </button>
        </div>
      </div>

      {/* DISTINCTIVE VAULT BALANCE STATEMENT ANCHOR */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-vault-muted dark:text-vault-mutedDark font-bold">
            AVAILABLE BALANCE
          </span>
          <span className="text-xs font-mono text-vault-muted dark:text-vault-mutedDark">
            A/C •••• {user.accountNo.slice(-4)}
          </span>
        </div>

        {/* Large Balance Typography Anchor */}
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-3xl sm:text-4xl font-bold text-vault-reserveBlue">₹</span>
          <div className="text-4xl sm:text-5xl font-mono font-bold text-vault-ink dark:text-vault-text tracking-tight tabular-nums">
            {hideBalance ? (
              <span>••••••••</span>
            ) : (
              <AnimatedAmount amount={user.availableBalance} />
            )}
          </div>
        </div>

        {/* Supporting Monthly Net Indicators */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-vault-emerald font-bold flex items-center gap-1">
            +₹18,400 this month
          </span>
          <span className="text-vault-muted dark:text-vault-mutedDark">•</span>
          <span className="text-vault-muted dark:text-vault-mutedDark flex items-center gap-1">
            ↓₹12,850 spent
          </span>
        </div>

        {/* Statement Controls Bar */}
        <div className="pt-2 border-t border-vault-rule flex flex-wrap items-center gap-4 text-xs font-mono">
          <button
            type="button"
            onClick={() => setHideBalance(!hideBalance)}
            className="text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink dark:hover:text-vault-text font-bold flex items-center gap-1 transition-colors"
          >
            {hideBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{hideBalance ? "Show balance" : "Hide balance"}</span>
          </button>

          <button
            type="button"
            onClick={copyAccountDetails}
            className="text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink dark:hover:text-vault-text font-bold flex items-center gap-1 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy account details</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('transactions')}
            className="text-vault-reserveBlue hover:underline font-bold flex items-center gap-1 transition-colors ml-auto"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View statement</span>
          </button>
        </div>
      </div>

      {/* Core Actions Bar (8px radius) */}
      <div className="grid grid-cols-3 gap-2.5 pt-2">
        <button 
          type="button"
          aria-label="Send Money"
          onClick={() => setActiveTab('send')}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-vault-reserveBlue hover:bg-vault-reserveBlueHover text-white rounded-lg transition-colors font-mono font-bold text-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send Money</span>
        </button>

        <button 
          type="button"
          aria-label="Split a Bill"
          onClick={() => setActiveTab('split')}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-vault-paper border border-vault-rule hover:bg-vault-surfaceHighlight text-vault-ink dark:text-vault-text rounded-lg transition-colors font-mono font-bold text-xs"
        >
          <Users className="w-3.5 h-3.5 text-vault-reserveBlue" />
          <span>Split Bill</span>
        </button>

        <button 
          type="button"
          aria-label="Add Funds to Savings Goal"
          onClick={() => setActiveTab('goals')}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-vault-paper border border-vault-rule hover:bg-vault-surfaceHighlight text-vault-ink dark:text-vault-text rounded-lg transition-colors font-mono font-bold text-xs"
        >
          <PlusCircle className="w-3.5 h-3.5 text-vault-reserveBlue" />
          <span>Add Funds</span>
        </button>
      </div>

      {/* Savings Goal Progress */}
      {topGoal && (
        <div 
          onClick={() => setActiveTab('goals')}
          className="p-4 bg-vault-surface border border-vault-rule rounded-xl cursor-pointer hover:border-vault-muted transition-colors group"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[10px] font-mono text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider font-bold">Priority Goal</p>
              <h4 className="text-xs font-bold text-vault-ink dark:text-vault-text group-hover:text-vault-reserveBlue transition-colors mt-0.5 font-sans">
                {topGoal.title}
              </h4>
            </div>
            
            <span className="text-xs font-mono font-bold text-vault-reserveBlue tabular-nums">
              {topGoalProgress}%
            </span>
          </div>

          <div className="w-full bg-vault-surfaceHighlight rounded-full h-1.5 overflow-hidden border border-vault-rule">
            <div 
              className="bg-vault-reserveBlue h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${topGoalProgress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] mt-2 font-mono text-vault-muted dark:text-vault-mutedDark">
            <span>₹{topGoal.currentAmount.toLocaleString('en-IN')} saved</span>
            <span>Target: ₹{topGoal.targetAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}

      {/* Recent Activity Ledger */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-center px-0.5">
          <h3 className="text-xs font-mono font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider">
            RECENT ACTIVITY
          </h3>
          <button 
            type="button"
            onClick={() => setActiveTab('transactions')}
            className="text-xs text-vault-reserveBlue hover:underline font-bold flex items-center gap-0.5 font-mono"
          >
            <span>Full Ledger ({transactions.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Clean Ledger Container (Sharp 1px rule boundaries) */}
        <div className="bg-vault-surface border border-vault-rule rounded-xl overflow-hidden">
          {recentTxs.map((tx) => (
            <TransactionRow 
              key={tx.id}
              tx={tx}
              onClick={() => setSelectedTransaction(tx)}
            />
          ))}
        </div>
      </div>

      {/* Financial Statement Footnote */}
      <div className="p-3.5 rounded-lg bg-vault-surface border-l-2 border-l-vault-reserveBlue border-t border-b border-r border-vault-rule text-xs text-vault-muted dark:text-vault-mutedDark leading-relaxed font-mono">
        <p className="flex items-center gap-1.5 text-vault-ink dark:text-vault-text font-bold mb-0.5 font-sans">
          <ShieldCheck className="w-4 h-4 text-vault-reserveBlue shrink-0" />
          Safe to Spend Balance
        </p>
        Calculated as ₹{user.safeToSpend.toLocaleString('en-IN')} after reserving funds for scheduled commitments.
      </div>

      {/* Modals */}
      <QrScannerModal
        isOpen={showScanModal}
        onClose={() => setShowScanModal(false)}
        onScanSuccess={handleScanSuccess}
      />

      <ReceiveQrModal
        isOpen={showReceiveModal}
        onClose={() => setShowReceiveModal(false)}
      />
    </div>
  );
};



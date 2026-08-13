import React, { useState } from 'react';
import { Send, Users, PlusCircle, ShieldCheck, ChevronRight, QrCode, ArrowDownLeft } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { AnimatedAmount } from '../components/AnimatedAmount';
import { TransactionRow } from '../components/TransactionRow';
import { QrScannerModal } from '../components/QrScannerModal';
import { ReceiveQrModal } from '../components/ReceiveQrModal';

export const HomeScreen = () => {
  const { user, transactions, goals, setActiveTab, setSelectedTransaction } = useVault();
  const [showScanModal, setShowScanModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);

  const topGoal = goals[0];
  const topGoalProgress = Math.min(Math.round((topGoal.currentAmount / topGoal.targetAmount) * 100), 100);
  const recentTxs = transactions.slice(0, 5);

  const handleScanSuccess = () => {
    setShowScanModal(false);
    setActiveTab('send');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Status & Quick QR Bar */}
      <div className="bg-vault-surface border border-vault-rule px-4 py-2.5 rounded-lg flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-vault-muted dark:text-vault-mutedDark">
          <span className="w-2 h-2 rounded-full bg-vault-emerald" />
          <span className="font-bold text-vault-ink dark:text-vault-text font-sans">UPI Active</span>
          <span>•</span>
          <span className="truncate">{user.upiId}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            aria-label="Scan QR Code to pay"
            onClick={() => setShowScanModal(true)}
            className="px-2.5 py-1 bg-vault-reserveBlue text-white rounded font-mono font-bold hover:bg-vault-reserveBlueHover transition-colors flex items-center gap-1 text-[11px]"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Pay QR</span>
          </button>

          <button
            type="button"
            aria-label="Receive money via QR"
            onClick={() => setShowReceiveModal(true)}
            className="px-2.5 py-1 bg-vault-paper border border-vault-rule text-vault-ink dark:text-vault-text rounded font-mono font-bold hover:bg-vault-surfaceHighlight transition-colors flex items-center gap-1 text-[11px]"
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-vault-emerald" />
            <span>Receive</span>
          </button>
        </div>
      </div>

      {/* Hero Section: Safe to Spend Balance */}
      <div className="pb-6 border-b border-vault-rule space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-vault-muted dark:text-vault-mutedDark font-bold">
            Safe to Spend Balance
          </span>
        </div>

        <div className="flex items-baseline gap-1.5 my-1">
          <span className="font-serif text-3xl sm:text-4xl font-bold text-vault-reserveBlue">₹</span>
          <div className="text-4xl sm:text-5xl font-mono font-bold text-vault-ink dark:text-vault-text tracking-tight tabular-nums">
            <AnimatedAmount amount={user.safeToSpend} />
          </div>
        </div>

        <p className="text-xs text-vault-muted dark:text-vault-mutedDark">
          Total liquid balance: <span className="text-vault-ink dark:text-vault-text font-bold font-mono tabular-nums">₹{user.availableBalance.toLocaleString('en-IN')}</span> (after accounting for scheduled bills and commitments).
        </p>

        {/* Core Actions Bar */}
        <div className="grid grid-cols-3 gap-2.5 pt-3">
          <button 
            type="button"
            aria-label="Send Money"
            onClick={() => setActiveTab('send')}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-vault-reserveBlue hover:bg-vault-reserveBlueHover text-white rounded-lg transition-colors font-bold text-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Money</span>
          </button>

          <button 
            type="button"
            aria-label="Split a Bill"
            onClick={() => setActiveTab('split')}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-vault-surface border border-vault-rule hover:bg-vault-surfaceHighlight text-vault-ink dark:text-vault-text rounded-lg transition-colors font-bold text-xs"
          >
            <Users className="w-3.5 h-3.5 text-vault-reserveBlue" />
            <span>Split Bill</span>
          </button>

          <button 
            type="button"
            aria-label="Add Funds to Savings Goal"
            onClick={() => setActiveTab('goals')}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-vault-surface border border-vault-rule hover:bg-vault-surfaceHighlight text-vault-ink dark:text-vault-text rounded-lg transition-colors font-bold text-xs"
          >
            <PlusCircle className="w-3.5 h-3.5 text-vault-reserveBlue" />
            <span>Add Funds</span>
          </button>
        </div>
      </div>

      {/* Savings Goal Progress */}
      {topGoal && (
        <div 
          onClick={() => setActiveTab('goals')}
          className="p-4 bg-vault-surface border border-vault-rule rounded-xl cursor-pointer hover:border-vault-muted transition-colors group"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[10px] font-mono text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider font-bold">Active Savings Goal</p>
              <h4 className="text-xs font-bold text-vault-ink dark:text-vault-text group-hover:text-vault-reserveBlue transition-colors mt-0.5">
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

      {/* Recent Activity List */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-center px-0.5">
          <h3 className="text-sm font-bold text-vault-ink dark:text-vault-text tracking-tight font-sans">
            Recent Activity
          </h3>
          <button 
            type="button"
            onClick={() => setActiveTab('transactions')}
            className="text-xs text-vault-reserveBlue hover:underline font-bold flex items-center gap-0.5 font-mono"
          >
            <span>See all ({transactions.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Clean Hairline Transaction List */}
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

      {/* Financial Security Note */}
      <div className="p-3.5 rounded-lg bg-vault-surface border-l-2 border-l-vault-reserveBlue border-t border-b border-r border-vault-rule text-xs text-vault-muted dark:text-vault-mutedDark leading-relaxed">
        <p className="flex items-center gap-1.5 text-vault-ink dark:text-vault-text font-bold mb-0.5 font-sans">
          <ShieldCheck className="w-4 h-4 text-vault-reserveBlue shrink-0" />
          Automated Bill Protection
        </p>
        Upcoming subscription renewals and bill payments are factored into your safe-to-spend balance automatically.
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


import React, { useState } from 'react';
import { Send, Users, PlusCircle, ShieldCheck, ChevronRight, Target, QrCode, ArrowDownLeft } from 'lucide-react';
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
    <div className="space-y-6">
      {/* SIGNATURE ELEMENT: Live Thermal UPI Passbook Tape */}
      <div className="bg-slate-900 text-slate-200 border-b border-slate-800 px-3.5 py-2 font-mono text-[11px] flex items-center justify-between shadow-xs select-none rounded-t-xl animate-thermal">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold tracking-wider text-emerald-400">NPCI VERIFIED</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 truncate">LATENCY 0.2s</span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">{user.upiId}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            aria-label="Scan QR Code to pay"
            onClick={() => setShowScanModal(true)}
            className="px-2 py-1 bg-vault-reserveBlue text-white rounded font-mono font-bold hover:bg-vault-reserveBlueHover transition-colors flex items-center gap-1 text-[10px]"
          >
            <QrCode className="w-3 h-3" />
            <span>PAY QR</span>
          </button>

          <button
            type="button"
            aria-label="Receive money via QR"
            onClick={() => setShowReceiveModal(true)}
            className="px-2 py-1 bg-slate-800 text-emerald-400 border border-emerald-500/30 rounded font-mono font-bold hover:bg-slate-700 transition-colors flex items-center gap-1 text-[10px]"
          >
            <ArrowDownLeft className="w-3 h-3" />
            <span>RECEIVE</span>
          </button>
        </div>
      </div>

      {/* LEVEL 1 PRIMARY HERO: Top Flush Ledger Header (No rounded box floating card) */}
      <div className="pb-6 border-b-2 border-vault-ink dark:border-vault-text space-y-4">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-vault-muted dark:text-vault-mutedDark">
          <span>Safe to Spend Ledger</span>
          <span className="text-[10px] font-bold text-vault-emerald bg-vault-emeraldLight px-2 py-0.5 rounded border border-vault-emerald/20">
            Plain-English Balance
          </span>
        </div>

        {/* Distinctive Rupee Typographic Signature: Serif ₹ + Monospace Digits */}
        <div className="my-2 flex items-baseline gap-2">
          <span className="font-serif text-3xl sm:text-4xl font-bold text-vault-reserveBlue dark:text-vault-reserveBlue">₹</span>
          <div className="text-4xl sm:text-5xl font-mono font-bold text-vault-ink dark:text-vault-text tracking-tight tabular-nums">
            <AnimatedAmount amount={user.safeToSpend} />
          </div>
        </div>

        <p className="text-xs text-vault-muted dark:text-vault-mutedDark font-medium">
          Total liquid available balance: <span className="text-vault-ink dark:text-vault-text font-bold font-mono tabular-nums">₹{user.availableBalance.toLocaleString('en-IN')}</span>
        </p>

        {/* Core Actions Bar */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <button 
            type="button"
            aria-label="Send Money"
            onClick={() => setActiveTab('send')}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-vault-reserveBlue hover:bg-vault-reserveBlueHover text-white active:scale-95 rounded-lg transition-all font-bold text-xs shadow-xs focus:ring-2 focus:ring-vault-reserveBlue"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Money</span>
          </button>

          <button 
            type="button"
            aria-label="Split a Bill"
            onClick={() => setActiveTab('split')}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-vault-paper border border-vault-rule hover:bg-vault-surfaceHighlight text-vault-ink dark:text-vault-text active:scale-95 rounded-lg transition-all font-semibold text-xs focus:ring-2 focus:ring-vault-reserveBlue"
          >
            <Users className="w-3.5 h-3.5 text-vault-reserveBlue" />
            <span>Split Bill</span>
          </button>

          <button 
            type="button"
            aria-label="Add Funds to Savings Goal"
            onClick={() => setActiveTab('goals')}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-vault-paper border border-vault-rule hover:bg-vault-surfaceHighlight text-vault-ink dark:text-vault-text active:scale-95 rounded-lg transition-all font-semibold text-xs focus:ring-2 focus:ring-vault-reserveBlue"
          >
            <PlusCircle className="w-3.5 h-3.5 text-vault-reserveBlue" />
            <span>Add Funds</span>
          </button>
        </div>
      </div>

      {/* LEVEL 2: Savings Goal Milestone Bar */}
      {topGoal && (
        <div 
          onClick={() => setActiveTab('goals')}
          className="py-3 px-4 bg-vault-surface border border-vault-rule rounded-xl cursor-pointer hover:border-vault-reserveBlue/40 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[10px] font-mono text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider">Active Savings Ring-Fence</p>
              <h4 className="text-xs font-bold text-vault-ink dark:text-vault-text group-hover:text-vault-reserveBlue transition-colors mt-0.5">
                {topGoal.title}
              </h4>
            </div>
            
            <span className="text-xs font-mono font-bold text-vault-reserveBlue bg-vault-reserveBlueLight px-2 py-0.5 rounded border border-vault-reserveBlue/20 tabular-nums">
              {topGoalProgress}%
            </span>
          </div>

          <div className="w-full bg-vault-surfaceHighlight rounded-full h-1.5 overflow-hidden border border-vault-rule">
            <div 
              className="bg-vault-reserveBlue h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${topGoalProgress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] mt-1.5 font-mono text-vault-muted dark:text-vault-mutedDark">
            <span>₹{topGoal.currentAmount.toLocaleString('en-IN')} saved</span>
            <span>Target: ₹{topGoal.targetAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}

      {/* LEVEL 2: Recent Activity Passbook Ledger */}
      <div>
        <div className="flex justify-between items-center mb-2 px-1">
          <h3 className="font-serif text-base font-bold text-vault-ink dark:text-vault-text tracking-tight">
            Recent Passbook Entries
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

        {/* Hairline Passbook Rules List */}
        <div className="bg-vault-surface border border-vault-rule rounded-xl overflow-hidden shadow-xs">
          {recentTxs.map((tx) => (
            <TransactionRow 
              key={tx.id}
              tx={tx}
              onClick={() => setSelectedTransaction(tx)}
            />
          ))}
        </div>
      </div>

      {/* LEVEL 3 FOOTNOTE: Quiet Offset Assurance */}
      <div className="p-3.5 rounded-lg bg-vault-paper border-l-4 border-l-vault-reserveBlue border-y border-r border-vault-rule text-xs text-vault-muted dark:text-vault-mutedDark leading-relaxed">
        <p className="flex items-center gap-1.5 text-vault-ink dark:text-vault-text font-bold mb-0.5">
          <ShieldCheck className="w-4 h-4 text-vault-reserveBlue shrink-0" />
          No Hidden Fees or Surprises
        </p>
        Vault checks your upcoming bills automatically. Your safe-to-spend balance accounts for rent and recurring subscriptions.
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

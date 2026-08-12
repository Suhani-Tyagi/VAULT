import React, { useState } from 'react';
import { Send, Users, PlusCircle, ShieldCheck, ChevronRight, Target, QrCode, ArrowDownLeft, Wifi } from 'lucide-react';
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

  const handleScanSuccess = (recipient) => {
    setShowScanModal(false);
    setActiveTab('send');
  };

  return (
    <div className="space-y-5">
      {/* Signature Vault Monolith Status & Quick QR Bar */}
      <div className="bg-vault-surface border border-vault-border rounded-2xl p-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <p className="text-xs font-bold text-vault-charcoal dark:text-vault-text flex items-center gap-1.5 leading-none">
              <span>UPI Network Online</span>
              <span className="text-[10px] font-mono text-vault-bronze bg-vault-bronzeLight px-1.5 py-0.5 rounded font-bold">
                0.4s Latency
              </span>
            </p>
            <p className="text-[10px] text-vault-muted dark:text-vault-mutedDark mt-0.5 font-mono">
              Handle: {user.upiId}
            </p>
          </div>
        </div>

        {/* Dual Quick Action QR Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Scan QR to Pay"
            onClick={() => setShowScanModal(true)}
            className="px-2.5 py-1.5 bg-vault-surfaceHighlight border border-vault-border hover:border-vault-bronze text-vault-charcoal dark:text-vault-text rounded-xl text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
          >
            <QrCode className="w-3.5 h-3.5 text-vault-bronze" />
            <span>Scan</span>
          </button>

          <button
            type="button"
            aria-label="Generate Receive QR"
            onClick={() => setShowReceiveModal(true)}
            className="px-2.5 py-1.5 bg-vault-bronzeLight border border-vault-bronze/30 text-vault-bronze rounded-xl text-xs font-bold hover:bg-vault-bronze hover:text-white transition-all flex items-center gap-1 active:scale-95"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Receive</span>
          </button>
        </div>
      </div>

      {/* Safe to Spend Balance Hero Banner (Architectural Monolith Style) */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 shadow-xl overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between text-slate-300 text-xs font-bold tracking-wider uppercase mb-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-vault-bronze" />
            Safe to Spend Balance
          </span>
          <span className="text-[10px] font-semibold bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15 text-vault-bronze">
            RBI Regulated
          </span>
        </div>

        <div className="my-4 flex items-baseline gap-2">
          {/* Distinctive Rupee Typographic Signature */}
          <span className="text-2xl sm:text-3xl font-display font-extrabold text-vault-bronze">₹</span>
          <div className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight tabular-nums">
            <AnimatedAmount amount={user.safeToSpend} />
          </div>
        </div>

        <p className="text-xs text-slate-400 font-medium">
          Total liquid available balance: <span className="text-white font-bold font-mono tabular-nums">₹{user.availableBalance.toLocaleString('en-IN')}</span>
        </p>

        {/* Core Actions Row */}
        <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-slate-800">
          <button 
            type="button"
            aria-label="Send Money"
            onClick={() => setActiveTab('send')}
            className="flex flex-col items-center justify-center py-2.5 px-2 bg-vault-bronze hover:bg-vault-bronzeHover text-white active:scale-95 rounded-xl transition-all font-bold text-xs shadow-md focus:ring-2 focus:ring-vault-bronze"
          >
            <Send className="w-4 h-4 mb-1" />
            <span>Send Money</span>
          </button>

          <button 
            type="button"
            aria-label="Split a Bill"
            onClick={() => setActiveTab('split')}
            className="flex flex-col items-center justify-center py-2.5 px-2 bg-white/10 hover:bg-white/20 text-white active:scale-95 rounded-xl transition-all font-semibold text-xs border border-white/15 focus:ring-2 focus:ring-white"
          >
            <Users className="w-4 h-4 mb-1 text-slate-200" />
            <span>Split Bill</span>
          </button>

          <button 
            type="button"
            aria-label="Add Funds to Savings Goal"
            onClick={() => setActiveTab('goals')}
            className="flex flex-col items-center justify-center py-2.5 px-2 bg-white/10 hover:bg-white/20 text-white active:scale-95 rounded-xl transition-all font-semibold text-xs border border-white/15 focus:ring-2 focus:ring-white"
          >
            <PlusCircle className="w-4 h-4 mb-1 text-slate-200" />
            <span>Add Funds</span>
          </button>
        </div>
      </div>

      {/* Savings Goal Snapshot Tile */}
      {topGoal && (
        <div 
          onClick={() => setActiveTab('goals')}
          className="bg-vault-surface border border-vault-border rounded-2xl p-4 cursor-pointer hover:border-vault-bronze/40 transition-all group shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-vault-bronzeLight border border-vault-bronze/30 text-vault-bronze flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-vault-muted dark:text-vault-mutedDark font-medium">Primary Savings Goal</p>
                <h4 className="text-sm font-bold text-vault-charcoal dark:text-vault-text group-hover:text-vault-bronze transition-colors">
                  {topGoal.title}
                </h4>
              </div>
            </div>
            
            <span className="text-xs font-display font-bold text-vault-bronze bg-vault-bronzeLight px-2.5 py-1 rounded-xl border border-vault-bronze/30 tabular-nums">
              {topGoalProgress}%
            </span>
          </div>

          <div className="w-full bg-vault-surfaceHighlight rounded-full h-2 overflow-hidden border border-vault-border">
            <div 
              className="bg-vault-bronze h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${topGoalProgress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-xs mt-2 text-vault-muted dark:text-vault-mutedDark font-medium">
            <span>₹{topGoal.currentAmount.toLocaleString('en-IN')} saved</span>
            <span>Target: ₹{topGoal.targetAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}

      {/* Recent Activity Section */}
      <div>
        <div className="flex justify-between items-center mb-2.5 px-1">
          <h3 className="text-sm font-bold text-vault-charcoal dark:text-vault-text tracking-tight">Recent Activity</h3>
          <button 
            type="button"
            onClick={() => setActiveTab('transactions')}
            className="text-xs text-vault-bronze hover:underline font-bold flex items-center gap-0.5"
          >
            <span>See all ({transactions.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Transaction Rows */}
        <div className="bg-vault-surface border border-vault-border rounded-2xl divide-y divide-vault-border overflow-hidden shadow-xs">
          {recentTxs.map((tx) => (
            <TransactionRow 
              key={tx.id}
              tx={tx}
              onClick={() => setSelectedTransaction(tx)}
            />
          ))}
        </div>
      </div>

      {/* Human Assurance Footer */}
      <div className="p-4 rounded-2xl bg-vault-surface border-l-4 border-l-vault-bronze border-y border-r border-vault-border text-xs text-vault-muted dark:text-vault-mutedDark leading-relaxed">
        <p className="flex items-center gap-1.5 text-vault-charcoal dark:text-vault-text font-bold mb-0.5">
          <ShieldCheck className="w-4 h-4 text-vault-bronze shrink-0" />
          Transparent Safe-to-Spend Balance
        </p>
        Vault automatically accounts for your upcoming rent and subscription bills. What you see is what you can spend cleanly.
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

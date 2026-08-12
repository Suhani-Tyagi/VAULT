import React from 'react';
import { Send, Users, PlusCircle, ShieldCheck, ChevronRight, Target } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { AnimatedAmount } from '../components/AnimatedAmount';
import { TransactionRow } from '../components/TransactionRow';

export const HomeScreen = () => {
  const { user, transactions, goals, setActiveTab, setSelectedTransaction } = useVault();

  const topGoal = goals[0];
  const topGoalProgress = Math.min(Math.round((topGoal.currentAmount / topGoal.targetAmount) * 100), 100);

  const recentTxs = transactions.slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Safe to Spend Balance Hero Card */}
      <div className="relative bg-vault-terracotta text-white rounded-3xl p-6 shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between text-white/80 text-xs font-bold tracking-wider uppercase mb-1">
          <span>Safe to Spend</span>
          <span className="flex items-center gap-1 text-[10px] font-semibold bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20">
            <ShieldCheck className="w-3 h-3 text-white" /> Calm Banking
          </span>
        </div>

        <div className="my-3">
          <div className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            <AnimatedAmount amount={user.safeToSpend} />
          </div>
          <p className="text-xs text-white/80 mt-1 font-medium">
            Total available balance: <span className="text-white font-bold tabular-nums">₹{user.availableBalance.toLocaleString('en-IN')}</span>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-white/20">
          <button 
            type="button"
            aria-label="Send Money"
            onClick={() => setActiveTab('send')}
            className="flex flex-col items-center justify-center py-2.5 px-2 bg-white text-vault-terracotta hover:bg-vault-paper active:scale-95 rounded-2xl transition-all font-bold text-xs shadow-sm focus:ring-2 focus:ring-white"
          >
            <Send className="w-4 h-4 mb-1" />
            <span>Send Money</span>
          </button>

          <button 
            type="button"
            aria-label="Split a Bill"
            onClick={() => setActiveTab('split')}
            className="flex flex-col items-center justify-center py-2.5 px-2 bg-white/15 hover:bg-white/25 active:scale-95 rounded-2xl transition-all text-white font-semibold text-xs border border-white/20 focus:ring-2 focus:ring-white"
          >
            <Users className="w-4 h-4 mb-1 text-white" />
            <span>Split Bill</span>
          </button>

          <button 
            type="button"
            aria-label="Add Funds to Savings Goal"
            onClick={() => setActiveTab('goals')}
            className="flex flex-col items-center justify-center py-2.5 px-2 bg-white/15 hover:bg-white/25 active:scale-95 rounded-2xl transition-all text-white font-semibold text-xs border border-white/20 focus:ring-2 focus:ring-white"
          >
            <PlusCircle className="w-4 h-4 mb-1 text-white" />
            <span>Add Funds</span>
          </button>
        </div>
      </div>

      {/* Savings Goal Progress Snapshot Card */}
      {topGoal && (
        <div 
          onClick={() => setActiveTab('goals')}
          className="bg-vault-surface border border-vault-border rounded-2xl p-4 cursor-pointer hover:border-vault-terracotta/40 transition-all group shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-vault-terracottaLight border border-vault-terracotta/30 text-vault-terracotta flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-vault-muted font-medium">Active Goal</p>
                <h4 className="text-sm font-bold text-vault-charcoal dark:text-vault-text group-hover:text-vault-terracotta transition-colors">
                  {topGoal.title}
                </h4>
              </div>
            </div>
            
            <span className="text-xs font-display font-bold text-vault-terracotta tabular-nums">
              {topGoalProgress}%
            </span>
          </div>

          <div className="w-full bg-vault-paper rounded-full h-2.5 overflow-hidden border border-vault-border">
            <div 
              className="bg-vault-terracotta h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${topGoalProgress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-xs mt-2 text-vault-muted font-medium">
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
            className="text-xs text-vault-terracotta hover:underline font-bold flex items-center gap-0.5"
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

      {/* Human Assurance */}
      <div className="p-3.5 rounded-2xl bg-vault-surface border border-vault-border text-xs text-vault-muted leading-relaxed">
        <p className="flex items-center gap-1.5 text-vault-charcoal dark:text-vault-text font-bold mb-0.5">
          <ShieldCheck className="w-4 h-4 text-vault-terracotta shrink-0" />
          No hidden fees or surprises
        </p>
        Vault checks your upcoming bills automatically. Your safe-to-spend balance accounts for rent and recurring subscriptions.
      </div>
    </div>
  );
};

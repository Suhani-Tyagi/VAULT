import React, { useState, useRef, useEffect } from 'react';
import { Target, Plus, Plane, Laptop, ShieldCheck, X } from 'lucide-react';
import { useVault } from '../context/VaultContext';
import { CategoryIcon } from '../components/CategoryIcon';

export const SavingsGoalsScreen = () => {
  const { user, goals, depositToGoal, createGoal } = useVault();

  const [activeDepositGoal, setActiveDepositGoal] = useState(null);
  const [depositAmount, setDepositAmount] = useState('1500');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('25000');
  const [newCategory, setNewCategory] = useState('Travel');
  const [newDate, setNewDate] = useState('Nov 2026');

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    if (!activeDepositGoal) return;

    const ok = depositToGoal(activeDepositGoal.id, depositAmount);
    if (ok) {
      setActiveDepositGoal(null);
      setDepositAmount('1500');
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const ok = createGoal(newTitle, newTarget, newCategory, newDate);
    if (ok) {
      setShowCreateModal(false);
      setNewTitle('');
      setNewTarget('25000');
    }
  };

  const totalSavedInGoals = goals.reduce((acc, g) => acc + g.currentAmount, 0);

  return (
    <div className="space-y-4">
      {/* Header title */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-vault-charcoal dark:text-vault-text tracking-tight">Savings Goals</h2>
          <p className="text-xs text-vault-muted mt-0.5">
            Ring-fenced funds for things that matter
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          aria-label="Create new savings goal"
          className="flex items-center gap-1.5 px-3 py-2 bg-vault-terracotta hover:bg-vault-terracottaHover text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 focus:ring-2 focus:ring-vault-terracotta"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-vault-surface border border-vault-border rounded-2xl p-4 flex justify-between items-center shadow-xs">
        <div>
          <p className="text-xs text-vault-muted font-medium">Total Saved Across Goals</p>
          <h3 className="text-2xl font-display font-bold text-vault-terracotta tabular-nums mt-0.5">
            ₹{totalSavedInGoals.toLocaleString('en-IN')}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-vault-muted font-medium">Active Goals</p>
          <p className="text-lg font-bold text-vault-charcoal dark:text-vault-text font-display tabular-nums mt-0.5">
            {goals.length}
          </p>
        </div>
      </div>

      {/* List of Goals */}
      <div className="space-y-3">
        {goals.map((goal) => {
          const percent = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
          const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);

          return (
            <div 
              key={goal.id}
              className="bg-vault-surface border border-vault-border rounded-2xl p-4 space-y-3.5 hover:border-vault-borderDark transition-all shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <CategoryIcon 
                    iconName={goal.iconName} 
                    category={goal.category} 
                    bgSize="w-11 h-11"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-vault-charcoal dark:text-vault-text">{goal.title}</h3>
                    <p className="text-xs text-vault-muted mt-0.5">
                      Target: {goal.targetDate} • {goal.category}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-display font-bold text-vault-terracotta bg-vault-terracottaLight px-2.5 py-1 rounded-xl border border-vault-terracotta/30 tabular-nums">
                  {percent}%
                </span>
              </div>

              <div>
                <div className="w-full bg-vault-paper rounded-full h-2.5 overflow-hidden border border-vault-border">
                  <div 
                    className="bg-vault-terracotta h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs mt-2 font-medium">
                  <span className="text-vault-charcoal dark:text-vault-text font-display font-bold tabular-nums">
                    ₹{goal.currentAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-vault-muted tabular-nums">
                    ₹{remaining.toLocaleString('en-IN')} remaining of ₹{goal.targetAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-vault-border flex justify-between items-center">
                <span className="text-xs text-vault-muted italic truncate max-w-[200px]">
                  {goal.notes}
                </span>

                <button
                  onClick={() => { setActiveDepositGoal(goal); setDepositAmount('1500'); }}
                  aria-label={`Add funds to ${goal.title}`}
                  className="px-3 py-1.5 bg-vault-surfaceHighlight hover:bg-vault-border text-vault-terracotta border border-vault-terracotta/30 rounded-xl text-xs font-bold transition-all active:scale-95 focus:ring-2 focus:ring-vault-terracotta"
                >
                  + Add Funds
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: Add Funds */}
      {activeDepositGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="deposit-modal-title"
            className="w-full max-w-sm bg-vault-surface border border-vault-border rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 text-vault-charcoal dark:text-vault-text focus:outline-none"
          >
            <div className="flex justify-between items-center border-b border-vault-border pb-3">
              <h3 id="deposit-modal-title" className="text-base font-bold text-vault-charcoal dark:text-vault-text">
                Add Funds to Goal
              </h3>
              <button 
                onClick={() => setActiveDepositGoal(null)}
                aria-label="Close deposit modal"
                className="text-vault-muted hover:text-vault-charcoal p-1 rounded-full hover:bg-vault-surfaceHighlight focus:ring-2 focus:ring-vault-terracotta"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <p className="text-xs text-vault-muted">Selected Goal</p>
              <h4 className="text-sm font-bold text-vault-charcoal dark:text-vault-text mt-0.5">{activeDepositGoal.title}</h4>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-vault-muted mb-1">
                  <span>Amount to Deposit</span>
                  <span>Available: <strong className="text-vault-charcoal dark:text-vault-text">₹{user.availableBalance.toLocaleString('en-IN')}</strong></span>
                </div>

                <div className="flex items-center bg-vault-paper border border-vault-border rounded-xl px-3 py-2">
                  <span className="text-xl font-bold text-vault-muted mr-1">₹</span>
                  <input 
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    aria-label="Deposit amount in Rupees"
                    className="w-full bg-transparent text-xl font-display font-bold text-vault-charcoal dark:text-vault-text focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {[500, 1500, 3000, 5000].map(val => (
                  <button
                    key={val}
                    type="button"
                    aria-label={`Add ${val} rupees`}
                    onClick={() => setDepositAmount(val.toString())}
                    className="flex-1 py-1 bg-vault-paper border border-vault-border rounded-lg text-xs text-vault-muted hover:text-vault-charcoal font-mono focus:ring-2 focus:ring-vault-terracotta"
                  >
                    +₹{val}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-vault-paper border border-vault-border rounded-xl text-xs text-vault-muted leading-relaxed">
                "Money added to goals is moved from your safe-to-spend balance. You can withdraw back anytime instantly."
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveDepositGoal(null)}
                  className="flex-1 py-2.5 bg-vault-surfaceHighlight border border-vault-border text-vault-muted rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-vault-terracotta text-white rounded-xl text-xs font-bold shadow-xs hover:bg-vault-terracottaHover"
                >
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Create Goal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-modal-title"
            className="w-full max-w-sm bg-vault-surface border border-vault-border rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 text-vault-charcoal dark:text-vault-text focus:outline-none"
          >
            <div className="flex justify-between items-center border-b border-vault-border pb-3">
              <h3 id="create-modal-title" className="text-base font-bold text-vault-charcoal dark:text-vault-text">
                Create Savings Goal
              </h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                aria-label="Close goal creation modal"
                className="text-vault-muted hover:text-vault-charcoal p-1 rounded-full hover:bg-vault-surfaceHighlight focus:ring-2 focus:ring-vault-terracotta"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label htmlFor="goal-name-input" className="text-vault-muted font-bold block mb-1">Goal Name</label>
                <input 
                  id="goal-name-input"
                  type="text"
                  required
                  placeholder="e.g. Emergency Reserve, New Phone"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-vault-paper border border-vault-border rounded-xl px-3 py-2 text-vault-charcoal dark:text-vault-text placeholder-vault-muted focus:outline-none focus:border-vault-terracotta"
                />
              </div>

              <div>
                <label htmlFor="goal-target-input" className="text-vault-muted font-bold block mb-1">Target Amount (₹)</label>
                <input 
                  id="goal-target-input"
                  type="number"
                  required
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full bg-vault-paper border border-vault-border rounded-xl px-3 py-2 text-vault-charcoal dark:text-vault-text font-display font-bold focus:outline-none focus:border-vault-terracotta tabular-nums"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="goal-category-select" className="text-vault-muted font-bold block mb-1">Category</label>
                  <select 
                    id="goal-category-select"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-vault-paper border border-vault-border rounded-xl px-2.5 py-2 text-vault-charcoal dark:text-vault-text focus:outline-none"
                  >
                    <option value="Travel">Travel</option>
                    <option value="Tech">Tech</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Shopping">Shopping</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="goal-date-input" className="text-vault-muted font-bold block mb-1">Target Date</label>
                  <input 
                    id="goal-date-input"
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="e.g. Dec 2026"
                    className="w-full bg-vault-paper border border-vault-border rounded-xl px-3 py-2 text-vault-charcoal dark:text-vault-text focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 bg-vault-surfaceHighlight border border-vault-border text-vault-muted rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-vault-terracotta text-white rounded-xl font-bold shadow-xs hover:bg-vault-terracottaHover"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

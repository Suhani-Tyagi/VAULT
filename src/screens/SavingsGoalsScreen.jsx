import React, { useState } from 'react';
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
      <div className="flex justify-between items-start pb-2 border-b border-vault-rule">
        <div>
          <h2 className="font-serif text-xl font-bold text-vault-ink dark:text-vault-text tracking-tight">Savings Goals</h2>
          <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5">
            Ring-fenced funds for things that matter
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          aria-label="Create new savings goal"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-vault-reserveBlue hover:bg-vault-reserveBlueHover text-white rounded-lg text-xs font-mono font-bold shadow-xs transition-all active:scale-95 focus:ring-2 focus:ring-vault-reserveBlue"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-vault-surface border border-vault-rule rounded-xl p-4 flex justify-between items-center shadow-xs font-mono">
        <div>
          <p className="text-xs text-vault-muted dark:text-vault-mutedDark font-medium">Total Saved Across Goals</p>
          <h3 className="text-2xl font-mono font-bold text-vault-reserveBlue tabular-nums mt-0.5">
            ₹{totalSavedInGoals.toLocaleString('en-IN')}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-vault-muted dark:text-vault-mutedDark font-medium">Active Goals</p>
          <p className="text-lg font-bold text-vault-ink dark:text-vault-text tabular-nums mt-0.5">
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
              className="bg-vault-surface border border-vault-rule rounded-xl p-4 space-y-3 hover:border-vault-ruleDark transition-all shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <CategoryIcon 
                    iconName={goal.iconName} 
                    category={goal.category} 
                    bgSize="w-10 h-10"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-vault-ink dark:text-vault-text">{goal.title}</h3>
                    <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5 font-mono">
                      Target: {goal.targetDate} • {goal.category}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-vault-reserveBlue bg-vault-reserveBlueLight px-2.5 py-0.5 rounded border border-vault-reserveBlue/30 tabular-nums">
                  {percent}%
                </span>
              </div>

              <div>
                <div className="w-full bg-vault-surfaceHighlight rounded-full h-1.5 overflow-hidden border border-vault-rule">
                  <div 
                    className="bg-vault-reserveBlue h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs mt-2 font-mono font-medium">
                  <span className="text-vault-ink dark:text-vault-text font-bold tabular-nums">
                    ₹{goal.currentAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-vault-muted dark:text-vault-mutedDark tabular-nums">
                    ₹{remaining.toLocaleString('en-IN')} remaining of ₹{goal.targetAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-vault-rule flex justify-between items-center text-xs font-mono">
                <span className="text-vault-muted dark:text-vault-mutedDark italic truncate max-w-[200px]">
                  {goal.notes}
                </span>

                <button
                  onClick={() => { setActiveDepositGoal(goal); setDepositAmount('1500'); }}
                  aria-label={`Add funds to ${goal.title}`}
                  className="px-3 py-1 bg-vault-paper hover:bg-vault-surfaceHighlight text-vault-reserveBlue border border-vault-reserveBlue/30 rounded text-xs font-bold transition-all active:scale-95 focus:ring-2 focus:ring-vault-reserveBlue"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="deposit-modal-title"
            className="w-full max-w-sm bg-vault-surface border border-vault-rule rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 text-vault-ink dark:text-vault-text focus:outline-none"
          >
            <div className="flex justify-between items-center border-b border-vault-rule pb-3">
              <h3 id="deposit-modal-title" className="font-serif text-base font-bold text-vault-ink dark:text-vault-text">
                Add Funds to Goal
              </h3>
              <button 
                onClick={() => setActiveDepositGoal(null)}
                aria-label="Close deposit modal"
                className="text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink dark:hover:text-vault-text p-1 rounded-full hover:bg-vault-surfaceHighlight focus:ring-2 focus:ring-vault-reserveBlue"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <p className="text-xs text-vault-muted dark:text-vault-mutedDark font-mono">Selected Goal</p>
              <h4 className="text-sm font-bold text-vault-ink dark:text-vault-text mt-0.5">{activeDepositGoal.title}</h4>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-vault-muted dark:text-vault-mutedDark mb-1 font-mono">
                  <span>Amount to Deposit</span>
                  <span>Available: <strong className="text-vault-ink dark:text-vault-text">₹{user.availableBalance.toLocaleString('en-IN')}</strong></span>
                </div>

                <div className="flex items-center bg-vault-paper border border-vault-rule rounded-lg px-3 py-2">
                  <span className="font-serif text-xl font-bold text-vault-reserveBlue mr-1">₹</span>
                  <input 
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    aria-label="Deposit amount in Rupees"
                    className="w-full bg-transparent text-xl font-mono font-bold text-vault-ink dark:text-vault-text focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <div className="flex gap-2 font-mono">
                {[500, 1500, 3000, 5000].map(val => (
                  <button
                    key={val}
                    type="button"
                    aria-label={`Add ${val} rupees`}
                    onClick={() => setDepositAmount(val.toString())}
                    className="flex-1 py-1 bg-vault-paper border border-vault-rule rounded text-xs text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink dark:hover:text-vault-text font-bold focus:ring-2 focus:ring-vault-reserveBlue"
                  >
                    +₹{val}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-vault-paper border border-vault-rule rounded-lg text-xs text-vault-muted dark:text-vault-mutedDark leading-relaxed">
                "Money added to goals is moved from your safe-to-spend balance. You can withdraw back anytime instantly."
              </div>

              <div className="flex gap-2 pt-2 font-mono">
                <button
                  type="button"
                  onClick={() => setActiveDepositGoal(null)}
                  className="flex-1 py-2.5 bg-vault-paper border border-vault-rule text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink dark:hover:text-vault-text rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-vault-reserveBlue text-white rounded-lg text-xs font-bold shadow-xs hover:bg-vault-reserveBlueHover"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-modal-title"
            className="w-full max-w-sm bg-vault-surface border border-vault-rule rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 text-vault-ink dark:text-vault-text focus:outline-none"
          >
            <div className="flex justify-between items-center border-b border-vault-rule pb-3">
              <h3 id="create-modal-title" className="font-serif text-base font-bold text-vault-ink dark:text-vault-text">
                Create Savings Goal
              </h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                aria-label="Close goal creation modal"
                className="text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink dark:hover:text-vault-text p-1 rounded-full hover:bg-vault-surfaceHighlight focus:ring-2 focus:ring-vault-reserveBlue"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs font-mono">
              <div>
                <label htmlFor="goal-name-input" className="text-vault-muted dark:text-vault-mutedDark font-bold block mb-1">Goal Name</label>
                <input 
                  id="goal-name-input"
                  type="text"
                  required
                  placeholder="e.g. Emergency Reserve, New Phone"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-vault-paper border border-vault-rule rounded-lg px-3 py-2 text-vault-ink dark:text-vault-text placeholder-vault-muted focus:outline-none focus:border-vault-reserveBlue font-sans"
                />
              </div>

              <div>
                <label htmlFor="goal-target-input" className="text-vault-muted dark:text-vault-mutedDark font-bold block mb-1">Target Amount (₹)</label>
                <input 
                  id="goal-target-input"
                  type="number"
                  required
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full bg-vault-paper border border-vault-rule rounded-lg px-3 py-2 text-vault-ink dark:text-vault-text font-bold focus:outline-none focus:border-vault-reserveBlue tabular-nums font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="goal-category-select" className="text-vault-muted dark:text-vault-mutedDark font-bold block mb-1">Category</label>
                  <select 
                    id="goal-category-select"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-vault-paper border border-vault-rule rounded-lg px-2.5 py-2 text-vault-ink dark:text-vault-text focus:outline-none font-sans"
                  >
                    <option value="Travel">Travel</option>
                    <option value="Tech">Tech</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Shopping">Shopping</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="goal-date-input" className="text-vault-muted dark:text-vault-mutedDark font-bold block mb-1">Target Date</label>
                  <input 
                    id="goal-date-input"
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="e.g. Dec 2026"
                    className="w-full bg-vault-paper border border-vault-rule rounded-lg px-3 py-2 text-vault-ink dark:text-vault-text focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 bg-vault-paper border border-vault-rule text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink dark:hover:text-vault-text rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-vault-reserveBlue text-white rounded-lg font-bold shadow-xs hover:bg-vault-reserveBlueHover"
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

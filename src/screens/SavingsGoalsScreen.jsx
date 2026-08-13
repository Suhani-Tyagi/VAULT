import React, { useState } from 'react';
import { Target, Plus, X } from 'lucide-react';
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
    <div className="space-y-4 font-sans">
      {/* Header title */}
      <div className="flex justify-between items-start pb-3 border-b border-vault-rule">
        <div>
          <h2 className="text-lg font-bold text-vault-ink dark:text-vault-text tracking-tight font-sans">Savings Goals</h2>
          <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5 font-mono">
            Track dedicated savings targets
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          aria-label="Create new savings goal"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-vault-reserveBlue hover:bg-vault-reserveBlueHover text-white rounded-lg text-xs font-mono font-bold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-vault-surface border border-vault-rule rounded-xl p-4 flex justify-between items-center font-mono">
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
              className="bg-vault-surface border border-vault-rule rounded-xl p-4 space-y-3 hover:border-vault-muted transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <CategoryIcon 
                    iconName={goal.iconName} 
                    category={goal.category} 
                    bgSize="w-9 h-9"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-vault-ink dark:text-vault-text font-sans">{goal.title}</h3>
                    <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5 font-mono">
                      Target: {goal.targetDate} • {goal.category}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-vault-reserveBlue tabular-nums">
                  {percent}%
                </span>
              </div>

              <div>
                <div className="w-full bg-vault-surfaceHighlight rounded-full h-1.5 overflow-hidden border border-vault-rule">
                  <div 
                    className="bg-vault-reserveBlue h-full rounded-full transition-all duration-500 ease-out"
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
                <span className="text-vault-muted dark:text-vault-mutedDark truncate max-w-[200px]">
                  {goal.notes}
                </span>

                <button
                  onClick={() => { setActiveDepositGoal(goal); setDepositAmount('1500'); }}
                  aria-label={`Add funds to ${goal.title}`}
                  className="px-2.5 py-1 bg-vault-paper hover:bg-vault-surfaceHighlight text-vault-reserveBlue border border-vault-rule rounded text-xs font-bold transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="deposit-modal-title"
            className="w-full max-w-sm bg-vault-surface border border-vault-rule rounded-xl p-5 shadow-lg space-y-4 text-vault-ink dark:text-vault-text focus:outline-none"
          >
            <div className="flex justify-between items-center border-b border-vault-rule pb-2.5">
              <h3 id="deposit-modal-title" className="text-sm font-bold text-vault-ink dark:text-vault-text font-sans">
                Add Funds to Goal
              </h3>
              <button 
                onClick={() => setActiveDepositGoal(null)}
                aria-label="Close deposit modal"
                className="text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink p-1 rounded hover:bg-vault-surfaceHighlight"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <p className="text-xs text-vault-muted dark:text-vault-mutedDark font-mono">Target Goal</p>
              <h4 className="text-xs font-bold text-vault-ink dark:text-vault-text mt-0.5 font-sans">{activeDepositGoal.title}</h4>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-3 font-mono">
              <div>
                <div className="flex justify-between text-xs text-vault-muted dark:text-vault-mutedDark mb-1">
                  <span>Deposit Amount</span>
                  <span>Avail: <strong className="text-vault-ink dark:text-vault-text">₹{user.availableBalance.toLocaleString('en-IN')}</strong></span>
                </div>

                <div className="flex items-center bg-vault-paper border border-vault-rule rounded-lg px-3 py-1.5">
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

              <div className="flex gap-1.5">
                {[500, 1500, 3000, 5000].map(val => (
                  <button
                    key={val}
                    type="button"
                    aria-label={`Add ${val} rupees`}
                    onClick={() => setDepositAmount(val.toString())}
                    className="flex-1 py-1 bg-vault-paper border border-vault-rule rounded text-xs text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink font-bold"
                  >
                    +₹{val}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveDepositGoal(null)}
                  className="flex-1 py-2 bg-vault-paper border border-vault-rule text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink rounded-lg text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-vault-reserveBlue text-white rounded-lg text-xs font-bold hover:bg-vault-reserveBlueHover"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Create Goal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-modal-title"
            className="w-full max-w-sm bg-vault-surface border border-vault-rule rounded-xl p-5 shadow-lg space-y-4 text-vault-ink dark:text-vault-text focus:outline-none font-sans"
          >
            <div className="flex justify-between items-center border-b border-vault-rule pb-2.5">
              <h3 id="create-modal-title" className="text-sm font-bold text-vault-ink dark:text-vault-text">
                Create Savings Goal
              </h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                aria-label="Close goal creation modal"
                className="text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink p-1 rounded hover:bg-vault-surfaceHighlight"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label htmlFor="goal-name-input" className="text-vault-muted dark:text-vault-mutedDark font-mono font-bold block mb-1">Goal Name</label>
                <input 
                  id="goal-name-input"
                  type="text"
                  required
                  placeholder="e.g. Emergency Reserve, Travel"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-vault-paper border border-vault-rule rounded-lg px-3 py-2 text-vault-ink dark:text-vault-text placeholder-vault-muted focus:outline-none focus:border-vault-reserveBlue font-sans"
                />
              </div>

              <div>
                <label htmlFor="goal-target-input" className="text-vault-muted dark:text-vault-mutedDark font-mono font-bold block mb-1">Target Amount (₹)</label>
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
                  <label htmlFor="goal-category-select" className="text-vault-muted dark:text-vault-mutedDark font-mono font-bold block mb-1">Category</label>
                  <select 
                    id="goal-category-select"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-vault-paper border border-vault-rule rounded-lg px-2 py-2 text-vault-ink dark:text-vault-text focus:outline-none font-sans"
                  >
                    <option value="Travel">Travel</option>
                    <option value="Tech">Tech</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Shopping">Shopping</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="goal-date-input" className="text-vault-muted dark:text-vault-mutedDark font-mono font-bold block mb-1">Target Date</label>
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

              <div className="flex gap-2 pt-2 font-mono">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 bg-vault-paper border border-vault-rule text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-vault-reserveBlue text-white rounded-lg font-bold hover:bg-vault-reserveBlueHover"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


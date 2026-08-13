import React, { useState } from 'react';
import { PieChart, X, Plus, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { useVault } from '../context/VaultContext';

export const BudgetsModal = ({ isOpen, onClose }) => {
  const { budgets, addBudget, deleteBudget, transactions } = useVault();

  const [category, setCategory] = useState('Food & Dining');
  const [limit, setLimit] = useState('10000');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !limit) return;
    addBudget(category, limit);
    setLimit('10000');
  };

  // Compute spent per category
  const categorySpentMap = transactions
    .filter(t => t.type === 'debit')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-sans select-none">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="budgets-modal-title"
        className="w-full max-w-md bg-vault-surface border border-vault-rule rounded-2xl p-6 shadow-xl text-vault-ink dark:text-vault-text space-y-5 focus:outline-none"
      >
        <div className="flex justify-between items-center border-b border-vault-rule pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-vault-paper border border-vault-rule text-vault-reserveBlue flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 id="budgets-modal-title" className="text-sm font-bold text-vault-ink dark:text-vault-text font-sans">
                Monthly Category Budgets
              </h3>
              <p className="text-[11px] text-vault-muted dark:text-vault-mutedDark font-mono">
                Set category limits & track spending thresholds
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            aria-label="Close budgets modal"
            className="text-vault-muted hover:text-vault-ink p-1.5 rounded-lg hover:bg-vault-surfaceHighlight transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Existing Budgets List */}
        <div className="space-y-2.5 max-h-60 overflow-y-auto font-mono text-xs">
          {budgets.map(b => {
            const spent = categorySpentMap[b.category] || 0;
            const percent = Math.min(Math.round((spent / b.limit) * 100), 100);
            const isNearLimit = percent >= 80;

            return (
              <div key={b.id} className="p-3 bg-vault-paper border border-vault-rule rounded-xl space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-vault-ink dark:text-vault-text font-sans">{b.category}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${isNearLimit ? 'text-amber-500' : 'text-vault-reserveBlue'}`}>
                      ₹{spent.toLocaleString('en-IN')} / ₹{b.limit.toLocaleString('en-IN')}
                    </span>
                    <button 
                      type="button"
                      onClick={() => deleteBudget(b.id)}
                      className="text-vault-muted hover:text-vault-rose p-1 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="w-full bg-vault-surfaceHighlight rounded-full h-1.5 overflow-hidden border border-vault-rule">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      percent >= 90 ? 'bg-vault-rose' : isNearLimit ? 'bg-amber-500' : 'bg-vault-reserveBlue'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Budget Form */}
        <form onSubmit={handleSubmit} className="p-3 bg-vault-paper border border-vault-rule rounded-xl space-y-3 font-mono text-xs">
          <p className="font-bold uppercase text-[10px] text-vault-muted tracking-wider">ADD CATEGORY BUDGET</p>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="budget-category-select" className="text-[10px] text-vault-muted block mb-1">Category</label>
              <select 
                id="budget-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-vault-surface border border-vault-rule rounded-lg px-2 py-1.5 text-xs text-vault-ink dark:text-vault-text focus:outline-none"
              >
                <option value="Food & Dining">Food & Dining</option>
                <option value="Groceries">Groceries</option>
                <option value="Shopping">Shopping</option>
                <option value="Transport">Transport</option>
                <option value="Utilities">Utilities</option>
                <option value="Subscriptions">Subscriptions</option>
              </select>
            </div>

            <div>
              <label htmlFor="budget-limit-input" className="text-[10px] text-vault-muted block mb-1">Monthly Limit (₹)</label>
              <input 
                id="budget-limit-input"
                type="number"
                required
                min="100"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full bg-vault-surface border border-vault-rule rounded-lg px-2.5 py-1.5 text-xs text-vault-ink dark:text-vault-text focus:outline-none font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-vault-reserveBlue hover:bg-vault-reserveBlueHover text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Budget Limit</span>
          </button>
        </form>
      </div>
    </div>
  );
};

BudgetsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

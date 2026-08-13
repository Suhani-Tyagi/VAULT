import React, { useState } from 'react';
import { Calendar, X, Plus, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { useVault } from '../context/VaultContext';

export const RecurringPaymentsModal = ({ isOpen, onClose }) => {
  const { recurringPayments, addRecurringPayment, deleteRecurringPayment } = useVault();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('649');
  const [frequency, setFrequency] = useState('Monthly');
  const [nextDate, setNextDate] = useState('1st of month');
  const [category, setCategory] = useState('Subscriptions');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) return;
    addRecurringPayment(name, amount, frequency, nextDate, category);
    setName('');
    setAmount('649');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-sans select-none">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="recurring-modal-title"
        className="w-full max-w-md bg-vault-surface border border-vault-rule rounded-2xl p-6 shadow-xl text-vault-ink dark:text-vault-text space-y-5 focus:outline-none"
      >
        <div className="flex justify-between items-center border-b border-vault-rule pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-vault-paper border border-vault-rule text-vault-reserveBlue flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 id="recurring-modal-title" className="text-sm font-bold text-vault-ink dark:text-vault-text font-sans">
                Recurring Payments & Bills
              </h3>
              <p className="text-[11px] text-vault-muted dark:text-vault-mutedDark font-mono">
                Manage subscriptions & automated bill commitments
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            aria-label="Close recurring payments modal"
            className="text-vault-muted hover:text-vault-ink p-1.5 rounded-lg hover:bg-vault-surfaceHighlight transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Existing List */}
        <div className="space-y-2 max-h-60 overflow-y-auto font-mono text-xs">
          {recurringPayments.map(item => (
            <div key={item.id} className="p-3 bg-vault-paper border border-vault-rule rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-vault-ink dark:text-vault-text font-sans">{item.name}</p>
                <p className="text-[10px] text-vault-muted dark:text-vault-mutedDark mt-0.5">
                  Due: {item.nextDate} • {item.frequency}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-vault-ink dark:text-vault-text tabular-nums">
                  ₹{item.amount.toLocaleString('en-IN')}
                </span>
                <button 
                  type="button"
                  onClick={() => deleteRecurringPayment(item.id)}
                  className="text-vault-muted hover:text-vault-rose p-1 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-3 bg-vault-paper border border-vault-rule rounded-xl space-y-3 font-mono text-xs">
          <p className="font-bold uppercase text-[10px] text-vault-muted tracking-wider">ADD RECURRING COMMITMENT</p>
          
          <div className="space-y-2">
            <input 
              type="text"
              required
              placeholder="Name (e.g. Netflix, Wifi, Rent)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-vault-surface border border-vault-rule rounded-lg px-2.5 py-1.5 text-xs text-vault-ink dark:text-vault-text font-sans focus:outline-none"
            />

            <div className="grid grid-cols-2 gap-2">
              <input 
                type="number"
                required
                placeholder="Amount (₹)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-vault-surface border border-vault-rule rounded-lg px-2.5 py-1.5 text-xs text-vault-ink dark:text-vault-text font-mono focus:outline-none"
              />
              <input 
                type="text"
                placeholder="Next Due (e.g. 1st of month)"
                value={nextDate}
                onChange={(e) => setNextDate(e.target.value)}
                className="w-full bg-vault-surface border border-vault-rule rounded-lg px-2.5 py-1.5 text-xs text-vault-ink dark:text-vault-text font-mono focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-vault-reserveBlue hover:bg-vault-reserveBlueHover text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Recurring Payment</span>
          </button>
        </form>
      </div>
    </div>
  );
};

RecurringPaymentsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

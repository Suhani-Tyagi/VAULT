import React, { useState } from 'react';
import { CheckCircle2, Users, Send, AlertCircle, Plus, Check } from 'lucide-react';
import { useVault } from '../context/VaultContext';

export const SplitBillScreen = () => {
  const { user, friends, requestSplitBill } = useVault();

  const [billName, setBillName] = useState('Friday Dinner & Drinks');
  const [totalAmount, setTotalAmount] = useState('2400');
  const [selectedFriendIds, setSelectedFriendIds] = useState([friends[0].id, friends[1].id]); // Aditi & Rahul by default
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleFriend = (id) => {
    if (selectedFriendIds.includes(id)) {
      if (selectedFriendIds.length === 1) return; // Keep at least 1 friend
      setSelectedFriendIds(selectedFriendIds.filter(fId => fId !== id));
    } else {
      setSelectedFriendIds([...selectedFriendIds, id]);
    }
  };

  const parsedTotal = parseFloat(totalAmount) || 0;
  const numPeople = selectedFriendIds.length + 1; // Friends + Current User
  const perPerson = parsedTotal > 0 ? (parsedTotal / numPeople).toFixed(2) : 0;
  const amountToRequest = (perPerson * selectedFriendIds.length).toFixed(2);

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (parsedTotal <= 0) return;

    const ok = requestSplitBill(billName, parsedTotal, selectedFriendIds);
    if (ok) {
      setIsSubmitted(true);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setBillName('Coffee & Snacks');
    setTotalAmount('600');
  };

  if (isSubmitted) {
    return (
      <div className="space-y-4 animate-in fade-in zoom-in-95">
        <div className="bg-vault-surface border border-vault-border rounded-3xl p-6 text-center space-y-4 shadow-sm text-vault-charcoal dark:text-vault-text">
          <div className="w-16 h-16 bg-vault-tealLight border border-vault-teal/40 text-vault-teal rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-vault-charcoal dark:text-vault-text">Split Requests Sent</h3>
            <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-1">
              For <span className="font-bold text-vault-charcoal dark:text-vault-text">{billName}</span>
            </p>
          </div>

          <div className="text-2xl sm:text-3xl font-display font-extrabold text-vault-teal tabular-nums my-2">
            Requested ₹{amountToRequest} Total
          </div>

          <div className="p-3.5 bg-vault-paper border border-vault-border rounded-2xl text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-vault-muted dark:text-vault-mutedDark">Total Bill Amount</span>
              <span className="font-bold font-display tabular-nums text-vault-charcoal dark:text-vault-text">₹{parsedTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-vault-muted dark:text-vault-mutedDark">Your Share</span>
              <span className="font-bold font-display text-vault-bronze tabular-nums">₹{perPerson}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-vault-muted dark:text-vault-mutedDark">Friends Notified ({selectedFriendIds.length})</span>
              <span className="font-bold text-vault-charcoal dark:text-vault-text">₹{perPerson} / person</span>
            </div>
          </div>

          <p className="text-xs text-vault-muted dark:text-vault-mutedDark leading-relaxed">
            "Vault sent polite UPI request links to your friends. No awkward follow-ups needed."
          </p>

          <button
            onClick={resetForm}
            className="w-full py-3 bg-vault-bronze text-white font-bold text-xs rounded-xl hover:bg-vault-bronzeHover transition-colors shadow-xs"
          >
            Split Another Bill
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header title */}
      <div>
        <h2 className="text-xl font-bold text-vault-charcoal dark:text-vault-text tracking-tight">Split a Bill</h2>
        <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5">
          Fair cost splitting without awkward reminder texts
        </p>
      </div>

      <form onSubmit={handleRequestSubmit} className="space-y-4">
        {/* 1. Bill Details */}
        <div className="bg-vault-surface border border-vault-border rounded-2xl p-4 space-y-3 shadow-xs">
          <div>
            <label htmlFor="bill-description-input" className="text-xs font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider block mb-1">
              Bill Description
            </label>
            <input 
              id="bill-description-input"
              type="text"
              required
              value={billName}
              onChange={(e) => setBillName(e.target.value)}
              placeholder="e.g. Goa Airbnb, Weekend Dinner"
              className="w-full bg-vault-paper border border-vault-border rounded-xl px-3 py-2 text-xs text-vault-charcoal dark:text-vault-text placeholder-vault-muted focus:outline-none focus:border-vault-bronze"
            />
          </div>

          <div>
            <label htmlFor="bill-total-input" className="text-xs font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider block mb-1">
              Total Amount Paid (₹)
            </label>
            <div className="flex items-center bg-vault-paper border border-vault-border rounded-xl px-3 py-2 focus-within:border-vault-bronze">
              <span className="text-xl font-bold text-vault-bronze mr-1">₹</span>
              <input 
                id="bill-total-input"
                type="number"
                required
                min="1"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="0"
                className="w-full bg-transparent text-xl font-display font-bold text-vault-charcoal dark:text-vault-text focus:outline-none tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* 2. Select Friends */}
        <div className="bg-vault-surface border border-vault-border rounded-2xl p-4 space-y-3 shadow-xs">
          <div className="flex justify-between items-center text-xs">
            <label className="font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider">
              Select Friends to Split With
            </label>
            <span className="text-vault-bronze font-bold">
              {selectedFriendIds.length} Selected
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {friends.map(friend => {
              const isSelected = selectedFriendIds.includes(friend.id);
              return (
                <button
                  key={friend.id}
                  type="button"
                  aria-label={`Toggle friend ${friend.name} for bill split`}
                  onClick={() => toggleFriend(friend.id)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-all text-left ${
                    isSelected 
                      ? 'bg-vault-bronzeLight border-vault-bronze text-vault-charcoal dark:text-vault-text' 
                      : 'bg-vault-paper border-vault-border text-vault-muted dark:text-vault-mutedDark hover:border-vault-borderDark'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img 
                      src={friend.avatar} 
                      alt={`${friend.name}'s profile avatar`}
                      width={32}
                      height={32}
                      loading="lazy"
                      className="w-8 h-8 rounded-full object-cover shrink-0" 
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{friend.name}</p>
                      <p className="text-[10px] text-vault-muted dark:text-vault-mutedDark font-mono truncate">{friend.upiId}</p>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-vault-bronze text-white' : 'border border-vault-border'
                  }`}>
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Live Breakdown */}
        {parsedTotal > 0 && (
          <div className="bg-vault-surface border border-vault-border rounded-2xl p-4 space-y-2 text-xs shadow-xs">
            <h4 className="font-bold text-vault-charcoal dark:text-vault-text flex items-center gap-1.5">
              <Users className="w-4 h-4 text-vault-bronze" />
              <span>Equal Split Breakdown ({numPeople} people)</span>
            </h4>

            <div className="p-3 bg-vault-paper border border-vault-border rounded-xl space-y-1.5 font-medium">
              <div className="flex justify-between">
                <span className="text-vault-muted dark:text-vault-mutedDark">Your share ({user.name.split(' ')[0]})</span>
                <span className="font-bold text-vault-bronze font-display tabular-nums">₹{perPerson}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-vault-muted dark:text-vault-mutedDark">Request per friend ({selectedFriendIds.length} friends)</span>
                <span className="font-bold text-vault-teal font-display tabular-nums">₹{perPerson} each</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-vault-border">
                <span className="text-vault-muted dark:text-vault-mutedDark">Total to receive</span>
                <span className="font-bold text-vault-teal font-display tabular-nums">₹{amountToRequest}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action button */}
        <button
          type="submit"
          disabled={parsedTotal <= 0 || selectedFriendIds.length === 0}
          className="w-full py-3.5 bg-vault-bronze hover:bg-vault-bronzeHover disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Send Split Requests (₹{amountToRequest})</span>
        </button>
      </form>
    </div>
  );
};

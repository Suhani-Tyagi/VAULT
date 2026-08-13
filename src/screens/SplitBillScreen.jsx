import React, { useState } from 'react';
import { CheckCircle2, Users, Send, Check } from 'lucide-react';
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
      <div className="space-y-4 font-sans">
        <div className="bg-vault-surface border border-vault-rule rounded-xl p-6 text-center space-y-4 text-vault-ink dark:text-vault-text">
          <div className="w-12 h-12 bg-vault-emeraldLight text-vault-emerald rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-vault-ink dark:text-vault-text font-sans">Split Requests Sent</h3>
            <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5">
              Request for <span className="font-bold text-vault-ink dark:text-vault-text">{billName}</span>
            </p>
          </div>

          <div className="text-2xl sm:text-3xl font-mono font-bold text-vault-emerald tabular-nums my-2">
            ₹{amountToRequest} Total
          </div>

          <div className="p-3.5 bg-vault-paper border border-vault-rule rounded-lg text-left text-xs space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-vault-muted dark:text-vault-mutedDark">Total Bill Amount</span>
              <span className="font-bold tabular-nums text-vault-ink dark:text-vault-text">₹{parsedTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-vault-muted dark:text-vault-mutedDark">Your Share</span>
              <span className="font-bold text-vault-reserveBlue tabular-nums">₹{perPerson}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-vault-muted dark:text-vault-mutedDark">Friends Notified ({selectedFriendIds.length})</span>
              <span className="font-bold text-vault-ink dark:text-vault-text">₹{perPerson} / person</span>
            </div>
          </div>

          <button
            onClick={resetForm}
            className="w-full py-2 bg-vault-reserveBlue text-white font-mono font-bold text-xs rounded-lg hover:bg-vault-reserveBlueHover transition-colors"
          >
            Split Another Bill
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans">
      {/* Header title */}
      <div className="pb-2 border-b border-vault-rule">
        <h2 className="text-lg font-bold text-vault-ink dark:text-vault-text tracking-tight font-sans">Split a Bill</h2>
        <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5 font-mono">
          Calculate equal shares and notify group members
        </p>
      </div>

      <form onSubmit={handleRequestSubmit} className="space-y-4">
        {/* 1. Bill Details */}
        <div className="bg-vault-surface border border-vault-rule rounded-xl p-4 space-y-3">
          <div>
            <label htmlFor="bill-description-input" className="text-xs font-mono font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider block mb-1">
              Description
            </label>
            <input 
              id="bill-description-input"
              type="text"
              required
              value={billName}
              onChange={(e) => setBillName(e.target.value)}
              placeholder="e.g. Dinner, Rent share"
              className="w-full bg-vault-paper border border-vault-rule rounded-lg px-3 py-2 text-xs text-vault-ink dark:text-vault-text placeholder-vault-muted focus:outline-none focus:border-vault-reserveBlue font-mono"
            />
          </div>

          <div>
            <label htmlFor="bill-total-input" className="text-xs font-mono font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider block mb-1">
              Total Amount (₹)
            </label>
            <div className="flex items-center bg-vault-paper border border-vault-rule rounded-lg px-3 py-2 focus-within:border-vault-reserveBlue">
              <span className="font-serif text-xl font-bold text-vault-reserveBlue mr-2">₹</span>
              <input 
                id="bill-total-input"
                type="number"
                required
                min="1"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="0"
                className="w-full bg-transparent text-xl font-mono font-bold text-vault-ink dark:text-vault-text focus:outline-none tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* 2. Select Friends */}
        <div className="bg-vault-surface border border-vault-rule rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <label className="font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider">
              Group Members
            </label>
            <span className="text-vault-reserveBlue font-bold">
              {selectedFriendIds.length} Selected
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono">
            {friends.map(friend => {
              const isSelected = selectedFriendIds.includes(friend.id);
              return (
                <button
                  key={friend.id}
                  type="button"
                  aria-label={`Toggle friend ${friend.name} for bill split`}
                  onClick={() => toggleFriend(friend.id)}
                  className={`p-2.5 rounded-lg border flex items-center justify-between transition-colors text-left ${
                    isSelected 
                      ? 'bg-vault-surfaceHighlight border-vault-reserveBlue text-vault-ink dark:text-vault-text font-bold' 
                      : 'bg-vault-paper border-vault-rule text-vault-muted dark:text-vault-mutedDark hover:border-vault-muted'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img 
                      src={friend.avatar} 
                      alt={`${friend.name}'s profile avatar`}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover shrink-0 border border-vault-rule" 
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate font-sans">{friend.name}</p>
                      <p className="text-[10px] text-vault-muted dark:text-vault-mutedDark truncate">{friend.upiId}</p>
                    </div>
                  </div>

                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-vault-reserveBlue text-white' : 'border border-vault-rule'
                  }`}>
                    {isSelected && <Check className="w-2.5 h-2.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Live Breakdown */}
        {parsedTotal > 0 && (
          <div className="bg-vault-surface border border-vault-rule rounded-xl p-4 space-y-2 text-xs font-mono">
            <h4 className="font-bold text-vault-ink dark:text-vault-text flex items-center gap-1.5 font-sans">
              <Users className="w-4 h-4 text-vault-reserveBlue" />
              <span>Split Breakdown ({numPeople} people)</span>
            </h4>

            <div className="p-3 bg-vault-paper border border-vault-rule rounded-lg space-y-1.5 font-medium">
              <div className="flex justify-between">
                <span className="text-vault-muted dark:text-vault-mutedDark">Your share ({user.name.split(' ')[0]})</span>
                <span className="font-bold text-vault-reserveBlue tabular-nums">₹{perPerson}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-vault-muted dark:text-vault-mutedDark">Per friend ({selectedFriendIds.length} friends)</span>
                <span className="font-bold text-vault-emerald tabular-nums">₹{perPerson} each</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-vault-rule">
                <span className="text-vault-muted dark:text-vault-mutedDark">Total to receive</span>
                <span className="font-bold text-vault-emerald tabular-nums">₹{amountToRequest}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action button */}
        <button
          type="submit"
          disabled={parsedTotal <= 0 || selectedFriendIds.length === 0}
          className="w-full py-2.5 bg-vault-reserveBlue hover:bg-vault-reserveBlueHover disabled:opacity-50 text-white font-mono font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Request ₹{amountToRequest} Total</span>
        </button>
      </form>
    </div>
  );
};


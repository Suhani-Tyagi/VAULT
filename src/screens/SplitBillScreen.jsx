import React, { useState } from 'react';
import { CheckCircle2, Users, Send, Check } from 'lucide-react';
import { useVault } from '../context/VaultContext';

export const SplitBillScreen = () => {
  const { user, friends, requestSplitBill } = useVault();

  const [billName, setBillName] = useState('Friday Dinner & Drinks');
  const [totalAmount, setTotalAmount] = useState('3240');
  const [selectedFriendIds, setSelectedFriendIds] = useState([friends[0].id, friends[1].id, friends[2].id]); // Aditi, Rahul, Sneha
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
  const perPerson = parsedTotal > 0 ? (parsedTotal / numPeople) : 0;
  const userShare = perPerson;
  const othersShare = parsedTotal - userShare;

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
      <div className="space-y-4 font-sans max-w-xl mx-auto">
        <div className="bg-vault-surface border border-vault-rule rounded-xl p-6 text-center space-y-4 text-vault-ink dark:text-vault-text">
          <div className="w-12 h-12 bg-vault-emeraldLight text-vault-emerald rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-vault-ink dark:text-vault-text font-sans">Split Requests Sent</h3>
            <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5 font-mono">
              Bill split registered for <span className="font-bold text-vault-ink dark:text-vault-text font-sans">{billName}</span>
            </p>
          </div>

          {/* Instant Financial Math Header */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-vault-paper border border-vault-rule rounded-lg text-center font-mono">
            <div>
              <p className="text-[10px] text-vault-muted dark:text-vault-mutedDark uppercase">TOTAL</p>
              <p className="text-sm font-bold text-vault-ink dark:text-vault-text tabular-nums">₹{parsedTotal.toLocaleString('en-IN')}</p>
            </div>
            <div className="border-x border-vault-rule">
              <p className="text-[10px] text-vault-muted dark:text-vault-mutedDark uppercase">YOU</p>
              <p className="text-sm font-bold text-vault-reserveBlue tabular-nums">₹{userShare.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            </div>
            <div>
              <p className="text-[10px] text-vault-muted dark:text-vault-mutedDark uppercase">OTHERS</p>
              <p className="text-sm font-bold text-vault-emerald tabular-nums">₹{othersShare.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            </div>
          </div>

          <button
            onClick={resetForm}
            className="w-full py-2.5 bg-vault-reserveBlue text-white font-mono font-bold text-xs rounded-lg hover:bg-vault-reserveBlueHover transition-colors"
          >
            Split Another Bill
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans max-w-2xl mx-auto">
      {/* Header title */}
      <div className="pb-3 border-b border-vault-rule">
        <h2 className="text-lg font-bold text-vault-ink dark:text-vault-text tracking-tight font-sans">Split Bill</h2>
        <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5 font-mono">
          Equal math breakdown and request notifications
        </p>
      </div>

      {/* INSTANT FINANCIAL MATH HEADER */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-vault-surface border border-vault-rule rounded-xl text-center font-mono">
        <div>
          <span className="text-[10px] text-vault-muted dark:text-vault-mutedDark font-bold uppercase tracking-wider block">
            TOTAL
          </span>
          <span className="text-lg sm:text-xl font-bold text-vault-ink dark:text-vault-text tabular-nums">
            ₹{parsedTotal.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="border-x border-vault-rule px-2">
          <span className="text-[10px] text-vault-muted dark:text-vault-mutedDark font-bold uppercase tracking-wider block">
            YOU
          </span>
          <span className="text-lg sm:text-xl font-bold text-vault-reserveBlue tabular-nums">
            ₹{userShare.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-vault-muted dark:text-vault-mutedDark font-bold uppercase tracking-wider block">
            OTHERS
          </span>
          <span className="text-lg sm:text-xl font-bold text-vault-emerald tabular-nums">
            ₹{othersShare.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>

      <form onSubmit={handleRequestSubmit} className="space-y-4">
        {/* Bill Input Rows */}
        <div className="bg-vault-surface border border-vault-rule rounded-xl p-4 space-y-3 font-mono text-xs">
          <div>
            <label htmlFor="bill-description-input" className="font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider block mb-1">
              Bill Description
            </label>
            <input 
              id="bill-description-input"
              type="text"
              required
              value={billName}
              onChange={(e) => setBillName(e.target.value)}
              placeholder="e.g. Dinner & drinks, House rent"
              className="w-full bg-vault-paper border border-vault-rule rounded-lg px-3 py-2 text-xs text-vault-ink dark:text-vault-text placeholder-vault-muted focus:outline-none focus:border-vault-reserveBlue font-mono"
            />
          </div>

          <div>
            <label htmlFor="bill-total-input" className="font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider block mb-1">
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

        {/* Member Selection Tiles & Status Rows */}
        <div className="bg-vault-surface border border-vault-rule rounded-xl p-4 space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center">
            <label className="font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider">
              PARTICIPANTS ({numPeople})
            </label>
            <span className="text-vault-reserveBlue font-bold">
              ₹{perPerson.toLocaleString('en-IN', { maximumFractionDigits: 0 })} / person
            </span>
          </div>

          {/* User Row (You - Paid) */}
          <div className="p-2.5 bg-vault-paper border border-vault-rule rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img 
                src={user.profilePic} 
                alt={user.name} 
                className="w-7 h-7 rounded-full object-cover border border-vault-rule"
              />
              <div>
                <p className="font-bold text-vault-ink dark:text-vault-text font-sans">{user.name} (You)</p>
                <p className="text-[10px] text-vault-muted dark:text-vault-mutedDark">Paid entire bill</p>
              </div>
            </div>
            <span className="text-xs font-bold text-vault-reserveBlue tabular-nums">
              Your Share: ₹{userShare.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
          </div>

          {/* Friends Rows (Pending Share) */}
          <div className="space-y-1.5 pt-1">
            {friends.map(friend => {
              const isSelected = selectedFriendIds.includes(friend.id);
              return (
                <div
                  key={friend.id}
                  onClick={() => toggleFriend(friend.id)}
                  className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-vault-paper border-vault-reserveBlue text-vault-ink dark:text-vault-text font-bold' 
                      : 'bg-vault-paper/40 border-vault-rule text-vault-muted opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={friend.avatar} 
                      alt={friend.name}
                      className="w-7 h-7 rounded-full object-cover border border-vault-rule"
                    />
                    <div>
                      <p className="font-bold font-sans text-xs">{friend.name}</p>
                      <p className="text-[10px] text-vault-muted dark:text-vault-mutedDark">{friend.upiId}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isSelected ? (
                      <span className="text-xs text-vault-emerald font-bold tabular-nums">
                        Pending: ₹{perPerson.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                    ) : (
                      <span className="text-[11px] text-vault-muted">Excluded</span>
                    )}

                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-vault-reserveBlue text-white' : 'border border-vault-rule'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Request Button */}
        <button
          type="submit"
          disabled={parsedTotal <= 0 || selectedFriendIds.length === 0}
          className="w-full py-3 bg-vault-reserveBlue hover:bg-vault-reserveBlueHover disabled:opacity-50 text-white font-mono font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Send Split Requests (₹{othersShare.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Total)</span>
        </button>
      </form>
    </div>
  );
};



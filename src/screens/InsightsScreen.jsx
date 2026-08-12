import React, { useState } from 'react';
import { PieChart as PieIcon, TrendingUp, ShieldCheck, ArrowDownRight, ArrowUpRight, Coffee, ShoppingBag, Utensils, Zap, Tv, Home } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useVault } from '../context/VaultContext';
import { CategoryIcon } from '../components/CategoryIcon';

export const InsightsScreen = () => {
  const { user, transactions } = useVault();
  const [activeTimeframe, setActiveTimeframe] = useState('Month');

  // Compute category totals dynamically
  const categoryTotals = transactions
    .filter(t => t.type === 'debit')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieColors = {
    'Food & Dining': '#D97706',   // Saffron Bronze
    'Groceries': '#0F766E',       // Mineral Teal
    'Subscriptions': '#B45309',   // Deep Bronze
    'Transport': '#14B8A6',       // Bright Teal
    'Rent': '#0284C7',            // Mineral Blue
    'Shopping': '#F59E0B',        // Amber
  };

  const chartData = Object.keys(categoryTotals).map(cat => ({
    name: cat,
    value: categoryTotals[cat],
    color: pieColors[cat] || '#64748B'
  }));

  const totalSpent = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      {/* Header title */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-vault-charcoal dark:text-vault-text tracking-tight">Spending Insights</h2>
          <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5">
            Clear visual breakdowns with zero jargon
          </p>
        </div>

        {/* Timeframe Pill Switcher */}
        <div className="flex bg-vault-paper border border-vault-border rounded-xl p-0.5 text-xs font-bold">
          {['Week', 'Month', 'Year'].map(tf => (
            <button
              key={tf}
              type="button"
              aria-label={`Show insights for ${tf}`}
              onClick={() => setActiveTimeframe(tf)}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTimeframe === tf 
                  ? 'bg-vault-bronze text-white shadow-xs' 
                  : 'text-vault-muted dark:text-vault-mutedDark hover:text-vault-charcoal dark:hover:text-vault-text'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Monthly Summary Hero Card */}
      <div className="bg-vault-surface border border-vault-border rounded-2xl p-4 flex justify-between items-center shadow-xs">
        <div>
          <p className="text-xs text-vault-muted dark:text-vault-mutedDark font-medium">Total Outflow ({activeTimeframe})</p>
          <h3 className="text-2xl font-display font-extrabold text-vault-bronze tabular-nums mt-0.5">
            ₹{totalSpent.toLocaleString('en-IN')}
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-vault-teal bg-vault-tealLight px-2.5 py-1 rounded-full border border-vault-teal/30 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> 12% lower than last month
          </span>
        </div>
      </div>

      {/* Category Breakdown Donut Chart */}
      <div className="bg-vault-surface border border-vault-border rounded-2xl p-4 space-y-3 shadow-xs">
        <h3 className="text-xs font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider">
          Where Your Money Went
        </h3>

        <div className="h-52 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#161B22" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(val) => `₹${val.toLocaleString('en-IN')}`}
                contentStyle={{ 
                  backgroundColor: '#161B22', 
                  borderColor: '#21262D', 
                  borderRadius: '12px',
                  color: '#F8FAFC',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[10px] text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider font-bold">Total Spent</span>
            <span className="text-base font-display font-extrabold text-vault-charcoal dark:text-vault-text tabular-nums">
              ₹{totalSpent.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Category Legend List */}
        <div className="space-y-2 pt-2 border-t border-vault-border">
          {chartData.map(cat => {
            const percent = Math.round((cat.value / totalSpent) * 100);
            return (
              <div key={cat.name} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="font-bold text-vault-charcoal dark:text-vault-text">{cat.name}</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-vault-muted dark:text-vault-mutedDark">{percent}%</span>
                  <span className="font-bold text-vault-charcoal dark:text-vault-text tabular-nums w-16 text-right">
                    ₹{cat.value.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Financial Health Status Footnote */}
      <div className="p-4 rounded-2xl bg-vault-surface border-l-4 border-l-vault-teal border-y border-r border-vault-border text-xs text-vault-muted dark:text-vault-mutedDark leading-relaxed">
        <p className="flex items-center gap-1.5 text-vault-charcoal dark:text-vault-text font-bold mb-0.5">
          <ShieldCheck className="w-4 h-4 text-vault-teal shrink-0" />
          Healthy Cashflow Status
        </p>
        Your essential fixed expenses (rent & bills) account for 38% of your income. You have healthy breathing room in your safe-to-spend balance.
      </div>
    </div>
  );
};

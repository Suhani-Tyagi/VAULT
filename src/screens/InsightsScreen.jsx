import React, { useState } from 'react';
import { TrendingUp, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useVault } from '../context/VaultContext';

export const InsightsScreen = () => {
  const { transactions } = useVault();
  const [activeTimeframe, setActiveTimeframe] = useState('Month');

  // Compute category totals dynamically
  const categoryTotals = transactions
    .filter(t => t.type === 'debit')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieColors = {
    'Food & Dining': '#1E3A8A',   
    'Groceries': '#047857',       
    'Subscriptions': '#3B82F6',   
    'Transport': '#14B8A6',       
    'Rent': '#0284C7',            
    'Shopping': '#D97706',        
  };

  const chartData = Object.keys(categoryTotals).map(cat => ({
    name: cat,
    value: categoryTotals[cat],
    color: pieColors[cat] || '#6B7280'
  }));

  const totalSpent = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4 font-sans">
      {/* Header title */}
      <div className="flex justify-between items-start pb-3 border-b border-vault-rule">
        <div>
          <h2 className="text-lg font-bold text-vault-ink dark:text-vault-text tracking-tight font-sans">Spending Insights</h2>
          <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5 font-mono">
            Category distribution and spending trends
          </p>
        </div>

        {/* Timeframe Switcher */}
        <div className="flex bg-vault-paper border border-vault-rule rounded-lg p-0.5 text-xs font-mono font-medium">
          {['Week', 'Month', 'Year'].map(tf => (
            <button
              key={tf}
              type="button"
              aria-label={`Show insights for ${tf}`}
              onClick={() => setActiveTimeframe(tf)}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTimeframe === tf 
                  ? 'bg-vault-reserveBlue text-white font-bold' 
                  : 'text-vault-muted dark:text-vault-mutedDark hover:text-vault-ink dark:hover:text-vault-text'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Monthly Summary Hero Card */}
      <div className="bg-vault-surface border border-vault-rule rounded-xl p-4 flex justify-between items-center font-mono">
        <div>
          <p className="text-xs text-vault-muted dark:text-vault-mutedDark font-medium">Total Outflow ({activeTimeframe})</p>
          <h3 className="text-2xl font-mono font-bold text-vault-reserveBlue tabular-nums mt-0.5">
            ₹{totalSpent.toLocaleString('en-IN')}
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold text-vault-emerald bg-vault-emeraldLight px-2.5 py-1 rounded border border-vault-emerald/20 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> 12% lower than last month
          </span>
        </div>
      </div>

      {/* Category Breakdown Donut Chart */}
      <div className="bg-vault-surface border border-vault-rule rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-mono font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider">
          Category Distribution
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
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#141820" strokeWidth={1.5} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(val) => `₹${val.toLocaleString('en-IN')}`}
                contentStyle={{ 
                  backgroundColor: '#141820', 
                  borderColor: '#1F2937', 
                  borderRadius: '6px',
                  color: '#F3F4F6',
                  fontSize: '12px',
                  fontFamily: 'DM Mono, monospace',
                  fontWeight: 'bold'
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center font-mono">
            <span className="text-[10px] text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider font-bold">Total Spent</span>
            <span className="text-base font-bold text-vault-ink dark:text-vault-text tabular-nums">
              ₹{totalSpent.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Category Legend List */}
        <div className="space-y-2 pt-2 border-t border-vault-rule">
          {chartData.map(cat => {
            const percent = Math.round((cat.value / totalSpent) * 100);
            return (
              <div key={cat.name} className="flex justify-between items-center text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="font-bold text-vault-ink dark:text-vault-text font-sans">{cat.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-vault-muted dark:text-vault-mutedDark">{percent}%</span>
                  <span className="font-bold text-vault-ink dark:text-vault-text tabular-nums w-16 text-right">
                    ₹{cat.value.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Financial Health Status Footnote */}
      <div className="p-3.5 rounded-lg bg-vault-surface border-l-2 border-l-vault-emerald border-t border-b border-r border-vault-rule text-xs text-vault-muted dark:text-vault-mutedDark leading-relaxed">
        <p className="flex items-center gap-1.5 text-vault-ink dark:text-vault-text font-bold mb-0.5 font-sans">
          <ShieldCheck className="w-4 h-4 text-vault-emerald shrink-0" />
          Budget Allocation
        </p>
        Fixed essential expenses (rent & recurring bills) represent 38% of monthly cashflow, maintaining clear liquid reserves.
      </div>
    </div>
  );
};


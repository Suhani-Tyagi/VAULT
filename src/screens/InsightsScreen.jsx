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
    'Food & Dining': '#C85A32',   
    'Groceries': '#15803D',       
    'Subscriptions': '#78716C',   
    'Transport': '#D97706',       
    'Rent': '#44403C',            
    'Shopping': '#B91C1C',        
  };

  const chartData = Object.keys(categoryTotals).map(cat => ({
    name: cat,
    value: categoryTotals[cat],
    color: pieColors[cat] || '#78716C'
  }));

  const totalSpent = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6 font-sans">
      {/* Header title */}
      <div className="flex justify-between items-start pb-3 border-b border-vault-rule">
        <div>
          <h2 className="text-lg font-bold text-vault-ink dark:text-vault-text tracking-tight font-sans">Spending Insights</h2>
          <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5 font-mono">
            Category distribution & outflow analysis
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

      {/* Primary Financial Summary Block */}
      <div className="space-y-2 pt-1">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-vault-muted dark:text-vault-mutedDark">
          SPENDING THIS {activeTimeframe.toUpperCase()}
        </span>
        <div className="flex items-baseline gap-3">
          <div className="text-3xl sm:text-4xl font-mono font-bold text-vault-ink dark:text-vault-text tracking-tight tabular-nums">
            ₹{totalSpent.toLocaleString('en-IN')}
          </div>
          <span className="text-xs font-mono font-bold text-vault-emerald bg-vault-emeraldLight px-2.5 py-0.5 rounded border border-vault-emerald/20 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +4.8% vs last month
          </span>
        </div>
      </div>

      {/* Single Primary Chart Block */}
      <div className="bg-vault-surface border border-vault-rule rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-mono font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider">
          Category Distribution
        </h3>

        <div className="h-48 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#1C1917" strokeWidth={1} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(val) => `₹${val.toLocaleString('en-IN')}`}
                contentStyle={{ 
                  backgroundColor: '#1C1917', 
                  borderColor: '#292524', 
                  borderRadius: '6px',
                  color: '#F5F5F4',
                  fontSize: '12px',
                  fontFamily: 'DM Mono, monospace',
                  fontWeight: 'bold'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Categories Horizontal Bars */}
        <div className="space-y-3 pt-3 border-t border-vault-rule font-mono text-xs">
          {chartData.map(cat => {
            const percent = totalSpent > 0 ? Math.round((cat.value / totalSpent) * 100) : 0;
            return (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-vault-ink dark:text-vault-text font-sans">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-vault-muted dark:text-vault-mutedDark">{percent}%</span>
                    <span className="font-bold text-vault-ink dark:text-vault-text tabular-nums w-16 text-right">
                      ₹{cat.value.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-vault-surfaceHighlight rounded-full h-1.5 overflow-hidden border border-vault-rule">
                  <div 
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percent}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Financial Health Status Footnote */}
      <div className="p-3.5 rounded-lg bg-vault-surface border-l-2 border-l-vault-reserveBlue border-t border-b border-r border-vault-rule text-xs text-vault-muted dark:text-vault-mutedDark leading-relaxed font-mono">
        <p className="flex items-center gap-1.5 text-vault-ink dark:text-vault-text font-bold mb-0.5 font-sans">
          <ShieldCheck className="w-4 h-4 text-vault-reserveBlue shrink-0" />
          Budget Allocation
        </p>
        Fixed essential expenses (rent & recurring subscriptions) account for 38% of monthly cashflow.
      </div>
    </div>
  );
};



import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingDown } from 'lucide-react';
import { useVault } from '../context/VaultContext';

export const InsightsScreen = () => {
  const { insights } = useVault();

  const data = insights.categoryBreakdown;

  return (
    <div className="space-y-4">
      {/* Header title */}
      <div>
        <h2 className="text-xl font-bold text-vault-charcoal dark:text-vault-text tracking-tight">Spending Insights</h2>
        <p className="text-xs text-vault-muted dark:text-vault-mutedDark mt-0.5">
          August 2026 summary • Plain-English overview
        </p>
      </div>

      {/* 1. Core One-Sentence Human Comparative Insight */}
      <div className="bg-vault-surface border border-vault-terracotta/40 rounded-2xl p-4 space-y-2 shadow-xs text-vault-charcoal dark:text-vault-text">
        <div className="flex items-center gap-2 text-xs font-bold text-vault-terracotta">
          <TrendingDown className="w-4 h-4" />
          <span>Monthly Comparative Summary</span>
        </div>

        <p className="text-xs text-vault-charcoal dark:text-vault-text font-medium leading-relaxed">
          "{insights.comparisonSentence}"
        </p>

        <div className="flex gap-4 pt-2 border-t border-vault-border text-xs">
          <div>
            <span className="text-vault-muted dark:text-vault-mutedDark block text-[10px] uppercase font-bold">August Spend</span>
            <span className="font-display font-bold text-vault-charcoal dark:text-vault-text text-sm tabular-nums">
              ₹{insights.currentMonthTotal.toLocaleString('en-IN')}
            </span>
          </div>

          <div>
            <span className="text-vault-muted dark:text-vault-mutedDark block text-[10px] uppercase font-bold">July Spend</span>
            <span className="font-display font-bold text-vault-muted dark:text-vault-mutedDark text-sm tabular-nums">
              ₹{insights.lastMonthTotal.toLocaleString('en-IN')}
            </span>
          </div>

          <div>
            <span className="text-vault-muted dark:text-vault-mutedDark block text-[10px] uppercase font-bold">Net Savings</span>
            <span className="font-display font-bold text-vault-terracotta text-sm tabular-nums flex items-center">
              -₹{(insights.lastMonthTotal - insights.currentMonthTotal).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Category Distribution Donut Chart */}
      <div className="bg-vault-surface border border-vault-border rounded-2xl p-4 space-y-3 shadow-xs">
        <h3 className="text-xs font-bold text-vault-muted dark:text-vault-mutedDark uppercase tracking-wider">
          Category Distribution
        </h3>

        <div className="h-52 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="amount"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#FAF7F2" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
                contentStyle={{
                  backgroundColor: '#121723',
                  borderColor: '#232E42',
                  borderRadius: '12px',
                  color: '#F5F0E8',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[10px] text-vault-muted dark:text-vault-mutedDark font-bold uppercase">Total Outflow</span>
            <span className="text-base font-display font-bold text-vault-charcoal dark:text-vault-text tabular-nums">
              ₹{insights.currentMonthTotal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Category List Items */}
        <div className="space-y-2 pt-2 border-t border-vault-border">
          {data.map((item) => (
            <div key={item.category} className="flex justify-between items-center text-xs p-1.5 rounded-xl hover:bg-vault-surfaceHighlight">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-3 h-3 rounded-full shrink-0" 
                  style={{ backgroundColor: item.color }} 
                />
                <span className="font-bold text-vault-charcoal dark:text-vault-text">{item.category}</span>
              </div>

              <div className="text-right flex items-center gap-3">
                <span className="text-vault-muted dark:text-vault-mutedDark font-mono text-[11px]">{item.percent}%</span>
                <span className="font-display font-bold text-vault-charcoal dark:text-vault-text tabular-nums">
                  ₹{item.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calm Financial Health Note */}
      <div className="p-3.5 bg-vault-paper border border-vault-border rounded-2xl text-xs text-vault-muted dark:text-vault-mutedDark leading-relaxed">
        <p className="font-bold text-vault-charcoal dark:text-vault-text mb-0.5">Budget Health Status: Optimal</p>
        Your housing and recurring bills account for 72% of total monthly outflow. Disposable discretionary spending remains within safe thresholds.
      </div>
    </div>
  );
};

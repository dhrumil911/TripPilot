import React, { useState, useEffect } from 'react';
import { PieChart, Info, RefreshCw, AlertTriangle } from 'lucide-react';
import api from '../api/axios';
import { formatCurrency } from '../utils/currency';

interface BudgetBreakdownProps {
  tripId: string;
  refreshTrigger: number;
}

interface BreakdownDetails {
  totalSpend: string;
  durationDays: number;
  averageCostPerDay: string;
  currency: string;
  categories: {
    transport: string;
    stay: string;
    activity: string;
    meal: string;
    other: string;
  };
}

export const BudgetBreakdown: React.FC<BudgetBreakdownProps> = ({ tripId, refreshTrigger }) => {
  const [breakdown, setBreakdown] = useState<BreakdownDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBreakdown();
  }, [tripId, refreshTrigger]);

  const fetchBreakdown = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/trips/${tripId}/budget-breakdown`);
      setBreakdown(response.data.budgetBreakdown);
    } catch (err: any) {
      console.error(err);
      setError('Failed to calculate budget aggregates.');
    } finally {
      setLoading(false);
    }
  };

  const getPercentage = (valueStr: string, totalStr: string) => {
    const value = parseFloat(valueStr);
    const total = parseFloat(totalStr);
    if (isNaN(value) || isNaN(total) || total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  // Color config using the design system palette
  const categoryConfig: Record<string, { label: string; color: string; bg: string }> = {
    transport: { label: 'Transport', color: 'bg-teal', bg: 'bg-teal/5' },
    stay: { label: 'Stay & Lodging', color: 'bg-coral', bg: 'bg-coral/5' },
    activity: { label: 'Activities', color: 'bg-charcoal', bg: 'bg-charcoal/5' },
    meal: { label: 'Meals & Dining', color: 'bg-sand', bg: 'bg-sand-light' },
    other: { label: 'Others', color: 'bg-gray-400', bg: 'bg-gray-100' },
  };

  if (error) {
    return (
      <div className="bg-coral/5 text-coral text-xs p-4 rounded-xl border border-coral/20 flex items-center space-x-2">
        <Info className="h-4.5 w-4.5" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-paper rounded-xl border border-sand p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-sand pb-3">
        <h2 className="text-base font-bold text-charcoal flex items-center space-x-2">
          <PieChart className="h-4.5 w-4.5 text-teal" />
          <span className="font-editorial font-bold text-lg text-charcoal">Expenses Summary</span>
        </h2>
        <button
          onClick={fetchBreakdown}
          disabled={loading}
          className="text-charcoal-muted hover:text-teal p-1 hover:bg-sand-light rounded-md transition-colors"
          title="Refresh breakdown"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading && !breakdown ? (
        <p className="text-center text-charcoal-muted text-xs animate-pulse py-8">Calculating splits...</p>
      ) : !breakdown || parseFloat(breakdown.totalSpend) === 0 ? (
        <p className="text-center text-charcoal-muted text-xs py-8">No expenses logged yet. Add your costs to see category summaries.</p>
      ) : (
        <div className="space-y-6">
          
          {/* Key metrics grid */}
          <div className="grid grid-cols-2 gap-4 bg-sand-light/60 p-4 rounded-xl border border-sand">
            <div>
              <span className="block text-[9px] font-bold text-charcoal-muted uppercase tracking-wider">Total Expenses</span>
              <span className="text-xl font-black text-charcoal flex items-center mt-1">
                <span>{formatCurrency(breakdown.totalSpend)}</span>
                <span className="text-[9px] text-charcoal-muted uppercase font-bold ml-1.5">{breakdown.currency || 'INR'}</span>
              </span>
            </div>
            <div>
              <span className="block text-[9px] font-bold text-charcoal-muted uppercase tracking-wider">Average / Day</span>
              <span className="text-xl font-black text-coral flex items-center mt-1">
                <span>{formatCurrency(breakdown.averageCostPerDay)}</span>
                <span className="text-[9px] text-charcoal-muted uppercase font-bold ml-1.5">/ day</span>
              </span>
            </div>
          </div>

          {/* Graphical splits list */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider border-b border-sand pb-1.5">Category Splits</h3>
            
            <div className="space-y-4">
              {Object.entries(breakdown.categories).map(([key, value]) => {
                const percent = getPercentage(value, breakdown.totalSpend);
                const config = categoryConfig[key];
                
                return (
                  <div key={key} className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-charcoal-muted">{config.label}</span>
                      <div className="flex items-center space-x-2 font-bold">
                        <span className="text-charcoal">{formatCurrency(value)}</span>
                        <span className="text-gray-400 font-normal">({percent}%)</span>
                      </div>
                    </div>
                    {/* Horizontal Bar */}
                    <div className="w-full bg-sand-light h-2 rounded-full overflow-hidden border border-sand/40">
                      <div
                        className={`h-full ${config.color} transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pie Chart & Alerts */}
            <div className="mt-8 pt-6 border-t border-sand space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <h3 className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider self-start">Visual Distribution</h3>
                
                {(() => {
                  const tPct = getPercentage(breakdown.categories.transport, breakdown.totalSpend);
                  const sPct = getPercentage(breakdown.categories.stay, breakdown.totalSpend);
                  const aPct = getPercentage(breakdown.categories.activity, breakdown.totalSpend);
                  const mPct = getPercentage(breakdown.categories.meal, breakdown.totalSpend);
                  const oPct = getPercentage(breakdown.categories.other, breakdown.totalSpend);
                  
                  let conicGradient = '#e5e7eb 0% 100%';
                  const total = parseFloat(breakdown.totalSpend);
                  if (total > 0) {
                    conicGradient = `conic-gradient(
                      #1B3B2B 0% ${tPct}%, 
                      #D46241 ${tPct}% ${tPct+sPct}%, 
                      #8B7355 ${tPct+sPct}% ${tPct+sPct+aPct}%, 
                      #6B8E6B ${tPct+sPct+aPct}% ${tPct+sPct+aPct+mPct}%, 
                      #A0A0A0 ${tPct+sPct+aPct+mPct}% 100%
                    )`;
                  }

                  return (
                    <>
                      <div className="relative">
                        <div style={{ background: conicGradient, width: 160, height: 160, borderRadius: '50%' }} />
                        {total === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-full" style={{ width: 160, height: 160 }}>
                            <span className="text-xs text-charcoal-muted font-bold">No Data</span>
                          </div>
                        )}
                      </div>
                      
                      {total > 0 && (
                        <div className="flex flex-wrap justify-center gap-3 text-[10px] font-bold mt-2">
                          <div className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-[#1B3B2B]"></span><span>Transport {tPct}%</span></div>
                          <div className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-[#D46241]"></span><span>Stay {sPct}%</span></div>
                          <div className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-[#8B7355]"></span><span>Activities {aPct}%</span></div>
                          <div className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-[#6B8E6B]"></span><span>Meals {mPct}%</span></div>
                          <div className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-[#A0A0A0]"></span><span>Other {oPct}%</span></div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              <div className="space-y-2">
                {Object.entries(breakdown.categories).map(([key, value]) => {
                  const percent = getPercentage(value, breakdown.totalSpend);
                  if (percent > 40) {
                    const config = categoryConfig[key];
                    return (
                      <div key={`alert-${key}`} className="flex items-center space-x-2 bg-amber-50 border-l-2 border-amber-500 text-amber-700 p-3 rounded text-xs mt-3">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>High concentration: <strong>{config.label}</strong> accounts for {percent}% of your budget</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

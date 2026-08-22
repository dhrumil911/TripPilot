import React, { useState, useEffect } from 'react';
import { DollarSign, PieChart, Info, RefreshCw } from 'lucide-react';
import api from '../api/axios';

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
                <DollarSign className="h-5 w-5 text-gray-500 -ml-1 shrink-0" />
                <span>{parseFloat(breakdown.totalSpend).toFixed(0)}</span>
                <span className="text-[9px] text-charcoal-muted uppercase font-bold ml-1.5">{breakdown.currency}</span>
              </span>
            </div>
            <div>
              <span className="block text-[9px] font-bold text-charcoal-muted uppercase tracking-wider">Average / Day</span>
              <span className="text-xl font-black text-coral flex items-center mt-1">
                <DollarSign className="h-5 w-5 text-coral/80 -ml-1 shrink-0" />
                <span>{parseFloat(breakdown.averageCostPerDay).toFixed(0)}</span>
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
                        <span className="text-charcoal">${parseFloat(value).toFixed(0)}</span>
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
          </div>
        </div>
      )}
    </div>
  );
};

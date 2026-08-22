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

  const categoryConfig: Record<string, { label: string; color: string; bg: string }> = {
    transport: { label: 'Transport', color: 'bg-blue-500', bg: 'bg-blue-50' },
    stay: { label: 'Stay', color: 'bg-purple-500', bg: 'bg-purple-50' },
    activity: { label: 'Activities', color: 'bg-orange-500', bg: 'bg-orange-50' },
    meal: { label: 'Meals', color: 'bg-green-500', bg: 'bg-green-50' },
    other: { label: 'Others', color: 'bg-gray-500', bg: 'bg-gray-50' },
  };

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 text-xs p-4 rounded-xl border border-red-100 flex items-center space-x-2">
        <Info className="h-4.5 w-4.5" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-50 pb-3">
        <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
          <PieChart className="h-5 w-5 text-blue-600" />
          <span>Trip Cost Breakdown</span>
        </h2>
        <button
          onClick={fetchBreakdown}
          disabled={loading}
          className="text-gray-400 hover:text-blue-600 p-1 hover:bg-gray-50 rounded-md transition-colors"
          title="Refresh breakdown"
        >
          <RefreshCw className={`h-4.5 w-4.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading && !breakdown ? (
        <p className="text-center text-gray-500 text-sm animate-pulse py-8">Calculating splits...</p>
      ) : !breakdown || parseFloat(breakdown.totalSpend) === 0 ? (
        <p className="text-center text-gray-500 text-sm py-12">No expenses logged yet. Add your transport, stay, or activity costs to see aggregates.</p>
      ) : (
        <div className="space-y-6">
          {/* Key metrics grid */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
              <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Expenses</span>
              <span className="text-xl font-black text-gray-900 flex items-center mt-1">
                <DollarSign className="h-5.5 w-5.5 text-gray-700 -ml-1 shrink-0" />
                <span>{parseFloat(breakdown.totalSpend).toFixed(2)}</span>
                <span className="text-[10px] text-gray-500 uppercase font-extrabold ml-1.5">{breakdown.currency}</span>
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Average / Day</span>
              <span className="text-xl font-black text-blue-600 flex items-center mt-1">
                <DollarSign className="h-5.5 w-5.5 text-blue-500 -ml-1 shrink-0" />
                <span>{parseFloat(breakdown.averageCostPerDay).toFixed(2)}</span>
                <span className="text-[10px] text-gray-500 uppercase font-extrabold ml-1.5">/ day</span>
              </span>
            </div>
          </div>

          {/* Graphical splits list */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-50 pb-1.5">Category Splits</h3>
            
            <div className="space-y-4.5">
              {Object.entries(breakdown.categories).map(([key, value]) => {
                const percent = getPercentage(value, breakdown.totalSpend);
                const config = categoryConfig[key];
                
                return (
                  <div key={key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-700">{config.label}</span>
                      <div className="flex items-center space-x-2 font-medium">
                        <span className="text-gray-900 font-bold">${parseFloat(value).toFixed(2)}</span>
                        <span className="text-gray-400">({percent}%)</span>
                      </div>
                    </div>
                    {/* Horizontal Bar */}
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
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

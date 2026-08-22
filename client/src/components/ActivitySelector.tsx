import React, { useState, useEffect } from 'react';
import { Search, X, Loader2, Sparkles, Plus, Clock, DollarSign } from 'lucide-react';
import api from '../api/axios';

interface ActivitySelectorProps {
  stopId: string;
  isOpen: boolean;
  onClose: () => void;
  onAttachSuccess: () => void;
}

interface MockActivity {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedCost: string;
  durationMinutes: number;
}

export const ActivitySelector: React.FC<ActivitySelectorProps> = ({ stopId, isOpen, onClose, onAttachSuccess }) => {
  const [query, setQuery] = useState('');
  const [activities, setActivities] = useState<MockActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [attachingId, setAttachingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchMockActivities('');
    }
  }, [isOpen]);

  const fetchMockActivities = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/search/activities?query=${searchQuery}`);
      setActivities(response.data.activities);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch mock activities.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMockActivities(query);
  };

  const handleAttach = async (act: MockActivity) => {
    setAttachingId(act.id);
    setError('');
    try {
      await api.post(`/stops/${stopId}/activities`, {
        name: act.name,
        description: act.description,
        category: act.category,
        estimatedCost: act.estimatedCost,
        durationMinutes: act.durationMinutes,
      });

      onAttachSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to attach activity.');
    } finally {
      setAttachingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
              <span>Explore Activities</span>
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-50 p-1.5 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search Form */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search sightseeing, food tours..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
              <Search className="absolute left-3.5 h-4.5 w-4.5 text-gray-400" />
            </form>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded text-xs">
                <span>{error}</span>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-2">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                <span className="text-gray-500 text-xs font-semibold">Browsing travel catalog...</span>
              </div>
            ) : activities.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-12">No activities found. Try searching for "sushi" or "museum".</p>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="border border-gray-100 rounded-xl p-4 space-y-3 hover:border-blue-100 hover:shadow-sm transition-all flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-gray-900 text-sm">{act.name}</h3>
                      <span className="text-[10px] bg-blue-50 text-blue-700 uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full shrink-0">
                        {act.category}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed">{act.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center space-x-0.5">
                        <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span>{act.durationMinutes}m</span>
                      </span>
                      <span className="flex items-center space-x-0.5 font-semibold text-green-600">
                        <DollarSign className="h-3.5 w-3.5 shrink-0" />
                        <span>{act.estimatedCost}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => handleAttach(act)}
                      disabled={attachingId !== null}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded px-2.5 py-1 font-bold text-xs flex items-center space-x-1 transition-colors"
                    >
                      {attachingId === act.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Plus className="h-3.5 w-3.5" />
                      )}
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

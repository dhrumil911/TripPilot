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

  // Category image helper to display premium Unsplash travel visuals in selector
  const getCategoryImage = (category: string) => {
    const defaultImg = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=300&q=80';
    const mappings: Record<string, string> = {
      sightseeing: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=300&q=80',
      food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80',
      culture: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=300&q=80',
      adventure: 'https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=300&q=80',
    };
    return mappings[category.toLowerCase()] || defaultImg;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/35 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-paper border-l border-sand shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-sand flex items-center justify-between">
            <h2 className="text-xl font-editorial font-bold text-charcoal flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-coral animate-pulse" />
              <span>Explore Activities</span>
            </h2>
            <button onClick={onClose} className="text-charcoal-muted hover:text-charcoal hover:bg-sand-light rounded-md p-1.5 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search Form */}
          <div className="px-6 py-4 bg-sand-light border-b border-sand">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search sightseeing, food tours..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs border border-sand rounded-md bg-white focus:ring-1 focus:ring-teal"
              />
              <Search className="absolute left-3.5 h-4.5 w-4.5 text-gray-400" />
            </form>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {error && (
              <div className="bg-coral/5 border-l-2 border-coral text-coral p-3 rounded text-xs animate-fadeIn">
                <span>{error}</span>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-2">
                <Loader2 className="h-8 w-8 text-teal animate-spin" />
                <span className="text-charcoal-muted text-xs font-semibold">Browsing catalog...</span>
              </div>
            ) : activities.length === 0 ? (
              <p className="text-center text-charcoal-muted text-xs py-12">No activities found. Try searching for sightseeing or food.</p>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="border border-sand rounded-xl overflow-hidden bg-white hover:border-teal/30 hover:shadow-sm transition-all flex flex-col">
                  {/* Thumbnail Banner */}
                  <div className="h-28 overflow-hidden relative">
                    <img 
                      src={getCategoryImage(act.category)} 
                      alt={act.name} 
                      className="w-full h-full object-cover grayscale-[15%]" 
                    />
                    <span className="absolute top-2 right-2 text-[9px] bg-paper/95 backdrop-blur-sm text-teal font-extrabold uppercase px-2 py-0.5 rounded border border-sand tracking-wider">
                      {act.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-bold text-charcoal text-sm leading-snug">{act.name}</h3>
                      <p className="text-charcoal-muted text-[11px] leading-relaxed">{act.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-charcoal-muted bg-sand-light/65 p-2.5 rounded-lg border border-sand/40">
                      <div className="flex items-center space-x-3 text-[10px] font-bold">
                        <span className="flex items-center space-x-0.5">
                          <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                          <span>{act.durationMinutes}m</span>
                        </span>
                        <span className="flex items-center space-x-0.5 text-green-700">
                          <DollarSign className="h-3.5 w-3.5 shrink-0" />
                          <span>{act.estimatedCost}</span>
                        </span>
                      </div>

                      <button
                        onClick={() => handleAttach(act)}
                        disabled={attachingId !== null}
                        className="bg-teal hover:bg-teal-hover disabled:opacity-50 text-paper rounded px-3 py-1 font-bold text-[10px] uppercase tracking-wider flex items-center space-x-1 transition-colors shadow-sm"
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
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ActivitySelector } from '../components/ActivitySelector';
import { BudgetBreakdown } from '../components/BudgetBreakdown';
import { CalendarView } from '../components/CalendarView';
import { formatCurrency } from '../utils/currency';
import { 
  Calendar, Plus, Trash2, ArrowUp, ArrowDown, Share2, 
  Sparkles, DollarSign, Check, Clock, Eye, AlertCircle 
} from 'lucide-react';
import api from '../api/axios';
import { getDestinationImage } from '../data/destinations';

interface Activity {
  id: string;
  name: string;
  category: string;
  estimatedCost: string;
  durationMinutes: number;
}

interface Stop {
  id: string;
  cityName: string;
  country: string;
  startDate: string;
  endDate: string;
  stopOrder: number;
  activities: Activity[];
}

interface ItineraryItem {
  id: string;
  tripStopId: string;
  activityId: string | null;
  title: string;
  description: string | null;
  itineraryDate: string;
  startTime: string | null;
  endTime: string | null;
  sortOrder: number;
  activity?: {
    category: string;
  } | null;
}

const getCategoryColor = (category?: string | null) => {
  switch (category?.toLowerCase()) {
    case 'transport': return 'border-teal bg-teal text-teal-hover';
    case 'stay': return 'border-coral bg-coral text-coral-hover';
    case 'activity': return 'border-amber-700 bg-amber-700 text-amber-900'; // warm bronze
    case 'meal': return 'border-green-700 bg-green-700 text-green-900'; // sage green
    default: return 'border-charcoal-muted bg-charcoal-muted text-charcoal'; // warm gray
  }
};

interface Expense {
  id: string;
  category: string;
  description: string | null;
  amount: string;
  currency: string;
}

interface TripDetailsData {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  shareKey: string | null;
  stops: Stop[];
  itineraryItems: ItineraryItem[];
  expenses: Expense[];
}

export const TripDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<TripDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Shared triggers
  const [copiedLink, setCopiedLink] = useState(false);
  const [breakdownRefresh, setBreakdownRefresh] = useState(0);

  // City Search
  const [citySearchResults, setCitySearchResults] = useState<Array<{id:string, cityName:string, country:string, popularity:string, costIndex:string}>>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const searchTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchCities = (query: string) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!query.trim()) {
      setCitySearchResults([]);
      return;
    }
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await api.get('/search/cities?query=' + encodeURIComponent(query));
        setCitySearchResults(res.data.cities);
      } catch (e) {
        console.error(e);
      }
    }, 300);
  };

  // Calendar toggle
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');
  const [expandedStopActivities, setExpandedStopActivities] = useState<Record<string, boolean>>({});

  // Forms Visibility & Data
  const [showStopForm, setShowStopForm] = useState(false);
  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [stopStartDate, setStopStartDate] = useState('');
  const [stopEndDate, setStopEndDate] = useState('');

  const [showItemForm, setShowItemForm] = useState(false);
  const [itemStopId, setItemStopId] = useState('');
  const [itemActivityId, setItemActivityId] = useState('');
  const [itemTitle, setItemTitle] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemDate, setItemDate] = useState('');
  const [itemStart, setItemStart] = useState('');
  const [itemEnd, setItemEnd] = useState('');

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expCategory, setExpCategory] = useState<'transport' | 'stay' | 'activity' | 'meal' | 'other'>('other');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('');

  // Selector state
  const [activeStopIdForSelector, setActiveStopIdForSelector] = useState<string | null>(null);

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/trips/${id}`);
      setTrip(response.data.trip);
    } catch (err: any) {
      console.error(err);
      setError('Trip details not found or unauthorized.');
    } finally {
      setLoading(false);
    }
  };

  // 1. Sharing handlers
  const handleToggleShare = async () => {
    if (!trip) return;
    try {
      if (trip.shareKey) {
        await api.post(`/trips/${trip.id}/unshare`);
        setTrip({ ...trip, shareKey: null });
      } else {
        const response = await api.post(`/trips/${trip.id}/share`);
        setTrip({ ...trip, shareKey: response.data.shareKey });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to modify sharing status.');
    }
  };

  const handleCopyLink = () => {
    if (!trip?.shareKey) return;
    const fullUrl = `${window.location.origin}/shared/${trip.shareKey}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // 2. Stop CRUD and reorder handlers
  const handleAddStop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trip) return;

    try {
      const order = trip.stops.length + 1;
      await api.post(`/trips/${trip.id}/stops`, {
        cityName,
        country,
        startDate: stopStartDate,
        endDate: stopEndDate,
        stopOrder: order
      });

      setCityName('');
      setCountry('');
      setStopStartDate('');
      setStopEndDate('');
      setShowStopForm(false);
      fetchTripDetails();
    } catch (err) {
      console.error(err);
      alert('Failed to add stop. Check date limits.');
    }
  };

  const handleDeleteStop = async (stopId: string) => {
    if (!window.confirm('Delete this stop? This deletes all associated activities.')) return;
    try {
      await api.delete(`/stops/${stopId}`);
      fetchTripDetails();
    } catch (err) {
      console.error(err);
      alert('Failed to delete stop.');
    }
  };

  const handleMoveStop = async (index: number, direction: 'up' | 'down') => {
    if (!trip) return;
    const newStops = [...trip.stops];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newStops.length) return;

    // Swap ordering parameters
    const temp = newStops[index].stopOrder;
    newStops[index].stopOrder = newStops[target].stopOrder;
    newStops[target].stopOrder = temp;

    try {
      await api.put(`/trips/${trip.id}/stops/reorder`, {
        reorders: newStops.map(s => ({ id: s.id, stopOrder: s.stopOrder }))
      });
      fetchTripDetails();
    } catch (err) {
      console.error(err);
      alert('Failed to reorder stops.');
    }
  };

  // 3. Itinerary CRUD handlers
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trip) return;

    try {
      const order = trip.itineraryItems.length + 1;
      await api.post(`/trips/${trip.id}/itinerary`, {
        tripStopId: itemStopId,
        activityId: itemActivityId || undefined,
        title: itemTitle,
        description: itemDesc || undefined,
        itineraryDate: itemDate,
        startTime: itemStart || undefined,
        endTime: itemEnd || undefined,
        sortOrder: order
      });

      setItemStopId('');
      setItemActivityId('');
      setItemTitle('');
      setItemDesc('');
      setItemDate('');
      setItemStart('');
      setItemEnd('');
      setShowItemForm(false);
      fetchTripDetails();
    } catch (err) {
      console.error(err);
      alert('Failed to add itinerary item.');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await api.delete(`/itineraries/${itemId}`);
      fetchTripDetails();
    } catch (err) {
      console.error(err);
      alert('Failed to delete itinerary item.');
    }
  };

  // 4. Expense CRUD handlers
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trip) return;

    try {
      await api.post(`/trips/${trip.id}/expenses`, {
        category: expCategory,
        description: expDesc || undefined,
        amount: expAmount,
        currency: 'INR'
      });

      setExpDesc('');
      setExpAmount('');
      setShowExpenseForm(false);
      setBreakdownRefresh(prev => prev + 1);
      fetchTripDetails();
    } catch (err) {
      console.error(err);
      alert('Failed to log expense.');
    }
  };

  const handleDeleteExpense = async (expId: string) => {
    try {
      await api.delete(`/expenses/${expId}`);
      setBreakdownRefresh(prev => prev + 1);
      fetchTripDetails();
    } catch (err) {
      console.error(err);
      alert('Failed to delete expense.');
    }
  };

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  if (loading && !trip) {
    return (
      <div className="min-h-screen bg-paper flex flex-col font-sans text-charcoal">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-charcoal-muted text-xs animate-pulse font-semibold">Loading travel planner...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-paper flex flex-col font-sans text-charcoal">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="bg-coral/5 border-l-2 border-coral text-coral p-4 rounded max-w-md w-full flex items-center space-x-2 text-xs shadow-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error || 'An unexpected error occurred.'}</span>
          </div>
          <Link to="/dashboard" className="mt-4 text-teal hover:text-teal-hover font-bold text-xs uppercase tracking-wider">&larr; Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans text-charcoal selection:bg-coral/25 selection:text-charcoal animate-fadeIn">
      <Navbar />

      {/* Editorial Planner Header Banner */}
      <div className="border-b border-sand py-5 bg-surface-muted/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <Link to="/dashboard" className="text-teal hover:text-teal/80 text-[10px] font-bold uppercase tracking-wider font-sans">&larr; Workspace</Link>
            <h1 className="text-3xl font-editorial font-bold leading-tight text-charcoal">{trip.title}</h1>
            {trip.description && <p className="text-charcoal-muted text-xs max-w-2xl font-sans font-normal">{trip.description}</p>}
            
            <div className="flex items-center space-x-1.5 text-[10px] text-charcoal-muted font-bold pt-0.5 font-sans">
              <Calendar className="h-3.5 w-3.5 text-coral shrink-0" />
              <span>{formatDate(trip.startDate)} &mdash; {formatDate(trip.endDate)}</span>
            </div>
          </div>

          {/* Share Controls */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 font-sans">
            <Link to={`/trips/${trip.id}/calendar`} className="flex items-center gap-1.5 border border-sand bg-surface px-3 py-2 rounded-sm text-[10px] font-bold uppercase tracking-wider text-charcoal-muted hover:border-teal hover:text-teal transition-all"><Calendar className="h-3.5 w-3.5" />Calendar</Link>
            <Link to={`/trips/${trip.id}/budget`} className="flex items-center gap-1.5 border border-sand bg-surface px-3 py-2 rounded-sm text-[10px] font-bold uppercase tracking-wider text-charcoal-muted hover:border-teal hover:text-teal transition-all"><DollarSign className="h-3.5 w-3.5" />Budget</Link>
            <button
              onClick={handleToggleShare}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-sm text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                trip.shareKey 
                  ? 'bg-teal text-paper border-teal' 
                  : 'bg-surface border-sand text-charcoal-muted hover:border-charcoal'
              }`}
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>{trip.shareKey ? 'Shared Publicly' : 'Share Journal'}</span>
            </button>

            {trip.shareKey && (
              <div className="flex items-center gap-2">
                <div className="flex items-center space-x-1 bg-sand-light border border-sand p-1 rounded-sm text-xs">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center space-x-1 px-2.5 py-1 bg-teal hover:bg-teal/95 text-paper rounded-sm text-[9px] font-bold uppercase tracking-widest transition-colors"
                  >
                    {copiedLink ? <Check className="h-2.5 w-2.5" /> : null}
                    <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                  </button>
                  <a
                    href={`/shared/${trip.shareKey}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-charcoal-muted hover:text-teal p-1 hover:bg-surface rounded-sm transition-colors"
                    title="View Public Shared Itinerary"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <button onClick={() => window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent('Check out my trip: ' + trip.title) + '&url=' + encodeURIComponent(window.location.origin + '/shared/' + trip.shareKey), '_blank')}
                    className="px-2 py-1 text-[9px] font-bold border border-sand rounded-sm hover:bg-sand-light uppercase tracking-wider font-sans">Twitter</button>
                  <button onClick={() => window.open('https://wa.me/?text=' + encodeURIComponent('Check out my trip plan: ' + window.location.origin + '/shared/' + trip.shareKey), '_blank')}
                    className="px-2 py-1 text-[9px] font-bold border border-sand rounded-sm hover:bg-sand-light uppercase tracking-wider font-sans">WhatsApp</button>
                  <button onClick={() => window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.origin + '/shared/' + trip.shareKey), '_blank')}
                    className="px-2 py-1 text-[9px] font-bold border border-sand rounded-sm hover:bg-sand-light uppercase tracking-wider font-sans">Facebook</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Columns Grid */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8">
        
        {/* Left Column: Stops and Cities */}
        <section className="space-y-5 md:col-span-1">
          <div className="bg-surface border border-sand p-4 md:p-5 rounded-2xl space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
            
            <div className="flex items-center justify-between border-b border-sand pb-2">
              <h2 className="font-editorial text-lg font-bold text-charcoal flex items-center gap-1.5">
                <span>📍</span>
                <span>Cities & Stops</span>
              </h2>
              <button
                onClick={() => setShowStopForm(!showStopForm)}
                className="text-teal hover:text-coral transition-colors p-1"
                aria-label="Add Stop"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Add Stop Form */}
            {showStopForm && (
              <form onSubmit={handleAddStop} className="bg-sand-light/50 p-4 rounded-xl border border-sand space-y-3 animate-fadeIn font-sans">
                <div className="relative">
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">City Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jaipur"
                    value={cityName}
                    onChange={(e) => {
                      setCityName(e.target.value);
                      searchCities(e.target.value);
                    }}
                    onFocus={() => { if (citySearchResults.length > 0) setShowCitySuggestions(true); }}
                    onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
                    className="w-full px-2.5 py-1.5 border border-sand rounded-sm text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal"
                  />
                  {showCitySuggestions && citySearchResults.length > 0 && (
                    <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-sand rounded-sm shadow-md max-h-40 overflow-y-auto">
                      {citySearchResults.map(city => (
                        <button key={city.id} type="button" onClick={() => { setCityName(city.cityName); setCountry(city.country); setShowCitySuggestions(false); }}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-sand-light flex justify-between">
                          <span className="font-medium">{city.cityName}, {city.country}</span>
                          <span className="text-charcoal-muted">{city.costIndex}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">Country</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. France"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-sand rounded-sm text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">Arrival Date</label>
                    <input
                      type="date"
                      required
                      value={stopStartDate}
                      onChange={(e) => setStopStartDate(e.target.value)}
                      className="w-full px-2 py-1 border border-sand rounded-sm text-[11px] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">Departure Date</label>
                    <input
                      type="date"
                      required
                      value={stopEndDate}
                      onChange={(e) => setStopEndDate(e.target.value)}
                      className="w-full px-2 py-1 border border-sand rounded-sm text-[11px] bg-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button type="submit" className="bg-teal hover:bg-teal/95 text-paper font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-sm transition-colors shadow-sm">
                    Add Stop
                  </button>
                </div>
              </form>
            )}

            {/* List of stops */}
            {trip.stops.length === 0 ? (
              <p className="text-charcoal-muted text-xs py-4 text-center">No stop destinations added yet.</p>
            ) : (
              <div className="space-y-4">
                {trip.stops.map((stop, i) => {
                  const isExpanded = expandedStopActivities[stop.id] || false;
                  const visibleActivities = isExpanded ? stop.activities : stop.activities.slice(0, 3);
                  
                  return (
                    <div key={stop.id} className="border border-sand rounded-xl p-3.5 space-y-3 bg-white hover:border-teal/30 hover:shadow-sm transition-all duration-300">
                      
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex min-w-0 items-start gap-2.5">
                          <img 
                            src={getDestinationImage(stop.cityName, stop.country)} 
                            alt="" 
                            className="h-10 w-14 shrink-0 rounded-sm object-cover border border-sand/40 grayscale-[10%]" 
                            onError={(event) => { event.currentTarget.src = getDestinationImage('', ''); }} 
                          />
                          <div className="min-w-0">
                            <div className="flex items-baseline flex-wrap">
                              <span className="font-editorial italic text-sm text-teal mr-1 leading-none">{stop.stopOrder}.</span>
                              <h3 className="font-editorial text-sm font-bold text-charcoal leading-tight inline">{stop.cityName}, {stop.country}</h3>
                            </div>
                            <p className="text-[9px] text-charcoal-muted font-bold uppercase tracking-wider mt-0.5 leading-none">
                              {formatDate(stop.startDate)} &mdash; {formatDate(stop.endDate)}
                            </p>
                          </div>
                        </div>

                        {/* Direction controls */}
                        <div className="flex items-center space-x-0.5 shrink-0 bg-paper border border-sand/60 px-1 py-0.5 rounded-sm">
                          <button
                            onClick={() => handleMoveStop(i, 'up')}
                            disabled={i === 0}
                            className="text-gray-400 hover:text-teal disabled:opacity-20 p-0.5"
                            aria-label="Move Stop Up"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveStop(i, 'down')}
                            disabled={i === trip.stops.length - 1}
                            className="text-gray-400 hover:text-teal disabled:opacity-20 p-0.5"
                            aria-label="Move Stop Down"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Delete this stop? This removes associated itinerary activities.')) {
                                handleDeleteStop(stop.id);
                              }
                            }}
                            className="text-gray-400 hover:text-coral p-0.5 ml-0.5"
                            aria-label="Delete Stop"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Attached Activities inside stop */}
                      <div className="border-t border-sand/50 pt-2.5 space-y-2">
                        <div className="flex items-center justify-between text-xs text-charcoal-muted font-bold">
                          <span className="text-[9px] uppercase tracking-wider">Sights & Excursions</span>
                          <button
                            onClick={() => setActiveStopIdForSelector(stop.id)}
                            className="text-coral hover:text-coral/80 font-bold flex items-center space-x-0.5 text-[9px] uppercase tracking-wider"
                          >
                            <Sparkles className="h-3 w-3 text-orange-500 shrink-0 animate-pulse" />
                            <span>+ Attach catalog</span>
                          </button>
                        </div>

                        {stop.activities.length === 0 ? (
                          <p className="text-[10px] text-charcoal-muted italic">No activities added.</p>
                        ) : (
                          <div className="space-y-1">
                            {visibleActivities.map((act) => (
                              <div key={act.id} className="flex items-center justify-between bg-paper/60 px-2 py-1 rounded-sm text-xs border border-sand/40 gap-2 hover:bg-paper transition-colors duration-150 group">
                                <span className="font-medium text-charcoal truncate">{act.name}</span>
                                <span className="text-[9px] text-teal font-extrabold shrink-0 font-sans">{formatCurrency(act.estimatedCost)}</span>
                              </div>
                            ))}
                            {stop.activities.length > 3 && (
                              <button 
                                type="button" 
                                onClick={() => setExpandedStopActivities({
                                  ...expandedStopActivities,
                                  [stop.id]: !isExpanded
                                })}
                                className="text-[9px] font-bold uppercase tracking-widest text-teal hover:text-coral mt-1.5 block transition-colors"
                              >
                                {isExpanded ? 'Show less' : `Show ${stop.activities.length - 3} more`}
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </section>

        {/* Middle Column: Daily Timeline Logs */}
        <section className="space-y-5 md:col-span-1">
          <div className="bg-surface border border-sand p-4 md:p-5 rounded-2xl space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
            
            <div className="flex items-center justify-between border-b border-sand pb-2">
              <h2 className="font-editorial text-lg font-bold text-charcoal flex items-center gap-1.5">
                <span>📅</span>
                <span>Timeline Planner</span>
              </h2>
              {trip.stops.length > 0 && (
                <button
                  onClick={() => setShowItemForm(!showItemForm)}
                  className="text-teal hover:text-coral transition-colors p-1"
                  aria-label="Add Section"
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Segmented control and smaller action */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex border border-sand bg-paper p-0.5 rounded-sm text-[9.5px] font-bold uppercase tracking-wider font-sans">
                <button 
                  type="button" 
                  onClick={() => setViewMode('timeline')} 
                  className={`px-3 py-1 rounded-sm transition-all ${viewMode === 'timeline' ? 'bg-surface text-teal shadow-sm border border-sand/40' : 'text-charcoal-muted hover:text-charcoal'}`}
                >
                  Timeline
                </button>
                <button 
                  type="button" 
                  onClick={() => setViewMode('calendar')} 
                  className={`px-3 py-1 rounded-sm transition-all ${viewMode === 'calendar' ? 'bg-surface text-teal shadow-sm border border-sand/40' : 'text-charcoal-muted hover:text-charcoal'}`}
                >
                  Calendar
                </button>
              </div>

              {trip.stops.length > 0 && (
                <button 
                  type="button" 
                  onClick={() => setShowItemForm(!showItemForm)} 
                  className="text-[9px] font-bold uppercase tracking-widest text-teal hover:text-coral transition-colors font-sans"
                >
                  Add section log
                </button>
              )}
            </div>

            {/* Add Itinerary Item Form */}
            {showItemForm && (
              <form onSubmit={handleAddItem} className="bg-sand-light/50 p-4 rounded-xl border border-sand space-y-3 animate-fadeIn font-sans">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">Select Stop City</label>
                    <select
                      required
                      value={itemStopId}
                      onChange={(e) => {
                        setItemStopId(e.target.value);
                        setItemActivityId('');
                      }}
                      className="w-full px-2 py-1.5 border border-sand rounded-sm text-xs bg-white"
                    >
                      <option value="">-- Choose Stop --</option>
                      {trip.stops.map(s => <option key={s.id} value={s.id}>{s.cityName}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">Itinerary Date</label>
                    <input
                      type="date"
                      required
                      value={itemDate}
                      onChange={(e) => setItemDate(e.target.value)}
                      className="w-full px-2 py-1 border border-sand rounded-sm text-xs bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">Title / Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Louvre guided tour"
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-sand rounded-sm text-xs bg-white mb-2"
                  />
                  <textarea
                    placeholder="Log activity details, notes..."
                    value={itemDesc}
                    onChange={(e) => setItemDesc(e.target.value)}
                    rows={2}
                    className="w-full px-2.5 py-1.5 border border-sand rounded-sm text-xs bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">Start Time</label>
                    <input
                      type="time"
                      placeholder="e.g. 09:30"
                      value={itemStart}
                      onChange={(e) => setItemStart(e.target.value)}
                      className="w-full px-2 py-1 border border-sand rounded-sm text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">End Time</label>
                    <input
                      type="time"
                      placeholder="e.g. 12:30"
                      value={itemEnd}
                      onChange={(e) => setItemEnd(e.target.value)}
                      className="w-full px-2 py-1 border border-sand rounded-sm text-xs bg-white"
                    />
                  </div>
                </div>

                {/* Option to link activity */}
                {itemStopId && (
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">Link Associated Activity (Optional)</label>
                    <select
                      value={itemActivityId}
                      onChange={(e) => setItemActivityId(e.target.value)}
                      className="w-full px-2 py-1.5 border border-sand rounded-sm text-xs bg-white"
                    >
                      <option value="">-- Choose Activity --</option>
                      {trip.stops.find(s => s.id === itemStopId)?.activities.map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <button type="submit" className="bg-teal hover:bg-teal/95 text-paper font-bold text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-sm transition-colors shadow-sm">
                    Add log event
                  </button>
                </div>
              </form>
            )}

            {/* Timeline Scheduler logs */}
            {viewMode === 'calendar' && trip ? (
              <CalendarView startDate={trip.startDate} endDate={trip.endDate} itineraryItems={trip.itineraryItems} stops={trip.stops} />
            ) : trip.itineraryItems.length === 0 ? (
              <p className="text-charcoal-muted text-xs py-8 text-center">No schedule events logged. Set up stops and add daily logs.</p>
            ) : (
              <div className="relative border-l border-sand/80 pl-4 ml-2 space-y-4 py-1">
                {trip.itineraryItems.map((item) => (
                  <div key={item.id} className="relative space-y-2 bg-white border border-sand p-3.5 rounded-xl hover:border-teal/30 hover:shadow-sm transition-all duration-300">
                    
                    {/* Circle marker */}
                    <span className={`absolute -left-[23.5px] top-[18px] h-2.5 w-2.5 rounded-full border-2 ring-4 ring-paper ${
                      item.activity?.category ? getCategoryColor(item.activity.category).split(' ')[0] : 'border-charcoal-muted bg-charcoal-muted'
                    }`} />
                    
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <span className="text-[8.5px] text-charcoal font-bold uppercase bg-sand-light px-2 py-0.5 rounded-sm border border-sand/65 font-sans leading-none block w-max">
                          {new Date(item.itineraryDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <h3 className="font-bold text-charcoal text-sm leading-snug">{item.title}</h3>
                      </div>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this itinerary item?')) {
                            handleDeleteItem(item.id);
                          }
                        }}
                        className="text-gray-400 hover:text-coral transition-colors p-0.5 shrink-0"
                        aria-label="Delete timeline item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {item.description && (
                      <p className="text-charcoal-muted text-xs leading-relaxed font-sans font-normal">{item.description}</p>
                    )}

                    {(item.startTime || item.endTime) && (
                      <div className="flex items-center space-x-1 text-[8.5px] text-charcoal-muted font-bold font-sans bg-paper/60 px-1.5 py-1 rounded-sm w-max border border-sand/40 mt-1">
                        <Clock className="h-3 w-3 text-teal shrink-0" />
                        <span>
                          {item.startTime ? item.startTime.substring(0, 5) : '00:00'} - {item.endTime ? item.endTime.substring(0, 5) : '23:59'}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        </section>

        {/* Right Column: Expenses Summary and Ledger */}
        <section className="space-y-5 md:col-span-2 lg:col-span-1">
          
          {/* budget aggregations card */}
          <BudgetBreakdown tripId={trip.id} refreshTrigger={breakdownRefresh} />

          {/* Expenses ledger list */}
          <div className="bg-surface border border-sand p-4 md:p-5 rounded-2xl space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between border-b border-sand pb-2">
              <h2 className="font-editorial text-lg font-bold text-charcoal flex items-center gap-1.5">
                <span>💰</span>
                <span>Expenses Ledger</span>
              </h2>
              <button
                onClick={() => setShowExpenseForm(!showExpenseForm)}
                className="text-teal hover:text-coral transition-colors p-1"
                aria-label="Add Expense"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Add Expense Form */}
            {showExpenseForm && (
              <form onSubmit={handleAddExpense} className="bg-sand-light/50 p-4 rounded-xl border border-sand space-y-3 animate-fadeIn font-sans">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">Category</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as any)}
                    className="w-full px-2 py-1.5 border border-sand rounded-sm text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal"
                  >
                    <option value="transport">Transport</option>
                    <option value="stay">Stay</option>
                    <option value="activity">Activities</option>
                    <option value="meal">Meals</option>
                    <option value="other">Others</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">Amount (₹)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500.00"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-sand rounded-sm text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">Description (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Train ticket to Jaipur"
                    value={expDesc}
                    onChange={(e) => setExpDesc(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-sand rounded-sm text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal"
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <button type="submit" className="bg-teal hover:bg-teal/95 text-paper font-bold text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-sm transition-colors shadow-sm">
                    Log Expense
                  </button>
                </div>
              </form>
            )}

            {/* Expenses List */}
            {trip.expenses.length === 0 ? (
              <p className="text-charcoal-muted text-xs py-4 text-center">No expense logs found.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {trip.expenses.map((exp) => (
                  <div key={exp.id} className="flex items-center justify-between border border-sand/60 rounded-xl p-2.5 bg-white text-xs gap-1.5 hover:border-teal/20 hover:shadow-sm transition-all duration-150 animate-fadeIn">
                    <div className="space-y-0.5 truncate min-w-0">
                      <span className="text-[8px] uppercase font-bold text-coral bg-sand-light/50 border border-sand/40 px-1.5 py-0.5 rounded-sm block w-max leading-none">{exp.category}</span>
                      <p className="font-semibold text-charcoal truncate mt-1 leading-snug">{exp.description || 'Logged expense'}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="font-bold text-charcoal font-sans">{formatCurrency(exp.amount)}</span>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this expense log?')) {
                            handleDeleteExpense(exp.id);
                          }
                        }}
                        className="text-gray-400 hover:text-coral p-0.5 rounded hover:bg-sand-light transition-colors"
                        aria-label="Delete Expense"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </section>

      </div>

      {/* Slide-over Activity Selection Overlay */}
      {activeStopIdForSelector && (
        <ActivitySelector
          stopId={activeStopIdForSelector}
          isOpen={activeStopIdForSelector !== null}
          onClose={() => setActiveStopIdForSelector(null)}
          onAttachSuccess={fetchTripDetails}
        />
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { ActivitySelector } from '../components/ActivitySelector';
import { BudgetBreakdown } from '../components/BudgetBreakdown';
import { 
  Calendar, MapPin, Plus, Trash2, ArrowUp, ArrowDown, Share2, 
  Sparkles, DollarSign, Check, Clock, Eye, AlertCircle 
} from 'lucide-react';
import api from '../api/axios';

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
}

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
        currency: 'USD'
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
    <div className="min-h-screen bg-paper flex flex-col font-sans text-charcoal">
      <Navbar />

      {/* Editorial Planner Header Banner */}
      <div className="border-b border-sand py-8 bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <Link to="/dashboard" className="text-teal hover:text-teal-hover text-xs font-bold uppercase tracking-wider">&larr; Workspace</Link>
            <h1 className="text-3xl sm:text-4xl font-editorial font-bold leading-tight">{trip.title}</h1>
            {trip.description && <p className="text-charcoal-muted text-xs max-w-2xl">{trip.description}</p>}
            
            <div className="flex items-center space-x-2 text-[11px] text-charcoal-muted font-bold pt-1">
              <Calendar className="h-4 w-4 text-coral shrink-0" />
              <span>{formatDate(trip.startDate)} &mdash; {formatDate(trip.endDate)}</span>
            </div>
          </div>

          {/* Share Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleToggleShare}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded text-xs font-bold uppercase tracking-wider border transition-colors ${
                trip.shareKey 
                  ? 'bg-teal text-paper border-teal' 
                  : 'bg-white border-sand text-charcoal-muted hover:border-charcoal'
              }`}
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>{trip.shareKey ? 'Shared Publicly' : 'Share Journal'}</span>
            </button>

            {trip.shareKey && (
              <div className="flex items-center space-x-2 bg-sand-light border border-sand p-1.5 rounded text-xs">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-teal hover:bg-teal-hover text-paper rounded text-[9px] font-bold uppercase tracking-widest transition-colors"
                >
                  {copiedLink ? <Check className="h-3 w-3" /> : null}
                  <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                </button>
                <a
                  href={`/shared/${trip.shareKey}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-charcoal-muted hover:text-teal p-1.5 hover:bg-white rounded"
                  title="View Public Shared Itinerary"
                >
                  <Eye className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Columns Grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Stops and Cities (Span 4) */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-paper border border-sand p-6 rounded-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-sand pb-3">
              <h2 className="text-base font-bold text-charcoal flex items-center space-x-2">
                <MapPin className="h-4.5 w-4.5 text-teal" />
                <span className="font-editorial font-bold text-lg text-charcoal">Cities & Stops</span>
              </h2>
              <button
                onClick={() => setShowStopForm(!showStopForm)}
                className="text-teal hover:text-teal-hover hover:bg-sand-light p-1 rounded-md transition-colors"
              >
                <Plus className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Add Stop Form */}
            {showStopForm && (
              <form onSubmit={handleAddStop} className="bg-sand-light/50 p-4 rounded-lg border border-sand space-y-3 animate-fadeIn">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">City Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paris"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-sand rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">Country</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. France"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-sand rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">Arrival Date</label>
                    <input
                      type="date"
                      required
                      value={stopStartDate}
                      onChange={(e) => setStopStartDate(e.target.value)}
                      className="w-full px-2 py-1 border border-sand rounded text-[11px] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">Departure Date</label>
                    <input
                      type="date"
                      required
                      value={stopEndDate}
                      onChange={(e) => setStopEndDate(e.target.value)}
                      className="w-full px-2 py-1 border border-sand rounded text-[11px] bg-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button type="submit" className="bg-teal hover:bg-teal-hover text-paper font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded transition-colors shadow-sm">
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
                {trip.stops.map((stop, i) => (
                  <div key={stop.id} className="border border-sand rounded-xl p-4 space-y-3 bg-white hover:border-teal/30 hover:shadow-sm transition-all">
                    
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="bg-sand-light text-teal font-editorial font-bold text-xs rounded-full h-5 w-5 flex items-center justify-center border border-sand">
                            {stop.stopOrder}
                          </span>
                          <h3 className="font-bold text-charcoal text-sm leading-none">{stop.cityName}, {stop.country}</h3>
                        </div>
                        <p className="text-[10px] text-charcoal-muted font-bold uppercase tracking-wider">
                          {formatDate(stop.startDate)} &mdash; {formatDate(stop.endDate)}
                        </p>
                      </div>

                      {/* Direction controls */}
                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={() => handleMoveStop(i, 'up')}
                          disabled={i === 0}
                          className="text-gray-400 hover:text-teal disabled:opacity-30 p-0.5"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleMoveStop(i, 'down')}
                          disabled={i === trip.stops.length - 1}
                          className="text-gray-400 hover:text-teal disabled:opacity-30 p-0.5"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStop(stop.id)}
                          className="text-gray-400 hover:text-coral p-0.5 ml-1 animate-pulse"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Attached Activities inside stop */}
                    <div className="border-t border-sand pt-3 space-y-2">
                      <div className="flex items-center justify-between text-xs text-charcoal-muted font-bold">
                        <span className="text-[9px] uppercase tracking-wider">Sights & Excursions</span>
                        <button
                          onClick={() => setActiveStopIdForSelector(stop.id)}
                          className="text-coral hover:text-coral/80 font-bold flex items-center space-x-0.5 text-[10px] uppercase tracking-wider"
                        >
                          <Sparkles className="h-3 w-3 text-orange-500 animate-pulse shrink-0" />
                          <span>Attach catalog</span>
                        </button>
                      </div>

                      {stop.activities.length === 0 ? (
                        <p className="text-[10px] text-charcoal-muted italic">No activities added.</p>
                      ) : (
                        <div className="space-y-1.5">
                          {stop.activities.map((act) => (
                            <div key={act.id} className="flex items-center justify-between bg-sand-light/50 px-2 py-1 rounded text-xs border border-sand/40 gap-1.5">
                              <span className="font-semibold text-charcoal truncate">{act.name}</span>
                              <span className="text-[9px] text-green-700 font-bold shrink-0">${parseFloat(act.estimatedCost).toFixed(0)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        </section>

        {/* Middle Column: Daily Timeline Logs (Span 5) */}
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-paper border border-sand p-6 rounded-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-sand pb-3">
              <h2 className="text-base font-bold text-charcoal flex items-center space-x-2">
                <Calendar className="h-4.5 w-4.5 text-teal" />
                <span className="font-editorial font-bold text-lg text-charcoal">Timeline Planner</span>
              </h2>
              {trip.stops.length > 0 && (
                <button
                  onClick={() => setShowItemForm(!showItemForm)}
                  className="text-teal hover:text-teal-hover hover:bg-sand-light p-1 rounded-md transition-colors"
                >
                  <Plus className="h-4.5 w-4.5" />
                </button>
              )}
            </div>

            {/* Add Itinerary Item Form */}
            {showItemForm && (
              <form onSubmit={handleAddItem} className="bg-sand-light/50 p-4 rounded-lg border border-sand space-y-3 animate-fadeIn">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">Select Stop City</label>
                    <select
                      required
                      value={itemStopId}
                      onChange={(e) => {
                        setItemStopId(e.target.value);
                        setItemActivityId('');
                      }}
                      className="w-full px-2 py-1.5 border border-sand rounded text-xs bg-white"
                    >
                      <option value="">-- Choose Stop --</option>
                      {trip.stops.map(s => <option key={s.id} value={s.id}>{s.cityName}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">Itinerary Date</label>
                    <input
                      type="date"
                      required
                      value={itemDate}
                      onChange={(e) => setItemDate(e.target.value)}
                      className="w-full px-2 py-1 border border-sand rounded text-xs bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">Title / Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Louvre guided tour"
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-sand rounded text-xs bg-white mb-2"
                  />
                  <textarea
                    placeholder="Log activity details, notes..."
                    value={itemDesc}
                    onChange={(e) => setItemDesc(e.target.value)}
                    rows={2}
                    className="w-full px-2.5 py-1.5 border border-sand rounded text-xs bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">Start Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 09:30"
                      value={itemStart}
                      onChange={(e) => setItemStart(e.target.value)}
                      className="w-full px-2 py-1 border border-sand rounded text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">End Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 12:30"
                      value={itemEnd}
                      onChange={(e) => setItemEnd(e.target.value)}
                      className="w-full px-2 py-1 border border-sand rounded text-xs bg-white"
                    />
                  </div>
                </div>

                {/* Option to link activity */}
                {itemStopId && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">Link Associated Activity (Optional)</label>
                    <select
                      value={itemActivityId}
                      onChange={(e) => setItemActivityId(e.target.value)}
                      className="w-full px-2 py-1.5 border border-sand rounded text-xs bg-white"
                    >
                      <option value="">-- Choose Activity --</option>
                      {trip.stops.find(s => s.id === itemStopId)?.activities.map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <button type="submit" className="bg-teal hover:bg-teal-hover text-paper font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded transition-colors shadow-sm">
                    Add timeline log
                  </button>
                </div>
              </form>
            )}

            {/* Timeline Scheduler logs */}
            {trip.itineraryItems.length === 0 ? (
              <p className="text-charcoal-muted text-xs py-8 text-center">No schedule events logged. Set up stops and add daily logs.</p>
            ) : (
              <div className="relative border-l border-sand pl-4 ml-2.5 space-y-6 py-2">
                {trip.itineraryItems.map((item) => (
                  <div key={item.id} className="relative space-y-2 animate-fadeIn bg-white border border-sand p-4 rounded-xl shadow-sm hover:border-teal/30 transition-colors">
                    
                    {/* Circle marker */}
                    <span className="absolute -left-[21px] top-4.5 bg-paper h-2 w-2 rounded-full border-2 border-teal ring-4 ring-paper" />
                    
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="text-[9px] text-coral font-extrabold uppercase bg-sand-light px-2 py-0.5 rounded border border-sand">
                          {new Date(item.itineraryDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <h3 className="font-bold text-charcoal text-sm leading-snug">{item.title}</h3>
                      </div>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-gray-400 hover:text-coral p-0.5"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {item.description && (
                      <p className="text-charcoal-muted text-xs leading-relaxed">{item.description}</p>
                    )}

                    {(item.startTime || item.endTime) && (
                      <div className="flex items-center space-x-1.5 text-[9px] text-charcoal-muted font-bold bg-sand-light/50 p-1.5 rounded w-max border border-sand/40">
                        <Clock className="h-3.5 w-3.5 text-teal shrink-0" />
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

        {/* Right Column: Cost Splitting Tracker (Span 3) */}
        <section className="lg:col-span-3 space-y-6">
          
          {/* budget aggregations card */}
          <BudgetBreakdown tripId={trip.id} refreshTrigger={breakdownRefresh} />

          {/* Expenses ledger list */}
          <div className="bg-paper border border-sand p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-sand pb-3">
              <h2 className="text-base font-bold text-charcoal flex items-center space-x-2">
                <DollarSign className="h-4.5 w-4.5 text-teal" />
                <span className="font-editorial font-bold text-lg text-charcoal">Expenses Ledger</span>
              </h2>
              <button
                onClick={() => setShowExpenseForm(!showExpenseForm)}
                className="text-teal hover:text-teal-hover hover:bg-sand-light p-1 rounded-md transition-colors"
              >
                <Plus className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Log Expense Form */}
            {showExpenseForm && (
              <form onSubmit={handleAddExpense} className="bg-sand-light/50 p-4 rounded-lg border border-sand space-y-3 animate-fadeIn">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">Category</label>
                  <select
                    required
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as any)}
                    className="w-full px-2 py-1.5 border border-sand rounded text-xs bg-white"
                  >
                    <option value="transport">Transport</option>
                    <option value="stay">Stay</option>
                    <option value="activity">Activities</option>
                    <option value="meal">Meals</option>
                    <option value="other">Others</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">Amount ($)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50.00"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-sand rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">Description (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Train ticket to Paris"
                    value={expDesc}
                    onChange={(e) => setExpDesc(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-sand rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal"
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <button type="submit" className="bg-teal hover:bg-teal-hover text-paper font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded transition-colors shadow-sm">
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
                  <div key={exp.id} className="flex items-center justify-between border border-sand rounded-lg p-2.5 bg-white text-xs gap-1.5 hover:border-teal/20 hover:shadow-sm transition-all animate-fadeIn">
                    <div className="space-y-0.5 truncate">
                      <span className="text-[9px] uppercase font-bold text-coral">{exp.category}</span>
                      <p className="font-semibold text-charcoal truncate">{exp.description || 'Logged expense'}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="font-bold text-charcoal">${parseFloat(exp.amount).toFixed(0)}</span>
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="text-gray-400 hover:text-coral p-0.5 rounded hover:bg-sand-light transition-colors"
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

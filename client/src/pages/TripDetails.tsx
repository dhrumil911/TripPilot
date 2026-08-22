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

  if (loading && !trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-sm animate-pulse">Loading travel plan...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded max-w-md w-full flex items-center space-x-2 text-sm shadow-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error || 'An unexpected error occurred.'}</span>
          </div>
          <Link to="/" className="mt-4 text-blue-600 hover:text-blue-700 font-semibold text-sm">&larr; Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Overview Header Banner */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <Link to="/" className="text-blue-600 hover:text-blue-700 text-xs font-bold">&larr; Dashboard</Link>
            <h1 className="text-2xl font-bold text-gray-900">{trip.title}</h1>
            {trip.description && <p className="text-gray-500 text-sm">{trip.description}</p>}
            <div className="flex items-center space-x-2 text-xs text-gray-400 font-semibold mt-2">
              <Calendar className="h-4 w-4 text-blue-500 shrink-0" />
              <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Share Section */}
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={handleToggleShare}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${
                trip.shareKey 
                  ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' 
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Share2 className="h-4 w-4" />
              <span>{trip.shareKey ? 'Shared (Public)' : 'Share Trip'}</span>
            </button>

            {trip.shareKey && (
              <div className="flex items-center space-x-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center space-x-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold transition-colors"
                >
                  {copiedLink ? <Check className="h-3 w-3" /> : null}
                  <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                </button>
                <a
                  href={`/shared/${trip.shareKey}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-400 hover:text-blue-600 p-1"
                  title="View Public shared view"
                >
                  <Eye className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Workspace Panels */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Stops & Cities (Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>Cities & Stops</span>
              </h2>
              <button
                onClick={() => setShowStopForm(!showStopForm)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 rounded-md transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            {/* Add Stop Form */}
            {showStopForm && (
              <form onSubmit={handleAddStop} className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">City Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Paris"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    placeholder="France"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Arrival</label>
                    <input
                      type="date"
                      required
                      value={stopStartDate}
                      onChange={(e) => setStopStartDate(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-[11px] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Departure</label>
                    <input
                      type="date"
                      required
                      value={stopEndDate}
                      onChange={(e) => setStopEndDate(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-[11px] bg-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button type="submit" className="bg-blue-600 text-white font-bold px-3 py-1 rounded text-xs">
                    Add stop
                  </button>
                </div>
              </form>
            )}

            {/* Stops list */}
            {trip.stops.length === 0 ? (
              <p className="text-gray-500 text-xs py-4 text-center">No stop destinations added yet.</p>
            ) : (
              <div className="space-y-4">
                {trip.stops.map((stop, i) => (
                  <div key={stop.id} className="border border-gray-100 rounded-xl p-4 space-y-3 bg-white shadow-sm hover:border-gray-200 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{stop.cityName}, {stop.country}</h3>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                          {new Date(stop.startDate).toLocaleDateString()} - {new Date(stop.endDate).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Direction controls */}
                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={() => handleMoveStop(i, 'up')}
                          disabled={i === 0}
                          className="text-gray-400 hover:text-blue-600 disabled:opacity-30 p-0.5"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleMoveStop(i, 'down')}
                          disabled={i === trip.stops.length - 1}
                          className="text-gray-400 hover:text-blue-600 disabled:opacity-30 p-0.5"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStop(stop.id)}
                          className="text-gray-400 hover:text-red-600 p-0.5 ml-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Attached Activities inside stop */}
                    <div className="border-t border-gray-50 pt-2.5 space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="font-bold">Attached Activities</span>
                        <button
                          onClick={() => setActiveStopIdForSelector(stop.id)}
                          className="text-blue-600 hover:text-blue-700 font-bold flex items-center space-x-0.5"
                        >
                          <Sparkles className="h-3 w-3 shrink-0 animate-pulse text-orange-500" />
                          <span>Attach catalog</span>
                        </button>
                      </div>

                      {stop.activities.length === 0 ? (
                        <p className="text-[10px] text-gray-400 italic">No activities added.</p>
                      ) : (
                        <div className="space-y-1.5">
                          {stop.activities.map((act) => (
                            <div key={act.id} className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded text-xs border border-gray-100 gap-1.5">
                              <span className="font-semibold text-gray-700 truncate">{act.name}</span>
                              <span className="text-[10px] text-green-600 font-bold shrink-0">${parseFloat(act.estimatedCost).toFixed(0)}</span>
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
        </div>

        {/* Middle Column: Daily Itinerary Schedule (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Itinerary builder</span>
              </h2>
              {trip.stops.length > 0 && (
                <button
                  onClick={() => setShowItemForm(!showItemForm)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 rounded-md transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Add Itinerary Item Form */}
            {showItemForm && (
              <form onSubmit={handleAddItem} className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Select Stop City</label>
                    <select
                      required
                      value={itemStopId}
                      onChange={(e) => {
                        setItemStopId(e.target.value);
                        setItemActivityId('');
                      }}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white"
                    >
                      <option value="">-- Choose Stop --</option>
                      {trip.stops.map(s => <option key={s.id} value={s.id}>{s.cityName}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Itinerary Date</label>
                    <input
                      type="date"
                      required
                      value={itemDate}
                      onChange={(e) => setItemDate(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Title / Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Louvre guided tour"
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs bg-white mb-2"
                  />
                  <textarea
                    placeholder="Log activity details, notes..."
                    value={itemDesc}
                    onChange={(e) => setItemDesc(e.target.value)}
                    rows={2}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Start Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 09:30"
                      value={itemStart}
                      onChange={(e) => setItemStart(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">End Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 12:30"
                      value={itemEnd}
                      onChange={(e) => setItemEnd(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white"
                    />
                  </div>
                </div>

                {/* Option to link activity */}
                {itemStopId && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Link Associated Activity (Optional)</label>
                    <select
                      value={itemActivityId}
                      onChange={(e) => setItemActivityId(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white"
                    >
                      <option value="">-- Choose Activity --</option>
                      {trip.stops.find(s => s.id === itemStopId)?.activities.map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <button type="submit" className="bg-blue-600 text-white font-bold px-3 py-1 rounded text-xs">
                    Add log
                  </button>
                </div>
              </form>
            )}

            {/* Timeline daily scheduler lists */}
            {trip.itineraryItems.length === 0 ? (
              <p className="text-gray-500 text-xs py-8 text-center">No schedule events logged. Set up stops and add timeline items.</p>
            ) : (
              <div className="relative border-l-2 border-blue-100 pl-4 ml-2.5 space-y-6 py-2">
                {trip.itineraryItems.map((item) => (
                  <div key={item.id} className="relative space-y-2 animate-fadeIn bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:border-blue-100 transition-colors">
                    {/* Bullet marker */}
                    <span className="absolute -left-[27px] top-4.5 bg-blue-500 h-3 w-3 rounded-full border-2 border-white ring-4 ring-blue-50" />
                    
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                          {new Date(item.itineraryDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <h3 className="font-bold text-gray-900 text-sm mt-1">{item.title}</h3>
                      </div>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-gray-400 hover:text-red-600 p-0.5"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {item.description && (
                      <p className="text-gray-500 text-xs leading-relaxed">{item.description}</p>
                    )}

                    {(item.startTime || item.endTime) && (
                      <div className="flex items-center space-x-1.5 text-[10px] text-gray-400 font-semibold bg-gray-50 p-1.5 rounded w-max border border-gray-100">
                        <Clock className="h-3.5 w-3.5 text-blue-500 shrink-0" />
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
        </div>

        {/* Right Column: Cost aggregation tracker (Span 3) */}
        <div className="lg:col-span-3 space-y-6">
          {/* budget aggregations card */}
          <BudgetBreakdown tripId={trip.id} refreshTrigger={breakdownRefresh} />

          {/* Expenses logger */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <span>Expenses Ledger</span>
              </h2>
              <button
                onClick={() => setShowExpenseForm(!showExpenseForm)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 rounded-md transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            {/* Log Expense Form */}
            {showExpenseForm && (
              <form onSubmit={handleAddExpense} className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                  <select
                    required
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as any)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs bg-white"
                  >
                    <option value="transport">Transport</option>
                    <option value="stay">Stay</option>
                    <option value="activity">Activities</option>
                    <option value="meal">Meals</option>
                    <option value="other">Others</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Amount ($)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50.00"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Description (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Metro tickets"
                    value={expDesc}
                    onChange={(e) => setExpDesc(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <button type="submit" className="bg-blue-600 text-white font-bold px-3 py-1 rounded text-xs">
                    Log expense
                  </button>
                </div>
              </form>
            )}

            {/* Expenses List */}
            {trip.expenses.length === 0 ? (
              <p className="text-gray-500 text-xs py-4 text-center">No expense logs found.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {trip.expenses.map((exp) => (
                  <div key={exp.id} className="flex items-center justify-between border border-gray-100 rounded-lg p-2.5 bg-gray-50 text-xs gap-1.5 hover:border-gray-200 transition-colors animate-fadeIn">
                    <div className="space-y-0.5 truncate">
                      <span className="text-[10px] uppercase font-bold text-gray-400">{exp.category}</span>
                      <p className="font-semibold text-gray-700 truncate">{exp.description || 'Logged expense'}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="font-extrabold text-gray-900">${parseFloat(exp.amount).toFixed(2)}</span>
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="text-gray-400 hover:text-red-600 p-0.5 rounded hover:bg-white transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

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

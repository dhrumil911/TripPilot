import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Compass, Loader2, MapPin, Search } from 'lucide-react';
import api from '../api/axios';
import { formatCurrency } from '../utils/currency';
import { getDestinationImage } from '../data/destinations';

interface City { id: string; cityName: string; country: string; popularity: string; }
interface ActivityResult { id: string; name: string; description: string; category: string; estimatedCost: string; durationMinutes: number; }
interface Trip { id: string; title: string; stops?: Array<{ id: string; cityName: string; country: string }>; }

type ResultType = 'all' | 'cities' | 'activities';
type SortOrder = 'relevance' | 'name' | 'cost';

export const Explore: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [resultType, setResultType] = useState<ResultType>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('relevance');
  const [cities, setCities] = useState<City[]>([]);
  const [activities, setActivities] = useState<ActivityResult[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStopId, setSelectedStopId] = useState('');
  const [addingId, setAddingId] = useState<string | null>(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    Promise.all([api.get('/search/cities'), api.get('/search/activities'), api.get('/trips')])
      .then(([cityResponse, activityResponse, tripResponse]) => {
        setCities(cityResponse.data.cities || []);
        setActivities(activityResponse.data.activities || []);
        setTrips(tripResponse.data.trips || []);
      })
      .catch(() => setError('We could not load discovery results right now.'))
      .finally(() => setLoading(false));
  }, []);

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visibleCities = cities.filter((city) => `${city.cityName} ${city.country}`.toLocaleLowerCase().includes(normalizedQuery));
  const visibleActivities = activities.filter((item) => `${item.name} ${item.category} ${item.description}`.toLocaleLowerCase().includes(normalizedQuery));
  const sortedActivities = [...visibleActivities].sort((a, b) => sortOrder === 'name' ? a.name.localeCompare(b.name) : sortOrder === 'cost' ? Number(a.estimatedCost) - Number(b.estimatedCost) : 0);
  const stops = trips.flatMap((trip) => trip.stops || []);

  const addToStop = async (activity: ActivityResult) => {
    if (!selectedStopId) return;
    setAddingId(activity.id);
    setSuccess('');
    try {
      await api.post(`/stops/${selectedStopId}/activities`, activity);
      setSuccess(`${activity.name} added to your stop.`);
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || 'Could not add this activity.');
    } finally {
      setAddingId(null);
    }
  };

  return <div className="min-h-screen bg-paper text-charcoal font-sans"><header className="border-b border-sand"><div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between"><Link to="/dashboard" className="flex items-center gap-2 text-teal font-editorial font-bold text-xl"><Compass className="h-5 w-5 text-coral" />TripPilot</Link><Link to="/dashboard" className="text-xs font-bold uppercase tracking-wider text-charcoal-muted hover:text-teal">Workspace</Link></div></header><main className="max-w-6xl mx-auto px-4 sm:px-6 py-10"><p className="text-[10px] uppercase tracking-[0.25em] text-coral font-extrabold">The field guide</p><h1 className="mt-3 text-4xl font-editorial font-bold">Find your next stop.</h1><div className="mt-8 flex flex-col gap-3 lg:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-charcoal-muted" /><input aria-label="Search destinations and activities" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search destination or activity..." className="field pl-10" /></div><select aria-label="Group results" value={resultType} onChange={(event) => setResultType(event.target.value as ResultType)} className="field lg:max-w-xs"><option value="all">All results</option><option value="cities">Cities</option><option value="activities">Activities</option></select><select aria-label="Sort results" value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)} className="field lg:max-w-xs"><option value="relevance">Sort by relevance</option><option value="name">Sort by name</option><option value="cost">Sort activities by cost</option></select></div>{loading ? <div className="py-16 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-teal" /></div> : error ? <p role="alert" className="mt-8 border-l-2 border-coral bg-coral/5 p-4 text-xs text-coral">{error}</p> : <div className="mt-10 grid gap-10 lg:grid-cols-2">{(resultType === 'all' || resultType === 'cities') && <section><div className="flex items-center gap-2 border-b border-sand pb-3"><MapPin className="h-4 w-4 text-teal" /><h2 className="font-editorial text-xl font-bold">Cities <span className="font-sans text-xs text-charcoal-muted">({visibleCities.length})</span></h2></div><div className="mt-4 divide-y divide-sand">{visibleCities.map((city) => <button key={city.id} onClick={() => navigate(`/trips/new?destination=${encodeURIComponent(city.cityName)}`)} className="flex w-full items-center gap-3 px-3 py-4 text-left hover:bg-sand-light"><img src={getDestinationImage(city.cityName)} alt={`${city.cityName}, ${city.country}`} className="h-14 w-20 shrink-0 object-cover" onError={(event) => { event.currentTarget.src = getDestinationImage(''); }} /><div className="min-w-0 flex-1"><p className="truncate font-bold">{city.cityName}, {city.country}</p><p className="text-xs text-charcoal-muted">{city.popularity} interest</p></div><span className="shrink-0 text-xs font-bold text-coral">Plan trip →</span></button>)}{!visibleCities.length && <p className="py-8 text-xs text-charcoal-muted">No cities found.</p>}</div></section>}{(resultType === 'all' || resultType === 'activities') && <section><div className="flex items-center gap-2 border-b border-sand pb-3"><Activity className="h-4 w-4 text-teal" /><h2 className="font-editorial text-xl font-bold">Activities <span className="font-sans text-xs text-charcoal-muted">({visibleActivities.length})</span></h2></div><div className="mt-4 space-y-3">{stops.length > 0 && <select aria-label="Add activity to stop" value={selectedStopId} onChange={(event) => setSelectedStopId(event.target.value)} className="field"><option value="">Choose a stop to add activities</option>{stops.map((stop) => <option key={stop.id} value={stop.id}>{stop.cityName}, {stop.country}</option>)}</select>}{success && <p role="status" className="text-xs text-green-700">{success}</p>}{sortedActivities.map((item) => <article key={item.id} className="border border-sand bg-white p-4"><div className="flex items-start justify-between gap-4"><div className="min-w-0"><p className="font-bold">{item.name}</p><p className="mt-1 text-xs text-charcoal-muted">{item.description}</p></div><span className="shrink-0 text-xs font-bold text-teal">{formatCurrency(item.estimatedCost)}</span></div><div className="mt-3 flex items-center justify-between gap-3"><p className="text-[10px] uppercase tracking-wider text-charcoal-muted">{item.category} · {item.durationMinutes} min</p><button onClick={() => addToStop(item)} disabled={!selectedStopId || addingId !== null} className="shrink-0 bg-teal px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-paper disabled:opacity-50">{addingId === item.id ? 'Adding...' : 'Add to stop'}</button></div></article>)}{!sortedActivities.length && <p className="py-8 text-xs text-charcoal-muted">No activities found.</p>}</div></section>}</div>}</main></div>;
};

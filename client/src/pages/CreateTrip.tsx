import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Compass, Loader2, MapPin } from 'lucide-react';
import api from '../api/axios';

interface Recommendation {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedCost: string;
  durationMinutes: number;
}

interface CityResult {
  id: string;
  cityName: string;
  country: string;
  popularity: string;
}

export const CreateTrip: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const destination = queryParams.get('destination') || '';
  const recommendationIds = (queryParams.get('recommendations') || '').split(',').filter(Boolean);
  const [title, setTitle] = useState(destination ? `Trip to ${destination}` : '');
  const [destinationInput, setDestinationInput] = useState(destination);
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [cityResults, setCityResults] = useState<CityResult[]>([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [selectedRecommendationIds, setSelectedRecommendationIds] = useState<string[]>(recommendationIds);

  useEffect(() => {
    const cityQuery = destinationInput.split(',')[0].trim();
    if (!cityQuery || selectedCityId) return;
    const timer = window.setTimeout(() => {
      setCityLoading(true);
      api.get(`/search/cities?query=${encodeURIComponent(cityQuery)}`)
        .then((response) => setCityResults(response.data.cities || []))
        .catch(() => setCityResults([]))
        .finally(() => setCityLoading(false));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [destinationInput, selectedCityId]);

  const selectDestination = async (city: CityResult) => {
    setDestinationInput(`${city.cityName}, ${city.country}`);
    setTitle((currentTitle) => currentTitle || `Trip to ${city.cityName}`);
    setSelectedCityId(city.id);
    setCityResults([]);
    setRecommendationLoading(true);
    try {
      const response = await api.get(`/search/cities/${city.id}/recommendations`);
      setRecommendations(response.data.recommendations || []);
    } catch {
      setRecommendations([]);
    } finally {
      setRecommendationLoading(false);
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (new Date(startDate) > new Date(endDate)) {
      setError('End date must be after or equal to start date.');
      return;
    }
    setSaving(true);
    try {
      const response = await api.post('/trips', { title, description: description || undefined, startDate, endDate });
      const trip = response.data.trip;
      const place = destinationInput.split(',').map((part) => part.trim()).filter(Boolean);
      if (place[0]) {
        const stopResponse = await api.post(`/trips/${trip.id}/stops`, { cityName: place[0], country: place[1] || 'India', startDate, endDate, stopOrder: 1 });
        if (selectedRecommendationIds.length) {
          const selected = recommendations.filter((recommendation) => selectedRecommendationIds.includes(recommendation.id));
          await Promise.all(selected.map((recommendation) => api.post(`/stops/${stopResponse.data.stop.id}/activities`, recommendation)));
        }
      }
      navigate(`/trips/${trip.id}`);
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || 'Could not create your trip. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-charcoal font-sans">
      <header className="border-b border-sand px-4 py-4"><div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 text-teal font-editorial font-bold text-xl"><Compass className="h-5 w-5 text-coral" />TripPilot</Link>
        <Link to="/dashboard" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal-muted hover:text-teal"><ArrowLeft className="h-4 w-4" />Back to trips</Link>
      </div></header>
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="max-w-2xl"><p className="text-[10px] uppercase tracking-[0.25em] text-coral font-extrabold">A new chapter</p><h1 className="mt-3 text-4xl font-editorial font-bold">Shape the journey.</h1><p className="mt-3 text-sm text-charcoal-muted">Set the essentials, choose a destination, and carry the right recommendations into your itinerary.</p></div>
        <form onSubmit={submit} className="mt-10 border-t border-sand pt-8 space-y-6 max-w-2xl">
          {error && <p role="alert" className="border-l-2 border-coral bg-coral/5 p-3 text-xs text-coral">{error}</p>}
          <div><label htmlFor="trip-title" className="label">Trip name</label><input id="trip-title" required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="A week in Rajasthan" className="field" /></div>
          <div className="relative"><label htmlFor="trip-destination" className="label"><MapPin className="inline h-3.5 w-3.5 mr-1" />Select a place</label><input id="trip-destination" value={destinationInput} onChange={(event) => { setDestinationInput(event.target.value); setSelectedCityId(''); }} placeholder="Search a city" className="field" autoComplete="off" />{cityLoading && <span className="absolute right-3 top-9 text-[10px] text-charcoal-muted">Searching...</span>}{cityResults.length > 0 && <div className="absolute z-20 mt-1 w-full border border-sand bg-paper shadow-md">{cityResults.map((city) => <button type="button" key={city.id} onClick={() => selectDestination(city)} className="flex w-full items-center justify-between border-b border-sand px-3 py-2 text-left text-xs last:border-0 hover:bg-sand-light"><span className="font-bold">{city.cityName}, {city.country}</span><span className="text-[10px] text-charcoal-muted">{city.popularity}</span></button>)}</div>}</div>
          {selectedCityId && <div className="border border-sand bg-sand-light/50 p-4 space-y-3"><div className="flex items-center justify-between"><h2 className="font-editorial text-lg font-bold">Suggestions for places to visit</h2><span className="text-[10px] uppercase tracking-wider text-charcoal-muted">{recommendations.length} available</span></div>{recommendationLoading ? <p className="text-xs text-charcoal-muted">Loading recommendations...</p> : recommendations.length === 0 ? <p className="text-xs text-charcoal-muted">No recommendations available for this destination yet.</p> : <div className="space-y-2">{recommendations.map((recommendation) => { const selected = selectedRecommendationIds.includes(recommendation.id); return <button type="button" key={recommendation.id} onClick={() => setSelectedRecommendationIds((current) => selected ? current.filter((id) => id !== recommendation.id) : [...current, recommendation.id])} className={`flex w-full items-center justify-between gap-3 border p-3 text-left ${selected ? 'border-teal bg-white' : 'border-sand bg-paper'}`}><span className="min-w-0"><span className="block truncate text-xs font-bold">{recommendation.name}</span><span className="block text-[10px] text-charcoal-muted">{recommendation.category} · {recommendation.durationMinutes} min</span></span><span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-teal">{selected ? 'Selected' : 'Add'}</span></button>})}</div>}</div>}
          <div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="trip-start" className="label"><CalendarDays className="inline h-3.5 w-3.5 mr-1" />Start date</label><input id="trip-start" required type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="field" /></div><div><label htmlFor="trip-end" className="label">End date</label><input id="trip-end" required type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="field" /></div></div>
          <div><label htmlFor="trip-description" className="label">Additional information <span className="font-normal normal-case tracking-normal">(optional)</span></label><textarea id="trip-description" value={description} onChange={(event) => setDescription(event.target.value)} rows={4} placeholder="What do you want this journey to feel like?" className="field" /></div>
          <button disabled={saving} className="inline-flex items-center gap-2 bg-teal px-5 py-3 text-xs font-bold uppercase tracking-wider text-paper hover:bg-teal-hover disabled:opacity-60">{saving && <Loader2 className="h-4 w-4 animate-spin" />}Create trip</button>
        </form>
      </main>
    </div>
  );
};

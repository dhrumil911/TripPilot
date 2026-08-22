import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, ArrowRight, MapPin, Sparkles } from 'lucide-react';
import api from '../api/axios';
import { DestinationCard } from '../components/DestinationCard';
import { Destination } from '../types/destination';
import { enrichDestination, getDestinationImage } from '../data/destinations';
import { formatCurrency } from '../utils/currency';
import { RouteVisualizer, RouteStop } from '../components/RouteVisualizer';

interface Recommendation {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedCost: string;
  durationMinutes: number;
}

interface CatalogActivity {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedCost: string;
  durationMinutes: number;
}

interface LandingTrip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  stops?: Array<{ id: string; cityName: string; country: string; startDate: string; endDate: string; stopOrder: number; activities?: Array<{ id: string; name: string }> }>;
}

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token') !== null;
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [destinationLoading, setDestinationLoading] = useState(true);
  const [destinationError, setDestinationError] = useState('');
  const [destinationSearch, setDestinationSearch] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('all');
  const [destinationSort, setDestinationSort] = useState<'name' | 'popularity'>('popularity');
  const [cityQuery, setCityQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<Destination | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedRecommendationIds, setSelectedRecommendationIds] = useState<string[]>([]);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [recommendationError, setRecommendationError] = useState('');
  const [upcomingTrips, setUpcomingTrips] = useState<LandingTrip[]>([]);
  const [upcomingLoading, setUpcomingLoading] = useState(false);
  const [planningPrompt, setPlanningPrompt] = useState('');
  const cityInputRef = useRef<HTMLInputElement>(null);
  const [activityQuery, setActivityQuery] = useState('');
  const [activities, setActivities] = useState<CatalogActivity[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState('');
  const [selectedStopId, setSelectedStopId] = useState('');
  const [attachingActivityId, setAttachingActivityId] = useState<string | null>(null);
  const [activitySuccess, setActivitySuccess] = useState('');

  useEffect(() => {
    api.get('/search/cities')
      .then((response) => {
        const cities = (response.data.cities || []).map((city: { id: string; cityName: string; country: string; popularity: string }) => enrichDestination({
          id: city.id,
          city: city.cityName,
          country: city.country,
          popularity: city.popularity,
        }));
        setDestinations(cities);
      })
      .catch(() => setDestinationError('Destinations are unavailable right now.'))
      .finally(() => setDestinationLoading(false));
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchUpcomingTrips = () => {
      setUpcomingLoading(true);
      api.get('/trips').then((response) => setUpcomingTrips(response.data.trips || [])).catch(() => setUpcomingTrips([])).finally(() => setUpcomingLoading(false));
    };
    fetchUpcomingTrips();
    window.addEventListener('focus', fetchUpcomingTrips);
    return () => window.removeEventListener('focus', fetchUpcomingTrips);
  }, [isLoggedIn]);

  useEffect(() => {
    if (!selectedCity) return;
    setRecommendationLoading(true);
    setRecommendationError('');
    api.get(`/search/cities/${selectedCity.id}/recommendations`)
      .then((response) => setRecommendations(response.data.recommendations || []))
      .catch(() => setRecommendationError('Recommendations are unavailable right now.'))
      .finally(() => setRecommendationLoading(false));
  }, [selectedCity]);

  const selectCity = (destination: Destination) => {
    setSelectedCity(destination);
    setCityQuery(destination.city);
    setSelectedRecommendationIds([]);
    const matchingStop = upcomingTrips.flatMap((trip) => trip.stops || []).find((stop) => stop.cityName.trim().toLocaleLowerCase() === destination.city.trim().toLocaleLowerCase());
    if (matchingStop) setSelectedStopId(matchingStop.id);
  };

  const planSelectedCity = () => {
    if (!selectedCity) return;
    const recommendationQuery = selectedRecommendationIds.length ? `&recommendations=${selectedRecommendationIds.join(',')}` : '';
    const target = `/trips/new?destination=${encodeURIComponent(selectedCity.city)}${recommendationQuery}`;
    navigate(isLoggedIn ? target : `/register?destination=${encodeURIComponent(selectedCity.city)}${recommendationQuery}`);
  };

  const matchingCities = destinations.filter((destination) => `${destination.city} ${destination.country}`.toLocaleLowerCase().includes(cityQuery.trim().toLocaleLowerCase()));
  const upcomingStops = upcomingTrips.flatMap((trip) => (trip.stops || []).map((stop) => ({ ...stop, tripId: trip.id }))).filter((stop) => new Date(stop.endDate) >= new Date()).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  const routeStops = [...(upcomingTrips[0]?.stops || [])].sort((a, b) => a.stopOrder - b.stopOrder);
  const selectedStop = routeStops.find((stop) => stop.id === selectedStopId) || routeStops[0];
  const heroCity = selectedCity?.city || upcomingStops[0]?.cityName || destinations[0]?.city || '';
  const heroCountry = selectedCity?.country || upcomingStops[0]?.country || destinations[0]?.country || '';
  const featuredRoute = routeStops.map((stop) => stop.cityName);
  const visibleDestinations = destinations
    .filter((destination) => `${destination.city} ${destination.country}`.toLocaleLowerCase().includes(destinationSearch.trim().toLocaleLowerCase()))
    .filter((destination) => destinationCountry === 'all' || destination.country === destinationCountry)
    .sort((a, b) => destinationSort === 'name' ? a.city.localeCompare(b.city) : (a.popularity || '').localeCompare(b.popularity || ''));
  const previousTrips = upcomingTrips.filter((trip) => new Date(trip.endDate) < new Date());

  const handleStartPlanning = () => {
    if (!selectedCity) {
      setPlanningPrompt('Choose a destination to start planning.');
      cityInputRef.current?.focus();
      return;
    }
    planSelectedCity();
  };

  useEffect(() => {
    if (selectedStop && !selectedStopId) setSelectedStopId(selectedStop.id);
  }, [selectedStop?.id, selectedStopId]);

  useEffect(() => {
    const city = selectedCity?.city || selectedStop?.cityName;
    if (!city) {
      setActivities([]);
      return;
    }
    const matchedCity = destinations.find((destination) => destination.city.toLocaleLowerCase() === city.toLocaleLowerCase());
    if (!matchedCity) return;
    setActivityLoading(true);
    setActivityError('');
    api.get(`/search/cities/${matchedCity.id}/recommendations`)
      .then((response) => setActivities(response.data.recommendations || []))
      .catch(() => setActivityError('We could not load activities right now.'))
      .finally(() => setActivityLoading(false));
  }, [destinations, selectedCity?.city, selectedStop?.id, selectedStop?.cityName]);

  const visibleActivities = activities.filter((activity) => `${activity.name} ${activity.category} ${activity.description}`.toLocaleLowerCase().includes(activityQuery.trim().toLocaleLowerCase()));

  const addActivityToStop = async (activity: CatalogActivity) => {
    if (!selectedStop) {
      setActivityError('Add a destination to your trip before adding activities.');
      return;
    }
    setAttachingActivityId(activity.id);
    setActivityError('');
    setActivitySuccess('');
    try {
      const response = await api.post(`/stops/${selectedStop.id}/activities`, activity);
      setUpcomingTrips((currentTrips) => currentTrips.map((trip) => ({ ...trip, stops: trip.stops?.map((stop) => stop.id === selectedStop.id ? { ...stop, activities: [...(stop.activities || []), response.data.activity] } : stop) })));
      setActivitySuccess(`${activity.name} added to ${selectedStop.cityName}.`);
    } catch (error: any) {
      setActivityError(error.response?.data?.message || 'We could not add that activity.');
    } finally {
      setAttachingActivityId(null);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-charcoal font-sans">
      
      {/* 1. Header Navigation */}
      <header className="border-b border-sand px-4 sm:px-6 lg:px-8 py-4 sticky top-0 bg-paper/90 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-teal font-editorial font-bold text-xl tracking-tight">
            <Compass className="h-5.5 w-5.5 text-coral" />
            <span>TripPilot</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-wider text-charcoal-muted">
            <a href="#discover" className="hover:text-teal transition-colors">Explore</a>
            <a href="#how-it-works" className="hover:text-teal transition-colors">How It Works</a>
            <a href="#features" className="hover:text-teal transition-colors">Features</a>
          </nav>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="bg-teal hover:bg-teal-hover text-paper px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-xs font-bold uppercase tracking-wider text-charcoal hover:text-teal transition-colors">
                  Log in
                </Link>
                <button
                  onClick={handleStartPlanning}
                  className="bg-teal hover:bg-teal-hover text-paper px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Start Planning
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12 lg:py-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Column */}
          <div className="lg:col-span-7 space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-editorial font-bold leading-tight tracking-tight text-charcoal">
              Plan the journey.<br />
              <span className="italic font-normal text-teal">Not just the destination.</span>
            </h1>
            <p className="text-charcoal-muted text-base max-w-xl leading-relaxed">
              Build personalized multi-city trips, discover curated local experiences, manage your budget in real time, and share every detail of the journey with friends.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleStartPlanning}
                className="bg-teal hover:bg-teal-hover text-paper font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded transition-colors shadow-md flex items-center justify-center space-x-2"
              >
                <span>Start Planning</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#discover"
                className="border border-sand hover:border-charcoal text-charcoal font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded text-center transition-colors"
              >
                Explore Trips
              </a>
            </div>

            {/* Travel Metadata Widget */}
            <div className="border-t border-sand pt-6 max-w-md">
              <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-extrabold text-coral mb-2">
                <span>Featured Route</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-sm font-bold">
                {featuredRoute.length > 0 ? featuredRoute.map((city, index) => <React.Fragment key={`${city}-${index}`}><span>{city}</span>{index < featuredRoute.length - 1 && <span className="text-gray-400">&rarr;</span>}</React.Fragment>) : <span className="text-charcoal-muted font-normal text-xs">Choose a route from the destination guide below.</span>}
              </div>
            </div>

            <div className="max-w-xl space-y-3">
              <label htmlFor="landing-city" className="text-[10px] font-extrabold uppercase tracking-widest text-coral">Where are you going?</label>
              <div className="relative">
                <input ref={cityInputRef} id="landing-city" value={cityQuery} onChange={(event) => { setCityQuery(event.target.value); setPlanningPrompt(''); }} placeholder="Search a city" className="field" />
                {planningPrompt && <p role="alert" className="mt-2 text-xs text-coral">{planningPrompt}</p>}
                {cityQuery && matchingCities.length > 0 && <div className="absolute z-10 mt-1 w-full border border-sand bg-paper shadow-md">{matchingCities.slice(0, 5).map((destination) => <button type="button" key={destination.id} onClick={() => selectCity(destination)} className="flex w-full items-center gap-3 border-b border-sand px-3 py-2 text-left last:border-0 hover:bg-sand-light"><img src={destination.imageUrl || getDestinationImage(destination.city)} alt="" className="h-9 w-12 object-cover" onError={(event) => { event.currentTarget.src = getDestinationImage(''); }} /><span className="text-xs font-bold">{destination.city}, {destination.country}</span></button>)}</div>}
                {cityQuery && !matchingCities.length && <p className="absolute z-10 mt-1 w-full border border-sand bg-paper p-3 text-xs text-charcoal-muted shadow-md">No destinations found.</p>}
              </div>
            </div>
          </div>

          {/* Hero Right Column: Editorial Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full max-w-md mx-auto aspect-square bg-sand/30 rounded-2xl p-6 border border-sand">
              {/* Main Visual Image */}
              <div className="absolute inset-6 rounded-xl overflow-hidden shadow-lg border border-sand">
                <img
                  src={getDestinationImage(heroCity)}
                  alt={heroCity ? `${heroCity}, ${heroCountry}` : 'Travel destination'}
                  className="w-full h-full object-cover grayscale-[20%] hover:scale-105 transition-transform duration-700"
                   onError={(event) => { event.currentTarget.src = getDestinationImage(''); }}
                />
              </div>

              {/* Float Overlay 1 */}
              <div className="absolute -top-4 -left-4 bg-paper border border-sand p-3.5 rounded-lg shadow-md max-w-[180px] space-y-1 animate-fadeIn">
                <div className="flex items-center space-x-1 text-coral font-bold text-[10px] uppercase tracking-wider">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span>Next Stop</span>
                </div>
                <h4 className="font-bold text-xs">{selectedCity?.city || destinations[1]?.city || 'Your next stop'}</h4>
                <p className="text-[10px] text-gray-500">A place worth making time for</p>
              </div>

              {/* Float Overlay 2 */}
              <div className="absolute -bottom-4 -right-4 bg-paper border border-sand p-3.5 rounded-lg shadow-md max-w-[160px] space-y-1">
                <div className="flex items-center space-x-1 text-teal font-bold text-[10px] uppercase tracking-wider">
                  <span className="h-3 w-3 text-green-700 shrink-0">₹</span>
                  <span>Category splits</span>
                </div>
                <div className="w-full bg-sand-light h-1.5 rounded-full overflow-hidden">
                  <div className="bg-teal h-full w-[45%]" />
                </div>
                <p className="text-[9px] text-gray-400">Track every category as you travel</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="border-b border-sand px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div><span className="text-[10px] font-extrabold uppercase tracking-widest text-coral">Planning, made personal</span><h2 className="mt-2 text-3xl font-editorial font-bold">{selectedCity ? `Recommended for ${selectedCity.city}` : 'Choose a city to begin'}</h2><p className="mt-2 text-xs text-charcoal-muted">{selectedCity ? 'Keep the places that fit your journey. We will carry them into your new trip.' : 'Search above or choose a destination card to see places worth stopping for.'}</p></div>
          <div>{!selectedCity ? <p className="border border-dashed border-sand p-8 text-center text-xs text-charcoal-muted">Select a destination to load recommendations.</p> : recommendationLoading ? <p className="p-8 text-xs text-charcoal-muted">Finding places worth stopping for...</p> : recommendationError ? <p role="alert" className="p-8 text-xs text-coral">{recommendationError}</p> : recommendations.length === 0 ? <p className="p-8 text-xs text-charcoal-muted">No recommendations found for this city yet.</p> : <div className="space-y-2">{recommendations.map((recommendation) => { const selected = selectedRecommendationIds.includes(recommendation.id); return <div key={recommendation.id} className={`flex items-center justify-between gap-4 border p-3 ${selected ? 'border-teal bg-sand-light' : 'border-sand bg-paper'}`}><div className="min-w-0"><p className="font-bold text-sm">{recommendation.name}</p><p className="text-[11px] text-charcoal-muted">{recommendation.category} · {recommendation.durationMinutes} min · {formatCurrency(recommendation.estimatedCost)}</p><p className="mt-1 text-xs text-charcoal-muted">{recommendation.description}</p></div><button type="button" onClick={() => setSelectedRecommendationIds((current) => selected ? current.filter((id) => id !== recommendation.id) : [...current, recommendation.id])} className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-teal">{selected ? 'Remove' : 'Add to trip'}</button></div>})}<button type="button" onClick={planSelectedCity} className="mt-3 bg-teal px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-paper hover:bg-teal-hover">Plan {selectedCity.city}</button></div>}</div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><span className="text-[10px] font-extrabold uppercase tracking-widest text-coral">Your journey</span><h2 className="mt-2 text-3xl font-editorial font-bold">Upcoming stops</h2>{!isLoggedIn || upcomingStops.length === 0 ? <div className="mt-5 border border-dashed border-sand p-8 text-center text-xs text-charcoal-muted">Your next adventure starts here. <button type="button" onClick={handleStartPlanning} className="ml-1 font-bold text-teal hover:text-coral">Plan a trip →</button></div> : <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{upcomingStops.slice(0, 4).map((stop) => <Link key={`${stop.tripId}-${stop.id}`} to={`/trips/${stop.tripId}`} className="flex items-center gap-3 border border-sand bg-paper p-3 hover:border-teal"><img src={getDestinationImage(stop.cityName)} alt="" className="h-12 w-16 shrink-0 object-cover" onError={(event) => { event.currentTarget.src = getDestinationImage(''); }} /><div className="min-w-0"><p className="truncate font-bold text-sm">{stop.cityName}, {stop.country}</p><p className="text-[11px] text-charcoal-muted">{new Date(stop.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(stop.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p></div></Link>)}</div>}</div></section>

      {/* 3. Sample Journey Route Visual Preview */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-sand-light border-y border-sand">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-coral">Route Visualizer</span>
            <h2 className="text-3xl font-editorial font-bold">The anatomy of an itinerary</h2>
            <p className="text-charcoal-muted text-xs">TripPilot translates linear lists into beautiful step-by-step route timelines.</p>
          </div>

          <RouteVisualizer stops={routeStops as RouteStop[]} loading={isLoggedIn && upcomingLoading} />
        </div>
      </section>

      {/* 4. Feature Story Section */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto space-y-24">
        
        {/* Story 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal">01 / Discover</span>
            <h3 className="text-2xl sm:text-3xl font-editorial font-bold text-charcoal">Find places worth stopping for.</h3>
            <p className="text-charcoal-muted text-xs leading-relaxed">
              Explore custom local experiences and food guides curated for traveler catalogs. Instantly search and browse sightseeing landmarks by estimated budget, duration, and activity tags.
            </p>
          </div>
          <div className="lg:col-span-7 bg-sand-light p-6 rounded-xl border border-sand">
            <div className="bg-paper p-4 rounded-lg shadow-sm border border-sand space-y-3 max-w-md mx-auto">
              <div className="flex items-center justify-between border-b border-sand pb-2 gap-3">
                <span className="text-xs font-bold text-teal flex items-center space-x-1">
                  <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                  <span>Activity Selector Catalog</span>
                </span>
                <span className="text-[10px] text-gray-400 shrink-0">{activityLoading ? 'Loading...' : `${visibleActivities.length} results`}</span>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="landing-stop" className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted shrink-0">Add activity to</label>
                <select id="landing-stop" value={selectedStop?.id || ''} onChange={(event) => setSelectedStopId(event.target.value)} disabled={!routeStops.length} className="min-w-0 flex-1 rounded border border-sand bg-white px-2 py-1 text-xs">
                  {!routeStops.length && <option value="">Select a trip stop</option>}
                  {routeStops.map((stop) => <option key={stop.id} value={stop.id}>{stop.cityName}, {stop.country}</option>)}
                </select>
              </div>
              <input aria-label="Search activities" value={activityQuery} onChange={(event) => setActivityQuery(event.target.value)} placeholder={selectedStop ? `Search ${selectedStop.cityName} activities` : 'Search activities'} className="w-full rounded border border-sand px-2.5 py-1.5 text-xs" />
              {activitySuccess && <p className="text-[10px] text-green-700" role="status">{activitySuccess}</p>}
              {activityError && <p className="text-[10px] text-coral" role="alert">{activityError}</p>}
              {activityLoading ? <div className="space-y-2"><div className="h-12 animate-pulse rounded border border-sand bg-sand-light" /><div className="h-12 animate-pulse rounded border border-sand bg-sand-light" /></div> : visibleActivities.length === 0 ? <p className="border border-dashed border-sand p-4 text-center text-[10px] text-charcoal-muted">{selectedStop ? 'No activities found for this destination.' : 'Select a trip stop to browse activities.'}</p> : <div className="space-y-2">{visibleActivities.slice(0, 3).map((activity) => <div key={activity.id} className="border border-sand rounded p-3 flex justify-between items-center gap-3 text-xs"><div className="min-w-0"><h5 className="font-bold truncate">{activity.name}</h5><p className="text-[10px] text-gray-400">{activity.category} · {activity.durationMinutes} min · {formatCurrency(activity.estimatedCost)}</p></div><button onClick={() => addActivityToStop(activity)} disabled={!selectedStop || attachingActivityId !== null} className="bg-teal text-paper px-2.5 py-1 rounded text-[10px] font-bold shrink-0 disabled:opacity-50">{attachingActivityId === activity.id ? 'Adding...' : 'Add to stop'}</button></div>)}</div>}
            </div>
          </div>
        </div>

        {/* Story 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center lg:flex-row-reverse">
          <div className="lg:col-span-5 lg:order-last space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal">02 / Design</span>
            <h3 className="text-2xl sm:text-3xl font-editorial font-bold text-charcoal">Turn places into a journey.</h3>
            <p className="text-charcoal-muted text-xs leading-relaxed">
              Build your stops chronological hierarchy. Sort arrivals, departures, and cities with simple sorting buttons that sync layout sequences immediately.
            </p>
          </div>
          <div className="lg:col-span-7 bg-sand-light p-6 rounded-xl border border-sand">
            <div className="bg-paper p-4 rounded-lg shadow-sm border border-sand space-y-2 max-w-md mx-auto text-xs">
              {upcomingLoading ? <><div className="h-10 animate-pulse rounded bg-sand-light" /><div className="h-10 animate-pulse rounded bg-sand-light" /></> : routeStops.length === 0 ? <p className="border border-dashed border-sand p-5 text-center text-charcoal-muted">Start designing your journey. Add a destination to begin building your itinerary.</p> : routeStops.map((stop, index) => <div key={stop.id} className="flex items-center justify-between bg-gray-50 border border-sand p-2.5 rounded gap-3"><div className="flex items-center space-x-2 min-w-0"><span className="font-black text-gray-400 shrink-0">{String(index + 1).padStart(2, '0')}</span><span className="font-bold truncate">{stop.cityName}, {stop.country}</span></div><span className="text-[10px] text-gray-400 font-semibold shrink-0">{stop.startDate && stop.endDate ? `${Math.max(1, Math.ceil((new Date(stop.endDate).getTime() - new Date(stop.startDate).getTime()) / 86400000))} days` : 'Dates not set'}</span></div>)}
            </div>
          </div>
        </div>

        {/* Story 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal">03 / Control</span>
            <h3 className="text-2xl sm:text-3xl font-editorial font-bold text-charcoal">Know what the journey will cost.</h3>
            <p className="text-charcoal-muted text-xs leading-relaxed">
              Track costs as they accumulate. Group expenses by category (stay, meals, transport, sightseeing) and visualize splits using clear, interactive progress indicators.
            </p>
          </div>
          <div className="lg:col-span-7 bg-sand-light p-6 rounded-xl border border-sand">
            <div className="bg-paper p-5 rounded-lg shadow-sm border border-sand space-y-4 max-w-md mx-auto text-xs">
              <div className="flex justify-between border-b border-sand pb-2 font-bold">
                <span>Total Spent</span>
                <span className="text-teal font-extrabold">Live totals</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px]">
                  <span>Stay & Lodging</span>
                    <span>Category breakdown</span>
                </div>
                <div className="w-full bg-sand h-2 rounded-full overflow-hidden">
                  <div className="bg-teal h-full w-[43%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* 5. How It Works Sequential Section */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 py-20 bg-sand border-y border-sand/40">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-md mx-auto space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-coral">Workflow</span>
            <h2 className="text-3xl font-editorial font-bold">How TripPilot works</h2>
            <p className="text-charcoal-muted text-xs">Five simple steps to plan your perfect multi-city journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 pt-4">
            {[
              { step: '01', title: 'Choose destinations', desc: 'Select stops and input dates.' },
              { step: '02', title: 'Build timeline', desc: 'Map out your daily activities.' },
              { step: '03', title: 'Add experiences', desc: 'Attach local sights & foods.' },
              { step: '04', title: 'Track budget', desc: 'Monitor category spent splits.' },
              { step: '05', title: 'Share & Clone', desc: 'Generate copyable shared links.' },
            ].map((item, idx) => (
              <div key={idx} className="bg-paper p-5 rounded-xl border border-sand/60 space-y-3">
                <span className="text-3xl font-editorial italic font-normal text-coral">{item.step}</span>
                <h4 className="font-bold text-sm text-charcoal">{item.title}</h4>
                <p className="text-xs text-charcoal-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Destination Discovery Explorer */}
      <section id="discover" className="px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-coral">Discovery</span>
            <h2 className="text-3xl font-editorial font-bold">Inspiration for your next trip</h2>
          </div>
          <p className="text-charcoal-muted text-xs max-w-sm">
            Boutique travel catalogs compiled to inspire your stops, activities, and budget planning.
          </p>
        </div>

        {!destinationLoading && !destinationError && destinations.length > 0 && <div className="flex flex-col gap-3 pt-4 sm:flex-row"><input aria-label="Search destinations" value={destinationSearch} onChange={(event) => setDestinationSearch(event.target.value)} placeholder="Search destinations" className="field" /><select aria-label="Filter destinations by country" value={destinationCountry} onChange={(event) => setDestinationCountry(event.target.value)} className="field sm:max-w-xs"><option value="all">All countries</option>{Array.from(new Set(destinations.map((destination) => destination.country))).sort().map((country) => <option key={country} value={country}>{country}</option>)}</select><select aria-label="Sort destinations" value={destinationSort} onChange={(event) => setDestinationSort(event.target.value as 'name' | 'popularity')} className="field sm:max-w-xs"><option value="popularity">Group by popularity</option><option value="name">Sort by name</option></select></div>}
        {destinationLoading && <p className="pt-4 text-xs text-charcoal-muted">Loading destinations...</p>}
        {destinationError && <p role="alert" className="pt-4 text-xs text-coral">{destinationError}</p>}
        {!destinationLoading && !destinationError && destinations.length === 0 && <p className="pt-4 text-xs text-charcoal-muted">No destinations found.</p>}
        {!destinationLoading && !destinationError && visibleDestinations.length === 0 && <p className="pt-4 text-xs text-charcoal-muted">No destinations match your search.</p>}
        {!destinationLoading && !destinationError && visibleDestinations.length > 0 && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">{visibleDestinations.map((destination) => <DestinationCard key={destination.id} destination={destination} onSelect={selectCity} />)}</div>}
      </section>

      {isLoggedIn && <section className="border-t border-sand px-4 py-12 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><span className="text-[10px] font-extrabold uppercase tracking-widest text-coral">Your archive</span><h2 className="mt-2 text-3xl font-editorial font-bold">Previous trips</h2>{previousTrips.length === 0 ? <p className="mt-4 text-xs text-charcoal-muted">Your completed journeys will appear here.</p> : <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{previousTrips.map((trip) => { const stop = trip.stops?.[0]; return <Link key={trip.id} to={`/trips/${trip.id}`} className="flex gap-3 border border-sand bg-paper p-3 hover:border-teal"><img src={getDestinationImage(stop?.cityName)} alt={stop ? `${stop.cityName}, ${stop.country}` : trip.title} className="h-20 w-24 shrink-0 object-cover" /><div className="min-w-0"><h3 className="truncate font-editorial text-lg font-bold">{trip.title}</h3><p className="truncate text-xs text-charcoal-muted">{stop ? `${stop.cityName}, ${stop.country}` : 'Multi-stop journey'}</p><p className="mt-2 text-[10px] text-charcoal-muted">{new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p></div></Link>; })}</div>}</div></section>}

      {/* 7. Footer */}
      <footer className="border-t border-sand py-12 px-4 sm:px-6 lg:px-8 bg-paper">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-charcoal-muted">
          <div className="flex items-center space-x-2 text-teal font-editorial font-bold text-lg">
            <Compass className="h-4.5 w-4.5 text-coral" />
            <span>TripPilot</span>
          </div>
          <div>
            <span>&copy; {new Date().getFullYear()} TripPilot. Premium travel journal planner interface.</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

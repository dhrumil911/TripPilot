import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, ArrowRight, MapPin, Sparkles } from 'lucide-react';
import api from '../api/axios';
import { DestinationCard } from '../components/DestinationCard';
import { Destination } from '../types/destination';
import { enrichDestination, getDestinationImage } from '../data/destinations';
import { formatCurrency } from '../utils/currency';
import { RouteVisualizer, RouteStop } from '../components/RouteVisualizer';
import { getCuratedActivitiesForCity } from '../data/activities';

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
  stops?: Array<{ 
    id: string; 
    cityName: string; 
    country: string; 
    startDate: string; 
    endDate: string; 
    stopOrder: number; 
    activities?: Array<{ id: string; name: string }> 
  }>;
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
      api.get('/trips')
        .then((response) => setUpcomingTrips(response.data.trips || []))
        .catch(() => setUpcomingTrips([]))
        .finally(() => setUpcomingLoading(false));
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
    const matchingStop = upcomingTrips
      .flatMap((trip) => trip.stops || [])
      .find((stop) => stop.cityName.trim().toLocaleLowerCase() === destination.city.trim().toLocaleLowerCase());
    if (matchingStop) setSelectedStopId(matchingStop.id);
  };

  const planSelectedCity = () => {
    if (!selectedCity) return;
    const recs = selectedRecommendationIds.length ? `&recommendations=${selectedRecommendationIds.join(',')}` : '';
    const target = `/dashboard?destination=${encodeURIComponent(selectedCity.city)}${recs}`;
    navigate(isLoggedIn ? target : `/register?destination=${encodeURIComponent(selectedCity.city)}${recs}`);
  };

  const matchingCities = destinations.filter((destination) => 
    `${destination.city} ${destination.country}`.toLocaleLowerCase().includes(cityQuery.trim().toLocaleLowerCase())
  );
  
  const upcomingStops = upcomingTrips
    .flatMap((trip) => (trip.stops || []).map((stop) => ({ ...stop, tripId: trip.id })))
    .filter((stop) => new Date(stop.endDate) >= new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  
  const routeStops = [...(upcomingTrips[0]?.stops || [])]
    .map(stop => ({ ...stop, tripId: upcomingTrips[0]?.id }))
    .sort((a, b) => a.stopOrder - b.stopOrder);
  const selectedStop = routeStops.find((stop) => stop.id === selectedStopId) || routeStops[0];
  
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

  // Reset the search query when selected stop changes
  useEffect(() => {
    setActivityQuery('');
  }, [selectedStop?.id]);

  useEffect(() => {
    const city = selectedStop?.cityName || selectedCity?.city;
    if (!city) {
      setActivities([]);
      return;
    }
    setActivityLoading(true);
    setActivityError('');
    try {
      const data = getCuratedActivitiesForCity(city);
      setActivities(data);
    } catch (err) {
      setActivityError('We could not load activities right now.');
    } finally {
      setActivityLoading(false);
    }
  }, [selectedCity?.city, selectedStop?.cityName]);

  const visibleActivities = activities.filter((activity) => 
    `${activity.name} ${activity.category} ${activity.description}`.toLocaleLowerCase().includes(activityQuery.trim().toLocaleLowerCase())
  );

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
      setUpcomingTrips((currentTrips) => currentTrips.map((trip) => ({ 
        ...trip, 
        stops: trip.stops?.map((stop) => stop.id === selectedStop.id 
          ? { ...stop, activities: [...(stop.activities || []), response.data.activity] } 
          : stop
        ) 
      })));
      setActivitySuccess(`${activity.name} added to ${selectedStop.cityName}.`);
    } catch (error: any) {
      setActivityError(error.response?.data?.message || 'We could not add that activity.');
    } finally {
      setAttachingActivityId(null);
    }
  };

  const heroCity = selectedCity?.city || upcomingStops[0]?.cityName || destinations[0]?.city || 'Udaipur';
  const heroCountry = selectedCity?.country || upcomingStops[0]?.country || destinations[0]?.country || 'India';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (matchingCities.length > 0) {
        selectCity(matchingCities[0]);
      } else if (selectedCity) {
        planSelectedCity();
      } else {
        setPlanningPrompt('Please select a destination from the list.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-paper text-charcoal font-sans selection:bg-coral/25 selection:text-charcoal">
      
      {/* 1. Header Navigation */}
      <header className="border-b border-sand px-3 sm:px-6 lg:px-8 py-4 sticky top-0 bg-paper/90 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-1.5 text-teal font-editorial font-bold text-lg sm:text-xl tracking-tight hover:opacity-90 transition-opacity">
            <Compass className="h-4.5 w-4.5 sm:h-5.5 sm:w-5.5 text-coral" />
            <span className="font-editorial italic font-normal text-teal">Trip</span>
            <span className="font-editorial font-bold -ml-1">Pilot</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal-muted">
            <a href="#discover" className="hover:text-teal transition-colors">Explore</a>
            <a href="#how-it-works" className="hover:text-teal transition-colors">How It Works</a>
            <a href="#features" className="hover:text-teal transition-colors">Features</a>
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="bg-teal hover:bg-teal-hover text-paper px-3 sm:px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-[10px] font-bold uppercase tracking-wider text-charcoal hover:text-teal transition-colors">
                  Log in
                </Link>
                <button
                  onClick={handleStartPlanning}
                  className="bg-teal hover:bg-teal-hover text-paper px-3 sm:px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm"
                >
                  <span className="hidden sm:inline">Start Planning</span>
                  <span className="inline sm:hidden">Plan</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-6 lg:py-10 max-w-7xl mx-auto border-b border-sand min-h-[calc(100vh-80px)] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* Hero Left Column */}
          <div className="lg:col-span-7 space-y-5 lg:space-y-6">
            <div className="space-y-2">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-coral block">
                Travel planning, reimagined
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-editorial font-bold leading-none tracking-tight text-charcoal">
                Plan the journey.<br />
                <span className="italic font-normal text-teal">Not just the destination.</span>
              </h1>
            </div>
            
            <p className="text-charcoal-muted text-sm max-w-lg leading-relaxed font-sans font-normal">
              TripPilot is a premium travel journal and multi-city planner built for curious travelers. Map stops, design vertical timelines, collaborate on activities, and keep budget estimates in sync.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={handleStartPlanning}
                className="bg-teal hover:bg-teal-hover text-paper font-bold text-[10px] uppercase tracking-wider py-3.5 px-8 rounded-sm transition-colors shadow-md flex items-center justify-center space-x-2"
              >
                <span>Start Planning</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#discover"
                className="border border-sand hover:border-charcoal text-charcoal font-bold text-[10px] uppercase tracking-wider py-3.5 px-8 rounded-sm text-center transition-colors bg-white/40"
              >
                Explore Catalog
              </a>
            </div>

            {/* Travel Metadata Widget */}
            <div className="border-t border-sand pt-4 max-w-md">
              <span className="text-[9px] uppercase tracking-widest font-extrabold text-coral mb-2 block">
                Featured Route
              </span>
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold font-sans">
                {featuredRoute.length > 0 ? (
                  featuredRoute.map((city, index) => (
                    <React.Fragment key={`${city}-${index}`}>
                      <span>{city}</span>
                      {index < featuredRoute.length - 1 && <span className="text-gray-400 font-normal">&rarr;</span>}
                    </React.Fragment>
                  ))
                ) : (
                  <span className="text-charcoal-muted font-normal">Ahmedabad &rarr; Mumbai &rarr; Goa ( Curated Route )</span>
                )}
              </div>
            </div>

            {/* Autocomplete Input Search */}
            <div className="max-w-md space-y-1.5 pt-1">
              <label htmlFor="landing-city" className="text-[9px] font-extrabold uppercase tracking-widest text-teal block">
                Where are you going?
              </label>
              <div className="relative">
                <input 
                  ref={cityInputRef} 
                  id="landing-city" 
                  value={cityQuery} 
                  onChange={(event) => { setCityQuery(event.target.value); setPlanningPrompt(''); }} 
                  onKeyDown={handleKeyDown}
                  placeholder="Type a city name (e.g. Udaipur)" 
                  className="field rounded-sm" 
                />
                {planningPrompt && <p role="alert" className="mt-2 text-xs text-coral font-bold">{planningPrompt}</p>}
                
                {cityQuery && matchingCities.length > 0 && (
                  <div className="absolute z-30 mt-1 w-full border border-sand bg-surface shadow-lg rounded-sm overflow-hidden divide-y divide-sand/40 max-h-60 overflow-y-auto">
                    {matchingCities.slice(0, 5).map((destination) => (
                      <button 
                        type="button" 
                        key={destination.id} 
                        onClick={() => selectCity(destination)} 
                        className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-paper transition-colors duration-200"
                      >
                        <img 
                          src={destination.imageUrl || getDestinationImage(destination.city, destination.country)} 
                          alt="" 
                          className="h-10 w-14 object-cover shrink-0 rounded-sm border border-sand" 
                          onError={(event) => { event.currentTarget.src = getDestinationImage('', ''); }} 
                        />
                        <div>
                          <span className="text-xs font-bold block text-charcoal">{destination.city}</span>
                          <span className="text-[10px] text-charcoal-muted font-semibold">{destination.country}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {cityQuery && !matchingCities.length && (
                  <p className="absolute z-30 mt-1 w-full border border-sand bg-surface p-4 text-xs text-charcoal-muted shadow-lg rounded-sm">
                    No destinations match your search.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Hero Right Column: Editorial Collage */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0 py-6 px-4 flex items-center justify-center">
            <div className="relative w-full max-w-sm lg:max-w-[340px] mx-auto aspect-[4/5] bg-surface rounded-sm p-3 border border-sand shadow-sm">
              <div className="w-full h-full rounded-sm overflow-hidden relative border border-sand bg-sand-light">
                <img
                  src={getDestinationImage(heroCity, heroCountry)}
                  alt={heroCity ? `${heroCity}, ${heroCountry}` : 'Travel destination'}
                  className="w-full h-full object-cover grayscale-[10%] hover:scale-102 hover:grayscale-0 transition-all duration-[1200ms]"
                  onError={(event) => { event.currentTarget.src = getDestinationImage('', ''); }}
                />
              </div>

              {/* Float Overlay 1 */}
              <div className="absolute top-2 left-2 lg:-top-4 lg:-left-4 bg-surface border border-sand p-3.5 lg:p-4 rounded-sm shadow-md max-w-[170px] sm:max-w-[200px] space-y-1.5 animate-fadeIn">
                <div className="flex items-center space-x-1.5 text-coral font-bold text-[9px] uppercase tracking-wider">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span>Featured Destination</span>
                </div>
                <h4 className="font-editorial text-sm sm:text-base font-bold leading-tight text-charcoal">{selectedCity?.city || 'Udaipur, India'}</h4>
                <p className="text-[9px] sm:text-[10px] text-charcoal-muted leading-relaxed font-sans">{selectedCity?.description || 'Lake palaces, boat rides, and heritage walk trails.'}</p>
              </div>

              {/* Float Overlay 2 */}
              <div className="absolute bottom-2 right-2 lg:-bottom-4 lg:-right-4 bg-surface border border-sand p-3.5 lg:p-4 rounded-sm shadow-md max-w-[150px] sm:max-w-[180px] space-y-2">
                <div className="flex items-center space-x-1.5 text-teal font-bold text-[9px] uppercase tracking-wider">
                  <span className="text-[11px] text-green-700 shrink-0 font-extrabold font-sans">₹</span>
                  <span>Expenses tracker</span>
                </div>
                <div className="w-full bg-sand h-1.5 rounded-full overflow-hidden">
                  <div className="bg-teal h-full w-[45%]" />
                </div>
                <p className="text-[8px] sm:text-[9px] text-charcoal-muted leading-none">Automated category breakdowns</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Recommended Stops / Custom Planner Hook */}
      <section className="border-b border-sand px-4 py-16 sm:px-6 lg:px-8 bg-surface">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1fr_1.5fr] items-start">
          <div className="space-y-4">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-coral block">
              Planning, made personal
            </span>
            <h2 className="text-3xl font-editorial font-bold text-charcoal leading-tight">
              {selectedCity ? `Curated for ${selectedCity.city}` : 'Choose a destination to begin'}
            </h2>
            <p className="text-xs text-charcoal-muted leading-relaxed max-w-md font-sans">
              {selectedCity 
                ? 'Save these suggested stops and activities. We will carry them directly into your active itinerary builder.' 
                : 'Select Udaipur, Jaipur, Delhi, or Kochi to instantly preview local activities, timeline stops, and budget recommendations.'}
            </p>
          </div>
          
          <div className="bg-paper border border-sand p-6 rounded-sm">
            {!selectedCity ? (
              <div className="border border-dashed border-sand p-12 text-center text-xs text-charcoal-muted font-sans rounded-sm">
                No destination selected. Use the search bar above to load recommendations.
              </div>
            ) : recommendationLoading ? (
              <p className="p-8 text-center text-xs text-charcoal-muted animate-pulse font-bold">
                Resolving smart stop suggestions...
              </p>
            ) : recommendationError ? (
              <p role="alert" className="p-8 text-center text-xs text-coral font-semibold">{recommendationError}</p>
            ) : recommendations.length === 0 ? (
              <p className="p-8 text-center text-xs text-charcoal-muted">No curated activities found for this city.</p>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                  {recommendations.map((recommendation) => {
                    const selected = selectedRecommendationIds.includes(recommendation.id);
                    return (
                      <div 
                        key={recommendation.id} 
                        className={`flex items-start justify-between gap-4 border p-4 rounded-sm transition-all duration-300 ${
                          selected ? 'border-teal bg-sand/20' : 'border-sand bg-surface hover:border-charcoal/20'
                        }`}
                      >
                        <div className="min-w-0 space-y-1">
                          <p className="font-bold text-sm text-charcoal">{recommendation.name}</p>
                          <p className="text-[10px] text-charcoal-muted font-semibold uppercase tracking-wider font-sans">
                            {recommendation.category} &middot; {recommendation.durationMinutes} mins &middot; {formatCurrency(recommendation.estimatedCost)}
                          </p>
                          <p className="text-xs text-charcoal-muted leading-relaxed font-sans">{recommendation.description}</p>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setSelectedRecommendationIds((current) => selected ? current.filter((id) => id !== recommendation.id) : [...current, recommendation.id])} 
                          className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-teal hover:text-coral transition-colors font-sans"
                        >
                          {selected ? 'Remove' : 'Select'}
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-2 border-t border-sand flex justify-end">
                  <button 
                    type="button" 
                    onClick={planSelectedCity} 
                    className="bg-teal hover:bg-teal-hover text-paper px-6 py-3 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-colors font-sans"
                  >
                    Plan {selectedCity.city}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Active stops / Current Trip Widget */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 border-b border-sand">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-coral block font-sans">
                Your journey
              </span>
              <h2 className="text-3xl font-editorial font-bold text-charcoal">Upcoming Stops</h2>
            </div>
            <p className="text-charcoal-muted text-xs max-w-xs leading-relaxed font-sans">
              A dynamic visual sequence of your scheduled check-ins and stop durations.
            </p>
          </div>

          {!isLoggedIn || upcomingStops.length === 0 ? (
            <div className="border border-dashed border-sand p-12 text-center text-xs text-charcoal-muted rounded-sm bg-surface">
              Your next adventure starts here. &nbsp;
              <button type="button" onClick={handleStartPlanning} className="font-bold text-teal hover:underline uppercase tracking-wider text-[10px]">
                Plan a trip &rarr;
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {upcomingStops.slice(0, 4).map((stop) => (
                <Link 
                  key={`${stop.tripId}-${stop.id}`} 
                  to={`/trips/${stop.tripId}`} 
                  className="group flex items-center gap-4 border border-sand bg-surface p-4 rounded-sm hover:border-teal transition-all duration-300"
                >
                  <img 
                    src={getDestinationImage(stop.cityName, stop.country)} 
                    alt="" 
                    className="h-14 w-20 shrink-0 object-cover rounded-sm grayscale-[15%] group-hover:grayscale-0 transition-all duration-500 border border-sand" 
                    onError={(event) => { event.currentTarget.src = getDestinationImage('', ''); }} 
                  />
                  <div className="min-w-0">
                    <p className="truncate font-bold text-sm text-charcoal">{stop.cityName}, {stop.country}</p>
                    <p className="text-[10px] text-charcoal-muted font-semibold mt-1">
                      {new Date(stop.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(stop.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Dynamic Route Visualizer */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-paper border-b border-sand">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-coral block font-sans">
              Route Visualizer
            </span>
            <h2 className="text-3xl font-editorial font-bold text-charcoal">The anatomy of an itinerary</h2>
            <p className="text-charcoal-muted text-xs leading-relaxed max-w-sm mx-auto font-sans">
              TripPilot translates linear stopover cities into beautiful step-by-step route visual milestones.
            </p>
          </div>

          <RouteVisualizer stops={routeStops as RouteStop[]} loading={isLoggedIn && upcomingLoading} />
        </div>
      </section>

      {/* 6. Feature Story Catalogues */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-24 max-w-7xl mx-auto space-y-24">
        
        {/* Story 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-teal block">01 / Discover</span>
            <h3 className="text-3xl font-editorial font-bold text-charcoal">Find places worth stopping for.</h3>
            <p className="text-charcoal-muted text-xs leading-relaxed font-sans font-normal">
              Explore local activities, cultural spots, and food listings curated for traveler logs. Filter sightseeing activities by estimated cost, category splits, and time durations.
            </p>
          </div>
          
          {!routeStops.length ? (
            <div className="lg:col-span-7 bg-surface p-6 rounded-sm border border-sand">
              <div className="bg-paper p-8 text-center rounded-sm border border-sand max-w-md mx-auto space-y-4 animate-fadeIn">
                <p className="text-xs text-charcoal-muted font-sans font-normal leading-relaxed">
                  No stops added yet. Add a destination to discover activities.
                </p>
                <button 
                  type="button" 
                  onClick={handleStartPlanning}
                  className="inline-block bg-teal hover:bg-teal-hover text-paper font-bold text-[10px] uppercase tracking-wider py-2.5 px-6 rounded-sm transition-colors shadow-sm"
                >
                  Start Planning
                </button>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-7 bg-surface p-6 rounded-sm border border-sand">
              <div className="bg-paper p-6 rounded-sm border border-sand space-y-4 max-w-md mx-auto">
                <div className="flex items-center justify-between border-b border-sand pb-2 gap-3">
                  <span className="text-[10px] font-bold text-teal flex items-center space-x-1.5 uppercase tracking-wider font-sans">
                    <Sparkles className="h-3.5 w-3.5 text-coral" />
                    <span>Activity Selector Catalog</span>
                  </span>
                  <span className="text-[9px] text-charcoal-muted uppercase font-bold shrink-0 font-sans">
                    {activityLoading ? 'Loading...' : (visibleActivities.length === 1 ? '1 MATCH' : `${visibleActivities.length} MATCHES`)}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 font-sans">
                  <label htmlFor="landing-stop" className="text-[9px] font-bold uppercase tracking-wider text-charcoal-muted shrink-0">
                    Stop:
                  </label>
                  <select 
                    id="landing-stop" 
                    value={selectedStop?.id || ''} 
                    onChange={(event) => setSelectedStopId(event.target.value)} 
                    className="min-w-0 flex-1 rounded-sm border border-sand bg-white px-2 py-1.5 text-xs text-charcoal"
                  >
                    {routeStops.map((stop) => <option key={stop.id} value={stop.id}>{stop.cityName}, {stop.country}</option>)}
                  </select>
                </div>
                
                <input 
                  aria-label="Search activities" 
                  value={activityQuery} 
                  onChange={(event) => setActivityQuery(event.target.value)} 
                  placeholder={selectedStop ? `Search ${selectedStop.cityName} activities` : 'Search activities'} 
                  className="w-full rounded-sm border border-sand px-3 py-2 text-xs text-charcoal font-sans" 
                />
                
                {activitySuccess && <p className="text-[10px] text-green-700 font-semibold font-sans" role="status">{activitySuccess}</p>}
                {activityError && <p className="text-[10px] text-coral font-semibold font-sans" role="alert">{activityError}</p>}
                
                {activityLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={`act-skeleton-${i}`} className="h-14 animate-pulse rounded-sm bg-sand-light/50 border border-sand/50" />
                    ))}
                  </div>
                ) : visibleActivities.length === 0 ? (
                  <p className="border border-dashed border-sand p-6 text-center text-[10px] text-charcoal-muted font-sans rounded-sm bg-white">
                    No activities found for this stop. Try another search.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {visibleActivities.map((activity) => {
                      const isAdded = selectedStop?.activities?.some((act: any) => act.name === activity.name);
                      return (
                        <div key={activity.id} className="border border-sand bg-white p-3 rounded-sm flex justify-between items-center gap-3 text-xs hover:border-teal/20 hover:shadow-sm transition-all duration-200">
                          <div className="min-w-0">
                            <h5 className="font-bold truncate text-charcoal">{activity.name}</h5>
                            <p className="text-[9px] text-charcoal-muted font-semibold uppercase tracking-wider mt-0.5 font-sans">
                              {activity.category} &middot; {activity.durationMinutes}m &middot; {formatCurrency(activity.estimatedCost)}
                            </p>
                          </div>
                          <button 
                            onClick={() => addActivityToStop(activity)} 
                            disabled={!selectedStop || attachingActivityId !== null || isAdded} 
                            className={`px-3.5 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-widest shrink-0 transition-colors font-sans ${
                              isAdded 
                                ? 'bg-sand text-charcoal-muted cursor-not-allowed border border-sand' 
                                : 'bg-teal hover:bg-teal-hover text-paper shadow-sm'
                            }`}
                          >
                            {attachingActivityId === activity.id ? 'Adding...' : isAdded ? 'Added ✓' : 'Add'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Story 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 lg:order-last space-y-4">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-teal block font-sans">02 / Design</span>
            <h3 className="text-3xl font-editorial font-bold text-charcoal">Turn places into a journey.</h3>
            <p className="text-charcoal-muted text-xs leading-relaxed font-sans font-normal">
              Build your stops chronological hierarchy. Sort arrivals, departures, and cities with simple reordering buttons that sync layout sequences immediately.
            </p>
          </div>
          
          <div className="lg:col-span-7 bg-surface p-6 rounded-sm border border-sand">
            <div className="bg-paper p-6 rounded-sm border border-sand space-y-2.5 max-w-md mx-auto text-xs font-sans">
              {upcomingLoading ? (
                <div className="space-y-2">
                  <div className="h-10 animate-pulse bg-sand-light/50" />
                </div>
              ) : routeStops.length === 0 ? (
                <div className="border border-dashed border-sand p-8 text-center rounded-sm bg-white space-y-3">
                  <h4 className="font-editorial text-sm font-bold text-charcoal">No stops added yet.</h4>
                  <p className="text-[10px] text-charcoal-muted font-sans font-normal leading-relaxed pb-1">
                    Start planning your trip by adding a destination.
                  </p>
                  <button 
                    type="button" 
                    onClick={handleStartPlanning}
                    className="inline-block bg-teal hover:bg-teal-hover text-paper font-bold text-[9px] uppercase tracking-wider py-2 px-4 rounded-sm transition-colors shadow-sm"
                  >
                    Start Planning
                  </button>
                </div>
              ) : (
                routeStops.map((stop, index) => (
                  <div key={stop.id} className="flex items-center justify-between bg-white border border-sand p-3 rounded-sm gap-3 hover:border-charcoal/10 transition-colors">
                    <div className="flex items-center space-x-3 min-w-0">
                      <span className="font-editorial text-base italic text-coral shrink-0">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="font-bold truncate text-charcoal">{stop.cityName}, {stop.country}</span>
                    </div>
                    <span className="text-[9px] text-charcoal-muted font-extrabold uppercase tracking-wider shrink-0 bg-sand-light px-2 py-0.5 rounded-sm border border-sand/40">
                      {stop.startDate && stop.endDate 
                        ? `${Math.max(1, Math.ceil((new Date(stop.endDate).getTime() - new Date(stop.startDate).getTime()) / 86400000))} days` 
                        : 'Dates not set'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Story 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-teal block font-sans">03 / Control</span>
            <h3 className="text-3xl font-editorial font-bold text-charcoal">Know what the journey will cost.</h3>
            <p className="text-charcoal-muted text-xs leading-relaxed font-sans font-normal">
              Track costs as they accumulate. Group expenses by category (stay, meals, transport, sightseeing) and visualize splits using clear, interactive progress indicators.
            </p>
          </div>
          
          <div className="lg:col-span-7 bg-surface p-6 rounded-sm border border-sand">
            <div className="bg-paper p-6 rounded-sm border border-sand space-y-4 max-w-md mx-auto text-xs">
              <div className="flex justify-between border-b border-sand pb-2 font-bold text-charcoal">
                <span>Total Spent</span>
                <span className="text-teal font-extrabold uppercase tracking-wide text-[10px]">Real-time summaries</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-charcoal-muted uppercase">
                  <span>Stay & Lodging</span>
                  <span>Category breakdowns</span>
                </div>
                <div className="w-full bg-sand h-2 rounded-sm overflow-hidden border border-sand/30">
                  <div className="bg-teal h-full w-[43%] transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* 7. How It Works Sequential Section */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 py-20 bg-surface border-y border-sand">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-md mx-auto space-y-2">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-coral block font-sans">
              Workflow
            </span>
            <h2 className="text-3xl font-editorial font-bold text-charcoal">How TripPilot works</h2>
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
              <div key={idx} className="bg-paper p-6 rounded-sm border border-sand space-y-4">
                <span className="text-3xl font-editorial italic font-normal text-coral block">{item.step}</span>
                <h4 className="font-bold text-sm text-charcoal tracking-tight">{item.title}</h4>
                <p className="text-xs text-charcoal-muted leading-relaxed font-sans">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Destination Discovery Explorer */}
      <section id="discover" className="px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-sand pb-6">
          <div className="space-y-2">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-coral block font-sans">
              Discovery
            </span>
            <h2 className="text-3xl font-editorial font-bold text-charcoal">Inspiration for your next trip</h2>
          </div>
          <p className="text-charcoal-muted text-xs max-w-xs leading-relaxed font-sans">
            Boutique travel catalogs compiled to inspire your stops, activities, and budget planning.
          </p>
        </div>

        {!destinationLoading && !destinationError && destinations.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row pt-2">
            <input 
              aria-label="Search destinations" 
              value={destinationSearch} 
              onChange={(event) => setDestinationSearch(event.target.value)} 
              placeholder="Search destinations (e.g. Udaipur)" 
              className="field rounded-sm text-xs font-sans" 
            />
            <select 
              aria-label="Filter destinations by country" 
              value={destinationCountry} 
              onChange={(event) => setDestinationCountry(event.target.value)} 
              className="field sm:max-w-xs rounded-sm text-xs text-charcoal font-sans"
            >
              <option value="all">All countries</option>
              {Array.from(new Set(destinations.map((destination) => destination.country))).sort().map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            <select 
              aria-label="Sort destinations" 
              value={destinationSort} 
              onChange={(event) => setDestinationSort(event.target.value as 'name' | 'popularity')} 
              className="field sm:max-w-xs rounded-sm text-xs text-charcoal font-sans"
            >
              <option value="popularity">Group by popularity</option>
              <option value="name">Sort by name</option>
            </select>
          </div>
        )}
        
        {destinationLoading && <p className="pt-8 text-center text-xs text-charcoal-muted animate-pulse font-bold font-sans">Retrieving explore catalogs...</p>}
        {destinationError && <p role="alert" className="pt-8 text-center text-xs text-coral font-semibold font-sans">{destinationError}</p>}
        
        {!destinationLoading && !destinationError && destinations.length === 0 && (
          <p className="pt-8 text-center text-xs text-charcoal-muted font-sans">No explore catalogs found.</p>
        )}
        {!destinationLoading && !destinationError && visibleDestinations.length === 0 && (
          <p className="pt-8 text-center text-xs text-charcoal-muted font-sans">No destinations match your filters.</p>
        )}
        
        {!destinationLoading && !destinationError && visibleDestinations.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleDestinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} onSelect={selectCity} />
            ))}
          </div>
        )}
      </section>

      {/* 9. Archive History Panel */}
      {isLoggedIn && (
        <section className="border-t border-sand px-4 py-16 sm:px-6 lg:px-8 bg-surface">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="space-y-2">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-coral block font-sans">
                Your archive
              </span>
              <h2 className="text-3xl font-editorial font-bold text-charcoal">Previous Trips</h2>
            </div>
            
            {previousTrips.length === 0 ? (
              <p className="text-xs text-charcoal-muted font-sans">Your completed travel plans will appear in this history archive.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {previousTrips.map((trip) => {
                  const stop = trip.stops?.[0];
                  return (
                    <Link 
                      key={trip.id} 
                      to={`/trips/${trip.id}`} 
                      className="group flex gap-4 border border-sand bg-paper p-4 rounded-sm hover:border-teal transition-all duration-300"
                    >
                      <img 
                        src={getDestinationImage(stop?.cityName, stop?.country)} 
                        alt={stop ? `${stop.cityName}, ${stop.country}` : trip.title} 
                        className="h-20 w-28 shrink-0 object-cover rounded-sm grayscale-[25%] group-hover:grayscale-0 transition-all duration-500 border border-sand" 
                        onError={(event) => { event.currentTarget.src = getDestinationImage('', ''); }}
                      />
                      <div className="min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <h3 className="truncate font-editorial text-lg font-bold text-charcoal leading-snug group-hover:text-teal transition-colors">
                            {trip.title}
                          </h3>
                          <p className="truncate text-xs text-charcoal-muted mt-0.5 font-sans">
                            {stop ? `${stop.cityName}, ${stop.country}` : 'Multi-stop route'}
                          </p>
                        </div>
                        <p className="text-[9px] text-charcoal-muted font-extrabold uppercase tracking-wider font-sans mt-2">
                          {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 10. Footer */}
      <footer className="border-t border-sand py-12 px-4 sm:px-6 lg:px-8 bg-paper">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-bold uppercase tracking-wider text-charcoal-muted font-sans">
          <div className="flex items-center space-x-2 text-teal font-editorial font-bold text-lg tracking-tight">
            <Compass className="h-5.5 w-5.5 text-coral" />
            <span className="font-editorial italic font-normal text-teal">Trip</span>
            <span className="font-editorial font-bold -ml-1">Pilot</span>
          </div>
          <div>
            <span>&copy; {new Date().getFullYear()} TripPilot. Premium travel journal planner interface.</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

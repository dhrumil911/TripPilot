import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Compass, Loader2, MapPin, Search } from 'lucide-react';
import api from '../api/axios';
import { formatCurrency } from '../utils/currency';
import { indianCitiesCatalog, getDestinationImage } from '../data/destinations';

interface City {
  id: string;
  cityName: string;
  country: string;
  state: string;
  category: string;
  popularity: string;
  description: string;
}

interface ActivityResult {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedCost: string;
  durationMinutes: number;
}

interface Trip {
  id: string;
  title: string;
  stops?: Array<{ id: string; cityName: string; country: string }>;
}

type ResultType = 'all' | 'cities' | 'activities';
type SortOrder = 'popularity' | 'name_asc' | 'name_desc' | 'cost_asc' | 'cost_desc';

export const Explore: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [resultType, setResultType] = useState<ResultType>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('popularity');
  
  // Advanced Filter States
  const [selectedState, setSelectedState] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPopularity, setSelectedPopularity] = useState('');
  
  // Pagination State
  const [visibleCount, setVisibleCount] = useState(12);

  const [activities, setActivities] = useState<ActivityResult[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStopId, setSelectedStopId] = useState('');
  const [addingId, setAddingId] = useState<string | null>(null);
  const [success, setSuccess] = useState('');

  // Map the centralized Indian destination config as our cities list
  const initialCities: City[] = indianCitiesCatalog.map((c) => ({
    id: c.id,
    cityName: c.name,
    country: c.country,
    state: c.state,
    category: c.category,
    popularity: c.popularity,
    description: c.description,
  }));

  // Unique list of states dynamically extracted from the catalog
  const statesList = Array.from(new Set(indianCitiesCatalog.map((c) => c.state))).sort();
  
  const categoriesList = [
    'Heritage', 'Beach', 'Mountains', 'Nature', 'Culture', 
    'Spiritual', 'Wildlife', 'Food', 'Adventure', 'City'
  ];

  useEffect(() => {
    // Sync active trips and activities from API
    Promise.all([api.get('/search/activities'), api.get('/trips')])
      .then(([activityResponse, tripResponse]) => {
        setActivities(activityResponse.data.activities || []);
        setTrips(tripResponse.data.trips || []);
      })
      .catch(() => setError('We could not load discovery results right now.'))
      .finally(() => setLoading(false));
  }, []);

  const normalizedQuery = query.trim().toLocaleLowerCase();

  // Search logic: case-insensitive match against name, state, country, category, or description
  const visibleCities = initialCities.filter((city) => {
    const matchesQuery = 
      !normalizedQuery || 
      `${city.cityName} ${city.state} ${city.country} ${city.category} ${city.description}`.toLocaleLowerCase().includes(normalizedQuery);
    const matchesState = !selectedState || city.state === selectedState;
    const matchesCategory = !selectedCategory || city.category === selectedCategory;
    const matchesPopularity = !selectedPopularity || city.popularity === selectedPopularity;
    
    return matchesQuery && matchesState && matchesCategory && matchesPopularity;
  });

  const visibleActivities = activities.filter((item) => 
    `${item.name} ${item.category} ${item.description}`.toLocaleLowerCase().includes(normalizedQuery)
  );

  // Dynamic sorting logic
  const getPopularityScore = (pop: string) => {
    switch (pop.toLowerCase()) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  };

  const sortedCities = [...visibleCities].sort((a, b) => {
    if (sortOrder === 'name_asc') return a.cityName.localeCompare(b.cityName);
    if (sortOrder === 'name_desc') return b.cityName.localeCompare(a.cityName);
    if (sortOrder === 'popularity') return getPopularityScore(b.popularity) - getPopularityScore(a.popularity);
    return 0;
  });

  const sortedActivities = [...visibleActivities].sort((a, b) => {
    if (sortOrder === 'name_asc') return a.name.localeCompare(b.name);
    if (sortOrder === 'name_desc') return b.name.localeCompare(a.name);
    if (sortOrder === 'cost_asc') return Number(a.estimatedCost) - Number(b.estimatedCost);
    if (sortOrder === 'cost_desc') return Number(b.estimatedCost) - Number(a.estimatedCost);
    return 0;
  });

  const stops = trips.flatMap((trip) => trip.stops || []);

  const addToStop = async (activity: ActivityResult) => {
    if (!selectedStopId) return;
    setAddingId(activity.id);
    setSuccess('');
    setError('');
    try {
      await api.post(`/stops/${selectedStopId}/activities`, activity);
      setSuccess(`${activity.name} added to your stop.`);
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || 'Could not add this activity.');
    } finally {
      setAddingId(null);
    }
  };

  // Adjust Sort label based on the current active results type
  const getSortLabel = () => {
    if (resultType === 'cities') return 'Sort destinations by';
    if (resultType === 'activities') return 'Sort activities by';
    return 'Sort results by';
  };

  const displayedCities = sortedCities.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-paper text-charcoal font-sans selection:bg-coral/25 selection:text-charcoal">
      
      {/* Navigation Header */}
      <header className="border-b border-sand bg-paper sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-teal font-editorial font-bold text-xl hover:opacity-90 transition-opacity">
            <Compass className="h-5.5 w-5.5 text-coral" />
            <span className="font-editorial italic font-normal text-teal">Trip</span>
            <span className="font-editorial font-bold -ml-1">Pilot</span>
          </Link>
          <Link to="/dashboard" className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal-muted hover:text-teal transition-colors">
            Workspace
          </Link>
        </div>
      </header>

      {/* Main Explore Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Title */}
        <div className="space-y-1">
          <p className="text-[9px] uppercase tracking-[0.25em] text-coral font-extrabold">The field guide</p>
          <h1 className="text-4xl font-editorial font-bold text-charcoal leading-tight">Find your next stop.</h1>
        </div>

        {/* Search, Filter, Sort Row */}
        <div className="flex flex-col gap-4">
          
          {/* Search Box */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-charcoal-muted" />
            <input 
              aria-label="Search destinations and activities" 
              value={query} 
              onChange={(event) => { setQuery(event.target.value); setVisibleCount(12); }} 
              placeholder="Search by city, state, description or category (e.g. Jaipur, beach)..." 
              className="w-full rounded-sm border border-sand bg-white pl-10 pr-4 py-2.5 text-xs text-charcoal font-sans focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal transition-all" 
            />
          </div>

          {/* Filters Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            
            {/* Filter Type */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="result-type" className="text-[8px] font-bold uppercase tracking-wider text-charcoal-muted">Filter Type</label>
              <select 
                id="result-type"
                value={resultType} 
                onChange={(event) => setResultType(event.target.value as ResultType)} 
                className="w-full rounded-sm border border-sand bg-white px-2 py-2 text-xs text-charcoal font-sans focus:outline-none focus:ring-1 focus:ring-teal"
              >
                <option value="all">All results</option>
                <option value="cities">Cities</option>
                <option value="activities">Activities</option>
              </select>
            </div>

            {/* State Filter (Disabled if searching only activities) */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="state-filter" className="text-[8px] font-bold uppercase tracking-wider text-charcoal-muted">State / UT</label>
              <select 
                id="state-filter"
                value={selectedState} 
                disabled={resultType === 'activities'}
                onChange={(event) => { setSelectedState(event.target.value); setVisibleCount(12); }} 
                className="w-full rounded-sm border border-sand bg-white px-2 py-2 text-xs text-charcoal font-sans focus:outline-none focus:ring-1 focus:ring-teal disabled:opacity-50"
              >
                <option value="">All States / UTs</option>
                {statesList.map(state => <option key={state} value={state}>{state}</option>)}
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="category-filter" className="text-[8px] font-bold uppercase tracking-wider text-charcoal-muted">Category</label>
              <select 
                id="category-filter"
                value={selectedCategory} 
                disabled={resultType === 'activities'}
                onChange={(event) => { setSelectedCategory(event.target.value); setVisibleCount(12); }} 
                className="w-full rounded-sm border border-sand bg-white px-2 py-2 text-xs text-charcoal font-sans focus:outline-none focus:ring-1 focus:ring-teal disabled:opacity-50"
              >
                <option value="">All Categories</option>
                {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* Popularity Filter */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="popularity-filter" className="text-[8px] font-bold uppercase tracking-wider text-charcoal-muted">Interest Level</label>
              <select 
                id="popularity-filter"
                value={selectedPopularity} 
                disabled={resultType === 'activities'}
                onChange={(event) => { setSelectedPopularity(event.target.value); setVisibleCount(12); }} 
                className="w-full rounded-sm border border-sand bg-white px-2 py-2 text-xs text-charcoal font-sans focus:outline-none focus:ring-1 focus:ring-teal disabled:opacity-50"
              >
                <option value="">All Interest Levels</option>
                <option value="High">High Interest</option>
                <option value="Medium">Medium Interest</option>
                <option value="Low">Low Interest</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="sort-order" className="text-[8px] font-bold uppercase tracking-wider text-charcoal-muted">{getSortLabel()}</label>
              <select 
                id="sort-order"
                value={sortOrder} 
                onChange={(event) => setSortOrder(event.target.value as SortOrder)} 
                className="w-full rounded-sm border border-sand bg-white px-2 py-2 text-xs text-charcoal font-sans focus:outline-none focus:ring-1 focus:ring-teal"
              >
                {(resultType === 'all' || resultType === 'cities') && (
                  <option value="popularity">Sort by interest</option>
                )}
                <option value="name_asc">Name: A &rarr; Z</option>
                <option value="name_desc">Name: Z &rarr; A</option>
                {(resultType === 'all' || resultType === 'activities') && (
                  <>
                    <option value="cost_asc">Cost: Low &rarr; High</option>
                    <option value="cost_desc">Cost: High &rarr; Low</option>
                  </>
                )}
              </select>
            </div>

          </div>
        </div>

        {/* Content list */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="h-7 w-7 animate-spin text-teal" />
            <p className="text-xs text-charcoal-muted animate-pulse font-bold font-sans">Scanning Indian Discovery Catalog...</p>
          </div>
        ) : error ? (
          <p role="alert" className="border-l-2 border-coral bg-coral/5 p-4 text-xs text-coral font-bold rounded-sm animate-fadeIn">{error}</p>
        ) : (
          <div className="grid gap-10 lg:grid-cols-2">
            
            {/* Cities Result Panel */}
            {(resultType === 'all' || resultType === 'cities') && (
              <section className="space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2 border-b border-sand pb-3">
                  <MapPin className="h-4.5 w-4.5 text-teal" />
                  <h2 className="font-editorial text-xl font-bold text-charcoal">
                    Cities <span className="font-sans text-xs text-charcoal-muted font-normal">({sortedCities.length})</span>
                  </h2>
                </div>

                <div className="space-y-2 pr-1">
                  <div className="divide-y divide-sand/50 max-h-[640px] overflow-y-auto pr-1">
                    {displayedCities.map((city) => (
                      <button 
                        key={city.id} 
                        onClick={() => navigate(`/trips/new?destination=${encodeURIComponent(`${city.cityName}, ${city.country}`)}`)} 
                        className="group flex w-full items-center gap-4 py-4 text-left hover:bg-sand-light/40 px-2 rounded-sm transition-all duration-200"
                      >
                        <img 
                          src={getDestinationImage(city.cityName, city.country)} 
                          alt={`${city.cityName}, ${city.country}`} 
                          className="h-14 w-20 shrink-0 object-cover rounded-sm border border-sand" 
                          onError={(event) => { event.currentTarget.src = getDestinationImage('', ''); }} 
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm text-charcoal truncate">{city.cityName}, {city.country}</p>
                          <p className="text-[10px] text-charcoal-muted font-semibold font-sans mt-0.5">{city.state} &middot; {city.category} &middot; {city.popularity === 'High' ? 'High interest' : city.popularity === 'Medium' ? 'Medium interest' : 'Low interest'}</p>
                          <p className="text-xs text-charcoal-muted line-clamp-1 mt-1 font-sans font-normal leading-relaxed">{city.description}</p>
                        </div>
                        <span className="shrink-0 text-[10px] font-bold text-coral uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1.5 transition-transform font-sans">
                          <span>Plan trip</span>
                          <span>&rarr;</span>
                        </span>
                      </button>
                    ))}
                    {!sortedCities.length && (
                      <p className="py-8 text-center text-xs text-charcoal-muted font-sans font-normal">No cities found matching your query.</p>
                    )}
                  </div>

                  {/* Pagination Load More Button */}
                  {visibleCount < sortedCities.length && (
                    <div className="pt-4 flex justify-center">
                      <button 
                        type="button" 
                        onClick={() => setVisibleCount(prev => prev + 12)}
                        className="border border-sand hover:border-charcoal text-charcoal font-bold text-[10px] uppercase tracking-wider py-2.5 px-6 rounded-sm transition-colors bg-white/40 shadow-sm"
                      >
                        Load More
                      </button>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Activities Result Panel */}
            {(resultType === 'all' || resultType === 'activities') && (
              <section className="space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2 border-b border-sand pb-3">
                  <Activity className="h-4.5 w-4.5 text-teal" />
                  <h2 className="font-editorial text-xl font-bold text-charcoal">
                    Activities <span className="font-sans text-xs text-charcoal-muted font-normal">({sortedActivities.length})</span>
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Select stop target dropdown */}
                  {stops.length > 0 ? (
                    <div className="flex flex-col space-y-1.5 font-sans">
                      <label htmlFor="activity-stop-target" className="text-[8px] font-bold uppercase tracking-wider text-charcoal-muted">Add Activities To Stop:</label>
                      <select 
                        id="activity-stop-target"
                        aria-label="Add activity to stop" 
                        value={selectedStopId} 
                        onChange={(event) => setSelectedStopId(event.target.value)} 
                        className="rounded-sm border border-sand bg-white px-3 py-2 text-xs text-charcoal"
                      >
                        <option value="">Choose a stop to enable adding...</option>
                        {stops.map((stop) => <option key={stop.id} value={stop.id}>{stop.cityName}, {stop.country}</option>)}
                      </select>
                    </div>
                  ) : (
                    <p className="text-[10px] text-charcoal-muted font-sans font-semibold bg-sand-light/40 border border-sand/40 p-2.5 rounded-sm">
                      Create a trip and add stops in your workspace to associate activities.
                    </p>
                  )}

                  {success && <p role="status" className="text-xs text-green-700 font-sans font-semibold animate-fadeIn">{success}</p>}

                  {/* Activities List */}
                  <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
                    {sortedActivities.map((item) => (
                      <article key={item.id} className="border border-sand bg-white p-4 rounded-sm flex flex-col justify-between hover:border-teal/20 hover:shadow-sm transition-all duration-200">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-charcoal leading-snug">{item.name}</p>
                            <p className="mt-1 text-xs text-charcoal-muted leading-relaxed font-sans font-normal">{item.description}</p>
                          </div>
                          <span className="shrink-0 text-xs font-bold text-teal font-sans">{formatCurrency(item.estimatedCost)}</span>
                        </div>
                        <div className="mt-3.5 pt-3 border-t border-sand/30 flex items-center justify-between gap-3">
                          <p className="text-[9px] uppercase tracking-wider text-charcoal-muted font-semibold font-sans">{item.category} &middot; {item.durationMinutes} mins</p>
                          <button 
                            onClick={() => addToStop(item)} 
                            disabled={!selectedStopId || addingId !== null} 
                            className="shrink-0 bg-teal hover:bg-teal-hover text-paper px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-widest disabled:opacity-40 transition-colors font-sans shadow-sm"
                          >
                            {addingId === item.id ? 'Adding...' : 'Add to stop'}
                          </button>
                        </div>
                      </article>
                    ))}
                    {!sortedActivities.length && (
                      <p className="py-8 text-center text-xs text-charcoal-muted font-sans font-normal">No activities found matching your query.</p>
                    )}
                  </div>
                </div>
              </section>
            )}

          </div>
        )}
      </main>

    </div>
  );
};

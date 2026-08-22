import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { 
  Calendar, Trash2, Plus, AlertCircle, 
  ArrowRight, Layout, Settings as SettingsIcon, Search, SlidersHorizontal, Pencil 
} from 'lucide-react';
import api from '../api/axios';
import { DestinationCard } from '../components/DestinationCard';
import { Destination } from '../types/destination';
import { enrichDestination, getDestinationImage } from '../data/destinations';

interface Trip {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  stops?: Array<{ cityName: string; country: string }>;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Discover Cities
  const [recommendedCities, setRecommendedCities] = useState<Destination[]>([]);

  // Edit Trip State
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Search / Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'title'>('date-desc');

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const destinationQuery = searchParams.get('destination');

  useEffect(() => {
    fetchTrips();
    fetchRecommendedCities();
    if (destinationQuery) {
      setDestinationInput(`${destinationQuery}, India`);
      setTitle(`Trip to ${destinationQuery}`);
      setShowForm(true);
    }
  }, [destinationQuery]);

  const fetchRecommendedCities = async () => {
    try {
      const response = await api.get('/search/cities');
      setRecommendedCities(response.data.cities.map((city: { id: string; cityName: string; country: string; popularity: string }) => 
        enrichDestination({ id: city.id, city: city.cityName, country: city.country, popularity: city.popularity })
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const response = await api.get('/trips');
      setTrips(response.data.trips);
    } catch (err: any) {
      console.error(err);
      setError('Failed to retrieve your trips. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title || !startDate || !endDate) {
      setFormError('Title, start date, and end date are required');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setFormError('End date must be after or equal to start date');
      return;
    }

    setFormLoading(true);
    try {
      const response = await api.post('/trips', {
        title,
        description: description || undefined,
        startDate,
        endDate
      });

      const newTrip = response.data.trip;

      // Automatically create a stop if a destination is provided
      if (destinationInput.trim()) {
        const parts = destinationInput.split(',');
        const city = parts[0]?.trim() || '';
        const country = parts[1]?.trim() || 'India';
        if (city) {
          try {
            await api.post(`/trips/${newTrip.id}/stops`, {
              cityName: city,
              country: country,
              startDate,
              endDate,
              stopOrder: 1
            });
          } catch (stopErr) {
            console.error('Failed to create initial stop:', stopErr);
          }
        }
      }

      setTrips([newTrip, ...trips]);
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setDestinationInput('');
      setShowForm(false);

      // Immediately redirect user to the planning details page
      navigate(`/trips/${newTrip.id}`);
    } catch (err: any) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Failed to create trip.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTrip = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this trip? This will delete all stop schedules, activities, and budget info.')) {
      return;
    }

    try {
      await api.delete(`/trips/${id}`);
      setTrips(trips.filter(trip => trip.id !== id));
    } catch (err: any) {
      console.error(err);
      alert('Failed to delete the trip.');
    }
  };

  const handleEditSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editingTripId) return;
    setEditLoading(true);
    try {
      await api.patch('/trips/' + editingTripId, {
        title: editTitle,
        description: editDescription || undefined,
        startDate: editStartDate,
        endDate: editEndDate
      });
      setEditingTripId(null);
      fetchTrips();
    } catch (err) {
      console.error(err);
      alert('Failed to edit trip.');
    } finally {
      setEditLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const getCoverImage = (trip: Trip) => {
    const stop = trip.stops?.[0];
    return getDestinationImage(stop?.cityName || trip.title.replace(/^Trip to /i, ''), stop?.country || 'India');
  };

  // Filtered & Sorted Trips
  const filteredTrips = trips
    .filter(trip => {
      const match = trip.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (trip.description && trip.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return match;
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      if (sortBy === 'date-asc') return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      return a.title.localeCompare(b.title);
    });

  const today = new Date();
  
  const ongoingTrips = filteredTrips.filter((trip) => new Date(trip.startDate) <= today && new Date(trip.endDate) >= today);
  const upcomingTrips = filteredTrips.filter((trip) => new Date(trip.startDate) > today);
  const completedTrips = filteredTrips.filter((trip) => new Date(trip.endDate) < today);

  const tripGroups = [
    { label: 'Ongoing Journeys', trips: ongoingTrips },
    { label: 'Upcoming Adventures', trips: upcomingTrips },
    { label: 'Completed Travels', trips: completedTrips },
  ];

  // Current featured journey card
  const currentFeaturedTrip = ongoingTrips[0] || upcomingTrips[0] || null;

  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans selection:bg-coral/25 selection:text-charcoal">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:grid lg:grid-cols-12 gap-8">
        
        {/* 1. Left Sidebar Navigation */}
        <aside className="order-1 lg:col-span-3 space-y-6 lg:order-none">
          <div className="bg-surface border border-sand p-6 rounded-sm space-y-6 lg:sticky lg:top-24">
            
            <div className="space-y-1.5">
              <span className="text-[9px] text-coral font-extrabold uppercase tracking-widest block">Navigation</span>
              <h2 className="text-xl font-editorial font-bold text-charcoal">Workspace</h2>
            </div>

            <nav className="grid grid-cols-2 lg:flex lg:flex-col gap-2">
              <Link 
                to="/dashboard" 
                className="flex items-center justify-center lg:justify-start space-x-2.5 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-teal bg-paper rounded-sm transition-colors border border-sand/40"
              >
                <Layout className="h-4 w-4 shrink-0" />
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/settings" 
                className="flex items-center justify-center lg:justify-start space-x-2.5 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-charcoal-muted hover:text-teal hover:bg-paper/50 rounded-sm transition-colors border border-transparent hover:border-sand/40"
              >
                <SettingsIcon className="h-4 w-4 shrink-0" />
                <span>Settings</span>
              </Link>
            </nav>

            <div className="pt-4 border-t border-sand">
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  if (!showForm) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="w-full flex items-center justify-center space-x-1.5 bg-teal hover:bg-teal-hover text-paper py-3 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{showForm ? 'Cancel Form' : 'Plan New Trip'}</span>
              </button>
            </div>

            {/* Discover sidebar list - Desktop Only */}
            <div className="hidden lg:block pt-4 border-t border-sand space-y-3">
              <h3 className="font-editorial font-bold text-sm text-charcoal tracking-tight">Discover Cities</h3>
              <div className="space-y-2">
                {recommendedCities.slice(0, 3).map((city, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => {
                      setDestinationInput(`${city.city}, ${city.country}`);
                      setTitle(`Trip to ${city.city}`);
                      setShowForm(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="cursor-pointer bg-white border border-sand/40 hover:border-charcoal/20 rounded-sm p-3 space-y-1.5 transition-all duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-charcoal">{city.city}</span>
                      <span className="text-[9px] bg-paper px-1.5 py-0.5 rounded-sm text-teal font-extrabold uppercase font-sans">
                        {city.popularity || 'Curated'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-charcoal-muted font-semibold uppercase tracking-wider">
                      <span>{city.country}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* 2. Main Content pane */}
        <main className="order-2 lg:col-span-9 space-y-8 animate-fadeIn lg:order-none">
          
          {/* Welcome Text block */}
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-charcoal tracking-tight leading-none">
              Travel Command Center
            </h1>
            <p className="text-[10px] text-charcoal-muted uppercase tracking-widest font-extrabold block">
              Hi, {localStorage.getItem('userName') || 'Traveler'} &middot; Manage your trips and itineraries
            </p>
          </div>

          {/* Create Trip Form Section */}
          {showForm && (
            <div className="bg-surface p-6 rounded-sm border border-sand max-w-2xl animate-fadeIn space-y-6">
              <h3 className="text-xl font-editorial font-bold text-charcoal">Start a New Journey</h3>
              
              {formError && (
                <div className="flex items-center space-x-2.5 bg-coral/5 border-l-2 border-coral text-coral p-4 rounded-sm text-xs font-sans">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleCreateTrip} className="space-y-4 font-sans">
                <div>
                  <label className="label">Trip Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Summer EuroTrip"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="field rounded-sm text-xs"
                  />
                </div>

                <div>
                  <label className="label">First Stop (e.g. City, Country)</label>
                  <input
                    type="text"
                    placeholder="e.g. Udaipur, India"
                    value={destinationInput}
                    onChange={(e) => setDestinationInput(e.target.value)}
                    className="field rounded-sm text-xs"
                  />
                </div>

                <div>
                  <label className="label">Description (Optional)</label>
                  <textarea
                    placeholder="Describe your trip, objectives, packing priorities, or overall goals..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="field rounded-sm text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Start Date</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="field rounded-sm text-xs"
                    />
                  </div>
                  <div>
                    <label className="label">End Date</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="field rounded-sm text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="bg-teal hover:bg-teal-hover text-paper font-bold text-[10px] uppercase tracking-widest px-6 py-3 rounded-sm transition-colors disabled:opacity-50"
                  >
                    {formLoading ? 'Creating Plan...' : 'Save Trip'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Current Featured Journey */}
          {currentFeaturedTrip && !showForm && (
            <div 
              onClick={() => navigate(`/trips/${currentFeaturedTrip.id}`)}
              className="cursor-pointer group relative bg-surface border border-sand rounded-sm overflow-hidden flex flex-col md:flex-row transition-all hover:border-charcoal/20 duration-300"
            >
              <div className="md:w-1/2 aspect-[4/3] md:aspect-auto overflow-hidden bg-sand-light relative">
                <img 
                  src={getCoverImage(currentFeaturedTrip)} 
                  alt="" 
                  className="h-full w-full object-cover grayscale-[10%] group-hover:scale-102 group-hover:grayscale-0 transition-all duration-[1200ms]"
                  onError={(event) => { event.currentTarget.src = getDestinationImage('', ''); }}
                />
                <div className="absolute top-4 left-4 bg-teal text-paper px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-sm">
                  {ongoingTrips[0] ? 'Current Journey' : 'Upcoming Adventure'}
                </div>
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-coral block">
                    Featured Plan
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-charcoal leading-tight tracking-tight group-hover:text-teal transition-colors">
                    {currentFeaturedTrip.title}
                  </h3>
                  {currentFeaturedTrip.description && (
                    <p className="text-xs leading-relaxed text-charcoal-muted line-clamp-3">
                      {currentFeaturedTrip.description}
                    </p>
                  )}
                </div>
                <div className="pt-4 border-t border-sand/40 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-[9px] font-bold uppercase tracking-wider text-charcoal-muted">
                    <Calendar className="h-4 w-4 text-teal" />
                    <span>
                      {formatDate(currentFeaturedTrip.startDate)} - {formatDate(currentFeaturedTrip.endDate)}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-teal flex items-center gap-1">
                    <span>Open Planner</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* List Toolbar (Search / Filters) */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-surface p-3.5 rounded-sm border border-sand text-xs font-sans">
            <div className="relative flex-1 w-full flex items-center">
              <input
                type="text"
                placeholder="Search trip names, descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-sand rounded-sm bg-white/70 text-xs focus:ring-1 focus:ring-teal"
              />
              <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0 font-sans">
              <SlidersHorizontal className="h-4 w-4 text-gray-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-sand rounded-sm py-2 px-3 bg-white text-xs text-charcoal"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Trips Listing Display Grid */}
          <div className="space-y-8">
            {error && (
              <div className="flex items-center space-x-2.5 bg-coral/5 border-l-2 border-coral text-coral p-4 rounded-sm text-xs font-sans animate-fadeIn">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {loading ? (
              <div className="text-center py-16 bg-surface border border-sand rounded-sm">
                <p className="text-charcoal-muted text-xs animate-pulse font-bold font-sans">Retrieving your journals...</p>
              </div>
            ) : filteredTrips.length === 0 ? (
              <div className="text-center py-16 bg-surface border border-sand rounded-sm space-y-4">
                <p className="text-charcoal-muted text-xs font-sans">No journeys match your filters.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-paper hover:bg-sand text-teal border border-sand px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors font-sans"
                >
                  Create Trip Plan
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                {tripGroups.map((group) => {
                  if (group.trips.length === 0) return null;
                  return (
                    <section key={group.label} className="space-y-4">
                      <div className="flex items-center justify-between border-b border-sand pb-2">
                        <h2 className="font-editorial text-2xl font-bold text-charcoal">{group.label}</h2>
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-charcoal-muted">
                          {group.trips.length} {group.trips.length === 1 ? 'trip' : 'trips'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {group.trips.map((trip) => (
                          <div 
                            key={trip.id} 
                            onClick={() => !editingTripId && navigate(`/trips/${trip.id}`)}
                            className="group cursor-pointer bg-surface border border-sand rounded-sm overflow-hidden hover:border-charcoal/20 transition-all flex flex-col justify-between duration-300"
                          >
                            {editingTripId === trip.id ? (
                              <div className="p-5 space-y-4 font-sans" onClick={e => e.stopPropagation()}>
                                <h4 className="text-xs font-bold uppercase text-teal">Edit Details</h4>
                                <div className="space-y-2">
                                  <input 
                                    value={editTitle} 
                                    onChange={e => setEditTitle(e.target.value)} 
                                    className="field text-xs rounded-sm" 
                                    placeholder="Title" 
                                  />
                                  <textarea 
                                    value={editDescription} 
                                    onChange={e => setEditDescription(e.target.value)} 
                                    className="field text-xs rounded-sm" 
                                    rows={2}
                                    placeholder="Description" 
                                  />
                                  <div className="grid grid-cols-2 gap-2">
                                    <input 
                                      type="date" 
                                      value={editStartDate} 
                                      onChange={e => setEditStartDate(e.target.value)} 
                                      className="field text-xs rounded-sm" 
                                    />
                                    <input 
                                      type="date" 
                                      value={editEndDate} 
                                      onChange={e => setEditEndDate(e.target.value)} 
                                      className="field text-xs rounded-sm" 
                                    />
                                  </div>
                                </div>
                                <div className="flex space-x-2 justify-end pt-2">
                                  <button 
                                    onClick={handleEditSave} 
                                    disabled={editLoading} 
                                    className="bg-teal text-white px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-wider"
                                  >
                                    {editLoading ? 'Saving...' : 'Save'}
                                  </button>
                                  <button 
                                    onClick={() => setEditingTripId(null)} 
                                    className="border border-sand text-charcoal px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-wider hover:bg-paper"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div>
                                  {/* Cover Photo */}
                                  <div className="h-40 overflow-hidden relative border-b border-sand bg-sand-light">
                                    <img 
                                      src={getCoverImage(trip)} 
                                      alt={trip.title} 
                                      className="w-full h-full object-cover grayscale-[10%] group-hover:scale-102 group-hover:grayscale-0 transition-all duration-[1000ms]" 
                                      onError={(event) => { event.currentTarget.src = getDestinationImage('', ''); }}
                                    />
                                    <div className="absolute top-3 right-3 flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEditingTripId(trip.id);
                                          setEditTitle(trip.title);
                                          setEditDescription(trip.description || '');
                                          setEditStartDate(trip.startDate.split('T')[0]);
                                          setEditEndDate(trip.endDate.split('T')[0]);
                                        }}
                                        className="text-charcoal border border-sand bg-surface hover:bg-paper p-1.5 rounded-sm transition-all"
                                        title="Edit Journey"
                                      >
                                        <Pencil className="h-3.5 w-3.5" />
                                      </button>
                                      <button
                                        onClick={(e) => handleDeleteTrip(trip.id, e)}
                                        className="text-coral border border-sand bg-surface hover:bg-coral/5 p-1.5 rounded-sm transition-all"
                                        title="Delete Journey"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="p-5 space-y-2">
                                    <h3 className="font-editorial font-bold text-xl text-charcoal group-hover:text-teal transition-colors leading-tight tracking-tight">
                                      {trip.title}
                                    </h3>
                                    {trip.description && (
                                      <p className="text-charcoal-muted text-xs leading-relaxed font-sans line-clamp-2 mt-1">
                                        {trip.description}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="px-5 py-3.5 bg-paper/40 border-t border-sand flex items-center justify-between text-xs">
                                  <div className="flex items-center space-x-1.5 text-[9px] text-charcoal-muted font-bold uppercase tracking-wider">
                                    <Calendar className="h-3.5 w-3.5 text-teal shrink-0" />
                                    <span>
                                      {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                                    </span>
                                  </div>
                                  <span className="text-teal font-bold uppercase tracking-widest text-[9px] flex items-center gap-0.5">
                                    <span>Open</span>
                                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recommended Destinations Highlights */}
          <div className="space-y-4 pt-10 border-t border-sand">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4">
              <div className="space-y-1.5">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-coral block font-sans">
                  Suggestions
                </span>
                <h2 className="text-2xl font-editorial font-bold text-charcoal">Explore Inspiration</h2>
              </div>
              <p className="text-xs text-charcoal-muted font-sans">Curated recommendations matching catalog favorites.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedCities.slice(0, 4).map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          </div>
          {/* Discover Cities - Mobile Only */}
          <div className="lg:hidden bg-surface border border-sand p-6 rounded-sm space-y-4 pt-10 border-t border-sand">
            <div className="space-y-1.5">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-coral block font-sans">
                Explore Destinations
              </span>
              <h3 className="font-editorial font-bold text-xl text-charcoal tracking-tight">Discover Cities</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedCities.slice(0, 4).map((city, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    setDestinationInput(`${city.city}, ${city.country}`);
                    setTitle(`Trip to ${city.city}`);
                    setShowForm(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="cursor-pointer bg-white border border-sand/40 hover:border-charcoal/20 rounded-sm p-4 space-y-1.5 transition-all duration-200"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-charcoal">{city.city}</span>
                    <span className="text-[9px] bg-paper px-1.5 py-0.5 rounded-sm text-teal font-extrabold uppercase font-sans">
                      {city.popularity || 'Curated'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-charcoal-muted font-semibold uppercase tracking-wider">
                    <span>{city.country}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

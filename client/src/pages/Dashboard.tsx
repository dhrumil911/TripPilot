import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { 
  Calendar, MapPin, Trash2, Plus, AlertCircle, 
  Globe, ArrowRight, Layout, Settings as SettingsIcon, Search, SlidersHorizontal 
} from 'lucide-react';
import api from '../api/axios';

interface Trip {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search / Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'title'>('date-desc');

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, []);

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

      setTrips([response.data.trip, ...trips]);
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setShowForm(false);
    } catch (err: any) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Failed to create trip.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTrip = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering card navigation click
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

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  // Cover image hash map helper to generate mock cover visual assets
  const getCoverImage = (id: string) => {
    const images = [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80', // Paris
      'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=400&q=80', // Tokyo
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80', // Rome
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=400&q=80', // NY
    ];
    // Hash charcode sum to get consistent cover per trip ID
    const sum = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return images[sum % images.length];
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

  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 1. Left Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-paper border border-sand p-6 rounded-xl space-y-6 sticky top-24">
            
            <div className="space-y-1.5">
              <span className="text-[10px] text-coral font-extrabold uppercase tracking-widest">Navigation</span>
              <h2 className="text-xl font-editorial font-bold text-charcoal">Workspace</h2>
            </div>

            <nav className="space-y-1">
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-teal bg-sand-light rounded transition-colors"
              >
                <Layout className="h-4 w-4 shrink-0" />
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/settings" 
                className="flex items-center space-x-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-charcoal-muted hover:text-teal hover:bg-sand-light rounded transition-colors"
              >
                <SettingsIcon className="h-4 w-4 shrink-0" />
                <span>Settings</span>
              </Link>
            </nav>

            <div className="pt-4 border-t border-sand">
              <button
                onClick={() => setShowForm(!showForm)}
                className="w-full flex items-center justify-center space-x-1.5 bg-teal hover:bg-teal-hover text-paper py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>{showForm ? 'Cancel Form' : 'Plan New Trip'}</span>
              </button>
            </div>

          </div>
        </aside>

        {/* 2. Main Content pane */}
        <main className="lg:col-span-9 space-y-8">
          
          {/* Welcome Text block */}
          <div className="space-y-1">
            <h1 className="text-3xl font-editorial font-bold text-charcoal">Your Travel Journal</h1>
            <p className="text-xs text-charcoal-muted uppercase tracking-wider">Plan new itineraries and manage existing trips</p>
          </div>

          {/* Create Trip Form Section */}
          {showForm && (
            <div className="bg-paper p-6 rounded-xl border border-sand max-w-2xl animate-fadeIn">
              <h3 className="text-lg font-editorial font-bold text-charcoal mb-4">Start a New Journey</h3>
              
              {formError && (
                <div className="flex items-center space-x-2 bg-coral/5 border-l-2 border-coral text-coral p-3 rounded mb-4 text-xs">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleCreateTrip} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1">Trip Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Summer EuroTrip"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-sand rounded text-xs focus:ring-1 focus:ring-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1">Description (Optional)</label>
                  <textarea
                    placeholder="Tell us about the trip objectives, packing tips, or general plan..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-sand rounded text-xs focus:ring-1 focus:ring-teal"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1">Start Date</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-sand rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-muted mb-1">End Date</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-sand rounded text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="bg-teal hover:bg-teal-hover text-paper font-bold text-xs uppercase tracking-wider px-4 py-2 rounded transition-colors disabled:opacity-50"
                  >
                    {formLoading ? 'Creating Plan...' : 'Save Trip'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List Toolbar (Search / Filters) */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-sand-light p-3 rounded-lg border border-sand text-xs">
            <div className="relative flex-1 w-full flex items-center">
              <input
                type="text"
                placeholder="Search trip names, descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-sand rounded bg-white text-xs focus:ring-1 focus:ring-teal"
              />
              <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0">
              <SlidersHorizontal className="h-4 w-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-sand rounded py-1.5 px-3 bg-white text-xs"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Trips Listing Display Grid */}
          <div className="space-y-4">
            {error && (
              <div className="flex items-center space-x-2 bg-coral/5 border-l-2 border-coral text-coral p-4 rounded text-xs">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {loading ? (
              <div className="text-center py-16 bg-paper border border-sand rounded-xl">
                <p className="text-charcoal-muted text-xs animate-pulse font-semibold">Retrieving your journals...</p>
              </div>
            ) : filteredTrips.length === 0 ? (
              <div className="text-center py-16 bg-paper border border-sand rounded-xl space-y-4">
                <p className="text-charcoal-muted text-xs">No journeys match your filters.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-sand-light hover:bg-sand text-teal border border-sand px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Create Trip Plan
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTrips.map((trip) => (
                  <div 
                    key={trip.id} 
                    onClick={() => navigate(`/trips/${trip.id}`)}
                    className="cursor-pointer bg-paper border border-sand rounded-xl overflow-hidden hover:shadow-md hover:border-teal/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Cover Photo */}
                      <div className="h-40 overflow-hidden relative">
                        <img 
                          src={getCoverImage(trip.id)} 
                          alt={trip.title} 
                          className="w-full h-full object-cover grayscale-[10%]" 
                        />
                        <button
                          onClick={(e) => handleDeleteTrip(trip.id, e)}
                          className="absolute top-3 right-3 text-paper hover:text-coral bg-black bg-opacity-30 hover:bg-opacity-50 p-1.5 rounded transition-all"
                          title="Delete Journey"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="p-6 space-y-2">
                        <h3 className="font-editorial font-bold text-xl text-charcoal line-clamp-1">{trip.title}</h3>
                        {trip.description && (
                          <p className="text-charcoal-muted text-xs line-clamp-2 leading-relaxed">{trip.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="px-6 py-4 bg-sand-light border-t border-sand flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-[10px] text-charcoal-muted font-bold">
                        <Calendar className="h-3.5 w-3.5 text-teal" />
                        <span>
                          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                        </span>
                      </div>
                      <span className="text-teal hover:text-teal-hover text-xs font-bold uppercase tracking-wider flex items-center space-x-0.5">
                        <span>Open Details</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Destinations Highlights */}
          <div className="space-y-4 pt-6 border-t border-sand">
            <h2 className="text-lg font-editorial font-bold text-charcoal flex items-center space-x-2">
              <Globe className="h-5 w-5 text-teal" />
              <span>Recommended Destinations</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { city: 'Paris', country: 'France', cost: '$$$$', info: 'Eiffel Tower, Louvre Museum' },
                { city: 'Tokyo', country: 'Japan', cost: '$$$', info: 'Shibuya Sky, Sushi Workshops' },
                { city: 'Rome', country: 'Italy', cost: '$$$', info: 'Colosseum, Pasta Class' },
                { city: 'New York', country: 'USA', cost: '$$$$', info: 'Times Square, Central Park' },
              ].map((dest, i) => (
                <div key={i} className="bg-paper p-5 rounded-xl border border-sand space-y-3 shadow-sm hover:border-teal/30 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-charcoal font-bold text-xs">
                      <MapPin className="h-4 w-4 text-coral" />
                      <span>{dest.city}, {dest.country}</span>
                    </div>
                    <span className="text-green-700 text-xs font-bold">
                      {dest.cost}
                    </span>
                  </div>
                  <p className="text-charcoal-muted text-[11px] leading-relaxed">{dest.info}</p>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Calendar, MapPin, Trash2, Plus, AlertCircle, Compass, Globe, DollarSign } from 'lucide-react';
import api from '../api/axios';

interface Trip {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
}

export const Dashboard: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
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

  const handleDeleteTrip = async (id: string) => {
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Upper Dashboard Action Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-100 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Travel Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Plan new itineraries and manage existing trips in one place.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors shrink-0"
          >
            <Plus className="h-5 w-5" />
            <span>{showForm ? 'Cancel Plan' : 'Plan New Trip'}</span>
          </button>
        </div>

        {/* Create Trip Form Section */}
        {showForm && (
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 max-w-2xl mx-auto w-full animate-fadeIn">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Start a New Journey</h2>
            
            {formError && (
              <div className="flex items-center space-x-2 bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Trip Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer EuroTrip"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  placeholder="Tell us about the trip objectives, packing tips, or general plan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md text-sm transition-colors disabled:opacity-50"
                >
                  {formLoading ? 'Creating Plan...' : 'Save Trip'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Trips Display Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Compass className="h-5 w-5 text-blue-600" />
            <span>My Trips</span>
          </h2>

          {error && (
            <div className="flex items-center space-x-2 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm animate-pulse">Loading your journeys...</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100 space-y-4">
              <p className="text-gray-500 text-sm">You haven't planned any trips yet.</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Create Your First Trip
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <div key={trip.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden">
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{trip.title}</h3>
                      <button
                        onClick={() => handleDeleteTrip(trip.id)}
                        className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors shrink-0"
                        title="Delete Trip"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>

                    {trip.description && (
                      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{trip.description}</p>
                    )}

                    <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <Calendar className="h-4 w-4 text-blue-500 shrink-0" />
                      <span className="font-medium">
                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                      </span>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center space-x-1">
                      <span>Build Itinerary</span>
                      <span>&rarr;</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Destinations Highlights */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Globe className="h-5 w-5 text-blue-600" />
            <span>Recommended Destinations</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { city: 'Paris', country: 'France', cost: '$$$', info: 'Eiffel Tower, Louvre Museum' },
              { city: 'Tokyo', country: 'Japan', cost: '$$', info: 'Shibuya Sky, Sushi Workshops' },
              { city: 'Rome', country: 'Italy', cost: '$$$', info: 'Colosseum, Pasta Class' },
              { city: 'New York', country: 'USA', cost: '$$$$', info: 'Times Square, Central Park' },
            ].map((dest, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-3 hover:-translate-y-1 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-gray-900 font-bold text-sm">
                    <MapPin className="h-4.5 w-4.5 text-red-500" />
                    <span>{dest.city}, {dest.country}</span>
                  </div>
                  <span className="text-green-600 text-xs font-extrabold flex items-center">
                    <DollarSign className="h-3 w-3 -mr-0.5" />
                    {dest.cost}
                  </span>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{dest.info}</p>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

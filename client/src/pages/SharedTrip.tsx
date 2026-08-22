import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Compass, DollarSign, Copy, 
  Loader2, LogIn, AlertCircle, CheckCircle, Clock 
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
  amount: string;
}

interface PublicTripDetails {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  stops: Stop[];
  itineraryItems: ItineraryItem[];
  expenses: Expense[];
}

export const SharedTrip: React.FC = () => {
  const { shareKey } = useParams<{ shareKey: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<PublicTripDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copying, setCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const isLoggedIn = localStorage.getItem('token') !== null;

  useEffect(() => {
    fetchSharedTrip();
  }, [shareKey]);

  const fetchSharedTrip = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/shared/trips/${shareKey}`);
      setTrip(response.data.trip);
    } catch (err: any) {
      console.error(err);
      setError('Shared travel itinerary not found or public sharing has been disabled.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTrip = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    setCopying(true);
    setError('');
    setCopySuccess('');

    try {
      await api.post(`/shared/trips/${shareKey}/copy`);
      setCopySuccess('Trip cloned successfully! Redirecting to your dashboard...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError('Failed to clone this trip. Try again later.');
    } finally {
      setCopying(false);
    }
  };

  // Helper: calculate total spent in public data
  const calculateTotal = () => {
    if (!trip) return 0;
    return trip.expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-sm animate-pulse">Retrieving shared travel details...</p>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded max-w-md w-full flex items-center space-x-2 text-sm shadow-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error || 'An unexpected error occurred.'}</span>
        </div>
        <Link to="/" className="mt-4 text-blue-600 hover:text-blue-700 font-semibold text-sm">&larr; Back Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Banner (Header) */}
      <header className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] bg-green-100 text-green-800 uppercase font-extrabold px-2.5 py-1 rounded">Shared view</span>
            <h1 className="text-2xl font-black text-gray-900 mt-2">{trip.title}</h1>
            {trip.description && <p className="text-gray-500 text-sm">{trip.description}</p>}
            <div className="flex items-center space-x-2 text-xs text-gray-400 font-semibold mt-2">
              <Calendar className="h-4 w-4 text-blue-500 shrink-0" />
              <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="shrink-0">
            {isLoggedIn ? (
              <button
                onClick={handleCopyTrip}
                disabled={copying}
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors"
              >
                {copying ? (
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                ) : (
                  <Copy className="h-4.5 w-4.5" />
                )}
                <span>{copying ? 'Copying...' : 'Copy Trip'}</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1.5 bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors"
              >
                <LogIn className="h-4.5 w-4.5" />
                <span>Log in to Clone</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {copySuccess && (
          <div className="flex items-center space-x-2 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded text-sm shadow-sm animate-fadeIn">
            <CheckCircle className="h-5 w-5 shrink-0" />
            <span>{copySuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Stops List (Left Column) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4 h-max">
            <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2 border-b border-gray-50 pb-3">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span>Cities & Duration</span>
            </h2>

            {trip.stops.length === 0 ? (
              <p className="text-gray-400 text-xs py-4 text-center">No stop details listed.</p>
            ) : (
              <div className="space-y-4">
                {trip.stops.map((stop) => (
                  <div key={stop.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50 space-y-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{stop.cityName}, {stop.country}</h3>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                        {new Date(stop.startDate).toLocaleDateString()} - {new Date(stop.endDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="border-t border-gray-200/50 pt-2.5 space-y-1.5">
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Included Activities</span>
                      {stop.activities.length === 0 ? (
                        <p className="text-[10px] text-gray-400 italic">No activities listed.</p>
                      ) : (
                        <div className="space-y-1">
                          {stop.activities.map((act) => (
                            <div key={act.id} className="flex items-center justify-between text-xs bg-white px-2 py-1 rounded border border-gray-100 gap-1">
                              <span className="font-medium text-gray-600 truncate">{act.name}</span>
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

          {/* Timeline and Summary stats (Right Columns) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Quick Summary card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-gray-400 uppercase">Estimated Budget</span>
                <span className="text-2xl font-black text-gray-900 flex items-center mt-1">
                  <DollarSign className="h-6 w-6 text-gray-700 -ml-1 shrink-0" />
                  <span>{calculateTotal().toFixed(2)}</span>
                  <span className="text-xs text-gray-400 font-extrabold ml-1.5 uppercase">USD</span>
                </span>
              </div>
              <Compass className="h-10 w-10 text-blue-100" />
            </div>

            {/* Timeline */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2 border-b border-gray-50 pb-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Daily Timeline logs</span>
              </h2>

              {trip.itineraryItems.length === 0 ? (
                <p className="text-gray-400 text-xs py-8 text-center">No schedule events logged.</p>
              ) : (
                <div className="relative border-l-2 border-blue-100 pl-4 ml-2.5 space-y-6 py-2">
                  {trip.itineraryItems.map((item) => (
                    <div key={item.id} className="relative space-y-2 bg-gray-50 border border-gray-100 p-4 rounded-xl">
                      <span className="absolute -left-[27px] top-4.5 bg-blue-500 h-3 w-3 rounded-full border-2 border-white ring-4 ring-blue-50" />
                      
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase bg-white px-2 py-0.5 rounded border border-gray-100">
                          {new Date(item.itineraryDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <h3 className="font-bold text-gray-900 text-sm mt-1">{item.title}</h3>
                      </div>

                      {item.description && (
                        <p className="text-gray-500 text-xs leading-relaxed">{item.description}</p>
                      )}

                      {(item.startTime || item.endTime) && (
                        <div className="flex items-center space-x-1.5 text-[10px] text-gray-400 font-semibold bg-white p-1.5 rounded w-max border border-gray-100">
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
        </div>

      </main>
    </div>
  );
};

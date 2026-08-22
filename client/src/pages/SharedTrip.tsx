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
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError('Failed to clone this trip. Try again later.');
    } finally {
      setCopying(false);
    }
  };

  const calculateTotal = () => {
    if (!trip) return 0;
    return trip.expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  };

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const getHeroImage = (id: string) => {
    const images = [
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85',
    ];
    const sum = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return images[sum % images.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center font-sans text-charcoal">
        <p className="text-charcoal-muted text-xs animate-pulse font-semibold">Retrieving shared travel details...</p>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-4 font-sans text-charcoal">
        <div className="bg-coral/5 border-l-2 border-coral text-coral p-4 rounded max-w-md w-full flex items-center space-x-2 text-xs shadow-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error || 'An unexpected error occurred.'}</span>
        </div>
        <Link to="/" className="mt-4 text-teal hover:text-teal-hover font-bold text-xs uppercase tracking-wider">&larr; Back Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans text-charcoal">
      
      {/* Visual Header Cover Collage */}
      <div className="h-96 w-full relative overflow-hidden border-b border-sand">
        <img 
          src={getHeroImage(trip.id)} 
          alt={trip.title} 
          className="w-full h-full object-cover grayscale-[15%]" 
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 max-w-7xl mx-auto w-full">
          <div className="space-y-3 text-paper max-w-3xl">
            <span className="text-[10px] bg-coral/90 text-paper uppercase font-extrabold px-3 py-1 rounded tracking-wider border border-coral/30">
              Shared travel log
            </span>
            <h1 className="text-3xl sm:text-5xl font-editorial font-bold tracking-tight text-white leading-tight">
              {trip.title}
            </h1>
            {trip.description && <p className="text-paper/85 text-xs sm:text-sm leading-relaxed max-w-xl">{trip.description}</p>}
            
            <div className="flex items-center space-x-2 text-xs text-paper/70 font-semibold pt-1">
              <Calendar className="h-4 w-4 text-coral shrink-0" />
              <span>{formatDate(trip.startDate)} &mdash; {formatDate(trip.endDate)}</span>
            </div>
          </div>
        </div>

        {/* Home logo watermark links */}
        <div className="absolute top-6 left-6 sm:left-12">
          <Link to="/" className="flex items-center space-x-2 text-white font-editorial font-bold text-lg tracking-tight bg-black/20 px-3.5 py-1.5 rounded-md backdrop-blur-sm border border-white/10">
            <Compass className="h-4.5 w-4.5 text-coral" />
            <span>TripPilot</span>
          </Link>
        </div>
      </div>

      {/* Main layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {copySuccess && (
          <div className="flex items-center space-x-2 bg-green-50 border-l-2 border-green-500 text-green-700 p-4 rounded text-xs shadow-sm animate-fadeIn">
            <CheckCircle className="h-5 w-5 shrink-0 animate-bounce" />
            <span>{copySuccess}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between bg-sand-light p-4 rounded-xl border border-sand gap-4">
          <div className="flex items-center space-x-6">
            <div>
              <span className="block text-[9px] font-bold text-charcoal-muted uppercase tracking-wider">Estimated Budget</span>
              <span className="text-2xl font-black text-charcoal flex items-center mt-1">
                <DollarSign className="h-6 w-6 text-gray-400 -ml-1 shrink-0" />
                <span>{calculateTotal().toFixed(0)}</span>
                <span className="text-[10px] text-charcoal-muted font-bold uppercase ml-1">USD</span>
              </span>
            </div>
            <div className="border-l border-sand h-8 hidden sm:block" />
            <div>
              <span className="block text-[9px] font-bold text-charcoal-muted uppercase tracking-wider">Total stops</span>
              <span className="text-xl font-bold text-teal mt-1 block">{trip.stops.length} stopover cities</span>
            </div>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            {isLoggedIn ? (
              <button
                onClick={handleCopyTrip}
                disabled={copying}
                className="w-full flex items-center justify-center space-x-1.5 bg-teal hover:bg-teal-hover text-paper px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
              >
                {copying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span>{copying ? 'Copying...' : 'Clone this trip'}</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="w-full flex items-center justify-center space-x-1.5 bg-gray-900 hover:bg-black text-paper px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
              >
                <LogIn className="h-4 w-4" />
                <span>Log in to clone trip</span>
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Stops List (Left Column - Span 4) */}
          <div className="lg:col-span-4 bg-paper border border-sand p-6 rounded-xl space-y-4 h-max">
            <h2 className="text-base font-bold text-charcoal flex items-center space-x-2 border-b border-sand pb-3">
              <MapPin className="h-4.5 w-4.5 text-teal animate-bounce" />
              <span className="font-editorial font-bold text-lg">Cities & Stopovers</span>
            </h2>

            {trip.stops.length === 0 ? (
              <p className="text-charcoal-muted text-xs py-4 text-center">No stop details listed.</p>
            ) : (
              <div className="space-y-4">
                {trip.stops.map((stop) => (
                  <div key={stop.id} className="border border-sand rounded-xl p-4 bg-white space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="bg-sand-light text-teal font-editorial font-bold text-xs rounded-full h-5 w-5 flex items-center justify-center border border-sand">
                          {stop.stopOrder}
                        </span>
                        <h3 className="font-bold text-charcoal text-sm leading-none">{stop.cityName}, {stop.country}</h3>
                      </div>
                      <p className="text-[9px] text-charcoal-muted font-bold uppercase tracking-wider">
                        {formatDate(stop.startDate)} &mdash; {formatDate(stop.endDate)}
                      </p>
                    </div>

                    <div className="border-t border-sand/65 pt-2.5 space-y-1.5">
                      <span className="text-[9px] text-charcoal-muted font-bold uppercase tracking-wider block">Attached Activities</span>
                      {stop.activities.length === 0 ? (
                        <p className="text-[10px] text-charcoal-muted italic">No activities listed.</p>
                      ) : (
                        <div className="space-y-1">
                          {stop.activities.map((act) => (
                            <div key={act.id} className="flex items-center justify-between text-xs bg-sand-light/40 px-2 py-1 rounded border border-sand/30 gap-1">
                              <span className="font-medium text-charcoal-muted truncate">{act.name}</span>
                              <span className="text-[9px] text-green-700 font-bold shrink-0">${parseFloat(act.estimatedCost).toFixed(0)}</span>
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

          {/* Timeline and stats (Right Columns - Span 8) */}
          <div className="lg:col-span-8 bg-paper border border-sand p-6 rounded-xl space-y-4">
            <h2 className="text-base font-bold text-charcoal flex items-center space-x-2 border-b border-sand pb-3">
              <Calendar className="h-4.5 w-4.5 text-teal" />
              <span className="font-editorial font-bold text-lg">Timeline Schedule</span>
            </h2>

            {trip.itineraryItems.length === 0 ? (
              <p className="text-charcoal-muted text-xs py-8 text-center">No schedule events logged.</p>
            ) : (
              <div className="relative border-l border-sand pl-4 ml-2.5 space-y-6 py-2">
                {trip.itineraryItems.map((item) => (
                  <div key={item.id} className="relative space-y-2 bg-white border border-sand p-4 rounded-xl">
                    
                    {/* Bullet marker */}
                    <span className="absolute -left-[21px] top-4.5 bg-paper h-2 w-2 rounded-full border-2 border-teal ring-4 ring-paper" />
                    
                    <div className="space-y-1">
                      <span className="text-[9px] text-coral font-extrabold uppercase bg-sand-light px-2 py-0.5 rounded border border-sand">
                        {new Date(item.itineraryDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      <h3 className="font-bold text-charcoal text-sm leading-snug">{item.title}</h3>
                    </div>

                    {item.description && (
                      <p className="text-charcoal-muted text-xs leading-relaxed">{item.description}</p>
                    )}

                    {(item.startTime || item.endTime) && (
                      <div className="flex items-center space-x-1.5 text-[9px] text-charcoal-muted font-bold bg-sand-light/50 p-1.5 rounded w-max border border-sand/40">
                        <Clock className="h-3.5 w-3.5 text-teal shrink-0" />
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

      </main>
    </div>
  );
};

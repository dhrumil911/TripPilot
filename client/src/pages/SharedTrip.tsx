import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Compass, Copy, 
  Loader2, LogIn, AlertCircle, CheckCircle, Clock 
} from 'lucide-react';
import api from '../api/axios';
import { formatCurrency } from '../utils/currency';
import { getDestinationImage } from '../data/destinations';

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
  activity?: {
    category: string;
  } | null;
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

const getCategoryColor = (category?: string | null) => {
  switch (category?.toLowerCase()) {
    case 'transport': return 'border-teal bg-teal text-teal-hover';
    case 'stay': return 'border-coral bg-coral text-coral-hover';
    case 'activity': return 'border-amber-700 bg-amber-700 text-amber-900';
    case 'meal': return 'border-green-700 bg-green-700 text-green-900';
    default: return 'border-charcoal-muted bg-charcoal-muted text-charcoal';
  }
};

export const SharedTrip: React.FC = () => {
  const { shareKey } = useParams<{ shareKey: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<PublicTripDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copying, setCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center font-sans text-charcoal">
        <p className="text-charcoal-muted text-xs animate-pulse font-bold">Retrieving shared travel details...</p>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-4 font-sans text-charcoal">
        <div className="bg-coral/5 border-l-2 border-coral text-coral p-4 rounded-sm max-w-md w-full flex items-center space-x-2 text-xs">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error || 'An unexpected error occurred.'}</span>
        </div>
        <Link to="/" className="mt-4 text-teal hover:text-teal-hover font-bold text-xs uppercase tracking-wider">&larr; Back Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans text-charcoal selection:bg-coral/25 selection:text-charcoal">
      
      {/* Visual Header Cover Collage */}
      <div className="h-96 w-full relative overflow-hidden border-b border-sand">
        <img 
          src={getDestinationImage(trip.stops[0]?.cityName, trip.stops[0]?.country)}
          alt={trip.title} 
          className="w-full h-full object-cover grayscale-[15%]" 
          onError={(event) => { event.currentTarget.src = getDestinationImage('', ''); }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-charcoal/30 z-10" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 max-w-7xl mx-auto w-full z-20">
          <div className="space-y-4 text-paper max-w-3xl">
            <span className="text-[9px] bg-coral text-paper uppercase font-extrabold px-3 py-1 rounded-sm tracking-wider border border-coral/30 w-max block font-sans">
              Shared travel log
            </span>
            <h1 className="text-4xl sm:text-6xl font-editorial font-bold tracking-tight text-white leading-tight">
              {trip.title}
            </h1>
            {trip.description && <p className="text-paper/85 text-xs sm:text-sm leading-relaxed max-w-xl font-sans font-normal">{trip.description}</p>}
            
            <div className="flex items-center space-x-2 text-xs text-paper/70 font-semibold pt-1 font-sans">
              <Calendar className="h-4 w-4 text-coral shrink-0" />
              <span>{formatDate(trip.startDate)} &mdash; {formatDate(trip.endDate)}</span>
            </div>
          </div>
        </div>

        {/* Home logo watermark links */}
        <div className="absolute top-6 left-6 sm:left-12 z-20">
          <Link to="/" className="flex items-center space-x-2 text-white font-editorial font-bold text-lg tracking-tight bg-black/25 px-3.5 py-1.5 rounded-sm backdrop-blur-sm border border-white/10">
            <Compass className="h-4.5 w-4.5 text-coral" />
            <span className="font-editorial italic font-normal text-white">Trip</span>
            <span className="font-editorial font-bold -ml-1">Pilot</span>
          </Link>
        </div>
      </div>

      {/* Main layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {copySuccess && (
          <div className="flex items-center space-x-2.5 bg-green-50 border-l-2 border-green-500 text-green-700 p-4 rounded-sm text-xs font-sans animate-fadeIn">
            <CheckCircle className="h-5 w-5 shrink-0 animate-bounce" />
            <span>{copySuccess}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between bg-surface p-6 rounded-sm border border-sand gap-6">
          <div className="flex items-center space-x-8">
            <div>
              <span className="block text-[9px] font-bold text-charcoal-muted uppercase tracking-wider font-sans">Estimated Budget</span>
              <span className="text-2xl font-black text-charcoal flex items-center mt-1">
                <span>{formatCurrency(calculateTotal())}</span>
              </span>
            </div>
            <div className="border-l border-sand h-8 hidden sm:block" />
            <div>
              <span className="block text-[9px] font-bold text-charcoal-muted uppercase tracking-wider font-sans">Total stops</span>
              <span className="text-base font-bold text-teal mt-1 block">{trip.stops.length} stopover cities</span>
            </div>
          </div>

          <div className="shrink-0 w-full sm:w-auto space-y-4">
            {isLoggedIn ? (
              <button
                onClick={handleCopyTrip}
                disabled={copying}
                className="w-full flex items-center justify-center space-x-1.5 bg-teal hover:bg-teal-hover text-paper px-6 py-3 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm font-sans"
              >
                {copying ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copying ? 'Copying...' : 'Clone this trip'}</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="w-full flex items-center justify-center space-x-1.5 bg-charcoal hover:bg-charcoal/90 text-paper px-6 py-3 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm font-sans"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Log in to clone trip</span>
              </Link>
            )}
            
            <div className="space-y-2 border-t border-sand/40 pt-3">
              <span className="text-[9px] font-bold text-charcoal-muted uppercase tracking-wider block text-center sm:text-left font-sans">Share this journal</span>
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-1.5 font-sans">
                <button onClick={() => window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent('Check out this travel itinerary: ' + trip.title) + '&url=' + encodeURIComponent(window.location.href), '_blank')}
                  className="px-2.5 py-1 text-[9px] font-bold border border-sand rounded-sm hover:bg-paper transition-colors uppercase tracking-wider">Twitter</button>
                <button onClick={() => window.open('https://wa.me/?text=' + encodeURIComponent('Check out this travel itinerary: ' + trip.title + ' ' + window.location.href), '_blank')}
                  className="px-2.5 py-1 text-[9px] font-bold border border-sand rounded-sm hover:bg-paper transition-colors uppercase tracking-wider">WhatsApp</button>
                <button onClick={() => window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href), '_blank')}
                  className="px-2.5 py-1 text-[9px] font-bold border border-sand rounded-sm hover:bg-paper transition-colors uppercase tracking-wider">Facebook</button>
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); }}
                  className="px-2.5 py-1 text-[9px] font-bold border border-sand rounded-sm hover:bg-paper transition-colors uppercase tracking-wider">
                  {linkCopied ? '✓ Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Stops List (Left Column - Span 4) */}
          <div className="lg:col-span-4 bg-surface border border-sand p-6 rounded-sm space-y-4 h-max">
            <h2 className="text-base font-bold text-charcoal flex items-center space-x-2 border-b border-sand pb-3">
              <MapPin className="h-4.5 w-4.5 text-teal shrink-0" />
              <span className="font-editorial font-bold text-lg text-charcoal">Cities & Stopovers</span>
            </h2>

            {trip.stops.length === 0 ? (
              <p className="text-charcoal-muted text-xs py-4 text-center">No stop details listed.</p>
            ) : (
              <div className="space-y-4">
                {trip.stops.map((stop, index) => (
                  <div key={stop.id} className="border border-sand rounded-sm p-4 bg-paper/30 space-y-3 font-sans">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="bg-paper text-teal font-editorial font-bold text-xs rounded-full h-5 w-5 flex items-center justify-center border border-sand">
                          {index + 1}
                        </span>
                        <h3 className="font-bold text-charcoal text-sm leading-none">{stop.cityName}, {stop.country}</h3>
                      </div>
                      <p className="text-[9px] text-charcoal-muted font-bold uppercase tracking-wider mt-0.5">
                        {formatDate(stop.startDate)} &mdash; {formatDate(stop.endDate)}
                      </p>
                    </div>

                    <div className="border-t border-sand/60 pt-2.5 space-y-1.5">
                      <span className="text-[9px] text-charcoal-muted font-bold uppercase tracking-wider block">Attached Activities</span>
                      {stop.activities.length === 0 ? (
                        <p className="text-[10px] text-charcoal-muted italic">No activities listed.</p>
                      ) : (
                        <div className="space-y-1.5">
                          {stop.activities.map((act) => (
                            <div key={act.id} className="flex items-center justify-between text-xs bg-white border border-sand p-2.5 rounded-sm gap-2">
                              <span className="font-medium text-charcoal truncate">{act.name}</span>
                              <span className="text-[9px] text-teal font-extrabold shrink-0">{formatCurrency(act.estimatedCost)}</span>
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
          <div className="lg:col-span-8 bg-surface border border-sand p-6 rounded-sm space-y-4">
            <h2 className="text-base font-bold text-charcoal flex items-center space-x-2 border-b border-sand pb-3">
              <Calendar className="h-4.5 w-4.5 text-teal shrink-0" />
              <span className="font-editorial font-bold text-lg text-charcoal">Timeline Schedule</span>
            </h2>

            {trip.itineraryItems.length === 0 ? (
              <p className="text-charcoal-muted text-xs py-8 text-center font-sans">No schedule events logged.</p>
            ) : (
              <div className="relative border-l border-sand pl-5 ml-2.5 space-y-6 py-2">
                {trip.itineraryItems.map((item) => (
                  <div key={item.id} className="relative space-y-2 bg-paper/30 border border-sand p-4 rounded-sm font-sans">
                    
                    {/* Bullet marker */}
                    <span className={`absolute -left-[26.5px] top-[18px] h-3 w-3 rounded-full border-2 ring-4 ring-paper ${
                      item.activity?.category ? getCategoryColor(item.activity.category).split(' ')[0] : 'border-charcoal-muted bg-charcoal-muted'
                    }`} />
                    
                    <div className="space-y-1">
                      <span className="text-[9px] text-charcoal font-bold uppercase bg-sand-light px-2 py-0.5 rounded-sm border border-sand/60">
                        {new Date(item.itineraryDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      <h3 className="font-bold text-charcoal text-sm leading-snug">{item.title}</h3>
                    </div>

                    {item.description && (
                      <p className="text-charcoal-muted text-xs leading-relaxed font-sans font-normal">{item.description}</p>
                    )}

                    {(item.startTime || item.endTime) && (
                      <div className="flex items-center space-x-1.5 text-[9px] text-charcoal-muted font-bold bg-white p-1.5 rounded-sm w-max border border-sand/40">
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

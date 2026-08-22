import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getDestinationImage } from '../data/destinations';

export interface RouteStop {
  id: string;
  cityName: string;
  country: string;
  startDate?: string | null;
  endDate?: string | null;
  stopOrder: number;
  tripId?: string;
}

interface RouteVisualizerProps {
  stops: RouteStop[];
  loading?: boolean;
}

const formatDate = (date?: string | null): string | null => {
  if (!date) return null;
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const formatStopDates = (stop: RouteStop): string => {
  const start = formatDate(stop.startDate);
  const end = formatDate(stop.endDate);
  if (!start || !end) return 'Dates not set';
  return `${start} - ${end}`;
};

const RouteImage: React.FC<{ city: string; country: string }> = ({ city, country }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative h-full w-full bg-sand-light">
      {!loaded && <div className="absolute inset-0 animate-pulse bg-sand-light" aria-hidden="true" />}
      <img
        src={failed ? getDestinationImage('', '') : getDestinationImage(city, country)}
        alt={`${city}, ${country}`}
        className={`h-full w-full object-cover grayscale-[10%] transition-all duration-[600ms] group-hover:scale-105 group-hover:grayscale-0 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => { if (!failed) setFailed(true); }}
      />
    </div>
  );
};

export const RouteVisualizer: React.FC<RouteVisualizerProps> = ({ stops, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-8 pt-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={`route-skeleton-${index}`} className="animate-pulse rounded-sm border border-sand bg-surface p-6 space-y-4">
            <div className="h-36 rounded-sm bg-sand-light" />
            <div className="h-4 w-2/3 rounded-sm bg-sand-light" />
            <div className="h-3 w-1/2 rounded-sm bg-sand-light" />
          </div>
        ))}
      </div>
    );
  }

  if (stops.length === 0) {
    return (
      <div className="border border-dashed border-sand p-12 text-center rounded-sm bg-surface max-w-lg mx-auto space-y-3.5 animate-fadeIn">
        <h4 className="font-editorial text-lg font-bold text-charcoal">No stops added yet.</h4>
        <p className="text-xs text-charcoal-muted font-sans font-normal leading-relaxed pb-2">
          Start planning your trip by adding a destination.
        </p>
        <Link 
          to="/dashboard" 
          className="inline-block bg-teal hover:bg-teal/95 text-paper font-bold text-[10px] uppercase tracking-wider py-2.5 px-6 rounded-sm transition-colors shadow-sm"
        >
          Plan New Trip
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 pt-4 sm:grid-cols-2 lg:grid-cols-3">
      {stops.map((stop, index) => {
        const linkTarget = stop.tripId ? `/trips/${stop.tripId}` : '/dashboard';
        return (
          <Link
            key={stop.id}
            to={linkTarget}
            className="group relative block space-y-4 rounded-sm border border-sand bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-charcoal/25 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2"
          >
            {/* Numbering */}
            <div className="absolute right-6 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-sand bg-paper text-[10px] font-black text-teal font-sans z-10">
              {String(index + 1).padStart(2, '0')}
            </div>

            {/* Image Container with Consistent Aspect Ratio */}
            <div className="h-40 overflow-hidden rounded-sm border border-sand bg-sand-light relative">
              <RouteImage city={stop.cityName} country={stop.country} />
            </div>

            {/* Details */}
            <div className="space-y-2">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-coral font-sans block leading-none">
                Destination {index + 1}
              </span>
              <h3 className="font-editorial text-xl font-bold text-charcoal leading-tight tracking-tight group-hover:text-teal transition-colors">
                {stop.cityName}
              </h3>
              <p className="text-xs text-charcoal-muted font-sans font-normal">
                {stop.country} · {stop.startDate && stop.endDate ? formatStopDates(stop) : 'Dates not set'}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

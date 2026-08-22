import React, { useState } from 'react';
import { getDestinationImage } from '../data/destinations';

export interface RouteStop {
  id: string;
  cityName: string;
  country: string;
  startDate?: string | null;
  endDate?: string | null;
  stopOrder: number;
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
        src={failed ? getDestinationImage('') : getDestinationImage(city)}
        alt={`${city}, ${country}`}
        className={`h-full w-full object-cover grayscale-[10%] transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => { if (!failed) setFailed(true); }}
      />
    </div>
  );
};

export const RouteVisualizer: React.FC<RouteVisualizerProps> = ({ stops, loading = false }) => (
  <div className="grid grid-cols-1 gap-8 pt-4 sm:grid-cols-2 lg:grid-cols-3">
    {loading && Array.from({ length: 3 }, (_, index) => (
      <div key={`route-skeleton-${index}`} className="animate-pulse rounded-xl border border-sand bg-paper p-5 space-y-4">
        <div className="h-32 rounded-lg bg-sand-light" />
        <div className="h-4 w-2/3 rounded bg-sand-light" />
        <div className="h-3 w-1/2 rounded bg-sand-light" />
      </div>
    ))}
    {!loading && stops.length === 0 && <p className="col-span-full border border-dashed border-sand p-8 text-center text-xs text-charcoal-muted">Your journey starts here. Add your first destination to see your route take shape.</p>}
    {!loading && stops.map((stop, index) => (
      <article key={stop.id} className="relative space-y-4 rounded-xl border border-sand bg-paper p-5 transition-shadow hover:shadow-md">
        <div className="absolute right-5 top-5 flex h-6 w-6 items-center justify-center rounded-full border border-sand bg-sand-light text-[10px] font-black">{String(index + 1).padStart(2, '0')}</div>
        <div className="h-32 overflow-hidden rounded-lg border border-sand bg-sand-light">
          <RouteImage city={stop.cityName} country={stop.country} />
        </div>
        <div className="space-y-1.5">
          <span className="text-xs font-extrabold uppercase text-coral">Destination {index + 1}</span>
          <h3 className="font-bold text-lg">{stop.cityName}</h3>
          <p className="text-xs text-charcoal-muted">{stop.country} · {formatStopDates(stop)}</p>
        </div>
      </article>
    ))}
  </div>
);

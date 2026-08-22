import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Destination } from '../types/destination';
import { getDestinationImage } from '../data/destinations';

interface DestinationCardProps {
  destination: Destination;
  onSelect?: (destination: Destination) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination, onSelect }) => {
  const navigate = useNavigate();
  const plan = () => onSelect ? onSelect(destination) : navigate(`/trips/new?destination=${encodeURIComponent(destination.city)}`);

  return (
    <article className="bg-paper border border-sand rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="aspect-[5/3] overflow-hidden bg-sand-light">
        <img src={destination.imageUrl || getDestinationImage(destination.city)} alt={`${destination.city}, ${destination.country}`} className="h-full w-full object-cover grayscale-[10%]" onError={(event) => { event.currentTarget.src = getDestinationImage(''); }} />
      </div>
      <div className="flex flex-1 flex-col p-4 gap-3">
        <div className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-coral" /><div><h3 className="font-editorial text-lg font-bold">{destination.city}</h3><p className="text-xs text-charcoal-muted">{destination.country}</p></div></div>
        {destination.description && <p className="text-xs leading-relaxed text-charcoal-muted">{destination.description}</p>}
        <button onClick={plan} className="mt-auto flex items-center gap-1 text-left text-xs font-bold text-teal hover:text-coral">Plan this city <ArrowRight className="h-3.5 w-3.5" /></button>
      </div>
    </article>
  );
};

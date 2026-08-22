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
  const plan = () => onSelect ? onSelect(destination) : navigate(`/dashboard?destination=${encodeURIComponent(destination.city)}`);

  return (
    <article className="group bg-surface border border-sand rounded-sm overflow-hidden hover:border-charcoal/30 transition-all flex flex-col duration-300">
      <div className="aspect-[3/2] overflow-hidden bg-sand-light relative">
        <img 
          src={destination.imageUrl || getDestinationImage(destination.city, destination.country)} 
          alt={`${destination.city}, ${destination.country}`} 
          className="h-full w-full object-cover grayscale-[15%] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 ease-out" 
          onError={(event) => { event.currentTarget.src = getDestinationImage('', ''); }} 
        />
      </div>
      <div className="flex flex-1 flex-col p-5 gap-3">
        <div className="flex items-start gap-2.5">
          <MapPin className="mt-1 h-3.5 w-3.5 shrink-0 text-coral" />
          <div>
            <h3 className="font-editorial text-lg font-bold text-charcoal tracking-tight leading-tight">{destination.city}</h3>
            <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mt-0.5">{destination.country}</p>
          </div>
        </div>
        
        {destination.description && (
          <p className="text-xs leading-relaxed text-charcoal-muted font-sans font-normal mt-1 flex-1">
            {destination.description}
          </p>
        )}
        
        <button 
          onClick={plan} 
          className="mt-4 flex items-center gap-1.5 text-left text-[10px] font-bold uppercase tracking-widest text-teal group-hover:text-coral transition-colors duration-300 w-max"
        >
          <span>Plan trip</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </article>
  );
};

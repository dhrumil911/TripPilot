import { Destination } from '../types/destination';

export const destinationCatalog: Record<string, Pick<Destination, 'description' | 'imageUrl'>> = {
  udaipur: {
    description: 'Palace tours, boat rides on Lake Pichola, and heritage stays.',
  },
  jaipur: {
    description: 'Amber Fort, bustling bazaars, and traditional Rajasthani thalis.',
  },
  delhi: {
    description: 'Mughal monuments, street food in Chandni Chowk, and rich history.',
  },
  kochi: {
    description: 'Backwater cruises, spice markets, and Portuguese heritage.',
  },
  mumbai: {
    description: 'Marine Drive, Art Deco streets, and an extraordinary food scene.',
  },
  ahmedabad: {
    description: 'Living heritage, thoughtful design, and the Sabarmati waterfront.',
  },
  paris: {
    description: 'Grand boulevards, intimate cafés, and timeless museums.',
  },
  tokyo: {
    description: 'Neon neighborhoods, quiet shrines, and precise culinary craft.',
  },
  rome: {
    description: 'Ancient streets, living history, and long Roman dinners.',
  },
  'new york': {
    description: 'Neighborhood energy, skyline walks, and culture at every turn.',
  },
};

const imageApiBase = 'http://localhost:4000/api/images/city';

export const normalizeDestination = (value: string | null | undefined): string =>
  (value || '').trim().toLocaleLowerCase();

export const getDestinationImage = (city: string | null | undefined): string =>
  `${imageApiBase}?city=${encodeURIComponent(city?.trim() || '')}`;

export const enrichDestination = (destination: Destination): Destination => ({
  ...destination,
  ...destinationCatalog[normalizeDestination(destination.city)],
});

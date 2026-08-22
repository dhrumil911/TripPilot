export interface CatalogActivity {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedCost: string;
  durationMinutes: number;
}

export const getCuratedActivitiesForCity = (cityName: string): CatalogActivity[] => {
  const norm = cityName.toLowerCase().trim();
  
  if (norm.includes('jaipur')) {
    return [
      { id: 'j-1', name: 'Amber Fort tour', description: 'Explore the majestic hilltop fort palace overlooking Maota Lake.', category: 'culture', estimatedCost: '550.00', durationMinutes: 180 },
      { id: 'j-2', name: 'Hawa Mahal Palace of Wind', description: 'See the ornate pink sandstone window facades in the old bazaar.', category: 'sightseeing', estimatedCost: '200.00', durationMinutes: 90 },
      { id: 'j-3', name: 'City Palace heritage walk', description: 'Visit royal museum rooms and decorative courtyard gates.', category: 'culture', estimatedCost: '500.00', durationMinutes: 150 },
      { id: 'j-4', name: 'Jantar Mantar observatory', description: 'Discover stone astronomical instruments from medieval eras.', category: 'sightseeing', estimatedCost: '200.00', durationMinutes: 90 },
      { id: 'j-5', name: 'Nahargarh Fort sunset view', description: 'Watch the sunset over the Pink City from the historical walls.', category: 'adventure', estimatedCost: '150.00', durationMinutes: 120 },
      { id: 'j-6', name: 'Jal Mahal lake view', description: 'View the floating palace in the center of Sagar Lake.', category: 'sightseeing', estimatedCost: '0.00', durationMinutes: 60 },
      { id: 'j-7', name: 'Albert Hall Museum', description: 'Explore Rajasthan’s state museum of arts, history, and craft.', category: 'culture', estimatedCost: '300.00', durationMinutes: 120 },
      { id: 'j-8', name: 'Jaipur Local Market tour', description: 'Shop for jewelry, blue pottery, and textiles in Johari Bazaar.', category: 'shopping', estimatedCost: '0.00', durationMinutes: 180 },
      { id: 'j-9', name: 'Chokhi Dhani ethnic resort', description: 'Enjoy traditional dances, puppet shows, and Rajasthani thali dinners.', category: 'food', estimatedCost: '1200.00', durationMinutes: 240 }
    ];
  }
  
  if (norm.includes('udaipur')) {
    return [
      { id: 'u-1', name: 'Lake Pichola boat ride', description: 'Sail past Lake Palace and Jag Mandir during golden hour.', category: 'sightseeing', estimatedCost: '800.00', durationMinutes: 120 },
      { id: 'u-2', name: 'Udaipur City Palace', description: 'Wander through the massive lake-facing royal complex and museums.', category: 'culture', estimatedCost: '400.00', durationMinutes: 150 },
      { id: 'u-3', name: 'Jagdish Temple visit', description: 'Attend morning prayers at the historic three-story carved temple.', category: 'spiritual', estimatedCost: '0.00', durationMinutes: 60 },
      { id: 'u-4', name: 'Sajjangarh Monsoon Palace', description: 'Ride to the hilltop palace for panoramic valley views.', category: 'sightseeing', estimatedCost: '350.00', durationMinutes: 120 },
      { id: 'u-5', name: 'Fateh Sagar Lake walk', description: 'Walk the scenic lake walkway and explore Nehru Park island.', category: 'nature', estimatedCost: '0.00', durationMinutes: 90 },
      { id: 'u-6', name: 'Saheliyon-ki-Bari garden', description: 'Walk through royal gardens with marble fountains and lotus pools.', category: 'nature', estimatedCost: '100.00', durationMinutes: 90 },
      { id: 'u-7', name: 'Bagore Ki Haveli show', description: 'Watch traditional folk music and pot balancing dances at night.', category: 'culture', estimatedCost: '250.00', durationMinutes: 120 }
    ];
  }

  if (norm.includes('delhi')) {
    return [
      { id: 'd-1', name: 'India Gate walk', description: 'Walk around the war memorial lawns and sample local street food.', category: 'sightseeing', estimatedCost: '0.00', durationMinutes: 90 },
      { id: 'd-2', name: 'Red Fort heritage tour', description: 'Walk the sandstone corridors of the Mughal empire’s central fort.', category: 'culture', estimatedCost: '500.00', durationMinutes: 150 },
      { id: 'd-3', name: 'Qutub Minar complex', description: 'See the tallest brick minaret and surrounding ancient ruins.', category: 'heritage', estimatedCost: '300.00', durationMinutes: 120 },
      { id: 'd-4', name: 'Humayun\'s Tomb park', description: 'Explore the precursor garden tomb that inspired the Taj Mahal.', category: 'nature', estimatedCost: '300.00', durationMinutes: 120 },
      { id: 'd-5', name: 'Lotus Temple meditation', description: 'Sit inside the Bahai flower-shaped temple of peace.', category: 'spiritual', estimatedCost: '0.00', durationMinutes: 90 },
      { id: 'd-6', name: 'Akshardham Temple light show', description: 'Explore the grand temple complex and watch the musical fountains.', category: 'spiritual', estimatedCost: '250.00', durationMinutes: 240 },
      { id: 'd-7', name: 'Chandni Chowk food walk', description: 'Eat hot parathas, jalebis, and chaat in the narrow old Delhi lanes.', category: 'food', estimatedCost: '800.00', durationMinutes: 180 },
      { id: 'd-8', name: 'National Museum walk', description: 'Trace ancient Harappan relics and Buddhist arts through galleries.', category: 'culture', estimatedCost: '150.00', durationMinutes: 180 }
    ];
  }

  if (norm.includes('agra')) {
    return [
      { id: 'ag-1', name: 'Taj Mahal sunrise tour', description: 'Watch the sunrise paint the marble white palace in pink hues.', category: 'sightseeing', estimatedCost: '1100.00', durationMinutes: 180 },
      { id: 'ag-2', name: 'Agra Fort walk', description: 'Walk through massive red sandstone walls enclosing royal quarters.', category: 'culture', estimatedCost: '600.00', durationMinutes: 120 },
      { id: 'ag-3', name: 'Mehtab Bagh garden', description: 'View the Taj Mahal across the Yamuna River without the crowds.', category: 'nature', estimatedCost: '250.00', durationMinutes: 90 },
      { id: 'ag-4', name: 'Itmad-ud-Daulah (Baby Taj)', description: 'Visit the delicate marble draft tomb showcasing fine inlay works.', category: 'culture', estimatedCost: '200.00', durationMinutes: 90 },
      { id: 'ag-5', name: 'Fatehpur Sikri excursion', description: 'Drive to Emperor Akbar’s abandoned red stone capital palace.', category: 'heritage', estimatedCost: '500.00', durationMinutes: 240 }
    ];
  }

  if (norm.includes('mumbai')) {
    return [
      { id: 'm-1', name: 'Gateway of India & Taj Palace', description: 'Take pictures at the harbor front monument of South Mumbai.', category: 'sightseeing', estimatedCost: '0.00', durationMinutes: 60 },
      { id: 'm-2', name: 'Marine Drive sunset walk', description: 'Stroll the Queen\'s Necklace bay side as night lights turn on.', category: 'nature', estimatedCost: '0.00', durationMinutes: 90 },
      { id: 'm-3', name: 'Elephanta Caves ferry ride', description: 'Ride boats to the island containing rock-cut Shiva temples.', category: 'culture', estimatedCost: '400.00', durationMinutes: 240 },
      { id: 'm-4', name: 'Colaba Causeway shopping', description: 'Bargain for clothes, artifacts, and local cafe items at Leopold.', category: 'shopping', estimatedCost: '0.00', durationMinutes: 120 },
      { id: 'm-5', name: 'CSMT heritage building walk', description: 'Admire the gothic architectural carvings of the central terminal.', category: 'culture', estimatedCost: '0.00', durationMinutes: 60 }
    ];
  }

  if (norm.includes('goa')) {
    return [
      { id: 'g-1', name: 'Baga Beach water sports', description: 'Jet ski, parasail, and try banana boat rides over the waves.', category: 'adventure', estimatedCost: '1500.00', durationMinutes: 120 },
      { id: 'g-2', name: 'Calangute beach shacks', description: 'Relax under sun beds and eat Goan fish curry at beachside tables.', category: 'food', estimatedCost: '800.00', durationMinutes: 180 },
      { id: 'g-3', name: 'Fort Aguada lighthouse walk', description: 'Climb the 17th-century Portuguese fort overlooking the sea.', category: 'sightseeing', estimatedCost: '0.00', durationMinutes: 90 },
      { id: 'g-4', name: 'Basilica of Bom Jesus', description: 'Visit the world heritage church containing relics of St. Francis.', category: 'spiritual', estimatedCost: '0.00', durationMinutes: 90 },
      { id: 'g-5', name: 'Anjuna Beach flea market', description: 'Browse boho jewelry, clothing, and local Goan souvenirs.', category: 'shopping', estimatedCost: '0.00', durationMinutes: 150 },
      { id: 'g-6', name: 'Dudhsagar Falls trek', description: 'Take a jeep safari through the jungle to the multi-tiered waterfall.', category: 'nature', estimatedCost: '1800.00', durationMinutes: 300 }
    ];
  }

  // Fallback for any other Indian city: dynamic personalized lists!
  return [
    { id: `${norm}-f1`, name: `${cityName} Heritage Walk`, description: `Walk through local streets and historic landmarks in ${cityName}.`, category: 'culture', estimatedCost: '300.00', durationMinutes: 120 },
    { id: `${norm}-f2`, name: `${cityName} Local Sightseeing`, description: `Visit the most popular viewpoints and scenic locations in ${cityName}.`, category: 'sightseeing', estimatedCost: '400.00', durationMinutes: 180 },
    { id: `${norm}-f3`, name: `${cityName} Food Tour`, description: `Taste traditional culinary dishes and street foods native to ${cityName}.`, category: 'food', estimatedCost: '600.00', durationMinutes: 150 },
    { id: `${norm}-f4`, name: `${cityName} Local Market shopping`, description: `Browse bazaars for unique handlooms, crafts, and items in ${cityName}.`, category: 'shopping', estimatedCost: '0.00', durationMinutes: 120 }
  ];
};

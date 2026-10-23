export const destinations = [
  { id: 'bali', name: 'Bali', country: 'Indonesia', region: 'Asia', image: '/images/bali.jpg', category: 'Beach', label: 'A slower kind of paradise', days: 5, description: 'Temple mornings, green rice terraces, and a little time by the sea.', interests: ['Nature', 'Relaxation'] },
  { id: 'kyoto', name: 'Kyoto', country: 'Japan', region: 'Asia', image: '/images/kyoto.jpg', category: 'Culture', label: 'Find beauty in the little things', days: 4, description: 'Quiet gardens, lantern-lit lanes, and traditions worth taking your time for.', interests: ['Culture', 'Food & drink'] },
  { id: 'italy', name: 'Cinque Terre', country: 'Italy', region: 'Europe', image: '/images/italy.jpg', category: 'Beach', label: 'Take the scenic route', days: 4, description: 'Colorful villages and coastal walks, with long lunches in between.', interests: ['Food & drink', 'Nature'] },
  { id: 'alps', name: 'Swiss Alps', country: 'Switzerland', region: 'Europe', image: '/images/alps.jpg', category: 'Adventure', label: 'A breath of fresh mountain air', days: 6, description: 'Big mountain views and small alpine villages for your next escape.', interests: ['Adventure', 'Nature'] },
  { id: 'santorini', name: 'Santorini', country: 'Greece', region: 'Europe', image: '/images/santorini.jpg', category: 'Beach', label: 'Chase a different shade of blue', days: 4, description: 'Whitewashed lanes, caldera views, and unhurried island afternoons.', interests: ['Relaxation', 'Culture'] },
  { id: 'paris', name: 'Paris', country: 'France', region: 'Europe', image: '/images/paris.jpg', category: 'City', label: 'Make room for a little romance', days: 4, description: 'Neighborhood cafés, art-filled afternoons, and walks along the Seine.', interests: ['Culture', 'Food & drink'] },
] as const;
export type Destination = typeof destinations[number];
export function destinationImage(name: string) {
  return destinations.find(item => name.toLowerCase().includes(item.name.toLowerCase()))?.image ?? '/images/santorini.jpg';
}


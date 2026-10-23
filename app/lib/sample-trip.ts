import type { TripData } from './trip-schema';

export const sampleTrip: TripData = {
  destination: 'Kyoto, Japan', budget: 'Moderate', days: 3, travelers: 2, pace: 'Balanced', startDate: '',
  interests: ['Culture', 'Food & drink'], notes: '',
  summary: 'Three unhurried days of temple gardens, neighborhood discoveries, and good food. A sample of what your own adventure could look like.',
  tips: ['This is a sample itinerary, not a live booking or a current price quote.', 'Check attraction hours and reservation requirements before visiting.', 'Leave room between stops for transit, breaks, and an unexpected discovery.'],
  itinerary: [
    { day: 1, theme: 'Old streets & new discoveries', activities: [
      { timeOfDay: 'Morning', placeName: 'Kiyomizu-dera', description: 'Start with temple grounds and hillside views, then wander the historic lanes at your own pace.', estimatedCost: 'Check current admission (JPY)' },
      { timeOfDay: 'Afternoon', placeName: 'Ninenzaka and Sannenzaka', description: 'Follow the sloping lanes, browse small shops, and find a quiet spot for lunch.', estimatedCost: 'Food and shopping extra (JPY)' },
      { timeOfDay: 'Evening', placeName: 'Gion', description: 'Take a respectful stroll through the neighborhood and settle into a restaurant for dinner. Follow local photography rules.', estimatedCost: 'Dinner varies (JPY)' },
    ] },
    { day: 2, theme: 'Bamboo paths & riverside pauses', activities: [
      { timeOfDay: 'Morning', placeName: 'Arashiyama Bamboo Grove', description: 'Walk beneath the bamboo before continuing toward the surrounding neighborhood.', estimatedCost: 'Walk free; transit extra' },
      { timeOfDay: 'Afternoon', placeName: 'Tenryu-ji', description: 'Make time for the garden and a relaxed lunch around Arashiyama.', estimatedCost: 'Check current admission (JPY)' },
      { timeOfDay: 'Evening', placeName: 'Togetsukyo Bridge', description: 'Enjoy the riverside, then return to your base for a low-key evening.', estimatedCost: 'Walk free; dinner extra' },
    ] },
    { day: 3, theme: 'Torii gates & one last taste', activities: [
      { timeOfDay: 'Morning', placeName: 'Fushimi Inari Taisha', description: 'Explore the shrine paths. Choose a shorter walk or a longer climb depending on your energy.', estimatedCost: 'Walk free; transit extra' },
      { timeOfDay: 'Afternoon', placeName: 'Nishiki Market', description: 'Browse the food stalls and pick a few things to try, following each shop’s eating guidelines.', estimatedCost: 'Food purchases vary (JPY)' },
      { timeOfDay: 'Evening', placeName: 'Kamo River', description: 'Finish with a riverside walk and a final dinner nearby.', estimatedCost: 'Walk free; dinner extra' },
    ] },
  ],
};


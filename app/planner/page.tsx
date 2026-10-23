import Planner from '../components/planner';
export const metadata = { title: 'Plan your next adventure | roam.' };
export default async function PlannerPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  return <Planner initialDestination={typeof query.destination === 'string' ? query.destination.slice(0, 100) : ''} initialDays={Math.min(10, Math.max(1, Number(query.days) || 5))} initialTravelers={Math.min(12, Math.max(1, Number(query.travelers) || 2))} />;
}


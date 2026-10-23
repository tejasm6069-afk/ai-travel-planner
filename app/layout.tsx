import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import Shell from './components/shell';
import './globals.css';

export const metadata: Metadata = {
  title: 'roam. — A trip that feels like you',
  description: 'Discover your next adventure. Create personal AI travel itineraries, save your favorite places, and bring every day of your trip together.',
  applicationName: 'roam.',
  icons: { icon: '/icon.svg' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const content = <Shell>{children}</Shell>;
  return <html lang="en"><body>{process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? <ClerkProvider>{content}</ClerkProvider> : content}</body></html>;
}


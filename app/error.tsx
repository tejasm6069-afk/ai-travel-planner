'use client';
import Link from 'next/link';
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="empty-state"><p className="eyebrow">A SMALL DETOUR</p><h1>Let’s find our way back.</h1><p>Something didn’t load as expected. Your next adventure can wait a moment.</p><button className="button primary" onClick={reset}>Try again</button><Link href="/" className="text-link">Back to discover</Link></div>;
}


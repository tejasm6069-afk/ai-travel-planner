'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/app/components/travel-icon';

export default function DeleteButton({ tripId }: { tripId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  async function remove() {
    setDeleting(true); setError('');
    try {
      const response = await fetch('/api/delete-trip', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: tripId }) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'The trip couldn’t be deleted.');
      try { localStorage.removeItem('roam-trip-tools-' + tripId); } catch { /* Server deletion already succeeded. */ }
      router.push('/trips'); router.refresh();
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Please try again.'); setDeleting(false); }
  }
  return <div className="delete-control">{confirming ? <div className="delete-confirm"><span>Delete this saved trip permanently?</span><button className="button danger small" disabled={deleting} onClick={remove}>{deleting ? 'Deleting…' : 'Yes, delete'}</button><button className="button secondary small" disabled={deleting} onClick={() => setConfirming(false)}>Keep trip</button></div> : <button className="button secondary small" onClick={() => setConfirming(true)}><Icon name="trash" size={16} /> Delete trip</button>}{error && <p role="alert" className="error-text">{error}</p>}</div>;
}



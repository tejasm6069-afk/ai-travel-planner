'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteButtonProps {
  tripId: string;
}

export default function DeleteButton({ tripId }: DeleteButtonProps) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this trip?')) return;

    setDeleting(true);
    try {
      const res = await fetch('/api/delete-trip', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tripId }),
      });

      const result = await res.json();

      if (result.success) {
        router.push('/trips');
        router.refresh();
      } else {
        alert('Failed to delete trip.');
        setDeleting(false);
      }
    } catch (err) {
      alert('An error occurred.');
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-lg font-medium text-sm transition duration-200 disabled:opacity-50"
    >
      {deleting ? 'Deleting...' : 'Delete Trip'}
    </button>
  );
}
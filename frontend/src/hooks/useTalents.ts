import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Talent } from '../types/event';

export function useTalents() {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/talents');
        setTalents(response.data || []);
      } catch (err) {
        console.error('Failed to fetch talents', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setTalents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTalents();
  }, []);

  return { talents, loading, error };
}

import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Talent } from '../types/event';

export function useTalents(options: { enabled?: boolean } = {}) {
  const { enabled = true } = options;
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

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
  }, [enabled]);

  return { talents, loading, error };
}

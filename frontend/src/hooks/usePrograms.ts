import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Program } from '../types/program';

export function usePrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/programs');
        setPrograms(response.data || []);
      } catch (err) {
        console.error('Failed to fetch programs', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  return { programs, loading, error };
}

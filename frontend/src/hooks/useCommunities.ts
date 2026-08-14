import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Community } from '../types/community';

export function useCommunities() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/communities');
        setCommunities(response.data || []);
      } catch (err) {
        console.error('Failed to fetch communities', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setCommunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  return { communities, loading, error };
}

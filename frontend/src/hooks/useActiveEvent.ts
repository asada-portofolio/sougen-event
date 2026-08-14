import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { ActiveEvent } from '../types/event';

export function useActiveEvent() {
  const [event, setEvent] = useState<ActiveEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchActiveEvent = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/events/active');
        if (response.data) {
          setEvent(response.data);
        } else {
          setEvent(null);
        }
      } catch (err) {
        console.error('Failed to fetch active event', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveEvent();
  }, []);

  return { event, loading, error };
}

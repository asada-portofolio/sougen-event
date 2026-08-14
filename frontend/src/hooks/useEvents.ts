import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { EventSummary } from '../types/event';

export function useEvents() {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/events');
        setEvents(response.data || []);
      } catch (err) {
        console.error('Failed to fetch events', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
}

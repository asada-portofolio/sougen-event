import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { EventDetailData } from '../types/event';

export function useEventDetail(slug: string | undefined) {
  const [event, setEvent] = useState<EventDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEventDetail = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await api.get(`/api/events/${slug}`);
        setEvent(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch event detail', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [slug]);

  return { event, loading, error };
}

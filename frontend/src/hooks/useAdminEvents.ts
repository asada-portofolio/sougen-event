import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export interface EventBasic {
  id: number;
  slug: string;
  name: string;
  theme: string | null;
  startDate: string;
  endDate: string;
  location: string;
  isActive: boolean;
  posterImageUrl: string | null;
  // Untuk menghitung kelengkapan
  _count?: {
    eventTalents: number;
    galleryPhotos: number;
    eventDays: number;
  };
}

export function useAdminEvents() {
  const [events, setEvents] = useState<EventBasic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/events');
      setEvents(response.data || []);
    } catch (err) {
      console.error('Failed to fetch events', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    Promise.resolve().then(() => {
      if (mounted) fetchEvents();
    });
    return () => { mounted = false; };
  }, [fetchEvents]);

  const toggleEventStatus = async (id: number, isActive: boolean) => {
    try {
      await api.put(`/api/events/${id}`, { isActive });
      await fetchEvents();
      return true;
    } catch (err) {
      console.error('Failed to toggle status', err);
      return false;
    }
  };

  const createEvent = async (data: { name: string; startDate: string; endDate: string; location: string }) => {
    try {
      const response = await api.post('/api/events', data);
      await fetchEvents();
      return response.data;
    } catch (err) {
      console.error('Failed to create event', err);
      throw err;
    }
  };

  return { events, loading, error, refetch: fetchEvents, toggleEventStatus, createEvent };
}

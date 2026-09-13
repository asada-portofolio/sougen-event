import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { ActiveEvent } from '../types/event';

const ACTIVE_EVENT_CACHE_KEY = 'sougen_active_event_cache';

export function useActiveEvent() {
  const [event, setEvent] = useState<ActiveEvent | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const cached = localStorage.getItem(ACTIVE_EVENT_CACHE_KEY);
      return cached ? (JSON.parse(cached) as ActiveEvent) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      return !localStorage.getItem(ACTIVE_EVENT_CACHE_KEY);
    } catch {
      return true;
    }
  });

  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchActiveEvent = async () => {
      try {
        const response = await api.get('/api/events/active');
        if (!isMounted) return;

        if (response.data) {
          setEvent(response.data);
          try {
            localStorage.setItem(ACTIVE_EVENT_CACHE_KEY, JSON.stringify(response.data));
          } catch {
            // Abaikan batasan quota storage jika ada
          }
        } else {
          setEvent(null);
          try {
            localStorage.removeItem(ACTIVE_EVENT_CACHE_KEY);
          } catch {}
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to fetch active event', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchActiveEvent();

    return () => {
      isMounted = false;
    };
  }, []);

  return { event, loading, error };
}

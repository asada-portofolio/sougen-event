import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { ActiveEvent, Talent } from '../types/event';
import type { SiteSettings } from './useSiteSettings';
import type { FaqItem } from '../types/faq';
import type { ContactChannel } from '../types/contact';

export interface HomeBootstrapData {
  activeEvent: ActiveEvent | null;
  settings: SiteSettings | null;
  faqs: FaqItem[];
  channels: ContactChannel[];
  talents: Talent[] | null;
}

/**
 * Hook untuk mengambil seluruh data initial state Beranda dalam 1 kali roundtrip.
 * Menghilangkan latensi 5 panggilan API terpisah (FCP & TTI Optimization).
 */
export function useHomeBootstrap() {
  const [data, setData] = useState<HomeBootstrapData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchBootstrap() {
      try {
        setLoading(true);
        const response = await api.get<HomeBootstrapData>('/api/home/bootstrap');
        if (isMounted) {
          setData(response.data);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to fetch home bootstrap data', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchBootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}

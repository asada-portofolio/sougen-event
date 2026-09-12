import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { FaqItem } from '../types/faq';

export function useFaqs(enabled: boolean = true) {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let isMounted = true;
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/faqs');
        if (isMounted) {
          setFaqs(response.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch FAQs', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setFaqs([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFaqs();
    return () => { isMounted = false; };
  }, [enabled]);

  return { faqs, loading, error };
}

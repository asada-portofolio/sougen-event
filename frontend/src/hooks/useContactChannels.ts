import { useState, useEffect } from 'react';
import { api } from '../services/api';

export interface ContactChannel {
  id: string;
  type: string;
  label: string;
  value: string;
  url: string | null;
  isEmergencyContact: boolean;
  displayOrder: number;
}

export function useContactChannels(enabled: boolean = true) {
  const [channels, setChannels] = useState<ContactChannel[]>([]);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const fetchChannels = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/contact/channels');
        if (response.data?.data) {
          setChannels(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch contact channels', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, [enabled]);

  return { channels, loading, error };
}

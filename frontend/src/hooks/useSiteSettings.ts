import { useState, useEffect } from 'react';
import { api } from '../services/api';

export interface SiteSettings {
  heroImageUrl?: string;
  siteTitle?: string;
  siteDescription?: string;
  footerDescription?: string;
  footerCopyright?: string;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data } = await api.get('/api/settings');
        setSettings(data);
      } catch (error) {
        console.error('Error fetching site settings', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  return { settings, loading };
}

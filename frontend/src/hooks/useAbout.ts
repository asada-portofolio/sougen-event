import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { AboutContent, TeamMember, AboutStats } from '../types/about';

export function useAbout() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState<AboutStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const [contentRes, teamRes, statsRes] = await Promise.all([
          api.get('/api/about/content'),
          api.get('/api/about/team'),
          api.get('/api/about/stats'),
        ]);

        if (isMounted) {
          setContent(contentRes.data);
          setTeam(teamRes.data || []);
          setStats(statsRes.data);
        }
      } catch (err) {
        console.error('Failed to fetch about data', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAboutData();
    return () => { isMounted = false; };
  }, []);

  return { content, team, stats, loading, error };
}

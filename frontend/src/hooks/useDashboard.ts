import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { DashboardData } from '../types/dashboard';

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [eventRes, statsRes, messagesRes] = await Promise.all([
        api.get('/api/events/active').catch(() => ({ data: null })), // Catch 404
        api.get('/api/about/stats'),
        api.get('/api/contact/messages?unread=true')
      ]);

      const unreadMessages = messagesRes.data || [];

      setData({
        activeEvent: eventRes.data || null,
        stats: statsRes.data,
        unreadMessagesCount: unreadMessages.length,
        recentMessages: unreadMessages.slice(0, 5) // Get top 5 recent unread messages
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Jalankan secara asynchronous di tick berikutnya untuk menghindari sinkronisasi render di effect
    let mounted = true;
    Promise.resolve().then(() => {
      if (mounted) {
        fetchDashboardData();
      }
    });
    return () => { mounted = false; };
  }, [fetchDashboardData]);

  return { data, loading, error, refetch: fetchDashboardData };
}

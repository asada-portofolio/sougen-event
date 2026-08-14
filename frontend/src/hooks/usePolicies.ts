import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { PolicyRule, SafetyProcedure } from '../types/policy';

export function usePolicies() {
  const [policies, setPolicies] = useState<PolicyRule[]>([]);
  const [safety, setSafety] = useState<SafetyProcedure[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [policiesRes, safetyRes] = await Promise.all([
          api.get('/api/policies'),
          api.get('/api/safety'),
        ]);
        
        if (isMounted) {
          setPolicies(policiesRes.data || []);
          setSafety(safetyRes.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch policies and safety', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, []);

  return { policies, safety, loading, error };
}

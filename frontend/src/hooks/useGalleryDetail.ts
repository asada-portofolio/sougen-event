import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { GalleryPhoto, GalleryDetailResponse } from '../types/gallery';

export function useGalleryDetail(slug: string | undefined) {
  const [eventData, setEventData] = useState<GalleryDetailResponse['event'] | null>(null);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchInitial = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const response = await api.get(`/api/gallery/${slug}`);
        const data: GalleryDetailResponse = response.data;
        if (isMounted) {
          setEventData(data.event);
          setPhotos(data.photos || []);
          setNextCursor(data.nextCursor);
          setHasMore(data.nextCursor !== null);
        }
      } catch (err) {
        console.error('Failed to fetch gallery detail', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setEventData(null);
          setPhotos([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchInitial();
    return () => { isMounted = false; };
  }, [slug]);

  const loadMore = useCallback(async () => {
    if (!slug || !nextCursor || loadingMore) return;
    try {
      setLoadingMore(true);
      const response = await api.get(`/api/gallery/${slug}?cursor=${nextCursor}`);
      const data: GalleryDetailResponse = response.data;
      setPhotos(prev => [...prev, ...(data.photos || [])]);
      setNextCursor(data.nextCursor);
      setHasMore(data.nextCursor !== null);
    } catch (err) {
      console.error('Failed to fetch more photos', err);
    } finally {
      setLoadingMore(false);
    }
  }, [slug, nextCursor, loadingMore]);

  return { eventData, photos, loading, loadingMore, error, hasMore, loadMore };
}

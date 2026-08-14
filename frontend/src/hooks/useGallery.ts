import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { GalleryAlbum } from '../types/gallery';

export function useGallery() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/gallery');
        setAlbums(response.data || []);
      } catch (err) {
        console.error('Failed to fetch gallery albums', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setAlbums([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  return { albums, loading, error };
}

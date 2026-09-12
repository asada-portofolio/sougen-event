import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosRequestConfig } from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// In-flight promise cache to deduplicate simultaneous identical GET requests
const inFlightRequests = new Map<string, Promise<AxiosResponse<any>>>();

// In-memory cache for public read endpoints to eliminate redundant roundtrips
interface CacheEntry {
  data: unknown;
  timestamp: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 30 * 1000; // 30 seconds

// List of public read-only paths eligible for lightweight memory caching
const CACHEABLE_ROUTES = [
  '/api/settings',
  '/api/contact/channels',
  '/api/faqs',
  '/api/events/active',
  '/api/about',
  '/api/policies',
  '/api/safety',
];

export function clearApiCache() {
  cache.clear();
  inFlightRequests.clear();
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // If mutation (POST/PUT/DELETE/PATCH), invalidate cache to keep fresh data
  if (config.method && config.method.toUpperCase() !== 'GET') {
    clearApiCache();
  }
  return config;
});

// Wrap api.get with in-flight deduplication & in-memory cache
const originalGet = api.get.bind(api);

api.get = function <T = any, R = AxiosResponse<T>, D = any>(
  url: string,
  config?: AxiosRequestConfig<D>
): Promise<R> {
  const fullKey = `GET:${url}:${JSON.stringify(config?.params || {})}`;

  const isCacheable = CACHEABLE_ROUTES.some((route) => url.startsWith(route));

  if (isCacheable) {
    const cached = cache.get(fullKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return Promise.resolve({
        data: cached.data,
        status: 200,
        statusText: 'OK (cached)',
        headers: {},
        config: config || {},
      } as unknown as R);
    }
  }

  // Deduplicate simultaneous identical in-flight requests
  if (inFlightRequests.has(fullKey)) {
    return inFlightRequests.get(fullKey) as unknown as Promise<R>;
  }

  const promise = (originalGet(url, config) as Promise<AxiosResponse<T>>)
    .then((response) => {
      if (isCacheable && response.status === 200) {
        cache.set(fullKey, {
          data: response.data,
          timestamp: Date.now(),
        });
      }
      return response as unknown as R;
    })
    .finally(() => {
      inFlightRequests.delete(fullKey);
    });

  inFlightRequests.set(fullKey, promise as unknown as Promise<AxiosResponse<any>>);
  return promise as unknown as Promise<R>;
};
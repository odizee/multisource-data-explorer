import { useState, useEffect, useCallback } from "react";

interface UseDataFetcherOptions<T> {
  fetcher: () => Promise<T>;
  initialData?: T | null;
  enabled?: boolean;
}

interface UseDataFetcherResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDataFetcher<T>({
  fetcher,
  initialData = null,
  enabled = true,
}: UseDataFetcherOptions<T>): UseDataFetcherResult<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [fetcher, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

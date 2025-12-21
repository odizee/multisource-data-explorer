import { renderHook, act, waitFor } from '@testing-library/react';
import { useDataFetcher } from './useDataFetcher';

describe('useDataFetcher', () => {
  it('fetches data successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    const fetcher = jest.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() =>
      useDataFetcher({ fetcher })
    );

    // Initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);

    // After fetch
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });

  it('handles errors correctly', async () => {
    const errorMsg = 'Fetch failed';
    const fetcher = jest.fn().mockRejectedValue(new Error(errorMsg));

    const { result } = renderHook(() =>
      useDataFetcher({ fetcher })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(errorMsg);
  });

  it('respects enabled flag', async () => {
    const fetcher = jest.fn();

    const { result } = renderHook(() =>
      useDataFetcher({ fetcher, enabled: false })
    );

    expect(result.current.loading).toBe(false); // Should not be loading if disabled
    expect(fetcher).not.toHaveBeenCalled();
  });
});

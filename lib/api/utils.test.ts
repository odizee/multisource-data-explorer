import { fetchJson, ApiError } from './utils';

global.fetch = jest.fn();

describe('fetchJson', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns data on success', async () => {
    const mockData = { foo: 'bar' };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchJson('https://api.example.com/data');
    expect(result).toEqual(mockData);
  });

  it('throws ApiError on non-ok response', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    await expect(fetchJson('https://api.example.com/data')).rejects.toThrow(ApiError);
    await expect(fetchJson('https://api.example.com/data')).rejects.toThrow('Request failed with status 404');
  });

  it('throws ApiError on network error', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(fetchJson('https://api.example.com/data')).rejects.toThrow(ApiError);
    await expect(fetchJson('https://api.example.com/data')).rejects.toThrow('Network error');
  });

  // Testing timeout is tricky with the current implementation using AbortController inside.
  // We can mock AbortController or just trust the logic if we can't easily trigger the timeout in jest environment without real browser APIs fully working or creating a complex mock.
  // However, we can test that it passes the signal.
  
  it('aborts request after timeout', async () => {
    const abortSpy = jest.fn();
    // @ts-ignore
    global.AbortController = jest.fn(() => ({
      abort: abortSpy,
      signal: {},
    }));

    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves

    const fetchPromise = fetchJson('https://api.example.com/data');
    
    jest.advanceTimersByTime(8000);
    
    // We expect abort to be called
    expect(abortSpy).toHaveBeenCalled();
    
    // Clean up purely for this test not to hang
    // In reality fetchJson would reject if fetch threw AbortError, but here we just checking abort call.
  });
});

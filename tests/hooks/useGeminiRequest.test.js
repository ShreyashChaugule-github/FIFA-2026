import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGeminiRequest } from '@/hooks/useGeminiRequest';
import { renderHook, act } from '@testing-library/react';

describe('useGeminiRequest', () => {
  beforeEach(() => {
    global.fetch.mockReset();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useGeminiRequest());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.request).toBe('function');
    expect(typeof result.current.cancel).toBe('function');
  });

  it('should handle successful request', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: 'Test AI response' }),
    });

    const { result } = renderHook(() => useGeminiRequest());

    let response;
    await act(async () => {
      response = await result.current.request({ message: 'Hello' });
    });

    expect(response).toBe('Test AI response');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle API error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({ error: 'Too many requests' }),
    });

    const { result } = renderHook(() => useGeminiRequest());

    await act(async () => {
      try {
        await result.current.request({ message: 'Hello' });
      } catch (e) {
        expect(e.message).toBe('Too many requests');
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Too many requests');
  });

  it('should handle fetch failure (network error)', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network Error'));

    const { result } = renderHook(() => useGeminiRequest());

    await act(async () => {
      try {
        await result.current.request({ message: 'Hello' });
      } catch (e) {
        expect(e.message).toBe('Network Error');
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Network Error');
  });

  it('should abort previous request when a new one is made', async () => {
    const abortMock = vi.fn();
    global.AbortController = class {
      constructor() {
        this.abort = abortMock;
        this.signal = {};
      }
    };

    global.fetch.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    const { result } = renderHook(() => useGeminiRequest());

    act(() => {
      result.current.request({ message: 'Req 1' });
    });
    
    act(() => {
      result.current.request({ message: 'Req 2' });
    });

    expect(abortMock).toHaveBeenCalledTimes(1);
  });
});

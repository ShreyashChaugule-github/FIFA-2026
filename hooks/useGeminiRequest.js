'use client';
import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for making Gemini API requests with abort support.
 * Eliminates duplicate fetch logic across AI components.
 * Prevents memory leaks and DoS by aborting uncontrolled in-flight requests.
 */
export function useGeminiRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const request = useCallback(async ({ message, context = 'fan', language = 'en', type = 'general' }) => {
    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context, language, type }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      return data.response ?? '';
    } catch (err) {
      if (err.name === 'AbortError') return null; // Intentionally cancelled
      const msg = err.message || 'AI service unavailable.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancel = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
  }, []);

  return { request, loading, error, cancel };
}

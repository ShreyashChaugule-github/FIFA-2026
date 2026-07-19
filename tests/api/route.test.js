import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/gemini/route';

vi.mock('next/server', () => ({
  NextResponse: {
    json: (body, init) => ({ body, status: init?.status || 200 }),
  },
}));

vi.mock('@/lib/gemini', () => ({
  getGeminiClient: vi.fn(() => ({
    models: {
      generateContent: vi.fn().mockResolvedValue({
        text: 'Mocked AI response',
      }),
    },
  })),
  buildPrompt: vi.fn(),
  validateRequestInput: vi.fn((body) => {
    if (!body.message) return { valid: false, error: 'Message required' };
    return { valid: true, value: body };
  }),
}));

describe('API Route: /api/gemini', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockRequest = (body, headers = {}) => {
    return {
      json: async () => body,
      headers: {
        get: (key) => {
          if (key.toLowerCase() === 'content-type') return headers['content-type'] || 'application/json';
          if (key.toLowerCase() === 'x-forwarded-for') return headers['x-forwarded-for'] || '127.0.0.1';
          return null;
        },
      },
    };
  };

  it('should reject invalid content type', async () => {
    const req = mockRequest({}, { 'content-type': 'text/plain' });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Content-Type must be/);
  });

  it('should reject invalid JSON', async () => {
    const req = {
      json: async () => { throw new Error('Invalid JSON'); },
      headers: { get: () => 'application/json' },
    };
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid JSON body.');
  });

  it('should reject invalid validation', async () => {
    const req = mockRequest({ context: 'fan' });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Message required');
  });

  it('should return demo mode if no API key', async () => {
    const originalEnv = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const req = mockRequest({ message: 'Hello AI' });
    const res = await POST(req);
    
    expect(res.status).toBe(200);
    expect(res.body.response).toContain('[DEMO MODE');
    
    process.env.GEMINI_API_KEY = originalEnv || 'test-key';
  });
});

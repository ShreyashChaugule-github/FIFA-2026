import { NextResponse } from 'next/server';
import { getGeminiClient, buildPrompt, validateRequestInput } from '@/lib/gemini';

// In-memory rate limiter: 10 req/min per IP
const rateMap = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60_000; // 1 minute
  const limit = 10;
  const entry = rateMap.get(ip) ?? { count: 0, start: now };

  if (now - entry.start > windowMs) {
    rateMap.set(ip, { count: 1, start: now });
    return false;
  }
  if (entry.count >= limit) return true;
  rateMap.set(ip, { count: entry.count + 1, start: entry.start });
  return false;
}

const ALLOWED_ORIGINS = [
  'https://fifa-2026-463939132351.us-central1.run.app',
  'http://localhost:3000',
];

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  const requestId = crypto.randomUUID();
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  // CORS check in production
  const origin = req.headers.get('origin') ?? '';
  if (process.env.NODE_ENV === 'production' && !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Rate limiting
  if (isRateLimited(ip)) {
    console.warn('[gemini-api] Rate limited', { requestId, ip });
    return NextResponse.json({ error: 'Too many requests. Please wait.' }, { status: 429 });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type must be application/json.' }, { status: 400 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const validation = validateRequestInput(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { message, context, language, type } = validation.value;
    console.log('[gemini-api]', { requestId, ip, context, type, messageLength: message.length });

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        response: `[DEMO MODE — No API Key] 🤖 StadiumIQ AI would respond to your query about "${message.substring(0, 60)}${message.length > 60 ? '...' : ''}". \n\nTo enable real AI responses, add your GEMINI_API_KEY to the .env.local file.`,
      });
    }

    const ai = getGeminiClient();
    const prompt = buildPrompt({ message, context, language, type });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    });

    const raw = response.text || '';
    
    // Strip script injection from AI output before sending to client
    const sanitized = raw.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    return NextResponse.json({ response: sanitized });
  } catch (error) {
    console.error('[gemini-api] Error', { requestId, message: error?.message });

    if (error?.message?.includes('API_KEY_INVALID') || error?.message?.includes('API key')) {
      return NextResponse.json({
        response: '⚠️ Invalid API key. Please check your GEMINI_API_KEY in .env.local and ensure it\'s a valid Google AI Studio key.',
      }, { status: 200 });
    }

    if (error?.message?.includes('quota') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      return NextResponse.json({
        response: '⚠️ API quota exceeded. Please check your Google AI Studio usage limits.',
      }, { status: 200 });
    }

    return NextResponse.json({
      response: '⚠️ AI service temporarily unavailable. Please try again in a moment.',
    }, { status: 200 });
  }
}

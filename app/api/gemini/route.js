import { NextResponse } from 'next/server';
import { getGeminiClient, buildPrompt, validateRequestInput } from '@/lib/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
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

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        response: `[DEMO MODE — No API Key] 🤖 StadiumIQ AI would respond to your query about "${message.substring(0, 60)}${message.length > 60 ? '...' : ''}". 

To enable real AI responses, add your GEMINI_API_KEY to the .env.local file:
GEMINI_API_KEY=your_google_gemini_api_key_here

Get your free API key at: https://aistudio.google.com/app/apikey`,
      });
    }

    const ai = getGeminiClient();
    const prompt = buildPrompt({ message, context, language, type });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    const text = response.text || '';

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Gemini API error', { message: error?.message });

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

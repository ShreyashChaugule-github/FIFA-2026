import { NextResponse } from 'next/server';
import { getGeminiClient, buildPrompt } from '@/lib/gemini';

export async function POST(req) {
  try {
    const body = await req.json();
    const { message, context = 'fan', language = 'en', type = 'general' } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Return a helpful demo response if no API key is configured
      return NextResponse.json({
        response: `[DEMO MODE — No API Key] 🤖 StadiumIQ AI would respond to your query about "${message.substring(0, 60)}${message.length > 60 ? '...' : ''}". 
        
To enable real AI responses, add your GEMINI_API_KEY to the .env.local file:
GEMINI_API_KEY=your_google_gemini_api_key_here

Get your free API key at: https://aistudio.google.com/app/apikey`,
      });
    }

    const ai = getGeminiClient();
    const prompt = buildPrompt({ message: message.trim(), context, language, type });

    const interaction = await ai.interactions.create({
      model: "gemini-3.5-flash",
      input: prompt,
    });
    
    const text = interaction.output_text || '';

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Gemini API error:', error);

    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key')) {
      return NextResponse.json({
        response: '⚠️ Invalid API key. Please check your GEMINI_API_KEY in .env.local and ensure it\'s a valid Google AI Studio key.',
      }, { status: 200 });
    }

    if (error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      return NextResponse.json({
        response: '⚠️ API quota exceeded. Please check your Google AI Studio usage limits.',
      }, { status: 200 });
    }

    return NextResponse.json({
      response: '⚠️ AI service temporarily unavailable. Please try again in a moment.',
    }, { status: 200 });
  }
}

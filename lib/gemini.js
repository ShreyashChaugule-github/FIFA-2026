import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY ? { apiKey: process.env.GEMINI_API_KEY } : {});
const MAX_MESSAGE_LENGTH = 400;
const ALLOWED_CONTEXTS = new Set(['fan', 'organizer', 'volunteer', 'staff']);
const ALLOWED_LANGUAGES = new Set(['en', 'es', 'fr', 'pt', 'ar', 'de', 'ja', 'ko', 'zh', 'hi']);

export function getGeminiClient() {
  return ai;
}

export function sanitizeMessage(message) {
  return String(message ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeRequestOptions({ message, context = 'fan', language = 'en', type = 'general' }) {
  const normalizedContext = ALLOWED_CONTEXTS.has(String(context).toLowerCase())
    ? String(context).toLowerCase()
    : 'fan';
  const normalizedLanguage = ALLOWED_LANGUAGES.has(String(language).toLowerCase())
    ? String(language).toLowerCase()
    : 'en';
  const normalizedType = String(type ?? 'general').trim().toLowerCase() || 'general';

  return {
    message: sanitizeMessage(message),
    context: normalizedContext,
    language: normalizedLanguage,
    type: normalizedType,
  };
}

export function validateRequestInput(input) {
  if (!input || typeof input !== 'object') {
    return { valid: false, error: 'Request body must be a JSON object.' };
  }

  const message = sanitizeMessage(input.message);
  if (!message) {
    return { valid: false, error: 'Message is required.' };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return { valid: false, error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.` };
  }

  return {
    valid: true,
    value: normalizeRequestOptions({ ...input, message }),
  };
}

const SYSTEM_CONTEXT = `You are StadiumIQ, an advanced AI assistant for FIFA World Cup 2026 stadium operations and fan experience. 

You help with:
- Stadium navigation and wayfinding
- Crowd management and flow optimization  
- Accessibility assistance for differently-abled fans
- Multilingual communication and translation
- Transportation and transit information
- Sustainability and eco-friendly practices
- Security and emergency protocols
- Venue-specific information for all 16 FIFA 2026 stadiums (across USA, Canada, Mexico)
- Volunteer coordination and deployment
- Operational intelligence for staff and organizers

FIFA 2026 Facts:
- 48 nations competing
- 104 total matches
- 16 venues across USA (11), Canada (2), Mexico (3)
- ~5 million expected fans total
- July 2026 tournament

Always be:
- EXTREMELY SHORT and concise (maximum 2-3 sentences).
- Helpful and clear
- Safety-conscious in all recommendations
- Inclusive and accessible in your guidance
- Culturally sensitive for international fans
- Professional for staff/organizer queries`;

const LANGUAGE_INSTRUCTIONS = {
  en: 'Respond in English.',
  es: 'Responde en español.',
  fr: 'Répondez en français.',
  pt: 'Responda em português.',
  ar: 'أجب باللغة العربية.',
  de: 'Antworten Sie auf Deutsch.',
  ja: '日本語で回答してください。',
  ko: '한국어로 답변해 주세요.',
  zh: '请用中文回答。',
  hi: 'हिन्दी में उत्तर दें।',
};

const CONTEXT_INSTRUCTIONS = {
  fan: 'You are helping a fan attending a FIFA World Cup 2026 match. Be friendly, enthusiastic, and helpful.',
  organizer: 'You are assisting a match organizer or event manager. Be precise, data-driven, and professional. Focus on operational efficiency.',
  volunteer: 'You are helping a stadium volunteer. Be clear, practical, and supportive. Focus on their duties and safety protocols.',
  staff: 'You are assisting venue staff. Be professional, operational, and concise. Focus on efficiency and protocols.',
};

export function buildPrompt({ message, context, language, type }) {
  const normalized = normalizeRequestOptions({ message, context, language, type });
  const langInstruction = LANGUAGE_INSTRUCTIONS[normalized.language] || LANGUAGE_INSTRUCTIONS.en;
  const contextInstruction = CONTEXT_INSTRUCTIONS[normalized.context] || CONTEXT_INSTRUCTIONS.fan;

  return `${SYSTEM_CONTEXT}

USER ROLE: ${normalized.context}
${contextInstruction}

REQUEST TYPE: ${normalized.type}
${langInstruction}

User Query: ${normalized.message}`;
}

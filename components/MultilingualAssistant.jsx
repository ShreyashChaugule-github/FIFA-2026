'use client';
import { useState } from 'react';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸', native: 'English' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸', native: 'Español' },
  { code: 'fr', label: 'French', flag: '🇫🇷', native: 'Français' },
  { code: 'pt', label: 'Portuguese', flag: '🇧🇷', native: 'Português' },
  { code: 'ar', label: 'Arabic', flag: '🇸🇦', native: 'العربية' },
  { code: 'de', label: 'German', flag: '🇩🇪', native: 'Deutsch' },
  { code: 'ja', label: 'Japanese', flag: '🇯🇵', native: '日本語' },
];

const QUICK_PHRASES = [
  { en: 'Where is my seat?', icon: '🪑' },
  { en: 'Where is the restroom?', icon: '🚻' },
  { en: 'I need medical assistance', icon: '🏥' },
  { en: 'Where can I buy food?', icon: '🍔' },
];

export default function MultilingualAssistant() {
  const [inputText, setInputText] = useState('');
  const [targetLang, setTargetLang] = useState('es');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activePhrase, setActivePhrase] = useState(null);

  const translate = async (text, lang) => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    const targetLangObj = LANGUAGES.find(l => l.code === lang);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Translate the following text to ${targetLangObj?.label} (${targetLangObj?.native}) for a FIFA World Cup 2026 stadium context. Also provide:
1. The translation
2. A phonetic pronunciation guide (romanized)
3. One key cultural tip for stadium interactions

Text to translate: "${text}"

Format your response as:
TRANSLATION: [translated text]
PRONUNCIATION: [phonetic guide]
CULTURAL TIP: [brief tip]`,
          context: 'fan',
          language: lang,
          type: 'general',
        }),
      });
      const data = await res.json();
      setResult({ raw: data.response, targetLang: targetLangObj });
    } catch {
      setResult({ raw: 'Translation service unavailable.', targetLang: targetLangObj });
    } finally {
      setLoading(false);
    }
  };

  const parseResult = (raw) => {
    if (!raw) return {};
    const transMatch = raw.match(/TRANSLATION:\s*(.+?)(?:\n|PRONUNCIATION)/s);
    const pronMatch = raw.match(/PRONUNCIATION:\s*(.+?)(?:\n|CULTURAL)/s);
    const tipMatch = raw.match(/CULTURAL TIP:\s*(.+)/s);
    return {
      translation: transMatch?.[1]?.trim() || raw,
      pronunciation: pronMatch?.[1]?.trim(),
      tip: tipMatch?.[1]?.trim(),
    };
  };

  const parsed = result ? parseResult(result.raw) : {};

  return (
    <section id="multilingual" className="w-full bg-white relative border-b monad-border pb-20">
      <div className="container mx-auto px-4 md:px-10 mt-20">
        
        <div className="flex flex-col lg:flex-row border-x border-t monad-border bg-white">
          
          {/* Left: Sticky Sidebar */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-[60px] h-auto lg:h-[calc(100vh-60px)] p-6 md:p-10 border-b lg:border-b-0 lg:border-r monad-border flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs uppercase text-neutral-400 mb-6">/ LinguaMatch AI</div>
              <h2 className="text-4xl font-bold text-black mb-4 tracking-tight">
                Breaking Language Barriers
              </h2>
              <p className="text-neutral-500 mb-8 text-lg">
                Real-time translation, cultural context, and phonetic guides for 48 nations.
              </p>

              <div className="flex flex-col gap-2">
                <div className="font-mono text-xs uppercase text-black mb-2">Target Language:</div>
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setTargetLang(lang.code)}
                    className={`text-left px-4 py-3 border monad-border rounded-md font-mono text-sm uppercase transition-colors ${targetLang === lang.code ? 'bg-black text-white border-black' : 'hover:bg-neutral-50 text-neutral-600'}`}
                  >
                    {lang.flag} {lang.native}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Translation Interface */}
          <div className="w-full lg:w-2/3 flex flex-col min-h-[70vh]">
            
            {/* Input Area */}
            <div className="p-6 md:p-10 border-b monad-border bg-neutral-50 flex flex-col gap-4">
              <textarea
                className="w-full bg-white border monad-border rounded-lg p-4 text-black focus:outline-none focus:ring-1 focus:ring-black min-h-[120px] resize-none"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Type something to translate..."
              />
              <div className="flex flex-wrap gap-2">
                {QUICK_PHRASES.map((phrase, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                      setActivePhrase(i);
                      setInputText(phrase.en);
                      translate(phrase.en, targetLang);
                    }}
                    className={`font-mono text-xs px-3 py-1.5 border monad-border rounded-full hover:border-black transition-colors ${activePhrase === i ? 'bg-neutral-200 text-black border-black' : 'bg-white text-neutral-600'}`}
                  >
                    {phrase.icon} {phrase.en}
                  </button>
                ))}
              </div>
              <button
                className="w-full lg:w-auto self-start mt-2 bg-black text-white px-8 py-3 rounded-lg font-mono uppercase text-sm disabled:opacity-50 hover:bg-neutral-800 transition-colors"
                onClick={() => translate(inputText, targetLang)}
                disabled={loading || !inputText.trim()}
              >
                {loading ? 'Translating...' : 'Translate'}
              </button>
            </div>

            {/* Output Area */}
            <div className="p-6 md:p-10 flex-1 bg-white">
              <div className="font-mono text-xs uppercase text-neutral-400 mb-6">/ Translation Result</div>
              
              {!result && !loading && (
                <div className="text-neutral-400 italic text-sm">
                  Waiting for input...
                </div>
              )}

              {loading && (
                <div className="animate-pulse text-sm text-neutral-500">
                  Gemini is processing translation...
                </div>
              )}

              {result && !loading && (
                <div className="flex flex-col gap-6">
                  {parsed.translation && (
                    <div>
                      <div className="text-3xl font-bold text-black leading-tight mb-2">
                        {parsed.translation}
                      </div>
                      {parsed.pronunciation && (
                        <div className="text-neutral-500 text-sm italic font-serif">
                          🗣️ {parsed.pronunciation}
                        </div>
                      )}
                    </div>
                  )}
                  {parsed.tip && (
                    <div className="p-4 bg-neutral-50 border monad-border rounded-lg text-sm text-neutral-700">
                      <strong>💡 Cultural Tip:</strong> {parsed.tip}
                    </div>
                  )}
                  {!parsed.translation && (
                    <div className="text-sm text-black whitespace-pre-wrap">{result.raw}</div>
                  )}
                </div>
              )}
            </div>
            
          </div>

        </div>
      </div>
    </section>
  );
}

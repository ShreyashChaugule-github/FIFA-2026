'use client';
import { useState, useRef, useEffect } from 'react';

export default function AICommandCenter() {
  const [context, setContext] = useState('fan');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Welcome to StadiumIQ. I am the Gemini-powered intelligence assistant for FIFA 2026. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const SUGGESTIONS = {
    fan: ['Where is Gate C?', 'What food is near Section 120?', 'When does the match start?'],
    organizer: ['Show me crowd density at Gate B', 'Status of Metro Line 4?', 'Deploy medical to Section 200'],
    volunteer: ['Where is my zone?', 'How do I request a break?', 'Translate "Where is the bathroom?" to Spanish'],
    staff: ['Report a spill at Concession 4', 'Show evacuation route A', 'Security status update'],
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, context, type: 'general' })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.response || 'No response.' }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: '⚠️ Connection error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-center" className="w-full bg-neutral-50 relative border-b monad-border">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row min-h-[80vh] border-x monad-border bg-white">
          
          {/* Left Column: Sticky Sidebar */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-[60px] h-auto lg:h-[calc(100vh-60px)] p-6 md:p-10 border-b lg:border-b-0 lg:border-r monad-border flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-6">
                / AI Command Center
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black mb-4">
                Intelligence on Demand
              </h2>
              <p className="text-neutral-500 text-lg mb-8">
                Select your role to configure the Gemini AI for customized stadium intelligence.
              </p>

              <div className="flex flex-col gap-2 mb-8">
                {['fan', 'organizer', 'volunteer', 'staff'].map(role => (
                  <button
                    key={role}
                    onClick={() => { setContext(role); setMessages([{ role: 'assistant', text: `Context switched to ${role.toUpperCase()}. How can I help you?` }]); }}
                    className={`text-left px-4 py-3 rounded-md font-mono uppercase text-sm border transition-all ${context === role ? 'border-black bg-black text-white' : 'border-neutral-200 text-black hover:bg-neutral-50'}`}
                  >
                    {role} View
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden lg:block text-xs text-neutral-400 font-mono">
              Powered by Google Gemini 2.0 Flash
            </div>
          </div>

          {/* Right Column: Chat Interface */}
          <div className="w-full lg:w-2/3 bg-white flex flex-col h-[70vh] lg:h-[calc(100vh-60px)] relative">
            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col gap-6">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-black text-white rounded-br-sm' : 'bg-neutral-100 text-black rounded-bl-sm border monad-border'}`}>
                    {msg.role === 'assistant' && <div className="font-mono text-[10px] text-neutral-500 mb-2 uppercase tracking-wide">StadiumIQ AI</div>}
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] p-4 rounded-xl bg-neutral-100 border monad-border text-black rounded-bl-sm">
                    <span className="animate-pulse">Analyzing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 md:p-10 border-t monad-border bg-neutral-50">
              <div className="flex flex-wrap gap-2 mb-4">
                {SUGGESTIONS[context].map((s, i) => (
                  <button key={i} onClick={() => handleSend(s)} className="text-xs font-mono bg-white border monad-border px-3 py-1.5 rounded-full hover:border-black transition-colors">
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend(input)}
                  placeholder="Ask the AI anything..."
                  className="flex-1 bg-white border monad-border rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={loading || !input.trim()}
                  className="bg-black text-white px-6 py-3 rounded-lg font-mono uppercase text-sm disabled:opacity-50 hover:bg-neutral-800 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

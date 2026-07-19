'use client';
import { useState, useCallback } from 'react';

const EMERGENCY_TYPES = [
  { id: 'medical', label: 'Medical Emergency', icon: '🏥', severity: 'critical' },
  { id: 'security', label: 'Security Incident', icon: '🚨', severity: 'critical' },
  { id: 'fire', label: 'Fire / Evacuation', icon: '🔥', severity: 'critical' },
  { id: 'missing', label: 'Missing Person', icon: '👤', severity: 'high' },
  { id: 'accessibility', label: 'Accessibility Help', icon: '♿', severity: 'medium' },
];

/**
 * EmergencySOS — AI-guided emergency protocol panel for FIFA 2026 stadium staff.
 * Covers medical, security, fire, missing person, and accessibility incidents.
 */
export default function EmergencySOS() {
  const [active, setActive] = useState(null);
  const [aiGuidance, setAiGuidance] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleSOS = useCallback(async (type) => {
    setActive(type.id);
    setLoading(true);
    setAiGuidance('');
    setConfirmed(false);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Emergency type: ${type.label}. Give exactly 3 immediate actionable steps for FIFA stadium staff. Be extremely concise. Format as numbered list.`,
          context: 'staff',
          language: 'en',
          type: 'emergency',
        }),
      });
      const data = await res.json();
      setAiGuidance(data.response);
      setConfirmed(true);
    } catch {
      setAiGuidance('1. Alert nearest staff immediately.\n2. Dial emergency services (911 / local).\n3. Clear the area and wait for responders.');
      setConfirmed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <section
      id="emergency"
      aria-label="Emergency SOS Command Panel"
      className="w-full bg-white border-b monad-border pb-20"
    >
      <div className="container mx-auto px-4 md:px-10 mt-20">
        <div className="border-x border-t monad-border">

          {/* Header */}
          <div className="p-8 border-b monad-border bg-red-50 flex items-start justify-between gap-4">
            <div>
              <div className="font-mono text-xs uppercase text-red-500 mb-2">/ Emergency Response</div>
              <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight">SOS Command Panel</h2>
              <p className="text-neutral-600 mt-2 text-sm max-w-xl">
                AI-guided emergency protocols for all incident types. Select an emergency to receive immediate step-by-step guidance for FIFA 2026 stadium staff.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1 shrink-0">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" aria-hidden="true" />
              <span className="font-mono text-[10px] uppercase text-red-500 tracking-widest">System Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Left: Emergency Type Selection */}
            <div className="p-8 border-b lg:border-b-0 lg:border-r monad-border">
              <div className="font-mono text-xs uppercase text-neutral-400 mb-4">/ Select Emergency Type</div>
              <div
                role="group"
                aria-label="Emergency type selection"
                className="flex flex-col gap-3"
              >
                {EMERGENCY_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleSOS(type)}
                    aria-pressed={active === type.id}
                    aria-label={`Activate ${type.label} protocol`}
                    disabled={loading}
                    className={`text-left px-5 py-4 border rounded-lg flex items-center gap-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      active === type.id
                        ? type.severity === 'critical'
                          ? 'bg-red-600 text-white border-red-600'
                          : type.severity === 'high'
                          ? 'bg-black text-white border-black'
                          : 'bg-neutral-800 text-white border-neutral-800'
                        : 'bg-white text-black border-neutral-200 hover:border-black'
                    }`}
                  >
                    <span className="text-2xl shrink-0" aria-hidden="true">{type.icon}</span>
                    <div>
                      <div className="font-bold text-sm">{type.label}</div>
                      <div
                        className={`font-mono text-[10px] uppercase mt-0.5 ${
                          active === type.id ? 'text-white/70' : 'text-neutral-400'
                        }`}
                      >
                        {type.severity} priority
                      </div>
                    </div>
                    {active === type.id && !loading && (
                      <span className="ml-auto font-mono text-[10px] uppercase tracking-widest opacity-80">
                        Active
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-neutral-50 border monad-border rounded text-xs text-neutral-500 font-mono">
                ⚠️ FOR LIFE-THREATENING EMERGENCIES — ALWAYS CALL 911 FIRST
              </div>
            </div>

            {/* Right: AI Response Protocol */}
            <div className="p-8">
              <div className="font-mono text-xs uppercase text-neutral-400 mb-4">/ AI Response Protocol</div>
              <div
                role="status"
                aria-live="polite"
                aria-label="Emergency AI guidance"
                aria-atomic="true"
                className="min-h-56 p-5 bg-neutral-50 border monad-border rounded-lg"
              >
                {loading && (
                  <div className="flex items-center gap-3 text-sm text-neutral-500">
                    <div
                      className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"
                      aria-hidden="true"
                    />
                    <span>Generating emergency protocol...</span>
                    <span className="sr-only">Please wait, AI is generating the emergency response protocol.</span>
                  </div>
                )}
                {confirmed && aiGuidance && !loading && (
                  <div>
                    <div className="font-mono text-[10px] text-red-500 uppercase mb-3 flex items-center gap-2">
                      <span aria-hidden="true">🚨</span>
                      <span>AI Protocol Active — {EMERGENCY_TYPES.find(t => t.id === active)?.label}</span>
                    </div>
                    <div className="text-sm text-black whitespace-pre-line leading-relaxed">
                      {aiGuidance}
                    </div>
                  </div>
                )}
                {!loading && !confirmed && (
                  <p className="text-sm text-neutral-400 italic">
                    Select an emergency type on the left to generate an AI-guided response protocol for stadium staff.
                  </p>
                )}
              </div>

              {/* Reference info */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { label: 'Security Hotline', val: '+1-800-FIFA-SEC' },
                  { label: 'Medical Station', val: 'Gate A, Level 1' },
                  { label: 'Fire Assembly', val: 'East Parking Lot' },
                  { label: 'Lost & Found', val: 'Main Info Booth' },
                ].map((ref) => (
                  <div key={ref.label} className="p-3 bg-white border monad-border rounded text-xs">
                    <div className="font-mono text-neutral-400 uppercase">{ref.label}</div>
                    <div className="font-bold text-black mt-1">{ref.val}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

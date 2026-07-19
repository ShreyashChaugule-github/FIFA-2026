'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const SHIFTS = [
  {
    id: 1,
    zone: 'Gate A — North Entry',
    time: '08:00 – 12:00',
    role: 'Fan Entry Guide',
    status: 'upcoming',
    supervisor: 'Maria Chen',
  },
  {
    id: 2,
    zone: 'Section 130 — Main Concourse',
    time: '12:00 – 16:00',
    role: 'Accessibility Escort',
    status: 'active',
    supervisor: 'James Okafor',
  },
  {
    id: 3,
    zone: 'Metro Exit — East Plaza',
    time: '19:00 – 23:00',
    role: 'Transit Coordinator',
    status: 'upcoming',
    supervisor: 'Sofia Hernandez',
  },
];

const STATUS_STYLES = {
  active: { dot: 'bg-green-500', text: 'text-green-600', label: 'On Duty' },
  upcoming: { dot: 'bg-yellow-400', text: 'text-yellow-600', label: 'Upcoming' },
  completed: { dot: 'bg-neutral-300', text: 'text-neutral-400', label: 'Completed' },
};

const QUICK_ACTIONS = [
  { label: 'Request Break', icon: '☕' },
  { label: 'Report Incident', icon: '🚨' },
  { label: 'Request Relief', icon: '🔄' },
  { label: 'Contact Supervisor', icon: '📞' },
];

/**
 * VolunteerDashboard — Shift schedule and AI briefing tool for FIFA 2026 volunteers.
 * Displays today's assignments, status, and AI-generated role briefings.
 */
export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [aiHelp, setAiHelp] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [activeShift, setActiveShift] = useState(null);
  const [actionMsg, setActionMsg] = useState('');

  const getShiftBriefing = async (shift) => {
    setActiveShift(shift.id);
    setAiLoading(true);
    setAiHelp('');

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `I am a FIFA 2026 volunteer assigned to: ${shift.role} at ${shift.zone} from ${shift.time}. Give me exactly 3 key responsibilities and 1 safety tip. Use numbered list. Be concise.`,
          context: 'volunteer',
          language: 'en',
          type: 'shift',
        }),
      });
      const data = await res.json();
      setAiHelp(data.response);
    } catch {
      setAiHelp('1. Follow your zone coordinator instructions.\n2. Keep communication channels open.\n3. Prioritize fan safety at all times.\n\nSafety: Always report incidents to your supervisor immediately.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    setActionMsg(`"${action}" request sent to your supervisor.`);
    setTimeout(() => setActionMsg(''), 3000);
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Volunteer';

  return (
    <section
      id="volunteer"
      aria-label="Volunteer Shift Dashboard"
      className="w-full bg-neutral-50 border-b monad-border pb-20"
    >
      <div className="container mx-auto px-4 md:px-10 mt-20">
        <div className="border-x border-t monad-border bg-white">

          {/* Header */}
          <div className="p-8 border-b monad-border flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="font-mono text-xs uppercase text-neutral-400 mb-2">/ Volunteer Hub</div>
              <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight">My Shift Schedule</h2>
              <p className="text-neutral-500 text-sm mt-2">
                Welcome back, <strong className="text-black">{displayName}</strong> · FIFA World Cup 2026 Volunteer
              </p>
            </div>
            <div className="text-right">
              <div className="font-mono text-xs text-neutral-400 uppercase">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-2 justify-end mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true" />
                <span className="font-mono text-[10px] text-green-600 uppercase tracking-widest">Portal Active</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3">

            {/* Left: Shift List */}
            <div className="lg:col-span-2 p-8 border-b lg:border-b-0 lg:border-r monad-border">
              <div className="font-mono text-xs uppercase text-neutral-400 mb-4">/ Today's Assignments</div>
              <div
                role="list"
                aria-label="Volunteer shifts for today"
                className="flex flex-col gap-4"
              >
                {SHIFTS.map((shift) => {
                  const style = STATUS_STYLES[shift.status];
                  return (
                    <div
                      key={shift.id}
                      role="listitem"
                      className={`p-5 border rounded-lg bg-white transition-colors ${
                        activeShift === shift.id ? 'border-black' : 'monad-border hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3 gap-3">
                        <div>
                          <div className="font-bold text-black">{shift.role}</div>
                          <div className="text-xs text-neutral-500 mt-1">{shift.zone}</div>
                          <div className="text-xs text-neutral-400 mt-0.5">Supervisor: {shift.supervisor}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className={`w-2 h-2 rounded-full ${style.dot}`} aria-hidden="true" />
                          <span className={`font-mono text-[10px] uppercase font-bold ${style.text}`}>
                            {style.label}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t monad-border">
                        <div className="font-mono text-sm font-bold text-black">{shift.time}</div>
                        <button
                          onClick={() => getShiftBriefing(shift)}
                          disabled={aiLoading && activeShift === shift.id}
                          aria-label={`Get AI briefing for ${shift.role} at ${shift.zone}`}
                          className="font-mono text-[10px] uppercase border monad-border px-4 py-1.5 rounded hover:border-black hover:bg-neutral-50 transition-colors disabled:opacity-50"
                        >
                          {aiLoading && activeShift === shift.id ? 'Loading...' : 'AI Briefing'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="mt-6">
                <div className="font-mono text-xs uppercase text-neutral-400 mb-3">/ Quick Actions</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2" role="group" aria-label="Quick volunteer actions">
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action.label)}
                      aria-label={action.label}
                      className="flex flex-col items-center gap-2 p-3 border monad-border rounded-lg bg-white hover:border-black hover:bg-neutral-50 transition-colors text-center"
                    >
                      <span className="text-xl" aria-hidden="true">{action.icon}</span>
                      <span className="font-mono text-[10px] uppercase text-neutral-600">{action.label}</span>
                    </button>
                  ))}
                </div>
                {actionMsg && (
                  <div role="status" aria-live="polite" className="mt-3 text-xs text-green-600 font-mono">
                    ✅ {actionMsg}
                  </div>
                )}
              </div>
            </div>

            {/* Right: AI Briefing Output */}
            <div className="p-8">
              <div className="font-mono text-xs uppercase text-neutral-400 mb-4">/ AI Shift Briefing</div>
              <div
                role="status"
                aria-live="polite"
                aria-label="AI shift briefing"
                className="p-5 bg-neutral-50 border monad-border rounded-lg min-h-48"
              >
                {aiLoading ? (
                  <div className="flex items-center gap-3 text-sm text-neutral-500">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                    <span>Generating briefing...</span>
                  </div>
                ) : aiHelp ? (
                  <div>
                    <div className="font-mono text-[10px] text-neutral-400 uppercase mb-3">
                      🤖 AI Briefing · {SHIFTS.find(s => s.id === activeShift)?.role}
                    </div>
                    <div className="text-sm text-black whitespace-pre-line leading-relaxed">{aiHelp}</div>
                  </div>
                ) : (
                  <p className="text-sm text-neutral-400 italic">
                    Click "AI Briefing" on any shift above to receive AI-generated role guidance and safety tips.
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="mt-6 flex flex-col gap-3">
                {[
                  { label: 'Total Shifts Today', val: '3' },
                  { label: 'Hours Volunteered', val: '12h' },
                  { label: 'Volunteer Cohort', val: 'Group A-12' },
                ].map((stat) => (
                  <div key={stat.label} className="flex justify-between items-center p-3 bg-white border monad-border rounded">
                    <span className="font-mono text-xs text-neutral-500 uppercase">{stat.label}</span>
                    <span className="font-mono font-bold text-black text-sm">{stat.val}</span>
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

'use client';
import { useState, useMemo } from 'react';

const MATCHES = [
  {
    id: 1,
    home: 'Mexico',
    homeFlagCode: 'MX',
    away: 'Ecuador',
    awayFlagCode: 'EC',
    venue: 'Estadio Azteca',
    city: 'Mexico City',
    date: 'Jul 11',
    time: '19:00',
    stage: 'Group A — MD1',
    status: 'live',
    score: '2 – 1',
  },
  {
    id: 2,
    home: 'USA',
    homeFlagCode: 'US',
    away: 'Canada',
    awayFlagCode: 'CA',
    venue: 'MetLife Stadium',
    city: 'New York / NJ',
    date: 'Jul 13',
    time: '21:00',
    stage: 'Group B — MD1',
    status: 'upcoming',
    score: null,
  },
  {
    id: 3,
    home: 'Brazil',
    homeFlagCode: 'BR',
    away: 'Argentina',
    awayFlagCode: 'AR',
    venue: 'SoFi Stadium',
    city: 'Los Angeles',
    date: 'Jul 15',
    time: '18:00',
    stage: 'Group C — MD1',
    status: 'upcoming',
    score: null,
  },
  {
    id: 4,
    home: 'Germany',
    homeFlagCode: 'DE',
    away: 'Spain',
    awayFlagCode: 'ES',
    venue: 'AT&T Stadium',
    city: 'Dallas',
    date: 'Jul 12',
    time: '15:00',
    stage: 'Group D — MD1',
    status: 'completed',
    score: '1 – 3',
  },
];

const FILTER_OPTIONS = ['all', 'live', 'upcoming', 'completed'];

const STATUS_BADGE = {
  live: 'bg-red-100 text-red-600 border-red-200',
  upcoming: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  completed: 'bg-neutral-100 text-neutral-500 border-neutral-200',
};

/**
 * MatchSchedule — FIFA 2026 match schedule with AI-powered fan tips.
 * Filterable by status, with live score display and per-match AI recommendations.
 */
export default function MatchSchedule() {
  const [filter, setFilter] = useState('all');
  const [aiTip, setAiTip] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [activeMatch, setActiveMatch] = useState(null);

  const filtered = useMemo(
    () => filter === 'all' ? MATCHES : MATCHES.filter(m => m.status === filter),
    [filter]
  );

  const getMatchTip = async (match) => {
    setActiveMatch(match.id);
    setAiLoading(true);
    setAiTip('');
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Give 1 practical fan travel tip for attending ${match.home} vs ${match.away} at ${match.venue} in ${match.city}. Include transport or arrival advice. Max 35 words.`,
          context: 'fan',
          language: 'en',
          type: 'matchday',
        }),
      });
      const data = await res.json();
      setAiTip(data.response);
    } catch {
      setAiTip(`Arrive at ${match.venue} at least 2 hours early. Check local transit apps for real-time updates before heading out.`);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <section
      id="schedule"
      aria-label="FIFA 2026 Match Schedule"
      className="w-full bg-white border-b monad-border pb-20"
    >
      <div className="container mx-auto px-4 md:px-10 mt-20">
        <div className="border-x border-t monad-border">

          {/* Header */}
          <div className="p-8 border-b monad-border bg-neutral-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="font-mono text-xs uppercase text-neutral-400 mb-2">/ Match Intelligence</div>
              <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight">FIFA 2026 Schedule</h2>
              <p className="text-neutral-500 text-sm mt-1">
                104 matches · 16 venues · 3 nations · AI fan tips for every game
              </p>
            </div>

            {/* Filter Buttons */}
            <div
              role="group"
              aria-label="Filter matches by status"
              className="flex flex-wrap gap-2"
            >
              {FILTER_OPTIONS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className={`font-mono text-[10px] uppercase px-4 py-2 border rounded transition-colors ${
                    filter === f
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-neutral-500 border-neutral-200 hover:border-black hover:text-black'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Match Rows */}
          <div role="list" aria-label="Match list">
            {filtered.map((match) => (
              <div
                key={match.id}
                role="listitem"
                className={`flex flex-col md:flex-row md:items-center justify-between px-6 py-5 border-b monad-border gap-4 hover:bg-neutral-50 transition-colors ${
                  activeMatch === match.id ? 'bg-neutral-50' : ''
                }`}
              >
                {/* Left: Teams + Venue */}
                <div className="flex items-center gap-4">
                  {match.status === 'live' && (
                    <div className="flex items-center gap-1.5 shrink-0" aria-label="Match is live">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" aria-hidden="true" />
                      <span className="font-mono text-[10px] text-red-500 uppercase font-bold">Live</span>
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-black text-lg leading-tight">
                      {match.home}
                      <span className="text-neutral-300 font-normal mx-3">vs</span>
                      {match.away}
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                      {match.venue} · {match.city} · {match.stage}
                    </div>
                  </div>
                </div>

                {/* Right: Score/Time + Status + Button */}
                <div className="flex items-center gap-4 md:gap-6">
                  <div>
                    {match.score ? (
                      <div
                        className="font-mono font-bold text-2xl text-black tracking-tight"
                        aria-label={`Final score ${match.home} ${match.score.split('–')[0].trim()} ${match.away} ${match.score.split('–')[1].trim()}`}
                      >
                        {match.score}
                      </div>
                    ) : (
                      <div className="font-mono text-sm text-neutral-600">
                        {match.date} · {match.time}
                      </div>
                    )}
                  </div>

                  <span
                    className={`font-mono text-[10px] uppercase px-2.5 py-1 border rounded ${STATUS_BADGE[match.status]}`}
                  >
                    {match.status}
                  </span>

                  <button
                    onClick={() => getMatchTip(match)}
                    disabled={aiLoading && activeMatch === match.id}
                    aria-label={`Get AI fan tip for ${match.home} vs ${match.away} at ${match.venue}`}
                    className="font-mono text-[10px] uppercase border monad-border px-4 py-2 rounded hover:border-black hover:bg-white transition-colors whitespace-nowrap disabled:opacity-50"
                  >
                    {aiLoading && activeMatch === match.id ? 'Loading...' : 'Fan Tip'}
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="p-12 text-center text-neutral-400 font-mono text-sm">
                No matches found for "{filter}" filter.
              </div>
            )}
          </div>

          {/* AI Tip Output */}
          {(aiTip || aiLoading) && (
            <div
              role="status"
              aria-live="polite"
              aria-label="AI fan tip"
              className="p-6 border-t monad-border bg-neutral-50 flex items-start gap-4"
            >
              <span className="text-xl shrink-0" aria-hidden="true">🤖</span>
              <div>
                <div className="font-mono text-[10px] text-neutral-400 uppercase mb-2">
                  AI Fan Tip · {MATCHES.find(m => m.id === activeMatch)?.home} vs {MATCHES.find(m => m.id === activeMatch)?.away}
                </div>
                {aiLoading ? (
                  <div className="animate-pulse text-sm text-neutral-500">Generating tip...</div>
                ) : (
                  <p className="text-sm text-black leading-relaxed">{aiTip}</p>
                )}
              </div>
            </div>
          )}

          {/* Bottom Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-t monad-border">
            {[
              { label: 'Total Matches', val: '104' },
              { label: 'Group Stage', val: '72' },
              { label: 'Knockout', val: '32' },
              { label: 'Nations', val: '48' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`p-5 flex flex-col items-center gap-1 ${i > 0 ? 'border-l monad-border' : ''}`}
              >
                <div className="font-mono font-bold text-xl text-black">{stat.val}</div>
                <div className="font-mono text-[10px] uppercase text-neutral-400">{stat.label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

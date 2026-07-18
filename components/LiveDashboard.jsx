'use client';
import { useState, useEffect } from 'react';

function MetricGauge({ value, max, label, sublabel }) {
  const pct = Math.min((value / max) * 100, 100);
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end">
        <div>
          <div className="font-mono text-xs uppercase text-neutral-500">{label}</div>
          {sublabel && <div className="text-xs text-neutral-400 mt-1">{sublabel}</div>}
        </div>
        <div className="font-mono text-lg font-bold text-black">
          {value.toLocaleString()}<span className="text-xs text-neutral-400 font-normal">/{max.toLocaleString()}</span>
        </div>
      </div>
      <div className="h-1 bg-neutral-200 w-full rounded-none overflow-hidden relative">
        <div 
          className={`h-full absolute left-0 top-0 transition-all duration-1000 ease-out ${pct > 85 ? 'bg-red-500' : pct > 65 ? 'bg-yellow-500' : 'bg-black'}`} 
          style={{ width: `${pct}%` }} 
        />
      </div>
    </div>
  );
}

const ALERTS = [
  { id: 1, type: 'warning', icon: '⚠️', message: 'Gate 7 approaching capacity — redirect fans to Gate 8', time: '2 min ago', zone: 'Gate 7' },
  { id: 2, type: 'info', icon: '🚇', message: 'Metro Line 4 delays of 8 min — inform fans near exits', time: '5 min ago', zone: 'Transit' },
  { id: 3, type: 'success', icon: '✅', message: 'Medical team deployed to Section 200 as scheduled', time: '12 min ago', zone: 'Medical' },
];

const TRANSPORT = [
  { name: 'Metro Line 4', status: 'Delayed', delay: '+8 min', icon: '🚇' },
  { name: 'Shuttle Bus A', status: 'On Time', delay: '', icon: '🚌' },
  { name: 'Parking Lot B', status: '72% Full', delay: '', icon: '🅿️' },
];

export default function LiveDashboard() {
  const [time, setTime] = useState(new Date());
  const [aiAlert, setAiAlert] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const [metrics, setMetrics] = useState({
    gateA: 52400, gateB: 8200, gateC: 9800, gateD: 11600, totalCap: 82500,
  });

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    const m = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        gateA: Math.min(prev.gateA + Math.floor(Math.random() * 200 - 50), 82500),
      }));
    }, 3000);
    return () => { clearInterval(t); clearInterval(m); };
  }, []);

  const totalAttendance = metrics.gateA + metrics.gateB + metrics.gateC + metrics.gateD;

  const getAIRecommendation = async () => {
    setAiLoading(true);
    setAiAlert('');
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Current dashboard: ${totalAttendance} attendance, Metro delayed 8 mins. Give 1 sentence operational recommendation.`,
          context: 'organizer', language: 'en', type: 'crowd',
        }),
      });
      const data = await res.json();
      setAiAlert(data.response);
    } catch {
      setAiAlert('AI service unavailable.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <section id="dashboard" className="w-full bg-white relative border-b monad-border pb-20">
      <div className="w-full h-12 lg:h-20 bg-neutral-50 border-b monad-border mb-12"></div>
      
      <div className="container mx-auto px-4 md:px-10">
        <div className="border-x monad-border overflow-hidden">
          
          {/* Header Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end p-8 border-b monad-border gap-6">
            <div>
              <div className="font-mono text-xs uppercase text-neutral-400 mb-2">/ Live Dashboard</div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-black max-w-[20ch]">
                Operational Intelligence
              </h2>
            </div>
            <div className="flex flex-col items-end text-right">
              <div className="font-mono text-2xl font-bold text-black" suppressHydrationWarning>{time.toLocaleTimeString('en-US')}</div>
              <div className="font-mono text-xs text-neutral-500 mt-1 uppercase" suppressHydrationWarning>{time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-mono text-[10px] uppercase text-green-600 font-bold tracking-widest">Live System Active</span>
              </div>
            </div>
          </div>

          {/* Top KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b monad-border">
            {[
              { label: 'Attendance', val: totalAttendance.toLocaleString(), sub: 'Capacity 82.5K' },
              { label: 'Active Staff', val: '2,847', sub: '94% Deployed' },
              { label: 'Incidents', val: '12', sub: '0 Critical Open' },
              { label: 'Eco Tracking', val: '18.4t', sub: 'CO2 Offset Today' },
            ].map((kpi, i) => (
              <div key={i} className={`p-6 flex flex-col justify-between ${i !== 0 && i !== 2 ? 'border-l monad-border' : ''} ${i < 2 ? 'border-b md:border-b-0 monad-border' : ''}`}>
                <div className="font-mono text-xs text-neutral-400 uppercase mb-4">{kpi.label}</div>
                <div>
                  <div className="text-3xl lg:text-4xl font-bold font-mono text-black mb-1">{kpi.val}</div>
                  <div className="text-xs text-neutral-500 uppercase font-mono">{kpi.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Grid Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3">
            
            {/* Left: Density */}
            <div className="p-8 border-b lg:border-b-0 lg:border-r monad-border flex flex-col gap-8">
              <div className="font-mono text-xs uppercase text-neutral-400">/ Crowd Density</div>
              <div className="flex flex-col gap-6">
                <MetricGauge value={metrics.gateA} max={metrics.totalCap} label="Main Bowl" />
                <MetricGauge value={metrics.gateB} max={20000} label="Gate B Zone" />
                <MetricGauge value={metrics.gateC} max={20000} label="Gate C Zone" />
                <MetricGauge value={metrics.gateD} max={15000} label="VIP & Media" />
              </div>
            </div>

            {/* Middle: Transport & AI */}
            <div className="p-8 border-b lg:border-b-0 lg:border-r monad-border flex flex-col gap-8 bg-neutral-50">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="font-mono text-xs uppercase text-neutral-400">/ AI Recommendation</div>
                  <button onClick={getAIRecommendation} disabled={aiLoading} className="font-mono text-[10px] uppercase bg-white border monad-border px-3 py-1 rounded hover:bg-neutral-100">
                    {aiLoading ? 'Analyzing...' : 'Refresh'}
                  </button>
                </div>
                <div className="bg-white p-4 border monad-border rounded text-sm text-black min-h-20">
                  {aiAlert || 'Click refresh to analyze current dashboard metrics and generate an operational strategy.'}
                </div>
              </div>

              <div>
                <div className="font-mono text-xs uppercase text-neutral-400 mb-4">/ Transport Status</div>
                <div className="flex flex-col gap-3">
                  {TRANSPORT.map((t, i) => (
                    <div key={i} className="flex justify-between items-center bg-white border monad-border p-3 rounded">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{t.icon}</span>
                        <span className="text-sm font-bold">{t.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-xs uppercase font-bold">{t.status}</div>
                        {t.delay && <div className="font-mono text-[10px] text-red-500">{t.delay}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Alerts */}
            <div className="p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="font-mono text-xs uppercase text-neutral-400">/ Live Alerts</div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col gap-3">
                {ALERTS.map(alert => (
                  <div key={alert.id} className="border monad-border p-4 bg-white">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-xl">{alert.icon}</span>
                      <p className="text-sm font-medium leading-snug">{alert.message}</p>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t monad-border">
                      <div className="font-mono text-[10px] text-neutral-400 uppercase">{alert.zone} • {alert.time}</div>
                      <button className="font-mono text-[10px] uppercase hover:underline">Acknowledge</button>
                    </div>
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

'use client';

const FEATURES = [
  {
    id: 'crowdsense',
    title: 'CrowdSense AI',
    description: 'Real-time crowd density prediction using computer vision data and AI pattern recognition. Alerts staff before bottlenecks form.',
    stats: [{ value: '94%', label: 'Accuracy' }, { value: '8 min', label: 'Advance warning' }],
  },
  {
    id: 'accesiguide',
    title: 'AccessiGuide',
    description: 'Step-by-step wheelchair-accessible routing, audio guidance, sign language scheduling, and priority assistance coordination.',
    stats: [{ value: '100%', label: 'ADA compliance' }, { value: '3 min', label: 'Avg response' }],
  },
  {
    id: 'ecotrack',
    title: 'EcoTrack',
    description: 'Live carbon footprint monitoring, renewable energy tracking, waste sorting guidance, and resource consumption optimization.',
    stats: [{ value: '73%', label: 'Renewable energy' }, { value: '18.4t', label: 'CO₂ offset' }],
  },
  {
    id: 'linguamatch',
    title: 'LinguaMatch',
    description: 'Instant translation in 50+ languages powered by Gemini AI. Cultural context awareness and real-time announcements translation.',
    stats: [{ value: '50+', label: 'Languages' }, { value: '<1s', label: 'Translation time' }],
  },
  {
    id: 'transitflow',
    title: 'TransitFlow',
    description: 'Predictive transit optimization coordinating metro, shuttle, rideshare, and parking. Reduces exit congestion.',
    stats: [{ value: '55%', label: 'Congestion cut' }, { value: '16', label: 'Venues covered' }],
  },
  {
    id: 'safezone',
    title: 'SafeZone',
    description: 'AI-coordinated emergency response, incident tracking, smart evacuation routing, and predictive security intelligence.',
    stats: [{ value: '< 90s', label: 'Response time' }, { value: '5M+', label: 'Fans protected' }],
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="w-full bg-white relative border-b monad-border pb-20">
      <div className="container mx-auto px-4 md:px-10">
        
        {/* Sticky Sidebar + Grid Layout */}
        <div className="flex flex-col lg:flex-row border-x monad-border overflow-hidden">
          
          {/* Left: Sticky Intro */}
          <div className="w-full lg:w-1/3 p-8 md:p-12 border-b lg:border-b-0 lg:border-r monad-border flex flex-col gap-6 lg:sticky lg:top-15 lg:h-[calc(100vh-60px)] bg-neutral-50 justify-center">
            <div className="font-mono text-xs uppercase text-neutral-400">/ Six Pillars</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black leading-tight">
              Stadium<br/>Intelligence
            </h2>
            <p className="text-lg text-neutral-600 max-w-sm">
              From crowd management to multilingual assistance, GenAI modules cover every dimension of the 2026 experience.
            </p>
          </div>

          {/* Right: Feature Grid */}
          <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2">
            {FEATURES.map((feature, i) => (
              <div 
                key={feature.id} 
                className={`p-8 flex flex-col justify-between hover:bg-neutral-50 transition-colors ${i % 2 !== 0 ? '' : 'md:border-r'} ${i < 4 ? 'border-b' : ''} monad-border`}
              >
                <div>
                  <h3 className="text-2xl font-bold text-black mb-4">{feature.title}</h3>
                  <p className="text-neutral-600 mb-10 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
                <div className="flex gap-8 pt-6 border-t monad-border">
                  {feature.stats.map((stat, idx) => (
                    <div key={idx}>
                      <div className="font-mono text-xl font-bold text-black">{stat.value}</div>
                      <div className="font-mono text-[10px] text-neutral-400 uppercase mt-1 tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

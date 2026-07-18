'use client';
import Image from 'next/image';
import { useState } from 'react';

const VENUES = [
  {
    name: 'MetLife Stadium',
    city: 'New York / New Jersey',
    country: 'USA',
    capacity: 82500,
    matches: 8,
    image: 'https://digitalhub.fifa.com/transform/0d90e4f5-db7c-4afc-9be7-2938c19e8428/2026-FWC-Stadiums-MetLife',
    highlight: 'FINAL HOST',
  },
  {
    name: 'SoFi Stadium',
    city: 'Los Angeles',
    country: 'USA',
    capacity: 70240,
    matches: 6,
    image: 'https://digitalhub.fifa.com/transform/c28fe48d-4e5d-4d0e-9be9-8a6b6d7b1d2c/2026-FWC-Stadiums-SoFi',
    highlight: 'SEMIFINAL',
  },
  {
    name: 'AT&T Stadium',
    city: 'Dallas',
    country: 'USA',
    capacity: 80000,
    matches: 7,
    image: 'https://digitalhub.fifa.com/transform/b3e6c5a4-7d8e-4f9b-a1c2-3e5f6g7h8i9j/2026-FWC-Stadiums-ATT',
    highlight: 'QUARTERFINAL',
  },
  {
    name: 'Estadio Azteca',
    city: 'Mexico City',
    country: 'MEX',
    capacity: 87523,
    matches: 6,
    image: 'https://digitalhub.fifa.com/transform/d3e4f5g6-h7i8-9012-jklm-345678901bcd/2026-FWC-Stadiums-Azteca',
    highlight: 'OPENING MATCH',
  }
];

function VenueCard({ venue, index }) {
  const [aiInfo, setAiInfo] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const getAIInfo = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Give me 1 brief exciting fact about ${venue.name} in ${venue.city} as a FIFA 2026 venue. Max 20 words.`,
          context: 'fan', language: 'en', type: 'general',
        }),
      });
      const data = await res.json();
      setAiInfo(data.response);
    } catch {
      setAiInfo('AI venue info temporarily unavailable.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className={`flex flex-col border-b md:border-b-0 monad-border ${index % 2 === 0 ? 'md:border-r' : ''}`}>
      <div className="h-48 bg-neutral-100 relative border-b monad-border overflow-hidden group">
        <Image
          src={venue.image}
          alt={venue.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
          onError={() => {}}
        />
        <div className="absolute top-3 right-3 bg-white border monad-border px-2 py-1 font-mono text-[10px] font-bold tracking-wider uppercase text-black">
          {venue.highlight}
        </div>
      </div>

      <div className="p-6 flex flex-col justify-between flex-1 bg-white hover:bg-neutral-50 transition-colors">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-black">{venue.name}</h3>
            <span className="font-mono text-[10px] text-neutral-400 border monad-border px-2 py-1 rounded bg-white">{venue.country}</span>
          </div>
          <p className="text-neutral-500 text-sm mb-6">{venue.city}</p>
          
          <div className="flex gap-8 mb-6">
            <div>
              <div className="font-mono font-bold text-lg text-black">{venue.capacity.toLocaleString()}</div>
              <div className="font-mono text-[10px] uppercase text-neutral-400">Capacity</div>
            </div>
            <div>
              <div className="font-mono font-bold text-lg text-black">{venue.matches}</div>
              <div className="font-mono text-[10px] uppercase text-neutral-400">Matches</div>
            </div>
          </div>
        </div>

        <div>
          {aiInfo && (
            <div className="mb-4 p-3 bg-neutral-50 border monad-border rounded text-xs text-neutral-700 italic">
              🤖 {aiInfo}
            </div>
          )}
          <button
            onClick={getAIInfo}
            disabled={aiLoading}
            className="w-full text-center border monad-border bg-white hover:border-black text-black font-mono text-[10px] uppercase tracking-widest py-2 rounded transition-colors"
          >
            {aiLoading ? 'Analyzing...' : 'AI Venue Intel'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VenuesSection() {
  return (
    <section id="venues" className="w-full bg-white relative border-b monad-border pb-20">
      <div className="container mx-auto px-4 md:px-10 mt-20">
        
        <div className="border-x border-t monad-border">
          {/* Header Row */}
          <div className="p-8 md:p-12 border-b monad-border bg-neutral-50 text-center flex flex-col items-center">
            <div className="font-mono text-xs uppercase text-neutral-400 mb-4">/ Iconic Locations</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-4">
              16 Venues. 3 Nations.
            </h2>
            <p className="text-neutral-500 max-w-xl text-lg">
              StadiumIQ AI is deployed across all 16 FIFA 2026 venues in the United States, Canada, and Mexico.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b monad-border">
            {VENUES.map((venue, i) => (
              <VenueCard key={venue.name} venue={venue} index={i} />
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}

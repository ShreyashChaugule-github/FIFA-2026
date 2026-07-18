'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

// Camera positions for each hotspot in the 3D stadium
// Each entry is [eye_x, eye_y, eye_z, target_x, target_y, target_z]
const HOTSPOTS = [
  {
    id: 'gate',
    name: 'Main Gates (A-D)',
    icon: '🚪',
    camera: {
      eye: [80, 15, 80],
      target: [20, 0, 20],
    },
  },
  {
    id: 'medical',
    name: 'Medical Center',
    icon: '🏥',
    camera: {
      eye: [-60, 15, 60],
      target: [-20, 0, 20],
    },
  },
  {
    id: 'food',
    name: 'Concessions',
    icon: '🍔',
    camera: {
      eye: [0, 25, 90],
      target: [0, 5, 30],
    },
  },
  {
    id: 'vip',
    name: 'VIP Entrance',
    icon: '⭐',
    camera: {
      eye: [-80, 15, -30],
      target: [-30, 5, -10],
    },
  },
  {
    id: 'merch',
    name: 'Merchandise',
    icon: '👕',
    camera: {
      eye: [60, 20, -60],
      target: [20, 5, -20],
    },
  },
  {
    id: 'overview',
    name: 'Full Overview',
    icon: '🏟️',
    camera: {
      eye: [0.1, 200, 0.1],
      target: [0, 0, 0],
    },
  },
];

export default function StadiumNavigator() {
  const iframeRef = useRef(null);
  const apiRef = useRef(null);
  const clientRef = useRef(null);
  const [viewerReady, setViewerReady] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [navInstructions, setNavInstructions] = useState('');
  const [navStatus, setNavStatus] = useState('Initializing 3D viewer...');

  // Load Sketchfab Viewer API and initialize
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';
    script.async = true;
    script.onload = () => {
      if (!iframeRef.current) return;
      // eslint-disable-next-line no-undef
      const client = new window.Sketchfab(iframeRef.current);
      clientRef.current = client;

      client.init('21767e058e9e4df8a1c57352611756aa', {
        autostart: 1,
        ui_hint: 0,
        ui_infos: 0,
        ui_controls: 0,
        ui_watermark: 0,
        ui_annotations: 0,
        ui_settings: 0,
        ui_vr: 0,
        ui_fullscreen: 0,
        ui_animations: 0,
        ui_help: 0,
        camera: 0,
        success: (api) => {
          apiRef.current = api;
          api.start();
          api.addEventListener('viewerready', () => {
            setViewerReady(true);
            setNavStatus('3D viewer ready — select a destination');
          });
        },
        error: () => {
          setNavStatus('⚠️ Could not load 3D viewer.');
        },
      });
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Fly the camera to a hotspot position
  const flyToHotspot = useCallback((hotspot) => {
    const api = apiRef.current;
    if (!api || !hotspot.camera) return;
    const { eye, target } = hotspot.camera;
    api.setCameraLookAt(eye, target, 2.0, (err) => {
      if (err) console.warn('Camera move error:', err);
    });
  }, []);

  // Get AI walking directions + fly camera
  const handleHotspotSelect = async (hotspot) => {
    setActiveHotspot(hotspot.id);
    setAiLoading(true);
    setNavInstructions('');

    // Fly camera in the 3D viewer
    flyToHotspot(hotspot);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Provide exactly 3 extremely short bulleted walking directions to the ${hotspot.name}. MAXIMUM 8 WORDS PER BULLET. NO INTRO OR OUTRO TEXT.`,
          context: 'fan',
          language: 'en',
          type: 'navigation',
        }),
      });
      const data = await res.json();
      setNavInstructions(data.response);
    } catch {
      setNavInstructions('Navigation service unavailable. Please follow stadium signage.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <section id="navigator" className="w-full bg-white relative border-b monad-border">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row-reverse min-h-[90vh] border-x monad-border bg-white">

          {/* Right Column: Sticky Sidebar */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-[60px] h-auto lg:h-[calc(100vh-60px)] p-6 md:p-10 border-b lg:border-b-0 lg:border-l monad-border flex flex-col overflow-y-auto">
            <div className="mb-8">
              <div className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-6">
                / 3D Navigator
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black mb-4">
                Spatial Awareness
              </h2>
              <p className="text-neutral-500 text-base">
                Select a destination — the 3D camera will fly there, and AI will generate step-by-step walking directions.
              </p>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${viewerReady ? 'bg-green-500 animate-pulse' : 'bg-yellow-400 animate-pulse'}`} />
              <span className="font-mono text-[11px] uppercase tracking-wide text-neutral-500">{navStatus}</span>
            </div>

            {/* Hotspot Buttons */}
            <div className="flex flex-col gap-2 mb-6">
              {HOTSPOTS.map((h) => (
                <button
                  key={h.id}
                  onClick={() => handleHotspotSelect(h)}
                  disabled={!viewerReady}
                  className={`text-left px-4 py-3 border monad-border rounded-md font-mono text-sm uppercase flex items-center gap-3 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                    activeHotspot === h.id
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black hover:bg-neutral-50'
                  }`}
                >
                  <span className="text-lg">{h.icon}</span>
                  {h.name}
                  {activeHotspot === h.id && (
                    <span className="ml-auto font-mono text-[9px] text-green-400 uppercase tracking-widest">Active</span>
                  )}
                </button>
              ))}
            </div>

            {/* AI Route Output */}
            <div className="flex-1 p-5 bg-neutral-50 border monad-border rounded-lg min-h-[140px]">
              <div className="font-mono text-xs text-neutral-400 mb-3 uppercase flex items-center gap-2">
                🤖 AI Route Instructions
              </div>
              {aiLoading ? (
                <div className="flex flex-col gap-2">
                  <div className="h-3 bg-neutral-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-neutral-200 rounded animate-pulse w-full" />
                  <div className="h-3 bg-neutral-200 rounded animate-pulse w-2/3" />
                  <p className="text-xs text-neutral-400 mt-2 italic">Generating directions...</p>
                </div>
              ) : navInstructions ? (
                <div className="text-sm text-black whitespace-pre-line leading-relaxed">
                  {navInstructions}
                </div>
              ) : (
                <div className="text-sm text-neutral-400 italic">
                  Select a destination above to generate AI step-by-step directions and fly the camera there.
                </div>
              )}
            </div>
          </div>

          {/* Left Column: 3D Model via Sketchfab Viewer API */}
          <div className="w-full lg:w-2/3 bg-neutral-900 flex flex-col h-[60vh] lg:h-[calc(100vh-60px)] relative">
            <div className="absolute top-4 left-4 z-10 bg-black/80 text-white font-mono text-[10px] px-3 py-1 rounded-sm uppercase tracking-wide border border-white/20">
              🏟️ Interactive 3D Stadium
            </div>
            {!viewerReady && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-neutral-900/80">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="font-mono text-white text-xs uppercase tracking-widest">Loading 3D Viewer...</span>
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              title="Modern Stadium"
              id="sketchfab-stadium-iframe"
              frameBorder="0"
              allowFullScreen
              mozallowfullscreen="true"
              webkitallowfullscreen="true"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              xr-spatial-tracking=""
              execution-while-out-of-viewport=""
              execution-while-not-rendered=""
              web-share=""
              className="w-full h-full border-none"
              src="https://sketchfab.com/models/21767e058e9e4df8a1c57352611756aa/embed?autostart=1&ui_hint=0&ui_infos=0&ui_watermark=0&camera=0&ui_annotations=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_animations=0&ui_help=0&ui_controls=0"
            />
          </div>

        </div>
      </div>
    </section>
  );
}

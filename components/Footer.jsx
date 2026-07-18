'use client';

export default function Footer() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="w-full bg-white border-t monad-border pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-lg rounded-sm">
                S
              </div>
              <span className="font-bold text-xl tracking-tight text-black">
                StadiumIQ
              </span>
            </div>
            <p className="text-neutral-500 text-sm leading-relaxed mb-6">
              The high-performance AI intelligence layer built for scale, powering the future of stadium operations.
            </p>
            <div className="flex gap-2">
              <span className="font-mono text-[10px] uppercase border monad-border px-2 py-1 bg-neutral-50">🤖 Gemini</span>
              <span className="font-mono text-[10px] uppercase border monad-border px-2 py-1 bg-neutral-50">⚽ FIFA 2026</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-6">Platform</div>
            <div className="flex flex-col gap-3">
              {['features', 'navigator', 'multilingual', 'venues'].map(id => (
                <button key={id} onClick={() => scrollTo(id)} className="text-left text-black hover:text-neutral-500 transition-colors text-sm font-medium capitalize">
                  {id}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-6">Developers</div>
            <div className="flex flex-col gap-3 text-sm font-medium text-black">
              <a href="#" className="hover:text-neutral-500 transition-colors">Documentation</a>
              <a href="#" className="hover:text-neutral-500 transition-colors">API Reference</a>
              <a href="#" className="hover:text-neutral-500 transition-colors">GitHub</a>
            </div>
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-6">Connect</div>
            <div className="flex flex-col gap-3 text-sm font-medium text-black">
              <a href="#" className="hover:text-neutral-500 transition-colors">X / Twitter</a>
              <a href="#" className="hover:text-neutral-500 transition-colors">Discord</a>
              <a href="#" className="hover:text-neutral-500 transition-colors">Contact</a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-neutral-200 mb-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono uppercase tracking-wide text-neutral-400">
          <div>
            © 2026 StadiumIQ. Powered by Google AI.
          </div>
          <div className="flex gap-4">
            <span>USA</span>
            <span>CANADA</span>
            <span>MEXICO</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

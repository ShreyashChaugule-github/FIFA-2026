'use client';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-screen z-50 border-b border-neutral-200 backdrop-blur-lg bg-white/90">
      <div className="container py-2 px-4 mx-auto flex items-center justify-between">

        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-2 cursor-pointer"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-lg rounded-sm">
            S
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">StadiumIQ</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {[
            { label: 'AI Center', id: 'ai-center' },
            { label: 'Navigator', id: 'navigator' },
            { label: 'Schedule', id: 'schedule' },
            { label: 'Volunteer', id: 'volunteer' },
            { label: 'Emergency', id: 'emergency' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="font-mono uppercase text-xs text-neutral-500 hover:text-black transition-colors tracking-wide"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* User + Sign Out */}
        <div className="flex items-center gap-3">
          {user?.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName || 'User'}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full border border-neutral-200 object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-black font-bold text-sm">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <span className="hidden md:block font-mono text-xs text-neutral-500 truncate max-w-35">
            {user?.displayName || user?.email}
          </span>
          <button
            onClick={signOut}
            className="font-mono uppercase text-xs tracking-wide border border-neutral-200 px-4 py-2 rounded-md hover:bg-neutral-100 hover:border-black transition-all text-black"
          >
            Sign Out
          </button>
        </div>

      </div>
    </header>
  );
}

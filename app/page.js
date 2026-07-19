'use client';
import { useAuth } from '@/context/AuthContext';

// Login page
import LoginPage from '@/components/HeroSection';
import Footer from '@/components/Footer';

// Dashboard components
import Navbar from '@/components/Navbar';
import AICommandCenter from '@/components/AICommandCenter';
import StadiumNavigator from '@/components/StadiumNavigator';
import LiveDashboard from '@/components/LiveDashboard';
import FeaturesGrid from '@/components/FeaturesGrid';
import MultilingualAssistant from '@/components/MultilingualAssistant';
import VenuesSection from '@/components/VenuesSection';

export default function Home() {
  const { user, loading } = useAuth();

  // Loading spinner while Firebase resolves auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">Loading...</span>
        </div>
      </div>
    );
  }

  // Not signed in → show login page + footer
  if (!user) {
    return (
      <main id="main-content" tabIndex="-1">
        <LoginPage />
        <section aria-label="Why StadiumIQ matters" className="border-b monad-border bg-neutral-50 px-4 py-12 md:px-10">
          <div className="container mx-auto max-w-5xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-500">/ Tournament Impact</p>
            <h2 className="mt-3 text-2xl font-semibold text-black sm:text-3xl">A GenAI layer for safer movement, stronger operations, and a better fan journey.</h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-neutral-600">StadiumIQ brings together wayfinding, multilingual support, accessibility, crowd intelligence, and volunteer coordination into one experience built for FIFA World Cup 2026.</p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  // Signed in → show full dashboard
  return (
    <main id="main-content" tabIndex="-1">
      <Navbar />
      <div className="pt-14.25">
        <LiveDashboard />
        <VenuesSection />
        <AICommandCenter />
        <StadiumNavigator />
        <FeaturesGrid />
        <MultilingualAssistant />
        <Footer />
      </div>
    </main>
  );
}

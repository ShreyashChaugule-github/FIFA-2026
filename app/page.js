'use client';
import { Suspense, lazy, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ErrorBoundary from '@/components/ErrorBoundary';

// Static import — critical path (shown immediately after login)
import LoginPage from '@/components/HeroSection';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

// Lazy imports — below-the-fold sections (massive JS bundle reduction)
const LiveDashboard = lazy(() => import('@/components/LiveDashboard'));
const MatchSchedule = lazy(() => import('@/components/MatchSchedule'));
const VenuesSection = lazy(() => import('@/components/VenuesSection'));
const AICommandCenter = lazy(() => import('@/components/AICommandCenter'));
const StadiumNavigator = lazy(() => import('@/components/StadiumNavigator'));
const FeaturesGrid = lazy(() => import('@/components/FeaturesGrid'));
const MultilingualAssistant = lazy(() => import('@/components/MultilingualAssistant'));
const VolunteerDashboard = lazy(() => import('@/components/VolunteerDashboard'));
const EmergencySOS = lazy(() => import('@/components/EmergencySOS'));

function SectionLoader({ label }) {
  return (
    <div
      role="status"
      aria-label={`Loading ${label}`}
      className="w-full py-20 flex items-center justify-center border-b monad-border"
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
        <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
          Loading {label}...
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Accessibility: Focus main content after authentication state resolves
    if (user) {
      const main = document.getElementById('main-content');
      if (main) main.focus({ preventScroll: true });
    }
  }, [user]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-white"
        role="status"
        aria-label="Loading StadiumIQ"
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
            Loading StadiumIQ...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <main id="main-content" tabIndex={-1}>
        <LoginPage />
        <section aria-label="Why StadiumIQ matters" className="border-b monad-border bg-neutral-50 px-4 py-12 md:px-10">
          <div className="container mx-auto max-w-5xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-500">/ Tournament Impact</p>
            <h2 className="mt-3 text-2xl font-semibold text-black sm:text-3xl">
              A GenAI layer for safer movement, stronger operations, and a better fan journey.
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-neutral-600">
              StadiumIQ brings together wayfinding, multilingual support, accessibility, crowd intelligence, and volunteer coordination into one experience built for FIFA World Cup 2026.
            </p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main id="main-content" tabIndex={-1}>
      <Navbar />
      <div className="pt-14">
        
        <ErrorBoundary>
          <Suspense fallback={<SectionLoader label="Live Dashboard" />}>
            <LiveDashboard />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader label="Match Schedule" />}>
            <MatchSchedule />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader label="Venues" />}>
            <VenuesSection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader label="AI Command Center" />}>
            <AICommandCenter />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader label="Stadium Navigator" />}>
            <StadiumNavigator />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader label="Features" />}>
            <FeaturesGrid />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader label="Multilingual Assistant" />}>
            <MultilingualAssistant />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader label="Volunteer Hub" />}>
            <VolunteerDashboard />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<SectionLoader label="Emergency SOS" />}>
            <EmergencySOS />
          </Suspense>
        </ErrorBoundary>

        <Footer />
      </div>
    </main>
  );
}

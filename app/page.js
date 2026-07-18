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
      <>
        <LoginPage />
        <Footer />
      </>
    );
  }

  // Signed in → show full dashboard
  return (
    <main>
      <Navbar />
      <div className="pt-[57px]">
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

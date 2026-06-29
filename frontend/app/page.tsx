"use client";

import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import HeroSection from '../components/landing/HeroSection';
import StatsSection from '../components/landing/StatsSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorks from '../components/landing/HowItWorks';
import ThemeToggle from '../components/layout/ThemeToggle';
import { ShieldCheck, LogIn, LayoutDashboard } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      {/* Landing Header */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white">
              <ShieldCheck size={20} />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              ScamShield AI
            </span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {!loading && (
              user ? (
                <Link 
                  href="/dashboard" 
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
              ) : (
                <Link 
                  href="/login" 
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
                >
                  <LogIn size={16} />
                  Sign In
                </Link>
              )
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <HeroSection />
        <StatsSection />
        <HowItWorks />
        <FeaturesSection />
      </main>

      {/* Footer */}
      <footer className="bg-surface-elevated py-8 border-t border-border text-center text-xs text-text-secondary leading-relaxed font-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="mb-2">
            🛡️ <strong>ScamShield AI</strong> — Helping protect Indian citizens from cyber fraud.
          </p>
          <p className="mb-4">
            If you have lost money, dial <strong>1930</strong> immediately to reach the National Cyber Crime Helpline.
          </p>
          <div className="w-16 h-0.5 bg-border mx-auto mb-4"></div>
          <p className="opacity-80">
            Built by <strong>Nitin Kushwah</strong>, IIT Guwahati | ScamShield AI Team &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

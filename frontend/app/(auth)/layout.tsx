"use client";

import Link from 'next/link';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import ThemeToggle from '../../components/layout/ThemeToggle';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background transition-colors font-sans">
      {/* Left branding banner on larger screens */}
      <div className="hidden md:flex md:w-1/2 bg-[#0B0F19] text-white p-12 flex-col justify-between relative grid-pattern border-r border-slate-800">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-600 rounded-full filter blur-[120px] opacity-10 pointer-events-none"></div>
        
        <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors w-fit">
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="max-w-md">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white mb-6 shadow-lg shadow-red-500/20">
            <ShieldAlert size={26} />
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-white font-sans leading-tight">
            Protecting Indian Citizens from Cyber Fraud.
          </h2>
          <p className="text-slate-400 font-light leading-relaxed">
            Create an incident record, verify SMS messages, track banking refunds, and file cybercrime reports inside seconds.
          </p>
        </div>

        <div className="text-xs text-slate-500">
          ScamShield AI Team &copy; {new Date().getFullYear()}
        </div>
      </div>

      {/* Right form container */}
      <div className="flex-grow flex flex-col justify-center items-center p-6 md:p-12 relative">
        {/* Top bar with Toggle & Home Back for Mobile */}
        <div className="absolute top-6 right-6 flex items-center gap-4">
          <ThemeToggle />
        </div>
        <div className="absolute top-6 left-6 block md:hidden">
          <Link href="/" className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors">
            <ArrowLeft size={16} />
            Home
          </Link>
        </div>

        <div className="w-full max-w-md bg-surface border border-border p-8 rounded-2xl shadow-xl transition-all duration-300">
          {children}
        </div>
      </div>
    </div>
  );
}

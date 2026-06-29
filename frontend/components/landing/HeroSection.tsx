"use client";

import Link from 'next/link';
import { ShieldAlert, ArrowRight, ShieldCheck, Database, Award } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0B0F19] text-white py-24 md:py-32 grid-pattern border-b border-slate-800">
      {/* Background Gradient Blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600 rounded-full filter blur-[120px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600 rounded-full filter blur-[120px] opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Large Shield Header */}
        <div className="flex justify-center mb-6">
          <div className="relative p-4 rounded-3xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 animate-pulse-critical">
            <ShieldAlert size={80} className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
          </div>
        </div>

        {/* Badges / Small Alert tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-red-400 mb-6 tracking-wide uppercase">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          Emergency Cyber Alert: India
        </div>

        {/* Headlines */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto">
          India Ka Cyber <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">Fraud Shield 🛡️</span>
        </h1>
        
        <p className="text-base md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Received a suspicious WhatsApp forward, SMS, or job offer? Paste it here. Our AI detects scams instantly, lists red flags, and builds your recovery complaint.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
          <Link href="/dashboard/analyze" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-red-600/30 focus:outline-none">
            Analyze a Suspicious Message
            <ArrowRight size={18} />
          </Link>
          <Link href="/dashboard/community" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold rounded-xl transition-colors focus:outline-none">
            Browse Reported Scams
            <Database size={18} className="text-slate-400" />
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-800/80 pt-12 max-w-5xl mx-auto">
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-extrabold text-red-500">₹1.6L Crore</span>
            <span className="text-xs md:text-sm text-slate-400 mt-2 uppercase tracking-wider font-semibold">Lost to Cyber Fraud in 2023</span>
          </div>
          <div className="flex flex-col items-center border-y md:border-y-0 md:border-x border-slate-800/80 py-6 md:py-0">
            <span className="text-3xl md:text-4xl font-extrabold text-orange-500">100+ Scam Types</span>
            <span className="text-xs md:text-sm text-slate-400 mt-2 uppercase tracking-wider font-semibold">Classified & Tracked</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-extrabold text-blue-400">1930 Helpline</span>
            <span className="text-xs md:text-sm text-slate-400 mt-2 uppercase tracking-wider font-semibold">Compliant Document Generator</span>
          </div>
        </div>
      </div>
    </section>
  );
}

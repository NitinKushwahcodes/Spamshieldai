"use client";

import { AlertTriangle, TrendingUp, HelpCircle, ShieldClose } from 'lucide-react';

export default function StatsSection() {
  return (
    <section className="py-16 bg-[#0B0F19] text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="flex items-center gap-4 p-6 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="p-3 bg-red-500/10 rounded-lg text-red-500">
              <AlertTriangle size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-500">₹1,60,000 Cr</div>
              <div className="text-xs text-slate-400 mt-0.5">Estimated Cyber Losses in 2023</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="p-3 bg-orange-500/10 rounded-lg text-orange-500">
              <TrendingUp size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-500">70%</div>
              <div className="text-xs text-slate-400 mt-0.5">Scam Cases Involve UPI Frauds</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
              <HelpCircle size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">1930</div>
              <div className="text-xs text-slate-400 mt-0.5">National Cybercrime Helpline</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500">
              <ShieldClose size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-500">100% Secure</div>
              <div className="text-xs text-slate-400 mt-0.5">No-Login AI Scan Support</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

"use client";

import { ShieldCheck, FileSpreadsheet, Scale, Users2, LayoutDashboard } from 'lucide-react';

const FEATURES = [
  {
    icon: <ShieldCheck size={28} className="text-red-500" />,
    title: "AI Scam Analyzer",
    description: "Evaluates WhatsApp texts, SMS links, job offers, or call logs against 100+ known Indian scam categories to deliver an immediate safety verdict."
  },
  {
    icon: <FileSpreadsheet size={28} className="text-orange-500" />,
    title: "Evidence Vault",
    description: "Guides you through gathering essential forensic items (transaction PDFs, chat logs, call recordings) and keeps a secure case checklist."
  },
  {
    icon: <Scale size={28} className="text-blue-500" />,
    title: "Complaint Builder",
    description: "Auto-generates official cybercell complaints, RBI-compliant bank freeze letters, and consumer forum grievance sheets to recover lost funds."
  },
  {
    icon: <Users2 size={28} className="text-violet-500" />,
    title: "Community Database",
    description: "Crowdsources reported fraudulent telephone numbers and website links. Search details and check reports filtered by city or category."
  },
  {
    icon: <LayoutDashboard size={28} className="text-emerald-500" />,
    title: "Response Dashboard",
    description: "Tracks active incident records, checklist progression, and lets you copy or print customized legal documents seamlessly."
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight mb-4">
            Everything You Need to Fight Cyber Fraud
          </h2>
          <p className="text-text-secondary font-light">
            An end-to-end incident response suite built specifically to safeguard Indian consumers from financial and digital exploits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feat, idx) => (
            <div 
              key={idx} 
              className="p-8 rounded-2xl bg-surface-elevated border border-border hover:border-red-500/20 hover:shadow-xl hover:shadow-red-500/[0.02] hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="mb-5 p-3.5 rounded-xl bg-surface border border-border w-fit group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">
                {feat.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed font-light">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

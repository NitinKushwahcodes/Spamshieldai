"use client";

import { ClipboardCopy, Brain, CheckSquare } from 'lucide-react';

const STEPS = [
  {
    step: "01",
    icon: <ClipboardCopy size={24} className="text-red-500" />,
    title: "Paste Message",
    description: "Copy that suspicious WhatsApp forward, job offer SMS, phishing link, or caller claim and paste it in the analyzer."
  },
  {
    step: "02",
    icon: <Brain size={24} className="text-orange-500" />,
    title: "AI Analysis",
    description: "Our dual-model AI service parses the text, checks against 100+ scam patterns, highlights red flags, and extracts relevant laws."
  },
  {
    step: "03",
    icon: <CheckSquare size={24} className="text-blue-500" />,
    title: "Take Control",
    description: "Read your immediate safety action list, track required evidence checksheets, and auto-build formal dispute files."
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-surface-elevated border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight mb-4">
            How ScamShield AI Works
          </h2>
          <p className="text-text-secondary font-light">
            Three simple steps to verify safety, secure evidence, and take legal action.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-[4.5rem] left-[15%] right-[15%] h-0.5 bg-border -z-10"></div>
          
          {STEPS.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                {/* Number tag */}
                <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-white">
                  {item.step}
                </div>
                
                {/* Icon wrapper */}
                <div className="w-16 h-16 rounded-2xl bg-surface border border-border shadow-md flex items-center justify-center">
                  {item.icon}
                </div>
              </div>

              <h3 className="text-lg font-bold text-text-primary mb-2">
                {item.title}
              </h3>
              
              <p className="text-text-secondary text-sm font-light max-w-xs leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

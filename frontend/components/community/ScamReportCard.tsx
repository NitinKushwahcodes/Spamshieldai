"use client";

import { CommunityReport } from '../../types';
import { ShieldAlert, MapPin, Calendar, EyeOff } from 'lucide-react';

interface ScamReportCardProps {
  report: CommunityReport;
}

export default function ScamReportCard({ report }: ScamReportCardProps) {
  return (
    <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
      {/* Accent Alert line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-500"></div>

      <div>
        {/* Header row */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <span className="px-2.5 py-0.5 rounded-lg bg-surface-elevated text-text-secondary text-[10px] font-bold border border-border">
            {report.scam_type}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-red-500 font-bold bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full animate-pulse">
            <ShieldAlert size={12} />
            {report.report_count} Reports
          </div>
        </div>

        {/* Targeted Number/URL */}
        <div className="space-y-1 mb-4">
          <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Reported Target</p>
          <p className="text-base font-extrabold text-text-primary tracking-tight font-mono select-all">
            {report.reported_number || report.reported_url || 'Anonymous Address'}
          </p>
        </div>

        {/* Description snippet */}
        {report.description && (
          <p className="text-text-secondary text-xs font-light leading-relaxed mb-6 bg-surface-elevated/20 p-3 rounded-xl border border-border/40 italic">
            "{report.description}"
          </p>
        )}
      </div>

      {/* Footer Info (Location, Date) */}
      <div className="flex flex-wrap items-center gap-y-2 justify-between text-[10px] text-text-muted border-t border-border/80 pt-4 mt-auto">
        <div className="flex items-center gap-1">
          <MapPin size={12} className="text-text-muted" />
          <span>
            {report.city ? `${report.city}, ` : ''}
            {report.state || 'India'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Calendar size={12} className="text-text-muted" />
          <span>
            {new Date(report.created_at).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

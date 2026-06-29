"use client";

import Link from 'next/link';
import { Case } from '../../types';
import { Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface CaseCardProps {
  item: Case;
}

export default function CaseCard({ item }: CaseCardProps) {
  const getSeverityClass = (sev: string) => {
    switch (sev) {
      case 'Critical': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20';
      case 'High': return 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20';
      case 'Medium': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20';
      default: return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'in_progress': return <Clock size={16} className="text-orange-500" />;
      default: return <AlertCircle size={16} className="text-red-500" />;
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between hover:shadow-md transition-shadow group">
      <div>
        {/* Header row */}
        <div className="flex justify-between items-start gap-4 mb-3">
          <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
            {item.scam_category.replace('_', ' ')}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getSeverityClass(item.severity)}`}>
            {item.severity}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors truncate">
          {item.scam_type}
        </h4>

        {/* Date */}
        <p className="text-[10px] text-text-muted mt-1.5 font-light">
          Logged: {new Date(item.created_at).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </p>

        {/* Original Message snippet */}
        <p className="text-text-secondary text-xs font-light mt-3 line-clamp-2 leading-relaxed italic bg-surface-elevated/30 p-2.5 rounded-lg border border-border/40">
          "{item.original_message}"
        </p>
      </div>

      {/* Footer row */}
      <div className="flex justify-between items-center mt-6 border-t border-border/80 pt-4">
        <div className="flex items-center gap-1 text-text-secondary text-xs">
          {getStatusIcon(item.status)}
          <span className="capitalize">{item.status.replace('_', ' ')}</span>
        </div>
        
        <Link 
          href={`/dashboard/cases/${item.id}`}
          className="text-xs text-primary font-bold inline-flex items-center gap-0.5 hover:underline"
        >
          Open Case
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

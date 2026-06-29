"use client";

import { ShieldAlert, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';

interface ScamTypeBadgeProps {
  scamType: string;
  category: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

export default function ScamTypeBadge({ scamType, category, severity }: ScamTypeBadgeProps) {
  const getSeverityStyles = () => {
    switch (severity) {
      case 'Critical': 
        return {
          bg: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
          dot: 'bg-purple-500',
          icon: <Flame size={16} className="text-purple-600 dark:text-purple-400 animate-pulse" />
        };
      case 'High': 
        return {
          bg: 'bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30',
          dot: 'bg-red-500',
          icon: <ShieldAlert size={16} className="text-red-600 dark:text-red-400" />
        };
      case 'Medium': 
        return {
          bg: 'bg-orange-500/10 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30',
          dot: 'bg-orange-500',
          icon: <AlertTriangle size={16} className="text-orange-600 dark:text-orange-400" />
        };
      default: 
        return {
          bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-500',
          icon: <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
        };
    }
  };

  const styles = getSeverityStyles();
  
  // Pretty category formatter
  const getCategoryLabel = (cat: string) => {
    return cat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Category Tag */}
      <span className="px-3 py-1 rounded-lg bg-surface-elevated text-text-secondary text-xs font-semibold border border-border">
        {getCategoryLabel(category)}
      </span>

      {/* Severity Badge */}
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles.bg} ${severity === 'Critical' ? 'animate-pulse-critical' : ''}`}>
        {styles.icon}
        <span className="capitalize">{severity} Threat</span>
      </div>

      {/* Scam Name display */}
      <div className="w-full mt-1.5">
        <h4 className="text-xl md:text-2xl font-extrabold text-text-primary leading-tight font-sans">
          {scamType}
        </h4>
      </div>
    </div>
  );
}

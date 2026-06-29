"use client";

import { AlertCircle } from 'lucide-react';

interface RedFlagsListProps {
  flags: string[];
}

export default function RedFlagsList({ flags }: RedFlagsListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-1 rounded-md bg-red-500/10 text-red-500">
          <AlertCircle size={18} />
        </div>
        <h4 className="font-bold text-text-primary text-sm">Suspicious Red Flags Spotted</h4>
      </div>

      {flags.length === 0 ? (
        <p className="text-xs text-text-muted font-light pl-7">No specific structural red flags identified in text.</p>
      ) : (
        <ul className="space-y-2.5 pl-7 list-disc text-xs text-text-secondary font-light leading-relaxed">
          {flags.map((flag, idx) => (
            <li key={idx} className="marker:text-red-500">
              {flag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

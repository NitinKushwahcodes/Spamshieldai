"use client";

import { CheckSquare } from 'lucide-react';

interface ActionStepsListProps {
  steps: string[];
}

export default function ActionStepsList({ steps }: ActionStepsListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-1 rounded-md bg-primary/10 text-primary">
          <CheckSquare size={18} />
        </div>
        <h4 className="font-bold text-text-primary text-sm">Immediate Recovery Actions</h4>
      </div>

      {steps.length === 0 ? (
        <p className="text-xs text-text-muted font-light pl-7">No specific immediate steps registered.</p>
      ) : (
        <ol className="space-y-3 pl-2">
          {steps.map((step, idx) => (
            <li key={idx} className="flex gap-3 text-xs text-text-secondary font-light leading-relaxed">
              <span className="flex-shrink-0 w-5 h-5 rounded-md bg-surface-elevated text-text-primary border border-border flex items-center justify-center font-bold text-[10px]">
                {idx + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

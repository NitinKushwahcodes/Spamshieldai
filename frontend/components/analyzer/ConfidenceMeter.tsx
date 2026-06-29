"use client";

interface ConfidenceMeterProps {
  score: number;
  label: string;
}

export default function ConfidenceMeter({ score, label }: ConfidenceMeterProps) {
  // Determine meter line color based on score
  const getMeterColor = () => {
    if (score >= 90) return 'bg-red-500';
    if (score >= 70) return 'bg-orange-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-2 bg-surface-elevated/40 border border-border/80 p-4 rounded-xl">
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold text-text-secondary">AI Verdict Confidence</span>
        <span className="font-extrabold text-text-primary text-sm">{score}%</span>
      </div>
      
      {/* Progress Bar Container */}
      <div className="w-full h-3 rounded-full bg-border overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${getMeterColor()}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
      
      <p className="text-[10px] text-text-muted leading-relaxed font-light">
        ScamShield AI evaluated this input against known fraud templates. Indicator level: <strong className="text-text-primary font-semibold">{label}</strong>.
      </p>
    </div>
  );
}

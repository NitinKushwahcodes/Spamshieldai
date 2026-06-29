"use client";

import Link from 'next/link';
import ScamTypeBadge from './ScamTypeBadge';
import ConfidenceMeter from './ConfidenceMeter';
import RedFlagsList from './RedFlagsList';
import ActionStepsList from './ActionStepsList';
import { AnalysisResult as ResultType } from '../../types';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Scale, 
  FolderLock, 
  Files, 
  ClipboardCheck, 
  ArrowRight,
  Info
} from 'lucide-react';

interface AnalysisResultProps {
  result: ResultType;
  caseId: string | null;
}

export default function AnalysisResult({ result, caseId }: AnalysisResultProps) {
  const {
    is_scam,
    scam_type,
    scam_category,
    severity,
    confidence_score,
    confidence_label,
    how_it_works,
    red_flags,
    action_steps,
    relevant_law,
    evidence_to_collect,
    additional_note
  } = result;

  return (
    <div className="space-y-6 animate-slide-in">
      {/* 1. Large Threat Header banner */}
      {is_scam ? (
        <div className="p-4 md:p-6 rounded-2xl bg-red-600/10 border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center gap-4 glow-primary">
          <div className="p-3 bg-red-500 text-white rounded-xl flex-shrink-0 animate-pulse">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-red-500 uppercase tracking-wider">Scam Detected</h3>
            <p className="text-text-secondary text-xs mt-0.5 font-light">
              This message matches verified fraud profiles in India. Do NOT comply with any demands.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 md:p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 bg-emerald-500 text-white rounded-xl flex-shrink-0">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-emerald-500 uppercase tracking-wider">No Fraud Found</h3>
            <p className="text-text-secondary text-xs mt-0.5 font-light">
              This message appears to be safe or lacks core indicators of cyber scams. Exercise standard caution.
            </p>
          </div>
        </div>
      )}

      {/* Case Vault Link Banner */}
      {caseId && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <ClipboardCheck size={20} className="text-orange-500" />
            <div className="text-xs">
              <p className="font-bold">Case Record Logged!</p>
              <p className="text-slate-400 font-light mt-0.5">We created a secure checklist and case workspace for you.</p>
            </div>
          </div>
          <Link 
            href={`/dashboard/cases/${caseId}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-all"
          >
            Open Evidence Vault
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* 2. Dual Column Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 columns - Primary facts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 md:p-8 rounded-2xl bg-surface border border-border space-y-6">
            {/* Header Badge Row */}
            <ScamTypeBadge 
              scamType={scam_type}
              category={scam_category}
              severity={severity}
            />

            {/* How it works */}
            <div className="border-t border-border pt-5 space-y-2">
              <h4 className="font-bold text-text-primary text-sm">How This Scam Operates</h4>
              <p className="text-text-secondary text-xs font-light leading-relaxed">
                {how_it_works}
              </p>
            </div>

            {/* Relevant Indian Law */}
            <div className="border-t border-border pt-5 flex items-start gap-3 bg-surface-elevated/30 p-4 rounded-xl">
              <Scale size={20} className="text-text-secondary flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="font-bold text-text-primary text-xs">Applicable Law (India)</h5>
                <p className="text-text-secondary text-[11px] font-light leading-relaxed">
                  {relevant_law}
                </p>
              </div>
            </div>

            {/* Additional note */}
            {additional_note && (
              <div className="border-t border-border pt-5 flex items-start gap-2 text-text-muted">
                <Info size={14} className="flex-shrink-0 mt-0.5" />
                <p className="text-[10px] font-light leading-normal">{additional_note}</p>
              </div>
            )}
          </div>

          {/* Evidence Checklist info */}
          <div className="p-6 md:p-8 rounded-2xl bg-surface border border-border space-y-4">
            <div className="flex items-center gap-2">
              <FolderLock size={20} className="text-text-secondary" />
              <h4 className="font-bold text-text-primary text-sm">Required Forensic Evidence</h4>
            </div>
            <p className="text-text-secondary text-xs font-light leading-relaxed">
              If you intend to file a complaint, ensure you preserve these evidence items immediately:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pl-5 list-disc text-xs text-text-secondary font-light">
              {evidence_to_collect.map((item, idx) => (
                <li key={idx} className="marker:text-primary">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right column - Actions & Confidence */}
        <div className="space-y-6">
          {/* Confidence bar */}
          <ConfidenceMeter score={confidence_score} label={confidence_label} />

          {/* Action List */}
          <div className="p-6 rounded-2xl bg-surface border border-border">
            <ActionStepsList steps={action_steps} />
          </div>

          {/* Red Flags List */}
          <div className="p-6 rounded-2xl bg-surface border border-border">
            <RedFlagsList flags={red_flags} />
          </div>
        </div>

      </div>
    </div>
  );
}

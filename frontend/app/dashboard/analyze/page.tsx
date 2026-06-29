"use client";

import { useAnalyzer } from '../../../hooks/useAnalyzer';
import AnalyzerInput from '../../../components/analyzer/AnalyzerInput';
import AnalysisResult from '../../../components/analyzer/AnalysisResult';
import { SearchCode, RefreshCw, Loader2 } from 'lucide-react';

export default function AnalyzePage() {
  const { analyze, clearResult, loading, result, caseId, error } = useAnalyzer();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">
            AI Scam Analyzer
          </h2>
          <p className="text-text-secondary text-sm font-light mt-1">
            Check messages against 100+ scam profiles to determine risk levels and recovery checklists.
          </p>
        </div>

        {/* Clear / scan another button if result exists */}
        {result && (
          <button
            onClick={clearResult}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors focus:outline-none"
          >
            <RefreshCw size={14} />
            Scan Another Message
          </button>
        )}
      </div>

      {/* Main layout */}
      <div className="max-w-5xl mx-auto">
        {/* Loading Spinner during analysis */}
        {loading && (
          <div className="p-16 text-center bg-surface border border-border rounded-2xl flex flex-col justify-center items-center space-y-4">
            <Loader2 size={36} className="animate-spin text-primary" />
            <div>
              <p className="text-sm font-bold text-text-primary">AI Scam Engines Running...</p>
              <p className="text-xs text-text-secondary font-light mt-1">
                Comparing text metrics with database profiles, red flag lists, and legal codes.
              </p>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && !loading && (
          <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm mb-6 flex flex-col gap-2">
            <p className="font-bold">Analysis Failed</p>
            <p className="text-xs font-light">{error}</p>
            <button 
              onClick={clearResult}
              className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-semibold w-fit mt-2 focus:outline-none"
            >
              Retry
            </button>
          </div>
        )}

        {/* Analyzer Input (if no results loaded yet) */}
        {!loading && !result && !error && (
          <AnalyzerInput onAnalyze={analyze} loading={loading} />
        )}

        {/* Analysis Result (if loaded successfully) */}
        {!loading && result && (
          <AnalysisResult result={result} caseId={caseId} />
        )}
      </div>
    </div>
  );
}

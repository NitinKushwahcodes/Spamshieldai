"use client";

import { useState } from 'react';
import { AnalysisResult } from '../types';
import { analyzeMessage } from '../lib/api';

export const useAnalyzer = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (message: string, saveCase: boolean) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setCaseId(null);

    try {
      const response = await analyzeMessage(message, saveCase);
      if (response.success && response.analysis) {
        setResult(response.analysis);
        setCaseId(response.case_id);
      } else {
        setError('Analysis returned unsuccessful status');
      }
    } catch (err: any) {
      console.error('[useAnalyzer] Error during execution:', err);
      setError(err.response?.data?.message || 'Failed to analyze message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setCaseId(null);
    setError(null);
  };

  return {
    analyze,
    clearResult,
    loading,
    result,
    caseId,
    error,
  };
};

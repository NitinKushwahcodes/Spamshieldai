"use client";

import { useState } from 'react';
import { SearchCode, Loader2 } from 'lucide-react';

interface AnalyzerInputProps {
  onAnalyze: (message: string, saveCase: boolean) => void;
  loading: boolean;
}

export default function AnalyzerInput({ onAnalyze, loading }: AnalyzerInputProps) {
  const [text, setText] = useState('');
  const [saveCase, setSaveCase] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = text.trim();
    if (!trimmed) {
      setError('Please paste a suspicious message or call transcript first.');
      return;
    }

    if (trimmed.length < 10) {
      setError('Please provide at least 10 characters to perform a valid scam analysis.');
      return;
    }

    onAnalyze(trimmed, saveCase);
  };

  return (
    <div className="bg-surface border border-border p-6 md:p-8 rounded-2xl shadow-sm space-y-6 transition-colors">
      <div>
        <h3 className="text-lg font-bold text-text-primary mb-1">Incident Intake Portal</h3>
        <p className="text-text-secondary text-xs font-light">
          Copy and paste the exact message content, link description, or call dialog here.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (error) setError(null);
            }}
            disabled={loading}
            placeholder="Example: Congratulations! You have won a lottery of ₹25 Lakhs from Kaun Banega Crorepati. To claim your prize money in your bank account, call our RBI manager Mr. Sharma at +91-9988776655 immediately. Charges apply..."
            rows={6}
            className="w-full p-4 rounded-xl bg-surface-elevated border border-border text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors resize-y leading-relaxed font-light"
          />
          <div className="flex justify-between items-center mt-2 text-[10px] text-text-muted">
            <span>Character Count: {text.length}</span>
            <span>Minimum 10 characters required</span>
          </div>
          {error && (
            <p className="text-red-500 text-xs font-semibold mt-2">{error}</p>
          )}
        </div>

        {/* Save case toggle */}
        <div className="flex items-center gap-2.5 bg-surface-elevated/40 border border-border/60 p-3 rounded-xl w-fit">
          <input
            type="checkbox"
            id="saveCase"
            checked={saveCase}
            onChange={(e) => setSaveCase(e.target.checked)}
            disabled={loading}
            className="w-4 h-4 rounded text-primary focus:ring-primary border-border bg-surface cursor-pointer"
          />
          <label htmlFor="saveCase" className="text-xs text-text-secondary font-semibold cursor-pointer select-none">
            Save analysis log to Case History
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all shadow-md shadow-red-500/10 hover:shadow-red-500/25 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              AI Fraud Engines Evaluating...
            </>
          ) : (
            <>
              <SearchCode size={18} />
              Run Scam Diagnostics
            </>
          )}
        </button>
      </form>
    </div>
  );
}

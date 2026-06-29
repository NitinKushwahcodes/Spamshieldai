"use client";

import { useState, useEffect } from 'react';
import { DocumentDetail } from '../../types';
import { Copy, Check, Printer, FileEdit, AlertCircle } from 'lucide-react';

interface DocumentViewerProps {
  document: DocumentDetail;
}

export default function DocumentViewer({ document: docDetail }: DocumentViewerProps) {
  const [placeholders, setPlaceholders] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  // Initialize placeholder keys
  useEffect(() => {
    const initial: Record<string, string> = {};
    docDetail.placeholders.forEach((key) => {
      initial[key] = '';
    });
    setPlaceholders(initial);
  }, [docDetail]);

  const handleInputChange = (key: string, value: string) => {
    setPlaceholders((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Compile final document text by replacing placeholders in real time
  const getCompiledText = (isForClipboard = false) => {
    let text = docDetail.content;
    Object.entries(placeholders).forEach(([key, val]) => {
      const regex = new RegExp(`\\[${key}\\]`, 'g');
      if (isForClipboard) {
        text = text.replace(regex, val.trim() || `[${key}]`);
      } else {
        // Wrap in HTML formatting for visual highlight
        const highlight = val.trim() 
          ? `<span class="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-1 rounded font-semibold underline decoration-dotted">${val}</span>`
          : `<span class="bg-red-100 text-red-700 font-bold px-1 rounded border border-red-200 animate-pulse">[${key}]</span>`;
        text = text.replace(regex, highlight);
      }
    });
    return text;
  };

  const handleCopy = async () => {
    const rawText = getCompiledText(true);
    try {
      await navigator.clipboard.writeText(rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handlePrint = () => {
    // Basic browser printing handler
    window.print();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      {/* Left side Form: Placeholders input */}
      <div className="p-6 rounded-2xl bg-surface border border-border space-y-6">
        <div className="flex items-center gap-2">
          <FileEdit size={18} className="text-primary" />
          <h3 className="text-sm font-bold text-text-primary">Complete Placeholders</h3>
        </div>
        
        {docDetail.placeholders.length === 0 ? (
          <div className="p-4 rounded-xl bg-surface-elevated/40 text-center text-xs text-text-secondary leading-relaxed font-light">
            No input placeholders detected. The document is fully completed.
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-text-secondary text-xs font-light leading-relaxed">
              Fill out the details below. Brackets in the document will update in real time.
            </p>
            
            {docDetail.placeholders.map((key) => (
              <div key={key} className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider pl-1">
                  {key.replace(/_/g, ' ')}
                </label>
                <input
                  type="text"
                  value={placeholders[key] || ''}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  placeholder={`Enter ${key.toLowerCase().replace(/_/g, ' ')}`}
                  className="w-full px-3.5 py-2 bg-surface-elevated border border-border rounded-xl text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50"
                />
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-start gap-2 bg-amber-500/5 border border-amber-500/10 p-3.5 rounded-xl text-text-secondary">
          <AlertCircle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] font-light leading-normal">
            Verify all information prior to submission. Print or copy the document to paste directly into your bank portal or the cybercell website.
          </p>
        </div>
      </div>

      {/* Right side Document: Paper preview */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* Document Action top bar */}
        <div className="flex justify-between items-center bg-surface border border-border p-3 rounded-2xl">
          <span className="text-xs font-bold text-text-primary px-3">
            Preview Letter
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-elevated hover:bg-border text-xs font-semibold text-text-secondary hover:text-text-primary border border-border transition-colors focus:outline-none"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy Text
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-xs font-semibold text-white transition-colors focus:outline-none shadow-sm shadow-red-500/10"
            >
              <Printer size={14} />
              Print File
            </button>
          </div>
        </div>

        {/* Paper Sheet Document Body */}
        <div className="p-8 md:p-12 rounded-2xl bg-white border border-slate-200 shadow-xl text-slate-800 font-serif leading-relaxed text-sm min-h-[600px] overflow-hidden whitespace-pre-wrap select-text">
          <h2 className="text-center font-bold text-base mb-6 text-slate-900 border-b pb-4">
            {docDetail.title.toUpperCase()}
          </h2>
          
          {/* Dynamic HTML rendering with styled placeholders */}
          <div 
            dangerouslySetInnerHTML={{ __html: getCompiledText() }} 
            className="prose prose-slate max-w-none text-xs md:text-sm font-sans"
          />
        </div>

      </div>

    </div>
  );
}

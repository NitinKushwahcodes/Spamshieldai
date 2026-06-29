"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchCases } from '../../../lib/api';
import { Case } from '../../../types';
import CaseCard from '../../../components/cases/CaseCard';
import { FolderOpen, SearchCode, Loader2, ShieldAlert } from 'lucide-react';

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await fetchCases();
      if (res.success) {
        setCases(res.cases);
      }
    } catch (err) {
      console.error('Failed to load cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">
            Cases Vault
          </h2>
          <p className="text-text-secondary text-sm font-light mt-1">
            Browse and manage logged incident records and evidence vaults.
          </p>
        </div>
        
        <Link 
          href="/dashboard/analyze" 
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-red-500/10 focus:outline-none w-full sm:w-auto text-center"
        >
          <SearchCode size={16} />
          New Scan
        </Link>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="p-16 text-center flex justify-center">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : cases.length === 0 ? (
        <div className="p-16 text-center bg-surface border border-border rounded-2xl max-w-2xl mx-auto">
          <FolderOpen size={48} className="mx-auto mb-4 text-text-muted" />
          <h3 className="text-base font-bold text-text-primary">No Incident Log Found</h3>
          <p className="text-text-secondary text-xs font-light mt-2 max-w-md mx-auto leading-relaxed">
            You don't have any saved cases. Start by copy-pasting a message in our scam analyzer and checking the "Save to cases history" option.
          </p>
          <Link 
            href="/dashboard/analyze"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 mt-5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover shadow-sm"
          >
            Go to AI Analyzer
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((item) => (
            <CaseCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

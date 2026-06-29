"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchCaseDetail, deleteCase, generateDocument } from '../../../../lib/api';
import { Case, EvidenceItem, DocumentInfo } from '../../../../types';
import EvidenceChecklist from '../../../../components/cases/EvidenceChecklist';
import { 
  Loader2, 
  Trash2, 
  ArrowLeft, 
  Scale, 
  FileText, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  AlertTriangle
} from 'lucide-react';

export default function CaseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const caseId = params.id as string;

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadCaseData = async () => {
    try {
      const res = await fetchCaseDetail(caseId);
      if (res.success && res.case) {
        setCaseData(res.case);
        setEvidenceItems(res.case.evidence_items || []);
        setDocuments(res.case.documents || []);
      }
    } catch (err) {
      console.error('Failed to load case detail:', err);
      router.push('/dashboard/cases');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (caseId) {
      loadCaseData();
    }
  }, [caseId]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this case? This action is irreversible.')) {
      return;
    }
    setActionLoading('delete');
    try {
      const res = await deleteCase(caseId);
      if (res.success) {
        router.push('/dashboard/cases');
      }
    } catch (err) {
      console.error('Failed to delete case:', err);
      alert('Delete failed. Please try again.');
      setActionLoading(null);
    }
  };

  const handleGenerateDoc = async (type: string) => {
    setActionLoading(type);
    try {
      const res = await generateDocument(caseId, type);
      if (res.success && res.document) {
        // Reload details to update document list
        await loadCaseData();
        // Redirect directly to document editor
        router.push(`/dashboard/documents?id=${res.document.id}`);
      }
    } catch (err) {
      console.error('Failed to generate document:', err);
      alert('AI document generation failed. Please retry.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading || !caseData) {
    return (
      <div className="p-16 text-center flex justify-center">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  const getSeverityClass = (sev: string) => {
    switch (sev) {
      case 'Critical': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20';
      case 'High': return 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20';
      case 'Medium': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20';
      default: return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
    }
  };

  // Check if specific documents are already generated
  const hasDoc = (type: string) => documents.find(d => d.doc_type === type);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Navigation / Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link 
          href="/dashboard/cases" 
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors focus:outline-none w-fit"
        >
          <ArrowLeft size={16} />
          Back to Cases
        </Link>

        <button
          onClick={handleDelete}
          disabled={actionLoading === 'delete'}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs font-semibold focus:outline-none disabled:opacity-50 w-full sm:w-auto"
        >
          {actionLoading === 'delete' ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          Delete Incident Log
        </button>
      </div>

      {/* Case Details Header banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-surface border border-border flex flex-col md:flex-row md:items-center md:justify-between gap-6 transition-colors">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-lg bg-surface-elevated text-text-secondary text-[10px] font-bold border border-border">
              {caseData.scam_category.replace('_', ' ').toUpperCase()}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${getSeverityClass(caseData.severity)}`}>
              {caseData.severity}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-text-primary leading-tight font-sans">
            {caseData.scam_type}
          </h2>
          <p className="text-[10px] text-text-muted font-light">
            Logged on: {new Date(caseData.created_at).toLocaleString('en-IN', {
              day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-elevated border border-border w-fit">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <div className="text-xs">
            <p className="font-bold capitalize">{caseData.status.replace('_', ' ')}</p>
            <p className="text-[10px] text-text-muted mt-0.5 font-light">Current Case Status</p>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 spans) - Original content, checklist, laws */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Original Message */}
          <div className="p-6 md:p-8 rounded-2xl bg-surface border border-border space-y-3">
            <h3 className="text-sm font-bold text-text-primary">Accused Message Content</h3>
            <p className="text-text-secondary text-xs leading-relaxed font-light italic bg-surface-elevated/40 p-4 rounded-xl border border-border/50">
              "{caseData.original_message}"
            </p>
          </div>

          {/* Legal references */}
          <div className="p-6 rounded-2xl bg-surface border border-border flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary flex-shrink-0 mt-0.5">
              <Scale size={20} />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-text-primary text-sm">Relevant Indian Codes</h4>
              <p className="text-text-secondary text-xs leading-relaxed font-light">
                {caseData.relevant_law}
              </p>
            </div>
          </div>

          {/* Evidence Checklist component */}
          <EvidenceChecklist 
            caseId={caseId} 
            initialItems={evidenceItems} 
            onUpdate={loadCaseData} 
          />

        </div>

        {/* Right Column (1 span) - Actions & Documents */}
        <div className="space-y-6">
          
          {/* Actions steps */}
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <h3 className="text-sm font-bold text-text-primary">Action Blueprint</h3>
            <div className="space-y-3">
              {caseData.action_steps.map((step, idx) => (
                <div key={idx} className="flex gap-2.5 text-xs text-text-secondary font-light">
                  <span className="flex-shrink-0 w-5 h-5 rounded-md bg-surface-elevated text-text-primary border border-border flex items-center justify-center font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Documents Generator card */}
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-5">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Grievance Document Vault</h3>
              <p className="text-text-secondary text-[11px] font-light mt-0.5">
                Generate dynamic legal reports tailored to this incident.
              </p>
            </div>

            <div className="space-y-3.5">
              
              {/* Document 1: Cybercell */}
              <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border/80 bg-surface-elevated/20">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-text-primary truncate">Cybercrime Complaint</p>
                  <p className="text-[10px] text-text-muted font-light mt-0.5">cybercrime.gov.in format</p>
                </div>
                {hasDoc('cybercrime_complaint') ? (
                  <Link 
                    href={`/dashboard/documents?id=${hasDoc('cybercrime_complaint')?.id}`}
                    className="flex-shrink-0 px-3 py-1.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-[10px] font-bold rounded-lg transition-colors"
                  >
                    View Complaint
                  </Link>
                ) : (
                  <button
                    onClick={() => handleGenerateDoc('cybercrime_complaint')}
                    disabled={actionLoading !== null}
                    className="flex-shrink-0 px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-[10px] font-bold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {actionLoading === 'cybercrime_complaint' ? <Loader2 size={10} className="animate-spin" /> : <Plus size={10} className="inline mr-0.5" />}
                    Build
                  </button>
                )}
              </div>

              {/* Document 2: Bank reversal */}
              <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border/80 bg-surface-elevated/20">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-text-primary truncate">Bank Reversal Request</p>
                  <p className="text-[10px] text-text-muted font-light mt-0.5">Freeze beneficiary account</p>
                </div>
                {hasDoc('bank_freeze_letter') ? (
                  <Link 
                    href={`/dashboard/documents?id=${hasDoc('bank_freeze_letter')?.id}`}
                    className="flex-shrink-0 px-3 py-1.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-[10px] font-bold rounded-lg transition-colors"
                  >
                    View Request
                  </Link>
                ) : (
                  <button
                    onClick={() => handleGenerateDoc('bank_freeze_letter')}
                    disabled={actionLoading !== null}
                    className="flex-shrink-0 px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-[10px] font-bold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {actionLoading === 'bank_freeze_letter' ? <Loader2 size={10} className="animate-spin" /> : <Plus size={10} className="inline mr-0.5" />}
                    Build
                  </button>
                )}
              </div>

              {/* Document 3: Consumer Court */}
              <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border/80 bg-surface-elevated/20">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-text-primary truncate">Consumer Dispute Sheet</p>
                  <p className="text-[10px] text-text-muted font-light mt-0.5">Redressal commission filing</p>
                </div>
                {hasDoc('consumer_complaint') ? (
                  <Link 
                    href={`/dashboard/documents?id=${hasDoc('consumer_complaint')?.id}`}
                    className="flex-shrink-0 px-3 py-1.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-[10px] font-bold rounded-lg transition-colors"
                  >
                    View Dispute
                  </Link>
                ) : (
                  <button
                    onClick={() => handleGenerateDoc('consumer_complaint')}
                    disabled={actionLoading !== null}
                    className="flex-shrink-0 px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-[10px] font-bold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {actionLoading === 'consumer_complaint' ? <Loader2 size={10} className="animate-spin" /> : <Plus size={10} className="inline mr-0.5" />}
                    Build
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

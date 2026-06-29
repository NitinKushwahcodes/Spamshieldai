"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { fetchDocuments, fetchDocumentDetail } from '../../../lib/api';
import { DocumentInfo, DocumentDetail } from '../../../types';
import DocumentCard from '../../../components/documents/DocumentCard';
import DocumentViewer from '../../../components/documents/DocumentViewer';
import { FileText, FolderOpen, ArrowLeft, Loader2, PlusCircle } from 'lucide-react';

function DocumentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeDocId = searchParams.get('id');

  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [activeDoc, setActiveDoc] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewerLoading, setViewerLoading] = useState(false);

  // Load lists of documents
  const loadDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetchDocuments();
      if (res.success) {
        setDocuments(res.documents);
      }
    } catch (err) {
      console.error('Failed to load documents list:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load details of active document
  const loadActiveDoc = async (id: string) => {
    setViewerLoading(true);
    try {
      const res = await fetchDocumentDetail(id);
      if (res.success && res.document) {
        setActiveDoc(res.document);
      }
    } catch (err) {
      console.error('Failed to load document detail:', err);
      setActiveDoc(null);
      // Clean query parameter on error
      router.push('/dashboard/documents');
    } finally {
      setViewerLoading(false);
    }
  };

  useEffect(() => {
    if (activeDocId) {
      loadActiveDoc(activeDocId);
    } else {
      setActiveDoc(null);
      loadDocuments();
    }
  }, [activeDocId]);

  const handleSelectDoc = (id: string) => {
    router.push(`/dashboard/documents?id=${id}`);
  };

  const handleBackToList = () => {
    router.push('/dashboard/documents');
  };

  if (activeDocId && (viewerLoading || !activeDoc)) {
    return (
      <div className="p-16 text-center flex justify-center">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  if (activeDocId && activeDoc) {
    return (
      <div className="space-y-8 animate-fade-in">
        {/* Back navigation header */}
        <div>
          <button
            onClick={handleBackToList}
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
          >
            <ArrowLeft size={16} />
            Back to Documents List
          </button>
        </div>

        {/* Viewer Component */}
        <DocumentViewer document={activeDoc} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">
          Legal Documents Vault
        </h2>
        <p className="text-text-secondary text-sm font-light mt-1">
          Access all generated official complaint letters, bank freeze sheets, and consumer filings.
        </p>
      </div>

      {/* Main Content list */}
      {loading ? (
        <div className="p-16 text-center flex justify-center">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : documents.length === 0 ? (
        <div className="p-16 text-center bg-surface border border-border rounded-2xl max-w-2xl mx-auto">
          <FolderOpen size={48} className="mx-auto mb-4 text-text-muted" />
          <h3 className="text-base font-bold text-text-primary">No Documents Generated</h3>
          <p className="text-text-secondary text-xs font-light mt-2 max-w-md mx-auto leading-relaxed">
            You haven't generated any legal documents yet. Documents are created inside specific cases.
          </p>
          <Link 
            href="/dashboard/cases"
            className="inline-flex items-center gap-1.5 px-4 py-2 mt-5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover shadow-sm"
          >
            Go to Cases Vault
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((item) => (
            <DocumentCard key={item.id} item={item} onSelect={handleSelectDoc} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <Suspense fallback={
      <div className="p-16 text-center flex justify-center">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    }>
      <DocumentsContent />
    </Suspense>
  );
}

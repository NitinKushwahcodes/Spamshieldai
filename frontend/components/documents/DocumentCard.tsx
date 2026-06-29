"use client";

import { DocumentInfo } from '../../types';
import { FileText, Calendar, ArrowRight } from 'lucide-react';

interface DocumentCardProps {
  item: DocumentInfo;
  onSelect: (id: string) => void;
}

export default function DocumentCard({ item, onSelect }: DocumentCardProps) {
  const getDocTypeLabel = (type: string) => {
    switch (type) {
      case 'cybercrime_complaint': return 'Cybercrime Portal Complaint';
      case 'bank_freeze_letter': return 'Bank Freeze Letter';
      case 'consumer_complaint': return 'Consumer Forum Grievance';
      default: return 'Legal Notice';
    }
  };

  return (
    <div 
      onClick={() => onSelect(item.id)}
      className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between hover:shadow-md cursor-pointer transition-all hover:-translate-y-0.5 group"
    >
      <div>
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
          <FileText size={20} />
        </div>

        <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">
          {getDocTypeLabel(item.doc_type)}
        </span>

        <h4 className="text-sm font-bold text-text-primary mt-1.5 line-clamp-1 leading-snug group-hover:text-primary transition-colors">
          {item.title}
        </h4>
      </div>

      <div className="flex justify-between items-center mt-6 border-t border-border/60 pt-4 text-[10px] text-text-muted font-light">
        <span className="inline-flex items-center gap-1">
          <Calendar size={12} />
          {new Date(item.created_at).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </span>

        <span className="text-primary font-bold inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
          Edit File
          <ArrowRight size={12} />
        </span>
      </div>
    </div>
  );
}

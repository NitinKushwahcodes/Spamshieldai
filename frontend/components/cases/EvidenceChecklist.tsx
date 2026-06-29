"use client";

import { useState } from 'react';
import { updateEvidenceItem } from '../../lib/api';
import { EvidenceItem } from '../../types';
import { Loader2, PlusCircle, CheckCircle, FileText, CheckCircle2, Circle } from 'lucide-react';

interface EvidenceChecklistProps {
  caseId: string;
  initialItems: EvidenceItem[];
  onUpdate: () => void;
}

export default function EvidenceChecklist({ caseId, initialItems, onUpdate }: EvidenceChecklistProps) {
  const [items, setItems] = useState<EvidenceItem[]>(initialItems);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  const handleToggle = async (itemId: string, currentStatus: boolean) => {
    setUpdatingId(itemId);
    const newStatus = !currentStatus;

    // Optimistic UI update
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, is_collected: newStatus } : item
    ));

    try {
      const res = await updateEvidenceItem(caseId, itemId, newStatus);
      if (res.success) {
        onUpdate();
      }
    } catch (err) {
      console.error('Failed to update evidence status:', err);
      // Revert optimistic update on failure
      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, is_collected: currentStatus } : item
      ));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStartEditingNotes = (itemId: string, currentNotes: string) => {
    setEditingNotesId(itemId);
    setTempNotes(currentNotes || '');
  };

  const handleSaveNotes = async (itemId: string, isCollected: boolean) => {
    setUpdatingId(itemId);
    try {
      const res = await updateEvidenceItem(caseId, itemId, isCollected, tempNotes);
      if (res.success) {
        setItems(prev => prev.map(item => 
          item.id === itemId ? { ...item, notes: tempNotes } : item
        ));
        setEditingNotesId(null);
        onUpdate();
      }
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 md:p-8 space-y-6">
      <div>
        <h3 className="text-base font-bold text-text-primary">Evidence Vault Checklist</h3>
        <p className="text-text-secondary text-xs font-light mt-0.5">
          Mark collected forensic items to build a strong complaint case file.
        </p>
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-6 font-light">No evidence items specified for this case.</p>
        ) : (
          items.map((item) => {
            const isEditingNotes = editingNotesId === item.id;
            const isUpdating = updatingId === item.id;

            return (
              <div 
                key={item.id} 
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  item.is_collected 
                    ? 'bg-emerald-500/[0.03] border-emerald-500/20' 
                    : 'bg-surface border-border hover:border-border/80'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left Side Checkbox and title */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => !isUpdating && handleToggle(item.id, item.is_collected)}
                      disabled={isUpdating}
                      className="mt-0.5 flex-shrink-0 text-text-secondary hover:text-text-primary focus:outline-none disabled:opacity-50"
                    >
                      {isUpdating && updatingId === item.id ? (
                        <Loader2 size={18} className="animate-spin text-primary" />
                      ) : item.is_collected ? (
                        <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-500/10" />
                      ) : (
                        <Circle size={18} className="text-text-muted" />
                      )}
                    </button>
                    
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold text-text-primary ${item.is_collected ? 'line-through text-text-muted' : ''}`}>
                        {item.item_name}
                      </p>
                      {item.notes && !isEditingNotes && (
                        <p className="text-[10px] text-text-secondary italic mt-1 bg-surface-elevated/40 px-2 py-1 rounded border border-border/30 w-fit leading-relaxed font-light">
                          Note: {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Side note trigger button */}
                  {!isEditingNotes && (
                    <button
                      onClick={() => handleStartEditingNotes(item.id, item.notes || '')}
                      className="flex-shrink-0 text-[10px] font-bold text-text-secondary hover:text-text-primary hover:underline flex items-center gap-1 focus:outline-none"
                    >
                      <FileText size={12} />
                      {item.notes ? 'Edit Note' : 'Add Note'}
                    </button>
                  )}
                </div>

                {/* Notes editing block */}
                {isEditingNotes && (
                  <div className="mt-4 pl-7 space-y-2 border-t border-dashed border-border/80 pt-3 animate-slide-in">
                    <textarea
                      value={tempNotes}
                      onChange={(e) => setTempNotes(e.target.value)}
                      placeholder="Add transaction IDs, screenshot dates, file locations..."
                      rows={2}
                      className="w-full p-2.5 bg-surface-elevated border border-border rounded-lg text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50 font-light resize-y"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setEditingNotesId(null)}
                        className="px-2.5 py-1 text-[10px] font-semibold text-text-secondary hover:bg-surface-elevated rounded border border-border focus:outline-none"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveNotes(item.id, item.is_collected)}
                        disabled={isUpdating}
                        className="px-2.5 py-1 text-[10px] font-semibold bg-primary hover:bg-primary-hover text-white rounded shadow-sm focus:outline-none inline-flex items-center gap-1 disabled:opacity-50"
                      >
                        {isUpdating && <Loader2 size={10} className="animate-spin" />}
                        Save Note
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchCases } from '../../lib/api';
import { Case } from '../../types';
import { 
  ShieldAlert, 
  SearchCode, 
  Database, 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FolderOpen,
  ArrowRight,
  Loader2
} from 'lucide-react';

export default function DashboardHome() {
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

  // Compute stat counters
  const totalCount = cases.length;
  const activeCount = cases.filter(c => c.status === 'reported' || c.status === 'in_progress').length;
  const resolvedCount = cases.filter(c => c.status === 'resolved').length;
  const actionRequiredCount = cases.filter(c => c.severity === 'Critical' || c.severity === 'High').length;

  const getSeverityClass = (sev: string) => {
    switch (sev) {
      case 'Critical': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20';
      case 'High': return 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20';
      case 'Medium': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20';
      case 'Low': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
      default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'in_progress': return <Clock size={16} className="text-orange-500" />;
      default: return <AlertCircle size={16} className="text-red-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Upper header action row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">
            Security Dashboard
          </h2>
          <p className="text-text-secondary text-sm font-light mt-1">
            Monitor and manage active digital threat responses.
          </p>
        </div>
        
        <Link 
          href="/dashboard/analyze" 
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-red-500/10 hover:shadow-red-500/25 w-full sm:w-auto"
        >
          <Plus size={16} />
          New Scam Analysis
        </Link>
      </div>

      {/* Counters Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Total Incidents</span>
          <span className="text-3xl font-extrabold text-text-primary mt-2">{totalCount}</span>
        </div>
        <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Active Responses</span>
          <span className="text-3xl font-extrabold text-red-500 mt-2">{activeCount}</span>
        </div>
        <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Action Needed</span>
          <span className="text-3xl font-extrabold text-orange-500 mt-2">{actionRequiredCount}</span>
        </div>
        <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Cases Resolved</span>
          <span className="text-3xl font-extrabold text-emerald-500 mt-2">{resolvedCount}</span>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
              <SearchCode size={20} />
            </div>
            <h3 className="text-base font-bold text-text-primary mb-1">Scam Scanner</h3>
            <p className="text-text-secondary text-xs font-light leading-relaxed mb-4">
              Instantly analyze suspicious messages or URLs to verify danger levels.
            </p>
          </div>
          <Link href="/dashboard/analyze" className="text-primary text-xs font-semibold inline-flex items-center gap-1 hover:underline">
            Open Analyzer <ArrowRight size={14} />
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center mb-4">
              <Database size={20} />
            </div>
            <h3 className="text-base font-bold text-text-primary mb-1">Scam Registry</h3>
            <p className="text-text-secondary text-xs font-light leading-relaxed mb-4">
              Search coordinates and check counts of crowdsourced reported scam numbers.
            </p>
          </div>
          <Link href="/dashboard/community" className="text-violet-500 text-xs font-semibold inline-flex items-center gap-1 hover:underline">
            Check Registry <ArrowRight size={14} />
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
              <FileText size={20} />
            </div>
            <h3 className="text-base font-bold text-text-primary mb-1">Legal Documents</h3>
            <p className="text-text-secondary text-xs font-light leading-relaxed mb-4">
              Retrieve or complete bank reversals, cyber portal letters, and complaints.
            </p>
          </div>
          <Link href="/dashboard/documents" className="text-accent text-xs font-semibold inline-flex items-center gap-1 hover:underline">
            View Documents <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Recent Incidents Table */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-text-primary">Recent Incident Records</h3>
            <p className="text-text-secondary text-xs font-light mt-0.5">Logs of recently filed AI analyses.</p>
          </div>
          <Link href="/dashboard/cases" className="text-xs text-text-secondary hover:text-text-primary font-semibold underline">
            View All Cases
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-text-secondary flex justify-center">
            <Loader2 className="animate-spin text-primary" size={24} />
          </div>
        ) : cases.length === 0 ? (
          <div className="p-12 text-center text-text-secondary">
            <FolderOpen size={48} className="mx-auto mb-4 text-text-muted" />
            <p className="text-sm font-semibold">No active cases registered</p>
            <p className="text-xs font-light text-text-muted mt-1 max-w-sm mx-auto">
              Any scam analyses you perform with the "Save to cases" check enabled will appear here.
            </p>
            <Link 
              href="/dashboard/analyze"
              className="inline-flex items-center gap-1.5 px-4 py-2 mt-4 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover"
            >
              Analyze Message
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-surface-elevated/50 text-text-secondary text-xs uppercase font-bold border-b border-border">
                  <th className="px-6 py-4">Scam Type</th>
                  <th className="px-6 py-4">Date Logged</th>
                  <th className="px-6 py-4">Severity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cases.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-surface-elevated/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-text-primary max-w-xs truncate">
                      {item.scam_type}
                    </td>
                    <td className="px-6 py-4 text-text-secondary text-xs font-light">
                      {new Date(item.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getSeverityClass(item.severity)}`}>
                        {item.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-1.5 text-text-secondary font-medium">
                      {getStatusIcon(item.status)}
                      <span className="capitalize text-xs">
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/dashboard/cases/${item.id}`}
                        className="text-xs text-primary font-bold hover:underline"
                      >
                        Investigate
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

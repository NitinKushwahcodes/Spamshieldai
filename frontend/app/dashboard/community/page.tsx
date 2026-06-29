"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { fetchCommunityReports, createCommunityReport } from '../../../lib/api';
import { CommunityReport } from '../../../types';
import ScamReportCard from '../../../components/community/ScamReportCard';
import CommunityFilter from '../../../components/community/CommunityFilter';
import { SCAM_DATABASE } from '../../../lib/scamPrompts';
import { Loader2, Plus, Users, X, Info } from 'lucide-react';

const reportSchema = zod.object({
  scam_type: zod.string().min(1, 'Please select a scam type'),
  scam_category: zod.string().min(1, 'Please select a category'),
  reported_number: zod.string().optional(),
  reported_url: zod.string().optional(),
  description: zod.string().min(10, 'Description must be at least 10 characters'),
  city: zod.string().min(2, 'City is required'),
  state: zod.string().min(2, 'State is required'),
}).refine(data => data.reported_number || data.reported_url, {
  message: 'Either Phone Number or Website URL must be reported',
  path: ['reported_number']
});

type ReportFormValues = zod.infer<typeof reportSchema>;

export default function CommunityPage() {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Filters state
  const [filterType, setFilterType] = useState('');
  const [filterCity, setFilterCity] = useState('');

  const {
    register: formRegister,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      scam_type: '',
      scam_category: '',
      reported_number: '',
      reported_url: '',
      description: '',
      city: '',
      state: '',
    }
  });

  const loadReports = async (type = '', city = '') => {
    setLoading(true);
    try {
      const res = await fetchCommunityReports(type, city);
      if (res.success) {
        setReports(res.reports);
      }
    } catch (err) {
      console.error('Failed to load community reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleFilter = (type: string, city: string) => {
    setFilterType(type);
    setFilterCity(city);
    loadReports(type, city);
  };

  // Watch category to populate corresponding scam types dynamically
  const selectedCategory = watch('scam_category');

  const onSubmitReport = async (values: ReportFormValues) => {
    setSubmitError(null);
    try {
      const res = await createCommunityReport(values);
      if (res.success) {
        setModalOpen(false);
        reset();
        loadReports(filterType, filterCity);
      }
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Failed to submit report. Please retry.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">
            Community Scam Database
          </h2>
          <p className="text-text-secondary text-sm font-light mt-1">
            Crowdsourced registry of reported fraud phone numbers and suspicious links in India.
          </p>
        </div>
        
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-red-500/10 focus:outline-none w-full sm:w-auto"
        >
          <Plus size={16} />
          Report Phone / Link
        </button>
      </div>

      {/* Filter panel */}
      <CommunityFilter onFilter={handleFilter} />

      {/* Database reports listing */}
      {loading ? (
        <div className="p-16 text-center flex justify-center">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : reports.length === 0 ? (
        <div className="p-16 text-center bg-surface border border-border rounded-2xl max-w-2xl mx-auto">
          <Users size={48} className="mx-auto mb-4 text-text-muted" />
          <h3 className="text-base font-bold text-text-primary font-sans">No Scam Records Found</h3>
          <p className="text-text-secondary text-xs font-light mt-2 max-w-md mx-auto leading-relaxed">
            No crowdsourced reports match the filter keywords. Reset your search or file a new report if you encountered a suspicious pattern.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((item) => (
            <ScamReportCard key={item.id} report={item} />
          ))}
        </div>
      )}

      {/* Report Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop mask */}
          <div 
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          ></div>

          {/* Form Content card */}
          <div className="bg-surface border border-border rounded-2xl w-full max-w-lg p-6 relative z-10 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            
            {/* Close button */}
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-text-secondary hover:bg-surface-elevated focus:outline-none"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-text-primary">File Fraud Coordinate</h3>
              <p className="text-text-secondary text-xs font-light mt-1">
                Report phone numbers or links to protect fellow citizens.
              </p>
            </div>

            {submitError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
                {submitError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmitReport)} className="space-y-4">
              
              {/* Category selector */}
              <div>
                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5 pl-1">
                  Scam Category
                </label>
                <select
                  {...formRegister('scam_category')}
                  className="w-full px-4 py-2.5 bg-surface-elevated border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary/50"
                  onChange={(e) => {
                    setValue('scam_category', e.target.value);
                    setValue('scam_type', ''); // reset scam type
                  }}
                >
                  <option value="">Select Category</option>
                  {Object.entries(SCAM_DATABASE).map(([key, cat]) => (
                    <option key={key} value={key}>{cat.label}</option>
                  ))}
                </select>
                {errors.scam_category && (
                  <p className="text-red-500 text-[10px] mt-1 pl-1">{errors.scam_category.message}</p>
                )}
              </div>

              {/* Specific Scam type */}
              <div>
                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5 pl-1">
                  Scam Type
                </label>
                <select
                  disabled={!selectedCategory}
                  {...formRegister('scam_type')}
                  className="w-full px-4 py-2.5 bg-surface-elevated border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary/50 disabled:opacity-50"
                >
                  <option value="">Select Specific Type</option>
                  {selectedCategory && 
                    SCAM_DATABASE[selectedCategory as keyof typeof SCAM_DATABASE]?.types.map((type, idx) => (
                      <option key={idx} value={type}>{type}</option>
                    ))
                  }
                </select>
                {errors.scam_type && (
                  <p className="text-red-500 text-[10px] mt-1 pl-1">{errors.scam_type.message}</p>
                )}
              </div>

              {/* Number and URL Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5 pl-1">
                    Suspect Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91-9988776655"
                    {...formRegister('reported_number')}
                    className="w-full px-4 py-2.5 bg-surface-elevated border border-border rounded-xl text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50"
                  />
                  {errors.reported_number && (
                    <p className="text-red-500 text-[10px] mt-1 pl-1">{errors.reported_number.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5 pl-1">
                    Suspect Website / Link
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. fake-site.xyz"
                    {...formRegister('reported_url')}
                    className="w-full px-4 py-2.5 bg-surface-elevated border border-border rounded-xl text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-start gap-2 text-text-muted">
                <Info size={14} className="text-accent mt-0.5 flex-shrink-0" />
                <p className="text-[10px] font-light leading-normal">
                  Provide either a phone number or a website URL (or both) to file a record. Duplicate records will increment the report count.
                </p>
              </div>

              {/* Location details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5 pl-1">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Delhi"
                    {...formRegister('city')}
                    className="w-full px-4 py-2.5 bg-surface-elevated border border-border rounded-xl text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-[10px] mt-1 pl-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5 pl-1">
                    State
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Delhi"
                    {...formRegister('state')}
                    className="w-full px-4 py-2.5 bg-surface-elevated border border-border rounded-xl text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-[10px] mt-1 pl-1">{errors.state.message}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5 pl-1">
                  Describe what happened
                </label>
                <textarea
                  placeholder="Explain details of how they contacted you, what payment they demanded, or what link was sent..."
                  rows={3}
                  {...formRegister('description')}
                  className="w-full p-3 bg-surface-elevated border border-border rounded-xl text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50 resize-y font-light leading-relaxed"
                />
                {errors.description && (
                  <p className="text-red-500 text-[10px] mt-1 pl-1">{errors.description.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all shadow-md shadow-red-500/10 focus:outline-none disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting report...
                  </>
                ) : (
                  'File Report'
                )}
              </button>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

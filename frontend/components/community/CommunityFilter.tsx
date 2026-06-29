"use client";

import { useState } from 'react';
import { Search, MapPin, RefreshCw } from 'lucide-react';
import { SCAM_DATABASE } from '../../lib/scamPrompts';

interface CommunityFilterProps {
  onFilter: (scamType: string, city: string) => void;
}

export default function CommunityFilter({ onFilter }: CommunityFilterProps) {
  const [scamType, setScamType] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(scamType, city);
  };

  const handleReset = () => {
    setScamType('');
    setCity('');
    onFilter('', '');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface border border-border p-5 rounded-2xl shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Scam type keyword input */}
        <div className="relative">
          <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5 pl-1">
            Search Scam Type
          </label>
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={scamType}
              onChange={(e) => setScamType(e.target.value)}
              placeholder="e.g. Lottery, KYC, Police..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface-elevated border border-border rounded-xl text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* City input */}
        <div className="relative">
          <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5 pl-1">
            Filter by City
          </label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Delhi, Mumbai, Bangalore..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface-elevated border border-border rounded-xl text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-elevated border border-border rounded-xl transition-colors focus:outline-none"
        >
          <RefreshCw size={12} />
          Reset Filters
        </button>

        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl transition-colors focus:outline-none shadow-sm shadow-red-500/10"
        >
          Apply Search
        </button>
      </div>
    </form>
  );
}

"use client";

import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import { Menu, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { user } = useAuth();
  
  // Format current date in a friendly Indian format
  const getFriendlyDate = () => {
    return new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 sticky top-0 z-40 transition-colors">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-text-secondary hover:bg-surface-elevated focus:outline-none"
            aria-label="Toggle Menu"
          >
            <Menu size={20} />
          </button>
        )}
        
        {/* Welcome header */}
        <div className="hidden sm:block">
          <h1 className="text-sm font-bold text-text-primary">
            Jai Hind, {user ? user.name : 'Citizen'} 🇮🇳
          </h1>
          <p className="text-[10px] text-text-muted mt-0.5 font-light">
            {getFriendlyDate()}
          </p>
        </div>

        {/* Small branding for mobile */}
        <div className="flex sm:hidden items-center gap-1.5">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-white">
            <ShieldCheck size={14} />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-primary">
            ScamShield
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Helpline quick alert indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-500">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          Cyber Helpline: Dial 1930
        </div>
        
        <ThemeToggle />
      </div>
    </header>
  );
}

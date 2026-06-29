"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // If auth completes and user is null, bounce to login
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#0B0F19] text-white">
        <Loader2 size={40} className="animate-spin text-red-500 mb-4" />
        <p className="text-sm font-semibold tracking-wide text-slate-400">
          Loading ScamShield Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-text-primary transition-colors">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <Sidebar />
      </div>

      {/* Mobile Sidebar overlay drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop mask */}
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          ></div>
          
          {/* Sidebar Drawer block */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-surface animate-slide-in">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content column */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Scrollable pane */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-surface-elevated/40">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  SearchCode, 
  FolderLock, 
  Users, 
  FileText, 
  LogOut,
  User as UserIcon
} from 'lucide-react';

const MENU_ITEMS = [
  {
    label: 'Overview',
    path: '/dashboard',
    icon: <LayoutDashboard size={20} />
  },
  {
    label: 'Analyze Scam',
    path: '/dashboard/analyze',
    icon: <SearchCode size={20} />
  },
  {
    label: 'Cases Vault',
    path: '/dashboard/cases',
    icon: <FolderLock size={20} />
  },
  {
    label: 'Community Database',
    path: '/dashboard/community',
    icon: <Users size={20} />
  },
  {
    label: 'Legal Documents',
    path: '/dashboard/documents',
    icon: <FileText size={20} />
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col justify-between h-full transition-colors">
      {/* Upper Logo / Links */}
      <div>
        {/* Brand Logo header */}
        <div className="h-16 flex items-center px-6 border-b border-border gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
            <ShieldCheck size={18} />
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
            ScamShield AI
          </span>
        </div>

        {/* Navigation links */}
        <nav className="p-4 space-y-1.5">
          {MENU_ITEMS.map((item, idx) => {
            const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
            return (
              <Link
                key={idx}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/10 text-primary border-l-4 border-primary pl-3' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Lower Profile / Logout */}
      <div className="p-4 border-t border-border space-y-3 bg-surface-elevated/40">
        {user && (
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-text-primary truncate">{user.name}</p>
              <p className="text-[10px] text-text-muted truncate">{user.email}</p>
            </div>
          </div>
        )}
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-colors focus:outline-none"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

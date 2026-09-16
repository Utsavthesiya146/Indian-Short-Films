'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Film, FileCheck, ShieldAlert, Users, MessageSquare, History, ArrowLeft, Shield } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Film Management', href: '/admin/films', icon: Film },
    { label: 'Submissions Queue', href: '/admin/submissions', icon: FileCheck },
    { label: 'Content Moderation', href: '/admin/reports', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-cinema-bg flex flex-col md:flex-row">
      
      {/* Admin Navigation Sidebar */}
      <aside className="w-full md:w-64 bg-cinema-surface border-r border-cinema-border p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cinema-accent flex items-center justify-center shadow-lg shadow-cinema-accent/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-white">ADMIN PORTAL</h2>
              <span className="text-[10px] text-cinema-accent font-semibold uppercase">Role-Based Access</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cinema-accent text-white shadow-md shadow-cinema-accent/20'
                      : 'text-cinema-muted hover:text-white hover:bg-cinema-card'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-cinema-border/60 space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-cinema-muted hover:text-white hover:bg-cinema-card rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Main Site
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}

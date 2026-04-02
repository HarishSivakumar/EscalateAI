'use client';

import { useState, useEffect } from 'react';
import { Bell, Search, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';

export default function TopBar() {
  const pathname = usePathname();
  const currentPage = NAV_ITEMS.find((item) => item.href === pathname);
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    setDateStr(
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#0A0E1A]/80 backdrop-blur-xl px-6">
      {/* Page Title */}
      <div>
        <h1 className="text-lg font-semibold text-white tracking-tight">
          {currentPage?.label || 'Dashboard'}
        </h1>
        <p className="text-xs text-slate-500">
          {dateStr}
        </p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="h-9 w-64 rounded-lg border border-white/[0.06] bg-white/[0.03] pl-9 pr-4 text-sm text-slate-300 placeholder:text-slate-600 outline-none focus:border-blue-500/30 focus:ring-1 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all">
          <Bell className="h-4 w-4" />
          <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            7
          </div>
        </button>

        {/* Settings */}
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all">
          <Settings className="h-4 w-4" />
        </button>

        {/* Avatar */}
        <div className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white">
          H
        </div>
      </div>
    </header>
  );
}

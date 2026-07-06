"use client";

import { Menu, Coins } from "lucide-react";

interface AppHeaderProps {
  onMenuClick: () => void;
  tokens: number;
}

export function AppHeader({ onMenuClick, tokens }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-3">
        <button
          className="p-1 rounded-md text-slate-500 hover:bg-slate-100 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <span>📁</span>
          <span>Dashboard</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Token Balance Button */}
        <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
          <Coins className="h-3.5 w-3.5 text-slate-500" />
          <span>{tokens.toLocaleString()} tokens</span>
        </div>

        {/* User initials badge */}
        <div className="flex size-8 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 select-none">
          AR
        </div>
      </div>
    </header>
  );
}

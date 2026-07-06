"use client";

import { BrandLogo } from "./BrandLogo";
import {
  Sparkles,
  Library,
  FolderOpen,
  CreditCard,
  User,
  X,
} from "lucide-react";

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  open: boolean;
  onClose: () => void;
  tokens: number;
}

const NAV_ITEMS = [
  { id: "create", label: "Create Project", icon: Sparkles },
  { id: "prebuilt", label: "Prebuilt Projects", icon: Library },
  { id: "my-projects", label: "My Projects", icon: FolderOpen },
  { id: "pricing", label: "Pricing", icon: CreditCard },
  { id: "profile", label: "Profile", icon: User },
];

export function AppSidebar({ activeTab, onTabChange, open, onClose, tokens }: AppSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white text-slate-900 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <BrandLogo to="/dashboard" />
          <button
            className="p-1 rounded-md text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-4 px-5">
          Workspace
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV_ITEMS.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-slate-100 text-slate-900 border border-slate-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0 text-slate-500" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Profile Details Box */}
        <div className="border-t border-slate-200 p-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-700 text-sm">
              AR
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">Alex Rivera</p>
              <p className="truncate text-xs text-slate-500">Pro · {tokens} tokens</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

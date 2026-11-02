"use client";

import Link from "next/link";
import { Bell, ChevronDown, Moon, Search, Sun, Upload, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function AppTopbar({ title }: { title?: string }) {
  const [dark, setDark] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  return (
    <header className="sticky top-0 z-30 border-b border-[#eef0e2] bg-white/85 backdrop-blur-md">
      <div className="flex h-[76px] items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-lg border border-[#e9e8db] text-[#6b6d4c] lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={16} />
        </button>

        <label className="relative flex flex-1 items-center lg:max-w-[420px]">
          <Search size={15} className="absolute left-3.5 text-[#9a9c74]" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search shops, codes, batches…"
            aria-label="Search"
            className="h-10 w-full rounded-full border border-transparent bg-[#f5f7ea] pl-10 pr-16 text-[0.8125rem] text-[#33361a] outline-none transition-colors placeholder:text-[#9a9c74] focus:border-[#c9d3a6] focus:bg-white"
          />
          <kbd className="pointer-events-none absolute right-3 rounded border border-[#e2e5d4] bg-white px-1.5 py-0.5 font-mono text-[0.5625rem] text-[#9a9c74]">
            ⌘K
          </kbd>
        </label>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setDark((v) => !v)}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            className="flex size-9 items-center justify-center rounded-full text-[#6b6d4c] transition-colors hover:bg-[#f5f7ea]"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            type="button"
            aria-label="Notifications"
            className="relative flex size-9 items-center justify-center rounded-full text-[#6b6d4c] transition-colors hover:bg-[#f5f7ea]"
          >
            <Bell size={16} />
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#a6402a] ring-2 ring-white" />
          </button>

          <div className="mx-1 hidden h-5 w-px bg-[#eef0e2] sm:block" />

          <Link
            href="/dashboard/shops?new=1"
            className="hidden h-9 items-center gap-2 rounded-full bg-[#41431b] px-3.5 text-[0.75rem] font-medium text-white transition-colors hover:bg-[#33361a] sm:inline-flex"
          >
            <Upload size={13} />
            Register shop
          </Link>

          <button
            type="button"
            className="ml-0.5 flex items-center gap-2 rounded-full p-0.5 pr-2 transition-colors hover:bg-[#f5f7ea]"
            aria-label="Account menu"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-[#eef4d6] text-[0.6875rem] font-semibold text-[#4b5226]">
              RC
            </span>
            <ChevronDown size={13} className="text-[#9a9c74]" />
          </button>
        </div>
      </div>
      {title && (
        <div className="border-t border-[#f2f4e8] px-4 py-2 sm:px-6">
          <p className="text-[0.6875rem] text-[#9a9c74]">
            Workspace <span className="mx-1.5 text-[#cfd3bd]">/</span>
            <span className="text-[#5d6432]">{title}</span>
          </p>
        </div>
      )}
    </header>
  );
}

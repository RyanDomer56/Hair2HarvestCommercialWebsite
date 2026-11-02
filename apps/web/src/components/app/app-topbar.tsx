"use client";

import Link from "next/link";
import { Bell, ChevronDown, Moon, Search, Sun, Upload, Menu, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export function AppTopbar({ onMenu }: { onMenu?: () => void }) {
  const [dark, setDark] = useState(false);

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
          onClick={onMenu}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#e9e8db] text-[#6b6d4c] transition-colors hover:bg-[#f5f7ea] lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={16} />
        </button>

        <label className="relative flex min-w-0 flex-1 items-center lg:max-w-[420px]">
          <Search size={15} className="absolute left-3.5 text-[#9a9c74]" aria-hidden />
          <input
            placeholder="Search shops, codes, batches…"
            aria-label="Search"
            className="h-10 w-full rounded-full border border-transparent bg-[#f5f7ea] pl-10 pr-14 text-[0.8125rem] text-[#33361a] outline-none transition-colors placeholder:text-[#9a9c74] focus:border-[#c9d3a6] focus:bg-white"
          />
          <kbd className="pointer-events-none absolute right-3 hidden rounded border border-[#e2e5d4] bg-white px-1.5 py-0.5 font-mono text-[0.5625rem] text-[#9a9c74] sm:block">
            ⌘K
          </kbd>
        </label>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setDark((v) => !v)}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            className="hidden size-9 items-center justify-center rounded-full text-[#6b6d4c] transition-colors hover:bg-[#f5f7ea] sm:flex"
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
            aria-label="Register shop"
            className="inline-flex size-9 items-center justify-center gap-2 rounded-full bg-[#41431b] text-white transition-colors hover:bg-[#33361a] sm:h-9 sm:w-auto sm:px-3.5"
          >
            <Upload size={13} className="hidden sm:block" />
            <Plus size={15} className="sm:hidden" />
            <span className="hidden text-[0.75rem] font-medium sm:inline">Register shop</span>
          </Link>

          <button
            type="button"
            className="ml-0.5 flex items-center gap-2 rounded-full p-0.5 pr-1 transition-colors hover:bg-[#f5f7ea] sm:pr-2"
            aria-label="Account menu"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-[#eef4d6] text-[0.6875rem] font-semibold text-[#4b5226]">
              RC
            </span>
            <ChevronDown size={13} className="hidden text-[#9a9c74] sm:block" />
          </button>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "h2h-theme";

/**
 * Candle light/dark toggle, drawn as precise line-art in the brand's ink to
 * match the editorial "Soil Ledger" system (lucide-style strokes, clay accent
 * flame). Lit in light mode, delicate smoke in dark mode.
 *
 * The visible state is driven entirely by the `html.dark` class via CSS, so the
 * server and client render identical DOM — no hydration mismatch, no flash.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);

  // Sync the button's accessible state with whatever the no-flash script
  // already applied to <html>. Runs after mount to avoid hydration mismatch.
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      /* no-op */
    }
    setIsDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={cn("candle-toggle", className)}
    >
      <span className="ct-stage" aria-hidden="true">
        <span className="ct-scene">
          <svg
            className="ct-mark"
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* candle body + wick */}
            <rect x="9" y="12" width="6" height="8" rx="1.5" />
            <line x1="12" y1="12" x2="12" y2="10" />
            {/* flame — lit, clay accent (light mode) */}
            <g className="ct-flame">
              <path d="M12 10 C 13.4 8.2 13.2 6 12 4.4 C 10.8 6 10.6 8.2 12 10 Z" />
            </g>
            {/* smoke — extinguished (dark mode) */}
            <g className="ct-smoke">
              <path d="M12 10 C 10.6 8.4 13.4 7.2 12 5.6 C 10.8 4.4 13 3.4 12 2" />
              <path d="M12 10 C 13.2 8.9 10.8 7.7 12 6.3" />
            </g>
          </svg>
        </span>
        <span className="ct-fix" />
      </span>
    </button>
  );
}

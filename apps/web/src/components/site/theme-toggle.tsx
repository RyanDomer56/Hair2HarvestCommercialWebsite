"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "h2h-theme";

/**
 * Candle light/dark toggle.
 *
 * The visible state (lit flame vs. rising smoke) is driven entirely by the
 * `html.dark` class via CSS, so the server and client render the exact same
 * DOM. This component only flips that class and persists the choice — the
 * no-flash script in layout.tsx sets it before first paint.
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
          <span className="ct-candle">
            <span className="ct-wick" />
            <span className="ct-flame" />
            <span className="ct-smoke">
              <svg viewBox="0 0 26 28" width="26" height="28">
                <path
                  className="ct-smoke-haze"
                  d="M13 26 C 9 22, 17 18, 13 14 C 9 10, 17 6, 13 2"
                />
                <path
                  className="ct-smoke-thread"
                  d="M13 26 C 10 22, 16 18, 13 14 C 10 10, 16 6, 13 2"
                />
              </svg>
            </span>
          </span>
        </span>
        <span className="ct-fix" />
      </span>
    </button>
  );
}

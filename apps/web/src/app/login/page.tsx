"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState("/dashboard");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("next");
    if (p && p.startsWith("/") && !p.startsWith("//")) setNext(p);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Invalid password");
        setLoading(false);
        return;
      }
      router.replace(next);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f2e6] px-4">
      <div className="w-full max-w-[380px] rounded-2xl border border-[#e7e3d3] bg-white p-8 shadow-sm">
        <div className="mb-6">
          <div className="mb-3 inline-flex size-11 items-center justify-center rounded-xl bg-[#41431b] text-[0.8125rem] font-bold text-[#d9f26b]">
            H2H
          </div>
          <h1 className="text-[1.25rem] font-semibold text-[#242a12]">Workspace sign-in</h1>
          <p className="mt-1 text-[0.8125rem] text-[#6b6d4c]">
            The Hair2Harvest operations workspace is private. Enter the workspace password to
            continue.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-[0.75rem] font-medium text-[#41431b]">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
              className="h-11 w-full rounded-lg border border-[#d8d6c4] bg-[#faf9f2] px-3 text-[0.875rem] text-[#242a12] outline-none focus:border-[#aebf7a]"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-[#fbece8] px-3 py-2 text-[0.75rem] text-[#a6402a]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-lg bg-[#41431b] text-[0.875rem] font-medium text-white transition-colors hover:bg-[#33361a] disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-[0.6875rem] text-[#9a9c74]">
          Hair2Harvest · operations workspace
        </p>
      </div>
    </main>
  );
}

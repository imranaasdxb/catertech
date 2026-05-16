"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
      }),
    });
    setLoading(false);
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }
    router.replace(from);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-offwhite border border-border p-10">
        <p className="text-[10px] tracking-[0.28em] uppercase text-sand mb-2">
          Catertech
        </p>
        <h1 className="font-serif text-3xl text-charcoal mb-2">Admin sign in</h1>
        <p className="text-muted text-sm mb-8 leading-relaxed">
          Use the same credentials as{" "}
          <Link href="/auth" className="font-semibold text-charcoal underline underline-offset-2">
            /auth
          </Link>
          . Roles in Neon must be exactly{" "}
          <code className="text-xs bg-cream px-1 whitespace-nowrap">admin</code> or{" "}
          <code className="text-xs bg-cream px-1 whitespace-nowrap">superadmin</code> (lowercase).{" "}
          <code className="text-xs bg-cream px-1 whitespace-nowrap">superadmin</code> unlocks Contacts.
        </p>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border bg-white px-4 py-3 text-sm outline-none focus:border-sand"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border bg-white px-4 py-3 text-sm outline-none focus:border-sand"
              placeholder="••••••••"
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={loading || !email.trim() || !password}
            className="w-full bg-sand hover:bg-sand-dark disabled:opacity-50 text-white text-xs font-semibold tracking-widest uppercase py-4"
          >
            {loading ? "Signing in…" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

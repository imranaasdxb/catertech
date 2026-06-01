"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import { isStaffRole } from "@/lib/admin-roles";

type Tab = "login" | "signup";
type SignupStep = "details" | "otp";

function safeStaffDashboardRedirect(from: string | null): string {
  if (!from || !from.startsWith("/admin")) return "/admin";
  if (from.includes("..")) return "/admin";
  return from;
}

export default function AuthPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const tab: Tab = tabParam === "signup" ? "signup" : "login";

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [signupStep, setSignupStep] = useState<SignupStep>("details");
  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [otp, setOtp] = useState("");
  const [signupErr, setSignupErr] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupDone, setSignupDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setLoginErr("");
    setLoginLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword,
      }),
    });
    setLoginLoading(false);
    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
      role?: string;
    };
    if (!res.ok) {
      setLoginErr(data.error || "Could not sign in");
      return;
    }
    if (!isStaffRole(data.role)) {
      setLoginErr("This account cannot access the dashboard.");
      return;
    }
    router.replace(safeStaffDashboardRedirect(searchParams.get("from")));
    router.refresh();
  }

  async function onSendOtp(e: FormEvent) {
    e.preventDefault();
    setSignupErr("");
    if (password !== confirmPassword) {
      setSignupErr("Passwords do not match");
      return;
    }
    setSignupLoading(true);
    const fd = new FormData();
    fd.set("fullName", fullName.trim());
    fd.set("email", signupEmail.trim().toLowerCase());
    fd.set("password", password);
    fd.set("confirmPassword", confirmPassword);
    if (avatarFile) fd.set("avatar", avatarFile);

    const res = await fetch("/api/auth/signup/send-otp", {
      method: "POST",
      body: fd,
    });
    setSignupLoading(false);
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setSignupErr(data.error || "Could not send code");
      return;
    }
    setSignupStep("otp");
    setOtp("");
  }

  async function onVerifyOtp(e: FormEvent) {
    e.preventDefault();
    setSignupErr("");
    setSignupLoading(true);
    const res = await fetch("/api/auth/signup/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: signupEmail.trim().toLowerCase(),
        code: otp.trim(),
      }),
    });
    setSignupLoading(false);
    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
      role?: string;
    };
    if (!res.ok) {
      setSignupErr(data.error || "Verification failed");
      return;
    }
    setSignupDone(true);
    if (!isStaffRole(data.role)) {
      setSignupErr("Account created but role is invalid — contact support.");
      return;
    }
    router.replace(safeStaffDashboardRedirect(searchParams.get("from")));
    router.refresh();
  }

  function goTab(next: Tab) {
    setSignupErr("");
    if (next === "signup") setSignupStep("details");
    const from = searchParams.get("from");
    const q = new URLSearchParams();
    q.set("tab", next);
    if (from) q.set("from", from);
    router.replace(`/auth?${q.toString()}`, { scroll: false });
  }

  return (
    <div className="min-h-screen bg-navy relative overflow-hidden flex flex-col">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #322b81 0%, transparent 45%), radial-gradient(circle at 80% 60%, #c21722 0%, transparent 35%)",
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-16 md:py-24">
        <Link
          href="/"
          className="text-[10px] tracking-[0.3em] uppercase text-white/40 hover:text-sand/80 transition-colors mb-10"
        >
          ← Back to site
        </Link>

        <div className="w-full max-w-[440px]">
          <div className="text-center mb-8">
            <span className="inline-block text-[10px] font-semibold tracking-[0.28em] uppercase text-sand mb-3">
              Account
            </span>
            <h1 className="font-serif text-3xl md:text-4xl text-white leading-tight">
              Sign in or <span className="text-sand italic">create an account</span>
            </h1>
            <p className="text-white/45 text-sm mt-3 max-w-sm mx-auto leading-relaxed">
              Sign-up creates a staff account with role{" "}
              <code className="text-[11px] text-white/55">admin</code>. In Neon you can change it to{" "}
              <code className="text-[11px] text-white/55">superadmin</code> for full access (including Contacts).
            </p>
          </div>

          <div className="bg-offwhite border border-border shadow-2xl shadow-navy/40">
            <div className="flex border-b border-border">
              <button
                type="button"
                onClick={() => goTab("login")}
                className={`flex-1 py-4 text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors ${
                  tab === "login"
                    ? "text-charcoal border-b-2 border-sand bg-white"
                    : "text-muted hover:text-charcoal bg-offwhite"
                }`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => goTab("signup")}
                className={`flex-1 py-4 text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors ${
                  tab === "signup"
                    ? "text-charcoal border-b-2 border-sand bg-white"
                    : "text-muted hover:text-charcoal bg-offwhite"
                }`}
              >
                Sign up
              </button>
            </div>

            <div className="p-8 md:p-10 bg-white">
              {tab === "login" ? (
                <form onSubmit={onLogin} className="space-y-6">
                  <div>
                    <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      autoComplete="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full border border-border px-4 py-3.5 text-sm text-charcoal outline-none focus:border-sand focus:ring-1 focus:ring-sand/30 transition-shadow"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full border border-border px-4 py-3.5 text-sm text-charcoal outline-none focus:border-sand focus:ring-1 focus:ring-sand/30 transition-shadow"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  {loginErr ? <p className="text-sm text-red-600">{loginErr}</p> : null}
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full bg-charcoal text-white text-[11px] font-semibold tracking-[0.18em] uppercase py-4 hover:bg-navy disabled:opacity-50 transition-colors"
                  >
                    {loginLoading ? "Signing in…" : "Sign in"}
                  </button>
                  <p className="text-center text-[11px] text-muted">
                    Admin?{" "}
                    <Link href="/admin/login" className="text-sand hover:underline">
                      Admin sign in
                    </Link>
                  </p>
                </form>
              ) : signupDone ? (
                <div className="text-center py-4 space-y-3">
                  <p className="font-serif text-xl text-charcoal">Welcome aboard</p>
                  <p className="text-muted text-sm">Redirecting…</p>
                </div>
              ) : signupStep === "otp" ? (
                <form onSubmit={onVerifyOtp} className="space-y-6">
                  <p className="text-sm text-charcoal leading-relaxed">
                    Enter the <strong>6-digit code</strong> sent to{" "}
                    <span className="text-sand font-medium">{signupEmail}</span>.
                  </p>
                  <div>
                    <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
                      Code
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      className="w-full border border-border px-4 py-3.5 text-lg tracking-[0.4em] text-center outline-none focus:border-sand"
                      placeholder="000000"
                      required
                    />
                  </div>
                  {signupErr ? <p className="text-sm text-red-600">{signupErr}</p> : null}
                  <button
                    type="submit"
                    disabled={signupLoading || otp.length !== 6}
                    className="w-full bg-charcoal text-white text-[11px] font-semibold tracking-[0.18em] uppercase py-4 hover:bg-navy disabled:opacity-50 transition-colors"
                  >
                    {signupLoading ? "Verifying…" : "Verify & create account"}
                  </button>
                  <button
                    type="button"
                    disabled={signupLoading}
                    className="w-full border border-border text-muted text-[11px] font-semibold tracking-widest uppercase py-3 hover:bg-offwhite disabled:opacity-50"
                    onClick={() => {
                      setSignupStep("details");
                      setSignupErr("");
                    }}
                  >
                    Back to details
                  </button>
                  <button
                    type="button"
                    disabled={signupLoading}
                    className="w-full text-sand text-xs font-semibold tracking-widest uppercase hover:text-sand-dark disabled:opacity-50"
                    onClick={async () => {
                      setSignupErr("");
                      setSignupLoading(true);
                      const fd = new FormData();
                      fd.set("fullName", fullName.trim());
                      fd.set("email", signupEmail.trim().toLowerCase());
                      fd.set("password", password);
                      fd.set("confirmPassword", confirmPassword);
                      if (avatarFile) fd.set("avatar", avatarFile);
                      const res = await fetch("/api/auth/signup/send-otp", {
                        method: "POST",
                        body: fd,
                      });
                      setSignupLoading(false);
                      const data = (await res.json().catch(() => ({}))) as {
                        error?: string;
                      };
                      if (!res.ok) {
                        setSignupErr(data.error || "Could not resend");
                      }
                    }}
                  >
                    Resend code
                  </button>
                </form>
              ) : (
                <form
                  id="signup-details"
                  onSubmit={onSendOtp}
                  className="space-y-5"
                >
                  <div>
                    <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
                      Profile photo
                    </label>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="w-full text-sm text-charcoal file:mr-3 file:border file:border-border file:bg-offwhite file:px-3 file:py-2 file:text-xs file:uppercase file:tracking-wider"
                      onChange={(e) =>
                        setAvatarFile(e.target.files?.[0] ?? null)
                      }
                    />
                    <p className="text-[11px] text-muted mt-1">
                      JPG, PNG, WebP or GIF · max 4&nbsp;MB (optional).
                    </p>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
                      Full name *
                    </label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full border border-border px-4 py-3.5 text-sm outline-none focus:border-sand"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
                      Email (OTP sent here) *
                    </label>
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      autoComplete="email"
                      required
                      className="w-full border border-border px-4 py-3.5 text-sm outline-none focus:border-sand"
                      placeholder="you@gmail.com"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      minLength={8}
                      required
                      className="w-full border border-border px-4 py-3.5 text-sm outline-none focus:border-sand"
                      placeholder="At least 8 characters"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold tracking-widest uppercase text-muted block mb-2">
                      Confirm password *
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      minLength={8}
                      required
                      className="w-full border border-border px-4 py-3.5 text-sm outline-none focus:border-sand"
                    />
                  </div>
                  {signupErr ? (
                    <p className="text-sm text-red-600">{signupErr}</p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={signupLoading}
                    className="w-full bg-sand text-white text-[11px] font-semibold tracking-[0.18em] uppercase py-4 hover:bg-sand-dark disabled:opacity-60 transition-colors"
                  >
                    {signupLoading ? "Sending code…" : "Send OTP to email"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

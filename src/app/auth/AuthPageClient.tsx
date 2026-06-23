"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { admin } from "@/components/admin/adminTheme";
import logo from "@/assets/logo.png";
import { isStaffRole } from "@/lib/admin-roles";
import { cn } from "@/lib/utils";
import { AuthCateringPattern } from "./AuthCateringPattern";

type Tab = "login" | "signup";
type SignupStep = "details" | "otp";

function safeStaffDashboardRedirect(from: string | null): string {
  if (!from || !from.startsWith("/admin")) return "/admin";
  if (from.includes("..")) return "/admin";
  return from;
}

function AuthField({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={admin.labelModern}>
        {label}
      </label>
      {children}
      {hint ? <p className={admin.hint}>{hint}</p> : null}
    </div>
  );
}

function AuthAlert({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {message}
    </div>
  );
}

function PrimaryButton({
  children,
  disabled,
  type = "submit",
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  type?: "submit" | "button";
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        admin.primaryBtn,
        "w-full bg-admin-accent hover:opacity-95 disabled:opacity-50",
      )}
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(admin.secondaryBtn, "w-full disabled:opacity-50")}
    >
      {children}
    </button>
  );
}

function SignupSteps({ step }: { step: SignupStep }) {
  const steps = [
    { key: "details", label: "Your details" },
    { key: "otp", label: "Verify email" },
  ] as const;

  return (
    <ol className="mb-6 flex items-center gap-2">
      {steps.map((s, i) => {
        const active = s.key === step;
        const done = step === "otp" && s.key === "details";
        return (
          <li key={s.key} className="flex min-w-0 flex-1 items-center gap-2">
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                active || done
                  ? "bg-admin-accent text-white"
                  : "bg-admin-bg text-admin-ink/35 ring-1 ring-admin-border",
              )}
            >
              {done ? <CheckCircle2 className="size-3.5" aria-hidden /> : i + 1}
            </span>
            <span
              className={cn(
                "truncate text-xs font-semibold",
                active ? "text-admin-ink" : "text-admin-ink/40",
              )}
            >
              {s.label}
            </span>
            {i < steps.length - 1 ? (
              <span
                aria-hidden
                className={cn(
                  "mx-1 hidden h-px flex-1 sm:block",
                  done ? "bg-admin-accent/40" : "bg-admin-border",
                )}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [signupErr, setSignupErr] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupDone, setSignupDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function onAvatarChange(file: File | null) {
    setAvatarFile(file);
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(file ? URL.createObjectURL(file) : null);
  }

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

  async function resendOtp() {
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
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setSignupErr(data.error || "Could not resend");
    }
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
    <div className="min-h-dvh bg-admin-bg font-sans text-admin-ink antialiased">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,rgba(248,121,65,0.08),transparent_55%),radial-gradient(ellipse_60%_50%_at_0%_100%,rgba(248,121,65,0.05),transparent_50%)]"
      />

      <div className="relative flex min-h-dvh flex-col lg:flex-row">
        {/* Brand panel — desktop */}
        <aside className="relative hidden overflow-hidden border-r border-admin-accent/15 lg:flex lg:w-[42%] xl:w-[38%] lg:flex-col lg:justify-between lg:p-10 xl:p-14">
          {/* Top: soft orange + white → bottom: main orange */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,#fffbf8_0%,#fdeadc_22%,#fac9ad_48%,#f9a078_72%,#f87941_100%)]"
          />
          {/* Cloud-like soft white blooms (top) */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_95%_50%_at_50%_-5%,rgba(255,255,255,0.92),transparent_62%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_55%_38%_at_18%_20%,rgba(255,255,255,0.65),transparent_58%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_50%_42%_at_88%_14%,rgba(253,234,223,0.8),transparent_52%)]"
          />
          {/* Soft orange cloud shadows (mid → lower) */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_25%_58%,rgba(249,176,149,0.55),transparent_58%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_65%_48%_at_80%_68%,rgba(248,121,65,0.35),transparent_55%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_90%_40%_at_50%_100%,rgba(236,99,38,0.28),transparent_65%)]"
          />

          <AuthCateringPattern variant="light" />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 top-[10%] size-64 rounded-full bg-white/50 blur-[72px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[8%] left-[4%] size-56 rounded-full bg-admin-accent-soft/35 blur-[68px]"
          />

          <div className="relative z-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-admin-ink/55 transition-colors hover:text-admin-accent-strong"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Back to site
            </Link>
            <div className="mt-12">
              <Image src={logo} alt="Catertech" className="h-9 w-auto" priority />
              <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.2em] text-admin-accent-strong">
                Team portal
              </p>
              <h1 className="mt-3 max-w-md text-3xl font-bold leading-snug tracking-tight text-admin-ink xl:text-[2.125rem]">
                Manage products, quotes &amp; enquiries in one place.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-admin-ink/58">
                Sign in to the Catertech admin dashboard. New staff can create an account and verify by email.
              </p>
            </div>
          </div>

          <ul className="relative z-10 mt-10 space-y-3">
            {[
              { icon: ShieldCheck, text: "Secure staff-only access" },
              { icon: Mail, text: "Email verification on sign-up" },
              { icon: Lock, text: "Role-based permissions" },
            ].map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-3 rounded-2xl border border-white/55 bg-white/72 px-4 py-3 text-sm font-medium text-admin-ink/78 shadow-[0_8px_32px_rgba(248,121,65,0.12)] backdrop-blur-sm"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-admin-accent-tint text-admin-accent ring-1 ring-admin-accent/20">
                  <Icon className="size-4" aria-hidden />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </aside>

        {/* Form column */}
        <main className="relative flex flex-1 flex-col">
          <div className="flex items-center justify-between px-5 pt-6 lg:hidden">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-admin-ink/50 transition-colors hover:text-admin-ink"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Back
            </Link>
            <Image src={logo} alt="Catertech" className="h-7 w-auto" priority />
          </div>

          <div className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:px-12 xl:px-16">
            <div
              className={cn(
                "w-full",
                tab === "signup" && signupStep === "details"
                  ? "max-w-[520px]"
                  : "max-w-[440px]",
              )}
            >
              <div className="mb-7 lg:mb-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-admin-accent">
                  {tab === "login" ? "Welcome back" : "Create account"}
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-admin-ink sm:text-[28px]">
                  {tab === "login" ? "Sign in to your dashboard" : "Join the team"}
                </h2>
                {tab === "login" ? (
                  <p className="mt-2 text-sm text-admin-ink/50">
                    Use your staff email and password to continue.
                  </p>
                ) : null}
              </div>

              {/* Tab switcher */}
              <div
                role="tablist"
                aria-label="Authentication mode"
                className="mb-6 flex rounded-full border border-admin-border bg-admin-surface p-1 shadow-[0_1px_2px_rgba(47,48,53,0.04)]"
              >
                {(["login", "signup"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    aria-selected={tab === t}
                    onClick={() => goTab(t)}
                    className={cn(
                      "flex-1 rounded-full py-2.5 text-sm font-semibold transition-all duration-200",
                      tab === t
                        ? "bg-admin-accent text-white shadow-sm"
                        : "text-admin-ink/50 hover:text-admin-ink",
                    )}
                  >
                    {t === "login" ? "Log in" : "Sign up"}
                  </button>
                ))}
              </div>

              {/* Form card */}
              <div className={admin.formModernCard}>
                {tab === "login" ? (
                  <form onSubmit={onLogin} className="space-y-5">
                    <AuthField id="login-email" label="Email address">
                      <div className="relative">
                        <Mail
                          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-admin-ink/30"
                          aria-hidden
                        />
                        <input
                          id="login-email"
                          type="email"
                          autoComplete="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className={cn(admin.fieldModern, "pl-10")}
                          placeholder="you@company.com"
                          required
                        />
                      </div>
                    </AuthField>

                    <AuthField id="login-password" label="Password">
                      <div className="relative">
                        <Lock
                          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-admin-ink/30"
                          aria-hidden
                        />
                        <input
                          id="login-password"
                          type="password"
                          autoComplete="current-password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className={cn(admin.fieldModern, "pl-10")}
                          placeholder="Enter your password"
                          required
                        />
                      </div>
                    </AuthField>

                    {loginErr ? <AuthAlert message={loginErr} /> : null}

                    <PrimaryButton disabled={loginLoading}>
                      {loginLoading ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="size-4 animate-spin" aria-hidden />
                          Signing in…
                        </span>
                      ) : (
                        "Sign in"
                      )}
                    </PrimaryButton>

                    <p className="text-center text-sm text-admin-ink/45">
                      Admin?{" "}
                      <Link
                        href="/admin/login"
                        className="font-semibold text-admin-accent hover:underline"
                      >
                        Admin sign in
                      </Link>
                    </p>
                  </form>
                ) : signupDone ? (
                  <div className="py-6 text-center">
                    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-admin-accent-tint">
                      <CheckCircle2 className="size-7 text-admin-accent" aria-hidden />
                    </div>
                    <p className="text-xl font-bold text-admin-ink">Welcome aboard</p>
                    <p className="mt-2 text-sm text-admin-ink/50">Redirecting to your dashboard…</p>
                  </div>
                ) : signupStep === "otp" ? (
                  <form onSubmit={onVerifyOtp} className="space-y-5">
                    <SignupSteps step="otp" />

                    <div className="rounded-2xl border border-admin-border bg-admin-bg/80 px-4 py-3.5">
                      <p className="text-sm leading-relaxed text-admin-ink/70">
                        We sent a <strong className="text-admin-ink">6-digit code</strong> to{" "}
                        <span className="font-semibold text-admin-accent">{signupEmail}</span>
                      </p>
                    </div>

                    <AuthField id="otp-code" label="Verification code">
                      <input
                        id="otp-code"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        pattern="[0-9]{6}"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        className={cn(
                          admin.fieldModern,
                          "text-center text-2xl font-bold tracking-[0.35em] tabular-nums",
                        )}
                        placeholder="000000"
                        required
                      />
                    </AuthField>

                    {signupErr ? <AuthAlert message={signupErr} /> : null}

                    <PrimaryButton disabled={signupLoading || otp.length !== 6}>
                      {signupLoading ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="size-4 animate-spin" aria-hidden />
                          Verifying…
                        </span>
                      ) : (
                        "Verify & create account"
                      )}
                    </PrimaryButton>

                    <SecondaryButton
                      disabled={signupLoading}
                      onClick={() => {
                        setSignupStep("details");
                        setSignupErr("");
                      }}
                    >
                      Back to details
                    </SecondaryButton>

                    <button
                      type="button"
                      disabled={signupLoading}
                      onClick={() => void resendOtp()}
                      className="w-full text-sm font-semibold text-admin-accent transition-opacity hover:opacity-80 disabled:opacity-50"
                    >
                      Resend code
                    </button>
                  </form>
                ) : (
                  <form id="signup-details" onSubmit={onSendOtp} className="space-y-5">
                    <SignupSteps step="details" />

                    <AuthField
                      id="avatar"
                      label="Profile photo"
                      hint="JPG, PNG, WebP or GIF · max 4 MB (optional)"
                    >
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          className="group relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-admin-border bg-admin-bg transition-colors hover:border-admin-accent/40 hover:bg-admin-accent-tint/30"
                        >
                          {avatarPreview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={avatarPreview}
                              alt="Profile preview"
                              className="size-full object-cover"
                            />
                          ) : (
                            <Camera
                              className="size-5 text-admin-ink/30 transition-colors group-hover:text-admin-accent"
                              aria-hidden
                            />
                          )}
                        </button>
                        <div className="min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="text-sm font-semibold text-admin-accent hover:underline"
                          >
                            {avatarFile ? "Change photo" : "Upload photo"}
                          </button>
                          {avatarFile ? (
                            <p className="mt-0.5 truncate text-xs text-admin-ink/45">
                              {avatarFile.name}
                            </p>
                          ) : null}
                        </div>
                        <input
                          ref={fileRef}
                          id="avatar"
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="sr-only"
                          onChange={(e) =>
                            onAvatarChange(e.target.files?.[0] ?? null)
                          }
                        />
                      </div>
                    </AuthField>

                    <AuthField id="full-name" label="Full name">
                      <div className="relative">
                        <User
                          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-admin-ink/30"
                          aria-hidden
                        />
                        <input
                          id="full-name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          className={cn(admin.fieldModern, "pl-10")}
                          placeholder="Your full name"
                        />
                      </div>
                    </AuthField>

                    <AuthField
                      id="signup-email"
                      label="Email address"
                      hint="We'll send a one-time code to this address"
                    >
                      <div className="relative">
                        <Mail
                          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-admin-ink/30"
                          aria-hidden
                        />
                        <input
                          id="signup-email"
                          type="email"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          autoComplete="email"
                          required
                          className={cn(admin.fieldModern, "pl-10")}
                          placeholder="you@gmail.com"
                        />
                      </div>
                    </AuthField>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <AuthField id="password" label="Password">
                        <input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="new-password"
                          minLength={8}
                          required
                          className={admin.fieldModern}
                          placeholder="Min. 8 characters"
                        />
                      </AuthField>

                      <AuthField id="confirm-password" label="Confirm password">
                        <input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          autoComplete="new-password"
                          minLength={8}
                          required
                          className={admin.fieldModern}
                          placeholder="Repeat password"
                        />
                      </AuthField>
                    </div>

                    {signupErr ? <AuthAlert message={signupErr} /> : null}

                    <PrimaryButton disabled={signupLoading}>
                      {signupLoading ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="size-4 animate-spin" aria-hidden />
                          Sending code…
                        </span>
                      ) : (
                        "Send verification code"
                      )}
                    </PrimaryButton>
                  </form>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

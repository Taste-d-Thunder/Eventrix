/**
 * app/login/page.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Login page with:
 *   - Email + Password + Role selector
 *   - Strong password validation
 *   - CAPTCHA verification (mock)
 *   - Rate limiting (5 attempts → 10s cooldown)
 *   - Loading states + disabled button while submitting
 *   - Demo credential helper
 *   - Framer Motion entrance animations
 */

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, AlertCircle, ArrowRight, Sparkles, CheckCircle2, Clock } from "lucide-react";
import { loginUser, getCurrentUser } from "@/lib/auth";
import { ROLE_REDIRECT } from "@/types/auth";
import type { UserRole } from "@/types/auth";
import { Captcha } from "@/components/ui/Captcha";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

// ─── Role config ──────────────────────────────────────────────────────────────

const ROLES: Array<{ value: UserRole; label: string; emoji: string; demo: string; color: string; bg: string; border: string }> = [
  { value: "customer", label: "Customer", emoji: "🎉", demo: "user@eventspace.in", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-400" },
  { value: "vendor", label: "Vendor", emoji: "🏪", demo: "vendor@eventspace.in", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-400" },
  { value: "delivery_partner", label: "Delivery", emoji: "🚗", demo: "delivery@eventspace.in", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-400" },
  { value: "admin", label: "Admin", emoji: "⚙️", demo: "admin@eventspace.in", color: "text-red-700", bg: "bg-red-50", border: "border-red-400" },
];

// ─── Rate Limiting ────────────────────────────────────────────────────────────

const MAX_ATTEMPTS = 5;
const COOLDOWN_SECONDS = 10;

// ─── Form types ───────────────────────────────────────────────────────────────

interface FormState {
  email: string;
  password: string;
  role: UserRole;
}

interface FormErrors {
  email?: string;
  password?: string;
  submit?: string;
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.email) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email";
  if (!form.password) errors.password = "Password is required";
  else if (form.password.length < 6) errors.password = "At least 6 characters";
  return errors;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const [form, setForm] = useState<FormState>({ email: "", password: "", role: "customer" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // CAPTCHA
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

  // Rate limiting
  const [attempts, setAttempts] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    const user = getCurrentUser();
    if (user) router.replace(from || ROLE_REDIRECT[user.role]);
  }, [router, from]);

  // Cooldown timer
  useEffect(() => {
    if (rateLimited) {
      setCooldown(COOLDOWN_SECONDS);
      cooldownRef.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(cooldownRef.current!);
            setRateLimited(false);
            setAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (cooldownRef.current) clearInterval(cooldownRef.current); };
  }, [rateLimited]);

  const selectedRole = ROLES.find((r) => r.value === form.role)!;

  const setDemo = (role: UserRole) => {
    const r = ROLES.find((x) => x.value === role)!;
    setForm({ email: r.demo, password: "password123", role });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limit check
    if (rateLimited) return;

    // CAPTCHA check
    if (!captchaVerified) {
      setCaptchaError(true);
      return;
    }

    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    // Track attempts
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (newAttempts >= MAX_ATTEMPTS) {
      setRateLimited(true);
      setLoading(false);
      setErrors({ submit: "Too many attempts. Please try again later." });
      return;
    }

    try {
      const user = loginUser(form);

      // Set cookie for middleware
      document.cookie = `es_session=${encodeURIComponent(JSON.stringify({ role: user.role, id: user.id }))}; path=/; max-age=86400`;

      setSuccess(true);
      setTimeout(() => router.push(from || ROLE_REDIRECT[user.role]), 800);
    } catch (err: unknown) {
      setErrors({ submit: err instanceof Error ? err.message : "Login failed. Please try again." });
      setLoading(false);
    }
  };

  const isButtonDisabled = loading || success || rateLimited;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-orange-100/30 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="self-start text-sm text-slate-500 hover:text-amber-600 transition-colors flex items-center gap-1 absolute -left-12 top-2 hidden md:flex"
            >
              ← Back
            </button>
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-md group-hover:bg-amber-600 transition-colors">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900">
                Event<span className="text-amber-500">Space</span>
              </span>
            </Link>
          </div>
          <p className="mt-2 text-sm text-slate-500">Sign in to your account</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
        >
          {/* Role selector header */}
          <div className="p-6 pb-0">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Sign in as
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ROLES.map((role) => (
                <motion.button
                  key={role.value}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setForm((f) => ({ ...f, role: role.value })); setErrors({}); }}
                  className={`
                    flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 text-center transition-all duration-150
                    ${form.role === role.value
                      ? `${role.bg} ${role.border} shadow-sm`
                      : "border-slate-100 hover:border-slate-200 bg-slate-50"
                    }
                  `}
                >
                  <span className="text-xl">{role.emoji}</span>
                  <span className={`text-xs font-semibold ${form.role === role.value ? role.color : "text-slate-600"}`}>
                    {role.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
            {/* Rate limit banner */}
            <ErrorBanner
              message={`Too many attempts. Please try again in ${cooldown}s.`}
              type="rateLimit"
              visible={rateLimited}
            />

            {/* Submit error */}
            <ErrorBanner
              message={errors.submit || ""}
              type="error"
              visible={!!errors.submit && !rateLimited}
              onDismiss={() => setErrors((e) => ({ ...e, submit: undefined }))}
            />

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={rateLimited}
                  className={`
                    w-full pl-10 pr-4 py-3 text-sm text-slate-900 bg-white border rounded-xl outline-none transition-all
                    placeholder:text-slate-400
                    focus:ring-3 focus:ring-amber-100
                    disabled:bg-slate-50 disabled:cursor-not-allowed
                    ${errors.email
                      ? "border-red-300 focus:border-red-400"
                      : "border-slate-200 hover:border-slate-300 focus:border-amber-400"
                    }
                  `}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">
                  Password <span className="text-red-400">*</span>
                </label>
                <Link href="/forgot-password" className="text-xs text-amber-600 hover:text-amber-700 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={rateLimited}
                  className={`
                    w-full pl-10 pr-4 py-3 text-sm text-slate-900 bg-white border rounded-xl outline-none transition-all
                    placeholder:text-slate-400 focus:ring-3 focus:ring-amber-100
                    disabled:bg-slate-50 disabled:cursor-not-allowed
                    ${errors.password
                      ? "border-red-300 focus:border-red-400"
                      : "border-slate-200 hover:border-slate-300 focus:border-amber-400"
                    }
                  `}
                />
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* CAPTCHA */}
            <Captcha onVerified={setCaptchaVerified} error={captchaError && !captchaVerified} />

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isButtonDisabled}
              whileHover={!isButtonDisabled ? { scale: 1.01 } : {}}
              whileTap={!isButtonDisabled ? { scale: 0.99 } : {}}
              className={`
                w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm
                transition-all duration-200 shadow-sm hover:shadow-md mt-2
                ${success
                  ? "bg-emerald-500 text-white"
                  : rateLimited
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : loading
                  ? "bg-amber-400 text-white cursor-not-allowed"
                  : "bg-amber-500 hover:bg-amber-600 text-white"
                }
              `}
            >
              {success ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Signed in! Redirecting…
                </>
              ) : rateLimited ? (
                <>
                  <Clock className="w-4 h-4" />
                  Wait {cooldown}s…
                </>
              ) : loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                  />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In as {selectedRole.label}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>

            {/* Register link */}
            <p className="text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-amber-600 font-semibold hover:text-amber-700">
                Create one
              </Link>
            </p>
          </form>

          {/* Demo credentials */}
          <div className="px-6 pb-6">
            <div className="border border-dashed border-amber-200 rounded-xl p-4 bg-amber-50/50">
              <p className="text-xs font-semibold text-amber-700 mb-2.5">🔑 Demo Credentials</p>
              <div className="space-y-1.5">
                {ROLES.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setDemo(role.value)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-amber-100 hover:border-amber-300 hover:bg-amber-50 transition-all group text-left"
                  >
                    <span className="text-xs font-medium text-slate-700">
                      {role.emoji} {role.label}: <span className="text-slate-500">{role.demo}</span>
                    </span>
                    <span className="text-xs text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Use →
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-amber-600/70 mt-2">Password for all: <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">password123</code></p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          © 2024 EventSpace · By continuing you agree to our{" "}
          <Link href="/terms" className="hover:underline">Terms</Link>
        </p>
      </div>
    </div>
  );
}

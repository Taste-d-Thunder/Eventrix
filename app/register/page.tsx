/**
 * app/register/page.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Registration page with role selection and conditional vendor fields.
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Phone, Building2, MapPin, Tag, AlertCircle, ArrowRight, CheckCircle2, Sparkles, Check, X } from "lucide-react";
import { registerUser, getCurrentUser } from "@/lib/auth";
import { ROLE_REDIRECT } from "@/types/auth";
import type { UserRole } from "@/types/auth";
import { Captcha } from "@/components/ui/Captcha";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

const ROLES: Array<{ value: UserRole; label: string; emoji: string; description: string }> = [
  { value: "customer", label: "Customer", emoji: "🎉", description: "Order flowers" },
  { value: "vendor", label: "Vendor", emoji: "🏪", description: "Sell flowers" },
  { value: "delivery_partner", label: "Delivery", emoji: "🚗", description: "Deliver orders" },
];

const SERVICE_CATEGORIES = [
  "Venue", "Photography", "Catering", "Decoration", "DJ & Music",
  "Cake Artist", "Makeup Artist", "Transportation", "Event Management", "Other",
];

const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune",
  "Kolkata", "Jaipur", "Ahmedabad", "Surat", "Bhubaneswar",
];

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  // Vendor
  businessName: string;
  serviceCategory: string;
  city: string;
  phone: string;
}

interface FormErrors {
  [key: string]: string;
}

function validate(data: FormData): FormErrors {
  const e: FormErrors = {};
  if (!data.name.trim()) e.name = "Full name is required";
  if (!data.email) e.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Enter a valid email";
  if (!data.password) e.password = "Password is required";
  else if (data.password.length < 8) e.password = "Minimum 8 characters";
  else if (!/[A-Z]/.test(data.password)) e.password = "Must contain an uppercase letter";
  else if (!/[0-9]/.test(data.password)) e.password = "Must contain a number";
  if (data.password !== data.confirmPassword) e.confirmPassword = "Passwords do not match";
  if (data.role === "vendor") {
    if (!data.businessName.trim()) e.businessName = "Business name is required";
    if (!data.serviceCategory) e.serviceCategory = "Please select a category";
    if (!data.city) e.city = "Please select a city";
    if (!data.phone) e.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(data.phone.replace(/\s/g, ""))) e.phone = "Enter a valid 10-digit number";
  }
  return e;
}

// Password strength checker
function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 2) return { score, label: "Fair", color: "bg-amber-500" };
  if (score <= 3) return { score, label: "Good", color: "bg-blue-500" };
  return { score, label: "Strong", color: "bg-emerald-500" };
}

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    name: "", email: "", password: "", confirmPassword: "",
    role: "customer", businessName: "", serviceCategory: "", city: "", phone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) router.replace(ROLE_REDIRECT[user.role]);
  }, [router]);

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions

    // CAPTCHA check
    if (!captchaVerified) {
      setCaptchaError(true);
      return;
    }

    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitError("");
    setLoading(true);

    try {
      const user = registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        ...(form.role === "vendor" && {
          businessName: form.businessName,
          serviceCategory: form.serviceCategory,
          city: form.city,
          phone: form.phone,
        }),
      });
      document.cookie = `es_session=${encodeURIComponent(JSON.stringify({ role: user.role, id: user.id }))}; path=/; max-age=86400`;
      setSuccess(true);
      setTimeout(() => router.push(ROLE_REDIRECT[user.role]), 900);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Registration failed.");
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full pl-10 pr-4 py-3 text-sm text-slate-900 border rounded-xl outline-none transition-all placeholder:text-slate-400 focus:ring-3 focus:ring-amber-100 ${
      errors[field] ? "border-red-300 focus:border-red-400" : "border-slate-200 hover:border-slate-300 focus:border-amber-400"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 flex items-center justify-center p-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-orange-100/30 blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
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
              <span className="text-2xl font-bold text-slate-900">Event<span className="text-amber-500">Space</span></span>
            </Link>
          </div>
          <p className="mt-2 text-sm text-slate-500">Create your account</p>
        </motion.div>

        {/* Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">

          {/* Role Tabs */}
          <div className="p-6 pb-0">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">I want to</p>
            <div className="grid grid-cols-3 gap-3">
              {ROLES.map((role) => (
                <button key={role.value} type="button"
                  onClick={() => { setForm((f) => ({ ...f, role: role.value })); setErrors({}); }}
                  className={`flex flex-col items-center gap-1.5 py-4 px-3 rounded-xl border-2 transition-all cursor-pointer ${
                    form.role === role.value
                      ? role.value === "vendor" ? "bg-blue-50 border-blue-400" : "bg-emerald-50 border-emerald-400"
                      : "border-slate-100 bg-slate-50 hover:border-slate-200"
                  }`}>
                  <span className="text-2xl">{role.emoji}</span>
                  <span className={`font-semibold text-sm ${
                    form.role === role.value
                      ? role.value === "vendor" ? "text-blue-700" : "text-emerald-700"
                      : "text-slate-600"
                  }`}>{role.label}</span>
                  <span className="text-xs text-slate-500">{role.description}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
            {/* Submit error */}
            <ErrorBanner
              message={submitError}
              type="error"
              visible={!!submitError}
              onDismiss={() => setSubmitError("")}
            />

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Full Name <span className="text-red-400">*</span></label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" value={form.name} onChange={set("name")} placeholder="Priya Sharma" autoComplete="name" className={inputClass("name")} />
              </div>
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Email Address <span className="text-red-400">*</span></label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" value={form.email} onChange={set("email")} placeholder="priya@example.com" autoComplete="email" className={inputClass("email")} />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Password <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="password" value={form.password} onChange={set("password")} placeholder="Min 8 chars" className={inputClass("password")} />
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Confirm <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="password" value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Repeat" className={inputClass("confirmPassword")} />
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Password strength indicator */}
            {form.password && (() => {
              const strength = getPasswordStrength(form.password);
              const rules = [
                { met: form.password.length >= 8, label: "8+ characters" },
                { met: /[A-Z]/.test(form.password), label: "Uppercase letter" },
                { met: /[0-9]/.test(form.password), label: "Number" },
              ];
              return (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${(strength.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-bold ${strength.color.replace('bg-', 'text-')}`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    {rules.map((rule) => (
                      <span key={rule.label} className={`flex items-center gap-1 text-[10px] font-medium ${rule.met ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {rule.met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {rule.label}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Vendor-specific fields */}
            <AnimatePresence>
              {form.role === "vendor" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }} className="space-y-4 overflow-hidden">
                  <div className="pt-2 pb-1 border-t border-dashed border-blue-200">
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Business Details</p>
                  </div>

                  {/* Business Name */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Business Name <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" value={form.businessName} onChange={set("businessName")} placeholder="Petal & Plume Events" className={inputClass("businessName")} />
                    </div>
                    {errors.businessName && <p className="text-xs text-red-500">{errors.businessName}</p>}
                  </div>

                  {/* Category + City */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Category <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <select value={form.serviceCategory} onChange={set("serviceCategory")}
                          className={`${inputClass("serviceCategory")} appearance-none cursor-pointer`}>
                          <option value="">Select…</option>
                          {SERVICE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      {errors.serviceCategory && <p className="text-xs text-red-500">{errors.serviceCategory}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">City <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <select value={form.city} onChange={set("city")}
                          className={`${inputClass("city")} appearance-none cursor-pointer`}>
                          <option value="">Select…</option>
                          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Phone Number <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="tel" value={form.phone} onChange={set("phone")} placeholder="9876543210" className={inputClass("phone")} />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CAPTCHA */}
            <Captcha onVerified={setCaptchaVerified} error={captchaError && !captchaVerified} />

            {/* Submit */}
            <motion.button type="submit" disabled={loading || success}
              whileHover={!loading && !success ? { scale: 1.01 } : {}} whileTap={!loading && !success ? { scale: 0.99 } : {}}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md mt-2 ${
                success ? "bg-emerald-500 text-white" : loading ? "bg-amber-400 text-white cursor-not-allowed" : "bg-amber-500 hover:bg-amber-600 text-white"
              }`}>
              {success ? (
                <><CheckCircle2 className="w-4 h-4" />Account created! Redirecting…</>
              ) : loading ? (
                <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />Creating account…</>
              ) : (
                <>Create {form.role === "vendor" ? "Vendor" : form.role === "delivery_partner" ? "Delivery" : "Customer"} Account<ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>

            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="text-amber-600 font-semibold hover:text-amber-700">Sign in</Link>
            </p>
          </form>
        </motion.div>
        <p className="text-center text-xs text-slate-400 mt-6">© 2024 EventSpace</p>
      </div>
    </div>
  );
}

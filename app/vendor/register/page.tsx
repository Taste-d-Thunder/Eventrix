/**
 * app/vendor/register/page.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Dedicated vendor registration page with all business fields.
 * Redirects to /vendor/dashboard after successful registration.
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Tag, MapPin, Phone, Mail, Lock, User,
  CheckCircle2, ArrowRight, Sparkles, AlertCircle,
  Star, Shield, Clock
} from "lucide-react";
import { registerUser } from "@/lib/auth";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICE_CATEGORIES = [
  "Venue", "Photography", "Catering", "Decoration", "DJ & Music",
  "Cake Artist", "Makeup Artist", "Transportation", "Event Management",
  "Florist", "Sound & Lighting", "Invitation Designer", "Other",
];

const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune",
  "Kolkata", "Jaipur", "Ahmedabad", "Surat", "Kochi", "Chandigarh", "Bhubaneswar",
];

const BENEFITS = [
  { icon: Star, text: "Get discovered by thousands of customers" },
  { icon: Shield, text: "Verified vendor badge builds trust" },
  { icon: Clock, text: "Manage bookings from one dashboard" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  businessName: string;
  serviceCategory: string;
  city: string;
  description: string;
}

interface FormErrors { [key: string]: string }

function validate(data: FormData): FormErrors {
  const e: FormErrors = {};
  if (!data.name.trim()) e.name = "Your full name is required";
  if (!data.email) e.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Invalid email format";
  if (!data.phone) e.phone = "Phone number is required";
  else if (!/^[6-9]\d{9}$/.test(data.phone.replace(/\s/g, ""))) e.phone = "Enter valid 10-digit number";
  if (!data.password) e.password = "Password required";
  else if (data.password.length < 6) e.password = "Minimum 6 characters";
  if (data.password !== data.confirmPassword) e.confirmPassword = "Passwords don't match";
  if (!data.businessName.trim()) e.businessName = "Business name is required";
  if (!data.serviceCategory) e.serviceCategory = "Please select a category";
  if (!data.city) e.city = "Please select your city";
  return e;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VendorRegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
    businessName: "", serviceCategory: "", city: "", description: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (!agreed) { setSubmitError("Please agree to the Terms & Conditions."); return; }
    setErrors({});
    setSubmitError("");
    setLoading(true);

    try {
      const user = registerUser({
        name: form.name, email: form.email, password: form.password,
        role: "vendor",
        businessName: form.businessName,
        serviceCategory: form.serviceCategory,
        city: form.city,
        phone: form.phone,
      });
      document.cookie = `es_session=${encodeURIComponent(JSON.stringify({ role: user.role, id: user.id }))}; path=/; max-age=86400`;
      setSuccess(true);
      setTimeout(() => router.push("/vendor/dashboard"), 900);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Registration failed.");
      setLoading(false);
    }
  };

  const fieldClass = (name: string) =>
    `w-full pl-10 pr-4 py-3 text-sm text-slate-900 border rounded-xl outline-none transition-all placeholder:text-slate-400 focus:ring-3 focus:ring-amber-100 ${
      errors[name] ? "border-red-300 focus:border-red-400 bg-red-50" : "border-slate-200 hover:border-slate-300 focus:border-amber-400 bg-white"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">

      {/* Left panel — Benefits */}
      <div className="hidden lg:flex lg:w-2/5 xl:w-1/3 flex-col justify-between p-10 border-r border-white/10">
        <div>
          <div className="flex flex-col items-start gap-4 mb-16">
            <button 
              onClick={() => router.back()}
              className="text-sm text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              ← Back
            </button>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-white text-lg font-bold">Event<span className="text-amber-400">Space</span></span>
            </Link>
          </div>

          <div className="space-y-3 mb-10">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">For Vendors</p>
            <h2 className="text-3xl font-bold text-white leading-tight">
              Grow your event business with us
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Join 2,000+ verified vendors on India's fastest-growing event marketplace. Reach customers who are actively searching for your services.
            </p>
          </div>

          <div className="space-y-4">
            {BENEFITS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-slate-300 text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex gap-1 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
          </div>
          <p className="text-slate-300 text-sm leading-relaxed italic mb-3">
            "Listing on EventSpace tripled our monthly inquiries. The dashboard is easy and the customers are serious."
          </p>
          <div className="flex items-center gap-2.5">
            <img src="https://i.pravatar.cc/40?img=5" alt="Priya" className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-400/30" />
            <div>
              <p className="text-white text-xs font-semibold">Priya Mehta</p>
              <p className="text-slate-500 text-xs">Decorator · Mumbai</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — Form */}
      <div className="flex-1 flex items-start justify-center overflow-y-auto p-4 py-10">
        <div className="w-full max-w-lg">
          {/* Mobile logo */}
          <Link href="/" className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">Event<span className="text-amber-400">Space</span></span>
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Register as a Vendor</h1>
            <p className="text-slate-400 text-sm mt-1.5">Already a vendor? <Link href="/login" className="text-amber-400 hover:text-amber-300 font-medium">Sign in</Link></p>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-2xl p-7 space-y-5">
            <AnimatePresence>
              {submitError && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="text-sm text-red-600">{submitError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Section: Personal Info */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Personal Information</p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Full Name <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={form.name} onChange={set("name")} placeholder="Your full name" className={fieldClass("name")} />
                  </div>
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Email <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" className={fieldClass("email")} />
                    </div>
                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Phone <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="tel" value={form.phone} onChange={set("phone")} placeholder="9876543210" className={fieldClass("phone")} />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Password <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="password" value={form.password} onChange={set("password")} placeholder="Min 6 chars" className={fieldClass("password")} />
                    </div>
                    {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Confirm <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="password" value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Repeat" className={fieldClass("confirmPassword")} />
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Business Info */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 pt-2 border-t border-dashed border-slate-200">Business Details</p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Business Name <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={form.businessName} onChange={set("businessName")} placeholder="Your Business Name" className={fieldClass("businessName")} />
                  </div>
                  {errors.businessName && <p className="text-xs text-red-500">{errors.businessName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Category <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <select value={form.serviceCategory} onChange={set("serviceCategory")}
                        className={`${fieldClass("serviceCategory")} appearance-none cursor-pointer`}>
                        <option value="">Select…</option>
                        {SERVICE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    {errors.serviceCategory && <p className="text-xs text-red-500">{errors.serviceCategory}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">City <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <select value={form.city} onChange={set("city")}
                        className={`${fieldClass("city")} appearance-none cursor-pointer`}>
                        <option value="">Select…</option>
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Business Description <span className="text-slate-400 font-normal">(optional)</span></label>
                  <textarea value={form.description} onChange={set("description")} rows={3}
                    placeholder="Tell customers about your services, experience, and specialties…"
                    className="w-full px-4 py-3 text-sm text-slate-900 border border-slate-200 hover:border-slate-300 focus:border-amber-400 rounded-xl outline-none focus:ring-3 focus:ring-amber-100 transition-all resize-none placeholder:text-slate-400" />
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-slate-300 text-amber-500 focus:ring-amber-400 cursor-pointer shrink-0" />
              <span className="text-xs text-slate-500 leading-relaxed">
                I agree to EventSpace's{" "}
                <Link href="/terms" className="text-amber-600 hover:underline">Terms of Service</Link> and{" "}
                <Link href="/privacy" className="text-amber-600 hover:underline">Privacy Policy</Link>.
                I confirm that all business information provided is accurate.
              </span>
            </label>

            {/* Submit */}
            <motion.button type="button" onClick={handleSubmit} disabled={loading || success}
              whileHover={!loading && !success ? { scale: 1.01 } : {}} whileTap={!loading && !success ? { scale: 0.99 } : {}}
              className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm ${
                success ? "bg-emerald-500 text-white" : loading ? "bg-amber-400 text-white cursor-not-allowed" : "bg-amber-500 hover:bg-amber-600 text-white hover:shadow-md"
              }`}>
              {success ? (
                <><CheckCircle2 className="w-4 h-4" />Registered! Taking you to your dashboard…</>
              ) : loading ? (
                <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />Creating your account…</>
              ) : (
                <>Register as Vendor <ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

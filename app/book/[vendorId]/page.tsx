/**
 * app/book/[vendorId]/page.tsx — Booking form
 */

"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  MapPin,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { vendors } from "@/lib/data";

const EVENT_TYPES = [
  "Birthday",
  "Anniversary",
  "Wedding",
  "Congratulations",
  "Get Well Soon",
  "Thank You",
  "Just Because",
  "Other",
];

interface BookingForm {
  eventType: string;
  date: string;
  guests: string;
  venue: string;
  message: string;
  name: string;
  email: string;
  phone: string;
}

export default function BookingPage() {
  const { vendorId } = useParams<{ vendorId: string }>();
  const router = useRouter();

  const vendor = vendors.find((v) => v.id === vendorId);

  const [form, setForm] = useState<BookingForm>({
    eventType: "",
    date: "",
    guests: "",
    venue: "",
    message: "",
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set =
    (key: keyof BookingForm) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      if (errors[key])
        setErrors((prev) => {
          const n = { ...prev };
          delete n[key];
          return n;
        });
    };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    if (!form.phone) e.phone = "Phone is required";
    if (!form.eventType) e.eventType = "Select an event type";
    if (!form.date) e.date = "Select a date";
    if (!form.guests) e.guests = "Enter number of guests";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // Store booking details in sessionStorage for the payment page
    sessionStorage.setItem(
      "es_booking",
      JSON.stringify({
        vendorId,
        vendorName: vendor?.name || "Vendor",
        ...form,
        amount: vendor?.startingPrice || 25000,
      })
    );

    router.push(`/book/${vendorId}/payment`);
  };

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Vendor Not Found
          </h2>
          <p className="text-slate-500 mb-4">
            The flower shop you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/vendors"
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            ← Browse Flower Shops
          </Link>
        </div>
      </div>
    );
  }

  const inputClass = (field: string) =>
    `w-full pl-10 pr-4 py-3 text-sm text-slate-900 border rounded-xl outline-none transition-all placeholder:text-slate-400 focus:ring-3 focus:ring-amber-100 ${
      errors[field]
        ? "border-red-300 focus:border-red-400"
        : "border-slate-200 hover:border-slate-300 focus:border-amber-400"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 py-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to vendor
          </button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
        >
          {/* Vendor banner */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-xs font-medium">
                Booking with
              </p>
              <h2 className="text-white text-lg font-bold">{vendor.name}</h2>
              <p className="text-white/70 text-xs">
                {vendor.location} · Starting at ₹
                {(vendor.startingPrice / 1000).toFixed(0)}K
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Contact Info */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Your Details
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={set("name")}
                      placeholder="Your name"
                      className={inputClass("name")}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Phone <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="9876543210"
                      className={inputClass("phone")}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-500">{errors.phone}</p>
                  )}
                </div>
              </div>
              <div className="space-y-1.5 mt-3">
                <label className="text-sm font-medium text-slate-700">
                  Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="you@example.com"
                    className={inputClass("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Event Details */}
            <div className="pt-2 border-t border-dashed border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Event Details
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Event Type <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <select
                      value={form.eventType}
                      onChange={set("eventType")}
                      className={`${inputClass("eventType")} appearance-none cursor-pointer`}
                    >
                      <option value="">Select…</option>
                      {EVENT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.eventType && (
                    <p className="text-xs text-red-500">{errors.eventType}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Event Date <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="date"
                      value={form.date}
                      onChange={set("date")}
                      className={inputClass("date")}
                    />
                  </div>
                  {errors.date && (
                    <p className="text-xs text-red-500">{errors.date}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Number of Guests <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={form.guests}
                      onChange={set("guests")}
                      placeholder="e.g. 150"
                      className={inputClass("guests")}
                    />
                  </div>
                  {errors.guests && (
                    <p className="text-xs text-red-500">{errors.guests}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Venue / Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={form.venue}
                      onChange={set("venue")}
                      placeholder="e.g. Taj Hotel, Mumbai"
                      className={inputClass("venue")}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Special Requirements{" "}
                <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={form.message}
                onChange={set("message")}
                rows={3}
                placeholder="Tell us about your flower preferences, colour choices, delivery instructions…"
                className="w-full px-4 py-3 text-sm text-slate-900 border border-slate-200 hover:border-slate-300 focus:border-amber-400 rounded-xl outline-none focus:ring-3 focus:ring-amber-100 transition-all resize-none placeholder:text-slate-400"
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all"
            >
              Proceed to Payment <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

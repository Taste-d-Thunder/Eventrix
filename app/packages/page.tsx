/**
 * app/packages/page.tsx — Browse vendor packages & pricing tiers
 */

"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Star, ArrowRight, Sparkles } from "lucide-react";

const PACKAGES = [
  {
    name: "Essential",
    price: "₹25,000",
    period: "per event",
    description: "Perfect for intimate gatherings and small celebrations.",
    color: "from-slate-600 to-slate-800",
    badge: null,
    features: [
      "Basic venue decoration",
      "Up to 50 guests",
      "3-hour event coverage",
      "Standard catering menu",
      "Background music setup",
      "Event coordinator on-site",
    ],
  },
  {
    name: "Premium",
    price: "₹75,000",
    period: "per event",
    description: "The most popular choice for weddings & corporate events.",
    color: "from-amber-500 to-orange-600",
    badge: "Most Popular",
    features: [
      "Designer venue decoration",
      "Up to 200 guests",
      "Full-day event coverage",
      "Multi-cuisine catering",
      "DJ & sound system",
      "Photography & videography",
      "Dedicated event manager",
      "Custom invitation design",
    ],
  },
  {
    name: "Luxury",
    price: "₹2,00,000",
    period: "per event",
    description: "A bespoke, white-glove experience for grand celebrations.",
    color: "from-violet-600 to-indigo-700",
    badge: "Best Value",
    features: [
      "Everything in Premium",
      "Up to 500+ guests",
      "Celebrity chef catering",
      "Cinematic film production",
      "Live band & entertainment",
      "Luxury transport for VIPs",
      "Fireworks / LED show",
      "48-hour on-site team",
      "Post-event highlight reel",
    ],
  },
];

export default function PackagesPage() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="text-amber-600 font-semibold text-sm tracking-wider uppercase mb-3">
            Transparent Pricing
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
            Choose Your Package
          </h1>
          <p className="mt-4 text-slate-600 text-lg max-w-2xl mx-auto">
            From intimate gatherings to grand celebrations — find the perfect
            package for your event.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {PACKAGES.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              className={`relative rounded-2xl bg-white border overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col ${
                pkg.badge === "Most Popular"
                  ? "border-amber-300 ring-2 ring-amber-200"
                  : "border-slate-100"
              }`}
            >
              {/* Badge */}
              {pkg.badge && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    {pkg.badge}
                  </span>
                </div>
              )}

              {/* Header */}
              <div
                className={`bg-gradient-to-br ${pkg.color} px-6 py-8 text-white`}
              >
                <h3 className="text-lg font-semibold opacity-90">{pkg.name}</h3>
                <p className="text-3xl font-bold mt-2">{pkg.price}</p>
                <p className="text-sm opacity-70 mt-0.5">{pkg.period}</p>
              </div>

              {/* Body */}
              <div className="px-6 pt-6 pb-4 flex-1">
                <p className="text-sm text-slate-600 mb-5">{pkg.description}</p>
                <ul className="space-y-3">
                  {pkg.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-slate-700"
                    >
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="px-6 pb-6 pt-2">
                <Link href="/vendors">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md ${
                      pkg.badge === "Most Popular"
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                    }`}
                  >
                    Browse Vendors <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-slate-500 mt-12"
        >
          All packages are customizable. Contact our team for a personalized
          quote.
        </motion.p>
      </div>
    </section>
  );
}

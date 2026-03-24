// ─── How It Works Section ─────────────────────────────────────────────────────

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Flower2, CreditCard, Truck } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Browse Flowers",
    description:
      "Explore fresh roses, bouquets, luxury arrangements and more from 500+ verified flower shops across 10 cities.",
    color: "#F97316",
    bg: "#FFF7ED",
  },
  {
    icon: Flower2,
    step: "02",
    title: "Pick Your Arrangement",
    description:
      "Choose from curated collections or request a custom bouquet. Compare prices, reviews, and delivery times.",
    color: "#EC4899",
    bg: "#FDF2F8",
  },
  {
    icon: CreditCard,
    step: "03",
    title: "Order & Pay Securely",
    description:
      "Place your order with secure payment. Add a personalised message card for that special touch.",
    color: "#10B981",
    bg: "#ECFDF5",
  },
  {
    icon: Truck,
    step: "04",
    title: "Fresh Delivery!",
    description:
      "Track your delivery partner in real-time. Fresh flowers arrive at your door — guaranteed.",
    color: "#8B5CF6",
    bg: "#F5F3FF",
  },
];

export function HowItWorksSection() {
  return (
    <Section id="how-it-works" className="bg-white">
      <SectionHeader
        eyebrow="Simple process"
        title="How It Works"
        subtitle="From browsing to doorstep delivery — getting fresh flowers has never been easier."
        align="center"
      />

      <div className="relative">
        {/* Connecting line (desktop) */}
        <div className="absolute top-14 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent hidden md:block" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col items-center text-center"
            >
              {/* Icon Container */}
              <div className="relative mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: step.bg }}
                >
                  <step.icon className="w-7 h-7" style={{ color: step.color }} />
                </div>
                {/* Step Number */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-obsidian text-white text-xs font-bold rounded-full flex items-center justify-center font-body">
                  {i + 1}
                </div>
              </div>

              <h3 className="font-semibold text-lg text-slate-900 font-body mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 font-body leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

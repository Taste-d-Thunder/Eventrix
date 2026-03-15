// ─── How It Works Section ─────────────────────────────────────────────────────

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, MessageCircle, CalendarCheck, PartyPopper } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Browse & Filter",
    description:
      "Search from 2,000+ verified vendors across 7 categories and 15 cities. Use filters to narrow by price, rating, and availability.",
    color: "#F97316",
    bg: "#FFF7ED",
  },
  {
    icon: MessageCircle,
    step: "02",
    title: "Connect & Discuss",
    description:
      "Chat directly with vendors. Share your vision, ask questions, and get custom quotes — all within the platform.",
    color: "#3B82F6",
    bg: "#EFF6FF",
  },
  {
    icon: CalendarCheck,
    step: "03",
    title: "Book Securely",
    description:
      "Confirm your booking with a secure deposit. Your payment is protected until the event is complete.",
    color: "#10B981",
    bg: "#ECFDF5",
  },
  {
    icon: PartyPopper,
    step: "04",
    title: "Celebrate!",
    description:
      "Enjoy your perfectly planned event. Afterward, share your experience with an honest review.",
    color: "#8B5CF6",
    bg: "#F5F3FF",
  },
];

export function HowItWorksSection() {
  return (
    <Section id="how-it-works" className="bg-white">
      <SectionHeader
        eyebrow="Simple process"
        title="How EventSpace Works"
        subtitle="From discovery to your event day — a seamless experience designed to make planning effortless."
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

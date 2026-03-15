// ─── Testimonials Section ─────────────────────────────────────────────────────

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { testimonials } from "@/lib/data";
import { Section, SectionHeader, Avatar } from "@/components/ui";

export function TestimonialsSection() {
  return (
    <Section className="bg-gradient-to-br from-obsidian to-[#1a1207]">
      <SectionHeader
        eyebrow="Love stories"
        title="What Our Couples Say"
        subtitle="Real experiences from real celebrations across India."
        align="center"
        className="[&_h2]:text-white [&_p]:text-slate-400 [&_p:first-child]:text-brand-400"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-colors"
          >
            {/* Quote Icon */}
            <Quote className="w-8 h-8 text-brand-500/40 mb-4 fill-brand-500/20" />

            {/* Quote Text */}
            <p className="text-slate-300 font-body text-sm leading-relaxed mb-6 italic">
              &ldquo;{t.quote}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <Avatar src={t.avatar} alt={t.name} size="md" />
              <div>
                <p className="font-semibold text-white text-sm font-body">{t.name}</p>
                <p className="text-slate-500 text-xs font-body">{t.event}</p>
              </div>
            </div>

            {/* Location Tag */}
            <div className="absolute top-6 right-6 px-2.5 py-1 bg-white/10 rounded-full text-xs text-slate-400 font-body">
              📍 {t.location}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

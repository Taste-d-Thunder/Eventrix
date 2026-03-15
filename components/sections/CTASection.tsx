// ─── CTA Section ─────────────────────────────────────────────────────────────

"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button, Section } from "@/components/ui";

export function CTASection() {
  return (
    <Section className="bg-ivory">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 rounded-3xl px-8 py-16 text-center"
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-900/30 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>

          <h2 className="font-display text-4xl md:text-5xl text-white font-semibold mb-4 leading-tight">
            Start Planning Your
            <br />
            <span className="italic">Dream Event</span>
          </h2>

          <p className="text-brand-100 font-body text-lg mb-8 max-w-md mx-auto leading-relaxed">
            Join 50,000+ happy couples and event planners who found their perfect vendors on EventSpace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-brand-700 hover:bg-brand-50 w-full sm:w-auto"
            >
              Browse Vendors
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10 border border-white/30 w-full sm:w-auto"
            >
              List Your Service
            </Button>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

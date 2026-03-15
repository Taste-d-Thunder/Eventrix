// ─── Categories Section ───────────────────────────────────────────────────────
// Animated grid of service categories with hover effects

"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/data";
import { Section, SectionHeader } from "@/components/ui";

export function CategoriesSection() {
  return (
    <Section id="categories" className="bg-white">
      <SectionHeader
        eyebrow="What are you looking for?"
        title="Browse by Category"
        subtitle="Discover trusted professionals for every aspect of your event — all in one place."
        align="center"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category, i) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <Link href={`/vendors?category=${category.id}`}>
              <div className="group relative overflow-hidden rounded-2xl p-6 border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-card-hover transition-all duration-300 cursor-pointer">
                {/* Background accent on hover */}
                <div
                  className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ backgroundColor: category.color }}
                />

                {/* Icon */}
                <div
                  className="text-3xl mb-4 w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  {category.icon}
                </div>

                {/* Label */}
                <h3 className="font-semibold text-slate-900 font-body mb-1 group-hover:text-brand-700 transition-colors">
                  {category.label}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-500 font-body mb-3">{category.description}</p>

                {/* Count + Arrow */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400 font-body">
                    {category.vendorCount} vendors
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

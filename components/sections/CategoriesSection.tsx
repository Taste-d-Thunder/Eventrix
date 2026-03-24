// ─── Categories Section ───────────────────────────────────────────────────────
// Animated grid of flower categories with hover effects

"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui";

const FLOWER_CATEGORIES = [
  {
    id: "roses",
    label: "Roses",
    icon: "🌹",
    description: "Classic red, pink & white roses",
    vendorCount: 145,
    color: "#EF4444",
  },
  {
    id: "bouquets",
    label: "Bouquets",
    icon: "💐",
    description: "Curated mixed-flower bouquets",
    vendorCount: 230,
    color: "#EC4899",
  },
  {
    id: "birthday",
    label: "Birthday Flowers",
    icon: "🎂",
    description: "Bright & cheerful arrangements",
    vendorCount: 189,
    color: "#F59E0B",
  },
  {
    id: "anniversary",
    label: "Anniversary Flowers",
    icon: "💕",
    description: "Romantic & elegant designs",
    vendorCount: 112,
    color: "#8B5CF6",
  },
  {
    id: "luxury",
    label: "Luxury Flowers",
    icon: "✨",
    description: "Premium orchids & exotic stems",
    vendorCount: 78,
    color: "#10B981",
  },
  {
    id: "sympathy",
    label: "Sympathy & Condolence",
    icon: "🤍",
    description: "Peaceful & comforting tributes",
    vendorCount: 64,
    color: "#6B7280",
  },
  {
    id: "wedding",
    label: "Wedding Flowers",
    icon: "💍",
    description: "Bridal bouquets & ceremony decor",
    vendorCount: 198,
    color: "#F97316",
  },
  {
    id: "indoor",
    label: "Indoor Plants",
    icon: "🪴",
    description: "Green plants & succulents",
    vendorCount: 156,
    color: "#22C55E",
  },
];

export function CategoriesSection() {
  return (
    <Section id="categories" className="bg-white">
      <SectionHeader
        eyebrow="What are you looking for?"
        title="Browse by Category"
        subtitle="Discover fresh flowers for every occasion — delivered right to your doorstep."
        align="center"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FLOWER_CATEGORIES.map((category, i) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <Link href={`/flowers?category=${category.id}`}>
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
                    {category.vendorCount} sellers
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

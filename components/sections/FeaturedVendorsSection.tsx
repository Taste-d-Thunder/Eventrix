// ─── Featured Vendors Section ─────────────────────────────────────────────────
// Horizontal scroll carousel of featured vendors

"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getFeaturedVendors } from "@/lib/data";
import { Section, SectionHeader, Button } from "@/components/ui";
import { VendorCard } from "@/components/cards/VendorCard";
import { useWishlist } from "@/hooks";

export function FeaturedVendorsSection() {
  const vendors = getFeaturedVendors();
  const { isWishlisted, toggle } = useWishlist();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -350 : 350, behavior: "smooth" });
    }
  };

  return (
    <Section className="bg-ivory overflow-hidden">
      <div className="flex items-end justify-between mb-10">
        <SectionHeader
          eyebrow="Freshly picked for you"
          title="Top Flower Shops"
          subtitle="Handpicked florists who consistently deliver stunning arrangements."
          className="mb-0"
        />

        <div className="flex items-center gap-2 shrink-0">
          {/* Scroll Controls */}
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:border-brand-300 hover:text-brand-600 transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:border-brand-300 hover:text-brand-600 transition-all shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <Link href="/vendors" className="ml-2 hidden md:block">
            <Button variant="outline" size="md">
              View All
            </Button>
          </Link>
        </div>
      </div>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scroll-container pb-4 -mx-4 px-4"
      >
        {vendors.map((vendor, i) => (
          <div key={vendor.id} className="w-[300px] shrink-0">
            <VendorCard
              vendor={vendor}
              index={i}
              isWishlisted={isWishlisted(vendor.id)}
              onWishlistToggle={toggle}
            />
          </div>
        ))}
      </div>

      {/* Mobile CTA */}
      <div className="mt-8 md:hidden text-center">
        <Link href="/vendors">
          <Button variant="outline">View All Flower Shops</Button>
        </Link>
      </div>
    </Section>
  );
}

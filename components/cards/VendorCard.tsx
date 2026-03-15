/**
 * VendorCard.tsx — UI Quality improved version
 * ─────────────────────────────────────────────────────────────────────────────
 * Part 5 improvements applied:
 *   - hover:scale-105 transition duration-300 on card
 *   - Buttons: rounded-xl shadow-md hover:shadow-lg
 *   - Section titles: text-3xl md:text-4xl font-semibold
 *   - Smooth image scale on hover
 *   - Skeleton loader for image
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, MapPin, Star, BadgeCheck, Clock, MessageCircle, Phone } from "lucide-react";
import type { Vendor } from "@/lib/data";
import { formatPrice } from "@/lib/data";
import { cn } from "@/lib/utils";

// ─── Props ────────────────────────────────────────────────────────────────────

interface VendorCardProps {
  vendor: Vendor;
  index?: number;
  isWishlisted?: boolean;
  onWishlistToggle?: (id: string) => void;
  /** Show inline chat/call action buttons on the card */
  showContactButtons?: boolean;
  onChatClick?: (vendor: Vendor) => void;
  onCallClick?: (vendor: Vendor) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function VendorCard({
  vendor,
  index = 0,
  isWishlisted = false,
  onWishlistToggle,
  showContactButtons = false,
  onChatClick,
  onCallClick,
}: VendorCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.21, 1.11, 0.81, 0.99] }}
      /*
       * Part 5: hover:scale-105 transition duration-300
       * group class lets child elements react to parent hover.
       */
      className="group relative hover:scale-105 transition duration-300"
    >
      <Link href={`/vendors/${vendor.id}`} className="block">
        <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full">

          {/* ── Image ── */}
          <div className="relative overflow-hidden aspect-[4/3]">
            {/* Skeleton */}
            {!imgLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
            )}

            <img
              src={vendor.images[currentImg]}
              alt={vendor.name}
              onLoad={() => setImgLoaded(true)}
              className={cn(
                /* Smooth image zoom on group hover */
                "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",
                imgLoaded ? "opacity-100" : "opacity-0"
              )}
            />

            {/* Image dots navigator */}
            {vendor.images.length > 1 && (
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {vendor.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.preventDefault(); setCurrentImg(i); }}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-200",
                      i === currentImg ? "w-4 bg-white" : "w-1.5 bg-white/60"
                    )}
                    aria-label={`View image ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

            {/* Featured badge */}
            {vendor.featured && (
              <span className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full shadow-sm">
                Featured
              </span>
            )}

            {/* Wishlist button */}
            <button
              onClick={(e) => { e.preventDefault(); onWishlistToggle?.(vendor.id); }}
              className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200"
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={cn("w-4 h-4 transition-colors", isWishlisted ? "fill-red-500 text-red-500" : "text-slate-600")} />
            </button>
          </div>

          {/* ── Card body ── */}
          <div className="p-4 space-y-3">
            {/* Name + rating */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <h3 className="font-semibold text-slate-900 truncate">{vendor.name}</h3>
                {vendor.verified && <BadgeCheck className="w-4 h-4 text-amber-500 shrink-0" />}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-slate-900">{vendor.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-500">({vendor.reviewCount})</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-slate-500">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="text-xs truncate">{vendor.location}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {vendor.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            {/* Price + response time */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-400">Starting from</p>
                <p className="text-base font-bold text-slate-900">
                  {formatPrice(vendor.startingPrice)}
                  <span className="text-xs text-slate-400 font-normal"> / {vendor.priceUnit}</span>
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{vendor.responseTime}</span>
              </div>
            </div>

            {/*
             * Part 5 & Part 4: Optional inline contact buttons on cards.
             * Enabled via showContactButtons prop.
             * Buttons: rounded-xl shadow-md hover:shadow-lg
             */}
            {showContactButtons && (
              <div className="flex gap-2 pt-1">
                <button
                  onClick={(e) => { e.preventDefault(); onChatClick?.(vendor); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Chat
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); onCallClick?.(vendor); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call
                </button>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function VendorCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
      <div className="aspect-[4/3] bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-200 rounded-lg w-3/4" />
        <div className="h-3 bg-slate-200 rounded-lg w-1/2" />
        <div className="flex gap-2">
          <div className="h-5 bg-slate-200 rounded-full w-16" />
          <div className="h-5 bg-slate-200 rounded-full w-20" />
        </div>
        <div className="h-4 bg-slate-200 rounded-lg w-1/3" />
      </div>
    </div>
  );
}

export default VendorCard;

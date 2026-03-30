/**
 * app/vendors/[id]/page.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Vendor detail page with anonymous chat + call buttons integrated.
 * Demonstrates Part 4 requirements: chat & call buttons below vendor info.
 * PLUS dynamic prices/packages and shop photos from local storage store.
 */

"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  BadgeCheck,
  Star,
  Clock,
  Award,
  Users,
  CheckCircle2,
  Heart,
  Share2,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { getVendorPackages, getVendorPhotos } from "@/lib/vendorStore";

// ── Import anonymous communication components ──────────────────────────────
import { ChatButton } from "@/components/ui/ChatButton";
import { AnonymousCallButton } from "@/components/ui/AnonymousCallButton";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Package {
  id: string;
  name: string;
  price: string | number;
  unit: string;
  description: string;
  includes: string[];
  popular?: boolean;
}

interface Vendor {
  id: string;
  name: string;
  maskedId: string;        // e.g. "VND-4582"  — used for anonymous comms
  category: string;
  tagline: string;
  description: string;
  location: string;
  city: string;
  rating: number;
  reviewCount: number;
  startingPrice: string;
  priceUnit: string;
  coverImage: string;
  tags: string[];
  packages: Package[];
  yearsExperience: number;
  eventsCompleted: number;
  responseTime: string;
  verified: boolean;
}

// ─── Dummy vendor data ────────────────────────────────────────────────────────

const DUMMY_VENDOR: Vendor = {
  id: "v001",
  name: "The Grand Maison",
  maskedId: "VND-4582",
  category: "Venue",
  tagline: "Timeless elegance for unforgettable celebrations",
  description:
    "Set within 5 acres of manicured gardens, The Grand Maison is Mumbai's premier luxury event venue. Our dedicated team of coordinators transforms your vision into reality. Spaces accommodate from 50 to 1,200 guests.",
  location: "Juhu, Mumbai",
  city: "Mumbai",
  rating: 4.9,
  reviewCount: 312,
  startingPrice: "₹1.5L",
  priceUnit: "per day",
  coverImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80",
  tags: ["Luxury", "Garden", "Ballroom", "In-house Catering", "Valet Parking"],
  packages: [
    {
      id: "p1",
      name: "Silver",
      price: "₹1.5L",
      unit: "per day",
      description: "Perfect for intimate celebrations",
      includes: ["Up to 200 guests", "8-hour booking", "Basic lighting", "Changing room"],
    },
    {
      id: "p2",
      name: "Gold",
      price: "₹2.8L",
      unit: "per day",
      description: "Our most popular package",
      includes: ["Up to 500 guests", "12-hour booking", "Premium lighting", "Bridal suite", "Coordinator"],
      popular: true,
    },
    {
      id: "p3",
      name: "Platinum",
      price: "₹5L",
      unit: "per day",
      description: "All-encompassing luxury",
      includes: ["Up to 1200 guests", "Full day & night", "Custom lighting", "VIP suites", "Full team"],
    },
  ],
  yearsExperience: 18,
  eventsCompleted: 2840,
  responseTime: "Within 2 hours",
  verified: true,
};

// ─── Page Component ───────────────────────────────────────────────────────────

export default function VendorDetailPage() {
  // In production, fetch vendor by params.id from your API
  const { id } = useParams<{ id: string }>();
  // We use DUMMY_VENDOR as baseline, but we will dynamically adjust based on stored vendor packages / photos
  const vendor = DUMMY_VENDOR; 

  const [activePackages, setActivePackages] = useState<any[]>(vendor.packages);
  const [activePhotos, setActivePhotos] = useState<string[]>([vendor.coverImage]);

  const [selectedPackage, setSelectedPackage] = useState(
    vendor.packages.find((p) => p.popular) || vendor.packages[0]
  );
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    // If dynamic data for this vendor ID exists in our local store, override the default data
    if (id) {
      getVendorPackages(id).then(pkgs => {
        if (pkgs && pkgs.length > 0) {
          setActivePackages(pkgs);
          setSelectedPackage(pkgs.find((p: any) => p.popular) || pkgs[0]);
        }
      });
      getVendorPhotos(id).then(photos => {
        if (photos && photos.length > 0) {
          setActivePhotos(photos);
        }
      });
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      {/* ── Breadcrumb ── */}
      <nav className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/vendors" className="hover:text-amber-600 transition-colors">Vendors</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">{vendor.name}</span>
        </div>
      </nav>

      {/* ── Cover Image / Gallery ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-8">
        {activePhotos.length > 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-[300px] md:h-[420px] rounded-2xl overflow-hidden shadow-sm">
            <div className="md:col-span-2 relative h-full">
              <img src={activePhotos[0]} alt={vendor.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="hidden md:flex flex-col gap-2 h-full">
              <div className="flex-1 relative overflow-hidden rounded-tr-2xl">
                <img src={activePhotos[1]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              {activePhotos.length > 2 ? (
                <div className="flex-1 relative overflow-hidden rounded-br-2xl">
                  <img src={activePhotos[2]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  {activePhotos.length > 3 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-black/60 transition-colors">
                      +{activePhotos.length - 3} more
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 relative bg-slate-100 rounded-br-2xl flex items-center justify-center">
                  <span className="text-sm text-slate-400 font-medium">No more photos</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="relative h-[300px] md:h-[420px] rounded-2xl overflow-hidden shadow-sm">
            <img src={activePhotos[0] || vendor.coverImage} alt={vendor.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-8">

            {/* ── Vendor Header ── */}
            <div>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  {/* Category + verified */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                      {vendor.category}
                    </span>
                    {vendor.verified && (
                      <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-1">
                    {vendor.name}
                  </h1>
                  <p className="text-slate-500 italic">{vendor.tagline}</p>
                </div>

                {/* Wishlist + Share */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:border-red-300 transition-all shadow-sm hover:shadow-md"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-slate-500"}`} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:border-slate-300 transition-all shadow-sm hover:shadow-md"
                  >
                    <Share2 className="w-4 h-4 text-slate-500" />
                  </motion.button>
                </div>
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-slate-900">{vendor.rating}</span>
                  <span className="text-slate-500 text-sm">({vendor.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                  <MapPin className="w-4 h-4" />
                  {vendor.location}
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                  <Clock className="w-4 h-4" />
                  Responds {vendor.responseTime.toLowerCase()}
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────
               * PART 4 — Anonymous Communication Buttons
               * Chat + Call buttons placed prominently below vendor info.
               * Both components manage their own modal state internally.
               * ───────────────────────────────────────────────────────────── */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                {/* Chat with Vendor → opens AnonymousChatModal */}
                <ChatButton
                  vendorName={vendor.name}
                  vendorMaskedId={vendor.maskedId}
                  vendorCategory={vendor.category}
                  size="lg"
                />

                {/* Call Vendor → opens AnonymousCallButton modal */}
                <AnonymousCallButton
                  vendorName={vendor.name}
                  vendorMaskedId={vendor.maskedId}
                  vendorCategory={vendor.category}
                  size="lg"
                />
              </div>
              {/* ── End anonymous communication buttons ── */}
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-3 gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
              {[
                { icon: Award, value: `${vendor.yearsExperience}+`, label: "Years Experience" },
                { icon: Users, value: `${vendor.eventsCompleted.toLocaleString()}+`, label: "Events Done" },
                { icon: Star, value: vendor.rating.toString(), label: "Average Rating" },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="text-center">
                  <Icon className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
                  <p className="text-2xl font-bold text-slate-900">{value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* ── Description ── */}
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-3">About</h2>
              <p className="text-slate-600 leading-relaxed">{vendor.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {vendor.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Packages ── */}
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">Packages & Options</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activePackages.map((pkg) => {
                  // Format price properly assuming number | string might be provided
                  const formattedPrice = typeof pkg.price === 'number' ? `₹${pkg.price.toLocaleString("en-IN")}` : pkg.price;
                  return (
                    <motion.div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className={`
                        relative bg-white rounded-2xl p-5 border-2 cursor-pointer
                        transition-all duration-300 shadow-sm hover:shadow-md
                        ${selectedPackage?.id === pkg.id
                          ? "border-amber-500 shadow-amber-100"
                          : "border-slate-100 hover:border-slate-200"
                        }
                      `}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-3 left-4 bg-amber-500 text-white text-xs font-semibold px-3 py-0.5 rounded-full shadow-sm">
                          Most Popular
                        </div>
                      )}
                      {selectedPackage?.id === pkg.id && (
                        <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-amber-500" />
                      )}
                      
                      {/* Optional inline package image (if provided, common for custom flower services) */}
                      {pkg.image && (
                        <div className="h-24 w-full rounded-xl overflow-hidden mb-3">
                          <img src={pkg.image} className="w-full h-full object-cover" alt={pkg.name} />
                        </div>
                      )}

                      <h3 className="font-semibold text-lg text-slate-900 mb-1">{pkg.name}</h3>
                      <p className="text-xs text-slate-500 mb-2">{pkg.description}</p>
                      <p className="text-2xl font-bold text-slate-900 mb-3">
                        {formattedPrice}
                        <span className="text-sm font-normal text-slate-500"> / {pkg.unit}</span>
                      </p>
                      <ul className="space-y-1.5">
                        {(pkg.includes || []).map((item: string) => (
                          <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── Sticky Booking Panel ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 sticky top-24">
              <p className="text-xs text-slate-500 mb-0.5">Selected Package</p>
              <p className="font-semibold text-slate-900 text-lg mb-0.5">{selectedPackage?.name}</p>
              <p className="text-3xl font-bold text-slate-900 mb-1">
                {typeof selectedPackage?.price === 'number' ? `₹${selectedPackage?.price.toLocaleString("en-IN")}` : selectedPackage?.price}
                <span className="text-sm font-normal text-slate-500"> / {selectedPackage?.unit}</span>
              </p>

              {/* Date picker */}
              <div className="border border-slate-200 rounded-xl overflow-hidden mb-4 mt-4 hover:border-amber-300 transition-colors">
                <label className="block text-xs text-slate-500 font-medium px-3 pt-2">Event Date</label>
                <input
                  type="date"
                  className="w-full px-3 pb-2.5 pt-1 text-sm text-slate-900 outline-none bg-transparent cursor-pointer"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* Book button */}
              <Link href={`/book/${id}`}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 mb-3"
                >
                  Request Booking
                </motion.button>
              </Link>

              {/* Inline chat + call in booking panel */}
              <div className="flex gap-2">
                <ChatButton
                  vendorName={vendor.name}
                  vendorMaskedId={vendor.maskedId}
                  vendorCategory={vendor.category}
                  size="sm"
                  iconOnly={false}
                />
                <AnonymousCallButton
                  vendorName={vendor.name}
                  vendorMaskedId={vendor.maskedId}
                  vendorCategory={vendor.category}
                  size="sm"
                  iconOnly={false}
                />
              </div>

              <p className="text-xs text-center text-slate-400 mt-3">
                No charges until confirmed · Free cancellation
              </p>

              {/* Trust indicators */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                {[
                  "Verified vendor · 100% authentic reviews",
                  "Secure payments with buyer protection",
                  "Anonymous comms · Your data stays private",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-xs text-slate-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

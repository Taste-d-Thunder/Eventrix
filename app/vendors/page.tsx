// ─── Vendors Listing Page ─────────────────────────────────────────────────────
// Filterable, searchable vendor grid with category sidebar

"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { categories, VendorCategory } from "@/lib/data";
import { useVendorFilter, useWishlist } from "@/hooks";
import { VendorCard, VendorCardSkeleton } from "@/components/cards/VendorCard";
import { Button, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

function VendorsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as VendorCategory | null;

  const {
    vendors,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    selectedCity,
    setSelectedCity,
    total,
  } = useVendorFilter(initialCategory || undefined);

  const { isWishlisted, toggle } = useWishlist();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading] = useState(false);

  const cities = ["all", "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Bhubaneswar"];

  const activeFilters = [
    selectedCategory !== "all" && categories.find((c) => c.id === selectedCategory)?.label,
    selectedCity !== "all" && selectedCity,
    searchQuery && `"${searchQuery}"`,
  ].filter(Boolean) as string[];

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-sm text-slate-900 font-body mb-3 uppercase tracking-wider">
          Category
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-body transition-all",
              selectedCategory === "all"
                ? "bg-brand-50 text-brand-700 font-semibold"
                : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <span>All Categories</span>
            <span className="text-xs text-slate-400">{total}</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as VendorCategory)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-body transition-all",
                selectedCategory === cat.id
                  ? "bg-brand-50 text-brand-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <span className="flex items-center gap-2">
                {cat.icon} {cat.label}
              </span>
              <span className="text-xs text-slate-400">{cat.vendorCount}</span>
            </button>
          ))}
        </div>
      </div>

      {/* City Filter */}
      <div>
        <h3 className="font-semibold text-sm text-slate-900 font-body mb-3 uppercase tracking-wider">
          City
        </h3>
        <div className="space-y-1">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-xl text-sm font-body transition-all",
                selectedCity === city
                  ? "bg-brand-50 text-brand-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              {city === "all" ? "All Cities" : city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ivory pt-20">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-obsidian mb-2">
            Browse Vendors
          </h1>
          <p className="text-slate-500 font-body">
            {total} verified vendors available
          </p>

          {/* Search + Sort Bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-brand-400 focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vendors or services..."
                className="flex-1 bg-transparent text-sm font-body outline-none text-slate-900 placeholder-slate-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-700" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="appearance-none pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-body text-slate-700 outline-none hover:border-slate-300 cursor-pointer"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                size="md"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <Badge key={filter} variant="brand" className="gap-1.5 py-1 px-3">
                  {filter}
                  <button
                    onClick={() => {
                      if (filter === selectedCity) setSelectedCity("all");
                      if (filter === categories.find((c) => c.id === selectedCategory)?.label)
                        setSelectedCategory("all");
                      if (filter.startsWith('"')) setSearchQuery("");
                    }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedCity("all");
                  setSearchQuery("");
                }}
                className="text-xs text-slate-500 hover:text-red-500 font-body transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card-base sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          {/* Vendor Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <VendorCardSkeleton key={i} />
                ))}
              </div>
            ) : vendors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {vendors.map((vendor, i) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                    index={i}
                    isWishlisted={isWishlisted(vendor.id)}
                    onWishlistToggle={toggle}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-display text-2xl text-slate-800 mb-2">No vendors found</h3>
                <p className="text-slate-500 font-body mb-6">
                  Try adjusting your search or filters
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedCity("all");
                    setSearchQuery("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 lg:hidden max-h-[85vh] overflow-y-auto"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
                <h3 className="font-semibold text-slate-900 font-body">Filters</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <div className="px-6 py-6">
                <FilterPanel />
              </div>
              <div className="px-6 pb-8 sticky bottom-0 bg-white pt-4 border-t border-slate-100">
                <Button className="w-full" onClick={() => setMobileFiltersOpen(false)}>
                  Show {total} Vendors
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function VendorsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory pt-20" />}>
      <VendorsContent />
    </Suspense>
  );
}

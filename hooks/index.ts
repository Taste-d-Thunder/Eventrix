// ─── Custom Hooks ─────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from "react";
import { VendorCategory, vendors, Vendor } from "@/lib/data";

/** Hook to filter and search vendors */
export function useVendorFilter(initialCategory?: VendorCategory) {
  const [selectedCategory, setSelectedCategory] = useState<VendorCategory | "all">(
    initialCategory || "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "price-low" | "price-high">("rating");
  const [selectedCity, setSelectedCity] = useState<string>("all");

  const filtered = vendors.filter((v) => {
    const matchesCategory = selectedCategory === "all" || v.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCity = selectedCity === "all" || v.city === selectedCity;
    return matchesCategory && matchesSearch && matchesCity;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price-low") return a.startingPrice - b.startingPrice;
    if (sortBy === "price-high") return b.startingPrice - a.startingPrice;
    return 0;
  });

  return {
    vendors: sorted,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    selectedCity,
    setSelectedCity,
    total: sorted.length,
  };
}

/** Hook to handle intersection observer for scroll animations */
export function useInView(threshold = 0.1) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Only trigger once
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

/** Hook to manage wishlist state */
export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Persist to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("eventspace-wishlist");
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  const toggle = useCallback((vendorId: string) => {
    setWishlist((prev) => {
      const updated = prev.includes(vendorId)
        ? prev.filter((id) => id !== vendorId)
        : [...prev, vendorId];
      localStorage.setItem("eventspace-wishlist", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isWishlisted = useCallback(
    (vendorId: string) => wishlist.includes(vendorId),
    [wishlist]
  );

  return { wishlist, toggle, isWishlisted, count: wishlist.length };
}

/** Hook for debounced search */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/** Hook to detect mobile screen size */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}

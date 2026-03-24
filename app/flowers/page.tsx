/**
 * app/flowers/page.tsx — Buy Flowers (Bulk & Single Orders)
 */

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Flower2, Truck, Minus, Plus, CheckCircle2, ArrowRight, MapPin, AlertCircle, LogIn } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune",
  "Kolkata", "Jaipur", "Ahmedabad", "Bhubaneswar",
];

const FLOWERS = [
  { id: "f1", name: "Red Roses", emoji: "🌹", price: 80, unit: "stem", bulkPrice: 60, minBulk: 50, image: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=400&q=80" },
  { id: "f2", name: "White Lilies", emoji: "🤍", price: 120, unit: "stem", bulkPrice: 90, minBulk: 30, image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=400&q=80" },
  { id: "f3", name: "Marigold Garlands", emoji: "🟡", price: 150, unit: "string", bulkPrice: 100, minBulk: 25, image: "https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=400&q=80" },
  { id: "f4", name: "Jasmine Strings", emoji: "⚪", price: 200, unit: "string", bulkPrice: 150, minBulk: 20, image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&q=80" },
  { id: "f5", name: "Mixed Bouquet", emoji: "💐", price: 500, unit: "bouquet", bulkPrice: 380, minBulk: 10, image: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&q=80" },
  { id: "f6", name: "Orchids", emoji: "🌸", price: 250, unit: "stem", bulkPrice: 200, minBulk: 20, image: "https://images.unsplash.com/photo-1567748157439-651aca2ff064?w=400&q=80" },
  { id: "f7", name: "Sunflowers", emoji: "🌻", price: 100, unit: "stem", bulkPrice: 75, minBulk: 30, image: "https://images.unsplash.com/photo-1551885525-5e644eb68bb6?w=400&q=80" },
  { id: "f8", name: "Lotus", emoji: "🪷", price: 180, unit: "stem", bulkPrice: 140, minBulk: 15, image: "https://images.unsplash.com/photo-1524601500432-1e1a4c71d692?w=400&q=80" },
];

interface CartItem {
  id: string;
  qty: number;
  isBulk: boolean;
}

export default function FlowersPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<"single" | "bulk">("single");
  const [city, setCity] = useState("");
  const [ordered, setOrdered] = useState(false);
  const [isNonCustomer, setIsNonCustomer] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      setIsLoggedOut(true);
    } else if (["admin", "vendor", "delivery_partner"].includes(user.role)) {
      setIsNonCustomer(true);
      setUserRole(user.role === "delivery_partner" ? "delivery partner" : user.role);
    }
  }, []);

  const addToCart = (flowerId: string) => {
    if (isNonCustomer || isLoggedOut) return;
    setCart((prev) => {
      const existing = prev.find((c) => c.id === flowerId);
      if (existing) {
        return prev.map((c) =>
          c.id === flowerId ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { id: flowerId, qty: 1, isBulk: orderType === "bulk" }];
    });
  };

  const removeFromCart = (flowerId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === flowerId);
      if (!existing) return prev;
      if (existing.qty <= 1) return prev.filter((c) => c.id !== flowerId);
      return prev.map((c) =>
        c.id === flowerId ? { ...c, qty: c.qty - 1 } : c
      );
    });
  };

  const getQty = (id: string) => cart.find((c) => c.id === id)?.qty || 0;

  const totalItems = cart.reduce((sum, c) => sum + c.qty, 0);
  const totalPrice = cart.reduce((sum, c) => {
    const flower = FLOWERS.find((f) => f.id === c.id)!;
    const price = orderType === "bulk" && c.qty >= flower.minBulk ? flower.bulkPrice : flower.price;
    return sum + price * c.qty;
  }, 0);

  const handleOrder = () => {
    // Build cart items with names and prices for checkout page
    const checkoutCart = cart.map((c) => {
      const flower = FLOWERS.find((f) => f.id === c.id)!;
      const isBulkActive = orderType === "bulk" && c.qty >= flower.minBulk;
      return {
        id: c.id,
        name: flower.name,
        qty: c.qty,
        price: isBulkActive ? flower.bulkPrice : flower.price,
      };
    });
    sessionStorage.setItem("es_flower_cart", JSON.stringify(checkoutCart));
    router.push("/flowers/checkout");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-stone-50 to-amber-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <p className="text-pink-600 font-semibold text-sm tracking-wider uppercase mb-2 flex items-center justify-center gap-1.5">
            <Flower2 className="w-4 h-4" /> Fresh Flowers
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Buy Flowers</h1>
          <p className="mt-3 text-slate-600 text-lg max-w-xl mx-auto">
            Fresh flowers for events, gifting, or decoration. Order single stems or save with bulk pricing.
          </p>
        </motion.div>

        {/* Non-customer notice */}
        {isNonCustomer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center gap-2 justify-center mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl py-3 px-4 max-w-lg mx-auto">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>You&apos;re logged in as a <strong>{userRole}</strong>. Ordering is only available for <strong>customer accounts</strong>.</span>
          </motion.div>
        )}

        {/* Order type toggle + City */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <div className="flex bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
            {(["single", "bulk"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  orderType === type
                    ? "bg-pink-500 text-white shadow-sm"
                    : "text-slate-600 hover:text-pink-600"
                }`}
              >
                {type === "single" ? "🌷 Single Order" : "📦 Bulk Order"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
            <MapPin className="w-4 h-4 text-slate-400" />
            <select value={city} onChange={(e) => setCity(e.target.value)}
              className="outline-none text-sm text-slate-700 bg-transparent appearance-none cursor-pointer pr-4">
              <option value="">All Cities</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {orderType === "bulk" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center gap-2 justify-center mb-6 text-sm text-pink-600 bg-pink-50 border border-pink-200 rounded-xl py-2 px-4 w-fit mx-auto">
            <Truck className="w-4 h-4" />
            Bulk pricing activates at minimum quantity. Free delivery on orders above ₹5,000.
          </motion.div>
        )}

        {/* Success */}
        <AnimatePresence>
          {ordered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center"
            >
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-emerald-800">Order Placed! 🎉</h3>
              <p className="text-sm text-emerald-600 mt-1">Your flowers will be delivered fresh. We'll send a confirmation to your email.</p>
              <button onClick={() => setOrdered(false)} className="mt-3 text-sm text-emerald-700 underline hover:no-underline">
                Continue Shopping
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flower Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {FLOWERS.map((flower, i) => {
            const qty = getQty(flower.id);
            const isBulkActive = orderType === "bulk" && qty >= flower.minBulk;
            const unitPrice = isBulkActive ? flower.bulkPrice : flower.price;

            return (
              <motion.div
                key={flower.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
              >
                <div className="h-40 overflow-hidden relative">
                  <img src={flower.image} alt={flower.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {orderType === "bulk" && (
                    <span className="absolute top-2 right-2 bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Min {flower.minBulk}
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>{flower.emoji}</span> {flower.name}
                  </h3>

                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-lg font-bold text-slate-900">₹{unitPrice}</span>
                    <span className="text-xs text-slate-500">/ {flower.unit}</span>
                    {isBulkActive && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">
                        Bulk Price
                      </span>
                    )}
                  </div>
                  {orderType === "bulk" && !isBulkActive && qty > 0 && (
                    <p className="text-[10px] text-amber-600 mt-1">
                      Add {flower.minBulk - qty} more for bulk pricing (₹{flower.bulkPrice}/{flower.unit})
                    </p>
                  )}

                  {/* Qty controls */}
                  <div className="flex items-center justify-between mt-3">
                    {isNonCustomer ? (
                      <span className="text-xs text-slate-400 italic">Ordering disabled</span>
                    ) : isLoggedOut ? (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push("/login")}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors shadow-sm"
                      >
                        <LogIn className="w-3.5 h-3.5" /> Login to Order
                      </motion.button>
                    ) : qty > 0 ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => removeFromCart(flower.id)}
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                          <Minus className="w-3.5 h-3.5 text-slate-600" />
                        </button>
                        <span className="text-sm font-bold text-slate-900 w-8 text-center">{qty}</span>
                        <button onClick={() => addToCart(flower.id)}
                          className="w-8 h-8 rounded-lg bg-pink-100 hover:bg-pink-200 flex items-center justify-center transition-colors">
                          <Plus className="w-3.5 h-3.5 text-pink-600" />
                        </button>
                      </div>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(flower.id)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold transition-colors shadow-sm"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" /> Add
                      </motion.button>
                    )}
                    <span className="text-xs text-slate-400">
                      {qty > 0 && `₹${(unitPrice * qty).toLocaleString("en-IN")}`}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Sticky Cart Bar — only for customers */}
        <AnimatePresence>
          {totalItems > 0 && !isNonCustomer && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-lg"
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{totalItems} item{totalItems > 1 ? "s" : ""}</p>
                    <p className="text-xs text-slate-500">₹{totalPrice.toLocaleString("en-IN")} total</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOrder}
                  className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-5 py-3 rounded-xl font-semibold text-sm shadow-sm transition-colors"
                >
                  Order Now <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * app/flowers/checkout/page.tsx — Flower Order Checkout + Payment
 */

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CreditCard,
  Smartphone,
  Building2,
  Shield,
  CheckCircle2,
  ArrowLeft,
  Lock,
  Flower2,
  MapPin,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

interface FlowerCartItem {
  id: string;
  name: string;
  qty: number;
  price: number;
}

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI / Google Pay", icon: Smartphone, popular: true },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard, popular: false },
  { id: "netbanking", label: "Net Banking", icon: Building2, popular: false },
];

export default function FlowerCheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<FlowerCartItem[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    // Block non-customer roles from checkout
    const user = getCurrentUser();
    if (!user) {
      router.replace("/login?from=/flowers");
      return;
    }
    if (["admin", "vendor", "delivery_partner"].includes(user.role)) {
      router.replace("/flowers");
      return;
    }

    const raw = sessionStorage.getItem("es_flower_cart");
    if (raw) {
      setCart(JSON.parse(raw));
    } else {
      router.replace("/flowers");
    }
  }, [router]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = subtotal >= 5000 ? 0 : 99;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + gst;

  const handlePay = () => {
    if (!deliveryAddress.trim() || !deliveryDate || !phone.trim()) return;
    setProcessing(true);
    setTimeout(() => {
      const id = "FLR-" + Date.now().toString(36).toUpperCase();
      setOrderId(id);

      // Calculate estimated delivery time (random between 30-50 mins)
      const estMins = 30 + Math.floor(Math.random() * 20);
      const estimatedDeliveryTime = `${estMins} mins`;

      // Save order to localStorage for My Orders
      const existingOrders = JSON.parse(localStorage.getItem("es_orders") || "[]");
      existingOrders.push({
        id,
        type: "flowers",
        items: cart,
        total,
        deliveryAddress,
        deliveryDate,
        phone,
        status: "confirmed",
        estimatedDeliveryTime,
        deliveryStatus: "confirmed", // internal status for tracking simulation
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("es_orders", JSON.stringify(existingOrders));

      sessionStorage.removeItem("es_flower_cart");
      setProcessing(false);
      setSuccess(true);
    }, 2500);
  };

  if (cart.length === 0 && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading cart…</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-stone-50 to-pink-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed! 💐</h2>
          <p className="text-slate-600 text-sm mb-1">Your flowers are on the way!</p>
          <p className="text-slate-500 text-xs mb-6">
            Order ID: <span className="font-mono font-bold">{orderId}</span>
          </p>

          <div className="bg-slate-50 rounded-xl p-4 text-left space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Items</span>
              <span className="font-medium text-slate-900">{cart.length} types</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Delivery</span>
              <span className="font-medium text-slate-900">{deliveryDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Est. Time</span>
              <span className="font-medium text-pink-600">30-45 mins</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Amount Paid</span>
              <span className="font-bold text-emerald-600">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => router.push("/dashboard")}
              className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors">
              My Orders
            </button>
            <button onClick={() => router.push("/flowers")}
              className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-700 hover:border-pink-300 font-medium text-sm transition-all">
              Buy More
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-stone-50 to-amber-50 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-pink-600 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to flowers
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Payment Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-5 flex items-center gap-3">
              <Flower2 className="w-5 h-5 text-white" />
              <div>
                <h2 className="text-white font-bold">Flower Order Checkout</h2>
                <p className="text-pink-200 text-xs">Free delivery on orders above ₹5,000</p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Delivery details */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Delivery Details</p>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Delivery Address <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <textarea value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)}
                        rows={2} placeholder="Full delivery address…"
                        className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 hover:border-slate-300 focus:border-pink-400 rounded-xl outline-none focus:ring-3 focus:ring-pink-100 transition-all resize-none placeholder:text-slate-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Delivery Date <span className="text-red-400">*</span></label>
                      <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-3 text-sm border border-slate-200 hover:border-slate-300 focus:border-pink-400 rounded-xl outline-none focus:ring-3 focus:ring-pink-100 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Phone <span className="text-red-400">*</span></label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full px-4 py-3 text-sm border border-slate-200 hover:border-slate-300 focus:border-pink-400 rounded-xl outline-none focus:ring-3 focus:ring-pink-100 transition-all placeholder:text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Payment Method</p>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map((pm) => (
                    <button key={pm.id} type="button" onClick={() => setMethod(pm.id)}
                      className={`relative flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-xl border-2 transition-all ${
                        method === pm.id ? "border-pink-400 bg-pink-50 shadow-sm" : "border-slate-100 bg-slate-50 hover:border-slate-200"
                      }`}>
                      {pm.popular && (
                        <span className="absolute -top-2 right-1 text-[10px] bg-pink-500 text-white px-1.5 py-0.5 rounded-full font-bold">Popular</span>
                      )}
                      <pm.icon className={`w-5 h-5 ${method === pm.id ? "text-pink-600" : "text-slate-400"}`} />
                      <span className={`text-xs font-medium ${method === pm.id ? "text-pink-700" : "text-slate-600"}`}>{pm.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {method === "upi" && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">UPI ID</label>
                  <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@upi"
                    className="w-full px-4 py-3 text-sm border border-slate-200 hover:border-slate-300 focus:border-pink-400 rounded-xl outline-none focus:ring-3 focus:ring-pink-100 transition-all placeholder:text-slate-400" />
                </div>
              )}

              <motion.button onClick={handlePay} disabled={processing}
                whileHover={!processing ? { scale: 1.01 } : {}} whileTap={!processing ? { scale: 0.99 } : {}}
                className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-sm transition-all shadow-sm ${
                  processing ? "bg-pink-400 text-white cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600 text-white hover:shadow-md"
                }`}>
                {processing ? (
                  <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full" /> Processing…</>
                ) : (
                  <><Lock className="w-4 h-4" /> Pay ₹{total.toLocaleString("en-IN")}</>
                )}
              </motion.button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <Shield className="w-3.5 h-3.5" />
                <span>Secured by EventSpace Payment Protection</span>
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-6 h-fit">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Flower2 className="w-4 h-4 text-pink-500" /> Order Summary
            </h3>

            <div className="space-y-2.5 text-sm mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-slate-600">{item.name} × {item.qty}</span>
                  <span className="font-medium text-slate-900">₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>

            <hr className="border-dashed border-slate-200 my-3" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-slate-900">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery</span>
                <span className={deliveryFee === 0 ? "text-emerald-600 font-medium" : "text-slate-900"}>
                  {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">GST (5%)</span>
                <span className="text-slate-900">₹{gst.toLocaleString("en-IN")}</span>
              </div>

              <hr className="border-slate-200 my-3" />

              <div className="flex justify-between text-base">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-bold text-pink-600">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

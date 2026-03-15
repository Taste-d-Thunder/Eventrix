/**
 * app/book/[vendorId]/payment/page.tsx — Payment page (demo)
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
  Sparkles,
  Lock,
} from "lucide-react";

interface BookingData {
  vendorName: string;
  vendorId: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  date: string;
  guests: string;
  venue: string;
  amount: number;
}

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI / Google Pay", icon: Smartphone, popular: true },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard, popular: false },
  { id: "netbanking", label: "Net Banking", icon: Building2, popular: false },
];

export default function PaymentPage() {
  const router = useRouter();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("es_booking");
    if (raw) {
      setBooking(JSON.parse(raw));
    } else {
      router.replace("/vendors");
    }
  }, [router]);

  const platformFee = booking ? Math.round(booking.amount * 0.05) : 0;
  const gst = booking ? Math.round((booking.amount + platformFee) * 0.18) : 0;
  const total = booking ? booking.amount + platformFee + gst : 0;

  const handlePay = () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      sessionStorage.removeItem("es_booking");
    }, 2500);
  };

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading booking details…</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-stone-50 to-amber-50 flex items-center justify-center px-4">
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
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Booking Confirmed! 🎉
          </h2>
          <p className="text-slate-600 text-sm mb-1">
            Your booking with <strong>{booking.vendorName}</strong> has been
            confirmed.
          </p>
          <p className="text-slate-500 text-xs mb-6">
            Booking ID: <span className="font-mono">ES-{Date.now().toString(36).toUpperCase()}</span>
          </p>

          <div className="bg-slate-50 rounded-xl p-4 text-left space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Event</span>
              <span className="font-medium text-slate-900">{booking.eventType}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Date</span>
              <span className="font-medium text-slate-900">{booking.date}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Amount Paid</span>
              <span className="font-bold text-emerald-600">₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mb-6">
            A confirmation email has been sent to {booking.email}
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors"
            >
              My Dashboard
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-700 hover:border-amber-300 font-medium text-sm transition-all"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to booking
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-5 flex items-center gap-3">
              <Lock className="w-5 h-5 text-amber-400" />
              <div>
                <h2 className="text-white font-bold">Secure Payment</h2>
                <p className="text-slate-400 text-xs">256-bit SSL encrypted</p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Payment method */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Payment Method
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setMethod(pm.id)}
                      className={`relative flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-xl border-2 transition-all ${
                        method === pm.id
                          ? "border-amber-400 bg-amber-50 shadow-sm"
                          : "border-slate-100 bg-slate-50 hover:border-slate-200"
                      }`}
                    >
                      {pm.popular && (
                        <span className="absolute -top-2 right-1 text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                          Popular
                        </span>
                      )}
                      <pm.icon
                        className={`w-5 h-5 ${method === pm.id ? "text-amber-600" : "text-slate-400"}`}
                      />
                      <span
                        className={`text-xs font-medium ${method === pm.id ? "text-amber-700" : "text-slate-600"}`}
                      >
                        {pm.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* UPI fields */}
              {method === "upi" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-3"
                >
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@upi"
                      className="w-full px-4 py-3 text-sm text-slate-900 border border-slate-200 hover:border-slate-300 focus:border-amber-400 rounded-xl outline-none focus:ring-3 focus:ring-amber-100 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </motion.div>
              )}

              {/* Card fields */}
              {method === "card" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-3"
                >
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Name on card"
                      className="w-full px-4 py-3 text-sm text-slate-900 border border-slate-200 hover:border-slate-300 focus:border-amber-400 rounded-xl outline-none focus:ring-3 focus:ring-amber-100 transition-all placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-4 py-3 text-sm text-slate-900 border border-slate-200 hover:border-slate-300 focus:border-amber-400 rounded-xl outline-none focus:ring-3 focus:ring-amber-100 transition-all placeholder:text-slate-400 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-4 py-3 text-sm text-slate-900 border border-slate-200 hover:border-slate-300 focus:border-amber-400 rounded-xl outline-none focus:ring-3 focus:ring-amber-100 transition-all placeholder:text-slate-400 font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full px-4 py-3 text-sm text-slate-900 border border-slate-200 hover:border-slate-300 focus:border-amber-400 rounded-xl outline-none focus:ring-3 focus:ring-amber-100 transition-all placeholder:text-slate-400 font-mono"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Net Banking */}
              {method === "netbanking" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-3"
                >
                  <p className="text-sm text-slate-600">
                    You will be redirected to your bank's secure portal to complete the payment.
                  </p>
                </motion.div>
              )}

              {/* Pay Button */}
              <motion.button
                onClick={handlePay}
                disabled={processing}
                whileHover={!processing ? { scale: 1.01 } : {}}
                whileTap={!processing ? { scale: 0.99 } : {}}
                className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-sm transition-all shadow-sm ${
                  processing
                    ? "bg-amber-400 text-white cursor-not-allowed"
                    : "bg-amber-500 hover:bg-amber-600 text-white hover:shadow-md"
                }`}
              >
                {processing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                    />
                    Processing…
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Pay ₹{total.toLocaleString("en-IN")}
                  </>
                )}
              </motion.button>

              {/* Security badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <Shield className="w-3.5 h-3.5" />
                <span>Secured by EventSpace Payment Protection</span>
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-6 h-fit"
          >
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Order Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Vendor</span>
                <span className="font-medium text-slate-900 text-right max-w-[160px] truncate">
                  {booking.vendorName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Event</span>
                <span className="font-medium text-slate-900">{booking.eventType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date</span>
                <span className="font-medium text-slate-900">{booking.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Guests</span>
                <span className="font-medium text-slate-900">{booking.guests}</span>
              </div>

              <hr className="border-dashed border-slate-200 my-3" />

              <div className="flex justify-between">
                <span className="text-slate-500">Base Price</span>
                <span className="text-slate-900">₹{booking.amount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Platform Fee (5%)</span>
                <span className="text-slate-900">₹{platformFee.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">GST (18%)</span>
                <span className="text-slate-900">₹{gst.toLocaleString("en-IN")}</span>
              </div>

              <hr className="border-slate-200 my-3" />

              <div className="flex justify-between text-base">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-bold text-amber-600">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

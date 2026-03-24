/**
 * app/profile/page.tsx — Edit Profile Page
 */

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Tag,
  Save,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Truck,
  Shield,
} from "lucide-react";
import { getCurrentUser, updateCurrentUser } from "@/lib/auth";
import type { User as UserType } from "@/types/auth";

const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune",
  "Kolkata", "Jaipur", "Ahmedabad", "Surat", "Kochi", "Chandigarh", "Bhubaneswar",
];

const SERVICE_CATEGORIES = [
  "Venue", "Photography", "Catering", "Decoration", "DJ & Music",
  "Cake Artist", "Makeup Artist", "Transportation", "Event Management", "Florist", "Other",
];

const VEHICLE_TYPES = ["Bike", "Bicycle", "Scooter", "Car", "Auto-rickshaw", "On Foot"];

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<UserType | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setUser(u);
    setName(u.name || "");
    setEmail(u.email || "");
    setPhone(u.phone || "");
    setCity(u.city || "");
    setBusinessName(u.businessName || "");
    setServiceCategory(u.serviceCategory || "");
    setVehicleType((u as any).vehicleType || "");
    setAvatarPreview(u.avatar || "");
  }, [router]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setAvatarPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!user) return;
    const patch: Partial<UserType> & Record<string, any> = {
      name,
      email,
      phone,
      city,
      ...(avatarPreview && { avatar: avatarPreview }),
      ...(user.role === "vendor" && {
        businessName,
        serviceCategory,
      }),
      ...(user.role === "delivery_partner" && {
        vehicleType,
      }),
    };
    updateCurrentUser(patch);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!user) return null;

  const inputClass =
    "w-full pl-10 pr-4 py-3 text-sm text-slate-900 border border-slate-200 hover:border-slate-300 focus:border-amber-400 rounded-xl outline-none focus:ring-3 focus:ring-amber-100 transition-all placeholder:text-slate-400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 py-20 px-4">
      <div className="max-w-xl mx-auto">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-amber-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-white" />
            <h1 className="text-white text-lg font-bold">Edit Profile</h1>
          </div>

          <div className="p-6 space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative group">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-amber-200 shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center ring-4 ring-amber-200 shadow-lg">
                    <User className="w-10 h-10 text-amber-500" />
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-amber-500 hover:bg-amber-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-slate-500">Click camera icon to change avatar</p>
            </div>

            {/* Role badge */}
            <div className="flex justify-center">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                user.role === "admin" ? "bg-red-100 text-red-700" :
                user.role === "vendor" ? "bg-blue-100 text-blue-700" :
                user.role === "delivery_partner" ? "bg-purple-100 text-purple-700" :
                "bg-emerald-100 text-emerald-700"
              }`}>
                {user.role === "admin" ? "⚙️" : user.role === "vendor" ? "🏪" : user.role === "delivery_partner" ? "🚚" : "🎉"}
                {" "}
                {user.role === "delivery_partner" ? "Delivery Partner" : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputClass} />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" className={inputClass} />
              </div>
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">City</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <select value={city} onChange={(e) => setCity(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                  <option value="">Select…</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Vendor fields */}
            {user.role === "vendor" && (
              <>
                <div className="pt-2 border-t border-dashed border-blue-200">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">Business Details</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Business Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Your Business" className={inputClass} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Service Category</label>
                  <div className="relative">
                    <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <select value={serviceCategory} onChange={(e) => setServiceCategory(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                      <option value="">Select…</option>
                      {SERVICE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Delivery Partner fields */}
            {user.role === "delivery_partner" && (
              <>
                <div className="pt-2 border-t border-dashed border-purple-200">
                  <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-3">Delivery Details</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Vehicle Type</label>
                  <div className="relative">
                    <Truck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                      <option value="">Select…</option>
                      {VEHICLE_TYPES.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Admin fields */}
            {user.role === "admin" && (
              <>
                <div className="pt-2 border-t border-dashed border-red-200">
                  <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-3">Admin Details</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Admin Role</label>
                  <div className="relative">
                    <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value="Super Administrator" disabled className={`${inputClass} bg-slate-50`} />
                  </div>
                </div>
              </>
            )}

            {/* Save */}
            <motion.button
              onClick={handleSave}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all"
            >
              {saved ? (
                <><CheckCircle2 className="w-4 h-4" /> Saved!</>
              ) : (
                <><Save className="w-4 h-4" /> Save Changes</>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * app/vendor/dashboard/settings/page.tsx
 */
"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Package, BarChart3, Calendar, Star, TrendingUp, Bell, Settings, Image as ImageIcon, Trash2, UploadCloud } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import type { User as UserType } from "@/types/auth";
import { getVendorPhotos, saveVendorPhotos } from "@/lib/vendorStore";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { label: "Overview", href: "/vendor/dashboard", icon: <BarChart3 className="w-4 h-4" /> },
  { label: "My Flower Services", href: "/vendor/dashboard/services", icon: <Package className="w-4 h-4" /> },
  { label: "Flower Orders", href: "/vendor/dashboard/bookings", icon: <Calendar className="w-4 h-4" />, badge: 3 },
  { label: "Reviews", href: "/vendor/dashboard/reviews", icon: <Star className="w-4 h-4" /> },
  { label: "Earnings", href: "/vendor/dashboard/earnings", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Notifications", href: "/vendor/dashboard/notifications", icon: <Bell className="w-4 h-4" />, badge: 2 },
  { label: "Profile & Settings", href: "/vendor/dashboard/settings", icon: <Settings className="w-4 h-4" /> },
];

export default function VendorSettingsPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const usr = getCurrentUser();
    setUser(usr);
    if (usr) {
      getVendorPhotos(usr.id).then(saved => {
        if (saved) setPhotos(saved);
      });
    }
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files) return;
    setUploading(true);
    
    const files = Array.from(e.target.files);
    const readers = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(async (newPhotos) => {
      const updatedPhotos = [...photos, ...newPhotos];
      setPhotos(updatedPhotos);
      await saveVendorPhotos(user.id, updatedPhotos);
      setUploading(false);
    });
  };

  const removePhoto = async (index: number) => {
    if (!user) return;
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
    await saveVendorPhotos(user.id, updatedPhotos);
  };

  if (!user) return null;

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Settings" requiredRole="vendor">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile & Settings</h1>
          <p className="text-slate-600">Manage your business profile, shop photos, and availability.</p>
        </div>

        {/* Shop Photos Section */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-600" /> Shop Gallery Photos
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Upload photos of your flower shop, your past work, or arrangements. These photos will be featured prominently on your public customer profile.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            {photos.map((url, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                key={i} 
                className="relative aspect-square rounded-xl overflow-hidden group border border-slate-200"
              >
                <img src={url} alt={`Shop photo ${i + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => removePhoto(i)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
            
            <div className="relative aspect-square rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors flex flex-col items-center justify-center cursor-pointer overflow-hidden group">
              <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors mb-2" />
              <span className="text-xs font-medium text-slate-500 group-hover:text-blue-600 text-center px-2">
                {uploading ? "Processing..." : "Upload Photos"}
              </span>
              <input 
                type="file" 
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Placeholder for other settings replaced by dummy forms */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" /> Business Details
          </h2>
          {/* TODO: Backend Integration: Sync business details with Supabase */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
              <input type="text" defaultValue={user.businessName || ""} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Registration/GST No.</label>
              <input type="text" placeholder="Optional" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Shop Address</label>
            <textarea rows={2} placeholder="Full address" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"></textarea>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm mt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" /> Payout Settings
          </h2>
          {/* TODO: Backend Integration: Sync bank details securely with Supabase */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bank Account Holder</label>
              <input type="text" placeholder="Name on account" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">IFSC Code</label>
              <input type="text" placeholder="e.g. SBIN0001234" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 font-mono uppercase" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">UPI ID</label>
              <input type="text" placeholder="yourname@upi" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200" />
            </div>
          </div>
          <div className="flex justify-end">
            <button className="px-6 py-2.5 bg-slate-900 text-white font-medium text-sm rounded-xl hover:bg-slate-800 transition-colors shadow-sm">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

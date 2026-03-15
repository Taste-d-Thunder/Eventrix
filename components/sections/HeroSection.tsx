"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

/* ───────────────── Types ───────────────── */

interface EventType {
  id: string;
  label: string;
  emoji: string;
}

/* ───────────────── Data ───────────────── */

const EVENT_TYPES: EventType[] = [
  { id: "birthday", label: "Birthday", emoji: "🎂" },
  { id: "wedding", label: "Wedding", emoji: "💍" },
  { id: "anniversary", label: "Anniversary", emoji: "🌹" },
  { id: "corporate", label: "Corporate Event", emoji: "🏢" },
];

const CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
  "Bhubaneswar",
];

const STATS = [
  { value: "2,000+", label: "Verified Vendors" },
  { value: "50K+", label: "Events Planned" },
  { value: "15", label: "Cities Covered" },
  { value: "4.9★", label: "Avg. Rating" },
];

/* ───────────────── Animations ───────────────── */

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

/* ───────────────── Component ───────────────── */

export function HeroSection() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("wedding");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("Mumbai");

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (query.trim()) params.set("q", query.trim());
    if (activeTab) params.set("category", activeTab);
    if (city) params.set("city", city);

    router.push(`/vendors?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 pt-28 pb-20 overflow-hidden">

      {/* Background blur shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] rounded-full bg-orange-100/50 blur-3xl" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl space-y-8"
        >

          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="flex items-center gap-3">

            <div className="flex -space-x-2">
              {[1,2,3].map((n)=>(
                <Image
                  key={n}
                  src={`https://i.pravatar.cc/36?img=${n}`}
                  alt="user"
                  width={36}
                  height={36}
                  className="rounded-full ring-2 ring-white"
                />
              ))}
            </div>

            <p className="text-sm text-slate-600">
              <strong className="text-slate-900">50,000+</strong> events planned this year
            </p>

          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.06]"
          >
            Plan Your
            <br />
            <span className="text-amber-500 italic">Perfect</span> Event
            <br />
            in Minutes
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-slate-600 max-w-xl"
          >
            Connect with 2,000+ verified vendors — venues, photographers,
            caterers, DJs, and more.
          </motion.p>

          {/* Event Type Pills */}
          <motion.div variants={fadeUp} className="space-y-3">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              What are you celebrating?
            </p>

            <div className="flex flex-wrap gap-3">

              {EVENT_TYPES.map((type) => (

                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(type.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition
                  
                  ${
                    activeTab === type.id
                      ? "bg-amber-50 border-amber-400 text-amber-700"
                      : "bg-white border-slate-200 text-slate-600 hover:border-amber-200"
                  }`}
                >
                  <span>{type.emoji}</span>
                  {type.label}

                </motion.button>

              ))}

            </div>

          </motion.div>

          {/* Search Bar */}

          <motion.div variants={fadeUp}>

            <div className="flex flex-col md:flex-row gap-3 bg-white border border-slate-200 rounded-2xl shadow-xl p-2">

              {/* Search input */}

              <div className="flex items-center gap-2 flex-1 px-3">

                <Search className="w-5 h-5 text-slate-400" />

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search vendors, venues, services..."
                  className="flex-1 outline-none text-sm text-slate-800"
                />

              </div>

              {/* Divider */}

              <div className="hidden md:block w-px bg-slate-200" />

              {/* City Selector */}

              <div className="flex items-center gap-2 px-4 py-2">

                <MapPin className="w-4 h-4 text-slate-400" />

                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="outline-none text-sm text-slate-700 bg-transparent appearance-none"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <ChevronDown className="w-4 h-4 text-slate-400" />

              </div>

              {/* Search Button */}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold text-sm"
              >
                <Search className="w-4 h-4" />
                Search
              </motion.button>

            </div>

          </motion.div>

          {/* Stats */}

          <motion.div
            variants={fadeUp}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4"
          >

            {STATS.map((stat) => (

              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-bold text-slate-900">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500">
                  {stat.label}
                </p>
              </div>

            ))}

          </motion.div>

        </motion.div>

      </div>

    </section>
  );
}

export default HeroSection;
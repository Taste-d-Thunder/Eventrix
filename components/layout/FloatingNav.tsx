"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function FloatingNav() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2"
    >
      <button
        onClick={() => router.back()}
        aria-label="Go back"
        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg flex items-center justify-center text-slate-600 hover:text-amber-600 hover:border-amber-300 hover:shadow-xl transition-all duration-200 group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={() => router.forward()}
        aria-label="Go forward"
        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg flex items-center justify-center text-slate-600 hover:text-amber-600 hover:border-amber-300 hover:shadow-xl transition-all duration-200 group"
      >
        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </motion.div>
  );
}

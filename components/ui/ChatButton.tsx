/**
 * ChatButton.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Thin wrapper that owns the chat modal's open/close state.
 * Drop this into any vendor profile page or card.
 */

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { AnonymousChatModal } from "./AnonymousChatModal";

export interface ChatButtonProps {
  vendorName: string;
  vendorMaskedId: string;
  vendorCategory?: string;
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
}

export const ChatButton: React.FC<ChatButtonProps> = ({
  vendorName,
  vendorMaskedId,
  vendorCategory,
  size = "md",
  iconOnly = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: "px-3 py-2 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  const iconSizes = { sm: "w-3.5 h-3.5", md: "w-4 h-4", lg: "w-5 h-5" };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(true)}
        className={`
          inline-flex items-center justify-center font-medium rounded-xl
          bg-amber-500 hover:bg-amber-600 text-white
          shadow-md hover:shadow-lg transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2
          ${sizeClasses[size]}
          ${iconOnly ? "!px-2.5" : ""}
        `}
        aria-label={`Chat with ${vendorName}`}
      >
        <MessageCircle className={iconSizes[size]} />
        {!iconOnly && <span>Chat with Vendor</span>}
      </motion.button>

      <AnonymousChatModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        vendorName={vendorName}
        vendorMaskedId={vendorMaskedId}
        vendorCategory={vendorCategory}
      />
    </>
  );
};

export default ChatButton;

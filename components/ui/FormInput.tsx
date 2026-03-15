/**
 * components/ui/FormInput.tsx
 * Reusable form input component with label, error, and icon support.
 */

"use client";

import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, hint, icon, className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "w-full text-sm text-slate-900 bg-white border rounded-xl px-4 py-3 outline-none transition-all duration-150",
              "placeholder:text-slate-400",
              "focus:border-amber-400 focus:ring-3 focus:ring-amber-100",
              "disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed",
              icon && "pl-10",
              isPassword && "pr-10",
              error
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-slate-200 hover:border-slate-300",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-500 flex items-center gap-1">{error}</p>}
        {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

// ─── Role Selector ────────────────────────────────────────────────────────────

import type { UserRole } from "@/types/auth";

interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
  icon: string;
  color: string;
  activeBg: string;
  activeBorder: string;
}

const ROLES: RoleOption[] = [
  {
    value: "customer",
    label: "Customer",
    description: "Book event services",
    icon: "🎉",
    color: "text-emerald-600",
    activeBg: "bg-emerald-50",
    activeBorder: "border-emerald-400",
  },
  {
    value: "vendor",
    label: "Vendor",
    description: "Offer your services",
    icon: "🏪",
    color: "text-blue-600",
    activeBg: "bg-blue-50",
    activeBorder: "border-blue-400",
  },
  {
    value: "admin",
    label: "Admin",
    description: "Manage the platform",
    icon: "⚙️",
    color: "text-red-600",
    activeBg: "bg-red-50",
    activeBorder: "border-red-400",
  },
];

interface RoleSelectorProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
  showAdmin?: boolean;
}

export function RoleSelector({ value, onChange, showAdmin = false }: RoleSelectorProps) {
  const roles = showAdmin ? ROLES : ROLES.filter((r) => r.value !== "admin");

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        I am a <span className="text-red-400">*</span>
      </label>
      <div className={cn("grid gap-2.5", showAdmin ? "grid-cols-3" : "grid-cols-2")}>
        {roles.map((role) => (
          <button
            key={role.value}
            type="button"
            onClick={() => onChange(role.value)}
            className={cn(
              "flex flex-col items-center gap-1.5 p-3.5 rounded-xl border-2 transition-all duration-150 cursor-pointer text-center",
              value === role.value
                ? `${role.activeBg} ${role.activeBorder} shadow-sm`
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            <span className="text-2xl">{role.icon}</span>
            <span
              className={cn(
                "font-semibold text-sm",
                value === role.value ? role.color : "text-slate-700"
              )}
            >
              {role.label}
            </span>
            <span className="text-xs text-slate-500 leading-tight">{role.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Utility ─────────────────────────────────────────────────────────────────

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

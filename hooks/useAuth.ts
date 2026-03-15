/**
 * hooks/useAuth.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * React hook that wraps auth functions and provides reactive auth state.
 * Components using this hook re-render when auth state changes.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "@/lib/auth";
import { ROLE_REDIRECT } from "@/types/auth";
import type { User, UserRole, LoginCredentials, RegisterCredentials } from "@/types/auth";

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const current = getCurrentUser();
    setUser(current);
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<User> => {
      // In production: replace with fetch('/api/auth/login', ...)
      const loggedIn = loginUser(credentials);
      setUser(loggedIn);
      // Redirect based on role
      router.push(ROLE_REDIRECT[loggedIn.role]);
      return loggedIn;
    },
    [router]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials): Promise<User> => {
      // In production: replace with fetch('/api/auth/register', ...)
      const registered = registerUser(credentials);
      setUser(registered);
      router.push(ROLE_REDIRECT[registered.role]);
      return registered;
    },
    [router]
  );

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
    router.push("/login");
  }, [router]);

  const hasRole = useCallback(
    (role: UserRole): boolean => user?.role === role,
    [user]
  );

  return {
    user,
    isLoading,
    isAuthenticated: user !== null,
    login,
    register,
    logout,
    hasRole,
  };
}

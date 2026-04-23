"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AppUser } from "@/types/user";
import api from "@/lib/api"; 

const AUTH_USER_KEY = "ews_user_data";
const ACCESS_TOKEN_KEY = "ews_access_token";
const REFRESH_TOKEN_KEY = "ews_refresh_token";

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user dari localStorage saat pertama kali aplikasi jalan
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem(AUTH_USER_KEY);
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      
      if (rawUser && token) {
        setUser(JSON.parse(rawUser) as AppUser);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      // Tembak ke endpoint backend
      const response = await api.post("/auth/login", { email, password });
      
      // Response asumsikan memakai format dari utils backend (ok(data))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const { accessToken, refreshToken, user: userData } = response.data.data;

      // Simpan di Local Storage
      // Gunakan String() untuk menjamin format penyimpanan ke localStorage
      localStorage.setItem(ACCESS_TOKEN_KEY, String(accessToken));
      localStorage.setItem(REFRESH_TOKEN_KEY, String(refreshToken));
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));

      setUser(userData as AppUser);
      return { ok: true as const, user: userData as AppUser };

    } catch (error: unknown) {
      // 1. Ganti 'any' dengan 'unknown'
      // Karena api.ts melempar new Error(), kita cek instanceof
      const errorMessage =
        error instanceof Error ? error.message : "Login gagal, periksa koneksi.";
      
      return { ok: false as const, message: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // (Opsional) Panggil API logout agar dicatat di server
      await api.post("/auth/logout");
    } catch {
      // 2. Hapus variabel (error) karena tidak dipakai (unused-vars)
      console.warn("Logout API failed, forcing local logout");
    } finally {
      // Hapus data lokal secara paksa
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      setUser(null);
    }
  }, []);

  // 3. Hapus "phone" agar sesuai dengan batasan interface AppUser saat ini
  const updateProfile = useCallback(
    (payload: Partial<Pick<AppUser, "name" | "email">>) => {
      setUser((prev) => {
        if (!prev) return prev;
        const nextUser: AppUser = { ...prev, ...payload };
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
        return nextUser;
      });
    },
    []
  );

  return useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      updateProfile,
    }),
    [user, loading, login, logout, updateProfile],
  );
}
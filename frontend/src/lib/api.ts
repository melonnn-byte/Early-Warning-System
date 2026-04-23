import axios from "axios";
import { API_URL } from "@/constants";

// Kunci yang sama dengan yang kita gunakan di useAuth.ts
const ACCESS_TOKEN_KEY = "ews_access_token";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10_000,
});

// 1. REQUEST INTERCEPTOR: Menyematkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    // Pastikan kode ini berjalan di browser (Client-side), bukan di server Next.js
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (token) {
        // Tambahkan header Authorization berformat "Bearer <token>"
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. RESPONSE INTERCEPTOR: Menangani response dan error global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Deteksi jika error karena token tidak valid / kadaluarsa (Unauthorized)
    if (error?.response?.status === 401) {
      if (typeof window !== "undefined" && !window.location.pathname.includes('/login')) {
        // Opsional: Anda bisa memaksa hapus token dan redirect user ke halaman login di sini
        // localStorage.removeItem(ACCESS_TOKEN_KEY);
        // localStorage.removeItem("ews_user_data");
        // localStorage.removeItem("ews_refresh_token");
        // window.location.href = '/login';
        
        console.warn("Sesi kadaluarsa. Silakan login kembali.");
      }
    }

    const message =
      error?.response?.data?.message ??
      error?.message ??
      "Terjadi kesalahan saat memproses permintaan.";
      
    return Promise.reject(new Error(message));
  },
);

export default api;
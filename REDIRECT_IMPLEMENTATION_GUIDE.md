# 🚀 Fitur Redirect Berdasarkan Role - Implementation Guide

**Status:** ✅ Selesai  
**Tanggal:** 26 April 2026  
**File yang Dimodifikasi:** 4 file

---

## 📋 Fitur yang Diimplementasikan

### 1. ✅ Auto-Redirect Setelah Login
**File:** `src/app/login/page.tsx`  
**Status:** Sudah ada (ditingkatkan)

Setelah user berhasil login, sistem akan:
- **Jika role = "admin"** → Redirect ke `/admin/dashboard`
- **Jika role = "operator"** → Redirect ke `/user/dashboard`

```typescript
const getRedirectPathByRole = (role: UserRole | string) => 
  (role === "ADMIN" || role === "admin" ? "/admin/dashboard" : "/user/dashboard");

const result = await login(email, password);
if (result.ok && result.user) {
  router.push(getRedirectPathByRole(result.user.role));
}
```

---

### 2. ✅ Auto-Redirect Setelah Register
**File:** `src/app/register/page.tsx`  
**Status:** Baru diimplementasikan

Setelah user berhasil register, sistem akan:
- Auto-login user dengan email & password yang baru didaftarkan
- Redirect ke dashboard sesuai role yang diberikan backend
- Jika auto-login gagal, fallback ke halaman login

```typescript
// Setelah registrasi berhasil
const result = await login(email, password);
if (result.ok && result.user) {
  router.push(getRedirectPathByRole(result.user.role));
} else {
  router.push("/login");
}
```

---

### 3. ✅ Auto-Redirect Dari Landing Page
**File:** `src/app/page.tsx` + `src/components/AuthRedirectWrapper.tsx`  
**Status:** Baru diimplementasikan

Ketika user sudah login dan membuka landing page (`/`), sistem akan:
- Detect bahwa user sudah authenticated
- Auto-redirect ke `/admin/dashboard` jika role = admin
- Auto-redirect ke `/user/dashboard` jika role = operator/user
- Tampilkan landing page normal jika user belum login

```typescript
// AuthRedirectWrapper Component
export function AuthRedirectWrapper({ children }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      const redirectPath = 
        user.role?.toLowerCase() === "admin" 
          ? "/admin/dashboard" 
          : "/user/dashboard";
      router.push(redirectPath);
    }
  }, [user, loading]);

  if (user) return null; // Jangan tampilkan landing page saat redirect
  return <>{children}</>; // Tampilkan landing page jika belum login
}
```

---

### 4. ✅ Route Protection
**File:** `src/components/ProtectedRoute.tsx`  
**Status:** Baru diimplementasikan

Component untuk protect routes yang memerlukan authentication:

```typescript
<ProtectedRoute requiredRole="admin">
  <AdminDashboard />
</ProtectedRoute>

<ProtectedRoute requiredRole="operator">
  <UserDashboard />
</ProtectedRoute>
```

**Features:**
- Cek authentication sebelum render component
- Cek role authorization
- Auto-redirect ke login jika belum authenticated
- Auto-redirect ke dashboard yang sesuai jika role tidak match
- Show loading state sambil checking auth

---

### 5. ✅ Middleware untuk Route Protection
**File:** `middleware.ts` (root)  
**Status:** Baru diimplementasikan

Server-side route protection:
- Public routes: `/`, `/login`, `/register`, `/dashboard`, `/map`, `/emergency`, `/education`
- Protected routes: `/user/*`, `/admin/*`
- Auto-redirect ke login jika belum authenticated

---

## 🔄 User Flow Diagram

### Scenario 1: User Baru Register & Login
```
User membuka /register
    ↓
User mengisi form dan submit
    ↓
Backend validasi & create user dengan role "operator"
    ↓
Frontend auto-login dengan email/password yang baru
    ↓
Backend return user data dengan role "operator"
    ↓
Frontend redirect ke /user/dashboard
    ↓
✅ User masuk ke User Dashboard
```

### Scenario 2: Admin Login
```
User membuka /login
    ↓
User input admin@ews.com & admin123
    ↓
Backend authenticate & return user dengan role "admin"
    ↓
Frontend detect role = "admin"
    ↓
Frontend redirect ke /admin/dashboard (via getRedirectPathByRole)
    ↓
✅ Admin masuk ke Admin Dashboard
```

### Scenario 3: Authenticated User Membuka Landing Page
```
User sudah login sebelumnya (token di localStorage)
    ↓
User membuka / (landing page)
    ↓
AuthRedirectWrapper check useAuth()
    ↓
User found di localStorage
    ↓
AuthRedirectWrapper detect role
    ↓
    ├─ Jika admin → redirect ke /admin/dashboard
    └─ Jika operator → redirect ke /user/dashboard
    ↓
✅ Landing page tidak ditampilkan, langsung ke dashboard
```

### Scenario 4: Unauthenticated User Membuka Protected Route
```
User tidak login & membuka /user/dashboard
    ↓
Middleware check token di cookies (tidak ada)
    ↓
Middleware redirect ke /login
    ↓
User login successfully
    ↓
User redirect ke /user/dashboard
    ↓
✅ Access granted
```

---

## 📦 Files yang Dibuat/Dimodifikasi

| File | Status | Perubahan |
|------|--------|-----------|
| `src/app/login/page.tsx` | ✏️ Modified | Sudah punya redirect logic |
| `src/app/register/page.tsx` | ✏️ Modified | **NEW:** Auto-login & redirect |
| `src/app/page.tsx` | ✏️ Modified | **NEW:** Wrap dengan AuthRedirectWrapper |
| `src/components/AuthRedirectWrapper.tsx` | ✨ Created | Redirect untuk landing page |
| `src/components/ProtectedRoute.tsx` | ✨ Created | Component untuk protected routes |
| `middleware.ts` | ✨ Created | Server-side route protection |

---

## 🔧 How to Use Protected Route

### Wrap User Dashboard dengan ProtectedRoute
```typescript
// src/app/user/layout.tsx (create if doesn't exist)
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function UserLayout({ children }) {
  return (
    <ProtectedRoute requiredRole="operator">
      {children}
    </ProtectedRoute>
  );
}
```

### Wrap Admin Dashboard dengan ProtectedRoute
```typescript
// src/app/admin/layout.tsx (create if doesn't exist)
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  );
}
```

---

## 🔐 Authentication Flow

### Token Management
```
Login Success
├─ localStorage.setItem("ews_access_token", token)
├─ localStorage.setItem("ews_refresh_token", token)
├─ localStorage.setItem("ews_user_data", userData)
└─ API interceptor auto-inject "Authorization: Bearer {token}"

Logout
├─ localStorage.removeItem("ews_access_token")
├─ localStorage.removeItem("ews_refresh_token")
├─ localStorage.removeItem("ews_user_data")
└─ Redirect ke /login
```

### useAuth Hook
```typescript
const { user, loading, isAuthenticated } = useAuth();

// user = { id, name, email, role, ... } atau null
// loading = boolean (saat check localStorage)
// isAuthenticated = Boolean(user)
```

---

## 🎯 Test Scenarios

### ✅ Test 1: Register & Auto-Login
1. Buka http://localhost:3000/register
2. Isi form dengan data baru:
   - Name: "Test User"
   - Email: "test@example.com"
   - Institution: "Institusi Test"
   - Password: "password123"
3. Click "Daftar"
4. **Expected:** Auto-redirect ke `/user/dashboard` tanpa harus login manual

### ✅ Test 2: Admin Login
1. Buka http://localhost:3000/login
2. Click tombol "Admin Test"
3. **Expected:** Redirect ke `/admin/dashboard`

### ✅ Test 3: User Login
1. Buka http://localhost:3000/login
2. Click tombol "User Test"
3. **Expected:** Redirect ke `/user/dashboard`

### ✅ Test 4: Landing Page Redirect
1. Login dengan admin account
2. Buka http://localhost:3000/
3. **Expected:** Auto-redirect ke `/admin/dashboard`

### ✅ Test 5: Protected Route
1. Logout
2. Coba buka http://localhost:3000/user/dashboard
3. **Expected:** 
   - Tidak bisa akses (redirect ke login)
   - Atau show loading state + redirect ke login

---

## 🚀 Future Enhancements

- [ ] Add role-based menu/sidebar navigation
- [ ] Add role-based page access (admin can't access user pages vice versa)
- [ ] Add logout redirect (currently redirect ke login)
- [ ] Add session timeout & auto-logout
- [ ] Add remember-me functionality
- [ ] Add 2FA for admin accounts
- [ ] Add user activity logging
- [ ] Add email verification for new accounts

---

## 📝 Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

### Backend Requirements
- POST `/auth/login` - return { user: { id, name, email, role } }
- POST `/auth/register` - return { user: { id, name, email, role } }
- GET `/auth/me` - return { user: {...} } (optional, for session check)

---

## 🔗 Related Files & Functions

| Component | Purpose | Location |
|-----------|---------|----------|
| `useAuth()` | Auth state management | `src/hooks/useAuth.ts` |
| `ProtectedRoute` | Route protection wrapper | `src/components/ProtectedRoute.tsx` |
| `AuthRedirectWrapper` | Landing page redirect | `src/components/AuthRedirectWrapper.tsx` |
| `middleware` | Server-side route protection | `middleware.ts` |
| `api` | Axios instance with interceptor | `src/lib/api.ts` |

---

**Status:** ✅ Ready for Testing  
**Last Updated:** 26 April 2026  
**Version:** 1.0

# 📋 Quick Reference: Frontend User Features vs Backend APIs

## 🎯 Feature-to-Endpoint Mapping

### 1️⃣ Dashboard Realtime User
**Path:** `/user/dashboard`  
**Description:** Real-time water level monitoring dari semua sensor

| Component | API Endpoint | Method | Purpose |
|-----------|------------|--------|---------|
| useWaterLevel | (Mock) | - | Auto-simulate data tiap 7 detik |
| UserRealtimeDashboard | GET `/sensors` | GET | Fetch daftar sensor |
| - | GET `/water-levels/current` | GET | Fetch current levels |

**State Management:** `useWaterLevel()` hook with localStorage  
**Update Frequency:** 7 detik  
**Auth Required:** ❌ No

---

### 2️⃣ Peta Sensor
**Path:** `/user/map`  
**Description:** Visualisasi sensor pada peta dengan filter status

| Component | API Endpoint | Method | Purpose |
|-----------|------------|--------|---------|
| PublicGoogleSensorMap | GET `/sensors` | GET | Get all sensors with coords |
| Map Filter | GET `/water-levels/current` | GET | Get levels untuk color-coding |
| Search & Sort | (Client-side) | - | Filter by name/status |

**External Service:** Google Maps API  
**Auth Required:** ❌ No

---

### 3️⃣ Notifikasi Peringatan
**Path:** `/user/notifications`  
**Description:** Notifikasi alert berdasarkan perubahan status sensor

| Component | API Endpoint | Method | Purpose |
|-----------|------------|--------|---------|
| useUserNotifications | (Optional) GET `/alerts/history` | GET | Get alert history |
| Notification List | (Optional) GET `/alerts/active` | GET | Get current active alerts |
| Auto-generate | (useWaterLevel) | - | Trigger saat level berubah |

**State Management:** `useReducer` + localStorage  
**Storage Key:** `ews_user_notifications`  
**Auto-trigger:** Saat sensor status berubah  
**Auth Required:** ❌ No

---

### 4️⃣ Kontak Darurat
**Path:** `/user/emergency`  
**Description:** Emergency response center dengan kontak & panduan

| Component | API Endpoint | Method | Purpose |
|-----------|------------|--------|---------|
| Emergency Cards | GET `/emergency-contacts` | GET | Get emergency contacts |
| Call Buttons | (tel: protocol) | - | Direct phone call |
| Quick Actions | (Navigation) | - | Link to other pages |

**Data Source:** Constants (hardcoded) atau Backend API  
**Auth Required:** ❌ No

---

### 5️⃣ Edukasi & Panduan
**Path:** `/user/education`  
**Description:** Knowledge base lengkap untuk flood preparedness

| Content | Data Source | Method | Notes |
|---------|------------|--------|-------|
| Status Levels | Hardcoded | Static | 4 level dengan guidance |
| 3 Fase Plan | Hardcoded | Static | Before/During/After |
| Checklist | Hardcoded | Static | Emergency kit checklist |
| FAQ | Hardcoded | Static | Common questions |

**API Required:** ❌ No  
**Auth Required:** ❌ No

---

### 6️⃣ Edit Profil
**Path:** `/user/profile`  
**Description:** Update data profil user

| Field | API Endpoint | Method | Purpose |
|-------|------------|--------|---------|
| Name | (Implicit) | - | Update localStorage |
| Email | (Implicit) | - | Update localStorage |
| WhatsApp | (Implicit) | - | Update localStorage |

**State Management:** `useAuth().updateProfile()`  
**Storage:** localStorage (`ews_user_data`)  
**Backend Call:** ❌ Currently No (local only)  
**Auth Required:** ✅ Yes (for display)

---

### 7️⃣ Autentikasi (Login/Register/Logout)
**Path:** `/login`, `/register`, others  
**Description:** User authentication system

| Action | API Endpoint | Method | Purpose |
|--------|------------|--------|---------|
| Register | POST `/auth/register` | POST | Create new user account |
| Login | POST `/auth/login` | POST | Login dengan email/password |
| Google Login | POST `/auth/google-login` | POST | OAuth login dengan Google |
| Logout | POST `/auth/logout` | POST | Clear session |
| Refresh | POST `/auth/refresh` | POST | Refresh access token |

**State Management:** `useAuth()` hook  
**Storage:** localStorage (token + user data)  
**External Service:** Firebase (Google OAuth)  
**Auth Required:** ✅ Yes (for logout, refresh)

---

## 📡 Complete API Endpoint List

### 🔐 Authentication (`/auth`)
```
POST   /auth/register        - Register user baru
POST   /auth/login           - Login dengan email/password  
POST   /auth/google-login    - Login dengan Google OAuth
POST   /auth/logout          - Logout (clear session)
POST   /auth/refresh         - Refresh access token
```

### 📊 Water Levels (`/water-levels`)
```
GET    /water-levels/current                  - Get current levels
GET    /water-levels/history                  - Get historical data
GET    /water-levels/:sensorId/latest         - Get latest for sensor
```

### 📡 Sensors (`/sensors`)
```
GET    /sensors              - Get all sensors
```

### 🚨 Alerts (`/alerts`)
```
GET    /alerts/active        - Get active alerts
GET    /alerts/history       - Get alert history
POST   /alerts/subscribe     - Subscribe to push notification
POST   /alerts/broadcast     - Broadcast alert (Admin)
```

### 🆘 Emergency Contacts (`/emergency-contacts`)
```
GET    /emergency-contacts   - Get all emergency contacts
```

---

## 🔧 Integration Checklist

### Critical (Must Have)
- [ ] Backend API server running on `http://localhost:3001/api`
- [ ] POST `/auth/login` implemented
- [ ] POST `/auth/register` implemented
- [ ] GET `/sensors` implemented
- [ ] GET `/water-levels/current` implemented
- [ ] GET `/emergency-contacts` implemented
- [ ] CORS configured for frontend origin
- [ ] JWT token validation working

### High Priority (Should Have)
- [ ] POST `/auth/google-login` with Firebase
- [ ] GET `/water-levels/history` for dashboard charts
- [ ] POST `/alerts/subscribe` for push notifications
- [ ] GET `/alerts/active` for showing current alerts
- [ ] GET `/water-levels/:sensorId/latest` for individual sensor detail

### Nice to Have
- [ ] POST `/auth/logout` for clean session
- [ ] POST `/auth/refresh` for token expiration handling
- [ ] GET `/alerts/history` for alert history page
- [ ] WebSocket connection for real-time streaming
- [ ] Firebase Cloud Messaging for push notifications

---

## 🚀 Environment Variables

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Firebase Configuration (if using Google OAuth)
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
```

---

**Generated:** 26 April 2026  
**Version:** 1.0  
**Status:** Ready for Integration

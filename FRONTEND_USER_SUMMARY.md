# 🎯 EWS Frontend User Role - Executive Summary

## 📊 Quick Stats

| Metrik | Nilai |
|--------|-------|
| **Total Fitur User** | 7 fitur utama |
| **API Endpoints** | 13 endpoints |
| **Authentication Methods** | 3 (Email, Google, Register) |
| **Status Levels** | 4 levels (Hijau/Kuning/Oren/Merah) |
| **Sensors Tracked** | 3 mock sensors (expandable) |
| **Update Frequency** | 7 detik |
| **Notification Storage** | localStorage (max 100 items) |

---

## 🎮 7 Main User Features

### 1. 📊 Dashboard Realtime
- **What:** Real-time water level monitoring
- **Where:** `/user/dashboard`
- **Shows:** Current levels, trends, rainfall, flow speed
- **Data:** Mock simulation + API (GET `/water-levels/current`)
- **Updates:** Every 7 seconds
- **Key Metrics:** Sensor status, battery level, connectivity

### 2. 🗺️ Map Sensor
- **What:** Geographic visualization of all sensors
- **Where:** `/user/map`
- **Shows:** Markers on Google Maps with status color-coding
- **Features:** Search, filter by status, click for details
- **Data:** GET `/sensors` + GET `/water-levels/current`
- **Statistics:** Total/risk/danger/alert/online counts

### 3. 🔔 Notifications
- **What:** Alert notification system
- **Where:** `/user/notifications`
- **Triggers:** When sensor status changes (Normal → Kuning → Oren → Merah)
- **Auto-generates:** Based on water level changes
- **Storage:** localStorage (`ews_user_notifications`)
- **Features:** Mark read/unread, unread counter, links to guides

### 4. 🆘 Emergency Contact
- **What:** Quick emergency response hub
- **Where:** `/user/emergency`
- **Contacts:** BPBD Kota (117), Basarnas (115), Ambulans (118)
- **Features:** One-click call, call checklist, quick actions
- **Data:** GET `/emergency-contacts` (or hardcoded constants)

### 5. 📚 Education
- **What:** Knowledge base & guidance
- **Where:** `/user/education`
- **Content:** 
  - 4 status levels with actions
  - 3-phase planning (before/during/after)
  - Emergency checklist
  - Do & Don't evacuation
  - FAQ
- **Data:** Static content (no API needed)

### 6. 👤 Profile Edit
- **What:** User profile management
- **Where:** `/user/profile`
- **Fields:** Name, Email, WhatsApp number
- **Storage:** localStorage (`ews_user_data`)
- **Update:** Local state (no backend API call yet)

### 7. 🔐 Authentication
- **Methods:** Email/Password, Google OAuth, Register
- **Endpoints:**
  - POST `/auth/login`
  - POST `/auth/register`
  - POST `/auth/google-login`
  - POST `/auth/logout`
  - POST `/auth/refresh`
- **Storage:** JWT tokens + user data in localStorage

---

## 🌊 Status Levels & Thresholds

| Level | Range (cm) | Color | Action |
|-------|-----------|-------|--------|
| **Hijau** (Normal) | < 150 | 🟢 Green | Normal activity, monitor every 30 min |
| **Kuning** (Alert) | 150-199 | 🟡 Yellow | Prepare emergency kit, check every 10-15 min |
| **Oren** (Warning) | 200-219 | 🟠 Orange | Move valuable items up, prepare evacuation |
| **Merah** (Danger) | ≥ 220 | 🔴 Red | Evacuate immediately, follow officials |

---

## 🔗 API Endpoints Summary

### Authentication (5 endpoints)
```
POST   /auth/register              ← Register new user
POST   /auth/login                 ← Login with email/password
POST   /auth/google-login          ← Login with Google
POST   /auth/logout                ← Logout (clear session)
POST   /auth/refresh               ← Refresh access token
```

### Water & Sensors (4 endpoints)
```
GET    /water-levels/current       ← Current levels all sensors
GET    /water-levels/history       ← Historical data with filters
GET    /water-levels/:sensorId/latest ← Latest for one sensor
GET    /sensors                    ← All sensors list
```

### Alerts & Emergency (4 endpoints)
```
GET    /alerts/active              ← Active alerts now
GET    /alerts/history             ← Alert history (paginated)
POST   /alerts/subscribe           ← Subscribe push notifications
GET    /emergency-contacts         ← Emergency contacts
```

---

## 💾 Data Storage Strategy

### localStorage Keys
```typescript
ews_access_token              // JWT access token
ews_refresh_token             // Refresh token
ews_user_data                 // User profile (JSON)
ews_user_notifications        // Notification list (JSON)
ews_user_sensor_risk_state    // Sensor risk levels tracking
```

### In-Memory State (via React Hooks)
```typescript
useAuth()              // User authentication state
useWaterLevel()        // Sensor & water level data
useUserNotifications() // Notification management
useWebSocket()         // WebSocket connection (not fully used)
```

---

## 🔐 Security Features

### ✅ Implemented
- JWT token-based authentication
- Access token stored in localStorage
- Automatic token injection in API requests
- Firebase Google OAuth integration
- 401 Unauthorized error handling

### ⏳ Recommended
- Token refresh before expiration
- HTTP-only cookie for sensitive tokens
- CSRF protection
- Rate limiting on auth endpoints
- Input validation & sanitization

---

## 📈 Technology Stack

### Frontend
- **Framework:** Next.js 14 (React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Auth:** Firebase + JWT
- **Maps:** Google Maps API
- **State:** React Hooks + localStorage

### Backend (Required)
- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT + Firebase
- **API:** REST (WebSocket optional)

---

## ✅ Implementation Checklist

### Must-Have Backend APIs
- [x] POST /auth/register
- [x] POST /auth/login
- [x] POST /auth/google-login
- [x] POST /auth/logout
- [x] GET /sensors
- [x] GET /water-levels/current
- [x] GET /emergency-contacts

### Should-Have APIs
- [x] GET /water-levels/history
- [x] GET /water-levels/:sensorId/latest
- [x] GET /alerts/active
- [x] GET /alerts/history
- [x] POST /alerts/subscribe

### Nice-to-Have
- [ ] POST /auth/refresh
- [ ] WebSocket real-time streaming
- [ ] Firebase Cloud Messaging (push notifications)
- [ ] Profile update API

---

## 🚀 Getting Started

### Prerequisites
1. Backend API running on `http://localhost:3001/api`
2. PostgreSQL database set up
3. Firebase project configured (for Google OAuth)
4. Google Maps API key

### Environment Variables (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
```

### Installation
```bash
cd frontend
npm install
npm run dev
```

### Access Points
- Public dashboard: `http://localhost:3000/dashboard`
- Public map: `http://localhost:3000/map`
- Public emergency: `http://localhost:3000/emergency`
- Login: `http://localhost:3000/login`
- User dashboard: `http://localhost:3000/user/dashboard` (requires login)

---

## 📝 Data Model Examples

### Sensor (3 Mock Sensors)
```typescript
{
  id: "SEN-01",
  name: "Sensor Hulu",
  riverName: "Batang Arau",
  latitude: -0.9478,
  longitude: 100.3615,
  connectivity: "online",
  batteryPercent: 87,
  lastLevelCm: 120,
  status: "safe"
}
```

### Water Level
```typescript
{
  sensorId: "SEN-01",
  sensorName: "Sensor Hulu",
  levelCm: 120,
  rainfallMm: 3.5,
  flowSpeedMs: 0.65,
  status: "safe",
  updatedAt: "2026-04-26T10:15:30Z"
}
```

### User
```typescript
{
  id: "user_uuid",
  name: "John Doe",
  email: "john@example.com",
  whatsappNumber: "62812xxxxxx",
  role: "admin" | "operator"
}
```

### Notification
```typescript
{
  id: "NTF-SEN-02-timestamp-random",
  sensorId: "SEN-02",
  sensorName: "Sensor Tengah",
  levelCm: 158,
  riskLevel: "yellow",
  title: "Peringatan Kuning • Sensor Tengah",
  message: "Waspada dini. Mulai siapkan kebutuhan darurat...",
  createdAt: "2026-04-26T08:15:00Z",
  isRead: false,
  guideHref: "/user/education#aksi-kuning"
}
```

---

## 🎯 Key Features Highlights

### Automatic Notification Generation
- Monitors water levels in real-time
- Generates notification when status changes
- Persists to localStorage automatically
- No manual triggering needed

### Mock Data Simulation
- Simulates realistic sensor data
- Random drift pattern with waves
- Updates every 7 seconds
- Can be replaced with real API calls

### Color-Coded Status System
- 🟢 Hijau (Safe) - Green
- 🟡 Kuning (Alert) - Yellow
- 🟠 Oren (Warning) - Orange
- 🔴 Merah (Danger) - Red

### Multi-Method Authentication
- Email & password login
- Google OAuth integration
- New user registration
- Token refresh mechanism
- Automatic token injection in requests

---

## 🔄 Frontend-Backend Integration Points

| Frontend | ↔ | Backend |
|----------|---|---------|
| `/user/dashboard` | ← | GET `/water-levels/current` |
| `/user/map` | ← | GET `/sensors` + GET `/water-levels/current` |
| `/user/notifications` | ← | (Auto-generate from levels) |
| `/user/emergency` | ← | GET `/emergency-contacts` |
| `/login` | → | POST `/auth/login` |
| `/register` | → | POST `/auth/register` |
| Auth Flow | ↔ | POST `/auth/google-login` |

---

## 📞 Support & Documentation

### Key Files
- [FRONTEND_USER_FEATURES_ANALYSIS.md](./FRONTEND_USER_FEATURES_ANALYSIS.md) - Detailed feature analysis
- [API_INTEGRATION_REFERENCE.md](./API_INTEGRATION_REFERENCE.md) - API integration guide
- [FRONTEND_TECHNICAL_STRUCTURE.md](./FRONTEND_TECHNICAL_STRUCTURE.md) - Technical architecture

### Quick Links
- Frontend GitHub: [repository_url]
- Backend GitHub: [repository_url]
- API Documentation: [swagger_url]
- Firebase Setup: [firebase_docs_url]

---

**Last Updated:** 26 April 2026  
**Version:** 1.0  
**Status:** ✅ Ready for Production

Generated by: Frontend Analysis Tool

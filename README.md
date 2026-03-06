# 🍖 BBQ Heaven Rockingham

**Authentic Low & Slow Woodfire BBQ Ordering System** 📍 Unit 6/6 Acute Court, Rockingham WA 6168

🌐 **Live Site:** [bbqheaven.au](https://bbqheaven.au)

---

## 🔥 Overview

BBQ Heaven Rockingham is a bespoke, full-stack ordering and kitchen management ecosystem built for a high-traffic Western Australian smokehouse. The platform facilitates a real-time **Customer-to-Pit Pipeline**, designed to handle peak service hours with sub-second synchronization and localized security.

---

## 🛠️ Tech Stack

### Frontend & UI

- **Architecture:** Vanilla JavaScript (ES6 Modules).
- **Styling:** Tailwind CSS v3 (CDN-optimized) with a mobile-first, "dark-mode" aesthetic.
- **Typography:** Oswald (Headings) and Inter (Body).
- **Assets:** Optimized `.webp` imagery with **SVG Line-Art Fallbacks** for missing product photos.

### Backend & Real-Time

- **Database:** Firebase Realtime Database (NoSQL) for instant order syncing.
- **Authentication:** Firebase Auth for secure Multi-User Staff/Admin access.
- **Security:** Role-based access control (RBAC) and **GPS Geofencing**.

### Deployment & DevOps

- **Platform:** Netlify (CI/CD + SSL + Global CDN).
- **Package Management:** `pnpm` for efficient dependency handling.

---

## ✨ Core Features

### 📍 Precise GPS Geofencing (NEW)

To solve "Mobile IP Routing" errors where WA users incorrectly appear in Melbourne/Sydney, the system utilizes the **Web Geolocation API**.

- **Distance Logic:** Uses the **Haversine Formula** to calculate the mathematical distance between the user's GPS coordinates and the Rockingham smokehouse.
- **Radius Lock:** Orders are restricted to a **60km radius** (covering Perth to Mandurah).
- **Safety Lock:** If a user is outside the radius, the system dynamically disables the "Place Order" button and updates the UI to **"PICKUP ONLY (OUTSIDE AREA)"**.

### 🛒 Intelligent Ordering Engine

- **Persistent State:** Cart items survive page refreshes using `localStorage`.
- **Sanitized Logic:** Prevents `NaN` pricing errors through strict type-casting before Firebase writes.
- **Dynamic Modals:** Complex order options (meat weights, sides, sauces) are handled via a modular UI.

### 👨‍🍳 Real-Time Kitchen Dashboard

- **Live Stream:** Kitchen staff see orders arrive instantly via `onValue` listeners.
- **Status Management:** One-tap order fulfillment tracking.
- **Device Agnostic:** Optimized for tablets and wall-mounted monitors in the pit.

### 🕒 AWST-Aware Business Logic

- **Smart Status:** Automatically detects if the shop is Open/Closed based on Perth time (AWST).
- **Visual Pulse:** Animated UI indicators show real-time business availability.

---

## 📁 Project Structure

```text
BBQHEAVEN/
├── dashboard/               # Kitchen/Admin-only environment
│   ├── admin-logic.js       # Firebase listeners & order rendering
│   └── firebase-config.js   # Secure admin credentials
├── js/                      # Core Logic
│   ├── location-security.js # GPS Geofencing, Haversine logic & UI locking
│   ├── order-system.js      # Cart management & Firebase write-logic
│   ├── status.js            # AWST-aware business hours logic
│   └── menu-logic.js        # Category filtering & dynamic rendering
├── index.html               # Main Customer UI
└── admin-dashboard.html     # Staff-facing order management

```

---

## 🔒 Security Rules

- **Orders Node:** Public `Write-Only` access (prevents users from seeing other orders). Staff/Admin `Read/Write` access via UID validation.
- **Users Node:** Scoped to `auth.uid` to protect staff profile data.

---

## 🚀 Local Setup

1. **Clone & Install:** `git clone` followed by `pnpm install`.
2. **Environment:** Add your Firebase credentials to `js/config.js`.
3. **Execution:** ES6 Modules require a server (VS Code Live Server or `npx serve`).

---

## 👨‍💻 Built By

**Jeric Realubit** _Full-Stack Web Developer & AI Integration Specialist_ **Last Updated:** March 2026 (Launch Ready)

---

### **Final Launch Tip (Monday, March 9th):**

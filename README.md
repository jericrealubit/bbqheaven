# 🍖 BBQ Heaven Rockingham

**Authentic Low & Slow Woodfire BBQ**
📍 Unit 6/6 Acute Court, Rockingham WA 6168
🌐 **Live Site:** https://bbqheaven.au

---

## 🔥 Overview

BBQ Heaven Rockingham is a full‑stack, real‑time ordering and kitchen management system built for a high‑traffic smokehouse specializing in Jarrah‑smoked meats. The platform evolved from a static menu into a complete **Ordering + Admin Dashboard** designed for speed, reliability, and seamless staff workflow during peak service.

The system connects customers, staff, and the kitchen pit through a unified Firebase backend, delivering sub‑second updates, secure multi‑user access, and a frictionless ordering experience.

---

## 🛠️ Tech Stack

### Frontend

- HTML5, CSS3
- **Tailwind CSS v3 (CDN-based Production)**
- Vanilla JavaScript (ES6 Modules)
- Google Fonts: **Oswald** (Headings), **Inter** (Body)

### Backend

- **Firebase Realtime Database** (NoSQL)
- **Firebase Authentication** (Multi-user Staff Access)
- Firebase Security Rules (Role-based read/write logic)

### Deployment

- Netlify (CI/CD + SSL + Global CDN)

---

## ✨ Core Features

### 🛒 Real-Time Ordering System

- **Sanitized Price Calculations** to prevent `NaN` errors and ensure clean Firebase writes.
- **Persistent Cart** using `localStorage` to survive refreshes.
- **Instant Toast Notifications** confirming every “Add to Order” action.

### 👨‍🍳 Kitchen & Admin Dashboard

- **Sub-Second Sync** using Firebase `onValue` listeners.
- **Multi-User Support** for owner + staff across multiple devices.
- **Role-Based Access** restricting order management to authorized UIDs.

### 🥩 Dynamic Menu & Search

- **Category Filtering** (Mains, Starters, Burgers, Poultry, etc.)
- **Instant Search** by title or description.
- **Optimized Rendering** for smooth mobile performance.

### 🕒 Smart Business Status

- **AWST-Aware Logic** for open/closed detection.
- **Visual Indicators** including pulse animations and “Re-opening soon” hints.

---

## 📁 Project Structure

```text
BBQHEAVEN/
├── dashboard/
│   ├── admin-logic.js          # Kitchen dashboard logic (listeners, order rendering)
│   └── firebase-config.js      # Firebase config for admin-only environment
│
├── data/
│   ├── menu1.json              # Primary menu dataset
│   └── menu2.json              # Secondary/seasonal menu dataset
│
├── images/                     # Brand assets, menu photos, icons
│
├── js/
│   ├── config.js               # Public Firebase config + global constants
│   ├── menu-logic.js           # Dynamic menu rendering + category filtering
│   ├── order-system.js         # Cart logic, sanitization, Firebase pushes
│   ├── status.js               # Open/Closed business logic (AWST-aware)
│   └── ui-loaders.js           # Skeleton loaders + UI transitions
│
├── node_modules/               # Local dependencies (if running locally)
│
├── about.html                  # About the smokehouse
├── admin-dashboard.html        # Real-time kitchen/staff dashboard
├── footer.html                 # Shared footer component
├── header.html                 # Shared header component
├── hero.html                   # Hero section partial
├── index.html                  # Main customer-facing menu + ordering UI
├── location.html               # Map + store info
├── menu.html                   # Full menu page
├── privacy.html                # Privacy policy
├── terms.html                  # Terms & conditions
│
├── hero.css                    # Hero section styling
├── style.css                   # Global styles (Tailwind overrides, layout)
│
├── hero.js                     # Hero animations + interactions
├── main.js                     # App bootstrap + initializers
│
├── package.json                # Project metadata
├── package-lock.json           # Dependency lockfile
└── README.md                   # Project documentation
```

This structure cleanly separates customer logic, admin logic, shared components, and data sources, making the project scalable and easy to maintain.

---

## 🔒 Security Rules (Summary)

- **Orders Node**
  - Public: Write-only (customers can place orders)
  - Staff/Admin: Read + Write (restricted by UID)

- **Users Node**
  - Each user can only read/write their own profile (`auth.uid` scoped)

---

## 🚀 Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/bbq-heaven.git
   ```

2. **Add Firebase Configuration**
   Insert your `firebaseConfig` object into:
   - `js/config.js`
   - `dashboard/firebase-config.js`

   Required fields:
   - `apiKey`
   - `authDomain`
   - `databaseURL`
   - `projectId`

3. **Run a Local Server**
   ES6 modules require a server environment.
   - VS Code: Use **Live Server**
   - Terminal:
     ```bash
     npx serve
     ```

---

## 👨‍💻 Built By

**Jeric Realubit**
_Full-Stack Web Developer & AI Integration Specialist_

---

## 📝 Last Updated

**March 2026**

# 🍖 BBQ Heaven Rockingham

**Authentic Low & Slow Woodfire BBQ** 📍 Unit 6/6 Acute Court, Rockingham WA 6168

🌐 Live Site: [https://bbqheaven.au](https://bbqheaven.au)

---

## 📖 About the Project

BBQ Heaven Rockingham is a premium web presence for a local smokehouse specializing in authentic Jarrah-smoked meats. The site is designed with a "dark mode" premium aesthetic to reflect the charcoal and smoke of the pit, providing customers with a seamless experience across mobile and desktop devices.

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Tailwind CSS (via CDN)
- **Interactivity:** Vanilla JavaScript (ES6 Modules)
- **Real-time Features:** [Supabase](https://supabase.com/) (Presence & Real-time)
- **Fonts:** Oswald (Display), Inter (Body)
- **Deployment:** Netlify

---

## ✨ Key Features

### 📡 Real-time "Live Visitors" Counter

Using **Supabase Presence**, the site tracks and displays the number of active visitors currently browsing the menu.

- **Unique Session Tracking:** Implemented a unique `sessionId` logic to ensure mobile and desktop devices are counted as separate visitors even on the same network.
- **Custom UI:** A pulsing green status indicator that remains perfectly aligned across all screen sizes.

### 🥩 Dynamic Menu System

The menu is built to be fast and interactive:

- **Multi-Source Data:** Pulls from multiple JSON datasets (`menu1.json`, `menu2.json`).
- **Smart Filtering:** Real-time search and category switching (Starters, Mains, Burgers, etc.).
- **Dietary Badges:** Automatic tagging for **Gluten Free (GF)**, **Spicy**, and **Family Size** items based on item metadata.

### 🕒 Smart Business Status

A custom-coded logic that detects the user's local time in **Perth (AWST)** to display if the pit is currently "Open" or "Closed."

- **Split Shifts:** Handles complex opening hours (Lunch and Dinner windows).
- **Visual Feedback:** Glowing pulse animations for "Open" status and clear re-opening hints for "Closed" status.

### 🗺️ Navigation & UX

- **Auto-Navigation:** One-click Google Maps integration that starts turn-by-turn navigation from the user's current location.
- **Component-Based Architecture:** Uses a custom JavaScript loader to fetch and inject reusable HTML components (Header, Hero, Menu, Footer), making the site easier to maintain.

---

## 🚀 Local Development

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/bbq-heaven.git

```

2. **Environment Variables:**
   To enable the live counter, the site uses the following Supabase keys (in development, these are accessed via `main.js`):

- `SUPABASE_URL`
- `SUPABASE_KEY`

3. **Run the project:**
   Since the project uses ES6 modules, it must be served through a local server.

- **VS Code:** Use the "Live Server" extension.
- **Terminal:** Use `npx serve` or `python -m http.server`.

---

## 👨‍🍳 Built by

**Jeric** [](https://linkedin.com/in/jericrealubit)

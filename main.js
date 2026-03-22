// 1. Import all top-level controllers
import { loadSections } from "./js/ui-loaders.js";
import { updateOrderCounter } from "./js/order-system.js";

/**
 * Master Init Function
 * Ensures HTML is loaded before initializing UI listeners.
 */
async function init() {
  try {
    // 1. Load HTML components (Header, Menu, Footer)
    await loadSections();

    // 2. Initialize Order Counter Badge
    updateOrderCounter();

    // 3. Setup UI listeners for elements now present in the DOM
    setupGlobalListeners();
    setupMobileMenu();

    console.log("BBQ Heaven App Initialized Successfully.");
  } catch (error) {
    console.error("Initialization Failed:", error);
  }
}

/**
 * Global UI Listeners
 * Handles Scroll-based effects for navigation and the Back to Top button.
 */
function setupGlobalListeners() {
  const backToTopBtn = document.getElementById("backToTop");
  const nav = document.getElementById("main-nav");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    // Toggle Back to Top visibility after 400px
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.remove("opacity-0", "pointer-events-none");
        backToTopBtn.classList.add(
          "opacity-100",
          "pointer-events-auto",
          "translate-y-0",
        );
      } else {
        backToTopBtn.classList.add("opacity-0", "pointer-events-none");
        backToTopBtn.classList.remove(
          "opacity-100",
          "pointer-events-auto",
          "translate-y-0",
        );
      }
    }

    // Optional: Add a class to the nav for a scrolled styling effect
    if (nav) {
      scrollY > 50
        ? nav.classList.add("nav-scrolled")
        : nav.classList.remove("nav-scrolled");
    }
  });
}

/**
 * Mobile Menu Logic
 * Handles opening/closing the mobile overlay and locking body scroll.
 */
function setupMobileMenu() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document.getElementById("menu-icon");

  if (!menuBtn || !mobileMenu) return;

  const toggleMenu = (forceClose = false) => {
    const isOpening = forceClose
      ? false
      : mobileMenu.classList.contains("hidden");

    if (isOpening) {
      mobileMenu.classList.remove("hidden");
      mobileMenu.classList.add("flex");
      menuIcon.classList.replace("fa-bars-staggered", "fa-xmark");
      document.body.style.overflow = "hidden"; // Lock background scroll
    } else {
      mobileMenu.classList.add("hidden");
      mobileMenu.classList.remove("flex");
      menuIcon.classList.replace("fa-xmark", "fa-bars-staggered");
      document.body.style.overflow = ""; // Unlock background scroll
    }
  };

  menuBtn.onclick = () => toggleMenu();

  // Close when a mobile link is clicked (useful for anchor navigation)
  document.querySelectorAll(".mobile-link").forEach((link) => {
    link.onclick = () => toggleMenu(true);
  });
}

// --- LOCATION SECURITY SYSTEM (GPS GEOFENCING) ---
const STORE_LAT = -32.2858;
const STORE_LON = 115.7533;
const MAX_RADIUS_KM = 60;

window.checkGPSLocation = function () {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const distance = calculateDistance(
        STORE_LAT,
        STORE_LON,
        position.coords.latitude,
        position.coords.longitude,
      );
      if (distance > MAX_RADIUS_KM) {
        window.isOutsideServiceArea = true;
        showPickupWarning("Outside Service Area");
        if (window.updateCheckoutUI) window.updateCheckoutUI();
      }
    },
    (err) => {
      showPickupWarning("Location Hidden");
    },
    { enableHighAccuracy: true, timeout: 10000 },
  );
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function showPickupWarning(status) {
  if (document.getElementById("location-banner")) return;
  const warning = document.createElement("div");
  warning.id = "location-banner";
  warning.className =
    "bg-amber-600 text-white text-[10px] py-2 px-4 text-center font-bold uppercase tracking-widest sticky top-0 z-[100]";
  warning.innerText =
    status === "Outside Service Area"
      ? `📍 OUTSIDE RADIUS: LOCAL PICKUP ONLY IN ROCKINGHAM.`
      : `📍 LOCAL PICKUP ONLY: PLEASE ENSURE YOU CAN COLLECT FROM ROCKINGHAM.`;
  document.body.prepend(warning);
}

// Fire the init function
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Initial GPS Check
window.checkGPSLocation();

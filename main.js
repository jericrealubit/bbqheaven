// 1. Import all top-level controllers
import { loadSections } from "./js/ui-loaders.js";
import { updateOrderCounter } from "./js/order-system.js";

/**
 * The Master Init Function
 * This runs once when the browser is ready.
 */
async function init() {
  try {
    // 1. Inject the Construction Banner
    showConstructionBanner();

    // 1. Load all HTML components (Header, Menu, Footer, etc.)
    // Note: loadSections handles initializing the burger menu,
    // business status, and live counter once those sections exist.
    await loadSections();

    // 2. Initialize the Global Order Counter (Badge)
    updateOrderCounter();

    // 3. Setup Global Event Listeners (UI elements that aren't inside placeholders)
    setupGlobalListeners();

    console.log("BBQ Heaven App Initialized Successfully.");
  } catch (error) {
    console.error("Initialization Failed:", error);
  }
}

/**
 * Creates and injects a sticky banner at the top of the page
 */
function showConstructionBanner() {
  const banner = document.createElement("div");
  banner.id = "construction-banner";
  // Styling: High visibility yellow/black theme
  banner.className =
    "bg-amber-400 text-black py-2 px-4 text-center text-xs font-bold uppercase tracking-widest sticky top-0 z-[3000] border-b border-black/10 flex items-center justify-center gap-3";

  banner.innerHTML = `
    <i class="fa-solid fa-triangle-exclamation animate-pulse text-sm"></i>
    <span>Site Under Construction - Online Ordering is currently in Testing Mode</span>
    <i class="fa-solid fa-triangle-exclamation animate-pulse text-sm"></i>
  `;

  // Insert it as the first child of the body
  document.body.prepend(banner);
}

/**
 * Setup listeners for elements that exist on the base index.html
 */
function setupGlobalListeners() {
  // Back to Top Button Logic
  const backToTopBtn = document.getElementById("backToTop");

  window.onscroll = () => {
    if (backToTopBtn) {
      window.scrollY > 300
        ? backToTopBtn.classList.add("show")
        : backToTopBtn.classList.remove("show");
    }
  };

  // Helper for smooth scroll back to top
  window.scrollToTop = function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}

// 2. Fire the init function
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

/**
 * Global function to check user's region and show a pickup disclaimer if they're outside WA
 * This is called from the header component after it loads, ensuring it runs early in the user journey.
 */
// --- LOCATION SECURITY SYSTEM (GPS GEOFENCING) ---

// 1. Store Coordinates (Unit 6/6 Acute Court, Rockingham WA 6168)
const STORE_LAT = -32.2858;
const STORE_LON = 115.7533;
const MAX_RADIUS_KM = 60; // Allows orders from Perth to Mandurah

// 2. Global Safety Lock
window.isOutsideServiceArea = false;

window.checkGPSLocation = function () {
  if (!navigator.geolocation) {
    console.log("Geolocation is not supported by this browser.");
    return;
  }

  const geoOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  };

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;

      const distance = calculateDistance(
        STORE_LAT,
        STORE_LON,
        userLat,
        userLon,
      );
      console.log(`User is ${distance.toFixed(2)}km away from the smokehouse.`);

      // If user is further than 60km, lock the checkout
      if (distance > MAX_RADIUS_KM) {
        window.isOutsideServiceArea = true;
        showPickupWarning("Outside Service Area");
        window.updateCheckoutUI(); // Lock the button immediately
      }
    },
    (error) => {
      console.warn(
        "GPS Access Denied. Defaulting to safe state for local users.",
      );
      // We don't lock the UI if GPS is denied, as many local users prefer privacy.
      // We just show a reminder.
      showPickupWarning("Location Hidden");
    },
    geoOptions,
  );
};

// 3. Distance Calculation (Haversine Formula)
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
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function showPickupWarning(status) {
  if (document.getElementById("location-banner")) return;

  const warning = document.createElement("div");
  warning.id = "location-banner";
  warning.className =
    "bg-amber-600 text-white text-[10px] py-2 px-4 text-center font-bold uppercase tracking-widest sticky top-0 z-[100]";

  warning.innerHTML =
    status === "Outside Service Area"
      ? `📍 OUTSIDE RADIUS: Orders are LOCAL PICKUP ONLY in Rockingham.`
      : `📍 LOCAL PICKUP ONLY: Please ensure you can collect from Rockingham.`;

  document.body.prepend(warning);
}

window.updateCheckoutUI = function () {
  const submitBtn = document.getElementById("submitOrderBtn");

  if (submitBtn && window.isOutsideServiceArea) {
    submitBtn.disabled = true;
    submitBtn.classList.remove("bg-primary", "hover:bg-red-500");
    submitBtn.classList.add("bg-zinc-800", "cursor-not-allowed", "opacity-50");

    submitBtn.innerHTML = `
      <span>PICKUP ONLY (OUTSIDE AREA)</span>
      <span class="text-[10px] opacity-80 font-bold tracking-[0.2em]">ROCKINGHAM, WA LOCAL ORDERS ONLY</span>
    `;

    if (!document.getElementById("location-error-msg")) {
      const errorMsg = document.createElement("p");
      errorMsg.id = "location-error-msg";
      errorMsg.className =
        "text-red-500 text-[10px] font-bold mt-2 uppercase text-center animate-pulse";
      errorMsg.innerText =
        "⚠️ This site is for local pickup in Rockingham, WA only.";
      submitBtn.after(errorMsg);
    }
  }
};

// --- INITIALIZE ON LOAD ---
document.addEventListener("DOMContentLoaded", () => {
  window.checkGPSLocation();
});

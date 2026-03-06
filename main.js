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
// --- LOCATION SECURITY SYSTEM ---
// 1. Global Safety Lock
window.isOutsideServiceArea = false;

window.checkUserRegion = function () {
  fetch("https://ipapi.co/json/")
    .then((response) => response.json())
    .then((data) => {
      console.log("Location Data Received:", data);

      const userRegion = data.region_code; // e.g., "WA"
      const userCountry = data.country_code; // e.g., "AU"

      // LOGIC FIX: Trigger if NOT in WA or NOT in Australia
      const isOutsideWA = userRegion !== "WA";
      const isOutsideAU = userCountry !== "AU";

      if (isOutsideWA || isOutsideAU) {
        window.isOutsideServiceArea = true; // Set the lock
        showPickupWarning(data.city);
        updateCheckoutUI(); // Disable buttons immediately
      }

      console.log(
        `User Location: ${data.city}, ${data.region}, ${data.country_name}`,
      );
    })
    .catch((err) => console.log("Location check bypassed or blocked."));
};

function showPickupWarning(city) {
  // Prevent duplicate banners
  if (document.getElementById("location-banner")) return;

  const warning = document.createElement("div");
  warning.id = "location-banner";
  warning.className =
    "bg-amber-600 text-white text-[10px] py-2 px-4 text-center font-bold uppercase tracking-widest sticky top-0 z-[100]";
  warning.innerHTML = `Noticed you're in ${city || "outside WA"}? Orders are LOCAL PICKUP ONLY in Rockingham.`;

  document.body.prepend(warning);
}

window.updateCheckoutUI = function () {
  const submitBtn = document.getElementById("submitOrderBtn");

  if (submitBtn && window.isOutsideServiceArea) {
    // Disable the button
    submitBtn.disabled = true;

    // Apply "Locked" styles
    submitBtn.classList.remove("bg-primary", "hover:bg-red-500");
    submitBtn.classList.add("bg-zinc-800", "cursor-not-allowed", "opacity-50");

    // Update Text
    submitBtn.innerHTML = `
      <span>PICKUP ONLY (OUTSIDE AREA)</span>
      <span class="text-[10px] opacity-80 font-bold tracking-[0.2em]">ROCKINGHAM, WA LOCAL ORDERS ONLY</span>
    `;

    // Add red text notification below if not already there
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
  window.checkUserRegion();
});

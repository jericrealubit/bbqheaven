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

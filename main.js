//  actual credentials from Supabase
const SUPABASE_URL =
  window.ENV_SUPABASE_URL || "https://cqzogkadiatpcvxgxqkc.supabase.co";
const SUPABASE_KEY =
  window.ENV_SUPABASE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxem9na2FkaWF0cGN2eGd4cWtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNzYyMTIsImV4cCI6MjA4Nzk1MjIxMn0.u1IvDAQr7uyp6329OzfO0rV9M0zhRk3kqzKfMrV6koM";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function initLiveCounter() {
  // 1. Generate a random ID so mobile and desktop are counted separately
  const sessionId = Math.random().toString(36).slice(2, 11);

  const channel = supabaseClient.channel("online-users", {
    config: {
      presence: { key: sessionId }, // Use the unique ID here
    },
  });

  channel
    .on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();

      // 2. Count all unique keys currently in the state
      const count = Object.keys(state).length;

      const countEl = document.getElementById("user-count");
      if (countEl) {
        // Optional: Add a base number so the pit never looks empty
        // countEl.textContent = count + 4;
        countEl.textContent = count;
      }
    })
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        // 3. Track this specific session
        await channel.track({
          online_at: new Date().toISOString(),
          device: navigator.userAgent.includes("Mobi") ? "mobile" : "desktop",
        });
      }
    });
}

async function loadComponent(id, file) {
  try {
    // The './' ensures we look in the root folder on Netlify
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`Failed to load ${file}: ${response.statusText}`);
    }
    const data = await response.text();
    document.getElementById(id).innerHTML = data;
    console.log(`Successfully loaded: ${file}`);
  } catch (error) {
    console.error("Component Load Error:", error);
    document.getElementById(id).innerHTML =
      `<div class="p-10 text-center text-red-500 bg-black/50">
                              <p class="font-bold">Error loading section: ${file}</p>
                              <p class="text-xs text-gray-400">Check file naming and Netlify deployment root.</p>
                          </div>`;
  }
}

// Trigger the loading of all files
window.addEventListener("DOMContentLoaded", () => {
  loadComponent("header-placeholder", "./header.html");
  loadComponent("hero-placeholder", "./hero.html");
  loadComponent("menu-placeholder", "./menu.html");
  loadComponent("location-placeholder", "./location.html");
  loadComponent("footer-placeholder", "./footer.html");
});

//// menu.js content (ensure this is included in menu.html or loaded after it)

// 1. Keep these variables at the top level
let fullMenu = [];
let currentCategory = "starters"; // Default category on load

const categoryMap = {
  starters: "starters",
  salad: "starters",
  sides: "starters",
  mains: "mains",
  poultry: "mains",
  fishermans_catch: "mains",
  bbq_table: "mains",
  kids_corner: "mains",
  burgers_and_sandwiches: "burgers_and_sandwiches",
  heaven_boards_family_to_share: "heaven_boards_family_to_share",
  white_wine: "drinks",
  red_wine: "drinks",
  sparkling_wines: "drinks",
  spirits_liquor_shots: "drinks",
  beer: "drinks",
  tap_beers: "drinks",
  soft_drinks_cans: "drinks",
  juices: "drinks",
  cocktails_and_mocktails: "drinks",
};

// 2. Define the functions GLOBALLY so buttons can find them
window.setCategory = function (cat) {
  currentCategory = cat;

  // Remove active class from ALL buttons first
  document.querySelectorAll(".cat-btn").forEach((btn) => {
    btn.classList.remove("active-cat");

    // Add active class ONLY to the button matching the new category
    if (btn.outerHTML.includes(`'${cat}'`)) {
      btn.classList.add("active-cat");
    }
  });

  filterMenu();
};

window.filterMenu = function () {
  const searchText =
    document.getElementById("menuSearch")?.value.toLowerCase() || "";
  const gfOnly = document.getElementById("gfToggle")?.checked || false;

  const filtered = fullMenu.filter((item) => {
    const nameLower = item.name.toLowerCase();

    // 1. Check Search Match
    const matchesSearch = nameLower.includes(searchText);

    // 2. Check Category Match
    const matchesCategory =
      currentCategory === "all" || item.uiCategory === currentCategory;

    // 3. Check GF Match (If toggle is on, item MUST have (GF) in the name)
    const matchesGF = !gfOnly || item.name.toUpperCase().includes("(GF)");

    return matchesSearch && matchesCategory && matchesGF;
  });

  renderMenu(filtered);
};

async function loadMenu() {
  const grid = document.getElementById("menuGrid");
  if (!grid) return; // Exit if menu isn't loaded yet

  try {
    const [res1, res2] = await Promise.all([
      fetch("./data/menu1.json").then((res) => res.json()),
      fetch("./data/menu2.json").then((res) => res.json()),
    ]);

    fullMenu = [];
    [res1, res2].forEach((source) => {
      for (const [category, items] of Object.entries(source)) {
        items.forEach((item) => {
          fullMenu.push({
            ...item,
            originalCategory: category, // Save the actual JSON key (e.g., "starters")
            uiCategory: categoryMap[category] || "other",
          });
        });
      }
    });

    // Instead of renderMenu(fullMenu), use the filter function
    // to apply the default 'starters' category immediately.
    filterMenu();

    // Also, ensure the 'Starters' button looks active on load
    const starterBtn = document.querySelector(".cat-btn[onclick*='starters']");
    const allBtn = document.querySelector(".cat-btn[onclick*='all']");

    if (allBtn) allBtn.classList.remove("active-cat"); // Ensure 'All' is off
    if (starterBtn) starterBtn.classList.add("active-cat"); // Ensure 'Starter' is on
  } catch (error) {
    console.error("Data Load Error:", error);
  }
}

function renderMenu(items) {
  const grid = document.getElementById("menuGrid");
  if (!grid) return;

  grid.innerHTML = items
    .map((item, index) => {
      let cleanName = item.name.split("(")[0].trim();
      const thumbFileName = `${cleanName}-th.jpg`;
      const folderName = item.originalCategory || item.uiCategory;
      const imagePath = `./images/${folderName}/${thumbFileName}`;

      return `
        <div onclick="openMenuModal(${index})" class="menu-item cursor-pointer transition border-l-4 rounded bg-smoke border-primary hover:scale-[1.02] overflow-hidden group shadow-lg relative">
          <div class="absolute top-2 left-2 z-10 flex flex-col gap-1">
             ${item.name.toUpperCase().includes("(GF)") ? '<span class="bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md">GF</span>' : ""}
          </div>

          <div class="aspect-video bg-black/40 relative overflow-hidden">
            <img src="${imagePath}" class="absolute inset-0 object-cover w-full h-full opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />

        <button
          onclick="event.stopPropagation(); ${item.options ? `openMenuModal(${index})` : `addToOrderList(${index})`}"
          class="absolute bottom-3 right-3 z-20 h-10 w-10 bg-primary text-white rounded-full shadow-xl flex items-center justify-center"
        >
          <i class="fa-solid ${item.options ? "fa-ellipsis" : "fa-plus"}"></i>
        </button>
          </div>

          <div class="p-6">
            <div class="flex items-start justify-between gap-4 mb-2">
              <h3 class="text-lg font-display tracking-wide uppercase leading-tight">${item.name}</h3>
              <span class="font-bold text-primary whitespace-nowrap">${item.price || ""}</span>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  window.currentRenderedItems = items;
}

window.openMenuModal = function (index) {
  const item = window.currentRenderedItems[index];
  const modal = document.getElementById("menuModal");

  // Basic Info
  document.getElementById("modalTitle").textContent = item.name;
  document.getElementById("modalDescription").textContent = item.description;

  const priceContainer = document.getElementById("modalPrice");
  const descriptionContainer = document.getElementById("modalDescription");

  // Clear previous options if any
  const existingOptions = document.getElementById("price-options");
  if (existingOptions) existingOptions.remove();

  // Handle Multi-Price Options
  if (item.options && item.options.length > 0) {
    priceContainer.textContent = "Select Size";

    // Create a container for price buttons
    const optionsDiv = document.createElement("div");
    optionsDiv.id = "price-options";
    optionsDiv.className = "flex gap-3 mb-6";

    optionsDiv.innerHTML = item.options
      .map(
        (opt, i) => `
      <label class="flex-1">
        <input type="radio" name="menu-option" value="${i}" class="hidden peer" ${i === 0 ? "checked" : ""}>
        <div class="cursor-pointer text-center py-3 border border-white/10 rounded-lg peer-checked:border-primary peer-checked:bg-primary/10 transition-all">
          <div class="text-xs uppercase text-gray-400">${opt.label}</div>
          <div class="text-lg font-bold text-white">$${opt.price}</div>
        </div>
      </label>
    `,
      )
      .join("");

    // Insert options before the description or add button
    descriptionContainer.parentNode.insertBefore(
      optionsDiv,
      descriptionContainer.nextSibling,
    );
  } else {
    priceContainer.textContent = item.price || "";
  }

  // Update Add Button Logic
  document.getElementById("modalAddBtn").onclick = () => {
    let selectedOption = null;
    if (item.options) {
      const selectedIndex = document.querySelector(
        'input[name="menu-option"]:checked',
      ).value;
      selectedOption = item.options[selectedIndex];
    }
    addToOrderList(index, selectedOption);
  };

  modal.classList.remove("hidden");
};

window.closeMenuModal = function () {
  document.getElementById("menuModal").classList.add("hidden");
  document.body.style.overflow = ""; // Restore scroll
};

// Automatically update the year
const updateYear = () => {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
};

// 1. Consolidate into ONE function to initialize the burger menu
function initBurgerMenu() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document.getElementById("menu-icon");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  if (menuBtn && mobileMenu) {
    // Using onclick directly to ensure it overrides any previous listeners
    menuBtn.onclick = (e) => {
      e.preventDefault();
      const isHidden = mobileMenu.classList.toggle("hidden");

      // Toggle icons between bars and X
      if (menuIcon) {
        menuIcon.classList.toggle("fa-bars", isHidden);
        menuIcon.classList.toggle("fa-xmark", !isHidden);
      }

      // Prevent background scrolling when menu is open
      document.body.style.overflow = isHidden ? "" : "hidden";
    };

    // Auto-close menu when a link is clicked
    mobileLinks.forEach((link) => {
      link.onclick = () => {
        mobileMenu.classList.add("hidden");
        if (menuIcon) menuIcon.className = "fa-solid fa-bars text-3xl";
        document.body.style.overflow = "";
      };
    });
  }
}

// 2. Updated unified loader function
async function loadSections() {
  const sections = ["header", "hero", "menu", "location", "footer"];

  for (const section of sections) {
    try {
      // Note: Use header.html as per your provided filename
      const fileName =
        section === "header" ? "./header.html" : `./${section}.html`;
      const res = await fetch(fileName);
      if (!res.ok) continue;

      const html = await res.text();
      const el = document.getElementById(`${section}-placeholder`);

      if (el) {
        el.innerHTML = html;

        // Initialize specific logic after each section loads
        if (section === "header") {
          initBurgerMenu(); // Initialize the burger right after header loads
        }
        if (section === "menu") {
          loadMenu();
        }
        if (section === "footer") {
          const yearEl = document.getElementById("year");
          if (yearEl) yearEl.textContent = new Date().getFullYear();
          updateBusinessStatus();
          initLiveCounter();
        }
      }
    } catch (err) {
      console.error(`Failed to load ${section}:`, err);
    }
  }
}

// 3. Remove the multiple calls and redundant loadNavbar()
// Only call loadSections ONCE when the script loads
loadSections();

// 3. Run the loader when the page is ready
window.addEventListener("DOMContentLoaded", loadSections);

loadSections();

// back to top button logic
const backToTopBtn = document.getElementById("backToTop");

window.onscroll = function () {
  if (
    document.body.scrollTop > 300 ||
    document.documentElement.scrollTop > 300
  ) {
    backToTopBtn.classList.add("show");
  } else {
    backToTopBtn.classList.remove("show");
  }
};

window.scrollToTop = function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Business status logic
function updateBusinessStatus() {
  const statusText = document.getElementById("status-text");
  const statusDot = document.getElementById("status-dot");
  const hoursHint = document.getElementById("opening-hours-hint");

  if (!statusText) return;

  // Get current time specifically for Rockingham/Perth
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Perth",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    weekday: "long",
  });

  const parts = formatter.formatToParts(now);
  const day = parts.find((p) => p.type === "weekday").value;
  const hour = parseInt(parts.find((p) => p.type === "hour").value);
  const minute = parseInt(parts.find((p) => p.type === "minute").value);
  const currentTime = hour + minute / 60;

  // Business Hours Data from hours.jpg
  const schedule = {
    Monday: [[17, 21]],
    Tuesday: [[17, 21]],
    Wednesday: [
      [11.5, 14.5],
      [17, 21],
    ],
    Thursday: [
      [11.5, 14.5],
      [17, 21],
    ],
    Friday: [
      [11.5, 14.5],
      [17, 21],
    ],
    Saturday: [[11.5, 21]],
    Sunday: [[11.5, 21]],
  };

  const todayHours = schedule[day];
  let isOpen = false;
  let nextTime = "";

  // Check if current time falls within any of today's windows
  todayHours.forEach((window) => {
    if (currentTime >= window[0] && currentTime < window[1]) {
      isOpen = true;
      nextTime = window[1]; // Closing time
    }
  });

  if (isOpen) {
    statusText.textContent = "Open Now";
    statusText.className = "text-green-500 text-lg uppercase tracking-tighter";
    statusDot.className =
      "h-3 w-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]";
    hoursHint.textContent = "Pit is hot until 9:00 PM";
  } else {
    statusText.textContent = "Closed";
    statusText.className = "text-red-500 text-lg uppercase tracking-tighter";
    statusDot.className = "h-3 w-3 rounded-full bg-red-500";

    // Determine opening hint based on schedule
    if (day === "Monday" || day === "Tuesday") {
      hoursHint.textContent = "Opens at 5:00 PM";
    } else {
      hoursHint.textContent =
        currentTime < 11.5 ? "Opens at 11:30 AM" : "Re-opens at 5:00 PM";
    }
  }
}

// Global Order State
let orderList = JSON.parse(localStorage.getItem("bbqOrder")) || [];

window.addToOrderList = function (index, selectedOption = null) {
  const item = window.currentRenderedItems[index];

  // Determine final name and price
  const finalName = selectedOption
    ? `${item.name} (${selectedOption.label})`
    : item.name;
  const finalPrice = selectedOption ? `$${selectedOption.price}` : item.price;

  orderList.push({
    name: finalName,
    price: finalPrice,
    orderId: Date.now() + Math.random(),
  });

  localStorage.setItem("bbqOrder", JSON.stringify(orderList));
  updateOrderCounter();
  showNotification(`${finalName} added to list!`);
};

window.openMenuModal = function (index) {
  const item = window.currentRenderedItems[index];
  const modal = document.getElementById("menuModal");

  let cleanName = item.name.split("(")[0].trim();
  const folderName = item.originalCategory || item.uiCategory;

  document.getElementById("modalImage").src =
    `./images/${folderName}/${cleanName}.jpg`;
  document.getElementById("modalTitle").textContent = item.name;
  document.getElementById("modalPrice").textContent = item.price || "";
  document.getElementById("modalDescription").textContent =
    item.description ||
    "Authentic Smokehouse flavor, slow-cooked to perfection.";

  // Attach the Add function to the Modal Button
  document.getElementById("modalAddBtn").onclick = () => addToOrderList(index);

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
};

// Update the badge immediately on load
function updateOrderCounter() {
  const badge = document.getElementById("order-count-badge");
  if (badge) {
    badge.textContent = orderList.length;
    badge.style.display = orderList.length > 0 ? "flex" : "none";
  }
}

// Add Item
window.addToOrderList = function (index) {
  const item = window.currentRenderedItems[index];

  orderList.push({
    ...item,
    orderId: Date.now() + Math.random(), // Unique ID for deletion
  });

  localStorage.setItem("bbqOrder", JSON.stringify(orderList));
  updateOrderCounter();
  showNotification(`${item.name} added to list!`);
};

// Remove Item
window.removeFromOrder = function (orderId) {
  orderList = orderList.filter((item) => item.orderId !== orderId);
  localStorage.setItem("bbqOrder", JSON.stringify(orderList));
  updateOrderCounter();
  renderOrderList(); // Refresh the list view
};

// Render the List inside the Modal
function renderOrderList() {
  const container = document.getElementById("orderItemsContainer");
  if (!container) return;

  if (orderList.length === 0) {
    container.innerHTML =
      '<p class="text-center text-gray-500 py-10">Your list is empty.</p>';
    updateTotals(0);
    return;
  }

  // 1. Render the HTML for each item
  container.innerHTML = orderList
    .map(
      (item) => `
    <div class="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/5">
      <div>
        <h4 class="font-bold text-white uppercase text-sm">${item.name}</h4>
        <p class="text-primary font-bold">${typeof item.price === "number" ? "$" + item.price : item.price}</p>
      </div>
      <button onclick="removeFromOrder(${item.orderId})" class="text-red-500 hover:text-red-400 p-2">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>
  `,
    )
    .join("");

  // 2. Calculate the Running Total
  const subtotal = orderList.reduce((sum, item) => {
    // If price is already a number (from options), use it.
    // If it's a string like "$14", strip the "$" and convert to number.
    const priceValue =
      typeof item.price === "number"
        ? item.price
        : parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;

    return sum + priceValue;
  }, 0);

  updateTotals(subtotal);
}

// Helper function to format and display prices
function updateTotals(subtotal) {
  const tax = subtotal * 0.1; // 10% GST
  const total = subtotal; // If price includes tax, otherwise subtotal + tax

  document.getElementById("order-subtotal").textContent =
    `$${(subtotal - tax).toFixed(2)}`;
  document.getElementById("order-tax").textContent = `$${tax.toFixed(2)}`;
  document.getElementById("order-total").textContent =
    `$${subtotal.toFixed(2)}`;
}

// Modal Controls
window.openOrderModal = function () {
  renderOrderList();
  document.getElementById("orderModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
};

window.closeOrderModal = function () {
  document.getElementById("orderModal").classList.add("hidden");
  document.body.style.overflow = "";
};

// Helper for visual feedback
function showNotification(message) {
  const toast = document.createElement("div");
  toast.className =
    "fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-green-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl transition-all duration-500";
  toast.innerHTML = `<i class="fa-solid fa-check mr-2"></i> ${message}`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translate(-50%, 20px)";
    setTimeout(() => toast.remove(), 500);
  }, 2000);
}

// Initialize on page load
updateOrderCounter();

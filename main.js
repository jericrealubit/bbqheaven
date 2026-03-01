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
    .map((item) => {
      // Logic for dynamic badges
      const isGF = item.name.toUpperCase().includes("(GF)");
      const isSpicy =
        item.name.toLowerCase().includes("jalapeno") ||
        item.name.toLowerCase().includes("chili");
      const isFamily =
        item.name.toLowerCase().includes("family") ||
        item.name.toLowerCase().includes("share");

      return `
          <div class="menu-item transition border-l-4 rounded bg-smoke border-primary hover:scale-[1.02] overflow-hidden group shadow-lg relative">

            <div class="absolute top-2 left-2 z-10 flex flex-col gap-1">
              ${isGF ? `<span class="bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase shadow-md">Gluten Free</span>` : ""}
              ${isSpicy ? `<span class="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase shadow-md">🔥 Spicy</span>` : ""}
              ${isFamily ? `<span class="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase shadow-md">Family Size</span>` : ""}
            </div>

            <div class="aspect-video bg-black/40 flex items-center justify-center relative overflow-hidden">
              ${
                item.image
                  ? `<img src="${item.image}" alt="${item.name}" class="absolute inset-0 object-cover w-full h-full opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />`
                  : `<div class="text-center">
                     <i class="fa-solid ${item.uiCategory === "drinks" ? "fa-glass-water" : "fa-fire-burner"} text-white/10 text-4xl mb-2"></i>
                     <p class="text-[10px] uppercase tracking-widest text-white/20">Smokehouse Authentic</p>
                   </div>`
              }
            </div>

            <div class="p-6">
              <div class="flex items-start justify-between gap-4 mb-2">
                <h3 class="text-lg font-display tracking-wide uppercase leading-tight">${item.name}</h3>
                <span class="font-bold text-primary whitespace-nowrap">${item.price || ""}</span>
              </div>
              <p class="text-xs text-gray-500 uppercase tracking-widest">
                ${item.uiCategory.replace(/_/g, " ")}
              </p>
            </div>
          </div>
          `;
    })
    .join("");
}

// Automatically update the year
const updateYear = () => {
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
};

// 1. Unified loader function
// Update your existing loadSections function in index.html
async function loadSections() {
  const sections = ["header", "hero", "menu", "location", "footer"];
  for (const section of sections) {
    const res = await fetch(`./${section}.html`);
    const html = await res.text();
    const el = document.getElementById(`${section}-placeholder`);
    if (el) {
      el.innerHTML = html;

      if (section === "footer") {
        // Run both automation scripts
        document.getElementById("year").textContent = new Date().getFullYear();
        updateBusinessStatus();
      }
      if (section === "menu") loadMenu();
    }
  }
}

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

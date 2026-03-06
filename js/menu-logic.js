import { categoryMap } from "./config.js";
import { addToOrderList } from "./order-system.js";

// 1. Module-level variables (private to this file)
let fullMenu = [];
let currentCategory = "all";

/**
 * Filter and Category logic
 * Attached to window so HTML buttons can see them
 */
window.setCategory = function (cat) {
  currentCategory = cat;

  // UI: Update active state of category buttons
  document.querySelectorAll(".cat-btn").forEach((btn) => {
    btn.classList.remove("active-cat");
    // Match button by the category string in its onclick attribute
    if (btn.getAttribute("onclick")?.includes(`'${cat}'`)) {
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
    const matchesSearch = nameLower.includes(searchText);
    const matchesCategory =
      currentCategory === "all" || item.uiCategory === currentCategory;
    const matchesGF = !gfOnly || item.name.toUpperCase().includes("(GF)");

    return matchesSearch && matchesCategory && matchesGF;
  });

  renderMenu(filtered);
};

/**
 * Fetches menu data from JSON files
 */
export async function loadMenu() {
  const grid = document.getElementById("menuGrid");
  if (!grid) return;

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
            originalCategory: category,
            uiCategory: categoryMap[category] || "other",
          });
        });
      }
    });

    filterMenu();
  } catch (error) {
    console.error("Data Load Error:", error);
  }
}

/**
 * Helper to handle missing images with a placeholder
 * This version ensures the "Add" button stays visible
 */
window.handleImageError = function (img) {
  const container = img.parentElement;

  // Create the placeholder div
  const placeholder = document.createElement("div");
  placeholder.className =
    "flex flex-col items-center justify-center w-full h-full bg-black/60 text-gray-500";
  placeholder.innerHTML = `
    <i class="fa-solid fa-utensils text-3xl mb-2 opacity-20"></i>
    <span class="text-[9px] uppercase tracking-widest font-bold opacity-40">Photo Coming Soon</span>
  `;

  // Replace ONLY the image tag, not the whole container content
  img.replaceWith(placeholder);
};

/**
 * Renders menu items into the grid based on the current filters
 */
function renderMenu(items) {
  const grid = document.getElementById("menuGrid");
  if (!grid) return;

  grid.innerHTML = items
    .map((item, index) => {
      let cleanName = item.name.split("(")[0].trim();
      const folderName = item.originalCategory || item.uiCategory;
      const imagePath = `./images/${folderName}/${cleanName}.webp`;

      // Badge Logic
      const nameUpper = item.name.toUpperCase();
      const isGF = nameUpper.includes("(GF)");
      const isSpicy = nameUpper.includes("SPICY") || nameUpper.includes("HOT");

      return `
        <div onclick="openMenuModal(${index})" class="menu-item cursor-pointer transition border-l-4 rounded bg-smoke border-primary hover:scale-[1.01] overflow-hidden group shadow-lg relative">

          <div class="absolute top-2 left-2 z-30 flex flex-col gap-1">
             ${isGF ? '<span class="bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md">GF</span>' : ""}
             ${isSpicy ? '<span class="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase flex items-center italic"><i class="fa-solid fa-pepper-hot mr-1"></i>Spicy</span>' : ""}
          </div>

          <div class="aspect-video bg-black/20 relative overflow-hidden flex items-center justify-center">
            <img
              src="${imagePath}"
              loading="lazy"
              class="absolute inset-0 object-cover w-full h-full opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              onerror="handleImageError(this)"
            />

            <button
              onclick="event.stopPropagation(); ${item.options ? `openMenuModal(${index})` : `handleQuickAdd(${index})`}"
              class="absolute bottom-3 right-3 z-40 h-10 w-10 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-amber-600 active:scale-90 transition-all"
            >
              <i class="fa-solid ${item.options ? "fa-ellipsis" : "fa-plus"}"></i>
            </button>
          </div>

          <div class="p-4">
            <div class="flex items-start justify-between gap-2">
              <h3 class="text-md font-display tracking-wide uppercase leading-tight">${item.name}</h3>
              <span class="font-bold text-primary whitespace-nowrap">${item.price || ""}</span>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  window.currentRenderedItems = items;
}

/**
 * Modal Logic
 */
window.openMenuModal = function (index) {
  const item = window.currentRenderedItems[index];
  const modal = document.getElementById("menuModal");
  if (!modal) return;

  const cleanName = item.name.split("(")[0].trim();
  const folderName = item.originalCategory || item.uiCategory;
  const modalImg = document.getElementById("modalImage");

  // 1. Reset Modal State
  // This prevents the previous item's image from showing while the new one loads
  modalImg.classList.remove("hidden");

  // 2. Set Basic Content
  document.getElementById("modalTitle").textContent = item.name;
  document.getElementById("modalDescription").textContent =
    item.description || "Authentic Smokehouse flavor.";

  // 3. Image Handling with Error Fallback
  // We define the error handler BEFORE setting the src
  modalImg.onerror = function () {
    this.src = "./images/placeholder-bbq.webp";
    // If you prefer to hide the image area entirely when missing, use:
    // this.classList.add('hidden');
  };
  modalImg.src = `./images/${folderName}/${cleanName}.webp`;

  // 4. Price & Options Logic
  const priceContainer = document.getElementById("modalPrice");
  const existingOptions = document.getElementById("price-options");
  if (existingOptions) existingOptions.remove();

  if (item.options && item.options.length > 0) {
    priceContainer.textContent = "Select Size";
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

    document.getElementById("modalDescription").after(optionsDiv);
  } else {
    priceContainer.textContent = item.price || "";
  }

  // 5. Add to Order Action
  document.getElementById("modalAddBtn").onclick = () => {
    let selectedOption = null;
    if (item.options) {
      const selectedIndex = document.querySelector(
        'input[name="menu-option"]:checked',
      ).value;
      selectedOption = item.options[selectedIndex];
    }

    // Add to list and close
    addToOrderList(item, selectedOption);
    closeMenuModal();
  };

  // 6. Show Modal
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
};

window.closeMenuModal = function () {
  document.getElementById("menuModal").classList.add("hidden");
  document.body.style.overflow = "";
};

// Helper for quick add (plus button on card)
window.handleQuickAdd = function (index) {
  const item = window.currentRenderedItems[index];
  addToOrderList(item);
};

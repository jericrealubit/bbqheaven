import { categoryMap } from "./config.js";
import { addToOrderList } from "./order-system.js";

// 1. Module-level variables
let fullMenu = [];
let currentCategory = "all";

window.setCategory = function (cat, element) {
  currentCategory = cat;

  // UI: Reset all buttons to the "inactive" glass state
  document.querySelectorAll(".cat-btn").forEach((btn) => {
    btn.classList.remove("active-cat", "bg-primary", "text-white", "scale-105");
    btn.classList.add("bg-white/5", "text-gray-400");
  });

  // Apply the active state to the current selection
  let targetBtn = element;
  if (!targetBtn) {
    targetBtn = Array.from(document.querySelectorAll(".cat-btn")).find((btn) =>
      btn.getAttribute("onclick")?.includes(`'${cat}'`),
    );
  }

  if (targetBtn) {
    targetBtn.classList.add(
      "active-cat",
      "bg-primary",
      "text-white",
      "scale-105",
    );
    targetBtn.classList.remove("bg-white/5", "text-gray-400");
  }

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
 * Fetches menu data from JSON files and flattens based on keys
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
      // Logic adjusted for Object keys (starters, mains, etc.)
      for (const [categoryKey, items] of Object.entries(source)) {
        if (!Array.isArray(items)) continue;

        items.forEach((item) => {
          fullMenu.push({
            ...item,
            originalCategory: categoryKey,
            uiCategory: categoryMap[categoryKey] || "other",
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
 * Image error handler with SVG Sketch fallbacks
 */
window.handleImageError = function (img) {
  const pathParts = img.src.split("/");
  const folder = (pathParts[pathParts.length - 2] || "").toLowerCase();

  const isDrink =
    folder.includes("wine") ||
    folder.includes("beer") ||
    folder.includes("spirit");

  const sketchContainer = document.createElement("div");
  sketchContainer.className =
    "flex flex-col items-center justify-center w-full h-full bg-[#1a1a1a] text-primary/20 border border-white/5";

  const foodSketch = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="w-16 h-16 mb-2 opacity-40"><path d="M3 11h18M5 11V7a3 3 0 013-3h8a3 3 0 013 3v4M4 11v1a8 8 0 0016 0v-1M9 19v1M15 19v1"/></svg>`;
  const drinkSketch = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="w-16 h-16 mb-2 opacity-40"><path d="M7 3h10l-1 9h-8l-1-9zM7 3L5 21h14l-2-18M9 21v-4M15 21v-4"/></svg>`;

  sketchContainer.innerHTML = `${isDrink ? drinkSketch : foodSketch}
    <span class="text-[8px] uppercase tracking-[0.4em] font-black opacity-30 italic">BBQ Heaven</span>`;

  img.replaceWith(sketchContainer);
};

/**
 * Renders items with Badge Logic and 10px Glass Border compatibility
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

      // Updated Spicy Logic:
      // Checks for "SPICY" or "HOT", but explicitly ignores "HOT POT"
      const isSpicy =
        (nameUpper.includes("SPICY") ||
          nameUpper.includes("HOT") ||
          nameUpper.includes("JALAPENO")) &&
        !nameUpper.includes("HOT POT");

      const isBBQTable = item.originalCategory === "bbq_table";

      return `
        <div onclick="openMenuModal(${index})" class="menu-item cursor-pointer overflow-hidden group shadow-lg relative">

          <div class="absolute top-4 left-4 z-30 flex flex-col gap-1">
             ${isGF ? '<span class="bg-green-600/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md backdrop-blur-sm">GF</span>' : ""}
             ${isSpicy ? '<span class="bg-red-600/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase flex items-center italic backdrop-blur-sm"><i class="fa-solid fa-pepper-hot mr-1"></i>Spicy</span>' : ""}
             ${isBBQTable ? '<span class="bg-amber-600/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase backdrop-blur-sm">Shared Feast</span>' : ""}
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
              <h3 class="text-md font-display tracking-wide uppercase leading-tight text-white">${item.name}</h3>
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
 * Modal Logic (Opening)
 */
window.openMenuModal = function (index) {
  const item = window.currentRenderedItems[index];
  const modal = document.getElementById("menuModal");
  if (!modal) return;

  const cleanName = item.name.split("(")[0].trim();
  const folderName = item.originalCategory || item.uiCategory;
  const modalImg = document.getElementById("modalImage");

  modalImg.classList.remove("hidden");
  const existingSketch = modal.querySelector(".modal-sketch-placeholder");
  if (existingSketch) existingSketch.remove();

  document.getElementById("modalTitle").textContent = item.name;
  document.getElementById("modalDescription").textContent =
    item.description || "Authentic Smokehouse flavor.";

  modalImg.onerror = function () {
    this.classList.add("hidden");
    const isDrink =
      folderName.toLowerCase().includes("wine") ||
      folderName.toLowerCase().includes("beer") ||
      folderName.toLowerCase().includes("spirit");

    const sketchContainer = document.createElement("div");
    sketchContainer.className =
      "modal-sketch-placeholder flex flex-col items-center justify-center w-full aspect-video bg-[#1a1a1a] text-primary/20 border border-white/5 rounded-lg mb-4";

    const foodSketch = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="w-24 h-24 mb-2 opacity-40"><path d="M3 11h18M5 11V7a3 3 0 013-3h8a3 3 0 013 3v4M4 11v1a8 8 0 0016 0v-1M9 19v1M15 19v1"/></svg>`;
    const drinkSketch = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="w-24 h-24 mb-2 opacity-40"><path d="M7 3h10l-1 9h-8l-1-9zM7 3L5 21h14l-2-18M9 21v-4M15 21v-4"/></svg>`;

    sketchContainer.innerHTML = `${isDrink ? drinkSketch : foodSketch}
      <span class="text-[10px] uppercase tracking-[0.4em] font-black opacity-30 italic">BBQ Heaven</span>`;

    this.parentElement.insertBefore(sketchContainer, this);
  };

  modalImg.src = `./images/${folderName}/${cleanName}.webp`;

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

  document.getElementById("modalAddBtn").onclick = () => {
    let selectedOption = null;
    if (item.options) {
      const selectedIndex = document.querySelector(
        'input[name="menu-option"]:checked',
      ).value;
      selectedOption = item.options[selectedIndex];
    }
    addToOrderList(item, selectedOption);
    closeMenuModal();
  };

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
};

window.closeMenuModal = function () {
  document.getElementById("menuModal").classList.add("hidden");
  document.body.style.overflow = "";
};

window.handleQuickAdd = function (index) {
  const item = window.currentRenderedItems[index];
  addToOrderList(item);
};

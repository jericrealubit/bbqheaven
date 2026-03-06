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
 * Helper to handle missing images with an animated placeholder
 */
window.handleImageError = function (img) {
  const container = img.parentElement;
  // Replace the image with an animated "No Image" UI
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center w-full h-full bg-black/40 text-gray-600">
      <i class="fa-solid fa-image text-4xl mb-2 animate-pulse"></i>
      <span class="text-[10px] uppercase tracking-widest font-bold opacity-50">Image coming soon</span>
    </div>
  `;
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
      //const imagePath = `./images/${folderName}/${cleanName}-th.jpg`;
      const imagePath = `./images/${folderName}/${cleanName}.webp`;

      const nameUpper = item.name.toUpperCase();
      const descUpper = (item.description || "").toUpperCase();

      const isGF = nameUpper.includes("(GF)");
      const isSpicy =
        nameUpper.includes("HOT") ||
        nameUpper.includes("SPICY") ||
        descUpper.includes("SPICY");
      const isFamily = nameUpper.includes("FAMILY");

      return `
        <div onclick="openMenuModal(${index})" class="menu-item cursor-pointer transition border-l-4 rounded bg-smoke border-primary hover:scale-[1.02] overflow-hidden group shadow-lg relative">

          <div class="absolute top-2 left-2 z-10 flex flex-col gap-1">
             ${isGF ? '<span class="bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md">GF</span>' : ""}
             ${isSpicy ? `<span class="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase flex items-center italic"><i class="fa-solid fa-pepper-hot mr-1"></i>Spicy</span>` : ""}
             ${isFamily ? '<span class="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase italic">Family</span>' : ""}
          </div>

          <div class="aspect-video bg-black/40 relative overflow-hidden flex items-center justify-center">
            <img
              src="${imagePath}"
              class="absolute inset-0 object-cover w-full h-full opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
              onerror="handleImageError(this)"
            />

            <button
              onclick="event.stopPropagation(); ${item.options ? `openMenuModal(${index})` : `handleQuickAdd(${index})`}"
              class="absolute bottom-3 right-3 z-20 h-10 w-10 bg-primary text-white rounded-full shadow-xl flex items-center justify-center hover:bg-amber-600 transition-colors"
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

/**
 * Modal Logic
 */
window.openMenuModal = function (index) {
  const item = window.currentRenderedItems[index];
  const modal = document.getElementById("menuModal");
  if (!modal) return;

  let cleanName = item.name.split("(")[0].trim();
  const folderName = item.originalCategory || item.uiCategory;

  // document.getElementById("modalImage").src =
  //   `./images/${folderName}/${cleanName}.jpg`;
  // This remains the same as it already points to the full image
  document.getElementById("modalImage").src =
    `./images/${folderName}/${cleanName}.webp`;
  document.getElementById("modalTitle").textContent = item.name;
  document.getElementById("modalDescription").textContent =
    item.description || "Authentic Smokehouse flavor.";

  const priceContainer = document.getElementById("modalPrice");

  // Clean up old options
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

  // Set the "Add to Order" button action
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

// Helper for quick add (plus button on card)
window.handleQuickAdd = function (index) {
  const item = window.currentRenderedItems[index];
  addToOrderList(item);
};

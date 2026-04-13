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
      for (const [categoryKey, items] of Object.entries(source)) {
        if (!Array.isArray(items)) continue;

        items.forEach((item) => {
          // --- UPDATED LOGIC START ---
          let targetUiCategory = categoryMap[categoryKey] || "other";

          // Force BBQ Table items to appear in the Mains section
          if (categoryKey === "bbq_table") {
            targetUiCategory = "mains";
          }
          // --- UPDATED LOGIC END ---

          fullMenu.push({
            ...item,
            originalCategory: categoryKey,
            uiCategory: targetUiCategory,
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
      // Get the folder based on your loadMenu logic
      const folderName = item.originalCategory || item.uiCategory;

      // FIX: Use the ABSOLUTE name from the JSON.
      // Do not split by "(" or "," because your files have those in the name.
      let fileName = item.name.trim();

      const imagePath = `./images/${folderName}/${fileName}.webp`;

      // Badge Logic
      const nameUpper = item.name.toUpperCase();

      // 1. Standard Badges
      const isGF = nameUpper.includes("(GF)");
      const isSpicy =
        (nameUpper.includes("SPICY") ||
          nameUpper.includes("HOT") ||
          nameUpper.includes("JALAPENO")) &&
        !nameUpper.includes("HOT POT");

      // 2. Specialized Badges
      const isBBQTable =
        item.originalCategory === "bbq_table" ||
        nameUpper.includes("BBQ TABLE");
      const isNoSharing = nameUpper.includes("NO SHARING");
      const isFamilyShare = nameUpper.includes("FAMILY TO SHARE");

      return `
        <div onclick="openMenuModal(${index})"
             class="menu-item cursor-pointer overflow-hidden group shadow-lg relative
                    transition-all duration-300 ease-out
                    hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(217,119,6,0.3)]
                    border border-white/5 hover:border-amber-500/50">

          <div class="absolute top-4 left-4 z-30 flex flex-col gap-1.5">
             ${isGF ? '<span class="bg-green-600/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md backdrop-blur-sm">GF</span>' : ""}

             ${isSpicy ? '<span class="bg-red-600/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase flex items-center italic backdrop-blur-sm"><i class="fa-solid fa-pepper-hot mr-1"></i>Spicy</span>' : ""}

             ${isBBQTable ? '<span class="bg-amber-500 text-black text-[10px] font-black px-2 py-1 rounded shadow-md uppercase backdrop-blur-sm">BBQ Table</span>' : ""}

             ${isFamilyShare ? '<span class="bg-blue-600/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase backdrop-blur-sm">Family to Share</span>' : ""}

             ${isNoSharing ? '<span class="bg-zinc-800/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase backdrop-blur-sm">No Sharing</span>' : ""}
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
  if (!modal || !item) return;

  // --- FIX START: Match filename exactly to JSON name ---
  // We remove the split("(") and split(",") logic so it finds the full filename.
  let fileName = item.name.trim();
  const folderName = item.originalCategory || item.uiCategory;
  // --- FIX END ---

  const modalImg = document.getElementById("modalImage");

  // Reset Modal State
  modalImg.classList.remove("hidden");
  const existingSketch = modal.querySelector(".modal-sketch-placeholder");
  if (existingSketch) existingSketch.remove();

  document.getElementById("modalTitle").textContent = item.name;
  document.getElementById("modalDescription").textContent =
    item.description || "Authentic Smokehouse flavor.";

  // Error Handler for missing images
  modalImg.onerror = function () {
    this.classList.add("hidden");
    const nameUpper = item.name.toUpperCase();
    const folderLower = folderName.toLowerCase();

    const isDrink =
      folderLower.includes("wine") ||
      folderLower.includes("beer") ||
      folderLower.includes("spirit") ||
      folderLower.includes("drinks") ||
      nameUpper.includes("JUICE") ||
      nameUpper.includes("COCKTAIL");

    const sketchContainer = document.createElement("div");
    sketchContainer.className =
      "modal-sketch-placeholder flex flex-col items-center justify-center w-full aspect-video bg-[#1a1a1a] text-primary/20 border border-white/5 rounded-lg mb-4";

    const foodSketch = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="w-24 h-24 mb-2 opacity-40"><path d="M3 11h18M5 11V7a3 3 0 013-3h8a3 3 0 013 3v4M4 11v1a8 8 0 0016 0v-1M9 19v1M15 19v1"/></svg>`;
    const drinkSketch = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="w-24 h-24 mb-2 opacity-40"><path d="M7 3h10l-1 9h-8l-1-9zM7 3L5 21h14l-2-18M9 21v-4M15 21v-4"/></svg>`;

    sketchContainer.innerHTML = `${isDrink ? drinkSketch : foodSketch}
      <span class="text-[10px] uppercase tracking-[0.4em] font-black opacity-30 italic">BBQ Heaven</span>`;

    this.parentElement.insertBefore(sketchContainer, this);
  };

  // Set Source using the exact JSON name
  modalImg.src = `./images/${folderName}/${fileName}.webp`;

  // Price & Options Handling
  const priceContainer = document.getElementById("modalPrice");
  const existingOptions = document.getElementById("price-options");
  if (existingOptions) existingOptions.remove();

  if (item.options && item.options.length > 0) {
    priceContainer.textContent = "Select Size";
    const optionsDiv = document.createElement("div");
    optionsDiv.id = "price-options";
    optionsDiv.className = "flex flex-wrap gap-3 mb-6";
    optionsDiv.innerHTML = item.options
      .map(
        (opt, i) => `
      <label class="flex-1 min-w-[100px]">
        <input type="radio" name="menu-option" value="${i}" class="hidden peer" ${i === 0 ? "checked" : ""}>
        <div class="cursor-pointer text-center py-3 border border-white/10 rounded-lg peer-checked:border-primary peer-checked:bg-primary/10 transition-all">
          <div class="text-[10px] uppercase text-gray-400">${opt.label}</div>
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

  // Add to Order Logic
  document.getElementById("modalAddBtn").onclick = () => {
    let selectedOption = null;
    if (item.options) {
      const checkedInput = document.querySelector(
        'input[name="menu-option"]:checked',
      );
      if (checkedInput) {
        selectedOption = item.options[checkedInput.value];
      }
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
